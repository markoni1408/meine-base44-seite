import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mountain, Waves, Building2, PartyPopper, 
  Baby, Crown, TreePine, Palette 
} from 'lucide-react';

export default function Attractions() {
  const attractions = [
    {
      icon: Waves,
      title: 'Mega-Rutschenpark',
      age: '3-12 Jahre',
      description: 'Verschiedene Rutschen in unterschiedlichen Größen – von sanft bis rasant!',
      features: ['Wellenrutsche', 'Reifenrutsche', 'Normalerutsche'],
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Mountain,
      title: 'Kletter-Dschungel',
      age: '5-12 Jahre',
      description: 'Mehrstöckiges Klettergerüst mit Brücken, Tunneln und versteckten Passagen. Erobere den Gipfel!',
      features: ['2 Ebenen', 'Kletternetze', 'Hängebrücken'],
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Building2,
      title: 'Sportplätze',
      age: '5-12 Jahre',
      description: 'Aktiver Spielspaß auf unseren Indoor-Sportplätzen für kleine Fußballer und Basketballer.',
      features: ['Fußballplatz', 'Basketballplatz'],
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: Building2,
      title: 'Trampolin-Bereich',
      age: '4-12 Jahre',
      description: 'Trampolin-Spiele für dynamischen Spielspaß und unvergessliche Sprünge.',
      features: ['Mehrere Trampoline', 'Sichere Umrandung', 'Sprungarena'],
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Baby,
      title: 'Kleinkind-Bereich',
      age: '0-3 Jahre',
      description: 'Sicherer und gemütlicher Bereich speziell für unsere Kleinsten mit altersgerechten Spielgeräten.',
      features: ['Soft-Play', 'Babybällepool', 'Krabbelbereich'],
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: PartyPopper,
      title: 'Party-Raum',
      age: 'Alle Altersgruppen',
      description: 'Privat buchbarer Raum für unvergessliche Geburtstagsfeiern im Dschungel-Stil.',
      features: ['1 Raum', 'Deko inklusive', 'Catering möglich'],
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: TreePine,
      title: 'Dschungel-Cafe',
      age: 'Für Eltern',
      description: 'Gemütlicher Bereich mit Sitzgelegenheiten, Kaffee und Snacks – mit Blick auf die Spielfläche.',
      features: ['Kaffee', 'Snacks', 'WLAN'],
      color: 'from-amber-600 to-yellow-600'
    },
    {
      icon: Palette,
      title: 'PlayStation-Ecke',
      age: 'Für die Großen',
      description: 'Gaming-Bereich mit PlayStation für ältere Kinder und Jugendliche.',
      features: ['PlayStation-Konsole', 'Gaming-Sessel', 'Beliebte Spiele'],
      color: 'from-indigo-500 to-blue-600'
    }
  ];

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-[#4A7C59] text-white mb-4 px-4 py-2">Unsere Attraktionen</Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-[#2D5F3F] mb-6">
            Entdecke den Dschungel
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Über 600m² voller Abenteuer, Spiel und Spaß! 
            Jede Attraktion wurde mit Liebe zum Detail gestaltet.
          </p>
        </div>

        {/* Attractions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {attractions.map((attraction, index) => {
            const Icon = attraction.icon;
            return (
              <Card
                key={index}
                className="border-2 border-[#4A7C59]/20 hover:border-[#FFB84D] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
              >
                <div className={`h-2 bg-gradient-to-r ${attraction.color}`}></div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${attraction.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-[#FFB84D]/20 text-[#3D2817]">
                      {attraction.age}
                    </Badge>
                  </div>

                  <h3 className="text-2xl font-bold text-[#2D5F3F] mb-3">
                    {attraction.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {attraction.description}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    {attraction.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-[#4A7C59] rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Safety Info */}
        <div className="bg-gradient-to-br from-[#4A7C59] to-[#2D5F3F] rounded-3xl p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Sicherheit steht an erster Stelle</h2>
            <p className="text-lg text-white/90 leading-relaxed mb-8">
              Alle unsere Spielgeräte sind TÜV-geprüft und entsprechen den höchsten 
              Sicherheitsstandards. Unser geschultes Personal sorgt für eine sichere 
              und saubere Umgebung. Regelmäßige Wartungen und Desinfektionen sind 
              selbstverständlich.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-[#FFB84D] mb-2">100%</div>
                <div className="text-white/90">TÜV-geprüft</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-[#FFB84D] mb-2">24/7</div>
                <div className="text-white/90">Aufsicht</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-[#FFB84D] mb-2">TOP</div>
                <div className="text-white/90">Hygiene</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}