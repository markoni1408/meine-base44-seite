import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Calendar as CalendarIcon, Plus, Trash2, Ban, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function BlockedDaysManager() {
  const queryClient = useQueryClient();
  const [date, setDate] = useState(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: blockedDays, isLoading } = useQuery({
    queryKey: ['blockedDays'],
    queryFn: () => base44.entities.BlockedDay.list('-date'), // Sort by date descending
    initialData: [],
  });

  const createBlockedDayMutation = useMutation({
    mutationFn: async (data) => {
      await base44.entities.BlockedDay.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedDays'] });
      toast.success('Tag wurde erfolgreich gesperrt');
      setDate(null);
      setReason('');
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error('Fehler beim Sperren des Tages');
      console.error(error);
      setIsSubmitting(false);
    }
  });

  const deleteBlockedDayMutation = useMutation({
    mutationFn: async (id) => {
      await base44.entities.BlockedDay.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedDays'] });
      toast.success('Sperrung aufgehoben');
    },
    onError: (error) => {
      toast.error('Fehler beim Löschen');
      console.error(error);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) {
      toast.error('Bitte wählen Sie ein Datum');
      return;
    }

    // Check if already blocked
    const dateStr = format(date, 'yyyy-MM-dd');
    const exists = blockedDays.some(bd => bd.date === dateStr);
    if (exists) {
      toast.error('Dieser Tag ist bereits gesperrt');
      return;
    }

    setIsSubmitting(true);
    createBlockedDayMutation.mutate({
      date: dateStr,
      reason: reason || 'Geschlossen'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-[#FFB84D]/30">
        <CardHeader className="bg-gradient-to-r from-[#FFB84D]/10 to-transparent">
          <CardTitle className="flex items-center gap-2 text-[#2D5F3F]">
            <Ban className="w-6 h-6" />
            Tag sperren
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <Label>Datum auswählen</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1.5",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: de }) : <span>Datum wählen</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={de}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex-1 w-full">
              <Label>Grund (Optional)</Label>
              <Input 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="z.B. Wartungsarbeiten, Geschlossene Gesellschaft"
                className="mt-1.5"
              />
            </div>

            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-[#2D5F3F] hover:bg-[#1F442D] text-white w-full md:w-auto"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Tag sperren
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-[#2D5F3F]">Gesperrte Tage</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#4A7C59]" />
            </div>
          ) : blockedDays.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Keine gesperrten Tage
            </div>
          ) : (
            <div className="grid gap-4">
              {blockedDays.map((day) => (
                <div 
                  key={day.id} 
                  className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">
                      {format(new Date(day.date), 'dd')}
                    </div>
                    <div>
                      <p className="font-semibold text-[#2D5F3F]">
                        {format(new Date(day.date), 'MMMM yyyy', { locale: de })}
                      </p>
                      <p className="text-sm text-gray-600">{day.reason}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deleteBlockedDayMutation.mutate(day.id)}
                    disabled={deleteBlockedDayMutation.isPending}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}