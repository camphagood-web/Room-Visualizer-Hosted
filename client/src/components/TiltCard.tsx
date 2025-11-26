import React, { useRef, useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useFlooring } from '../context/FlooringContext';
import type { Product } from '../context/FlooringContext';

interface TiltCardProps {
    product: Product;
    onClick: () => void;
}

export const TiltCard = ({ product, onClick }: TiltCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [currentExtensionIndex, setCurrentExtensionIndex] = useState(0);
    const { favorites, toggleFavorite } = useFlooring();

    // Reset state when product changes
    useEffect(() => {
        setImageLoaded(false);
        setImageError(false);
        setCurrentExtensionIndex(0);
    }, [product.SKUNumber]);

    const isFavorite = favorites.includes(product.SKUNumber);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(product.SKUNumber);
    };

    const handleImageError = () => {
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
        if (currentExtensionIndex < imageExtensions.length - 1) {
            // Try next extension
            setCurrentExtensionIndex(prev => prev + 1);
            setImageLoaded(false);
        } else {
            // All extensions failed
            setImageError(true);
        }
    };

    // Try multiple image extensions
    const imagePath = (product as any).ProductImage;
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
    const currentImageSrc = `${imagePath}${imageExtensions[currentExtensionIndex]}`;

    return (
        <div
            ref={cardRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative bg-white rounded-card shadow-card overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-floating"
            style={{ transformStyle: 'preserve-3d' }}
        >
            {/* Favorite Button */}
            <button
                onClick={handleFavoriteClick}
                className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 ${isFavorite
                    ? 'bg-rose-500 text-white shadow-lg'
                    : 'bg-white/90 text-gray-400 hover:text-rose-400 shadow-md'
                    }`}
            >
                <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
            </button>

            {/* Image Container */}
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                {!imageError ? (
                    <>
                        <img
                            src={currentImageSrc}
                            alt={product.ProductName}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            onLoad={() => setImageLoaded(true)}
                            onError={handleImageError}
                        />
                        {!imageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <div className="text-center p-4">
                            <div className="text-4xl mb-2">🏠</div>
                            <p className="text-xs">No Image</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="font-heading font-semibold text-base text-text-heading line-clamp-2 mb-1">
                    {product.ProductName}
                </h3>
                <p className="text-sm text-text-muted mb-2">
                    {product.Collection}
                </p>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-text-muted">
                        SKU: {product.SKUNumber}
                    </span>
                    {product.ProductPrice && (
                        <span className="text-sm font-semibold text-secondary">
                            ${product.ProductPrice}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
