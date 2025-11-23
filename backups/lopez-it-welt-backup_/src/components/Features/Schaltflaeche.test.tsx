import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Schaltflaeche } from './Schaltflaeche';

describe('Schaltflaeche', () => {
  it('sollte korrekt gerendert werden', () => {
    render(<Schaltflaeche>Test Schaltfläche</Schaltflaeche>);
    expect(
      screen.getByRole('button', { name: 'Test Schaltfläche' })
    ).toBeInTheDocument();
  });

  it('sollte Benutzerinteraktionen verarbeiten', () => {
    const handleClick = jest.fn();
    render(<Schaltflaeche onClick={handleClick}>Klick Mich</Schaltflaeche>);

    const button = screen.getByRole('button', { name: 'Klick Mich' });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('sollte mit verschiedenen Varianten gerendert werden', () => {
    const { rerender } = render(
      <Schaltflaeche variante='haupt'>Haupt</Schaltflaeche>
    );
    expect(screen.getByRole('button')).toHaveClass('hintergrund-hauptfarbe');

    rerender(<Schaltflaeche variante='sekundaer'>Sekundär</Schaltflaeche>);
    expect(screen.getByRole('button')).toHaveClass('hintergrund-akzentfarbe');
  });

  it('sollte mit verschiedenen Größen gerendert werden', () => {
    const { rerender } = render(
      <Schaltflaeche groesse='klein'>Klein</Schaltflaeche>
    );
    expect(screen.getByRole('button')).toHaveClass('padding-x-3');

    rerender(<Schaltflaeche groesse='gross'>Groß</Schaltflaeche>);
    expect(screen.getByRole('button')).toHaveClass('padding-x-6');
  });

  it('sollte Ladezustand anzeigen', () => {
    render(<Schaltflaeche ladezustand={true}>Laden</Schaltflaeche>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Laden')).toHaveClass('sr-only');
  });

  it('sollte deaktiviert sein wenn disabled prop true ist', () => {
    render(<Schaltflaeche disabled>Deaktiviert</Schaltflaeche>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });
});
