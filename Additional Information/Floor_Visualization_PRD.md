# Product Requirements Document (PRD)
## Floor Visualization Software - V2.0

**Document Version:** 1.0  
**Last Updated:** November 10, 2025  
**Product Manager:** [Your Name]  
**Target Deployment:** Local Python HTTP Server

---

## Executive Summary

This PRD outlines the requirements for a comprehensive floor visualization web application for a flooring distributor. The application enables customers to visualize different flooring products in their own rooms or pre-loaded demo rooms using Google's Nano Banana API for image generation. The application supports a full product catalog with filtering, favorites management, side-by-side comparison, and a mobile-first responsive design.

---

## Product Overview

### Purpose
Enable flooring showroom customers and online browsers to visualize flooring products in realistic room settings, facilitating informed purchase decisions.

### Key Features
- Interactive floor visualization using AI-generated imagery
- Comprehensive product catalog with hierarchical organization
- Advanced filtering and search capabilities
- Favorites/wishlist management
- Before/after comparison with interactive slider
- Demo room gallery for quick exploration
- Mobile-responsive design

### Target Users
- Showroom customers browsing flooring options with sales associates
- Online users on the 20 and Oak website
- Residential and commercial customers

---

## User Personas

### Persona 1: Showroom Customer
- **Environment:** In-store with tablet/iPad
- **Goal:** Visualize multiple flooring options in their actual room
- **Behavior:** Wants quick comparisons, easy favorites management, and ability to share selections

### Persona 2: Online Browser
- **Environment:** Home on mobile/desktop
- **Goal:** Explore options before visiting showroom
- **Behavior:** Uses demo rooms initially, may upload own photos, saves favorites for later

---

## User Journey & Core Flows

### Flow 1: Landing Page → Demo Room Visualization
1. User arrives at landing page
2. Sees grid of demo room images with descriptive titles
3. Clicks a demo room
4. Room auto-loads into visualization interface
5. User selects flooring samples to visualize
6. Sees instant before/after results from pre-generated gallery

### Flow 2: Custom Room Upload → Visualization
1. User clicks "Upload" button from landing or navigation
2. Uploads room photo
3. Selects flooring sample from catalog
4. API generates visualization (with loading animation)
5. Result is cached for instant re-selection
6. User can compare, download, or favorite

### Flow 3: Product Discovery
1. User opens left sidebar
2. Navigates hierarchy: BRAND → Collection → ProductName
3. Applies filters (price, color, species, etc.)
4. Views product thumbnails (grid or list)
5. Clicks thumbnail for detailed specifications
6. Selects product to visualize

---

## Functional Requirements

### 1. Landing Page (Homepage)

#### 1.1 Demo Room Gallery
- **Display:** Grid layout of demo room images
- **Image Source:** `/demo_rooms/` directory on backend
- **Metadata:** Each room has descriptive title below image
- **Interaction:** Clicking room image navigates to visualization interface with room pre-loaded
- **Room Categories:** Kitchen, Bathroom, Living Room, Bedroom, Dining Room, Office, Outdoor Deck, etc.
- **Responsive:** Grid adjusts to 4 columns (desktop), 3 columns (tablet), 2 columns (mobile)

#### 1.2 Primary Actions
- Large "Upload Your Room" button above demo gallery
- Company logo prominently displayed at top
- Navigation to different sections

#### 1.3 User Guidance
- Brief instructional text: "See products in your room"
- Secondary text: "Upload a picture of your room" or "Try our demo rooms instead"

---

### 2. Top Navigation Bar

#### 2.1 Navigation Elements (Left to Right)
1. **Exit** - Returns to landing page, clears current session
2. **Compare** - Toggles before/after slider on visualization
3. **Zoom** - Enlarges image to fullscreen view
4. **Share** - (Future: share link or image)
5. **Download** - Downloads current visualization
6. **Upload** - Opens file picker for room photo
7. **Bookmarks** - Opens favorites/wishlist panel
8. **Menu** - (Hamburger menu on mobile)

#### 2.2 Logo Placement
- Company logo on far left (clickable, returns to home)
- Logo source: `/assets/logo.png`

#### 2.3 Responsive Behavior
- Desktop: All items visible
- Tablet: Some items in overflow menu
- Mobile: Most items in hamburger menu, keep Upload and Bookmarks visible

---

### 3. Left Sidebar - Product Catalog

#### 3.1 Tab Structure
- **Floors Tab** (active) - Only tab functional in this version
- **Rugs Tab** (disabled/greyed out) - Placeholder for future
- **Countertops Tab** (disabled/greyed out) - Placeholder for future
- **Walls Tab** (disabled/greyed out) - Placeholder for future

#### 3.2 Hierarchical Navigation
- **Level 1: BRAND** (Top-level category)
  - Dropdown or expandable list
  - Derived from unique values in CSV "BRAND" column
  
