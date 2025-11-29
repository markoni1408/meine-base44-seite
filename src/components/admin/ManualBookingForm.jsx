import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Calendar as CalendarIcon, Plus, Loader2, CheckCircle2, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { toast } from 'sonner';

export default function ManualBookingForm({ preselectedDate, onSuccess }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [date, setDate] = useState(preselectedDate || null);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedFood, setSelectedFood] = useState('');
  const [status, setStatus] = useState('pending');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const { data: packages } = useQuery({
    queryKey: ['packages'],
    queryFn: () => base44.entities.Package.filter({ is_active: true }),
    initialData: [],
  });

  const { data: blockedDays } = useQuery({
    queryKey: ['blockedDays'],
    queryFn: () => base44.entities.BlockedDay.list(),
    initialData: [],
  });

  const selectedPackageData = packages.find(p => p.id === selectedPackage);

  // Check if selected date is weekend
  const isWeekendDate = date ? (date.getDay() === 0 || date.getDay() === 6) : null;

  // Filter packages based on selected date
  const availablePackages = packages.filter(pkg => {
    if (!date) return true; // Show all if no date selected
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isFriday = date.getDay() === 5;
    
    // Fr-So/Feiertag packages only on Friday, Saturday, Sunday
    if (pkg.name.includes('Fr-So') || pkg.name.includes('Feiertag')) {
      return isFriday || isWeekend;
    }
    
    // Mo-Do packages only on Monday to Thursday
    if (pkg.name.includes('Mo-Do')) {
      const dayOfWeek = date.getDay();
      return dayOfWeek >= 1 && dayOfWeek <= 4; // Monday = 1, Thursday = 4
    }
    
    return true; // All other packages available any day
  });

  // Fetch bookings for the selected date to check capacity
  const { data: bookingsForDate } = useQuery({
    queryKey: ['bookings', date ? format(date, 'yyyy-MM-dd') : null],
    queryFn: async () => {
      if (!date) return [];
      const bookings = await base44.entities.Booking.filter({
        booking_date: format(date, 'yyyy-MM-dd')
      });
      return bookings.filter(b => b.status !== 'cancelled');
    },
    enabled: !!date,
    initialData: [],
  });

  // Get available time slots based on selected date
  const getAvailableTimeSlots = () => {
    if (!date) return [];
    
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday

    if (isWeekend) {
      // Weekend/Holiday: 10:30-18:30
      return ['10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
    } else {
      // Weekday: 13:00-18:30
      return ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
    }
    };

  const timeSlots = getAvailableTimeSlots();

  // Filter time slots based on package duration to ensure they fit before closing time (18:00)
  const filteredTimeSlots = timeSlots.filter(time => {
    if (!selectedPackageData) return true;

    const duration = selectedPackageData.duration_hours || 2;
    const [hours, minutes] = time.split(':').map(Number);

    const startTimeDecimal = hours + (minutes / 60);
    const endTimeDecimal = startTimeDecimal + duration;

    return endTimeDecimal <= 18;
  });

  // Calculate available capacity for each time slot
  const getTimeSlotCapacity = (startTime) => {
    if (!date || !selectedPackageData || !bookingsForDate) return 35;

    const duration = selectedPackageData.duration_hours || 2;
    const endTime = calculateEndTime(startTime, duration);
    
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const newStart = timeToMinutes(startTime);
    const newEnd = timeToMinutes(endTime);

    // Find overlapping bookings
    const overlappingBookings = bookingsForDate.filter(b => {
      const existingStart = timeToMinutes(b.start_time);
      const existingEnd = timeToMinutes(b.end_time);
      return (newStart < existingEnd && newEnd > existingStart);
    });

    const usedCapacity = overlappingBookings.reduce((sum, b) => sum + (b.number_of_persons || 0), 0);
    return 35 - usedCapacity;
  };

  const calculateEndTime = (startTime, duration) => {
    if (!startTime || !duration) return '';
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + duration;
    const calculatedEndTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // Max end time is 18:30 (closing time)
    // Convert to minutes for easier comparison: 18:30 = 1110 minutes
    const totalMinutes = endHours * 60 + minutes;
    const maxMinutes = 18 * 60 + 30; // 18:30

    if (totalMinutes > maxMinutes) {
      return '18:30';
    }

    return calculatedEndTime;
    };

  const calculateTotalPrice = () => {
    if (!selectedPackageData) return 0;
    
    let total = selectedPackageData.price;
    
    if (selectedPackageData.type === 'hourly') {
      total *= numberOfPersons;
    } else if (selectedPackageData.type === 'party') {
      if (numberOfPersons > 8) {
        const extraPersons = numberOfPersons - 8;
        const pricePerExtraPerson = selectedPackageData.price_per_extra_person || 20;
        total += extraPersons * pricePerExtraPerson;
      }
      
      if (numberOfPersons >= 10) {
        const pricePerExtraPerson = selectedPackageData.price_per_extra_person || 20;
        total -= pricePerExtraPerson;
      }
    } else if (selectedPackageData.name === '4-Stunden Ticket (Wochenende)' && numberOfPersons >= 8) {
      total = numberOfPersons * 23;
    }
    
    return total;
  };

  const createBookingMutation = useMutation({
    mutationFn: async ({ bookingData, emailData }) => {
      const booking = await base44.entities.Booking.create(bookingData);
      
      // Sync to Google Calendar ONLY if status is 'confirmed'
      if (bookingData.status === 'confirmed') {
        let calendarEventId = null;
        try {
          const calendarResponse = await base44.functions.invoke('syncToCalendar', {
            booking_date: bookingData.booking_date,
            start_time: bookingData.start_time,
            end_time: bookingData.end_time,
            customer_name: bookingData.customer_name,
            customer_email: bookingData.customer_email,
            customer_phone: bookingData.customer_phone,
            package_name: bookingData.package_name,
            number_of_persons: bookingData.number_of_persons,
            total_price: bookingData.total_price,
            selected_food: bookingData.selected_food,
            special_requests: bookingData.special_requests,
            status: bookingData.status
          });
          
          console.log('Calendar response:', calendarResponse);
          
          // Update booking with calendar event ID
          if (calendarResponse.data?.eventId) {
            calendarEventId = calendarResponse.data.eventId;
            await base44.entities.Booking.update(booking.id, {
              calendar_event_id: calendarEventId
            });
            console.log('Booking updated with calendar_event_id:', calendarEventId);
          } else {
            console.error('No eventId in calendar response:', calendarResponse);
          }
        } catch (error) {
          console.error('Fehler beim Synchronisieren mit Google Calendar:', error);
        }
      }
      
      // Send notification email to admin
      try {
        await base44.functions.invoke('sendEmail', {
          to: 'info@avanturapark.at',
          subject: `📝 Manuelle Buchung: ${bookingData.customer_name}`,
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2D5F3F;">Neue manuelle Buchung erstellt!</h2>
              <div style="background-color: #F5EFE6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Kunde:</strong> ${bookingData.customer_name}</p>
                <p><strong>E-Mail:</strong> ${bookingData.customer_email || 'Nicht angegeben'}</p>
                <p><strong>Telefon:</strong> ${bookingData.customer_phone || 'Nicht angegeben'}</p>
                <p><strong>Datum:</strong> ${emailData.date}</p>
                <p><strong>Uhrzeit:</strong> ${emailData.start_time} - ${emailData.end_time} Uhr</p>
                <p><strong>Paket:</strong> ${emailData.package_name}</p>
                <p><strong>Personen:</strong> ${emailData.number_of_persons}</p>
                <p><strong>Gesamtpreis:</strong> €${emailData.total_price}</p>
                ${bookingData.selected_food ? `<p><strong>Essen:</strong> ${bookingData.selected_food}</p>` : ''}
                ${bookingData.special_requests ? `<p><strong>Besondere Wünsche:</strong> ${bookingData.special_requests}</p>` : ''}
                <p><strong>Status:</strong> ${bookingData.status}</p>
              </div>
            </div>
          `
        });
      } catch (error) {
        console.error('Fehler beim Senden der Benachrichtigungs-E-Mail:', error);
      }


      
      return { booking, bookingData, emailData };
    },
    onSuccess: ({ bookingData, emailData }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['pendingBookings'] });
      
      // Show success dialog
      setBookingDetails({ ...bookingData, dateFormatted: emailData.date });
      setShowSuccessDialog(true);
      
      // Reset form
      setDate(null);
      setSelectedPackage('');
      setTimeSlot('');
      setNumberOfPersons(1);
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setSpecialRequests('');
      setSelectedFood('');
      setStatus('pending');
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast.error('Fehler beim Erstellen der Buchung.');
      console.error(error);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!date || !selectedPackage || !timeSlot || !customerName) {
      toast.error('Bitte fülle alle Pflichtfelder aus.');
      return;
    }

    // Check if package is booked on correct days
    const dayOfWeek = date.getDay();
    const isFriday = dayOfWeek === 5;
    
    if (selectedPackageData.name.includes('Fr-So') || selectedPackageData.name.includes('Feiertag')) {
      if (!isFriday && !isWeekendDate) {
        toast.error('Dieses Paket ist nur Freitag, Samstag, Sonntag oder an Feiertagen buchbar.');
        return;
      }
    }
    
    if (selectedPackageData.name.includes('Mo-Do')) {
      if (dayOfWeek < 1 || dayOfWeek > 4) {
        toast.error('Dieses Paket ist nur Montag bis Donnerstag buchbar.');
        return;
      }
    }

    // Check if food selection is required
    if (selectedPackageData?.includes_food && selectedPackageData?.food_options?.length > 0 && !selectedFood) {
      toast.error('Bitte wähle eine Essensoption aus.');
      return;
    }

    if (selectedPackageData) {
      if (numberOfPersons < selectedPackageData.min_persons || 
          numberOfPersons > selectedPackageData.max_persons) {
        toast.error(`Personenanzahl muss zwischen ${selectedPackageData.min_persons} und ${selectedPackageData.max_persons} liegen.`);
        return;
      }
    }

    // Check total capacity for overlapping bookings
    const bookingDateStr = format(date, 'yyyy-MM-dd');
    const calculatedEndTime = calculateEndTime(timeSlot, selectedPackageData?.duration_hours || 2);

    // Get all active bookings for this date (all except cancelled)
    const allBookings = await base44.entities.Booking.filter({
      booking_date: bookingDateStr
    });
    
    // Filter out cancelled bookings
    const activeBookings = allBookings.filter(b => b.status !== 'cancelled');

    // Check if booking times overlap
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const newStart = timeToMinutes(timeSlot);
    const newEnd = timeToMinutes(calculatedEndTime);

    // Find overlapping bookings
    const overlappingBookings = activeBookings.filter(b => {
      const existingStart = timeToMinutes(b.start_time);
      const existingEnd = timeToMinutes(b.end_time);

      // Check if times overlap
      return (newStart < existingEnd && newEnd > existingStart);
    });

    const currentCapacity = overlappingBookings.reduce((sum, b) => sum + (b.number_of_persons || 0), 0);
    const maxCapacity = 35;

    // Admin kann trotz voller Kapazität buchen
    if (currentCapacity + numberOfPersons > maxCapacity) {
      console.log(`Warnung: Kapazität überschritten (${currentCapacity + numberOfPersons}/${maxCapacity}), Admin-Buchung wird trotzdem erstellt`);
    }

    const endTime = calculatedEndTime;
    const bookingDate = format(date, 'yyyy-MM-dd');
    const totalPrice = calculateTotalPrice();

    createBookingMutation.mutate({
      bookingData: {
        booking_date: bookingDate,
        start_time: timeSlot,
        end_time: endTime,
        package_id: selectedPackage,
        package_name: selectedPackageData.name,
        number_of_persons: numberOfPersons,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        special_requests: specialRequests,
        selected_food: selectedFood,
        total_price: totalPrice,
        payment_method: 'on_site',
        status: status,
        extras: []
      },
      emailData: {
        customer_name: customerName,
        customer_email: customerEmail,
        date: format(date, 'PPP', { locale: de }),
        start_time: timeSlot,
        end_time: endTime,
        package_name: selectedPackageData.name,
        number_of_persons: numberOfPersons,
        total_price: totalPrice.toFixed(2)
      }
    });
  };

  return (
    <>
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <DialogTitle className="text-2xl text-center text-[#2D5F3F]">
              Buchung erfolgreich erstellt!
            </DialogTitle>
            <DialogDescription className="text-center">
              Die Buchung wurde erfolgreich gespeichert.
            </DialogDescription>
          </DialogHeader>

          {bookingDetails && (
            <div className="space-y-4 py-4">
              <div className="bg-[#F5EFE6] rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kunde:</span>
                  <span className="font-semibold text-[#2D5F3F]">{bookingDetails.customer_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Datum:</span>
                  <span className="font-semibold text-[#2D5F3F]">{bookingDetails.dateFormatted}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Uhrzeit:</span>
                  <span className="font-semibold text-[#2D5F3F]">
                    {bookingDetails.start_time} - {bookingDetails.end_time} Uhr
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Paket:</span>
                  <span className="font-semibold text-[#2D5F3F]">{bookingDetails.package_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Personen:</span>
                  <span className="font-semibold text-[#2D5F3F]">{bookingDetails.number_of_persons}</span>
                </div>
                <div className="flex justify-between text-base pt-3 border-t border-[#2D5F3F]/20">
                  <span className="font-semibold text-gray-700">Gesamtpreis:</span>
                  <span className="font-bold text-[#4A7C59] text-lg">€{bookingDetails.total_price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                // Form is already reset by mutation onSuccess
              }}
              className="w-full bg-gradient-to-r from-[#4A7C59] to-[#2D5F3F] hover:from-[#5A8C69] hover:to-[#3D6F4F] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Weitere Buchung erstellen
            </Button>
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                navigate(createPageUrl('AdminDashboard'));
              }}
              variant="outline"
              className="w-full border-2 border-[#4A7C59] text-[#4A7C59] hover:bg-[#4A7C59] hover:text-white"
            >
              Meine Buchungen anzeigen
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="border-2 border-[#4A7C59]/20">
      <CardHeader>
        <CardTitle className="text-2xl text-[#2D5F3F] flex items-center gap-2">
          <Plus className="w-6 h-6" />
          Manuelle Buchung erstellen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Paket *</Label>
              <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Wähle ein Paket" />
                </SelectTrigger>
                <SelectContent>
                  {availablePackages.length === 0 ? (
                    <div className="p-2 text-sm text-gray-500">Keine Pakete verfügbar</div>
                  ) : (
                    availablePackages.map(pkg => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name} - €{pkg.price}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
                </Select>
                {date && availablePackages.length < packages.length && (
                <p className="text-xs text-orange-600 mt-1">
                  ℹ️ Einige Pakete sind nur an bestimmten Tagen verfügbar
                </p>
                )}

                {selectedPackageData && (
                <div className="mt-2 p-3 bg-[#F5EFE6] rounded-lg space-y-2">
                  <p className="text-xs text-gray-700">{selectedPackageData.description}</p>

                  {selectedPackageData.included_features && selectedPackageData.included_features.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-[#2D5F3F] mb-1">✓ Im Preis enthalten:</p>
                      <ul className="space-y-0.5">
                        {selectedPackageData.included_features.map((feature, idx) => (
                          <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                            <span className="text-[#4A7C59]">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                )}
                </div>

                <div>
              <Label>Datum *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start mt-2">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP', { locale: de }) : 'Datum wählen'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={de}
                    disabled={(date) => {
                      return blockedDays.some(bd => {
                        const blocked = new Date(bd.date);
                        return blocked.getDate() === date.getDate() && 
                               blocked.getMonth() === date.getMonth() && 
                               blocked.getFullYear() === date.getFullYear();
                      });
                    }}
                  />
                  {date && blockedDays.some(bd => new Date(bd.date).toDateString() === date.toDateString()) && (
                    <p className="p-2 text-xs text-red-600 font-medium bg-red-50">
                      ⚠️ Warnung: Dieser Tag ist als "Gesperrt" markiert!
                    </p>
                  )}
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Startzeit *</Label>
              <Select value={timeSlot} onValueChange={setTimeSlot} disabled={!date || !selectedPackage}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={!date ? "Bitte wähle zuerst ein Datum" : !selectedPackage ? "Bitte wähle zuerst ein Paket" : "Uhrzeit wählen"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredTimeSlots.length === 0 && date && selectedPackage && (
                    <div className="p-2 text-xs text-orange-600">
                      Keine Slots verfügbar (Schließzeit 18:30)
                    </div>
                  )}
                  {filteredTimeSlots.map(time => {
                    const availableCapacity = getTimeSlotCapacity(time);
                    const isFull = availableCapacity === 0;

                    return (
                      <SelectItem 
                        key={time} 
                        value={time} 
                        disabled={isFull}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{time} Uhr</span>
                          {isFull ? (
                            <Badge variant="destructive" className="ml-2 text-xs">Ausgebucht</Badge>
                          ) : availableCapacity <= 10 ? (
                            <Badge variant="secondary" className="ml-2 text-xs bg-orange-100 text-orange-800">
                              Nur noch {availableCapacity} Plätze
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-800">
                              {availableCapacity} Plätze frei
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Anzahl Personen *</Label>
              <Input
                type="number"
                min={selectedPackageData?.min_persons || 1}
                max={35}
                value={numberOfPersons}
                onChange={(e) => setNumberOfPersons(parseInt(e.target.value))}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Name *</Label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Kundenname"
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label>E-Mail (optional)</Label>
              <Input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="kunde@email.com"
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">Nur notwendig, wenn Bestätigungsmail versendet werden soll</p>
            </div>

            <div>
              <Label>Telefon</Label>
              <Input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+43 123 456 7890"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Bestätigt</SelectItem>
                  <SelectItem value="pending">Ausstehend</SelectItem>
                  <SelectItem value="completed">Abgeschlossen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Food Selection */}
          {selectedPackageData?.includes_food && selectedPackageData?.food_options?.length > 0 && (
            <div>
              <Label>Essen auswählen *</Label>
              <div className="grid md:grid-cols-3 gap-3 mt-2">
                {selectedPackageData.food_options.map((food, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedFood(food)}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedFood === food
                        ? 'border-[#4A7C59] bg-[#4A7C59]/5'
                        : 'border-gray-200 hover:border-[#FFB84D]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-[#2D5F3F] text-sm">{food}</div>
                      {selectedFood === food && (
                        <Check className="w-4 h-4 text-[#4A7C59]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label>Besondere Wünsche</Label>
            <Textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="z.B. Allergien, besondere Anforderungen..."
              className="mt-2"
              rows={3}
            />
          </div>

          {selectedPackageData && (
            <div className="p-4 bg-[#F5EFE6] rounded-lg">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span className="text-[#2D5F3F]">Gesamtpreis:</span>
                <span className="text-[#4A7C59]">€{calculateTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={createBookingMutation.isPending}
            className="w-full bg-gradient-to-r from-[#4A7C59] to-[#2D5F3F] hover:from-[#FFB84D] hover:to-[#F4A261] text-white font-semibold py-6 text-lg"
          >
            {createBookingMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Wird erstellt...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-5 w-5" />
                Buchung erstellen
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
    </>
  );
}