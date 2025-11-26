import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { saveRoom, getRoom, saveFloor, getAllFloors, clearFloors } from '../utils/storage';

export interface Product {
    ProductName: string;
    SKUNumber: string;
    Collection: string;
    BRAND: string;
    ProductPrice: string;
    ProductSize: string;
    ProductType: string;
    ProductSpecies: string;
    ProductColor: string;
    ProductThickness: string;
    ProductInstallType: string;
    ProductWarranty: string;
    ProductTexture: string;
    ProductGlossLevel: string;
    ProductWaterproof: string;
    [key: string]: string;
}

interface FlooringContextType {
    uploadedImage: string | null;
    setUploadedImage: (image: string | null) => void;
    selectedProduct: Product | null;
    setSelectedProduct: (product: Product | null) => void;
    generatedImage: string | null;
    setGeneratedImage: (image: string | null) => void;
    isGenerating: boolean;
    setIsGenerating: (isGenerating: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    cacheImage: (sku: string, imageUrl: string) => void;
    getCachedImage: (sku: string) => string | undefined;
    favorites: string[];
    toggleFavorite: (sku: string) => void;
    clearAllGeneratedFloors: () => Promise<void>;
    generatedImagesCache: Record<string, string>;
}

const FlooringContext = createContext<FlooringContextType | undefined>(undefined);

export const FlooringProvider = ({ children }: { children: ReactNode }) => {
    const [generatedImagesCache, setGeneratedImagesCache] = useState<Record<string, string>>({});
    const [uploadedImage, setUploadedImageState] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [favorites, setFavorites] = useState<string[]>(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });

    // Load persisted data on mount
    useEffect(() => {
        const loadPersistedData = async () => {
            try {
                // Load Room
                const roomBlob = await getRoom();
                if (roomBlob) {
                    const roomUrl = URL.createObjectURL(roomBlob);
                    setUploadedImageState(roomUrl);
                }

                // Load Floors
                const floors = await getAllFloors();
                const floorsCache: Record<string, string> = {};
                Object.entries(floors).forEach(([sku, blob]) => {
                    floorsCache[sku] = URL.createObjectURL(blob);
                });
                setGeneratedImagesCache(floorsCache);
            } catch (err) {
                console.error('Failed to load persisted data:', err);
            }
        };
        loadPersistedData();
    }, []);

    // Custom setter for uploaded image to clear cache and persist
    const setUploadedImage = async (image: string | null) => {
        setUploadedImageState(image);
        setGeneratedImagesCache({}); // Clear cache when new room is uploaded
        setGeneratedImage(null);

        if (image) {
            try {
                // Convert Data URL to Blob and save
                const res = await fetch(image);
                const blob = await res.blob();
                await saveRoom(blob);
                await clearFloors(); // Clear persisted floors for old room
            } catch (err) {
                console.error('Failed to persist room:', err);
            }
        }
    };

    const cacheImage = async (sku: string, imageUrl: string) => {
        setGeneratedImagesCache(prev => ({
            ...prev,
            [sku]: imageUrl
        }));

        try {
            // Fetch blob from blob URL and save
            const res = await fetch(imageUrl);
            const blob = await res.blob();
            await saveFloor(sku, blob);
        } catch (err) {
            console.error('Failed to persist floor:', err);
        }
    };

    const getCachedImage = (sku: string): string | undefined => {
        return generatedImagesCache[sku];
    };

    const toggleFavorite = (sku: string) => {
        setFavorites(prev => {
            const newFavorites = prev.includes(sku)
                ? prev.filter(f => f !== sku)
                : [...prev, sku];
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    const clearAllGeneratedFloors = async () => {
        try {
            await clearFloors();
            setGeneratedImagesCache({});
            setGeneratedImage(null);
        } catch (err) {
            console.error('Failed to clear floors:', err);
        }
    };

    return (
        <FlooringContext.Provider
            value={{
                uploadedImage,
                setUploadedImage,
                selectedProduct,
                setSelectedProduct,
                generatedImage,
                setGeneratedImage,
                isGenerating,
                setIsGenerating,
                error,
                setError,
                cacheImage,
                getCachedImage,
                favorites,
                toggleFavorite,
                clearAllGeneratedFloors,
                generatedImagesCache,
            }}
        >
            {children}
        </FlooringContext.Provider>
    );
};

export const useFlooring = () => {
    const context = useContext(FlooringContext);
    if (context === undefined) {
        throw new Error('useFlooring must be used within a FlooringProvider');
    }
    return context;
};
