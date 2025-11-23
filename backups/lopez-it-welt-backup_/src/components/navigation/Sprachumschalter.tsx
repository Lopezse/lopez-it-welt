/**
 * 'use client';
 * @description Auto-generated documentation
 */
'use client';
import React, { useState } from 'react';
import { Button } from '../Features/Button';

interface Sprache {
  code: string;
  name: string;
  flag: string;
}

const sprachen: Sprache[] = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

interface SprachumschalterEigenschaften {
  aktuelleSprache?: string;
  onSpracheWechseln?: (sprache: string) => void;
  className?: string;
}

export const Sprachumschalter: React.FC<SprachumschalterEigenschaften> = ({
  aktuelleSprache = 'de',
  onSpracheWechseln,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ausgewaehlteSprache, setAusgewaehlteSprache] = useState(
    sprachen.find(s => s.code === aktuelleSprache) || sprachen[0]
  );

  const handleSpracheWechseln = (sprache: Sprache) => {
    setAusgewaehlteSprache(sprache);
    setIsOpen(false);
    onSpracheWechseln?.(sprache.code);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`relative inline-block ${className || ''}`}
      onKeyDown={handleKeyDown}
    >
      <Button
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup='listbox'
        aria-label={`Sprache auswählen. Aktuelle Sprache: ${ausgewaehlteSprache.name}`}
        variante='text'
        groesse='klein'
        className='flexbox elemente-zentriert abstand-x-2 padding-2 abgerundet'
      >
        <span className='text-gross' aria-hidden='true'>
          {ausgewaehlteSprache.flag}
        </span>
        <span className='text-klein versteckt sm:block'>
          {ausgewaehlteSprache.code.toUpperCase()}
        </span>
        <svg
          className={`breite-4 hoehe-4 uebergang-alles ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </Button>

      {isOpen && (
        <div
          className='absolute rechts-0 z-50 margin-oben-2 min-breite-48 hintergrund-weiss abgerundet-gross schatten-gross rahmen rahmen-grau-200'
          role='listbox'
          aria-label='Verfügbare Sprachen'
        >
          <div className='padding-2'>
            {sprachen.map(sprache => (
              <button
                key={sprache.code}
                onClick={() => handleSpracheWechseln(sprache)}
                className={`w-full flexbox elemente-zentriert abstand-x-3 padding-3 text-links abgerundet-mittel uebergang-farben hover:hintergrund-grau-100 fokus-umriss fokus-ring-hauptfarbe ${
                  sprache.code === ausgewaehlteSprache.code
                    ? 'hintergrund-hauptfarbe text-textweiss'
                    : 'text-textfarbe'
                }`}
                role='option'
                aria-selected={sprache.code === ausgewaehlteSprache.code}
                aria-label={`${sprache.name} auswählen`}
              >
                <span className='text-gross' aria-hidden='true'>
                  {sprache.flag}
                </span>
                <span className='text-basis schrift-mittel'>
                  {sprache.name}
                </span>
                {sprache.code === ausgewaehlteSprache.code && (
                  <svg
                    className='breite-4 hoehe-4 margin-links-auto'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
