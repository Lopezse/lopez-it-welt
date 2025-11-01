import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Button } from './Button';

describe('Button', () => {
  it('should render correctly', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const button = screen.getByRole('button', { name: 'Click Me' });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should render with different variants', () => {
    const { rerender } = render(<Button variante="haupt">Haupt</Button>);
    expect(screen.getByRole('button')).toHaveClass('hintergrund-hauptfarbe');

    rerender(<Button variante="sekundaer">Sekundär</Button>);
    expect(screen.getByRole('button')).toHaveClass('hintergrund-akzentfarbe');
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<Button groesse="klein">Klein</Button>);
    expect(screen.getByRole('button')).toHaveClass('padding-x-3');

    rerender(<Button groesse="gross">Groß</Button>);
    expect(screen.getByRole('button')).toHaveClass('padding-x-6');
  });

  it('should show loading state', () => {
    render(<Button ladezustand={true}>Loading</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Loading')).toHaveClass('sr-only');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });
});
