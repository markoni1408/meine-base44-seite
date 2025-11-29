import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Euro, TrendingUp } from 'lucide-react';

export default function StatsOverview() {
  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => base44.entities.Booking.list(),
    initialData: [],
  });

  const stats = {
    totalBookings: bookings.length,
    totalRevenue: bookings.reduce((sum, b) => sum + (b.total_price || 0), 0),
    totalPersons: bookings.reduce((sum, b) => sum + (b.number_of_persons || 0), 0),
    upcomingBookings: bookings.filter(b => new Date(b.booking_date) >= new Date()).length,
  };

  const statCards = [
    {
      title: 'Gesamtbuchungen',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Kommende Buchungen',
      value: stats.upcomingBookings,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Gesamtumsatz',
      value: `€${stats.totalRevenue.toFixed(2)}`,
      icon: Euro,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Gesamt Besucher',
      value: stats.totalPersons,
      icon: Users,
      color: 'from-orange-500 to-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-2 border-[#4A7C59]/20 overflow-hidden">
            <CardContent className="p-3 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs md:text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-xl md:text-3xl font-bold text-[#2D5F3F]">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}