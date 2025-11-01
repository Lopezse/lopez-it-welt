/**
 * import React from 'react';
 * @description Auto-generated documentation
 */
import React from 'react';

export const Preisliste: React.FC = () => {
  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-6'>Preisliste: Kopierservice</h2>

      {/* Standardkopien */}
      <div className='mb-8'>
        <h3 className='text-xl font-semibold mb-4'>Standardkopien (A4)</h3>
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <div>Schwarz/weiß</div>
          <div>0,25 €</div>
          <div>Farbkopie</div>
          <div>0,60 €</div>
        </div>
      </div>

      {/* Mengenrabatt */}
      <div className='mb-8'>
        <h3 className='text-xl font-semibold mb-4'>
          Mengenrabatt (schwarz/weiß)
        </h3>
        <div className='grid grid-cols-2 gap-4'>
          <div>Ab 50 Stück</div>
          <div>0,20 €</div>
          <div>Ab 250 Stück</div>
          <div>0,15 €</div>
          <div>Ab 500 Stück</div>
          <div>0,12 €</div>
        </div>
      </div>

      {/* Zusatzleistungen */}
      <div className='mb-8'>
        <h3 className='text-xl font-semibold mb-4'>Zusatzleistungen</h3>
        <div className='grid grid-cols-2 gap-4'>
          <div>Dickeres Papier (100g-160g)</div>
          <div>+0,15 €</div>
          <div>Folie</div>
          <div>+0,50 €</div>
          <div>Vergrößern/Verkleinern</div>
          <div>+0,50 €</div>
          <div>Schneiden</div>
          <div>0,30 € pro Schnitt</div>
          <div>Scannen</div>
          <div>2,00 € pro 10 Minuten</div>
        </div>
      </div>

      <div className='text-sm text-gray-600 mt-4'>
        * Alle Preise inkl. MwSt.
      </div>
    </div>
  );
};

export default Preisliste;
