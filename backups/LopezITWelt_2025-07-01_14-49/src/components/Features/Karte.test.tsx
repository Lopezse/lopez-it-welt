import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Karte, KarteFusszeile, KarteInhalt, KarteKopfzeile } from './Karte';

describe('Karte', () => {
    it('sollte korrekt gerendert werden', () => {
        render(<Karte>Test Karten Inhalt</Karte>);
        expect(screen.getByText('Test Karten Inhalt')).toBeInTheDocument();
    });

    it('sollte mit verschiedenen Varianten gerendert werden', () => {
        const { rerender } = render(<Karte variante="standard">Standard</Karte>);
        const standardKarte = screen.getByText('Standard').closest('div');
        expect(standardKarte).toHaveClass('schatten-klein');

        rerender(<Karte variante="elevated">Erhöht</Karte>);
        const elevatedKarte = screen.getByText('Erhöht').closest('div');
        expect(elevatedKarte).toHaveClass('schatten-gross');

        rerender(<Karte variante="outlined">Umrandet</Karte>);
        const outlinedKarte = screen.getByText('Umrandet').closest('div');
        expect(outlinedKarte).toHaveClass('rahmen');
    });

    it('sollte mit verschiedenen Größen gerendert werden', () => {
        const { rerender } = render(<Karte groesse="klein">Klein</Karte>);
        const smallKarte = screen.getByText('Klein').closest('div');
        expect(smallKarte).toHaveClass('padding-4');

        rerender(<Karte groesse="gross">Groß</Karte>);
        const largeKarte = screen.getByText('Groß').closest('div');
        expect(largeKarte).toHaveClass('padding-8');
    });

    it('sollte klickbar sein wenn klickbar true ist', () => {
        const handleClick = jest.fn();
        render(<Karte klickbar onClick={handleClick}>Klickbare Karte</Karte>);

        const karte = screen.getByRole('button', { name: 'Klickbare Karte' });
        expect(karte).toBeInTheDocument();
        expect(karte).toHaveAttribute('tabIndex', '0');

        fireEvent.click(karte);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('sollte KarteKopfzeile korrekt rendern', () => {
        render(
            <Karte>
                <KarteKopfzeile>Kopfzeilen Inhalt</KarteKopfzeile>
                <div>Hauptinhalt</div>
            </Karte>
        );

        expect(screen.getByText('Kopfzeilen Inhalt')).toBeInTheDocument();
        expect(screen.getByText('Hauptinhalt')).toBeInTheDocument();
    });

    it('sollte KarteInhalt korrekt rendern', () => {
        render(
            <Karte>
                <KarteInhalt>Inhaltsbereich</KarteInhalt>
            </Karte>
        );

        expect(screen.getByText('Inhaltsbereich')).toBeInTheDocument();
    });

    it('sollte KarteFusszeile korrekt rendern', () => {
        render(
            <Karte>
                <div>Hauptinhalt</div>
                <KarteFusszeile>Fusszeilen Inhalt</KarteFusszeile>
            </Karte>
        );

        expect(screen.getByText('Fusszeilen Inhalt')).toBeInTheDocument();
    });
}); 