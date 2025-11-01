import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

/**
 * Barrierefreier, CI-konformer Button
 * - Unterstützt Keyboard, ARIA, Fokus, Dark Mode
 * - Farbvarianten nach CI
 * - Vollständig testbar
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  ...props
}) => {
  const base =
    'px-4 py-2 rounded font-semibold focus:outline-none focus-visible:ring-2 transition-colors';
  const variants: Record<string, string> = {
    primary:
      'bg-[#0055A4] text-white hover:bg-[#003366] focus-visible:ring-[#F5A623]',
    secondary:
      'bg-[#F5A623] text-black hover:bg-[#FFD700] focus-visible:ring-[#0055A4]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-300',
  };
  return (
    <button
      type='button'
      className={`${base} ${variants[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-pressed={props['aria-pressed']}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
