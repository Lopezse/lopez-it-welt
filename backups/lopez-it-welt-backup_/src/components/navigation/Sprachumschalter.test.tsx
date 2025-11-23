import { render, screen } from '@testing-library/react';
import Sprachumschalter from './Sprachumschalter';

describe('Sprachumschalter', () => {
  it('should render correctly', () => {
    render(<Sprachumschalter />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    render(<Sprachumschalter />);
    // Add interaction tests here
  });
});
