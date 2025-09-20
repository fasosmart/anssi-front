"use client";

import React from 'react';
import { DossierSummary } from './_components/DossierSummary';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DossierSummaryPage() {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold">Récapitulatif de la demande</h1>
            <p className="text-muted-foreground">
                Votre dossier a été soumis. Vous pouvez maintenant imprimer la fiche de renseignements.
            </p>
        </div>
        <Link href="/dashboard/user/dossiers">
            <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux dossiers
            </Button>
        </Link>
      </div>
      <DossierSummary />
    </div>
  );
}
