import { cn } from '@/lib/utils';
import React from 'react';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    variant?: 'default' | 'gradient' | 'accent' | 'muted';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    children: React.ReactNode;
    centered?: boolean;
}

const headingVariants = {
    default: 'text-dunkelgrau',
    gradient: 'bg-gradient-to-r from-hauptblau to-akzentblau bg-clip-text text-transparent',
    accent: 'text-hauptblau',
    muted: 'text-hellgrau',
};

const headingSizes = {
    xs: 'text-ueberschrift-klein',
    sm: 'text-ueberschrift-mittel',
    md: 'text-ueberschrift-gross',
    lg: 'text-ueberschrift-xl',
    xl: 'text-ueberschrift-2xl',
    '2xl': 'text-4xl sm:text-5xl lg:text-6xl',
    '3xl': 'text-5xl sm:text-6xl lg:text-7xl',
};

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    (
        {
            className,
            level = 2,
            variant = 'default',
            size = 'md',
            children,
            centered = false,
            ...props
        },
        ref
    ) => {
        const Component = `h${level}` as keyof JSX.IntrinsicElements;

        return (
            <Component
                ref={ref}
                className={cn(
                    'font-bold leading-tight',
                    headingVariants[variant],
                    headingSizes[size],
                    centered && 'text-center',
                    className
                )}
                {...props}
            >
                {children}
            </Component>
        );
    }
);

Heading.displayName = 'Heading'; 