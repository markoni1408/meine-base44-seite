import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, PartyPopper, Ticket, Check, ArrowRight, Sparkles, Star, Gift, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export default function PackagesSection() {
  const { data: packages, isLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const allPackages = await base44.entities.Package.filter({ is_active: true });
      return allPackages;
    },
    initialData: [],
  });

  const getIcon = (type) => {
    switch (type) {
      case 'hourly': return Clock;
      case 'party': return PartyPopper;
      case 'day_ticket': return Ticket;
      default: return Clock;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'hourly': return 'Stundenpaket';
      case 'party': return 'Party-Paket';
      case 'day_ticket': return 'Tagesticket';
      default: return type;
    }
  };

  const getPackageColor = (index) => {
    const colors = [
      { gradient: 'from-purple-500 to-pink-500', bg: 'from-purple-50 to-pink-50', badge: 'from-purple-500 to-pink-500', icon: Star, glow: 'rgba(168, 85, 247, 0.4)' },
      { gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50', badge: 'from-blue-500 to-cyan-500', icon: Sparkles, glow: 'rgba(59, 130, 246, 0.4)' },
      { gradient: 'from-orange-500 to-red-500', bg: 'from-orange-50 to-red-50', badge: 'from-orange-500 to-red-500', icon: Gift, glow: 'rgba(249, 115, 22, 0.4)' },
      { gradient: 'from-green-500 to-teal-500', bg: 'from-green-50 to-teal-50', badge: 'from-green-500 to-teal-500', icon: PartyPopper, glow: 'rgba(34, 197, 94, 0.4)' },
      { gradient: 'from-pink-500 to-rose-500', bg: 'from-pink-50 to-rose-50', badge: 'from-pink-500 to-rose-500', icon: Ticket, glow: 'rgba(236, 72, 153, 0.4)' },
      { gradient: 'from-indigo-500 to-purple-500', bg: 'from-indigo-50 to-purple-50', badge: 'from-indigo-500 to-purple-500', icon: Calendar, glow: 'rgba(99, 102, 241, 0.4)' },
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="bg-[#4A7C59] text-white mb-4">Unsere Pakete</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2D5F3F] mb-4">
            Wähle dein Abenteuer
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Vom kurzen Besuch bis zur großen Geburtstagsparty – 
            wir haben das perfekte Paket für jeden Anlass!
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-2">
                <CardHeader>
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-12 w-24 mb-4" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {packages.slice(0, 6).map((pkg, index) => {
              const Icon = getIcon(pkg.type);
              const colorScheme = getPackageColor(index);
              const DecorIcon = colorScheme.icon;
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`border-2 border-transparent hover:shadow-[0_20px_60px_${colorScheme.glow}] transition-all duration-500 transform hover:-translate-y-3 bg-gradient-to-br ${colorScheme.bg} overflow-hidden relative group h-full`}
                  >
                  {/* Background Decorations */}
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${colorScheme.gradient} opacity-20 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-[2] transition-transform duration-700`}></div>
                  <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr ${colorScheme.gradient} opacity-15 rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700`}></div>
                  <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <DecorIcon className="w-16 h-16" />
                  </div>
                  
                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(120deg, transparent, rgba(255,184,77,0.1) 50%, transparent)',
                    }}
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: 'easeInOut',
                    }}
                  />
                  
                  <CardHeader className="relative z-10 pb-4">
                    <div className="flex items-start justify-between mb-5">
                      <motion.div 
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                        className={`w-16 h-16 bg-gradient-to-br ${colorScheme.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all relative`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl" />
                        <Icon className="w-8 h-8 text-white relative z-10" />
                      </motion.div>
                      <Badge className={`bg-gradient-to-r ${colorScheme.badge} text-white border-none font-semibold shadow-md`}>
                        {getTypeLabel(pkg.type)}
                      </Badge>
                    </div>
                    <CardTitle className={`text-2xl font-bold bg-gradient-to-r ${colorScheme.gradient} bg-clip-text text-transparent mb-3`}>
                      {pkg.name}
                    </CardTitle>
                    <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
                  </CardHeader>

                  <CardContent className="relative z-10 pt-0">
                    <div className={`mb-6 bg-gradient-to-br ${colorScheme.gradient} p-[2px] rounded-xl`}>
                      <div className="bg-white rounded-xl p-4">
                        <div className={`text-5xl font-black bg-gradient-to-br ${colorScheme.gradient} bg-clip-text text-transparent mb-1`}>
                          €{pkg.price}
                          {pkg.type === 'hourly' && <span className="text-xl text-gray-500 font-normal">/Person</span>}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                          {pkg.duration_hours && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{pkg.duration_hours}h</span>
                            </div>
                          )}
                          {pkg.max_persons && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{pkg.min_persons}-{pkg.max_persons} Personen</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {pkg.included_features && pkg.included_features.length > 0 && (
                      <div className="space-y-2 mb-6">
                        {pkg.included_features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-[#4A7C59] flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <Link to={createPageUrl('Booking') + `?package=${pkg.id}`}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button className={`relative overflow-hidden w-full bg-gradient-to-r ${colorScheme.gradient} hover:opacity-90 text-white font-bold py-7 rounded-xl shadow-lg transition-all group`}
                          style={{ boxShadow: `0 10px 40px ${colorScheme.glow}` }}
                        >
                          <span className="relative z-10 flex items-center justify-center">
                            Jetzt buchen
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                        </Button>
                      </motion.div>
                    </Link>
                  </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to={createPageUrl('Booking')}>
            <Button size="lg" variant="outline" className="border-2 border-[#4A7C59] text-[#2D5F3F] hover:bg-[#4A7C59] hover:text-white font-semibold px-8 py-6 rounded-full transition-all">
              Jetzt buchen
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}