export default function CookieEinstellungenPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Cookie-Einstellungen</h1>

      <div className='prose max-w-none'>
        <h2>Cookie-Verwaltung</h2>
        <p>
          Diese Website verwendet Cookies, um Ihnen das bestmögliche
          Nutzererlebnis zu bieten. Sie können Ihre Cookie-Einstellungen
          jederzeit anpassen.
        </p>

        <h2>Was sind Cookies?</h2>
        <p>
          Cookies sind kleine Textdateien, die auf Ihrem Computer gespeichert
          werden, wenn Sie eine Website besuchen. Sie werden häufig verwendet,
          um Websites funktionsfähig oder effizienter zu machen sowie dem
          Websitebetreiber Informationen zu liefern.
        </p>

        <h2>Cookie-Kategorien</h2>

        <h3>Notwendige Cookies</h3>
        <p>
          Diese Cookies sind für das Funktionieren der Website erforderlich und
          können in unseren Systemen nicht abgeschaltet werden. Sie werden in
          der Regel nur als Reaktion auf von Ihnen getätigte Aktionen gesetzt,
          wie z. B. das Festlegen Ihrer Datenschutzeinstellungen, das Anmelden
          oder das Ausfüllen von Formularen.
        </p>

        <h3>Funktionale Cookies</h3>
        <p>
          Diese Cookies ermöglichen es der Website, erweiterte Funktionalität
          und Personalisierung bereitzustellen. Sie können von uns oder von
          Drittanbietern gesetzt werden, deren Dienste wir auf unseren Seiten
          verwenden.
        </p>

        <h3>Analytics-Cookies</h3>
        <p>
          Diese Cookies ermöglichen es uns, Besuche und Verkehrsquellen zu
          zählen, damit wir die Leistung unserer Website messen und verbessern
          können. Sie helfen uns zu verstehen, welche Seiten am beliebtesten und
          am wenigsten beliebt sind und wie Besucher sich auf der Website
          bewegen.
        </p>

        <h2>Ihre Cookie-Einstellungen</h2>

        <div className='bg-gray-100 p-4 rounded-lg mb-6'>
          <h3 className='text-lg font-semibold mb-4'>Cookie-Präferenzen</h3>

          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='font-medium'>Notwendige Cookies</h4>
                <p className='text-sm text-gray-600'>
                  Immer aktiv - für die Grundfunktionen der Website erforderlich
                </p>
              </div>
              <div className='bg-green-500 text-white px-3 py-1 rounded text-sm'>
                Aktiv
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <h4 className='font-medium'>Funktionale Cookies</h4>
                <p className='text-sm text-gray-600'>
                  Verbessern die Funktionalität und Personalisierung
                </p>
              </div>
              <div className='bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm'>
                Inaktiv
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <h4 className='font-medium'>Analytics-Cookies</h4>
                <p className='text-sm text-gray-600'>
                  Helfen uns, die Website zu verbessern
                </p>
              </div>
              <div className='bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm'>
                Inaktiv
              </div>
            </div>
          </div>
        </div>

        <h2>Cookie-Einstellungen ändern</h2>
        <p>
          Sie können Ihre Cookie-Einstellungen jederzeit ändern. Bitte beachten
          Sie, dass das Deaktivieren bestimmter Cookies die Funktionalität der
          Website beeinträchtigen kann.
        </p>

        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
          <h3 className='text-lg font-semibold text-blue-800 mb-2'>Hinweis</h3>
          <p className='text-blue-700'>
            Ihre Cookie-Einstellungen werden in Ihrem Browser gespeichert und
            bleiben bestehen, bis Sie sie ändern oder Ihren Browser-Cache
            löschen.
          </p>
        </div>

        <h2>Drittanbieter-Cookies</h2>
        <p>
          Einige Cookies werden von Drittanbietern gesetzt, die auf unserer
          Website tätig sind. Diese helfen uns, die Website zu verbessern und
          Ihnen relevante Inhalte anzuzeigen.
        </p>

        <h2>Weitere Informationen</h2>
        <p>
          Für weitere Informationen zu Cookies und deren Verwendung besuchen Sie
          bitte unsere
          <a
            href='/datenschutz'
            className='text-blue-600 hover:text-blue-800 underline'
          >
            Datenschutzerklärung
          </a>
          .
        </p>

        <h2>Kontakt</h2>
        <p>
          Bei Fragen zu unseren Cookie-Einstellungen kontaktieren Sie uns bitte:
        </p>
        <p>
          Lopez IT Welt
          <br />
          [Ihre Kontaktdaten]
        </p>
      </div>
    </div>
  );
}
