import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import BookingForm from '../components/booking/BookingForm';

export default function Booking() {
  const [preselectedPackage, setPreselectedPackage] = useState(null);
  const formRef = React.useRef(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('package');
    if (packageId) {
      setPreselectedPackage(packageId);
    }
    
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#F5EFE6] to-[#E8F5E9] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#FFB84D]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#4A7C59]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-[#F4A261]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Leaf Decorations */}
      <div className="absolute top-32 left-20 opacity-20">
        <svg className="w-16 h-16 text-[#4A7C59]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
        </svg>
      </div>
      <div className="absolute bottom-40 right-32 opacity-20">
        <svg className="w-20 h-20 text-[#FFB84D]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
        </svg>
      </div>

      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Header */}
          <div className="text-center mb-16 relative">
            <div className="inline-block mb-6">
              <Badge className="bg-gradient-to-r from-[#FFB84D] via-[#F4A261] to-[#FFB84D] text-[#2D5F3F] px-8 py-4 text-lg font-bold shadow-2xl animate-pulse border-2 border-[#FFB84D]/30">
                🎟️ Jetzt buchen
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black mb-6 relative">
              <span className="bg-gradient-to-r from-[#2D5F3F] via-[#4A7C59] to-[#2D5F3F] bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(45,95,63,0.3)]">
                Buche dein Abenteuer
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              Wähle dein Wunschpaket und sichere dir deinen Platz im Dschungel! 
              Die Buchung dauert nur wenige Minuten.
            </p>

            {/* Feature Icons */}
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <div className="flex items-center gap-3 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-white/40 hover:scale-105 transition-transform">
                <div className="w-10 h-10 bg-gradient-to-br from-[#4A7C59] to-[#2D5F3F] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">✓</span>
                </div>
                <span className="text-[#2D5F3F] font-bold text-base">Schnell & einfach</span>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-white/40 hover:scale-105 transition-transform">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FFB84D] to-[#F4A261] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">✓</span>
                </div>
                <span className="text-[#2D5F3F] font-bold text-base">Sofort bestätigt</span>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-white/40 hover:scale-105 transition-transform">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F4A261] to-[#E8935E] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">✓</span>
                </div>
                <span className="text-[#2D5F3F] font-bold text-base">Vor Ort bezahlen</span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div ref={formRef}>
            <BookingForm preselectedPackageId={preselectedPackage} />
          </div>
        </div>
      </div>
    </div>
  );
}