import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Home, Calendar, Phone, Mail } from 'lucide-react';

export default function BookingSuccess() {
  useEffect(() => {
    // Google Ads Conversion Event
    // Ensure gtag is defined even if script is still loading (Shim)
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    
    gtag('event', 'conversion', {
      'send_to': 'AW-17756344381/aPVPCJXNmcYbEL2g8ZJC'
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F0] to-[#F5EFE6] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 shadow-lg">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-[#2D5F3F] mb-4">
            Vielen Dank für Ihre Buchung!
          </h1>
          <p className="text-xl text-gray-700">
            Ihre Buchung wurde erfolgreich bestätigt
          </p>
        </div>

        {/* Info Card */}
        <Card className="border-2 border-[#4A7C59]/20 shadow-xl mb-8">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="bg-[#F5EFE6] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#2D5F3F] mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Bestätigungsmail versendet
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Wir haben Ihnen eine Bestätigungs-E-Mail mit allen Buchungsdetails gesendet. 
                  Bitte überprüfen Sie auch Ihren Spam-Ordner, falls Sie keine E-Mail erhalten haben.
                </p>
              </div>

              <div className="bg-[#FFB84D]/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#3D2817] mb-3">
                  Wichtige Informationen:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-[#4A7C59] mt-1">✓</span>
                    <span>Bitte kommen Sie 10 Minuten vor Ihrer Buchungszeit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4A7C59] mt-1">✓</span>
                    <span>Zahlung erfolgt vor Ort (Bar oder Kartenzahlung)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4A7C59] mt-1">✓</span>
                    <span>Bringen Sie bequeme Kleidung und Antirutsch-Socken mit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4A7C59] mt-1">✓</span>
                    <span>Bei Fragen oder Änderungen können Sie uns jederzeit kontaktieren</span>
                  </li>
                </ul>
              </div>

              <div className="border-t-2 border-[#4A7C59]/20 pt-6">
                <h3 className="text-lg font-semibold text-[#2D5F3F] mb-4">Kontaktinformationen:</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#4A7C59]/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-[#4A7C59]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Telefon</p>
                      <p className="font-semibold">069910046404</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#4A7C59]/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#4A7C59]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">E-Mail</p>
                      <p className="font-semibold">info@avanturapark.at</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="bg-gradient-to-r from-[#4A7C59] to-[#2D5F3F] hover:from-[#FFB84D] hover:to-[#F4A261] text-white font-semibold py-6 px-8 text-lg shadow-lg"
          >
            <Link to={createPageUrl('Home')}>
              <Home className="w-5 h-5 mr-2" />
              Zur Startseite
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-2 border-[#4A7C59] text-[#4A7C59] hover:bg-[#4A7C59] hover:text-white font-semibold py-6 px-8 text-lg"
          >
            <Link to={createPageUrl('Booking')}>
              <Calendar className="w-5 h-5 mr-2" />
              Weitere Buchung
            </Link>
          </Button>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-lg">
            Wir freuen uns auf Ihren Besuch im <span className="font-bold text-[#2D5F3F]">AVANTURA PARK</span>!
          </p>
        </div>
      </div>
    </div>
  );
}