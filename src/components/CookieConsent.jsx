import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Cookie, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieConsent({ onAccept, onDecline }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent is already stored
    const storedConsent = localStorage.getItem('cookieConsent');
    if (!storedConsent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      >
        <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md border-2 border-[#4A7C59]/20 rounded-2xl shadow-2xl p-6 md:flex items-center justify-between gap-8">
          
          <div className="flex-1 mb-6 md:mb-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#4A7C59]/10 rounded-lg flex items-center justify-center">
                <Cookie className="w-5 h-5 text-[#4A7C59]" />
              </div>
              <h3 className="text-lg font-bold text-[#2D5F3F]">Wir nutzen Cookies</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Wir verwenden Cookies und ähnliche Technologien, um Ihr Erlebnis in unserem Dschungel zu verbessern, 
              Anzeigen zu personalisieren und unseren Datenverkehr zu analysieren. 
              Weitere Informationen finden Sie in unserer{' '}
              <Link 
                to={createPageUrl('Privacy')} 
                className="text-[#4A7C59] hover:underline font-medium"
              >
                Datenschutzerklärung
              </Link>
              .
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => {
                localStorage.setItem('cookieConsent', 'declined');
                setIsVisible(false);
                onDecline();
              }}
              className="border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Nur Essenzielle
            </Button>
            <Button
              onClick={() => {
                localStorage.setItem('cookieConsent', 'accepted');
                setIsVisible(false);
                onAccept();
              }}
              className="bg-[#4A7C59] hover:bg-[#2D5F3F] text-white gap-2 shadow-lg"
            >
              <ShieldCheck className="w-4 h-4" />
              Alle akzeptieren
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}