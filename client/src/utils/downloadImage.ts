import type { Product } from '../context/FlooringContext';

export const generateImageBlob = async (imageSrc: string, product: Product | undefined): Promise<Blob | null> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Load main image
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageSrc;
    });

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw main image
    ctx.drawImage(img, 0, 0);

    // Helper to load image with fallback extensions
    const loadProductImage = async (baseUrl: string): Promise<HTMLImageElement | null> => {
        const extensions = ['.png', '.jpg', '.jpeg', '.webp'];
        for (const ext of extensions) {
            try {
                const img = new Image();
                img.crossOrigin = "anonymous";
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = `${baseUrl}${ext}`;
                });
                return img;
            } catch (e) {
                continue;
            }
        }
        return null;
    };

    // Calculate sizes based on canvas width
    const isVertical = canvas.height > canvas.width;
    const verticalMultiplier = isVertical ? 1.4 : 1.0;
    const scale = (canvas.width / 1920) * verticalMultiplier; // Reference width with multiplier
    const EDGE_MARGIN = 40 * scale; // Consistent margin for logo and card

    // Load logo
    const logo = new Image();
    logo.crossOrigin = "anonymous";
    await new Promise((resolve) => {
        logo.onload = resolve;
        logo.onerror = (e) => {
            console.warn("Failed to load logo", e);
            resolve(null);
        };
        logo.src = '/twenty-oak-logo.png';
    });

    // Draw logo in TOP RIGHT
    if (logo.complete && logo.naturalWidth > 0) {
        const logoWidth = (canvas.width * 0.15) * verticalMultiplier; // 15% of image width * multiplier
        const logoHeight = (logo.naturalHeight / logo.naturalWidth) * logoWidth;

        ctx.drawImage(
            logo,
            canvas.width - logoWidth - EDGE_MARGIN,
            EDGE_MARGIN, // Top margin
            logoWidth,
            logoHeight
        );
    }

    if (product) {
        const contentPadding = 24 * scale;
        const thumbSize = 120 * scale; // Increased thumbnail size
        const textGap = 20 * scale;

        // Font Sizes
        const brandFontSize = 16 * scale;
        const skuFontSize = 16 * scale;
        const nameFontSize = 28 * scale;
        const collectionFontSize = 20 * scale;

        // Measure Text Widths
        ctx.font = `bold ${brandFontSize}px sans-serif`;
        const brandText = (product.BRAND || 'Unknown Brand').toUpperCase();
        const brandMetrics = ctx.measureText(brandText);
        const brandPillPadding = 10 * scale;
        const brandPillWidth = brandMetrics.width + (brandPillPadding * 2);
        const brandHeight = 28 * scale; // Fixed height for the pill

        ctx.font = `${skuFontSize}px monospace`;
        const skuText = product.SKUNumber || '';
        const skuMetrics = ctx.measureText(skuText);
        const skuGap = 12 * scale;

        const row1Width = brandPillWidth + skuGap + skuMetrics.width;

        ctx.font = `bold ${nameFontSize}px sans-serif`;
        const nameText = product.ProductName || 'Unknown Product';
        const nameMetrics = ctx.measureText(nameText);

        ctx.font = `${collectionFontSize}px sans-serif`;
        const collectionText = product.Collection || 'Unknown Collection';
        const collectionMetrics = ctx.measureText(collectionText);

        // Calculate Vertical Spacing
        const row1BottomMargin = 12 * scale;
        const nameBottomMargin = 12 * scale; // Reduced from 34 to tighten up and center better

        // Total Text Block Height
        // Brand Pill Height + Margin + Name Height (approx) + Margin + Collection Height (approx)
        const textBlockHeight = brandHeight + row1BottomMargin + nameFontSize + nameBottomMargin + collectionFontSize;

        // Calculate Dynamic Card Dimensions
        const maxTextWidth = Math.max(row1Width, nameMetrics.width, collectionMetrics.width);
        const cardWidth = contentPadding + thumbSize + textGap + maxTextWidth + contentPadding;

        // Card Height is determined by the tallest content (Thumbnail vs Text Block) + Padding
        const maxContentHeight = Math.max(thumbSize, textBlockHeight);
        const cardHeight = maxContentHeight + (contentPadding * 2);
        const cardRadius = 16 * scale;

        // Position Card (Fixed Right/Bottom Margin)
        const cardX = canvas.width - cardWidth - EDGE_MARGIN;
        const cardY = canvas.height - cardHeight - EDGE_MARGIN;

        // Draw Card Background
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 25 * scale;
        ctx.shadowOffsetY = 12 * scale;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardWidth, cardHeight, cardRadius);
        ctx.fill();
        ctx.restore();

        // Draw Border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1 * scale;
        ctx.stroke();

        // Calculate Centered Y Positions
        const thumbY = cardY + contentPadding + (maxContentHeight - thumbSize) / 2;
        const textBlockStartY = cardY + contentPadding + (maxContentHeight - textBlockHeight) / 2;

        // Load and Draw Product Thumbnail
        if (product.ProductImage) {
            const productImg = await loadProductImage(product.ProductImage);
            if (productImg) {
                // Draw thumbnail background/border
                const thumbX = cardX + contentPadding;

                ctx.save();
                // Clip for rounded corners on thumbnail
                ctx.beginPath();
                ctx.roundRect(thumbX, thumbY, thumbSize, thumbSize, 10 * scale);
                ctx.clip();

                // Draw image covering the area
                const aspect = productImg.naturalWidth / productImg.naturalHeight;
                let drawW = thumbSize;
                let drawH = thumbSize;
                let offX = 0;
                let offY = 0;

                if (aspect > 1) {
                    drawW = thumbSize * aspect;
                    offX = (drawW - thumbSize) / 2;
                } else {
                    drawH = thumbSize / aspect;
                    offY = (drawH - thumbSize) / 2;
                }

                ctx.drawImage(productImg, thumbX - offX, thumbY - offY, drawW, drawH);
                ctx.restore();

                // Thumbnail border
                ctx.strokeStyle = '#e5e7eb'; // gray-200
                ctx.lineWidth = 1 * scale;
                ctx.strokeRect(thumbX, thumbY, thumbSize, thumbSize);
            } else {
                // Placeholder if image fails
                ctx.fillStyle = '#f3f4f6';
                ctx.fillRect(cardX + contentPadding, thumbY, thumbSize, thumbSize);
            }
        }

        // Text Content Drawing
        const textX = cardX + contentPadding + thumbSize + textGap;
        let currentTextY = textBlockStartY;

        // Brand & SKU Row
        ctx.textBaseline = 'top';

        // Brand Pill
        ctx.fillStyle = 'rgba(234, 88, 12, 0.1)'; // secondary/10
        ctx.beginPath();
        ctx.roundRect(textX, currentTextY, brandPillWidth, brandHeight, 999);
        ctx.fill();

        ctx.font = `bold ${brandFontSize}px sans-serif`;
        ctx.fillStyle = '#ea580c'; // secondary color
        // Center text in pill vertically
        const brandTextY = currentTextY + (brandHeight - brandFontSize) / 2 - (2 * scale); // slight adjustment for baseline
        ctx.fillText(brandText, textX + brandPillPadding, brandTextY);

        // SKU
        ctx.font = `${skuFontSize}px monospace`;
        ctx.fillStyle = '#6b7280'; // gray-500
        // Align SKU baseline with Brand text roughly, or center it relative to pill
        const skuTextY = currentTextY + (brandHeight - skuFontSize) / 2;
        ctx.fillText(skuText, textX + brandPillWidth + skuGap, skuTextY);

        // Product Name
        currentTextY += brandHeight + row1BottomMargin;
        ctx.font = `bold ${nameFontSize}px sans-serif`;
        ctx.fillStyle = '#111827'; // gray-900
        ctx.fillText(nameText, textX, currentTextY);

        // Collection
        currentTextY += nameFontSize + nameBottomMargin;
        ctx.font = `${collectionFontSize}px sans-serif`;
        ctx.fillStyle = '#4b5563'; // gray-600
        ctx.fillText(collectionText, textX, currentTextY);
    }

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/png');
    });
};

export const downloadImage = async (imageSrc: string, product: Product | undefined) => {
    try {
        const blob = await generateImageBlob(imageSrc, product);
        if (!blob) throw new Error("Failed to generate image blob");

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `twenty-oak-floor-${product?.SKUNumber || 'visualization'}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    } catch (err) {
        console.error("Download failed", err);
        throw err;
    }
};
