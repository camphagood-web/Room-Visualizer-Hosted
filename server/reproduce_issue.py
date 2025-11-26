import requests
import os

# Paths to images
ROOM_IMAGE_PATH = r"c:\Users\user\Desktop\Floor Vizualizer v2\floor-visualizer-v2\server\test_output.png"
FLOOR_IMAGE_PATH = r"c:\Users\user\Desktop\Floor Vizualizer v2\floor-visualizer-v2\client\samples\Workplace\Visionary\1SP16603.png"

URL = "http://localhost:8000/generate-floor"

def reproduce():
    if not os.path.exists(ROOM_IMAGE_PATH):
        print(f"Room image not found at {ROOM_IMAGE_PATH}")
        return
    if not os.path.exists(FLOOR_IMAGE_PATH):
        print(f"Floor image not found at {FLOOR_IMAGE_PATH}")
        return

    files = {
        'room_image': ('room.png', open(ROOM_IMAGE_PATH, 'rb'), 'image/png'),
        'floor_sample': ('floor.png', open(FLOOR_IMAGE_PATH, 'rb'), 'image/png')
    }

    print(f"Sending request to {URL}...")
    try:
        response = requests.post(URL, files=files)
        print(f"Status Code: {response.status_code}")
        try:
            print("Response JSON:", response.json())
        except:
            print("Response Text:", response.text[:500]) # Print first 500 chars
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    reproduce()
