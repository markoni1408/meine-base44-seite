import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ExtraManager() {
  const queryClient = useQueryClient();
  const [editingExtra, setEditingExtra] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    is_active: true,
    icon: '',
  });

  const { data: extras } = useQuery({
    queryKey: ['extras'],
    queryFn: () => base44.entities.Extra.list(),
    initialData: [],
  });

  const createExtraMutation = useMutation({
    mutationFn: (data) => base44.entities.Extra.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extras'] });
      toast.success('Extra erstellt');
      resetForm();
    },
  });

  const updateExtraMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Extra.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extras'] });
      toast.success('Extra aktualisiert');
      resetForm();
    },
  });

  const deleteExtraMutation = useMutation({
    mutationFn: (id) => base44.entities.Extra.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extras'] });
      toast.success('Extra gelöscht');
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      is_active: true,
      icon: '',
    });
    setEditingExtra(null);
    setShowForm(false);
  };

  const handleEdit = (extra) => {
    setEditingExtra(extra);
    setFormData({ ...extra });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingExtra) {
      updateExtraMutation.mutate({ id: editingExtra.id, data: formData });
    } else {
      createExtraMutation.mutate(formData);
    }
  };

  const toggleActive = (extra) => {
    updateExtraMutation.mutate({
      id: extra.id,
      data: { ...extra, is_active: !extra.is_active }
    });
  };

  return (
    <Card className="border-2 border-[#4A7C59]/20">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <CardTitle className="text-xl md:text-2xl text-[#2D5F3F]">Extras verwalten</CardTitle>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#4A7C59] hover:bg-[#2D5F3F] w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Neues Extra
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
                  placeholder="z.B. Geburtstagskuchen"
                  required
                />
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
            </div>
            <div>
              <Label>Beschreibung</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Beschreibe das Extra..."
                rows={3}
              />
            </div>
            <div>
              <Label>Icon (optional)</Label>
              <Input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="z.B. Cake"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="bg-[#4A7C59] hover:bg-[#2D5F3F] w-full sm:w-auto">
                <Check className="w-4 h-4 mr-2" />
                {editingExtra ? 'Aktualisieren' : 'Erstellen'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm} className="w-full sm:w-auto">
                <X className="w-4 h-4 mr-2" />
                Abbrechen
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-2 md:space-y-3">
          {extras.map((extra) => (
            <Card key={extra.id} className={`border ${extra.is_active ? 'border-[#4A7C59]' : 'border-gray-300'}`}>
              <CardContent className="p-3 md:p-4">
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-bold text-[#2D5F3F] text-base md:text-lg">{extra.name}</h3>
                      <Badge 
                        variant={extra.is_active ? 'default' : 'secondary'}
                        className="cursor-pointer text-xs"
                        onClick={() => toggleActive(extra)}
                      >
                        {extra.is_active ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                      <span className="text-xl md:text-2xl font-bold text-[#4A7C59]">€{extra.price}</span>
                    </div>
                    {extra.description && (
                      <p className="text-xs md:text-sm text-gray-600">{extra.description}</p>
                    )}
                  </div>
                  <div className="flex sm:flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(extra)}
                      className="flex-1 sm:flex-none text-xs"
                    >
                      <Pencil className="w-3 h-3 mr-1" />
                      Bearbeiten
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm('Extra wirklich löschen?')) {
                          deleteExtraMutation.mutate(extra.id);
                        }
                      }}
                      className="flex-1 sm:flex-none text-xs"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {extras.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Noch keine Extras vorhanden.</p>
            <p className="text-sm mt-2">Erstelle dein erstes Extra mit dem Button oben.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}