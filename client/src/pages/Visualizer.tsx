import React, { useRef, useState, useMemo } from 'react';
import { Upload, Loader2, AlertCircle, Filter, Heart, Download, SplitSquareHorizontal, X, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useFlooring } from '../context/FlooringContext';
import { useProductData } from '../hooks/useProductData';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { AcornLoader } from '../components/AcornLoader';
import { generateFloor } from '../services/api';
import { TiltCard } from '../components/TiltCard';
import { FilterModal, type FilterState } from '../components/FilterModal';
import { GalleryModal } from '../components/GalleryModal';
import { downloadImage } from '../utils/downloadImage';

export const Visualizer = () => {
    const {
        uploadedImage, setUploadedImage,
        selectedProduct, setSelectedProduct,
        generatedImage, setGeneratedImage,
        isGenerating, setIsGenerating,
        error, setError,
        cacheImage, getCachedImage,
        favorites,
        generatedImagesCache,
        clearAllGeneratedFloors
    } = useFlooring();

    const { products, loading: productsLoading } = useProductData();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showFavorites, setShowFavorites] = useState(false);
    const [showSlider, setShowSlider] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<FilterState>({
        brand: [],
        collection: [],
        price: [],
        type: [],
        shade: []
    });

    const filterOptions = useMemo(() => {
        const options = {
            brands: new Set<string>(),
            collections: new Set<string>(),
            prices: new Set<string>(),
            types: new Set<string>(),
            shades: new Set<string>()
        };

        products.forEach(p => {
            if (p.BRAND) options.brands.add(p.BRAND);
            if (p.Collection) options.collections.add(p.Collection);
            if (p.ProductPrice) options.prices.add(p.ProductPrice);
            if (p.ProductType) options.types.add(p.ProductType);
            if (p.ProductShade) options.shades.add(p.ProductShade);
        });

        return {
            brands: Array.from(options.brands).sort(),
            collections: Array.from(options.collections).sort(),
            prices: Array.from(options.prices).sort(),
            types: Array.from(options.types).sort(),
            shades: Array.from(options.shades).sort()
        };
    }, [products]);

    const filteredProducts = useMemo(() => {
        let filtered = products;

        if (showFavorites) {
            filtered = filtered.filter(p => favorites.includes(p.SKUNumber));
        } else {
            if (activeFilters.brand.length > 0) {
                filtered = filtered.filter(p => activeFilters.brand.includes(p.BRAND));
            }
            if (activeFilters.collection.length > 0) {
                filtered = filtered.filter(p => activeFilters.collection.includes(p.Collection));
            }
            if (activeFilters.price.length > 0) {
                filtered = filtered.filter(p => activeFilters.price.includes(p.ProductPrice));
            }
            if (activeFilters.type.length > 0) {
                filtered = filtered.filter(p => activeFilters.type.includes(p.ProductType));
            }
            if (activeFilters.shade.length > 0) {
                filtered = filtered.filter(p => activeFilters.shade.includes(p.ProductShade));
            }
        }

        return filtered;
    }, [products, showFavorites, favorites, activeFilters]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                let fileToProcess = file;
                console.log("[Visualizer] Processing file:", file.name, "Type:", file.type, "Size:", file.size);

                // Check if file is HEIC/HEIF
                if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
                    console.log("[Visualizer] Detected HEIC/HEIF file, sending to backend for conversion...");

                    const formData = new FormData();
                    formData.append('file', file);

                    try {
                        const response = await fetch('http://localhost:8000/convert-image', {
                            method: 'POST',
                            body: formData,
                        });

                        if (!response.ok) {
                            throw new Error(`Conversion failed with status: ${response.status}`);
                        }

                        const blob = await response.blob();
                        console.log("[Visualizer] Backend conversion successful, received blob:", blob);

                        fileToProcess = new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' });
                    } catch (conversionError: any) {
                        console.error("[Visualizer] Backend conversion failed:", conversionError);
                        throw new Error(`HEIC conversion failed: ${conversionError.message}`);
                    }
                }

                const reader = new FileReader();
                reader.onloadend = () => {
                    setUploadedImage(reader.result as string);
                    setGeneratedImage(null); // Reset generated image on new upload
                };
                reader.onerror = (readError) => {
                    console.error("[Visualizer] FileReader error:", readError);
                    setError("Failed to read file.");
                }
                reader.readAsDataURL(fileToProcess);
            } catch (error: any) {
                console.error("[Visualizer] Error processing file:", error);
                setError(`Failed to process image: ${error.message || 'Unknown error'}`);
            }
        }
    };

    const handleProductSelect = async (product: any) => {
        setSelectedProduct(product);
        if (uploadedImage) {
            // Check cache first
            const cachedImage = getCachedImage(product.SKUNumber);
            if (cachedImage) {
                setGeneratedImage(cachedImage);
                return;
            }

            setIsGenerating(true);
            setError(null);
            try {
                const resultImage = await generateFloor(uploadedImage, product);
                setGeneratedImage(resultImage);
                cacheImage(product.SKUNumber, resultImage);
            } catch (err) {
                setError('Failed to generate visualization. Please try again.');
            } finally {
                setIsGenerating(false);
            }
        }
    };

    const handleDownload = async () => {
        if (!generatedImage) return;

        try {
            await downloadImage(generatedImage, selectedProduct || undefined);
        } catch (err) {
            console.error("Download failed", err);
            setError("Failed to download image.");
        }
    };

    const handleRegenerate = async () => {
        if (!uploadedImage || !selectedProduct) return;

        setIsGenerating(true);
        setError(null);
        try {
            // Force generation by calling API directly, bypassing cache check
            const resultImage = await generateFloor(uploadedImage, selectedProduct);
            setGeneratedImage(resultImage);
            // Overwrite existing cache
            cacheImage(selectedProduct.SKUNumber, resultImage);
        } catch (err) {
            setError('Failed to regenerate visualization. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface flex flex-col h-screen">
            {/* Header */}
            <header className="bg-white shadow-sm z-20 px-6 py-4 flex justify-between items-center gap-4">
                <img src="/header-logo.png" alt="Twenty & Oak Room Visualizer" className="h-10 w-auto object-contain" />

                <div className="flex items-center gap-3">
                    {/* Action Buttons Group */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-white text-primary shadow-sm hover:bg-gray-50"
                        >
                            <Upload size={16} />
                            Upload
                        </button>

                        {generatedImage && (
                            <button
                                onClick={handleRegenerate}
                                disabled={isGenerating}
                                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-600 hover:bg-gray-200 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Regenerate Floor"
                            >
                                <RefreshCw size={16} className={isGenerating ? 'animate-spin' : ''} />
                            </button>
                        )}

                        {generatedImage && (
                            <>
                                <button
                                    onClick={() => setShowSlider(!showSlider)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${showSlider
                                        ? 'bg-secondary text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-200'
                                        }`}
                                    title="Toggle Before/After Slider"
                                >
                                    <SplitSquareHorizontal size={16} />
                                </button>

                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-600 hover:bg-gray-200 hover:text-primary"
                                    title="Download Visualization"
                                >
                                    <Download size={16} />
                                </button>
                            </>
                        )}
                    </div>

                    <div className="h-8 w-px bg-gray-200 mx-2" />

                    {/* Favorites Toggle */}
                    <button
                        onClick={() => setShowFavorites(!showFavorites)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-button transition-colors border ${showFavorites
                            ? 'bg-red-50 border-red-200 text-red-600'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Heart size={18} className={showFavorites ? 'fill-current' : ''} />
                        <span className="font-medium">Favorites</span>
                    </button>

                    {/* Gallery Button */}
                    <button
                        onClick={() => setIsGalleryOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-button transition-colors border bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                        <ImageIcon size={18} />
                        <span className="font-medium">Gallery</span>
                    </button>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/heic,image/heif"
                    onChange={handleFileUpload}
                />
            </header>

            <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
                {/* Sidebar / Product Grid */}
                <aside className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-border flex flex-col z-10 h-1/2 md:h-full">
                    <div className="p-4 border-b border-border space-y-4">
                        <div className="mb-6 text-center">
                            <h2 className="font-heading text-3xl font-bold text-text-heading mb-2">Select Flooring</h2>
                            <p className="text-base text-text-muted">Choose a product to visualize</p>
                        </div>

                        {/* Filter Button */}
                        <button
                            onClick={() => setIsFilterModalOpen(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-button bg-secondary text-white font-medium shadow-sm hover:bg-secondary/90 transition-colors"
                        >
                            <Filter size={18} />
                            <span>Filter Products</span>
                        </button>

                        {/* Selected Filters Chips */}
                        {(activeFilters.brand.length > 0 || activeFilters.collection.length > 0 || activeFilters.price.length > 0 || activeFilters.type.length > 0 || activeFilters.shade.length > 0) && (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                                {Object.entries(activeFilters).map(([category, values]) =>
                                    values.map((value: string) => (
                                        <button
                                            key={`${category}-${value}`}
                                            onClick={() => {
                                                setActiveFilters(prev => ({
                                                    ...prev,
                                                    [category]: prev[category as keyof FilterState].filter(v => v !== value)
                                                }));
                                            }}
                                            className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors"
                                        >
                                            <span>{value}</span>
                                            <X size={12} className="text-gray-400 hover:text-gray-600" />
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {productsLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="animate-spin text-secondary" />
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="grid grid-cols-1 gap-3">
                                {filteredProducts.map((product, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-full transition-all duration-200 rounded-xl ${selectedProduct?.ProductName === product.ProductName ? 'ring-4 ring-secondary ring-offset-2' : ''}`}
                                    >
                                        <TiltCard
                                            product={product}
                                            onClick={() => handleProductSelect(product)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                {/* Main Visualization Area */}
                <main className="flex-1 relative bg-gray-100 flex items-center justify-center overflow-hidden h-1/2 md:h-full">
                    {uploadedImage ? (
                        <div className="relative w-full h-full">
                            {isGenerating && (
                                <div className="absolute inset-0 z-50 bg-black/50 flex flex-col items-center justify-center text-white">
                                    <AcornLoader />
                                    <p className="text-lg font-medium mt-4">Generating your new floor...</p>
                                </div>
                            )}

                            {error && (
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-50 text-red-600 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            {generatedImage ? (
                                showSlider ? (
                                    <BeforeAfterSlider beforeImage={uploadedImage} afterImage={generatedImage} />
                                ) : (
                                    <img src={generatedImage} alt="New Floor" className="w-full h-full object-contain" />
                                )
                            ) : (
                                <img src={uploadedImage} alt="Uploaded Room" className="w-full h-full object-contain" />
                            )}
                        </div>
                    ) : (
                        <div className="text-center p-8 max-w-md">
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                                <Upload size={32} />
                            </div>
                            <h3 className="font-heading text-2xl font-bold mb-2 text-gray-700">No Image Uploaded</h3>
                            <p className="text-gray-500 mb-6">Upload a photo of your room to start visualizing different flooring options.</p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-secondary text-white px-6 py-3 rounded-button font-medium hover:bg-secondary/90 transition-colors"
                            >
                                Upload Photo
                            </button>
                        </div>
                    )}
                </main>
            </div>
            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={setActiveFilters}
                currentFilters={activeFilters}
                availableOptions={filterOptions}
                products={products}
            />
            <GalleryModal
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                images={generatedImagesCache}
                products={products}
                onClear={clearAllGeneratedFloors}
            />
        </div>
    );
};
