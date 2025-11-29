import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Award, Sparkles } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Heart,
      title: 'Sicherheit',
      description: 'Höchste Sicherheitsstandards und geprüfte Spielgeräte für sorgenfreien Spaß'
    },
    {
      icon: Users,
      title: 'Familie',
      description: 'Ein Ort, wo Familien zusammenkommen und unvergessliche Momente erleben'
    },
    {
      icon: Award,
      title: 'Qualität',
      description: 'Premium-Ausstattung und liebevoll gestaltete Themenwelten'
    },
    {
      icon: Sparkles,
      title: 'Abenteuer',
      description: 'Jeden Tag neue Entdeckungen in unserer Dschungel-Welt'
    }
  ];

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-[#2D5F3F] mb-6">
            Über uns
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            AVANTURA PARK ist mehr als ein Spielplatz – es ist eine Welt voller Abenteuer, 
            Fantasie und unvergesslicher Kindheitserinnerungen.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-[#2D5F3F]">Unsere Geschichte</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Gegründet 2024 im Herzen von Wien, haben wir uns zum Ziel gesetzt, 
                einen einzigartigen Indoor-Spielplatz zu schaffen, der Kinderaugen zum 
                Leuchten bringt.
              </p>
              <p>
                Inspiriert vom faszinierenden Dschungel und seinen Abenteuern, haben wir 
                auf über 1000m² eine magische Welt erschaffen. Von Klettergerüsten über 
                Rutschen bis hin zu versteckten Höhlen – jeder Winkel lädt zum Entdecken ein.
              </p>
              <p>
                Unser erfahrenes Team sorgt dafür, dass Kinder sicher spielen können, 
                während Eltern bei einem Kaffee entspannen. Denn bei uns steht die 
                ganze Familie im Mittelpunkt!
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=600&fit=crop"
                alt="Indoor Spielplatz"
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-[#FFB84D] rounded-full opacity-60 blur-2xl"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#4A7C59] rounded-full opacity-60 blur-2xl"></div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-[#2D5F3F] text-center mb-12">
            Unsere Werte
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-2 border-[#4A7C59]/20 hover:border-[#FFB84D] transition-all hover:shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#4A7C59] to-[#2D5F3F] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2D5F3F] mb-2">{value.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gradient-to-br from-[#4A7C59] to-[#2D5F3F] rounded-3xl p-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-6">Unser Team</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Wir sind ein motiviertes Team aus Pädagogen, Spielplatz-Experten und 
            Abenteuer-Enthusiasten. Unsere Mission: Jedem Kind ein Lächeln ins Gesicht zaubern!
          </p>
          <div className="mt-8 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
            <Users className="w-5 h-5 text-[#FFB84D]" />
            <span className="font-semibold">15+ Mitarbeiter für deine Sicherheit</span>
          </div>
        </div>
      </div>
    </div>
  );
}