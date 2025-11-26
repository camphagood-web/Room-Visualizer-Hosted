import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ParallaxHero = () => {
    const ref = useRef(null);
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <div ref={ref} className="relative h-screen overflow-hidden flex items-center justify-center">
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 z-0"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop")',
                    }}
                />
                <div className="absolute inset-0 bg-black/50" />
            </motion.div>

            <motion.div
                style={{ y: textY }}
                className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
            >
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="font-heading text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg text-gray-100"
                >
                    Reimagine Your Space
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-body text-xl md:text-2xl mb-8 text-gray-100 drop-shadow-md"
                >
                    Visualize premium flooring in your own home instantly with our AI-powered tool.
                </motion.p>
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    onClick={() => navigate('/visualizer')}
                    className="bg-secondary hover:bg-secondary/90 text-white font-semibold py-4 px-8 rounded-button inline-flex items-center gap-2 transition-colors shadow-floating"
                >
                    Start Visualizing <ArrowRight className="w-5 h-5" />
                </motion.button>
            </motion.div>
        </div>
    );
};