- **Level 2: Collection** (Middle category)
  - Displayed after brand selection
  - Filtered by selected brand
  - Derived from "Collection" column
  
- **Level 3: ProductName** (Individual products)
  - Displayed after collection selection
  - Shows product thumbnails
  - Derived from "ProductName" column

#### 3.3 Filter Panel
- Collapsible "Filters" section with icon
- **Filter Categories** (based on CSV columns with complete data):
  - ProductPriceFilter ($ | $$ | $$$)
  - ProductColor
  - ProductShade (Light | Medium | Dark)
  - ProductSpecies (Oak, Hickory, etc.)
  - ProductLook (Wood | Pattern | Stone | Concrete)
  - ProductType (Hardwood, Vinyl, LVT, etc.)
  - ProductWidth
  - ProductLength
  - ProductThickness
  - ProductInstallType
  - ProductFinish
  - ProductGlossLevel
  - ProductWaterproof (Boolean)
  - ProductTexture
  - Room suitability (Living Room, Bedroom, Kitchen, Bathroom, Pets, Children, High Traffic)

- **Filter UI:**
  - Checkboxes for multi-select categories
  - Dropdowns for single-select categories
  - "Clear All Filters" button
  - Active filter count badge

#### 3.4 View Toggle
- Grid view (default) - Shows larger thumbnails in grid
- List view - Shows compact list with thumbnail + name + key specs

#### 3.5 Product Thumbnail Display
- **Grid View:** 2-3 columns of product cards
  - Product image (placeholder if missing)
  - ProductName
  - Collection name (smaller text)
  - Price ($ | $$ | $$$)
  - Heart icon for favorites
  - Click to see details
  
- **List View:** Single column
  - Thumbnail + ProductName + Collection + Price + Heart icon

#### 3.6 Product Detail Modal
When user clicks product thumbnail:
- **Display Specifications** (all non-empty CSV columns):
  - ProductName (Header)
  - Collection & BRAND
  - SKUNumber
  - ProductPrice / SKUPrice
  - ProductSize (Width x Length)
  - ProductStructure
  - ProductType
  - ProductSpecies
  - ProductColor
  - ProductThickness
  - ProductInstallType
  - ProductSqFtPerBox
  - ProductWarranty
  - ProductBevel
  - ProductTexture
  - ProductFinish
  - ProductWaterproof
  - ProductWearlayer
  - ProductGlossLevel
  - Room Suitability icons (Living, Bedroom, Kitchen, Bathroom, Pets, Children, High Traffic)
  
- **Actions in Modal:**
  - "Visualize This Product" button (primary)
  - "Add to Favorites" button
  - Close button (X)

---

### 4. Main Viewing Area

#### 4.1 Dual-Pane Layout (Side-by-Side)
- **Left Pane:** Original Room Image
  - Label: "Original"
  - Displays uploaded or demo room image
  
- **Right Pane:** Generated Visualization
  - Label: "With [ProductName]"
  - Displays AI-generated floor visualization
  - Shows placeholder text when no product selected

#### 4.2 Compare Mode (Slider)
When "Compare" button activated:
- Single image view with vertical slider overlay
- Dragging slider reveals before (left) / after (right)
- Slider has a draggable handle with icon
- Tap/click to toggle slider position
- "Exit Compare" button to return to side-by-side

#### 4.3 Zoom Functionality
- Click "Zoom" button or click image
- Opens fullscreen modal with high-res image
- Pinch-to-zoom on mobile
- Close button (X) to exit

#### 4.4 Loading States
- **Initial State:** Placeholder with icon and text
  - "Upload a room photo or select a demo room to begin"
  
- **Product Selection State:** 
  - "Select a flooring sample to visualize"
  
- **Loading State (API Call):**
  - Smooth animated spinner
  - Progress message: "Generating your floor visualization..."
  - Estimated time: "This may take 30-60 seconds"
  - Animated gradient background for visual interest
  
- **Error State:**
  - Friendly error message
  - "Try Again" button
  - Suggestion to check connection or try different image

---

### 5. Gallery Mode (Demo Rooms)

#### 5.1 Pre-Generated Visualizations
- When demo room selected, user enters "Gallery Mode"
- Gallery contains pre-generated images for ALL products in catalog applied to selected demo room
- Images stored in: `/demo_rooms/[room_name]/[BRAND]/[Collection]/[ProductName].jpg`

#### 5.2 Interaction
- When user selects product from sidebar, corresponding pre-generated image displays instantly
- No API call needed
- Before/after comparison still available
- Enables rapid product comparison

#### 5.3 Gallery Generation (Out of Scope for This PRD)
- Note: Separate batch script will generate gallery images
- Uses batch API calls to generate all product/room combinations
- This PRD focuses on displaying pre-generated images

---

### 6. Custom Photo Mode

#### 6.1 Upload Functionality
- File input accepts: JPG, JPEG, PNG
- Maximum file size: 10MB
- Image preview before processing
- Image stored in browser memory (not uploaded to server)

