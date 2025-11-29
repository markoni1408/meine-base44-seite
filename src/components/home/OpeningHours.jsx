import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OpeningHours() {
  const schedule = [
    { days: 'Montag - Freitag', hours: '13:00 - 18:30 Uhr' },
    { days: 'Samstag - Sonntag', hours: '10:30 - 18:30 Uhr' },
    { days: 'Feiertage', hours: '10:30 - 18:30 Uhr' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#4A7C59] to-[#2D5F3F] text-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#FFB84D] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#F4A261] rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center justify-center w-16 h-16 bg-[#FFB84D] rounded-2xl mb-6 shadow-xl"
          >
            <Clock className="w-8 h-8 text-[#2D5F3F]" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Öffnungszeiten</h2>
          <p className="text-xl text-white/90">Wir freuen uns auf deinen Besuch!</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardContent className="p-8">
              <div className="space-y-6">
                {schedule.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center justify-between p-6 bg-white/10 rounded-xl hover:bg-white/20 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <Calendar className="w-6 h-6 text-[#FFB84D]" />
                      <span className="text-lg font-medium">{item.days}</span>
                    </div>
                    <span className="text-xl font-bold text-[#FFB84D]">{item.hours}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 p-6 bg-[#FFB84D]/20 rounded-xl border border-[#FFB84D]/30"
              >
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#FFB84D] flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-white/90 leading-relaxed">
                    <p className="font-semibold mb-2">Wichtige Hinweise:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Letzter Einlass: 1 Stunde vor Schließung</li>
                      <li>Maximale Kapazität: 35 Kinder</li>
                      <li>Für Gruppen ab 8 Personen empfehlen wir eine Voranmeldung</li>
                      <li>An Feiertagen gelten Wochenend-Öffnungszeiten</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}