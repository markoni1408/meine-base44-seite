import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Calendar, Users, Mail, Phone, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { toast } from 'sonner';

export default function PendingBookings() {
  const queryClient = useQueryClient();

  const { data: pendingBookings, isLoading } = useQuery({
    queryKey: ['pendingBookings'],
    queryFn: () => base44.entities.Booking.filter({ status: 'pending' }, '-created_date'),
    initialData: [],
  });

  const confirmBookingMutation = useMutation({
    mutationFn: async (booking) => {
      // Update booking status
      await base44.entities.Booking.update(booking.id, { status: 'confirmed' });
      
      // Sync to Google Calendar
      let calendarEventId = null;
      try {
        const calendarResponse = await base44.functions.invoke('syncToCalendar', {
          booking_date: booking.booking_date,
          start_time: booking.start_time,
          end_time: booking.end_time,
          customer_name: booking.customer_name,
          customer_email: booking.customer_email,
          customer_phone: booking.customer_phone,
          package_name: booking.package_name,
          number_of_persons: booking.number_of_persons,
          total_price: booking.total_price,
          selected_food: booking.selected_food,
          special_requests: booking.special_requests,
          status: 'confirmed'
        });
        
        // Update booking with calendar event ID
        if (calendarResponse.data?.eventId) {
          calendarEventId = calendarResponse.data.eventId;
          await base44.entities.Booking.update(booking.id, {
            calendar_event_id: calendarEventId
          });
        }
      } catch (error) {
        console.error('Fehler beim Synchronisieren mit Google Calendar:', error);
      }
      
      // Admin notification removed as per request (only initial booking notification is needed)

      // Send confirmation email if email exists
      if (booking.customer_email) {
        await base44.functions.invoke('sendEmail', {
          to: booking.customer_email,
          subject: '✅ Buchung bestätigt - AVANTURA PARK',
          body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #F5EFE6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5EFE6; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2D5F3F 0%, #4A7C59 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #FFB84D; margin: 0; font-size: 32px; font-weight: bold;">🎉 AVANTURA PARK</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Dschungel-Abenteuer in Wien</p>
            </td>
          </tr>
          
          <!-- Success Message -->
          <tr>
            <td style="padding: 40px 30px 20px 30px; text-align: center;">
              <div style="width: 80px; height: 80px; background-color: #4A7C59; border-radius: 50%; margin: 0 auto 20px; display: inline-flex; align-items: center; justify-content: center;">
                <span style="font-size: 48px;">✅</span>
              </div>
              <h2 style="color: #2D5F3F; margin: 0 0 10px 0; font-size: 28px;">Ihre Buchung wurde bestätigt!</h2>
              <p style="color: #666666; margin: 0; font-size: 16px;">Hallo ${booking.customer_name},</p>
              <p style="color: #666666; margin: 10px 0 0 0; font-size: 16px;">Ihre Buchung wurde von uns geprüft und bestätigt!</p>
            </td>
          </tr>
          
          <!-- Booking Details -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFF8F0; border-radius: 12px; padding: 20px;">
                <tr>
                  <td colspan="2" style="padding-bottom: 15px; border-bottom: 2px solid #FFB84D;">
                    <h3 style="color: #2D5F3F; margin: 0; font-size: 20px;">📅 Buchungsdetails</h3>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; color: #666666; font-size: 15px;">📆 Datum:</td>
                  <td style="padding: 15px 0; color: #2D5F3F; font-weight: bold; text-align: right; font-size: 15px;">${format(new Date(booking.booking_date), 'dd.MM.yyyy', { locale: de })}</td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; color: #666666; border-top: 1px solid #E5E5E5; font-size: 15px;">⏰ Uhrzeit:</td>
                  <td style="padding: 15px 0; color: #2D5F3F; font-weight: bold; text-align: right; border-top: 1px solid #E5E5E5; font-size: 15px;">${booking.start_time} - ${booking.end_time} Uhr</td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; color: #666666; border-top: 1px solid #E5E5E5; font-size: 15px;">🎫 Paket:</td>
                  <td style="padding: 15px 0; color: #2D5F3F; font-weight: bold; text-align: right; border-top: 1px solid #E5E5E5; font-size: 15px;">${booking.package_name}</td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; color: #666666; border-top: 1px solid #E5E5E5; font-size: 15px;">👥 Anzahl Personen:</td>
                  <td style="padding: 15px 0; color: #2D5F3F; font-weight: bold; text-align: right; border-top: 1px solid #E5E5E5; font-size: 15px;">${booking.number_of_persons}</td>
                </tr>
                ${booking.selected_food ? `<tr>
                  <td style="padding: 15px 0; color: #666666; border-top: 1px solid #E5E5E5; font-size: 15px;">🍕 Essen:</td>
                  <td style="padding: 15px 0; color: #2D5F3F; font-weight: bold; text-align: right; border-top: 1px solid #E5E5E5; font-size: 15px;">${booking.selected_food}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 20px 0 0 0; color: #2D5F3F; border-top: 2px solid #FFB84D; font-size: 18px; font-weight: bold;">💰 Gesamtpreis:</td>
                  <td style="padding: 20px 0 0 0; color: #4A7C59; font-weight: bold; text-align: right; border-top: 2px solid #FFB84D; font-size: 22px;">€${booking.total_price}</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Payment Info -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #FFB84D; border-radius: 12px; padding: 20px; text-align: center;">
                <p style="margin: 0; color: #3D2817; font-size: 16px; font-weight: bold;">💳 Zahlung vor Ort</p>
                <p style="margin: 5px 0 0 0; color: #3D2817; font-size: 14px;">Bar oder Kartenzahlung möglich</p>
              </div>
            </td>
          </tr>
          
          <!-- Important Info -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5EFE6; border-radius: 12px; padding: 20px;">
                <tr>
                  <td>
                    <h3 style="color: #2D5F3F; margin: 0 0 15px 0; font-size: 18px;">ℹ️ Wichtige Informationen</h3>
                    <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">✓ Bitte kommen Sie 10 Minuten vor Ihrer Buchungszeit</p>
                    <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">✓ Bringen Sie bequeme Kleidung mit</p>
                    <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">✓ Antirutsch-Socken sind erforderlich</p>
                    <p style="margin: 0; color: #666666; font-size: 14px;">✓ Bei Fragen kontaktieren Sie uns gerne</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Contact Info -->
          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
              <h3 style="color: #2D5F3F; margin: 0 0 20px 0; font-size: 18px;">📞 Kontakt</h3>
              <p style="margin: 0 0 8px 0; color: #666666; font-size: 14px;">
                <strong>Telefon:</strong> 069910046404
              </p>
              <p style="margin: 0 0 8px 0; color: #666666; font-size: 14px;">
                <strong>Adresse:</strong> Eduard-Kittenberger-Gasse 97, 1230 Wien
              </p>
              <p style="margin: 20px 0 0 0; color: #4A7C59; font-size: 18px; font-weight: bold;">
                Wir freuen uns auf Ihren Besuch! 🎊
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #2D5F3F; padding: 20px 30px; text-align: center;">
              <p style="margin: 0; color: #FFB84D; font-size: 12px;">© 2024 AVANTURA PARK GmbH. Alle Rechte vorbehalten.</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
          `
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingBookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Buchung wurde bestätigt und Bestätigungsmail versendet!');
    },
    onError: (error) => {
      toast.error('Fehler beim Bestätigen der Buchung');
      console.error(error);
    }
  });

  const rejectBookingMutation = useMutation({
    mutationFn: (bookingId) => base44.entities.Booking.update(bookingId, { status: 'cancelled' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingBookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Buchung wurde abgelehnt');
    },
    onError: (error) => {
      toast.error('Fehler beim Ablehnen der Buchung');
      console.error(error);
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#4A7C59]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-[#FFB84D]/30">
      <CardHeader className="bg-gradient-to-r from-[#FFB84D]/10 to-transparent">
        <CardTitle className="flex items-center gap-2 text-[#2D5F3F]">
          <Clock className="w-6 h-6" />
          Ausstehende Buchungen ({pendingBookings.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {pendingBookings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Keine ausstehenden Buchungen</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingBookings.map((booking) => (
              <div
                key={booking.id}
                className="border-2 border-[#FFB84D]/50 rounded-lg p-4 bg-gradient-to-br from-[#FFF8F0] to-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge className="bg-[#FFB84D] text-[#3D2817] hover:bg-[#FFB84D]">
                        Ausstehend
                      </Badge>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-[#2D5F3F]">{booking.customer_name}</h3>
                        <p className="text-sm text-gray-600">{booking.package_name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-[#4A7C59]" />
                        <span>{format(new Date(booking.booking_date), 'dd.MM.yyyy', { locale: de })}</span>
                        <span className="text-[#4A7C59] font-semibold">
                          {booking.start_time} - {booking.end_time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users className="w-4 h-4 text-[#4A7C59]" />
                        <span>{booking.number_of_persons} Personen</span>
                        <span className="ml-auto font-semibold text-[#2D5F3F]">€{booking.total_price}</span>
                      </div>
                    </div>

                    {booking.customer_email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{booking.customer_email}</span>
                      </div>
                    )}

                    {booking.customer_phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{booking.customer_phone}</span>
                      </div>
                    )}

                    {booking.selected_food && (
                      <div className="bg-[#FFB84D]/10 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Gewähltes Essen:</p>
                        <p className="text-sm text-gray-800 font-semibold">🍕 {booking.selected_food}</p>
                      </div>
                    )}

                    {booking.special_requests && (
                      <div className="bg-[#F5EFE6] rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Besondere Wünsche:</p>
                        <p className="text-sm text-gray-800">{booking.special_requests}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    <Button
                      onClick={() => confirmBookingMutation.mutate(booking)}
                      disabled={confirmBookingMutation.isPending}
                      className="flex-1 lg:w-32 bg-gradient-to-r from-[#4A7C59] to-[#2D5F3F] hover:from-[#5A8C69] hover:to-[#3D6F4F] text-white"
                    >
                      {confirmBookingMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Bestätigen
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => rejectBookingMutation.mutate(booking.id)}
                      disabled={rejectBookingMutation.isPending}
                      variant="outline"
                      className="flex-1 lg:w-32 border-2 border-red-500 text-red-500 hover:bg-red-50"
                    >
                      {rejectBookingMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Ablehnen
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}