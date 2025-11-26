import type { Product } from '../context/FlooringContext';
import { detectImageAspectRatio, type AspectRatioString } from '../utils/aspectRatioUtils';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/generate-floor';
const DEFAULT_ASPECT_RATIO: AspectRatioString = '16:9';

const fetchProductImage = async (basePath: string): Promise<Blob> => {
    const extensions = ['.jpg', '.png', '.webp', '.jpeg'];

    for (const ext of extensions) {
        try {
            const url = `${basePath}${ext}`;
            const response = await fetch(url);
            if (response.ok) {
                console.log(`[API] Found product image: ${url}`);
                return await response.blob();
            }
        } catch (e) {
            // Continue to next extension
        }
    }
    throw new Error(`Could not find product image for path: ${basePath}`);
};

export const generateFloor = async (roomImage: string, product: Product): Promise<string> => {
    try {
        // Detect aspect ratio from room image
        let aspectRatio: AspectRatioString;
        try {
            aspectRatio = await detectImageAspectRatio(roomImage);
            console.log(`[API] Using detected aspect ratio: ${aspectRatio}`);
        } catch (aspectError) {
            console.warn('[API] Aspect ratio detection failed, using default:', DEFAULT_ASPECT_RATIO);
            console.error('[API] Detection error:', aspectError);
            aspectRatio = DEFAULT_ASPECT_RATIO;
        }

        // Convert base64 room image to Blob
        const roomBlob = await (await fetch(roomImage)).blob();

        // Fetch product image (try multiple extensions)
        const productImageUrl = product.ProductImage;
        if (!productImageUrl) {
            throw new Error("Product image URL is missing");
        }

        const floorBlob = await fetchProductImage(productImageUrl);

        const formData = new FormData();
        formData.append('room_image', roomBlob, 'room.png');
        formData.append('floor_sample', floorBlob, 'floor.png');
        formData.append('aspect_ratio', aspectRatio);

        console.log(`[API] Sending request with aspect ratio: ${aspectRatio}`);

        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to generate floor visualization: ${errorText}`);
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
