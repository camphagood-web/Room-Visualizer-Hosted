from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import StreamingResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO

# Try to import pillow-heif for HEIC/HEIF support
try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
    HEIF_SUPPORT = True
    print("[Server] HEIC/HEIF format support enabled")
except ImportError:
    HEIF_SUPPORT = False
    print("[Server] Warning: pillow-heif not installed. HEIC/HEIF formats will not be supported.")
    print("[Server] Install with: pip install pillow-heif")


# Load environment variables
load_dotenv()

app = FastAPI()

# CORS Configuration
origins = [
    "http://localhost:5173",
    os.getenv("FRONTEND_URL", ""), # Allow frontend URL from env
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
NANO_BANANA_API_KEY = os.getenv("NANO_BANANA_API_KEY")
MOCK_MODE = False  # Set to False to use actual API

# Supported aspect ratios by Nano Banana API
SUPPORTED_ASPECT_RATIOS = [
    "1:1", "16:9", "9:16", "4:3", "3:4", 
    "3:2", "2:3", "5:4", "4:5", "21:9"
]
DEFAULT_ASPECT_RATIO = "16:9"

if not MOCK_MODE and not NANO_BANANA_API_KEY:
    print("Warning: NANO_BANANA_API_KEY not found in environment variables.")

# Initialize GenAI Client
client = None
if not MOCK_MODE and NANO_BANANA_API_KEY:
    client = genai.Client(api_key=NANO_BANANA_API_KEY)

@app.post("/convert-image")
async def convert_image(file: UploadFile = File(...)):
    try:
        # Read image data
        img_data = await file.read()
        
        # Open image (pillow-heif handles HEIC automatically if registered)
        img = Image.open(BytesIO(img_data))
        
        # Convert to RGB (in case of RGBA or other modes)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
            
        # Save as JPEG
        output_buffer = BytesIO()
        img.save(output_buffer, format="JPEG", quality=85)
        output_buffer.seek(0)
        
        return Response(content=output_buffer.getvalue(), media_type="image/jpeg")
    except Exception as e:
        print(f"[Server] Error converting image: {e}")
        return Response(content=f"Error: {str(e)}", status_code=500)

@app.post("/generate-floor")
async def generate_floor(
    room_image: UploadFile = File(...),
    floor_sample: UploadFile = File(...),
    aspect_ratio: str = Form(DEFAULT_ASPECT_RATIO)
):
    try:
        # Validate and sanitize aspect ratio
        if aspect_ratio not in SUPPORTED_ASPECT_RATIOS:
            print(f"[Server] Invalid aspect ratio '{aspect_ratio}' received. Using default: {DEFAULT_ASPECT_RATIO}")
            aspect_ratio = DEFAULT_ASPECT_RATIO
        else:
            print(f"[Server] Using aspect ratio: {aspect_ratio}")
        
        # Read images
        room_img_data = await room_image.read()
        
        if MOCK_MODE:
            # In mock mode, just return the original room image
            print("[Server] Running in MOCK_MODE - returning original image")
            return Response(content=room_img_data, media_type="image/png")

        floor_img_data = await floor_sample.read()
        
        room_pil = Image.open(BytesIO(room_img_data))
        floor_pil = Image.open(BytesIO(floor_img_data))

        print(f"[Server] Room image dimensions: {room_pil.size}")
        print(f"[Server] Floor sample dimensions: {floor_pil.size}")
        print(f"[Server] Generating with aspect ratio: {aspect_ratio}")

        prompt = """
        Task: Realistic Floor Replacement.
        Input 1: A photo of a room with an existing floor (which may be wood, concrete, tile, or carpet).
        Input 2: A texture sample of a new flooring (which may be wood or rubber).

        Instructions:
        1. Identify the floor area in Input 1. accurately using perspective.
        2. Replace the material of the floor in Input 1 with the texture from Input 2.
        3. CRITICAL: Preserve all original lighting, shadows, and reflections from Input 1. The new wood must appear to be under the same lighting conditions.
        4. CRITICAL: Do not cover, add, or alter any furniture, rugs rug edges, baseboards, or decor items sitting on the floor. Mask them out perfectly.
        5. CRITICAL: Do not alter or add any elements other than the floor within the image.
        6. If the sample is wood planks, orient the wood planks to flow with the room's main perspective lines (vanishing point).
        7. Ensure the wood grain scale or sample pattern matches the scale of the room.

        Output: A photorealistic image of the room with the new flooring.
        """
        
        response = client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=[room_pil, floor_pil, prompt],
            config=types.GenerateContentConfig(
                image_config=types.ImageConfig(
                    aspect_ratio=aspect_ratio
                )
            )
        )
        
        print(f"[Server] Image generation successful with aspect ratio: {aspect_ratio}")
        
        # Extract image from response
        # Based on provided snippet logic
        image_parts = [
            part.inline_data.data
            for part in response.candidates[0].content.parts
            if part.inline_data
        ]

        if image_parts:
            # Return the generated image
            return Response(content=image_parts[0], media_type="image/png")
        else:
            print("[Server] Error: No image parts in response")
            return Response(content=room_img_data, media_type="image/png", status_code=500) # Fallback

    except Exception as e:
        print(f"[Server] Error generating floor: {e}")
        return Response(content=f"Error: {str(e)}", status_code=500)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
