import React, { useId } from 'react';

export interface OrganicSilhouetteImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Source URL of the image */
  src: string;
  /** Accessible alternative text for the image */
  alt: string;
  /** Custom CSS classes for the outer container */
  className?: string;
  /** Custom CSS classes for the internal image */
  imageClassName?: string;
  /** Aspect ratio of the container (e.g., '1/1', '4/5', '16/9') */
  aspectRatio?: string;
  /** CSS object-position for the image (default: 'center') */
  objectPosition?: string;
  /** Optional children overlay to place over the image */
  children?: React.ReactNode;
}

/**
 * Exact SVG path in normalized objectBoundingBox coordinates [0..1]
 * reproducing the organic, asymmetrical flowing corner contour:
 * - Top-left: High rounded top crest transitioning into a curved inward indentation and shoulder
 * - Top-right: Large, luxurious rounded corner
 * - Bottom-left: Soft, organic bulging convex curve
 * - Bottom-right: Asymmetric inward concave scoop & outward foot transition
 */
export const ORGANIC_SILHOUETTE_PATH =
  'M 0.33 0 ' +
  'L 0.84 0 ' +
  'C 0.93 0, 1 0.07, 1 0.20 ' +
  'L 1 0.60 ' +
  'C 1 0.72, 0.94 0.81, 0.86 0.85 ' +
  'C 0.79 0.89, 0.73 0.94, 0.68 1.0 ' +
  'L 0.16 1.0 ' +
  'C 0.06 1.0, 0 0.94, 0 0.84 ' +
  'L 0 0.35 ' +
  'C 0 0.26, 0.08 0.24, 0.14 0.25 ' +
  'C 0.20 0.26, 0.23 0.12, 0.26 0.04 ' +
  'C 0.28 0.01, 0.30 0, 0.33 0 Z';

/**
 * OrganicSilhouetteImage
 * 
 * Renders an image clipped to the organic, flowing asymmetrical silhouette
 * with zero distortion and fluid responsiveness across all screen sizes.
 */
export const OrganicSilhouetteImage: React.FC<OrganicSilhouetteImageProps> = ({
  src,
  alt,
  className = '',
  imageClassName = '',
  aspectRatio,
  objectPosition = 'center',
  children,
  style,
  ...rest
}) => {
  const rawId = useId();
  // Sanitize the ID to be a safe CSS selector and SVG ID
  const clipId = `organic-clip-${rawId.replace(/[^a-zA-Z0-9-_]/g, '')}`;

  return (
    <div
      className={`relative bg-white overflow-hidden ${className}`}
      style={{
        aspectRatio: aspectRatio || undefined,
        ...style,
      }}
    >
      {/* Hidden Inline SVG defining the responsive clipPath */}
      <svg
        aria-hidden="true"
        className="absolute pointer-events-none w-0 h-0 opacity-0 overflow-hidden"
        style={{ position: 'absolute', width: 0, height: 0 }}
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={ORGANIC_SILHOUETTE_PATH} />
          </clipPath>
        </defs>
      </svg>

      {/* Clipped Image Container */}
      <div
        className="w-full h-full relative"
        style={{
          clipPath: `url(#${clipId})`,
          WebkitClipPath: `url(#${clipId})`,
        }}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover block select-none ${imageClassName}`}
          style={{ objectPosition }}
          {...rest}
        />
        {children}
      </div>
    </div>
  );
};

export default OrganicSilhouetteImage;
