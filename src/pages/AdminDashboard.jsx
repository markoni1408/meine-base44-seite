import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import StatsOverview from '../components/admin/StatsOverview';
import BookingsTable from '../components/admin/BookingsTable';
import PackageManager from '../components/admin/PackageManager';
import ExtraManager from '../components/admin/ExtraManager';
import BlockedDaysManager from '../components/admin/BlockedDaysManager';
import BookingCalendar from '../components/admin/BookingCalendar';
import ManualBookingForm from '../components/admin/ManualBookingForm';
import PendingBookings from '../components/admin/PendingBookings';
import AdvancedAnalytics from '../components/admin/AdvancedAnalytics';
import { 
  ShieldAlert, Mail, LayoutDashboard, Calendar as CalendarIcon, 
  List, PlusCircle, Ban, BarChart3, Package, Star 
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  const handleTestEmail = async () => {
    setIsTestingEmail(true);
    toast.info('Sende Test-E-Mail an info@avanturapark.at...');
    
    try {
      const response = await base44.functions.invoke('sendEmail', {
        to: 'info@avanturapark.at',
        subject: '🧪 Test-E-Mail SMTP Konfiguration',
        body: `
          <div style="font-family: sans-serif; padding: 20px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px;">
            <h2 style="color: #0369a1; margin-top:0;">SMTP Test erfolgreich!</h2>
            <p>Wenn Sie diese E-Mail lesen können, funktioniert der E-Mail-Versand über Ihren Server.</p>
            <p><strong>Zeitstempel:</strong> ${new Date().toLocaleString('de-DE')}</p>
            <hr style="border: 0; border-top: 1px solid #bae6fd; margin: 20px 0;" />
            <p style="font-size: 0.9em; color: #555;">Gesendet vom Admin Dashboard</p>
          </div>
        `
      });

      if (response.data?.success) {
        toast.success(`E-Mail erfolgreich gesendet! (Provider: ${response.data.provider})`);
      } else {
        console.error('Test email failed:', response.data);
        toast.error(`Fehler: ${response.data?.error || 'Unbekannter Fehler'}`);
      }
    } catch (error) {
      console.error('Test email error:', error);
      toast.error('Fehler beim Aufruf der Funktion: ' + error.message);
    } finally {
      setIsTestingEmail(false);
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        if (currentUser.role !== 'admin') {
          window.location.href = '/';
        }
      } catch (error) {
        base44.auth.redirectToLogin();
      } finally {
        setLoading(false);
      }
    };
    
    checkAdmin();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A7C59] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Lädt...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <ShieldAlert className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-[#2D5F3F] mb-2">Zugriff verweigert</h1>
          <p className="text-gray-600">Du hast keine Berechtigung für diese Seite.</p>
        </div>
      </div>
    );
  }

  const SidebarItem = ({ value, icon: Icon, label }) => (
    <TabsTrigger 
      value={value} 
      className="w-full justify-start px-4 py-3 text-sm font-medium transition-colors hover:bg-[#2D5F3F]/10 data-[state=active]:bg-[#2D5F3F] data-[state=active]:text-white rounded-lg mb-1"
    >
      <Icon className="w-4 h-4 mr-3" />
      {label}
    </TabsTrigger>
  );

  const SidebarHeader = ({ title }) => (
    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2 mt-6 first:mt-0">
      {title}
    </h3>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white border-b">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="bg-[#2D5F3F] text-white p-2 rounded-lg">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#2D5F3F]">Admin Dashboard</h1>
                  <p className="text-sm text-gray-500">Angemeldet als {user.full_name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleTestEmail} 
                disabled={isTestingEmail}
                variant="outline" 
                size="sm"
                className="gap-2"
              >
                <Mail className={`w-4 h-4 ${isTestingEmail ? 'animate-spin' : ''}`} />
                {isTestingEmail ? 'Sende...' : 'SMTP Test'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" orientation="vertical" className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border p-4 sticky top-8">
              <TabsList className="flex flex-col h-auto bg-transparent p-0 space-y-1 w-full">
                <SidebarHeader title="Übersicht" />
                <SidebarItem value="dashboard" icon={LayoutDashboard} label="Dashboard" />
                
                <SidebarHeader title="Buchungen" />
                <SidebarItem value="calendar" icon={CalendarIcon} label="Kalender" />
                <SidebarItem value="bookings" icon={List} label="Alle Buchungen" />
                <SidebarItem value="manual" icon={PlusCircle} label="Neue Buchung" />
                <SidebarItem value="blocked" icon={Ban} label="Sperrtage" />

                <SidebarHeader title="Verwaltung" />
                <SidebarItem value="analytics" icon={BarChart3} label="Analytics" />
                <SidebarItem value="packages" icon={Package} label="Pakete" />
                <SidebarItem value="extras" icon={Star} label="Extras" />
              </TabsList>
            </div>
          </aside>

          {/* Content Area */}
          <main className="flex-1 min-w-0">
            <TabsContent value="dashboard" className="mt-0 space-y-8">
              <StatsOverview />
              <PendingBookings />
            </TabsContent>

            <TabsContent value="calendar" className="mt-0">
              <BookingCalendar onSelectDate={(date) => setSelectedDate(date)} />
            </TabsContent>

            <TabsContent value="bookings" className="mt-0">
              <BookingsTable />
            </TabsContent>

            <TabsContent value="manual" className="mt-0">
              <ManualBookingForm preselectedDate={selectedDate} />
            </TabsContent>

            <TabsContent value="blocked" className="mt-0">
              <BlockedDaysManager />
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <AdvancedAnalytics />
            </TabsContent>

            <TabsContent value="packages" className="mt-0">
              <PackageManager />
            </TabsContent>

            <TabsContent value="extras" className="mt-0">
              <ExtraManager />
            </TabsContent>
          </main>
        </Tabs>
      </div>
    </div>
  );
}