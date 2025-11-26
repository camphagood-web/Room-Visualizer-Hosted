import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import type { Product } from '../context/FlooringContext';

export const useProductData = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/TwentyOak-Products-BrandsOnly.csv');
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results: Papa.ParseResult<Product>) => {
                        const dataWithImages = results.data.map(product => {
                            // Construct path: /samples/BRAND/Collection/SKUNumber.png
                            // The directory structure seems to be: samples/{BRAND}/{Collection}/{SKUNumber}.png based on the folders I saw (AHF Contract, etc.)
                            // Note: Some brands might have spaces, which should be fine in the path but might need encoding if used in URL directly.
                            // However, serving static files usually handles spaces or requires %20.
                            // Let's try using the raw strings first.

                            // We need to handle potential missing values or different structures if they exist, but based on the top level folders matching BRAND (e.g. "AHF Contract", "Beauflor"), this seems correct.
                            // Trim whitespace from fields to match folder names (CSV may have trailing spaces)

                            const brand = product.BRAND ? encodeURIComponent(product.BRAND.trim()) : '';
                            const collection = product.Collection ? encodeURIComponent(product.Collection.trim()) : '';
                            const sku = product.SKUNumber ? encodeURIComponent(product.SKUNumber.trim()) : '';

                            return {
                                ...product,
                                ProductImage: `/samples/${brand}/${collection}/${sku}`
                            };
                        });
                        setProducts(dataWithImages);
                        setLoading(false);
                    },
                    error: (err: Error) => {
                        setError(err.message);
                        setLoading(false);
                    }
                });
            } catch (err) {
                setError('Failed to load product data');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { products, loading, error };
};