#### 6.2 API-Powered Visualization
- User selects product from catalog
- API called with:
  - User's room photo (base64)
  - Selected flooring sample (base64)
  - Generation prompt
- Loading animation displays during generation (30-60 seconds)
- Result cached in browser memory

#### 6.3 Caching Logic
- Cache key: `uploaded_room_[timestamp]_[ProductName]`
- Maximum 20 cached images
- LRU (Least Recently Used) eviction when limit reached
- Cache persists during browser session
- Cache cleared when:
  - User uploads new room photo
  - User clicks "Exit" to return to landing page
  - Browser/tab closed

---

### 7. Favorites / Wishlist

#### 7.1 Adding Favorites
- Heart icon on each product thumbnail
- Click to add/remove from favorites
- Visual feedback (filled heart vs outline)
- Toast notification: "Added to favorites" / "Removed from favorites"

#### 7.2 Favorites Panel
- Accessed via "Bookmarks" button in top nav
- Slide-out panel from right side
- Shows all favorited products with thumbnails
- Each favorite shows:
  - Product thumbnail
  - ProductName
  - Collection
  - "Visualize" button
  - "Remove" button (X)

#### 7.3 Persistence
- Favorites stored in localStorage
- Persist across browser sessions
- Export favorites feature (future consideration)

---

### 8. Download Functionality

#### 8.1 Download Options
When "Download" button clicked:
- Download current visualization (right pane image)
- Filename format: `floor-viz-[ProductName]-[timestamp].png`
- High resolution (maintain original API output quality)

#### 8.2 Future Enhancement
- Download both before/after as combined image
- Download with product details overlay
- Download as PDF with product specifications

---

## Technical Requirements

### 9. Technology Stack

#### 9.1 Frontend
- **Pure HTML/CSS/JavaScript** (no frameworks)
- Single self-contained `.html` file
- Embedded CSS in `<style>` tags
- Embedded JavaScript in `<script>` tags

#### 9.2 External Dependencies
- Google Fonts: Figtree (or similar clean sans-serif)
- Font Awesome or inline SVG icons for UI elements
- No jQuery or other libraries

#### 9.3 APIs
- Google Nano Banana API (Imagen 3)
- Endpoint: `https://generativelanguage.googleapis.com/v1/models/imagen-3.0-generate-001:generateContent`

#### 9.4 Deployment Environments
- **Local Development:** Python simple HTTP server (`python -m http.server 8000`)
- **Production:** Azure Static Web Apps or Azure Blob Storage (static website hosting)
- **Backend Proxy:** Azure Functions (Node.js or Python runtime)

---

### 10. File Structure & Organization

#### 10.1 Root Directory Structure
```
project_root/
├── floor_visualizer.html          # Main application file
├── config.json                     # Configuration file with API key
├── assets/
│   └── logo.png                    # Company logo
├── data/
│   └── products.csv                # Product catalog
├── demo_rooms/
│   ├── kitchen/
│   │   ├── kitchen.jpg             # Demo room original
│   │   ├── AHF Contract/
│   │   │   ├── Garden Oak/
│   │   │   │   └── Acorn Hat.jpg   # Pre-generated visualization
│   │   │   └── ...
│   │   └── ...
│   ├── bathroom/
│   ├── living-room/
│   ├── bedroom/
│   └── ...
└── samples/
    ├── [BRAND]/
    │   ├── [Collection]/
    │   │   ├── [ProductName].jpg   # Actual flooring sample image
    │   │   └── ...
    │   └── ...
    └── placeholder.jpg              # Placeholder for missing samples
```

#### 10.2 Config File (config.json)
```json
{
  "apiKey": "AIzaSyDhPmNlSHE2IpumnDtSnJhE0MVbDYa9VHs",
  "apiEndpoint": "https://generativelanguage.googleapis.com/v1/models/imagen-3.0-generate-001:generateContent",
  "maxCacheSize": 20,
  "supportedImageFormats": ["jpg", "jpeg", "png"],
  "maxUploadSize": 10485760
}
```

**Security Note:** Config file should NOT be committed to version control in production. Use `.gitignore` or environment-specific configuration.

---

### 11. Data Management

#### 11.1 Product Catalog Loading
- Load `products.csv` on application initialization
- Parse CSV into JavaScript object array
- Structure:
```javascript
{
  ProductName: "Acorn Hat",
  SKUNumber: "L7166977",
  Collection: "Garden Oak",
  BRAND: "AHF Contract",
  // ... all other columns
}
```

#### 11.2 Hierarchical Organization
- Build hierarchy dynamically from flat CSV data
- Structure:
```javascript
{
  "AHF Contract": {                    // BRAND (L1)
    "Garden Oak": {                    // Collection (L2)
      "Acorn Hat": { /* product obj */ } // ProductName (L3)
    }
  }
}
```

#### 11.3 Filtering Logic
- Filter products based on active filter selections
- AND logic within same filter category
- OR logic across different filter categories
- Update product display in real-time

