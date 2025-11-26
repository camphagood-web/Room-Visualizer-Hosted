import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateImageBlob } from './downloadImage';
import type { Product } from '../context/FlooringContext';

export const downloadAllImages = async (
    images: Record<string, string>,
    products: Product[]
) => {
    const zip = new JSZip();
    const imageEntries = Object.entries(images);

    if (imageEntries.length === 0) return;

    const promises = imageEntries.map(async ([sku, imageSrc]) => {
        const product = products.find(p => p.SKUNumber === sku);
        const blob = await generateImageBlob(imageSrc, product);
        if (blob) {
            const fileName = `twenty-oak-floor-${sku}.png`;
            zip.file(fileName, blob);
        }
    });

    await Promise.all(promises);

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'twenty-oak-gallery.zip');
};
