import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-[#4A7C59] mb-4">404</div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2D5F3F] mb-4">
            Seite nicht gefunden
          </h1>
          <p className="text-xl text-gray-600">
            Ups! Die Seite, die du suchst, existiert nicht oder wurde verschoben.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to={createPageUrl('Home')}>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[#4A7C59] to-[#2D5F3F] hover:from-[#FFB84D] hover:to-[#F4A261] text-white px-8"
            >
              <Home className="w-5 h-5 mr-2" />
              Zur Startseite
            </Button>
          </Link>
          
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => window.history.back()}
            className="border-2 border-[#4A7C59] text-[#2D5F3F] hover:bg-[#4A7C59] hover:text-white px-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Zurück
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to={createPageUrl('Attractions')}>
            <div className="p-6 bg-white rounded-xl border-2 border-[#4A7C59]/20 hover:border-[#FFB84D] hover:shadow-lg transition-all">
              <h3 className="font-semibold text-[#2D5F3F] mb-2">Attraktionen</h3>
              <p className="text-sm text-gray-600">Entdecke unsere Spielbereiche</p>
            </div>
          </Link>
          
          <Link to={createPageUrl('Booking')}>
            <div className="p-6 bg-white rounded-xl border-2 border-[#4A7C59]/20 hover:border-[#FFB84D] hover:shadow-lg transition-all">
              <h3 className="font-semibold text-[#2D5F3F] mb-2">Buchung</h3>
              <p className="text-sm text-gray-600">Reserviere deinen Platz</p>
            </div>
          </Link>
          
          <Link to={createPageUrl('Contact')}>
            <div className="p-6 bg-white rounded-xl border-2 border-[#4A7C59]/20 hover:border-[#FFB84D] hover:shadow-lg transition-all">
              <h3 className="font-semibold text-[#2D5F3F] mb-2">Kontakt</h3>
              <p className="text-sm text-gray-600">Nimm Kontakt auf</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}