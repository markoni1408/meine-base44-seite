import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { de } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users, Phone, Mail, X, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ManualBookingForm from './ManualBookingForm';

export default function BookingCalendar({ onSelectDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const { data: bookings } = useQuery({
    queryKey: ['bookings', format(currentMonth, 'yyyy-MM')],
    queryFn: async () => {
      const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
      return await base44.entities.Booking.list('-booking_date', 200);
    },
    initialData: [],
  });

  const startDate = startOfWeek(startOfMonth(currentMonth), { locale: de });
  const endDate = endOfWeek(endOfMonth(currentMonth), { locale: de });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getBookingsForDay = (day) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return bookings.filter(b => b.booking_date === dayStr);
  };

  const getTotalPersonsForDay = (day) => {
    return getBookingsForDay(day).reduce((sum, b) => sum + (b.number_of_persons || 0), 0);
  };

  const previousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  const handleDayClick = (day) => {
    setSelectedDay(day);
    if (onSelectDate) {
      onSelectDate(day);
    }
  };

  const dayBookings = selectedDay ? getBookingsForDay(selectedDay) : [];

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'confirmed': return 'Bestätigt';
      case 'pending': return 'Ausstehend';
      case 'cancelled': return 'Storniert';
      case 'completed': return 'Abgeschlossen';
      default: return status;
    }
  };

  return (
    <Card className="border-2 border-[#4A7C59]/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-[#2D5F3F] flex items-center gap-2">
            <CalendarIcon className="w-6 h-6" />
            Buchungskalender
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-lg font-semibold text-[#2D5F3F] min-w-[180px] text-center">
              {format(currentMonth, 'MMMM yyyy', { locale: de })}
            </div>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {/* Week day headers */}
          {weekDays.map(day => (
            <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, idx) => {
            const bookingsCount = getBookingsForDay(day).length;
            const totalPersons = getTotalPersonsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());
            const capacityPercent = (totalPersons / 35) * 100;

            return (
              <div
                key={idx}
                onClick={() => handleDayClick(day)}
                className={`
                  min-h-[100px] p-2 rounded-lg border-2 transition-all cursor-pointer
                  ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 opacity-50'}
                  ${isToday ? 'border-[#FFB84D] shadow-md' : 'border-gray-200'}
                  ${bookingsCount > 0 ? 'hover:border-[#4A7C59] hover:shadow-lg' : 'hover:border-gray-300'}
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-medium ${
                    isToday ? 'text-[#FFB84D] font-bold' : 
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {bookingsCount > 0 && (
                    <Badge variant="secondary" className="text-xs bg-[#4A7C59] text-white">
                      {bookingsCount}
                    </Badge>
                  )}
                </div>

                {bookingsCount > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs text-gray-600">
                      {totalPersons} / 35 Kinder
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          capacityPercent >= 90 ? 'bg-red-500' :
                          capacityPercent >= 70 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Wenig Auslastung (&lt;70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Hohe Auslastung (70-90%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Fast ausgebucht (&gt;90%)</span>
          </div>
        </div>
      </CardContent>

      {/* Day Details Dialog */}
      <Dialog open={!!selectedDay} onOpenChange={() => {
        setSelectedDay(null);
        setShowBookingForm(false);
      }}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#2D5F3F] flex items-center gap-2">
              <CalendarIcon className="w-6 h-6" />
              Buchungen für {selectedDay && format(selectedDay, 'EEEE, d. MMMM yyyy', { locale: de })}
            </DialogTitle>
          </DialogHeader>

          <div className="mb-4">
            <Button 
              onClick={() => setShowBookingForm(true)}
              className="w-full bg-gradient-to-r from-[#4A7C59] to-[#2D5F3F] hover:from-[#5A8C69] hover:to-[#3D6F4F] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Neue Buchung für diesen Tag
            </Button>
          </div>

          {showBookingForm ? (
            <ManualBookingForm 
              preselectedDate={selectedDay} 
              onSuccess={() => {
                setShowBookingForm(false);
                setSelectedDay(null);
              }}
            />
          ) : dayBookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Keine Buchungen für diesen Tag</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#F5EFE6] rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#2D5F3F]">{dayBookings.length}</div>
                    <div className="text-sm text-gray-600">Buchungen</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#2D5F3F]">
                      {dayBookings.reduce((sum, b) => sum + (b.number_of_persons || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Personen</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#2D5F3F]">
                      €{dayBookings.reduce((sum, b) => sum + (b.total_price || 0), 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Umsatz</div>
                  </div>
                </div>
              </div>

              {dayBookings.map((booking) => (
                <Card key={booking.id} className="border-2 border-[#4A7C59]/20">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-[#2D5F3F]">{booking.customer_name}</h3>
                        <p className="text-sm text-gray-600">{booking.package_name}</p>
                      </div>
                      <Badge className={`${getStatusColor(booking.status)} border`}>
                        {getStatusLabel(booking.status)}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#4A7C59]" />
                        <span>{booking.start_time} - {booking.end_time} Uhr</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#4A7C59]" />
                        <span>{booking.number_of_persons} Personen</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#4A7C59]" />
                        <span className="truncate">{booking.customer_email}</span>
                      </div>
                      {booking.customer_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[#4A7C59]" />
                          <span>{booking.customer_phone}</span>
                        </div>
                      )}
                    </div>

                    {booking.special_requests && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-1">Besondere Wünsche:</p>
                        <p className="text-sm text-gray-600">{booking.special_requests}</p>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-sm text-gray-600">Buchungs-ID: {booking.id.substring(0, 8)}</span>
                      <span className="text-lg font-semibold text-[#2D5F3F]">€{booking.total_price.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}