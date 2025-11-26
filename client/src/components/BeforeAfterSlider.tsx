import { useState, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
}

interface ImageDimensions {
    width: number;
    height: number;
}

export const BeforeAfterSlider = ({ beforeImage, afterImage }: BeforeAfterSliderProps) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [containerAspectRatio, setContainerAspectRatio] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Load images and detect their dimensions
    useEffect(() => {
        const loadImage = (src: string): Promise<ImageDimensions> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    resolve({ width: img.naturalWidth, height: img.naturalHeight });
                };
                img.onerror = reject;
                img.src = src;
            });
        };

        const detectDimensions = async () => {
            try {
                const [beforeDims, afterDims] = await Promise.all([
                    loadImage(beforeImage),
                    loadImage(afterImage)
                ]);

                console.log('[BeforeAfterSlider] Before image dimensions:', beforeDims);
                console.log('[BeforeAfterSlider] After image dimensions:', afterDims);

                // Use larger dimensions to ensure both images are fully visible
                let targetWidth: number;
                let targetHeight: number;

                if (beforeDims.width >= afterDims.width && beforeDims.height >= afterDims.height) {
                    // Before image is larger or equal in both dimensions
                    targetWidth = beforeDims.width;
                    targetHeight = beforeDims.height;
                } else if (afterDims.width >= beforeDims.width && afterDims.height >= beforeDims.height) {
                    // After image is larger or equal in both dimensions
                    targetWidth = afterDims.width;
                    targetHeight = afterDims.height;
                } else {
                    // Mixed - use the larger dimension for each axis
                    targetWidth = Math.max(beforeDims.width, afterDims.width);
                    targetHeight = Math.max(beforeDims.height, afterDims.height);
                }

                const aspectRatio = targetWidth / targetHeight;
                setContainerAspectRatio(aspectRatio);

                console.log('[BeforeAfterSlider] Container aspect ratio set to:', aspectRatio.toFixed(3));
            } catch (error) {
                console.error('[BeforeAfterSlider] Error loading images:', error);
                // Fallback to 16:9 if image loading fails
                setContainerAspectRatio(16 / 9);
            }
        };

        detectDimensions();
    }, [beforeImage, afterImage]);

    const handleMove = (event: MouseEvent | TouchEvent) => {
        if (!isDragging || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;

        const position = ((clientX - containerRect.left) / containerRect.width) * 100;
        setSliderPosition(Math.min(Math.max(position, 0), 100));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging]);

    // Don't render until we have aspect ratio
    if (containerAspectRatio === null) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-500">Loading images...</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 p-4">
            <div
                ref={containerRef}
                className="relative inline-block select-none shadow-lg"
                style={{
                    maxWidth: '100%',
                    maxHeight: '100%'
                }}
                onMouseDown={() => setIsDragging(true)}
                onTouchStart={() => setIsDragging(true)}
            >
                {/* Hidden After Image (Defines container size based on generated result) */}
                <img
                    src={afterImage}
                    alt="Hidden Reference"
                    className="block max-w-full max-h-[calc(100vh-200px)] w-auto h-auto opacity-0 pointer-events-none"
                    style={{ maxHeight: '100%' }}
                />

                {/* Before Image (Original - Background, covers container) */}
                <img
                    src={beforeImage}
                    alt="Before"
                    className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
                />

                {/* After Image (New Floor - Foreground, clipped by slider) */}
                <div
                    className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                    <img
                        src={afterImage}
                        alt="After"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Slider Handle */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg z-10 flex items-center justify-center -translate-x-1/2"
                    style={{ left: `${sliderPosition}%` }}
                >
                    <div className="relative w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-primary">
                        <GripVertical size={16} />

                        {/* Dynamic Labels */}
                        {isDragging && (
                            <>
                                <div className="absolute right-full mr-4 bg-black/75 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap pointer-events-none">
                                    After
                                </div>
                                <div className="absolute left-full ml-4 bg-black/75 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap pointer-events-none">
                                    Before
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Labels */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm font-medium pointer-events-none">New Floor</div>
                <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm font-medium pointer-events-none">Original</div>
            </div>
        </div>
    );
};