#### 11.4 Placeholder Images
- Check for image existence: `/samples/[BRAND]/[Collection]/[ProductName].jpg`
- If not found, display: `/samples/placeholder.jpg`
- Placeholder should be generic flooring pattern image with "Image Coming Soon" text

---

### 12. API Integration

#### 12.1 Request Structure
```javascript
{
  contents: [{
    parts: [
      {
        inline_data: {
          mime_type: "image/jpeg",
          data: "[BASE64_ROOM_IMAGE]"
        }
      },
      {
        inline_data: {
          mime_type: "image/jpeg",
          data: "[BASE64_FLOORING_SAMPLE]"
        }
      },
      {
        text: "Create a professional, realistic interior visualization. Take the flooring pattern from the second image (the floor sample) and seamlessly apply it to replace the floor in the first image (the room photo). The new flooring should be laid in the same direction and orientation as the original floor and look natural with proper perspective, lighting, and shadows that match the room's environment. Maintain the exact same room layout, furniture, walls, and all other elements - only change the floor to match the flooring sample. Do not add or remove any furniture, rugs, chairs, or other room elements."
      }
    ]
  }],
  generationConfig: {
    temperature: 0.4,
    maxOutputTokens: 8192,
    responseModalities: ["IMAGE"],
    imageConfig: {
      aspectRatio: "16:9"  // or dynamic based on uploaded image
    }
  }
}
```

#### 12.2 Error Handling
- Network errors: Retry logic (2-3 attempts)
- API errors: Display user-friendly messages
- Rate limiting: Queue requests if needed
- Timeout: 90 second timeout with error message

#### 12.3 Response Processing
- Extract base64 image from response
- Convert to displayable format
- Cache result
- Update UI

---

### 12A. API Key Security & Azure Function Proxy

#### 12A.1 Security Challenge
When deploying to a public-facing Azure server, storing the API key in client-side code or config files exposes it to anyone who views the page source or network traffic. This creates security risks:
- Unauthorized API usage
- Quota exhaustion
- Potential cost overruns
- API key theft

#### 12A.2 Dual-Mode Architecture
The application will support two modes for seamless transition from development to production:

**Local Development Mode:**
- API key stored in `config.json`
- Direct API calls from browser to Nano Banana API
- Fast iteration and testing
- No backend required

**Production Mode (Azure):**
- API key stored securely in Azure Function environment variables
- Browser calls Azure Function proxy endpoint
- Azure Function forwards request to Nano Banana API
- API key never exposed to client

#### 12A.3 Configuration Structure

Update `config.json` to support both modes:

```json
{
  "mode": "local",
  "local": {
    "apiKey": "AIzaSyDhPmNlSHE2IpumnDtSnJhE0MVbDYa9VHs",
    "apiEndpoint": "https://generativelanguage.googleapis.com/v1/models/imagen-3.0-generate-001:generateContent"
  },
  "production": {
    "proxyEndpoint": "https://your-function-app.azurewebsites.net/api/generate-visualization"
  },
  "maxCacheSize": 20,
  "supportedImageFormats": ["jpg", "jpeg", "png"],
  "maxUploadSize": 10485760
}
```

#### 12A.4 Client-Side Implementation

The application will check the mode and route requests accordingly:

