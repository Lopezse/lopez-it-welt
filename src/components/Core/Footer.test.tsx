import { render, screen } from '@testing-library/react';
import React from 'react';
import Footer from './Footer';

describe('Footer', () => {
  it('should render correctly when showFooter is true', () => {
    render(<Footer showFooter={true} />);
    expect(screen.getByText('Lopez IT Welt')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Rechtliches')).toBeInTheDocument();
    expect(screen.getByText('Kontakt')).toBeInTheDocument();
  });

  it('should not render when showFooter is false', () => {
    render(<Footer showFooter={false} />);
    expect(screen.queryByText('Lopez IT Welt')).not.toBeInTheDocument();
  });

  it('should render by default when showFooter is not provided', () => {
    render(<Footer />);
    expect(screen.getByText('Lopez IT Welt')).toBeInTheDocument();
  });

  it('should contain correct links', () => {
    render(<Footer />);
    expect(screen.getByText('Datenschutz')).toBeInTheDocument();
    expect(screen.getByText('Impressum')).toBeInTheDocument();
    expect(screen.getByText('Cookie-Einstellungen')).toBeInTheDocument();
  });

  it('should contain correct contact information', () => {
    render(<Footer />);
    expect(screen.getByText(/info@lopez-it-welt\.de/)).toBeInTheDocument();
    expect(screen.getByText(/\+49 \(0\) 5031 7005576/)).toBeInTheDocument();
    expect(screen.getByText(/Alte Bahnhofstraße 13/)).toBeInTheDocument();
  });
});
