import { render, screen } from '@testing-library/react';
import Hauptbereiche from './Hauptbereiche';

describe('Hauptbereiche', () => {
  it('should render correctly', () => {
    render(<Hauptbereiche />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    render(<Hauptbereiche />);
    // Add interaction tests here
  });
});
