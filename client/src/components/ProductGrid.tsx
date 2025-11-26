import type { Product } from '../context/FlooringContext';
import { TiltCard } from './TiltCard';

interface ProductGridProps {
    products: Product[];
    onSelectProduct: (product: Product) => void;
}

export const ProductGrid = ({ products, onSelectProduct }: ProductGridProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            {products.map((product, index) => (
                <TiltCard
                    key={`${product.SKUNumber}-${index}`}
                    product={product}
                    onClick={() => onSelectProduct(product)}
                />
            ))}
        </div>
    );
};
