import { cn } from '@/lib/utils';
import React from 'react';

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
    icon: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'muted';
    animated?: boolean;
    children?: React.ReactNode;
}

const iconSizes = {
    xs: 'w-4 h-4 text-sm',
    sm: 'w-6 h-6 text-lg',
    md: 'w-8 h-8 text-xl',
    lg: 'w-12 h-12 text-2xl',
    xl: 'w-16 h-16 text-3xl',
    '2xl': 'w-20 h-20 text-4xl',
};

const iconVariants = {
    default: 'text-dunkelgrau',
    primary: 'text-hauptblau',
    secondary: 'text-akzentblau',
    accent: 'text-gruen',
    muted: 'text-hellgrau',
};

export const Icon = React.forwardRef<HTMLDivElement, IconProps>(
    (
        {
            className,
            icon,
            size = 'md',
            variant = 'default',
            animated = false,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'flex items-center justify-center',
                    iconSizes[size],
                    iconVariants[variant],
                    animated && 'transition-all duration-uebergang-normal hover:scale-110',
                    className
                )}
                role='img'
                aria-hidden='true'
                {...props}
            >
                {icon}
                {children}
            </div>
        );
    }
);

Icon.displayName = 'Icon'; 