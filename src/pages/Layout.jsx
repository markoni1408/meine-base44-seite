
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { Menu, X, Phone, MapPin, Clock, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import CookieConsent from './components/CookieConsent';

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(localStorage.getItem('cookieConsent'));

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        try {
          const currentUser = await base44.auth.me();
          setUser(currentUser);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };
    checkAuth();
  }, []);

  // Load Tracking Scripts (Only if accepted)
  useEffect(() => {
    if (cookieConsent !== 'accepted') return;

    // --- Google AdSense ---
    const adsenseId = import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT_ID;
    if (adsenseId && !document.querySelector('meta[name="google-adsense-account"]')) {
      const meta = document.createElement('meta');
      meta.name = 'google-adsense-account';
      meta.content = adsenseId;
      document.head.appendChild(meta);
    }
    if (adsenseId && !document.querySelector(`script[src*="adsbygoogle.js"]`)) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // --- Google Tag (gtag.js) ---
    const gtagId = 'AW-17756344381';
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    window.gtag = gtag;

    if (!document.querySelector(`script[src*="gtag/js"]`)) {
      gtag('js', new Date());
      gtag('config', gtagId);

      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`;
      script.async = true;
      document.head.appendChild(script);
    }
  }, [cookieConsent]);

  const isAdmin = user?.role === 'admin';

  const navigation = [
    { name: 'Startseite', path: 'Home' },
    { name: 'Über uns', path: 'About' },
    { name: 'Attraktionen', path: 'Attractions' },
    { name: 'Buchung', path: 'Booking' },
    { name: 'Kontakt', path: 'Contact' },
  ];

  const adminNavigation = isAdmin ? [{ name: 'Dashboard', path: 'AdminDashboard' }] : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F0] to-[#F5EFE6]">
      <style>{`
        @keyframes leafFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        .leaf-float {
          animation: leafFloat 3s ease-in-out infinite;
        }
      `}</style>

      {/* Navigation */}
      <nav className="bg-gradient-to-r from-[#2D5F3F] to-[#4A7C59] text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4A261] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FFB84D] rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center py-4">
            <Link to={createPageUrl('Home')} className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFB84D] to-[#F4A261] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-[#2D5F3F]">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">AVANTURA PARK</h1>
                <p className="text-xs text-[#FFB84D]">Dschungel-Abenteuer in Wien</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentPageName === item.path
                      ? 'bg-white/20 text-white font-semibold'
                      : 'hover:bg-white/10 text-white/90'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {adminNavigation.map((item) => (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentPageName === item.path
                      ? 'bg-white/20 text-white font-semibold'
                      : 'hover:bg-white/10 text-white/90'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => base44.auth.logout()}
                  className="ml-4 text-white hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Abmelden
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden pb-4 space-y-2"
              >
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={createPageUrl(item.path)}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-2 rounded-lg ${
                        currentPageName === item.path
                          ? 'bg-white/20 font-semibold'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              {adminNavigation.map((item) => (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg ${
                    currentPageName === item.path
                      ? 'bg-white/20 font-semibold'
                      : 'hover:bg-white/10'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navigation.length + adminNavigation.length) * 0.05 }}
                  onClick={() => base44.auth.logout()}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Abmelden
                </motion.button>
              )}
              </motion.div>
              )}
              </AnimatePresence>
        </div>
      </nav>

      {/* Quick Info Bar */}
      <div className="bg-[#FFB84D] text-[#3D2817] py-2 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="font-medium">069910046404</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Eduard-Kittenberger-Gasse 97, 1230 Wien</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Mo-Fr: 13:00-18:30 | Sa-So & Feiertage: 10:30-18:30</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>{children}</main>

      <CookieConsent 
        onAccept={() => setCookieConsent('accepted')} 
        onDecline={() => setCookieConsent('declined')} 
      />

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#2D5F3F] to-[#3D4F2F] text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#FFB84D]">AVANTURA PARK GmbH</h3>
              <p className="text-white/80 leading-relaxed">
                Der größte Indoor-Dschungel-Spielplatz in Wien. 
                Abenteuer, Spaß und unvergessliche Erlebnisse für die ganze Familie!
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-[#FFB84D]">Kontakt</h4>
              <div className="space-y-2 text-white/80">
                <p>Eduard-Kittenberger-Gasse 97</p>
                <p>1230 Wien</p>
                <p>Tel: 069910046404</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-[#FFB84D]">Rechtliches</h4>
              <div className="space-y-2">
                <Link to={createPageUrl('Impressum')} className="block hover:text-[#FFB84D] transition-colors">
                  Impressum & AGB
                </Link>
                <Link to={createPageUrl('Privacy')} className="block hover:text-[#FFB84D] transition-colors">
                  Datenschutz
                </Link>
              </div>
              </div>

              <div>
              <h4 className="font-semibold mb-4 text-[#FFB84D]">Social Media</h4>
              <a 
                href="https://www.instagram.com/avantura_park_wien/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#FFB84D] transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @avantura_park_wien
              </a>
              </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60 text-sm space-y-2">
            <p>© 2025 AVANTURA PARK GmbH. Alle Rechte vorbehalten.</p>
            <p className="text-xs">Entwickelt von <span className="text-[#FFB84D] font-semibold">Marko Cepenjak</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
