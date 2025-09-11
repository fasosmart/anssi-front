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
import { Document, Entity } from "@/types/api";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { API } from "@/lib/api";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

interface AddEditDocumentDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
  entity: Entity;
  document?: Document | null;
}

export function AddEditDocumentDialog({
  isOpen,
  setIsOpen,
  onSuccess,
  entity,
  document,
}: AddEditDocumentDialogProps) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<Partial<Document>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!document?.slug;

  useEffect(() => {
    if (document) {
      // Don't put the file object in the state for editing
      const { file, ...rest } = document;
      setFormData(rest);
    } else {
      setFormData({});
    }
  }, [document, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken || !entity?.slug) return;

    setIsSubmitting(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        if (value instanceof File) {
          data.append(key, value);
        } else {
          data.append(key, String(value));
        }
      }
    });

    const promise = isEditMode
      ? apiClient.patch(API.documents.update(entity.slug, document!.slug!), data)
      : apiClient.post(API.documents.create(entity.slug), data);

    try {
      await promise;
      onSuccess();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement du document.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Modifier le document" : "Ajouter un document"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom du document</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="file">Fichier (PDF, PNG, JPG)</Label>
              <Input
                id="file"
                name="file"
                type="file"
                onChange={handleFileChange}
                required={!isEditMode}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="issued_at">Date de délivrance</Label>
                    <Input
                        id="issued_at"
                        name="issued_at"
                        type="date"
                        value={formData.issued_at || ""}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="expires_at">Date d'expiration (optionnel)</Label>
                    <Input
                        id="expires_at"
                        name="expires_at"
                        type="date"
                        value={formData.expires_at || ""}
                        onChange={handleChange}
                    />
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
