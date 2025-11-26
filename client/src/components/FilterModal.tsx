import { useState, useEffect, useMemo } from 'react';
import { X, RotateCcw } from 'lucide-react';
import type { Product } from '../context/FlooringContext';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
    currentFilters: FilterState;
    availableOptions: FilterOptions;
    products: Product[];
}

export interface FilterState {
    brand: string[];
    collection: string[];
    price: string[];
    type: string[];
    shade: string[];
}

export interface FilterOptions {
    brands: string[];
    collections: string[];
    prices: string[];
    types: string[];
    shades: string[];
}

export const FilterModal = ({ isOpen, onClose, onApply, currentFilters, availableOptions, products }: FilterModalProps) => {
    const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);

    // Sync local state when modal opens or currentFilters change
    useEffect(() => {
        setLocalFilters(currentFilters);
    }, [currentFilters, isOpen]);

    const getProductValue = (product: Product, key: keyof FilterState): string => {
        switch (key) {
            case 'brand': return product.BRAND;
            case 'collection': return product.Collection;
            case 'price': return product.ProductPrice;
            case 'type': return product.ProductType;
            case 'shade': return product.ProductShade;
            default: return '';
        }
    };

    const validOptions = useMemo(() => {
        const result = {
            brand: new Set<string>(),
            collection: new Set<string>(),
            price: new Set<string>(),
            type: new Set<string>(),
            shade: new Set<string>()
        };

        const categories: Array<keyof FilterState> = ['brand', 'collection', 'price', 'type', 'shade'];

        categories.forEach(targetCategory => {
            // Filter products by all categories EXCEPT the target category
            // This determines which options in the target category are compatible with OTHER selections
            const filtered = products.filter(product => {
                return categories.every(filterKey => {
                    if (filterKey === targetCategory) return true; // Skip current category
                    if (localFilters[filterKey].length === 0) return true; // No filter set

                    const productValue = getProductValue(product, filterKey);
                    return localFilters[filterKey].includes(productValue);
                });
            });

            filtered.forEach(p => {
                const val = getProductValue(p, targetCategory);
                if (val) result[targetCategory].add(val);
            });
        });

        return result;
    }, [products, localFilters]);

    const liveResultCount = useMemo(() => {
        return products.filter(product => {
            return (Object.keys(localFilters) as Array<keyof FilterState>).every(filterKey => {
                if (localFilters[filterKey].length === 0) return true;
                const productValue = getProductValue(product, filterKey);
                return localFilters[filterKey].includes(productValue);
            });
        }).length;
    }, [products, localFilters]);

    const sortedCollections = useMemo(() => {
        const otherFiltersActive = localFilters.brand.length > 0 ||
            localFilters.price.length > 0 ||
            localFilters.type.length > 0 ||
            localFilters.shade.length > 0;

        if (!otherFiltersActive) {
            return availableOptions.collections;
        }

        const validSet = validOptions.collection;
        const active = availableOptions.collections.filter(c => validSet.has(c));
        const inactive = availableOptions.collections.filter(c => !validSet.has(c));

        return [...active.sort(), ...inactive.sort()];
    }, [availableOptions.collections, localFilters, validOptions.collection]);

    if (!isOpen) return null;

    const toggleFilter = (category: keyof FilterState, value: string) => {
        setLocalFilters(prev => {
            const current = prev[category];
            const isSelected = current.includes(value);

            if (isSelected) {
                return { ...prev, [category]: current.filter(item => item !== value) };
            } else {
                return { ...prev, [category]: [...current, value] };
            }
        });
    };

    const handleReset = () => {
        setLocalFilters({
            brand: [],
            collection: [],
            price: [],
            type: [],
            shade: []
        });
    };

    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    const renderFilterSection = (title: string, category: keyof FilterState, options: string[]) => {
        const validSet = validOptions[category];

        return (
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
                <div className="flex flex-wrap gap-2">
                    {options.map(option => {
                        const isSelected = localFilters[category].includes(option);
                        const isValid = validSet.has(option);
                        const isDisabled = !isValid && !isSelected; // Disable if invalid AND not currently selected

                        return (
                            <button
                                key={option}
                                onClick={() => !isDisabled && toggleFilter(category, option)}
                                disabled={isDisabled}
                                className={`px-4 py-2 rounded-full text-sm transition-colors border ${isSelected
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : isDisabled
                                        ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <RotateCcw size={18} className="text-gray-400" />
                        <h2 className="text-lg font-bold text-gray-900">Filter</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {renderFilterSection('Type', 'type', availableOptions.types)}

                    <div className="h-px bg-gray-100 my-4" />

                    {renderFilterSection('Shade', 'shade', availableOptions.shades)}

                    <div className="h-px bg-gray-100 my-4" />

                    {renderFilterSection('Price', 'price', availableOptions.prices)}

                    <div className="h-px bg-gray-100 my-4" />

                    {renderFilterSection('Brand', 'brand', availableOptions.brands)}

                    <div className="h-px bg-gray-100 my-4" />

                    {renderFilterSection('Collection', 'collection', sortedCollections)}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between gap-4">
                    <button
                        onClick={handleReset}
                        className="px-6 py-3 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black transition-colors flex items-center justify-center gap-2"
                    >
                        <span>Show {liveResultCount} results</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
