import React, { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Trash2, Image as ImageIcon, Download, FolderDown } from 'lucide-react';
import { downloadImage } from '../utils/downloadImage';
import { downloadAllImages } from '../utils/downloadAllImages';
import type { Product } from '../context/FlooringContext';

interface GalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: Record<string, string>;
    products: Product[];
    onClear: () => void;
}

const ProductThumbnail = ({ product }: { product: Product }) => {
    const [extensionIndex, setExtensionIndex] = useState(0);
    const [error, setError] = useState(false);
    const extensions = ['.png', '.jpg', '.jpeg', '.webp'];

    // Reset state when product changes
    useEffect(() => {
        setExtensionIndex(0);
        setError(false);
    }, [product.SKUNumber]);

    const handleError = () => {
        if (extensionIndex < extensions.length - 1) {
            setExtensionIndex(prev => prev + 1);
        } else {
            setError(true);
        }
    };

    if (error || !product.ProductImage) {
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                <ImageIcon size={24} />
            </div>
        );
    }

    return (
        <img
            src={`${product.ProductImage}${extensions[extensionIndex]}`}
            alt={product.ProductName}
            className="w-full h-full object-cover"
            onError={handleError}
        />
    );
};

export const GalleryModal: React.FC<GalleryModalProps> = ({
    isOpen,
    onClose,
    images,
    products,
    onClear
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const imageEntries = Object.entries(images);
    const totalImages = imageEntries.length;

    // Reset index when images change or modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(0);
        }
    }, [isOpen, totalImages]);

    const handlePrevious = useCallback(() => {
        setCurrentIndex(prev => (prev === 0 ? totalImages - 1 : prev - 1));
    }, [totalImages]);

    const handleNext = useCallback(() => {
        setCurrentIndex(prev => (prev === totalImages - 1 ? 0 : prev + 1));
    }, [totalImages]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                handlePrevious();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handlePrevious, handleNext, onClose]);

    if (!isOpen) return null;

    if (totalImages === 0) {
        return (
            <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center text-white">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                    <X size={24} />
                </button>
                <ImageIcon size={48} className="text-gray-500 mb-4" />
                <p className="text-xl font-medium text-gray-400">No generated scenes yet</p>
                <p className="text-sm text-gray-500 mt-2">Generate some floors to see them here!</p>
            </div>
        );
    }

    const [currentSku, currentImage] = imageEntries[currentIndex];
    const currentProduct = products.find(p => p.SKUNumber === currentSku);

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm">
            {/* Top Controls */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10">
                <button
                    onClick={() => {
                        if (window.confirm('Are you sure you want to clear all generated scenes? This cannot be undone.')) {
                            onClear();
                        }
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
                >
                    <Trash2 size={18} />
                    <span className="font-medium">Clear Gallery</span>
                </button>

                <div className="flex items-center gap-2">
                    {totalImages > 0 && (
                        <button
                            onClick={async () => {
                                await downloadAllImages(images, products);
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors border border-secondary/20 mr-2"
                            title="Download All Images as ZIP"
                        >
                            <FolderDown size={18} />
                            <span className="font-medium">Download All</span>
                        </button>
                    )}

                    <div className="flex items-center gap-2 bg-white/10 rounded-full p-1">
                        <button
                            onClick={async () => {
                                if (currentImage) {
                                    await downloadImage(currentImage, currentProduct);
                                }
                            }}
                            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                            title="Download Image"
                        >
                            <Download size={24} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
                {/* Navigation Buttons */}
                <button
                    onClick={handlePrevious}
                    className="absolute left-4 md:left-8 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors border border-white/10 z-20"
                >
                    <ChevronLeft size={32} />
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-4 md:right-8 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors border border-white/10 z-20"
                >
                    <ChevronRight size={32} />
                </button>

                {/* Image */}
                <div className="relative max-w-full max-h-full flex items-center justify-center">
                    <img
                        src={currentImage}
                        alt={`Generated floor ${currentSku}`}
                        className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-lg"
                    />
                </div>

                {/* Product Card */}
                <div className="absolute bottom-8 left-8 md:left-12 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl max-w-md border border-white/20 flex gap-4 items-center animate-in slide-in-from-bottom-4 duration-300">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                        {currentProduct ? (
                            <ProductThumbnail product={currentProduct} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImageIcon size={24} />
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                                {currentProduct?.BRAND || 'Unknown Brand'}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                                {currentSku}
                            </span>
                        </div>
                        <h3 className="font-bold text-gray-900 truncate" title={currentProduct?.ProductName}>
                            {currentProduct?.ProductName || 'Unknown Product'}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                            {currentProduct?.Collection || 'Unknown Collection'}
                        </p>
                    </div>
                </div>

                {/* Counter */}
                <div className="absolute bottom-8 right-8 md:right-12 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                    {currentIndex + 1} / {totalImages}
                </div>
            </div>
        </div>
    );
};
