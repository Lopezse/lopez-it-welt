/**
 * import React from 'react';
 * @description Auto-generated documentation
 */
import { cn } from '@/lib/utils';
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'premium';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  interactive?: boolean;
  hover?: boolean;
  clickable?: boolean;
  as?: 'div' | 'article' | 'section';
}

const cardVariants = {
  default: `
    bg-weiss border border-weiss/20 shadow-mittel
    hover:shadow-gross transition-all duration-uebergang-normal
  `,
  elevated: `
    bg-weiss border border-weiss/20 shadow-gross
    hover:shadow-xl hover:-translate-y-1
    transition-all duration-uebergang-normal
  `,
  outlined: `
    bg-transparent border-2 border-hauptblau/30
    hover:border-hauptblau/50 hover:bg-hauptblau/5
    transition-all duration-uebergang-normal
  `,
  glass: `
    bg-weiss/10 backdrop-blur-xl border border-weiss/20
    hover:bg-weiss/25 hover:border-weiss/40 hover:shadow-2xl hover:shadow-weiss/25
    transition-all duration-uebergang-normal
  `,
  premium: `
    bg-gradient-to-br from-weiss/95 to-weiss/90 backdrop-blur-xl
    border border-weiss/30 shadow-xl
    hover:shadow-2xl hover:shadow-hauptblau/20 hover:-translate-y-2
    hover:border-hauptblau/40 hover:bg-gradient-to-br hover:from-weiss hover:to-weiss/95
    transition-all duration-uebergang-normal
    before:absolute before:inset-0 before:bg-gradient-to-br before:from-hauptblau/5 before:to-transparent
    before:opacity-0 before:hover:opacity-100 before:transition-opacity before:duration-300
  `,
};

const cardPadding = {
  none: '',
  sm: 'p-3',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
  xl: 'p-8 sm:p-12',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      children,
      interactive = false,
      hover = false,
      clickable = false,
      as: Component = 'div',
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'relative rounded-abgerundet-xl overflow-hidden',
          cardVariants[variant],
          cardPadding[padding],
          interactive && 'cursor-pointer',
          hover && 'hover:scale-105',
          clickable &&
            'cursor-pointer focus:outline-none focus:ring-4 focus:ring-hauptblau/30',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';
