import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function Privacy() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-[#2D5F3F] mb-12">Datenschutzerklärung</h1>

        <Card className="border-2 border-[#4A7C59]/20">
          <CardContent className="p-8">
            <div className="space-y-6 text-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-[#2D5F3F] mb-4">1. Datenschutz auf einen Blick</h2>
                <h3 className="font-semibold text-[#2D5F3F] mb-2">Allgemeine Hinweise</h3>
                <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D5F3F] mb-2">Datenerfassung auf dieser Website</h3>
                <p className="mb-4"><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong></p>
                <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#2D5F3F] mb-4">2. Hosting</h2>
                <p>Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#2D5F3F] mb-4">3. Allgemeine Hinweise und Pflichtinformationen</h2>
                <h3 className="font-semibold text-[#2D5F3F] mb-2">Datenschutz</h3>
                <p>Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#2D5F3F] mb-4">4. Datenerfassung auf dieser Website</h2>
                <h3 className="font-semibold text-[#2D5F3F] mb-2">Kontaktformular und Buchungen</h3>
                <p>Wenn Sie uns per Kontaktformular oder bei einer Buchung Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.</p>
                <p className="mt-2">Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D5F3F] mb-2">Welche Daten sammeln wir?</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Name und Kontaktdaten (E-Mail, Telefon)</li>
                  <li>Buchungsinformationen (Datum, Uhrzeit, Personenanzahl)</li>
                  <li>Zahlungsinformationen (werden verschlüsselt übertragen)</li>
                  <li>Technische Daten (IP-Adresse, Browser-Typ)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D5F3F] mb-2">Wie verwenden wir Ihre Daten?</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Zur Bearbeitung und Bestätigung Ihrer Buchungen</li>
                  <li>Zur Kommunikation bezüglich Ihrer Buchung</li>
                  <li>Zur Verbesserung unserer Dienstleistungen</li>
                  <li>Zur Einhaltung gesetzlicher Verpflichtungen</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#2D5F3F] mb-4">5. Ihre Rechte</h2>
                <p>Sie haben folgende Rechte:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Recht auf Auskunft über Ihre gespeicherten Daten</li>
                  <li>Recht auf Berichtigung unrichtiger Daten</li>
                  <li>Recht auf Löschung Ihrer Daten</li>
                  <li>Recht auf Einschränkung der Verarbeitung</li>
                  <li>Recht auf Datenübertragbarkeit</li>
                  <li>Widerspruchsrecht gegen die Verarbeitung</li>
                  <li>Beschwerderecht bei der Aufsichtsbehörde</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#2D5F3F] mb-4">6. Speicherdauer</h2>
                <p>Wir speichern Ihre personenbezogenen Daten nur so lange, wie es für die Erfüllung der Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen bestehen.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#2D5F3F] mb-4">7. Datensicherheit</h2>
                <p>Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren (Secure Socket Layer) in Verbindung mit der jeweils höchsten Verschlüsselungsstufe, die von Ihrem Browser unterstützt wird.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#2D5F3F] mb-4">8. Kontakt</h2>
                <p>Bei Fragen zum Datenschutz können Sie sich jederzeit an uns wenden:</p>
                <div className="mt-2">
                  <p>AVANTURA PARK GmbH</p>
                  <p>Eduard-Kittenberger-Gasse 97</p>
                  <p>1230 Wien</p>
                  <p>E-Mail: datenschutz@avanturapark.at</p>
                  <p>Telefon: 069910046404</p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-300">
                <p className="text-sm text-gray-600">Stand: Dezember 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}