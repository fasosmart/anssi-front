"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";
import { Degree, Training, Experience } from "@/types/api";

type CursusItem = Partial<Degree> | Partial<Training> | Partial<Experience>;

interface CursusItemDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
  item: CursusItem | null;
  itemType: 'degree' | 'training' | 'experience';
  apiEndpoint: (itemId?: string) => string;
}

export function CursusItemDialog({ 
    isOpen, 
    setIsOpen, 
    onSuccess, 
    item,
    itemType,
    apiEndpoint
}: CursusItemDialogProps) {
  const [formData, setFormData] = useState<CursusItem>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = item && 'slug' in item && !!item.slug;

  useEffect(() => {
    setFormData(item || {});
  }, [item, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file: file, file_url: undefined })); // Clear file_url when new file is selected
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
        const value = (formData as any)[key];
        // Ne pas ajouter le champ de fichier s'il n'est pas une instance de Fichier (par exemple, si c'est une URL)
        if (key === 'file' && !(value instanceof File)) {
            return;
        }
        if (value !== null && value !== undefined) {
             data.append(key, value);
        }
    });

    try {
      const url = isEditMode ? apiEndpoint(item?.slug) : apiEndpoint();
      const method = isEditMode ? 'put' : 'post';
      await apiClient({ url, method, data, headers: { 'Content-Type': 'multipart/form-data' } });
      
      toast.success(`Élément ${isEditMode ? 'mis à jour' : 'ajouté'} avec succès !`);
      onSuccess();
    } catch (error) {
      toast.error("Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getTitle = () => {
      const action = isEditMode ? 'Modifier' : 'Ajouter';
      switch(itemType) {
          case 'degree': return `${action} un diplôme`;
          case 'training': return `${action} une formation`;
          case 'experience': return `${action} une expérience`;
      }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
            <DialogHeader>
                <DialogTitle>{getTitle()}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                {/* Generic fields, adapt based on itemType */}
                <div className="grid gap-2">
                    <Label htmlFor="name">Titre / Nom</Label>
                    <Input id="name" name={itemType === 'degree' ? 'degree_name' : itemType === 'training' ? 'training_name' : 'job_title'} value={(formData as any)[itemType === 'degree' ? 'degree_name' : itemType === 'training' ? 'training_name' : 'job_title'] || ''} onChange={handleChange} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="institution">Institution / Entreprise</Label>
                    <Input id="institution" name={itemType === 'experience' ? 'company' : 'institution'} value={(formData as any)[itemType === 'experience' ? 'company' : 'institution'] || ''} onChange={handleChange} required />
                </div>
                {itemType !== 'experience' && (
                    <div className="grid gap-2">
                        <Label htmlFor="year_obtained">Année d'obtention</Label>
                        <Input id="year_obtained" name="year_obtained" type="number" value={(formData as any).year_obtained || ''} onChange={handleChange} required />
                    </div>
                )}
                 {itemType === 'experience' && (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="start_date">Date de début</Label>
                            <Input id="start_date" name="start_date" type="date" value={(formData as any).start_date || ''} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="end_date">Date de fin</Label>
                            <Input id="end_date" name="end_date" type="date" value={(formData as any).end_date || ''} onChange={handleChange} />
                        </div>
                    </>
                )}
                <div className="grid gap-2">
                    <Label htmlFor="file">Justificatif (PDF, PNG, JPG)</Label>
                    <Input id="file" name="file" type="file" onChange={handleFileChange} />
                    {(item as any)?.file && (
                        <p className="text-sm text-gray-500 mt-2">
                            Fichier actuel: <a href={(item as any).file} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Voir le fichier</a>
                        </p>
                    )}
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Enregistrement...' : 'Enregistrer'}</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
