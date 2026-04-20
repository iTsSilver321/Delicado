import { ImageResponse } from 'next/og';
import { getProductBySlug } from '@/lib/products';

export const runtime = 'edge';

export const alt = 'Delicado Product';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            color: '#fff',
            fontSize: 48,
            fontFamily: 'serif',
          }}
        >
          Product Not Found
        </div>
      ),
      { ...size }
    );
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    process.env.VERCEL_URL ??
    'http://localhost:3000';
  const baseUrl = siteUrl.includes('http') ? siteUrl : `https://${siteUrl}`;

  const imageUrl = `${baseUrl}${product.images.tucked}`;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price / 100);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#0a0a0a',
          overflow: 'hidden',
        }}
      >
        {/* Product image — fills the left ~55% */}
        <div
          style={{
            display: 'flex',
            width: '55%',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* Gradient overlay from image to text area */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '40%',
              height: '100%',
              background:
                'linear-gradient(to right, rgba(10,10,10,0), rgba(10,10,10,1))',
              display: 'flex',
            }}
          />
        </div>

        {/* Text content — right side */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '45%',
            height: '100%',
            padding: '48px 48px 48px 0',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Brand name */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 40,
                height: 2,
                backgroundColor: '#c4a35a',
                marginRight: 12,
                display: 'flex',
              }}
            />
            <span
              style={{
                fontSize: 16,
                color: '#c4a35a',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontFamily: 'sans-serif',
              }}
            >
              Delicado
            </span>
          </div>

          {/* Product name */}
          <div
            style={{
              fontSize: 44,
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.15,
              marginBottom: 16,
              fontFamily: 'serif',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {product.name}
          </div>

          {/* Color indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: product.colorHex,
                border: '2px solid rgba(255,255,255,0.2)',
                marginRight: 10,
                display: 'flex',
              }}
            />
            <span
              style={{
                fontSize: 18,
                color: 'rgba(255,255,255,0.6)',
                fontFamily: 'sans-serif',
              }}
            >
              {product.color}
            </span>
          </div>

          {/* Price */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: '#c4a35a',
              fontFamily: 'sans-serif',
              display: 'flex',
            }}
          >
            {formattedPrice}
          </div>

          {/* Tagline */}
          <div
            style={{
              marginTop: 32,
              fontSize: 14,
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontFamily: 'sans-serif',
              display: 'flex',
            }}
          >
            Premium Embroidered Bedding
          </div>
        </div>

        {/* Decorative bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(to right, #c4a35a, #d4b96a, #c4a35a)',
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
