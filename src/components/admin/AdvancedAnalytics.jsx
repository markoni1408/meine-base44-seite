import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Package, Euro } from 'lucide-react';

const COLORS = ['#4A7C59', '#2D5F3F', '#FFB84D', '#F4A261', '#E76F51'];

export default function AdvancedAnalytics() {
  const { data: bookings = [] } = useQuery({
    queryKey: ['allBookings'],
    queryFn: () => base44.entities.Booking.filter({}),
    initialData: [],
  });

  const { data: packages = [] } = useQuery({
    queryKey: ['packages'],
    queryFn: () => base44.entities.Package.filter({}),
    initialData: [],
  });

  // Auslastung nach Wochentagen
  const getDayOfWeekStats = () => {
    const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const dayStats = Array(7).fill(0).map((_, i) => ({ day: dayNames[i], bookings: 0, revenue: 0 }));
    
    bookings.forEach(booking => {
      if (booking.status === 'confirmed' || booking.status === 'completed') {
        const date = new Date(booking.booking_date);
        const dayIndex = date.getDay();
        dayStats[dayIndex].bookings++;
        dayStats[dayIndex].revenue += booking.total_price || 0;
      }
    });
    
    return dayStats;
  };

  // Beliebteste Pakete
  const getTopPackages = () => {
    const packageStats = {};
    
    bookings.forEach(booking => {
      if (booking.status === 'confirmed' || booking.status === 'completed') {
        const pkgId = booking.package_id;
        if (!packageStats[pkgId]) {
          packageStats[pkgId] = {
            name: booking.package_name,
            count: 0,
            revenue: 0
          };
        }
        packageStats[pkgId].count++;
        packageStats[pkgId].revenue += booking.total_price || 0;
      }
    });
    
    return Object.values(packageStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  // Umsatz-Trend (letzte 30 Tage)
  const getRevenueTrend = () => {
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayBookings = bookings.filter(b => 
        b.booking_date === dateStr && 
        (b.status === 'confirmed' || b.status === 'completed')
      );
      
      const revenue = dayBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
      const count = dayBookings.length;
      
      last30Days.push({
        date: `${date.getDate()}.${date.getMonth() + 1}`,
        revenue,
        count
      });
    }
    
    return last30Days;
  };

  // Monatlicher Vergleich
  const getMonthlyComparison = () => {
    const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    const currentYear = new Date().getFullYear();
    const monthlyData = months.map((month, index) => ({ month, revenue: 0, bookings: 0 }));
    
    bookings.forEach(booking => {
      if (booking.status === 'confirmed' || booking.status === 'completed') {
        const date = new Date(booking.booking_date);
        if (date.getFullYear() === currentYear) {
          const monthIndex = date.getMonth();
          monthlyData[monthIndex].revenue += booking.total_price || 0;
          monthlyData[monthIndex].bookings++;
        }
      }
    });
    
    return monthlyData;
  };

  const dayStats = getDayOfWeekStats();
  const topPackages = getTopPackages();
  const revenueTrend = getRevenueTrend();
  const monthlyData = getMonthlyComparison();

  return (
    <div className="space-y-6">
      {/* Umsatz-Trend (letzte 30 Tage) */}
      <Card className="border-2 border-[#4A7C59]/20">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-[#2D5F3F] text-base md:text-lg">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
            Umsatz-Trend (Letzte 30 Tage)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#4A7C59" name="Umsatz (€)" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="count" stroke="#FFB84D" name="Buchungen" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        {/* Auslastung nach Wochentagen */}
        <Card className="border-2 border-[#4A7C59]/20">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-[#2D5F3F] text-base md:text-lg">
              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
              Auslastung nach Wochentagen
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dayStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#4A7C59" name="Buchungen" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Beliebteste Pakete */}
        <Card className="border-2 border-[#4A7C59]/20">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-[#2D5F3F] text-base md:text-lg">
              <Package className="w-4 h-4 md:w-5 md:h-5" />
              Beliebteste Pakete
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={topPackages}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.name} (${entry.count})`}
                >
                  {topPackages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {topPackages.map((pkg, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-gray-700">{pkg.name}</span>
                  </div>
                  <span className="font-semibold text-[#2D5F3F]">€{pkg.revenue.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monatlicher Vergleich */}
      <Card className="border-2 border-[#4A7C59]/20">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-[#2D5F3F] text-base md:text-lg">
            <Euro className="w-4 h-4 md:w-5 md:h-5" />
            Monatlicher Umsatz ({new Date().getFullYear()})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" fill="#4A7C59" name="Umsatz (€)" />
              <Bar yAxisId="right" dataKey="bookings" fill="#FFB84D" name="Buchungen" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}