```javascript
async function callVisualizationAPI(roomImageBase64, sampleImageBase64) {
  const config = await loadConfig();
  
  if (config.mode === 'local') {
    // Direct API call for local testing
    return await fetch(`${config.local.apiEndpoint}?key=${config.local.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
  } else {
    // Proxy through Azure Function for production
    return await fetch(config.production.proxyEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomImage: roomImageBase64,
        sampleImage: sampleImageBase64
      })
    });
  }
}
```

#### 12A.5 Azure Function Proxy Specification

**Azure Function Details:**
- **Runtime:** Node.js 18 or Python 3.9+
- **Trigger:** HTTP POST
- **Authentication:** Anonymous (public) or API Key (recommended)
- **CORS:** Configure to allow requests from your domain

**Function Responsibilities:**
1. Receive visualization request from client
2. Validate input (file size, format)
3. Construct Nano Banana API request
4. Add API key from environment variables
5. Forward request to Nano Banana API
6. Return response to client
7. Log requests for monitoring

**Example Azure Function (Node.js):**

```javascript
// Azure Function: generate-visualization/index.js
module.exports = async function (context, req) {
    const NANO_BANANA_API_KEY = process.env.NANO_BANANA_API_KEY;
    const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models/imagen-3.0-generate-001:generateContent';
    
    // Validate request
    if (!req.body || !req.body.roomImage || !req.body.sampleImage) {
        context.res = {
            status: 400,
            body: { error: 'Missing required images' }
        };
        return;
    }
    
    try {
        // Construct API request
        const apiRequest = {
            contents: [{
                parts: [
                    {
                        inline_data: {
                            mime_type: "image/jpeg",
                            data: req.body.roomImage
                        }
                    },
                    {
                        inline_data: {
                            mime_type: "image/jpeg",
                            data: req.body.sampleImage
                        }
                    },
                    {
                        text: "Create a professional, realistic interior visualization. Take the flooring pattern from the second image (the floor sample) and seamlessly apply it to replace the floor in the first image (the room photo). The new flooring should be laid in the same direction and orientation as the original floor and look natural with proper perspective, lighting, and shadows that match the room's environment. Maintain the exact same room layout, furniture, walls, and all other elements - only change the floor to match the flooring sample. Do not add or remove any furniture, rugs, chairs, or other room elements."
                    }
                ]
            }],
            generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 8192,
                responseModalities: ["IMAGE"],
                imageConfig: {
                    aspectRatio: "16:9"
                }
            }
        };
        
        // Call Nano Banana API
        const response = await fetch(`${API_ENDPOINT}?key=${NANO_BANANA_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(apiRequest)
        });
        
        const data = await response.json();
        
        // Return response
        context.res = {
            status: response.status,
            headers: { 'Content-Type': 'application/json' },
            body: data
        };
        
    } catch (error) {
        context.log.error('Error calling Nano Banana API:', error);
        context.res = {
            status: 500,
            body: { error: 'Internal server error' }
        };
    }
};
```

**Example Azure Function (Python):**

```python
# Azure Function: generate-visualization/__init__.py
import logging
import json
import os
import requests
import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Floor visualization request received')
    
    NANO_BANANA_API_KEY = os.environ.get('NANO_BANANA_API_KEY')
    API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models/imagen-3.0-generate-001:generateContent'
    
    try:
        req_body = req.get_json()
        room_image = req_body.get('roomImage')
        sample_image = req_body.get('sampleImage')
        
        if not room_image or not sample_image:
            return func.HttpResponse(
                json.dumps({'error': 'Missing required images'}),
                status_code=400,
                mimetype='application/json'
            )
        
        # Construct API request
        api_request = {
            'contents': [{
                'parts': [
                    {
                        'inline_data': {
                            'mime_type': 'image/jpeg',
                            'data': room_image
                        }
                    },
                    {
                        'inline_data': {
                            'mime_type': 'image/jpeg',
                            'data': sample_image
                        }
                    },
                    {
                        'text': 'Create a professional, realistic interior visualization. Take the flooring pattern from the second image (the floor sample) and seamlessly apply it to replace the floor in the first image (the room photo). The new flooring should be laid in the same direction and orientation as the original floor and look natural with proper perspective, lighting, and shadows that match the room\'s environment. Maintain the exact same room layout, furniture, walls, and all other elements - only change the floor to match the flooring sample. Do not add or remove any furniture, rugs, chairs, or other room elements.'
                    }
                ]
            }],
            'generationConfig': {
                'temperature': 0.4,
                'maxOutputTokens': 8192,
                'responseModalities': ['IMAGE'],
                'imageConfig': {
                    'aspectRatio': '16:9'
                }
            }
        }
        
        # Call Nano Banana API
        response = requests.post(
            f'{API_ENDPOINT}?key={NANO_BANANA_API_KEY}',
            headers={'Content-Type': 'application/json'},
            json=api_request,
            timeout=120
        )
        
        return func.HttpResponse(
            response.text,
            status_code=response.status_code,
            mimetype='application/json'
        )
        
    except Exception as e:
        logging.error(f'Error: {str(e)}')
        return func.HttpResponse(
            json.dumps({'error': 'Internal server error'}),
            status_code=500,
            mimetype='application/json'
        )
```

#### 12A.6 Azure Function Configuration

**function.json (for Node.js/Python):**
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post"],
      "route": "generate-visualization"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

**Environment Variables (Azure Portal → Function App → Configuration):**
```
NANO_BANANA_API_KEY = AIzaSyDhPmNlSHE2IpumnDtSnJhE0MVbDYa9VHs
```

**CORS Settings:**
- Allow requests from your Azure Static Web App domain
- For testing: Allow `*` (wildcard) - remove in production
- Specific domains: `https://your-app.azurestaticapps.net`

#### 12A.7 Deployment Workflow

**Step 1: Local Development**
```bash
# Set config.json mode to "local"
# Test directly with Nano Banana API
# Develop and iterate quickly
```

**Step 2: Azure Function Deployment**
```bash
# Deploy Azure Function
az functionapp create --resource-group <group> --name <function-app-name>

# Set environment variable
az functionapp config appsettings set --name <function-app-name> \
  --settings NANO_BANANA_API_KEY=<your-key>

# Deploy function code
func azure functionapp publish <function-app-name>
```

**Step 3: Production Configuration**
```bash
# Update config.json mode to "production"
# Update proxyEndpoint to your Azure Function URL
# Deploy static files to Azure Static Web Apps or Blob Storage
```

**Step 4: Security Hardening**
- Remove `config.json` from repository (use `.gitignore`)
- Use separate config files for dev/prod
- Enable Azure Function authentication (API keys or Azure AD)
- Monitor API usage in Azure Monitor

#### 12A.8 Cost Optimization

**Azure Function Pricing:**
- Consumption Plan (Pay-per-execution)
- Estimated cost: $0.20 per million executions
- 1GB memory, 90-second timeout sufficient
- Free tier: 1 million executions/month

**Nano Banana API Pricing:**
- Check Google Cloud pricing
- Monitor quota usage
- Set budget alerts

**Recommendations:**
- Implement rate limiting in Azure Function
- Cache frequent requests (if applicable)
- Log and monitor all API calls
- Set up alerts for unusual usage patterns

#### 12A.9 Testing Both Modes

**Local Mode Testing:**
```javascript
// In config.json: "mode": "local"
// Verify: API calls go directly to Nano Banana
// Check: Network tab shows googleapis.com requests
```

**Production Mode Testing:**
```javascript
// In config.json: "mode": "production"
// Verify: API calls go to Azure Function
// Check: Network tab shows azurewebsites.net requests
// Test: API key not visible in browser
```

#### 12A.10 Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment-specific configs** (dev, staging, prod)
3. **Rotate API keys** regularly
4. **Monitor for abuse** using Azure Monitor
5. **Implement rate limiting** (e.g., 10 requests/minute per IP)
6. **Add request validation** in Azure Function
7. **Use HTTPS only** for all connections
8. **Consider Azure API Management** for enterprise deployments

---

### 13. Performance Requirements

#### 13.1 Load Time
- Initial page load: < 3 seconds
- Product catalog parsing: < 2 seconds
- Demo room gallery render: < 1 second

#### 13.2 Image Optimization
- Lazy load product thumbnails
- Progressive image loading
- Compress thumbnails (max 200x200px for sidebar)
- Full-res images only on demand

#### 13.3 Caching Strategy
- **Product Images:** Cache in browser (localStorage or IndexedDB)
- **Generated Visualizations:** In-memory cache (20 image limit)
- **Demo Room Originals:** Browser cache headers
- **CSV Data:** Parse once, store in memory

#### 13.4 Responsive Performance
- Mobile: Touch-optimized interactions
- Debounce filter inputs (300ms)
- Throttle scroll events
- Virtual scrolling for large product lists (if >100 products visible)

---

### 14. UI/UX Requirements

#### 14.1 Color Scheme
- **Primary Blue:** `#5196B3` (buttons, accents)
- **Dark Blue:** `#428099` (hover states)
- **Dark Gray:** `#3E4B51` (text, headers)
- **Light Gray:** `#f7fafc` (backgrounds)
- **Border Gray:** `#e2e8f0`
- **White:** `#FFFFFF` (main background)

#### 14.2 Typography
- **Font Family:** Figtree (sans-serif)
- **Headings:** 600-700 weight
- **Body:** 400 weight
- **Small Text:** 300 weight
- **Sizes:**
  - H1: 2.5rem
  - H2: 2rem
  - H3: 1.5rem
  - Body: 1rem
  - Small: 0.875rem

#### 14.3 Spacing & Layout
- Consistent 8px grid system
- Generous whitespace
- Card-based design for products
- Rounded corners (8-12px border-radius)
- Subtle shadows for depth

#### 14.4 Animations
- Smooth transitions (300ms ease)
- Loading animations (spinner + gradient pulse)
- Hover effects (scale, color change)
- Slide-in panels
- Fade-in for images

#### 14.5 Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Alt text for all images
- Sufficient color contrast (WCAG AA)

#### 14.6 Responsive Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

#### 14.7 Mobile-Specific Considerations
- Touch targets minimum 44x44px
- Swipe gestures for slider
- Pinch-to-zoom on images
- Collapsible navigation
- Bottom navigation for primary actions (optional)

---

### 15. State Management

#### 15.1 Application State
```javascript
{
  currentView: "landing" | "gallery" | "custom",
  currentRoom: {
    type: "demo" | "uploaded",
    name: string,
    imageData: base64 | null,
    timestamp: number
  },
  selectedProduct: {
    brand: string,
    collection: string,
    productName: string,
    productData: object
  },
  filters: {
    brand: string[],
    priceLevel: string[],
    color: string[],
    // ... all filter categories
  },
  favorites: string[],  // Array of ProductNames
  cache: {
    generatedImages: {},  // Key: cacheKey, Value: base64
    cacheKeys: [],        // LRU tracking
    maxSize: 20
  },
  ui: {
    compareMode: boolean,
    zoomMode: boolean,
    sidebarOpen: boolean,
    favoritesOpen: boolean,
    viewMode: "grid" | "list"
  }
}
```

#### 15.2 State Persistence
- **localStorage:**
  - Favorites list
  - Last selected filters
  - View mode preference
  
- **sessionStorage:**
  - Current room (if uploaded)
  - Current product selection
  - Cache metadata (not images themselves)

---

### 16. Error States & Edge Cases

#### 16.1 Missing Data
- Product without image: Show placeholder
- Demo room without pre-generated gallery: Show message, allow upload
- Empty CSV or load failure: Show error, prevent app usage

#### 16.2 Network Issues
- Offline detection: Disable upload and custom photo mode
- API timeout: Clear loading, show retry option
- Slow connection: Show progress indicator

#### 16.3 User Input Validation
- File size too large: Show error before attempting upload
- Unsupported file type: Show supported formats
- Invalid room photo (not a room): API may fail, show error

#### 16.4 Browser Compatibility
- LocalStorage not available: Disable favorites
- FileReader API not supported: Disable custom upload
- Show warning for unsupported browsers

---

## User Interface Specifications

### 17. Detailed Component Specs

#### 17.1 Landing Page Hero Section
- Full-width banner with gradient background
- Centered content:
  - Company logo (max-width: 300px)
  - H1: "See products in your room"
  - Subheading: "Upload a picture of your room or try our demo rooms"
  - Primary CTA button: "Upload Your Room Photo"
  - Icon or arrow pointing down to demo gallery

#### 17.2 Demo Room Grid
- Responsive grid (4-3-2 columns)
- Each card:
  - Image (16:9 aspect ratio)
  - Overlay on hover with "Try This Room" button
  - Title below image (centered)
  - Subtle shadow and border
  - Click anywhere on card to select room

#### 17.3 Sidebar Product Card (Grid View)
```
┌─────────────────┐
│   [IMAGE]       │
│                 │
├─────────────────┤
│ Product Name    │
│ Collection      │
│ $$ ♡           │
└─────────────────┘
```

#### 17.4 Before/After Slider
```
┌──────────────────────────┐
│     BEFORE  │  AFTER     │
│             ║            │
│             ║            │
│          [HANDLE]        │
│             ║            │
└──────────────────────────┘
```
- Vertical divider with draggable handle
- Handle has grab icon
- Smooth drag animation
- Snap to edges (10% from left/right)

#### 17.5 Product Detail Modal
```
┌─────────────────────────────┐
│  [X]                        │
│  ┌─────┐  Product Name      │
│  │IMG  │  Collection - Brand│
│  └─────┘                    │
│                             │
│  Specifications:            │
│  ├ Size: 9" x 48"          │
│  ├ Type: Vinyl Plank       │
│  ├ Thickness: 4.5mm        │
│  └ ...                     │
│                             │
│  Room Suitability:          │
│  [✓] Living  [✓] Kitchen   │
│                             │
│  [Visualize] [Add to ♡]   │
└─────────────────────────────┘
```

---

## Testing Requirements

### 18. Test Scenarios

#### 18.1 Functional Tests
- Upload room photo successfully
- Select product and generate visualization
- Add/remove favorites
- Apply filters and see results
- Compare before/after with slider
- Download generated image
- Navigate between demo rooms
- Switch between gallery and custom modes

#### 18.2 Performance Tests
- Load product catalog with 2000+ products
- Handle 20 images in cache
- Generate visualization within 90 seconds
- Responsive interactions (no lag on filter changes)

#### 18.3 Browser Tests
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Tablet browsers

#### 18.4 Edge Case Tests
- No internet connection (appropriate errors)
- API failure (graceful degradation)
- Missing product images (placeholder displays)
- Corrupt CSV (error handling)
- Browser storage full (clear old cache)

---

## Future Enhancements (Out of Scope for V2.0)

### 19. Potential Features
1. **Multi-Surface Editing:** Walls, countertops, rugs
2. **Share Functionality:** Generate shareable links or social media posts
3. **AR Mode:** Use device camera for live AR visualization
4. **Product Recommendations:** AI-suggested products based on user preferences
5. **Room Designer:** Edit room beyond flooring (paint, furniture)
6. **Save Projects:** User accounts with saved projects
7. **Cost Estimation:** Calculate square footage and total cost
8. **Appointment Booking:** Schedule showroom visit directly from app
9. **3D Visualization:** Full 3D room rendering
10. **Multi-Room Projects:** Visualize different floors in different rooms

---

## Implementation Notes

### 20. Development Phases

#### Phase 1: Core Infrastructure (Week 1-2)
- Set up file structure
- Load and parse CSV
- Build hierarchical navigation
- Implement filtering system
- Basic UI layout

#### Phase 2: Landing Page & Gallery Mode (Week 2-3)
- Demo room gallery display
- Gallery image loading
- Room selection and navigation
- Side-by-side viewer

#### Phase 3: Custom Photo Mode (Week 3-4)
- Upload functionality
- API integration
- Loading states and animations
- Caching system

#### Phase 4: Advanced Features (Week 4-5)
- Favorites/wishlist
- Compare slider
- Product detail modal
- Download functionality
- Zoom mode

#### Phase 5: Polish & Testing (Week 5-6)
- Responsive design refinement
- Performance optimization
- Error handling
- Cross-browser testing
- User acceptance testing

#### Phase 6: Azure Deployment Setup (Week 6)
- Create Azure Function for API proxy
- Configure environment variables
- Set up Azure Static Web Apps or Blob Storage
- Update config.json for production mode
- Deploy and test in production environment
- Configure CORS and security settings
- Set up monitoring and alerts

---

## Assumptions & Dependencies

### 21. Assumptions

1. **Local Development:** Python 3 simple HTTP server is used for local testing
2. **Production Hosting:** Azure Static Web Apps or Azure Blob Storage for production
3. **Backend Proxy:** Azure Functions will be used to secure API key in production
4. Users have modern browsers with JavaScript enabled
5. Users have stable internet connection for API calls
6. Nano Banana API has sufficient quota for expected usage
7. Product images will be added to file structure over time
8. Demo room photos are professional, well-lit, high-quality images
9. CSV data is clean and properly formatted
10. All products in CSV will eventually have corresponding sample images
11. Organization has an active Azure subscription for deployment

### 22. Dependencies

1. **Google Nano Banana API** - Core functionality dependent on API availability
2. **Azure Cloud Services** - Static Web Apps and Functions for production deployment
3. **Product Catalog CSV** - Must be maintained and updated externally
4. **Sample Images** - Require ongoing photography/sourcing
5. **Demo Room Images** - Require professional photography
6. **Batch Generation Script** - Separate script to generate demo room gallery (not part of this PRD)

---

## Success Metrics

### 23. Key Performance Indicators (KPIs)

#### User Engagement
- Average time spent in application
- Number of products visualized per session
- Number of demo rooms explored
- Favorites added per session
- Download rate

#### Technical Performance
- Page load time
- API call success rate
- Average API response time
- Cache hit rate
- Error rate

#### Business Metrics (if tracked)
- Conversion rate (visualization → inquiry/purchase)
- Most popular products (by visualization count)
- Most popular demo rooms
- Mobile vs desktop usage ratio

---

## Appendix

### A. Glossary

- **Demo Room:** Pre-photographed room with pre-generated floor visualizations for all products
- **Gallery Mode:** View mode for browsing pre-generated visualizations (no API calls)
- **Custom Photo Mode:** User uploads their own room photo (requires API calls)
- **Nano Banana API:** Google's image generation API (Imagen 3)
- **LRU Cache:** Least Recently Used caching strategy

### B. References

- Google Nano Banana API Documentation
- Product Catalog CSV Schema
- Brand Style Guide
- Original MVP Code

---

## Quick Reference: Deployment Options

### Option 1: Azure Static Web Apps (Recommended)
**Pros:**
- Integrated with GitHub for CI/CD
- Built-in HTTPS and custom domains
- Free tier available
- Automatic scaling
- Great for static content

**Setup:**
```bash
# Install Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Deploy
swa deploy --app-location . --output-location .
```

### Option 2: Azure Blob Storage (Static Website)
**Pros:**
- Simple and cost-effective
- Great for serving static files
- CDN integration available
- Very low cost ($0.02/GB storage)

**Setup:**
```bash
# Create storage account
az storage account create --name floorstorage --resource-group myResourceGroup

# Enable static website hosting
az storage blob service-properties update --account-name floorstorage --static-website --index-document floor_visualizer.html

# Upload files
az storage blob upload-batch -s . -d '$web' --account-name floorstorage
```

### Option 3: Azure App Service
**Pros:**
- More control and features
- Can add server-side logic easily
- Supports custom domains and SSL
- Built-in authentication

**Setup:**
```bash
# Create app service plan
az appservice plan create --name FloorVisualizerPlan --resource-group myResourceGroup --sku FREE

# Create web app
az webapp create --name floor-visualizer --resource-group myResourceGroup --plan FloorVisualizerPlan

# Deploy
az webapp up --name floor-visualizer --html
```

### Azure Function Deployment (All Options)
Regardless of which hosting option you choose, you'll need the Azure Function:

```bash
# Install Azure Functions Core Tools
npm install -g azure-functions-core-tools@4

# Create function app
az functionapp create --resource-group myResourceGroup \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name floor-visualizer-api \
  --storage-account floorstorage

# Set API key as environment variable
az functionapp config appsettings set --name floor-visualizer-api \
  --settings NANO_BANANA_API_KEY=<your-key>

# Deploy function
cd azure-function
func azure functionapp publish floor-visualizer-api
```

### Configuration Checklist
- [ ] Update `config.json` mode to "production"
- [ ] Set `proxyEndpoint` to your Azure Function URL
- [ ] Configure CORS on Azure Function
- [ ] Test API proxy functionality
- [ ] Remove or gitignore config.json with sensitive data
- [ ] Set up monitoring and alerts
- [ ] Test from production domain

---

*End of Product Requirements Document*
