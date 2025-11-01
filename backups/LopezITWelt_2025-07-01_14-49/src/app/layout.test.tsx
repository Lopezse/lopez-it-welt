import { render, screen } from '@testing-library/react';
import layout from './layout';

describe('layout', () => {
  it('should render correctly', () => {
    render(<layout />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    render(<layout />);
    // Add interaction tests here
  });
});
