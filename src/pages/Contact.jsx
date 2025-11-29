import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';

export default function Contact() {
  const openGoogleMaps = () => {
    window.open('https://www.google.com/maps/search/?api=1&query=Eduard-Kittenberger-Gasse+97,+1230+Wien', '_blank');
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-[#2D5F3F] mb-6">
            Kontakt & Anfahrt
          </h1>
          <p className="text-xl text-gray-600">
            Wir freuen uns auf deinen Besuch! Hier findest du alle wichtigen Informationen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          <Card className="border-2 border-[#4A7C59]/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-[#2D5F3F] mb-6">Kontaktdaten</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#4A7C59] rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#2D5F3F] mb-1">Adresse</div>
                    <div className="text-gray-600">
                      AVANTURA PARK GmbH<br />
                      Eduard-Kittenberger-Gasse 97<br />
                      1230 Wien, Österreich
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#4A7C59] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#2D5F3F] mb-1">Telefon</div>
                    <a href="tel:069910046404" className="text-gray-600 hover:text-[#4A7C59] transition-colors">
                      069910046404
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#4A7C59] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#2D5F3F] mb-1">E-Mail</div>
                    <a href="mailto:info@avanturapark.at" className="text-gray-600 hover:text-[#4A7C59] transition-colors">
                      info@avanturapark.at
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#4A7C59] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#2D5F3F] mb-1">Öffnungszeiten</div>
                    <div className="text-gray-600 space-y-1">
                      <div>Mo-Fr: 13:00 - 18:00 Uhr</div>
                      <div>Sa-So: 10:30 - 18:00 Uhr</div>
                      <div>Feiertage: 10:30 - 18:00 Uhr</div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={openGoogleMaps}
                className="w-full mt-8 bg-[#4A7C59] hover:bg-[#2D5F3F] text-white py-6"
              >
                <Navigation className="mr-2 h-5 w-5" />
                Route in Google Maps öffnen
              </Button>
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="border-2 border-[#4A7C59]/20 overflow-hidden">
            <CardContent className="p-0 h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d16.2707!3d48.1421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDA4JzMxLjYiTiAxNsKwMTYnMTQuNSJF!5e0!3m2!1sde!2sat!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '500px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </CardContent>
          </Card>
        </div>

        {/* Anfahrt Info */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 border-[#4A7C59]/20 bg-gradient-to-br from-white to-[#F5EFE6]">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-[#4A7C59] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚗</span>
              </div>
              <h3 className="font-bold text-[#2D5F3F] mb-2">Mit dem Auto</h3>
              <p className="text-sm text-gray-600">
                Kostenlose Parkplätze direkt vor dem Gebäude. 
                Gut erreichbar über die A2 und A23.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#4A7C59]/20 bg-gradient-to-br from-white to-[#F5EFE6]">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-[#4A7C59] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚇</span>
              </div>
              <h3 className="font-bold text-[#2D5F3F] mb-2">Öffentlich</h3>
              <p className="text-sm text-gray-600">
                U6 bis Perfektastraße, dann Bus 63A. 
                Haltestelle direkt in der Nähe.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#4A7C59]/20 bg-gradient-to-br from-white to-[#F5EFE6]">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-[#4A7C59] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">♿</span>
              </div>
              <h3 className="font-bold text-[#2D5F3F] mb-2">Barrierefrei</h3>
              <p className="text-sm text-gray-600">
                Vollständig rollstuhlgerecht mit Aufzug und 
                barrierefreien Toiletten.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}