import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1a3d2a] via-[#2D5F3F] to-[#4A7C59] text-white">
      {/* Animated Mesh Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzAtMy4zMTQtMi42ODYtNi02LTZzLTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2IDYtMi42ODYgNi02em0wIDEyYzAgMy4zMTQgMi42ODYgNiA2IDZzNi0yLjY4NiA2LTYtMi42ODYtNi02LTYtNiAyLjY4Ni02IDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-[#FFB84D]/30 via-[#F4A261]/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.35, 0.2], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-tl from-[#4A7C59]/40 via-[#5C8F6F]/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15], x: [0, 100, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-r from-[#FFB84D]/25 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFB84D]/30 to-[#F4A261]/30 backdrop-blur-md px-5 py-2.5 rounded-full border border-[#FFB84D]/30 shadow-lg"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-4 h-4 text-[#FFB84D]" />
              </motion.div>
              <span className="text-sm font-semibold bg-gradient-to-r from-white to-[#FFB84D] bg-clip-text text-transparent">Neu in Wien!</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-8xl font-black leading-tight"
            >
              Willkommen im
              <motion.span 
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="block mt-3 bg-gradient-to-r from-[#FFB84D] via-[#F4A261] to-[#FFB84D] bg-[length:200%_auto] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,184,77,0.3)]"
              >
                Dschungel-Abenteuer
              </motion.span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-white/95 leading-relaxed font-light"
            >
              Entdeckt unseren magischen Indoor-Spielplatz! 
              Über <span className="font-bold text-[#FFB84D]">600m²</span> voller Abenteuer, Klettergerüste, Rutschen und Spaß für Kinder jeden Alters.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Link to={createPageUrl('Booking')}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="relative overflow-hidden bg-gradient-to-r from-[#FFB84D] to-[#F4A261] hover:from-[#F4A261] hover:to-[#FFB84D] text-[#2D5F3F] font-bold text-lg px-10 py-7 rounded-full shadow-2xl hover:shadow-[0_20px_60px_rgba(255,184,77,0.5)] transition-all group">
                    <span className="relative z-10 flex items-center">
                      Jetzt buchen
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </Button>
                </motion.div>
              </Link>
              <Link to={createPageUrl('Attractions')}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white hover:text-[#2D5F3F] hover:border-white font-semibold text-lg px-10 py-7 rounded-full transition-all shadow-lg hover:shadow-xl">
                    Attraktionen entdecken
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap gap-8 pt-8 border-t border-white/30"
            >
              {[
                { value: '600m²', label: 'Spielfläche' },
                { value: '15+', label: 'Attraktionen' },
                { value: '100%', label: 'Spaß garantiert' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + (index * 0.1), duration: 0.5 }}
                  whileHover={{ scale: 1.15, y: -5 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFB84D]/20 to-[#F4A261]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-[#FFB84D] to-[#F4A261] bg-clip-text text-transparent">{stat.value}</div>
                    <div className="text-white/90 mt-2 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative"
          >
            <motion.div 
              whileHover={{ scale: 1.02, rotate: 1 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f085cadd36913565068ee/95114742b_IMG_0017.jpg"
                  alt="AVANTURA PARK - Indoor Dschungel-Spielplatz in Wien"
                  className="w-full h-[500px] md:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D5F3F]/60 via-[#2D5F3F]/20 to-transparent"></div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20"
                >
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-12 h-12 bg-[#FFB84D] rounded-full flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-[#2D5F3F]" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">TÜV-geprüft & sicher</div>
                      <div className="text-sm text-white/80">Höchste Sicherheitsstandards</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Floating Leaf Decorations */}
            <motion.div 
              animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -left-8 w-24 h-24 bg-[#4A7C59] rounded-full opacity-60 blur-xl"
            />
            <motion.div 
              animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#FFB84D] rounded-full opacity-60 blur-xl"
            />
          </motion.div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path fill="#FFF8F0" fillOpacity="1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </div>
  );
}