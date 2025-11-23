import { cn } from '@/lib/utils';
import React from 'react';

interface ResponsiveImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'auto';
}

export const ResponsiveImage = React.forwardRef<
  HTMLImageElement,
  ResponsiveImageProps
>(
  (
    {
      src,
      alt,
      sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
      priority = false,
      placeholder = 'empty',
      blurDataURL,
      className,
      aspectRatio = 'auto',
      ...props
    },
    ref
  ) => {
    const aspectRatioClasses = {
      square: 'aspect-square',
      video: 'aspect-video',
      auto: 'aspect-auto',
    };

    return (
      <div
        className={cn(
          'relative overflow-hidden',
          aspectRatioClasses[aspectRatio],
          className
        )}
      >
        <img
          ref={ref}
          src={src}
          alt={alt}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          className={cn(
            'w-full h-full object-cover',
            'transition-opacity duration-300',
            placeholder === 'blur' && blurDataURL && 'blur-sm'
          )}
          style={{
            ...(placeholder === 'blur' &&
              blurDataURL && {
                backgroundImage: `url(${blurDataURL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }),
          }}
          {...props}
        />
      </div>
    );
  }
);

ResponsiveImage.displayName = 'ResponsiveImage';
