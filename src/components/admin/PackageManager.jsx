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
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function PackageManager() {
  const queryClient = useQueryClient();
  const [editingPackage, setEditingPackage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'hourly',
    description: '',
    price: 0,
    duration_hours: 2,
    min_persons: 1,
    max_persons: 10,
    included_features: [],
    is_active: true,
  });

  const { data: packages } = useQuery({
    queryKey: ['packages'],
    queryFn: () => base44.entities.Package.list(),
    initialData: [],
  });

  const createPackageMutation = useMutation({
    mutationFn: (data) => base44.entities.Package.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      toast.success('Paket erstellt');
      resetForm();
    },
  });

  const updatePackageMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Package.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      toast.success('Paket aktualisiert');
      resetForm();
    },
  });

  const deletePackageMutation = useMutation({
    mutationFn: (id) => base44.entities.Package.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      toast.success('Paket gelöscht');
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'hourly',
      description: '',
      price: 0,
      duration_hours: 2,
      min_persons: 1,
      max_persons: 10,
      included_features: [],
      is_active: true,
    });
    setEditingPackage(null);
    setShowForm(false);
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({ ...pkg });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPackage) {
      updatePackageMutation.mutate({ id: editingPackage.id, data: formData });
    } else {
      createPackageMutation.mutate(formData);
    }
  };

  return (
    <Card className="border-2 border-[#4A7C59]/20">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <CardTitle className="text-xl md:text-2xl text-[#2D5F3F]">Pakete verwalten</CardTitle>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#4A7C59] hover:bg-[#2D5F3F] w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Neues Paket
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 md:mb-8 p-4 md:p-6 bg-[#F5EFE6] rounded-lg space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Typ *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Stundenpaket</SelectItem>
                    <SelectItem value="party">Party-Paket</SelectItem>
                    <SelectItem value="day_ticket">Tagesticket</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Preis (€) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label>Dauer (Stunden)</Label>
                <Input
                  type="number"
                  value={formData.duration_hours}
                  onChange={(e) => setFormData({ ...formData, duration_hours: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label>Min. Personen</Label>
                <Input
                  type="number"
                  value={formData.min_persons}
                  onChange={(e) => setFormData({ ...formData, min_persons: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Max. Personen</Label>
                <Input
                  type="number"
                  value={formData.max_persons}
                  onChange={(e) => setFormData({ ...formData, max_persons: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label>Beschreibung</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="bg-[#4A7C59] hover:bg-[#2D5F3F] w-full sm:w-auto">
                <Check className="w-4 h-4 mr-2" />
                {editingPackage ? 'Aktualisieren' : 'Erstellen'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm} className="w-full sm:w-auto">
                <X className="w-4 h-4 mr-2" />
                Abbrechen
              </Button>
            </div>
          </form>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {packages.map((pkg) => (
            <Card key={pkg.id} className={`border ${pkg.is_active ? 'border-[#4A7C59]' : 'border-gray-300'}`}>
              <CardContent className="p-3 md:p-4">
                <div className="flex justify-between items-start mb-2 md:mb-3">
                  <div>
                    <h3 className="font-bold text-[#2D5F3F] text-sm md:text-base">{pkg.name}</h3>
                    <p className="text-xl md:text-2xl font-bold text-[#4A7C59] mt-1">€{pkg.price}</p>
                  </div>
                  <Badge variant={pkg.is_active ? 'default' : 'secondary'} className="text-xs">
                    {pkg.is_active ? 'Aktiv' : 'Inaktiv'}
                  </Badge>
                </div>
                <p className="text-xs md:text-sm text-gray-600 mb-3">{pkg.description}</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(pkg)}
                    className="w-full sm:w-auto text-xs"
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    Bearbeiten
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (confirm('Paket wirklich löschen?')) {
                        deletePackageMutation.mutate(pkg.id);
                      }
                    }}
                    className="w-full sm:w-auto text-xs"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}