"use client";

import React, { useState, useEffect } from 'react';
import { DossierFormData } from "@/types/api";
import { PDFViewer } from '@react-pdf/renderer';
import { DossierPDFDocument } from './DossierPDFDocument';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface StepProps {
  data: Partial<DossierFormData>;
  updateData: (fields: Partial<DossierFormData>) => void;
}

export const Step4ReviewSubmit: React.FC<StepProps> = ({ data, updateData }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDeclarationChange = (checked: boolean) => {
      updateData({ declaration: checked });
  };
  
  return (
    <div className="space-y-8">
       {/* Section Récapitulatif & Preview */}
       <div>
       <div className="flex justify-between items-center mb-4">
       <div>
                <h3 className="text-lg font-medium">Prévisualisation de la Fiche de Renseignements</h3>
          <p className="text-sm text-muted-foreground">
                    Vérifiez le document qui sera joint à votre soumission. Vous pouvez le télécharger ou l'imprimer directement depuis l'aperçu.
                </p>
            </div>
        </div>

        <div id="printable-area" className="w-full h-[700px] border rounded-md bg-white text-black font-serif">
          {isClient ? (
            <PDFViewer width="100%" height="100%">
              <DossierPDFDocument data={data} />
            </PDFViewer>
          ) : (
            <p>Chargement de l'aperçu...</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Section Engagement */}
      <div>
        <h3 className="text-lg font-medium">Engagement et déclaration sur l&apos;honneur</h3>
        <div className="mt-4 space-y-4 rounded-md border p-4">
          <p className="text-sm">
            Je déclare sur l’honneur l’exactitude des renseignements contenus dans la présente fiche et m&apos;engage à informer l’ANSSI Guinée de chaque modification qui survient sur les données déclarées.
          </p>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
                id="declaration" 
                checked={data.declaration || false}
                onCheckedChange={handleDeclarationChange}
            />
            <Label htmlFor="declaration" className="font-bold">Je confirme avoir lu et accepté les conditions</Label>
          </div>
        </div>
      </div>
    </div>
  );
};