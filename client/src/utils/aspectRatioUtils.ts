/**
 * Aspect Ratio Utilities for Nano Banana API
 * 
 * Detects image aspect ratios and maps them to the closest supported
 * aspect ratio by the Gemini 2.5 Flash Image API (Nano Banana).
 */

export type AspectRatioString =
    | '1:1'
    | '16:9'
    | '9:16'
    | '4:3'
    | '3:4'
    | '3:2'
    | '2:3'
    | '5:4'
    | '4:5'
    | '21:9';

export type Orientation = 'landscape' | 'portrait' | 'square';

export interface AspectRatioInfo {
    ratio: AspectRatioString;
    numericValue: number;
    orientation: Orientation;
    description: string;
}

/**
 * Supported aspect ratios by the Nano Banana API
 * Organized by orientation for easier matching
 */
export const SUPPORTED_ASPECT_RATIOS: AspectRatioInfo[] = [
    // Square
    { ratio: '1:1', numericValue: 1.0, orientation: 'square', description: 'Square' },

    // Landscape
    { ratio: '21:9', numericValue: 21 / 9, orientation: 'landscape', description: 'Ultrawide / Cinema' },
    { ratio: '16:9', numericValue: 16 / 9, orientation: 'landscape', description: 'Widescreen / Landscape' },
    { ratio: '3:2', numericValue: 3 / 2, orientation: 'landscape', description: 'Standard Photography' },
    { ratio: '4:3', numericValue: 4 / 3, orientation: 'landscape', description: 'Standard Fullscreen' },
    { ratio: '5:4', numericValue: 5 / 4, orientation: 'landscape', description: 'Traditional Print' },

    // Portrait
    { ratio: '9:16', numericValue: 9 / 16, orientation: 'portrait', description: 'Portrait / Mobile' },
    { ratio: '2:3', numericValue: 2 / 3, orientation: 'portrait', description: 'Portrait Photography' },
    { ratio: '3:4', numericValue: 3 / 4, orientation: 'portrait', description: 'Portrait Fullscreen' },
    { ratio: '4:5', numericValue: 4 / 5, orientation: 'portrait', description: 'Portrait Print' },
];

/**
 * Determines orientation from aspect ratio value
 */
function getOrientation(aspectRatio: number): Orientation {
    const SQUARE_THRESHOLD = 0.05; // tolerance for square detection

    if (Math.abs(aspectRatio - 1.0) < SQUARE_THRESHOLD) {
        return 'square';
    }
    return aspectRatio > 1.0 ? 'landscape' : 'portrait';
}

/**
 * Finds the closest supported aspect ratio
 * Strategy: Prioritize orientation, then find numerically closest ratio
 */
export function findClosestAspectRatio(width: number, height: number): AspectRatioInfo {
    const inputRatio = width / height;
    const inputOrientation = getOrientation(inputRatio);

    console.log(`[Aspect Ratio Detection] Input dimensions: ${width}x${height}`);
    console.log(`[Aspect Ratio Detection] Calculated ratio: ${inputRatio.toFixed(3)}`);
    console.log(`[Aspect Ratio Detection] Detected orientation: ${inputOrientation}`);

    // Filter by orientation first
    const candidatesInOrientation = SUPPORTED_ASPECT_RATIOS.filter(
        ar => ar.orientation === inputOrientation
    );

    // If no candidates in the same orientation (shouldn't happen), use all
    const candidates = candidatesInOrientation.length > 0
        ? candidatesInOrientation
        : SUPPORTED_ASPECT_RATIOS;

    // Find closest by numeric value
    let closest = candidates[0];
    let minDifference = Math.abs(inputRatio - closest.numericValue);

    for (const candidate of candidates) {
        const difference = Math.abs(inputRatio - candidate.numericValue);
        if (difference < minDifference) {
            minDifference = difference;
            closest = candidate;
        }
    }

    console.log(`[Aspect Ratio Detection] Selected aspect ratio: ${closest.ratio} (${closest.description})`);
    console.log(`[Aspect Ratio Detection] Numeric difference: ${minDifference.toFixed(3)}`);

    return closest;
}

/**
 * Detects aspect ratio from a base64 image data URL
 */
export async function detectImageAspectRatio(imageDataUrl: string): Promise<AspectRatioString> {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            try {
                const aspectRatioInfo = findClosestAspectRatio(img.width, img.height);
                resolve(aspectRatioInfo.ratio);
            } catch (error) {
                console.error('[Aspect Ratio Detection] Error finding closest ratio:', error);
                reject(error);
            }
        };

        img.onerror = (error) => {
            console.error('[Aspect Ratio Detection] Error loading image:', error);
            reject(new Error('Failed to load image for aspect ratio detection'));
        };

        img.src = imageDataUrl;
    });
}

/**
 * Validates if a string is a supported aspect ratio
 */
export function isValidAspectRatio(ratio: string): ratio is AspectRatioString {
    return SUPPORTED_ASPECT_RATIOS.some(ar => ar.ratio === ratio);
}
