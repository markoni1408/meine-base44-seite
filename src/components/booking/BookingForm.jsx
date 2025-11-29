import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, Users, Mail, Phone, Check, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { toast } from 'sonner';

export default function BookingForm({ preselectedPackageId }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [date, setDate] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [selectedFood, setSelectedFood] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showCapacityDialog, setShowCapacityDialog] = useState(false);
  const [availableAlternatives, setAvailableAlternatives] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set preselected package when prop changes
  React.useEffect(() => {
    if (preselectedPackageId) {
      setSelectedPackage(preselectedPackageId);
    }
  }, [preselectedPackageId]);

  // Check capacity whenever relevant fields change
  React.useEffect(() => {
    if (date && selectedPackage && timeSlot && numberOfPersons && selectedPackageData) {
      const checkCapacity = async () => {
        const bookingDateStr = format(date, 'yyyy-MM-dd');
        const calculatedEndTime = calculateEndTime(timeSlot, selectedPackageData.duration_hours || 2);

        const allBookings = await base44.entities.Booking.filter({
          booking_date: bookingDateStr
        });
        
        const activeBookings = allBookings.filter(b => b.status !== 'cancelled');

        const timeToMinutes = (time) => {
          const [hours, minutes] = time.split(':').map(Number);
          return hours * 60 + minutes;
        };

        const newStart = timeToMinutes(timeSlot);
        const newEnd = timeToMinutes(calculatedEndTime);

        const overlappingBookings = activeBookings.filter(b => {
          const existingStart = timeToMinutes(b.start_time);
          const existingEnd = timeToMinutes(b.end_time);
          return (newStart < existingEnd && newEnd > existingStart);
        });

        const currentCapacity = overlappingBookings.reduce((sum, b) => sum + (b.number_of_persons || 0), 0);
        const maxCapacity = 35;

        if (currentCapacity + numberOfPersons > maxCapacity) {
          const alternatives = timeSlots
            .filter(time => {
              const capacity = getTimeSlotCapacity(time);
              return capacity >= numberOfPersons;
            })
            .map(time => ({
              time,
              capacity: getTimeSlotCapacity(time)
            }));
          
          setAvailableAlternatives(alternatives);
          setShowCapacityDialog(true);
          setTimeSlot('');
        }
      };
      
      checkCapacity();
    }
  }, [date, selectedPackage, timeSlot, numberOfPersons]);

  const { data: packages } = useQuery({
    queryKey: ['packages'],
    queryFn: () => base44.entities.Package.filter({ is_active: true }),
    initialData: [],
  });

  const { data: extras } = useQuery({
    queryKey: ['extras'],
    queryFn: () => base44.entities.Extra.filter({ is_active: true }),
    initialData: [],
  });

  const { data: blockedDays } = useQuery({
    queryKey: ['blockedDays'],
    queryFn: () => base44.entities.BlockedDay.list(),
    initialData: [],
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

  // Check opening hours based on selected date
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

    // Calculate end time in decimal hours (e.g. 14:30 = 14.5)
    const startTimeDecimal = hours + (minutes / 60);
    const endTimeDecimal = startTimeDecimal + duration;

    // Park closes at 18:30
    return endTimeDecimal <= 18.5;
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
      // Birthday packages - special pricing logic
      if (numberOfPersons > 8) {
        const extraPersons = numberOfPersons - 8;
        const pricePerExtraPerson = selectedPackageData.price_per_extra_person || 20;
        total += extraPersons * pricePerExtraPerson;
      }
      
      // Birthday child free from 10 children
      if (numberOfPersons >= 10) {
        const pricePerExtraPerson = selectedPackageData.price_per_extra_person || 20;
        total -= pricePerExtraPerson; // Deduct one child
      }
    } else if (selectedPackageData.name === '4-Stunden Ticket' && numberOfPersons >= 8) {
      // Special pricing for 4h ticket: 23€ per person for 8+ children
      total = numberOfPersons * 23;
    }
    
    selectedExtras.forEach(extraId => {
      const extra = extras.find(e => e.id === extraId);
      if (extra) total += extra.price;
    });
    
    return total;
  };

  const toggleExtra = (extraId) => {
    setSelectedExtras(prev => 
      prev.includes(extraId) 
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  };

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData) => {
      // Call backend function instead of creating entity directly
      const response = await base44.functions.invoke('createBooking', { bookingData });

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      return { booking: response.data.booking, bookingData };
    },
    onSuccess: ({ bookingData }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });

      // Show success dialog with booking details
      setBookingDetails(bookingData);
      setShowSuccessDialog(true);
      setIsSubmitting(false);

      // Reset form
      setDate(null);
      setSelectedPackage('');
      setTimeSlot('');
      setNumberOfPersons(1);
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setSpecialRequests('');
      setSelectedExtras([]);
      setSelectedFood('');
    },
    onError: (error) => {
      toast.error(`Fehler bei der Buchung: ${error.message || 'Bitte versuche es erneut.'}`);
      console.error(error);
      setIsSubmitting(false);
    }
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!date || !selectedPackage || !timeSlot || !customerName || !customerEmail || !customerPhone) {
        toast.error('Bitte fülle alle Pflichtfelder aus.');
        setIsSubmitting(false);
        return;
      }

      // Check if package is booked on correct days
      const dayOfWeek = date.getDay();
      const isFriday = dayOfWeek === 5;

      if (selectedPackageData.name.includes('Fr-So') || selectedPackageData.name.includes('Feiertag')) {
        if (!isFriday && !isWeekendDate) {
          toast.error('Dieses Paket ist nur Freitag, Samstag, Sonntag oder an Feiertagen buchbar.');
          setIsSubmitting(false);
          return;
        }
      }

      if (selectedPackageData.name.includes('Mo-Do')) {
        if (dayOfWeek < 1 || dayOfWeek > 4) {
          toast.error('Dieses Paket ist nur Montag bis Donnerstag buchbar.');
          setIsSubmitting(false);
          return;
        }
      }

      // Check if food selection is required
      if (selectedPackageData?.includes_food && selectedPackageData?.food_options?.length > 0 && !selectedFood) {
        toast.error('Bitte wähle eine Essensoption aus.');
        setIsSubmitting(false);
        return;
      }

      // Check if date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        toast.error('Buchungsdatum darf nicht in der Vergangenheit liegen.');
        setIsSubmitting(false);
        return;
      }

      if (selectedPackageData) {
        if (numberOfPersons < selectedPackageData.min_persons || 
            numberOfPersons > selectedPackageData.max_persons) {
          toast.error(`Personenanzahl muss zwischen ${selectedPackageData.min_persons} und ${selectedPackageData.max_persons} liegen.`);
          setIsSubmitting(false);
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

      if (currentCapacity + numberOfPersons > maxCapacity) {
        // Find alternative time slots with enough capacity
        const alternatives = timeSlots
          .filter(time => {
            const capacity = getTimeSlotCapacity(time);
            return capacity >= numberOfPersons;
          })
          .map(time => ({
            time,
            capacity: getTimeSlotCapacity(time)
          }));

        setAvailableAlternatives(alternatives);
        setShowCapacityDialog(true);
        setIsSubmitting(false);
        return;
      }

      const endTime = calculatedEndTime;
      const extrasData = selectedExtras.map(id => {
        const extra = extras.find(e => e.id === id);
        return { name: extra.name, price: extra.price };
      });

      createBookingMutation.mutate({
        booking_date: format(date, 'yyyy-MM-dd'),
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
        total_price: calculateTotalPrice(),
        payment_method: 'on_site',
        status: 'pending',
        extras: extrasData
      });
    } catch (error) {
      console.error('Error during submission preparation:', error);
      toast.error('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Capacity Warning Dialog */}
      <Dialog open={showCapacityDialog} onOpenChange={setShowCapacityDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-10 h-10 text-orange-600" />
            </div>
            <DialogTitle className="text-2xl text-center text-[#2D5F3F]">
              Zeitslot nicht verfügbar
            </DialogTitle>
            <DialogDescription className="text-center">
              Für den gewählten Zeitraum sind nicht genügend Plätze verfügbar für {numberOfPersons} Person(en).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {availableAlternatives.length > 0 ? (
              <>
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertTitle>Alternative Zeitslots verfügbar</AlertTitle>
                  <AlertDescription>
                    Folgende Zeitslots haben genügend Plätze für Ihre Buchung:
                  </AlertDescription>
                </Alert>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableAlternatives.map(({ time, capacity }) => (
                    <button
                      key={time}
                      onClick={() => {
                        setTimeSlot(time);
                        setShowCapacityDialog(false);
                        toast.success(`Zeitslot ${time} Uhr ausgewählt`);
                      }}
                      className="w-full p-4 border-2 border-[#4A7C59]/20 rounded-lg hover:border-[#4A7C59] hover:bg-[#4A7C59]/5 transition-all text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-[#2D5F3F]">{time} Uhr</div>
                          <div className="text-sm text-gray-600">
                            bis {calculateEndTime(time, selectedPackageData?.duration_hours || 2)} Uhr
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {capacity} Plätze frei
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Keine Verfügbarkeit</AlertTitle>
                <AlertDescription>
                  Für diesen Tag sind leider keine passenden Zeitslots mehr verfügbar. 
                  Bitte wählen Sie ein anderes Datum oder kontaktieren Sie uns telefonisch.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Button
            onClick={() => setShowCapacityDialog(false)}
            variant="outline"
            className="w-full"
          >
            Schließen
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <DialogTitle className="text-2xl text-center text-[#2D5F3F]">
              Buchung erfolgreich!
            </DialogTitle>
            <DialogDescription className="text-center">
              Ihre Buchungsbestätigung wurde an {bookingDetails?.customer_email} gesendet.
            </DialogDescription>
          </DialogHeader>
          
          {bookingDetails && (
            <div className="space-y-4 py-4">
              <div className="bg-[#F5EFE6] rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Datum:</span>
                  <span className="font-semibold text-[#2D5F3F]">
                    {format(new Date(bookingDetails.booking_date), 'dd.MM.yyyy', { locale: de })}
                  </span>
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
                {bookingDetails.selected_food && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Essen:</span>
                    <span className="font-semibold text-[#2D5F3F]">{bookingDetails.selected_food}</span>
                  </div>
                )}
                <div className="flex justify-between text-base pt-3 border-t border-[#2D5F3F]/20">
                  <span className="font-semibold text-gray-700">Gesamtpreis:</span>
                  <span className="font-bold text-[#4A7C59] text-lg">€{bookingDetails.total_price}</span>
                </div>
              </div>
              
              <div className="bg-[#FFB84D]/10 rounded-lg p-3 text-center text-sm text-[#3D2817]">
                <p className="font-medium">Zahlung vor Ort</p>
                <p className="text-xs mt-1">Bar oder Kartenzahlung möglich</p>
              </div>
            </div>
          )}
          
          <Button
            onClick={() => {
              setShowSuccessDialog(false);
              navigate(createPageUrl('BookingSuccess'));
            }}
            className="w-full bg-gradient-to-r from-[#4A7C59] to-[#2D5F3F] hover:from-[#FFB84D] hover:to-[#F4A261] text-white"
          >
            Bestätigen
          </Button>
        </DialogContent>
      </Dialog>

      <form onSubmit={handleSubmit} className="space-y-8">
      {/* Package Selection */}
      <Card className="border-2 border-[#4A7C59]/20 shadow-md hover:shadow-xl transition-shadow">
        <CardHeader className="bg-gradient-to-r from-[#4A7C59]/5 to-transparent">
          <CardTitle className="flex items-center gap-3 text-[#2D5F3F]">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4A7C59] to-[#2D5F3F] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <div>
              <div className="text-lg">Paket auswählen</div>
              <div className="text-sm font-normal text-gray-600">Wählen Sie Ihr gewünschtes Erlebnispaket</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                    {pkg.name} - €{pkg.price} {pkg.type === 'hourly' && '/Person'}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          
          {date && availablePackages.length < packages.length && (
            <p className="text-xs text-orange-600 mt-2">
              ℹ️ Einige Pakete sind nur an bestimmten Tagen verfügbar
            </p>
          )}
          
          {selectedPackageData && (
            <div className="mt-4 p-4 bg-[#F5EFE6] rounded-lg space-y-3">
              <p className="text-sm text-gray-700">{selectedPackageData.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <Clock className="w-3 h-3 mr-1" />
                  {selectedPackageData.duration_hours}h
                </Badge>
                <Badge variant="secondary">
                  <Users className="w-3 h-3 mr-1" />
                  {selectedPackageData.min_persons}-{selectedPackageData.max_persons} Personen
                </Badge>
              </div>

              {selectedPackageData.included_features && selectedPackageData.included_features.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[#2D5F3F] mb-2">✓ Im Preis enthalten:</p>
                  <ul className="space-y-1">
                    {selectedPackageData.included_features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                        <span className="text-[#4A7C59] mt-0.5">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedPackageData.includes_food && selectedPackageData.food_options && selectedPackageData.food_options.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[#2D5F3F] mb-2">🍕 Essensoptionen (bitte später auswählen):</p>
                  <ul className="space-y-1">
                    {selectedPackageData.food_options.map((food, idx) => (
                      <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                        <span className="text-[#4A7C59] mt-0.5">•</span>
                        <span>{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Date & Time */}
      <Card className="border-2 border-[#4A7C59]/20 shadow-md hover:shadow-xl transition-shadow">
        <CardHeader className="bg-gradient-to-r from-[#4A7C59]/5 to-transparent">
          <CardTitle className="flex items-center gap-3 text-[#2D5F3F]">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4A7C59] to-[#2D5F3F] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">2</span>
            </div>
            <div>
              <div className="text-lg">Datum & Uhrzeit</div>
              <div className="text-sm font-normal text-gray-600">Wählen Sie Ihren Wunschtermin</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (date < today) return true;

                    return blockedDays.some(bd => {
                      const blocked = new Date(bd.date);
                      return blocked.getDate() === date.getDate() && 
                             blocked.getMonth() === date.getMonth() && 
                             blocked.getFullYear() === date.getFullYear();
                    });
                  }}
                  locale={de}
                />
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
                  <div className="p-3 text-sm text-orange-600 max-w-[280px]">
                    Für dieses Paket ({selectedPackageData?.duration_hours}h) sind heute leider keine Termine mehr möglich, da wir um 18:30 schließen.
                  </div>
                )}
                {filteredTimeSlots.map(time => {
                  const availableCapacity = getTimeSlotCapacity(time);
                  const isFull = availableCapacity <= 0;

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
            {date && (
              <p className="text-xs text-gray-500 mt-1">
                Öffnungszeiten: {date.getDay() === 0 || date.getDay() === 6 ? '10:30-18:30' : '13:00-18:30'} Uhr
              </p>
              )}
          </div>

          <div>
            <Label>Anzahl Personen *</Label>
            <Input
              type="number"
              min={selectedPackageData?.min_persons || 1}
              max={selectedPackageData?.max_persons || 50}
              value={numberOfPersons}
              onChange={(e) => setNumberOfPersons(parseInt(e.target.value))}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Food Selection */}
      {selectedPackageData?.includes_food && selectedPackageData?.food_options?.length > 0 && (
        <Card className="border-2 border-[#4A7C59]/20 shadow-md hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-[#4A7C59]/5 to-transparent">
            <CardTitle className="flex items-center gap-3 text-[#2D5F3F]">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4A7C59] to-[#2D5F3F] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <div>
                <div className="text-lg">Essen auswählen</div>
                <div className="text-sm font-normal text-gray-600">Wählen Sie Ihr Essen *</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {selectedPackageData.food_options.map((food, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedFood(food)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedFood === food
                      ? 'border-[#4A7C59] bg-[#4A7C59]/5'
                      : 'border-gray-200 hover:border-[#FFB84D]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-[#2D5F3F]">{food}</div>
                    {selectedFood === food && (
                      <Check className="w-5 h-5 text-[#4A7C59]" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extras */}
      {extras.length > 0 && (
        <Card className="border-2 border-[#4A7C59]/20 shadow-md hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-[#4A7C59]/5 to-transparent">
            <CardTitle className="flex items-center gap-3 text-[#2D5F3F]">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4A7C59] to-[#2D5F3F] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">{selectedPackageData?.includes_food && selectedPackageData?.food_options?.length > 0 ? '4' : '3'}</span>
              </div>
              <div>
                <div className="text-lg">Extras hinzufügen</div>
                <div className="text-sm font-normal text-gray-600">Optional: Machen Sie Ihr Erlebnis noch besser</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {extras.map(extra => (
                <div
                  key={extra.id}
                  onClick={() => toggleExtra(extra.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedExtras.includes(extra.id)
                      ? 'border-[#4A7C59] bg-[#4A7C59]/5'
                      : 'border-gray-200 hover:border-[#FFB84D]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[#2D5F3F]">{extra.name}</div>
                      <div className="text-sm text-gray-600">{extra.description}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#2D5F3F]">€{extra.price}</span>
                      {selectedExtras.includes(extra.id) && (
                        <Check className="w-5 h-5 text-[#4A7C59]" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Info */}
      <Card className="border-2 border-[#4A7C59]/20 shadow-md hover:shadow-xl transition-shadow">
        <CardHeader className="bg-gradient-to-r from-[#4A7C59]/5 to-transparent">
          <CardTitle className="flex items-center gap-3 text-[#2D5F3F]">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4A7C59] to-[#2D5F3F] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">
                {selectedPackageData?.includes_food && selectedPackageData?.food_options?.length > 0 
                  ? (extras.length > 0 ? '5' : '4')
                  : (extras.length > 0 ? '4' : '3')}
              </span>
            </div>
            <div>
              <div className="text-lg">Ihre Kontaktdaten</div>
              <div className="text-sm font-normal text-gray-600">Damit wir Sie erreichen können</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Name *</Label>
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Dein vollständiger Name"
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label>E-Mail *</Label>
            <Input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="deine@email.com"
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label>Telefon *</Label>
            <Input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+43 123 456 7890"
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label>Besondere Wünsche</Label>
            <Textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="z.B. Allergien, besondere Anforderungen..."
              className="mt-2"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary & Submit */}
      <Card className="border-2 border-[#FFB84D] bg-gradient-to-br from-[#FFF8F0] to-white shadow-xl">
        <CardHeader className="bg-gradient-to-r from-[#FFB84D]/20 to-transparent">
          <CardTitle className="text-[#2D5F3F] text-2xl flex items-center gap-2">
            <Check className="w-6 h-6" />
            Buchungszusammenfassung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-6">
            {selectedPackageData && (
              <>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-700">{selectedPackageData.name}</span>
                  <span className="font-semibold text-[#2D5F3F]">
                    €{selectedPackageData.price}
                    {selectedPackageData.type === 'hourly' && ` x ${numberOfPersons}`}
                  </span>
                </div>

                {/* Party package extra persons breakdown */}
                {selectedPackageData.type === 'party' && numberOfPersons > 8 && (
                  <>
                    <div className="flex justify-between py-2 border-b text-sm">
                      <span className="text-gray-600">
                        Zusätzliche Personen ({numberOfPersons - 8} x €{selectedPackageData.price_per_extra_person || 20})
                      </span>
                      <span className="font-semibold text-[#2D5F3F]">
                        €{((numberOfPersons - 8) * (selectedPackageData.price_per_extra_person || 20)).toFixed(2)}
                      </span>
                    </div>
                    {numberOfPersons >= 10 && (
                      <div className="flex justify-between py-2 border-b text-sm">
                        <span className="text-green-700">
                          Geburtstagskind gratis (ab 10 Personen)
                        </span>
                        <span className="font-semibold text-green-600">
                          -€{(selectedPackageData.price_per_extra_person || 20).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* 4h ticket special pricing */}
                {selectedPackageData.name === '4-Stunden Ticket' && numberOfPersons >= 8 && (
                  <div className="flex justify-between py-2 border-b text-sm">
                    <span className="text-gray-600">
                      Gruppentarif (ab 8 Personen): {numberOfPersons} x €23
                    </span>
                    <span className="font-semibold text-[#2D5F3F]">
                      €{(numberOfPersons * 23).toFixed(2)}
                    </span>
                  </div>
                )}
              </>
            )}
            {selectedExtras.map(extraId => {
              const extra = extras.find(e => e.id === extraId);
              return extra ? (
                <div key={extraId} className="flex justify-between py-2 border-b">
                  <span className="text-gray-700">{extra.name}</span>
                  <span className="font-semibold text-[#2D5F3F]">€{extra.price}</span>
                </div>
              ) : null;
            })}
            <div className="flex justify-between py-3 text-xl font-bold">
              <span className="text-[#2D5F3F]">Gesamt</span>
              <span className="text-[#4A7C59]">€{calculateTotalPrice().toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-[#FFB84D]/20 p-4 rounded-lg mb-6">
            <p className="text-sm text-[#3D2817]">
              <strong>Zahlungsmethode:</strong> Zahlung vor Ort (Bar oder Karte)
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || createBookingMutation.isPending}
            className="w-full bg-gradient-to-r from-[#4A7C59] to-[#2D5F3F] hover:from-[#FFB84D] hover:to-[#F4A261] text-white font-semibold py-6 text-lg rounded-xl shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting || createBookingMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Wird verarbeitet...
              </>
            ) : (
              <>
                <Check className="mr-2 h-5 w-5" />
                Jetzt verbindlich buchen
              </>
            )}
          </Button>

          <p className="text-xs text-center text-gray-500 mt-4">
            Nach der Buchung erhältst du eine Bestätigungs-E-Mail mit allen Details.
          </p>
        </CardContent>
      </Card>
    </form>
    </>
  );
}