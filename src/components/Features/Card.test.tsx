import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './Card';

describe('Card', () => {
  it('should render correctly', () => {
    render(<Card>Test Card Content</Card>);
    expect(screen.getByText('Test Card Content')).toBeInTheDocument();
  });

  it('should render with different variants', () => {
    const { rerender } = render(<Card variante='standard'>Standard</Card>);
    const standardCard = screen.getByText('Standard').closest('div');
    expect(standardCard).toHaveClass('schatten-klein');

    rerender(<Card variante='elevated'>Elevated</Card>);
    const elevatedCard = screen.getByText('Elevated').closest('div');
    expect(elevatedCard).toHaveClass('schatten-gross');

    rerender(<Card variante='outlined'>Outlined</Card>);
    const outlinedCard = screen.getByText('Outlined').closest('div');
    expect(outlinedCard).toHaveClass('rahmen');
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<Card groesse='klein'>Klein</Card>);
    const smallCard = screen.getByText('Klein').closest('div');
    expect(smallCard).toHaveClass('padding-4');

    rerender(<Card groesse='gross'>Groß</Card>);
    const largeCard = screen.getByText('Groß').closest('div');
    expect(largeCard).toHaveClass('padding-8');
  });

  it('should be clickable when klickbar is true', () => {
    const handleClick = jest.fn();
    render(
      <Card klickbar onClick={handleClick}>
        Clickable Card
      </Card>
    );

    const card = screen.getByRole('button', { name: 'Klickbare Karte' });
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('tabIndex', '0');

    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should render CardHeader correctly', () => {
    render(
      <Card>
        <CardHeader>Header Content</CardHeader>
        <div>Body Content</div>
      </Card>
    );

    expect(screen.getByText('Header Content')).toBeInTheDocument();
    expect(screen.getByText('Body Content')).toBeInTheDocument();
  });

  it('should render CardContent correctly', () => {
    render(
      <Card>
        <CardContent>Content Area</CardContent>
      </Card>
    );

    expect(screen.getByText('Content Area')).toBeInTheDocument();
  });

  it('should render CardFooter correctly', () => {
    render(
      <Card>
        <div>Body Content</div>
        <CardFooter>Footer Content</CardFooter>
      </Card>
    );

    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });
});
