import { useState, useEffect } from 'react';
import acorn1 from '../assets/acorn_frame_1_1764021105813.png';
import acorn2 from '../assets/acorn_frame_2_1764021407309.png';
import acorn3 from '../assets/acorn_frame_3_1764021430984.png';
import acorn4 from '../assets/acorn_frame_4_1764021695058.png';
import acorn5 from '../assets/acorn_frame_5_1764022094353.png';

export const AcornLoader = () => {
    const [currentFrame, setCurrentFrame] = useState(0);
    const frames = [acorn1, acorn2, acorn3, acorn4, acorn5];

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const animate = () => {
            // Frame durations in ms
            // Frames 1-4: Fast (e.g., 150ms)
            // Frame 5: Slow (e.g., 800ms)
            const durations = [150, 150, 150, 150, 800];

            timeoutId = setTimeout(() => {
                setCurrentFrame((prev) => (prev + 1) % frames.length);
            }, durations[currentFrame]);
        };

        animate();

        return () => clearTimeout(timeoutId);
    }, [currentFrame]);

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-24 h-24 relative flex items-center justify-center">
                {frames.map((frame, index) => (
                    <img
                        key={index}
                        src={frame}
                        alt={`Loading frame ${index + 1}`}
                        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-0 ${index === currentFrame ? 'opacity-100' : 'opacity-0'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};
