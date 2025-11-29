import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Search, Calendar, Users, Mail, Phone, Euro, Trash2, Eye, Download, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function BookingsTable() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const allBookings = await base44.entities.Booking.list('-booking_date', 100);
      return allBookings;
    },
    initialData: [],
  });

  const deleteBookingMutation = useMutation({
    mutationFn: async (booking) => {
      // Delete from Google Calendar first if event ID exists
      if (booking.calendar_event_id) {
        try {
          console.log('Deleting calendar event:', booking.calendar_event_id);
          const result = await base44.functions.invoke('deleteCalendarEvent', {
            event_id: booking.calendar_event_id
          });
          console.log('Calendar event deleted:', result);
        } catch (error) {
          console.error('Fehler beim Löschen des Calendar Events:', error);
        }
      } else {
        console.log('Keine Calendar Event ID gefunden für Buchung:', booking.id);
      }
      
      // Then delete the booking
      return base44.entities.Booking.delete(booking.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Buchung gelöscht');
    },
    onError: () => {
      toast.error('Fehler beim Löschen');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ bookingId, newStatus }) => 
      base44.entities.Booking.update(bookingId, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Status aktualisiert');
    },
    onError: () => {
      toast.error('Fehler beim Aktualisieren');
    }
  });

  const filteredBookings = bookings.filter(booking => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      booking.customer_name?.toLowerCase().includes(searchLower) ||
      booking.customer_email?.toLowerCase().includes(searchLower) ||
      booking.package_name?.toLowerCase().includes(searchLower)
    );

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    let matchesDate = true;
    if (dateFilter === 'today') {
      const today = format(new Date(), 'yyyy-MM-dd');
      matchesDate = booking.booking_date === today;
    } else if (dateFilter === 'upcoming') {
      const today = format(new Date(), 'yyyy-MM-dd');
      matchesDate = booking.booking_date >= today;
    } else if (dateFilter === 'past') {
      const today = format(new Date(), 'yyyy-MM-dd');
      matchesDate = booking.booking_date < today;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const exportToCSV = () => {
    const headers = ['Datum', 'Zeit', 'Kunde', 'Email', 'Telefon', 'Paket', 'Personen', 'Preis', 'Status'];
    const rows = filteredBookings.map(b => [
      format(new Date(b.booking_date), 'dd.MM.yyyy', { locale: de }),
      `${b.start_time}-${b.end_time}`,
      b.customer_name,
      b.customer_email,
      b.customer_phone || '',
      b.package_name,
      b.number_of_persons,
      b.total_price?.toFixed(2),
      getStatusLabel(b.status)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `buchungen_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed': return 'Bestätigt';
      case 'pending': return 'Ausstehend';
      case 'cancelled': return 'Storniert';
      case 'completed': return 'Abgeschlossen';
      default: return status;
    }
  };

  return (
    <>
      <Card className="border-2 border-[#4A7C59]/20">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <CardTitle className="text-xl md:text-2xl text-[#2D5F3F]">Buchungen</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                className="border-[#4A7C59] text-[#2D5F3F] hover:bg-[#4A7C59] hover:text-white w-full sm:w-auto"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm md:text-base"
                />
              </div>
              
              <div className="grid grid-cols-2 sm:flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-36 md:w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Status</SelectItem>
                    <SelectItem value="confirmed">Bestätigt</SelectItem>
                    <SelectItem value="pending">Ausstehend</SelectItem>
                    <SelectItem value="completed">Abgeschlossen</SelectItem>
                    <SelectItem value="cancelled">Storniert</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full sm:w-36 md:w-40">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Datum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Daten</SelectItem>
                    <SelectItem value="today">Heute</SelectItem>
                    <SelectItem value="upcoming">Bevorstehend</SelectItem>
                    <SelectItem value="past">Vergangen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F5EFE6]">
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">Datum</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">Zeit</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">Kunde</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap hidden lg:table-cell">Paket</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">Personen</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">Preis</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">Status</TableHead>
                  <TableHead className="text-xs md:text-sm whitespace-nowrap">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Lädt...
                    </TableCell>
                  </TableRow>
                ) : filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Keine Buchungen gefunden
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-[#F5EFE6]/50">
                      <TableCell className="text-xs md:text-sm whitespace-nowrap">
                        <div className="flex items-center gap-1 md:gap-2">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4 text-[#4A7C59]" />
                          <span className="hidden sm:inline">{format(new Date(booking.booking_date), 'dd.MM.yyyy', { locale: de })}</span>
                          <span className="sm:hidden">{format(new Date(booking.booking_date), 'dd.MM', { locale: de })}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-xs md:text-sm whitespace-nowrap">
                        <div className="flex flex-col">
                          <span>{booking.start_time}</span>
                          <span className="text-gray-500">{booking.end_time}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs md:text-sm">
                        <div>
                          <div className="font-medium text-[#2D5F3F] whitespace-nowrap">{booking.customer_name}</div>
                          <div className="text-xs text-gray-500 hidden md:flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {booking.customer_email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs md:text-sm hidden lg:table-cell">{booking.package_name}</TableCell>
                      <TableCell className="text-xs md:text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 md:w-4 md:h-4 text-[#4A7C59]" />
                          {booking.number_of_persons}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs md:text-sm whitespace-nowrap">
                        <div className="flex items-center gap-1 font-semibold text-[#2D5F3F]">
                          <Euro className="w-3 h-3 md:w-4 md:h-4" />
                          {booking.total_price?.toFixed(0)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={booking.status}
                          onValueChange={(newStatus) => 
                            updateStatusMutation.mutate({ bookingId: booking.id, newStatus })
                          }
                        >
                          <SelectTrigger className="w-24 md:w-32 text-xs">
                            <SelectValue>
                              <Badge className={`${getStatusColor(booking.status)} text-xs`}>
                                {getStatusLabel(booking.status)}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirmed">Bestätigt</SelectItem>
                            <SelectItem value="pending">Ausstehend</SelectItem>
                            <SelectItem value="completed">Abgeschlossen</SelectItem>
                            <SelectItem value="cancelled">Storniert</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setSelectedBooking(booking)}
                            className="h-8 w-8 md:h-10 md:w-10"
                          >
                            <Eye className="w-3 h-3 md:w-4 md:h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              if (confirm('Buchung wirklich löschen?')) {
                                deleteBookingMutation.mutate(booking);
                              }
                            }}
                            className="h-8 w-8 md:h-10 md:w-10"
                          >
                            <Trash2 className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl text-[#2D5F3F]">Buchungsdetails</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-[#2D5F3F] mb-3">Kundendaten</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{selectedBooking.customer_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">E-Mail:</span>
                      <span className="ml-2 font-medium">{selectedBooking.customer_email}</span>
                    </div>
                    {selectedBooking.customer_phone && (
                      <div>
                        <span className="text-gray-600">Telefon:</span>
                        <span className="ml-2 font-medium">{selectedBooking.customer_phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-[#2D5F3F] mb-3">Buchungsdaten</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Datum:</span>
                      <span className="ml-2 font-medium">
                        {format(new Date(selectedBooking.booking_date), 'dd.MM.yyyy', { locale: de })}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Zeit:</span>
                      <span className="ml-2 font-medium">
                        {selectedBooking.start_time} - {selectedBooking.end_time}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Paket:</span>
                      <span className="ml-2 font-medium">{selectedBooking.package_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Personen:</span>
                      <span className="ml-2 font-medium">{selectedBooking.number_of_persons}</span>
                    </div>
                    {selectedBooking.selected_food && (
                      <div>
                        <span className="text-gray-600">Essen:</span>
                        <span className="ml-2 font-medium">{selectedBooking.selected_food}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedBooking.extras && selectedBooking.extras.length > 0 && (
                <div>
                  <h3 className="font-semibold text-[#2D5F3F] mb-3">Extras</h3>
                  <div className="space-y-2">
                    {selectedBooking.extras.map((extra, idx) => (
                      <div key={idx} className="flex justify-between p-3 bg-[#F5EFE6] rounded-lg">
                        <span>{extra.name}</span>
                        <span className="font-semibold">€{extra.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedBooking.special_requests && (
                <div>
                  <h3 className="font-semibold text-[#2D5F3F] mb-3">Besondere Wünsche</h3>
                  <div className="p-4 bg-[#F5EFE6] rounded-lg">
                    <p className="text-sm text-gray-700">{selectedBooking.special_requests}</p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-[#2D5F3F]">Gesamtpreis:</span>
                  <span className="text-2xl font-bold text-[#4A7C59]">
                    €{selectedBooking.total_price?.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Zahlungsmethode: {selectedBooking.payment_method === 'on_site' ? 'Vor Ort' : selectedBooking.payment_method}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}