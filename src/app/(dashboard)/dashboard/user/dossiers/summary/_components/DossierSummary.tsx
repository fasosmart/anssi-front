"use client";

import React, { useEffect, useState } from 'react';
import { DossierFormData } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import '../print.css'; // Import print styles

// Helper component for displaying data
const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between py-2 border-b">
    <p className="font-semibold text-sm text-muted-foreground">{label}</p>
    <p className="text-sm text-right">{value || 'Non renseigné'}</p>
  </div>
);

// Helper for table data
const Table = ({ headers, data }: { headers: string[]; data: (string | number | null | undefined)[][] }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse border">
        <thead>
          <tr className="bg-muted">
            {headers.map((h, i) => (
              <th key={i} className="p-2 border text-left font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b">
              {row.map((cell, j) => (
                <td key={j} className="p-2 border">{cell || 'N/A'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
);

export const DossierSummary: React.FC = () => {
  const [dossierData, setDossierData] = useState<Partial<DossierFormData> | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('dossierFormData');
    if (data) {
      setDossierData(JSON.parse(data));
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };
  
  const accreditationMap: Record<string, string> = {
    apacs: "APACS - Accompagnement et Conseil en sécurité",
    apassi: "APASSI - Audit de la Sécurité des Systèmes d’Information",
    apdis: "APDIS - Détection d’Incidents de Sécurité",
    apris: "APRIS - Réponse aux Incidents de Sécurité",
    apin: "APIN - Investigation Numérique",
  };

  const selectedAccreditations = dossierData?.accreditationTypes
  ? Object.entries(dossierData.accreditationTypes)
      .filter(([, isSelected]) => isSelected)
      .map(([key]) => accreditationMap[key])
  : [];


  if (!dossierData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Données non disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Le récapitulatif du dossier est introuvable. Veuillez réessayer de soumettre le formulaire.</p>
        </CardContent>
      </Card>
    );
  }

  const { companyInfo, legalRepresentative, representativeDiplomas, representativeCertifications, representativeExperience } = dossierData;

  return (
    <div>
        <div className="flex justify-end mb-4 no-print">
            <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer la fiche
            </Button>
        </div>

        <div id="printable-area" className="p-8 border rounded-md bg-white text-black">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-xl font-bold uppercase">Demande d&apos;accréditation dans le domaine de la cyber sécurité</h1>
                <h2 className="text-lg font-semibold">- Personne Morale -</h2>
                <h3 className="text-2xl font-bold mt-4 border-2 border-black p-2 inline-block">Fiche de renseignements</h3>
            </div>
            
            {/* Renseignements Généraux */}
            <div className='space-y-4'>
                <section>
                    <h4 className="font-bold bg-primary p-2 mb-2 text-lg">Identité de la société</h4>
                    <InfoRow label="Nom:" value={companyInfo?.name} />
                    <InfoRow label="Secteur d'activité:" value={companyInfo?.business_sector} />
                    <InfoRow label="Identifiant fiscal N°:" value={companyInfo?.tax_id} />
                    <InfoRow label="Registre du commerce:" value={companyInfo?.commercial_register} />
                    <InfoRow label="Nombre du personnel:" value={companyInfo?.total_staff} />
                    <InfoRow label="Dont... Experts en sécurité informatique:" value={companyInfo?.cybersecurity_experts} />
                </section>
                
                <section>
                    <h4 className="font-bold bg-primary p-2 mb-2 text-lg">Identité du représentant juridique</h4>
                    <InfoRow label="Nom et Prénom:" value={`${legalRepresentative?.first_name} ${legalRepresentative?.last_name}`} />
                    <InfoRow label="Nationalité:" value={"Non renseigné"} />
                    <InfoRow label="Fonction:" value={legalRepresentative?.job_title} />
                    <InfoRow label="Pièce d'identité N°:" value={legalRepresentative?.idcard_number} />
                    <InfoRow label="Délivrée le:" value={legalRepresentative?.idcard_issued_at} />
                    <InfoRow label="Expire le:" value={legalRepresentative?.idcard_expires_at} />
                    <InfoRow label="Adresse:" value={"Non renseigné"} />
                    <InfoRow label="Tél. fixe:" value={legalRepresentative?.phone} />
                    <InfoRow label="Tél. Portable:" value={legalRepresentative?.mobile} />
                    <InfoRow label="E-mail:" value={legalRepresentative?.email} />
                </section>

                <section>
                    <h4 className="font-bold bg-primary p-2 mb-2 text-lg">Coordonnées de la société</h4>
                    <InfoRow label="Adresse:" value={companyInfo?.address} />
                    <InfoRow label="Tél. fixe:" value={companyInfo?.phone} />
                    <InfoRow label="Tél. Portable:" value={companyInfo?.mobile} />
                    <InfoRow label="Site Web:" value={companyInfo?.website} />
                </section>
            </div>
            
            <Separator className="my-8" />
            
            {/* Diplômes */}
            <section className="space-y-4">
                <h4 className="font-bold bg-primary p-2 text-lg">2. Diplômes du Représentant juridique</h4>
                <Table 
                    headers={['Diplôme', 'Institution', 'Spécialité / Année', 'Références de la pièce justificative*']}
                    data={(representativeDiplomas || []).map(d => [d.degree_name, d.institution, d.year_obtained, d.file ? 'Fichier joint' : 'N/A'])}
                />
            </section>
            
            {/* Formations */}
            <section className="space-y-4 mt-8">
                <h4 className="font-bold bg-primary p-2 text-lg">3. Cycles de formations du Représentant juridique</h4>
                <Table 
                    headers={['Formation / Certification', 'Institut / Organisme délivrant la certification', 'Promotion / Année', 'Références de la pièce justificative*']}
                    data={(representativeCertifications || []).map(t => [t.training_name, t.institution, t.year_obtained, t.file ? 'Fichier joint' : 'N/A'])}
                />
            </section>
            
            {/* Cursus Professionnel */}
            <section className="space-y-4 mt-8">
                <h4 className="font-bold bg-primary p-2 text-lg">4. Cursus professionnel du Représentant juridique</h4>
                <Table 
                    headers={['Organisme', 'Forme de recrutement (SIVP, Contractuel ...)', 'Fonctions Exercées', 'Durée Du Au', 'Numéro de la pièce justificative*']}
                    data={(representativeExperience || []).map(e => [e.company, 'Non renseigné', e.job_title, `${e.start_date} - ${e.end_date || 'Présent'}`, e.file ? 'Fichier joint' : 'N/A'])}
                />
            </section>

            {/* Accréditation Sollicitée */}
            <section className="space-y-4 mt-8">
                <h4 className="font-bold bg-primary p-2 text-lg">Préciser l'accréditation sollicitée (plusieurs peuvent être sollicitées)</h4>
                <div className='p-4'>
                    <ul className="list-disc list-inside">
                        {selectedAccreditations.map(acc => <li key={acc}>{acc}</li>)}
                    </ul>
                </div>
            </section>

            {/* Engagement */}
            <section className="space-y-4 mt-8">
                 <h4 className="font-bold bg-primary p-2 text-lg">Engagement et déclaration sur l&apos;honneur</h4>
                 <div className='p-4 space-y-2 text-sm'>
                    <p>Je soussigné,</p>
                    <p>- m&apos;engage à respecter les dispositions du cahier des charges, et j&apos;assume mes responsabilités face à toute infraction;</p>
                    <p>- désigne mon correspondant déclaré à l&apos;unique à l&apos;ANSI Guinée pour traiter mes données à caractère;</p>
                    <p>- déclare sur l&apos;honneur l&apos;exactitude des renseignements contenus dans la présente fiche;</p>
                    <p>- m&apos;engage à informer l&apos;ANSI Guinée de chaque modification qui survient sur les données déclarées.</p>
                 </div>
            </section>

            {/* Signature */}
            <div className="mt-16 flex justify-between items-end">
                <div>
                    <p>Signature et cachet</p>
                </div>
                <div>
                    <p>................., le ..... / ..... / 20.....</p>
                </div>
            </div>

        </div>
    </div>
  );
};
