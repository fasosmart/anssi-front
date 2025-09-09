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
import { Representative, Entity } from "@/types/api";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { API } from "@/lib/api";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

interface AddEditRepresentativeDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
  entity: Entity | null;
  representative?: Representative | null; // Optional: for editing
}

export function AddEditRepresentativeDialog({ 
    isOpen, 
    setIsOpen, 
    onSuccess, 
    entity, 
    representative 
}: AddEditRepresentativeDialogProps) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<Partial<Representative>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!representative?.slug;

  useEffect(() => {
    if (representative) {
      setFormData(representative);
    } else {
      setFormData({}); // Reset for new entry
    }
  }, [representative, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken || !entity?.slug) return;

    setIsSubmitting(true);
    
    const promise = isEditMode
      ? apiClient.put(API.representatives.update(entity.slug, representative.slug!), formData)
      : apiClient.post(API.representatives.create(entity.slug), formData);

    try {
      await promise;
      onSuccess();
    } catch (error) {
      // console.error(error);
      // Handle error (e.g., show toast)
      toast.error("Erreur lors de la création/mise à jour du représentant.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px]">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
            <DialogTitle>{isEditMode ? 'Modifier le représentant' : 'Ajouter un représentant'}</DialogTitle>
            <DialogDescription>
                {isEditMode ? 'Mettez à jour les informations ci-dessous.' : 'Remplissez les informations pour ajouter une nouvelle personne.'}
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-6 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="first_name">Prénom</Label>
                    <Input id="first_name" name="first_name" value={formData.first_name || ''} onChange={handleChange} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="last_name">Nom</Label>
                    <Input id="last_name" name="last_name" value={formData.last_name || ''} onChange={handleChange} required />
                </div>
                <div className="md:col-span-2 grid gap-2">
                    <Label htmlFor="job_title">Fonction</Label>
                    <Input id="job_title" name="job_title" value={formData.job_title || ''} onChange={handleChange} required />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone || ''} onChange={handleChange} />
                </div>
                <div className="md:col-span-2 grid gap-2">
                    <Label htmlFor="mobile">Téléphone mobile</Label>
                    <Input id="mobile" name="mobile" type="tel" value={formData.mobile || ''} onChange={handleChange} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="idcard_number">N° de la pièce d&apos;identité</Label>
                    <Input id="idcard_number" name="idcard_number" value={formData.idcard_number || ''} onChange={handleChange} />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="idcard_issued_at">Délivrée le</Label>
                    <Input id="idcard_issued_at" name="idcard_issued_at" type="date" value={formData.idcard_issued_at || ''} onChange={handleChange} />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="idcard_expires_at">Expire le</Label>
                    <Input id="idcard_expires_at" name="idcard_expires_at" type="date" value={formData.idcard_expires_at || ''} onChange={handleChange} />
                </div>
            </div>
            <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
