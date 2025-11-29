import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function Impressum() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-[#2D5F3F] mb-12">Impressum & AGB</h1>

        <Card className="border-2 border-[#4A7C59]/20 mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-[#2D5F3F] mb-6">Impressum</h2>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-[#2D5F3F] mb-2">Firmeninformationen</h3>
                <p>AVANTURA PARK GmbH</p>
                <p>Eduard-Kittenberger-Gasse 97</p>
                <p>1230 Wien, Österreich</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D5F3F] mb-2">Kontakt</h3>
                <p>Telefon: 069910046404</p>
                <p>E-Mail: info@avanturapark.at</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D5F3F] mb-2">Rechtsform</h3>
                <p>GmbH (Gesellschaft mit beschränkter Haftung)</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D5F3F] mb-2">Geschäftsführung</h3>
                <p>Geschäftsführer: Dragan J.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#4A7C59]/20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-[#2D5F3F] mb-6">Allgemeine Geschäftsbedingungen</h2>
            
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="font-semibold text-[#2D5F3F] mb-2">1. Geltungsbereich</h3>
                <p>Diese AGB gelten für alle Besucher und Nutzer der Einrichtungen von AVANTURA PARK GmbH.</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D5F3F] mb-2">2. Buchung und Bezahlung</h3>
                <p>Buchungen können online oder telefonisch vorgenommen werden. Die Bezahlung erfolgt vor Ort in bar oder per Karte. Mit der Buchung erkennen Sie diese AGB an.</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D5F3F] mb-2">3. Stornierung</h3>
                <p>Stornierungen sind bis 24 Stunden vor dem gebuchten Termin kostenlos möglich. Bei späteren Stornierungen wird eine Bearbeitungsgebühr von 50% erhoben.</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D5F3F] mb-2">4. Aufsichtspflicht</h3>
                <p>Kinder unter 6 Jahren müssen während des gesamten Aufenthalts von einem Erziehungsberechtigten beaufsichtigt werden. Für ältere Kinder liegt die Aufsichtspflicht bei den Begleitpersonen.</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D5F3F] mb-2">5. Haftung</h3>
                <p>AVANTURA PARK haftet nicht für Schäden, die durch unsachgemäße Nutzung der Spielgeräte entstehen. Die Benutzung erfolgt auf eigene Gefahr. Wir haften nur bei grober Fahrlässigkeit oder Vorsatz.</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D5F3F] mb-2">6. Hausordnung</h3>
                <p>Besucher haben sich an die ausgehängte Hausordnung zu halten. Bei Verstößen behalten wir uns das Recht vor, Personen des Geländes zu verweisen.</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D5F3F] mb-2">7. Hygiene und Sicherheit</h3>
                <p>Alle Spielgeräte werden regelmäßig gereinigt und gewartet. Kranke Kinder dürfen die Einrichtung nicht betreten.</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D5F3F] mb-2">8. Fotografie</h3>
                <p>Wir behalten uns das Recht vor, Fotos und Videos auf dem Gelände zu machen und für Marketingzwecke zu verwenden. Sollten Sie damit nicht einverstanden sein, teilen Sie uns dies bitte mit.</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D5F3F] mb-2">9. Salvatorische Klausel</h3>
                <p>Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>
              </div>

              <div className="pt-6 border-t border-gray-300">
                <p className="text-sm text-gray-600">Stand: Dezember 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}