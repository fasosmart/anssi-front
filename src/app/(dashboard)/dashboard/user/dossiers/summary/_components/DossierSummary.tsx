"use client";

import React, { useEffect, useState } from 'react';
import { DossierFormData } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import '../print.css';

// --- Re-styled components for faithful representation ---

const SectionTitle = ({ title, number }: { title: string; number?: number }) => (
  <h4 className="font-bold mt-6 mb-3 bg-primary text-primary-foreground p-2">
    {number && `${number}. `}{title}
  </h4>
);

const FormField = ({ label, value, className = '' }: { label: string, value: React.ReactNode, className?: string }) => (
  <div className={`flex items-end border-b border-gray-300 py-1 ${className}`}>
    <span className="text-sm font-medium text-gray-600 mr-2">{label}:</span>
    <span className="text-sm flex-1 text-left font-semibold text-black">{value || '.........................'}</span>
  </div>
);

const Table = ({ headers, data }: { headers: string[]; data: (string | number | null | undefined)[][] }) => (
    <div className="overflow-x-auto border border-black">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-primary text-primary-foreground">
            {headers.map((h, i) => (
              <th key={i} className="p-2 border-black border text-left font-bold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? data.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="p-2 border-black border-t">{cell || 'N/A'}</td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={headers.length} className="p-2 text-center text-gray-500 border-black border-t">
                Aucune donnée
              </td>
            </tr>
          )}
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
    <div className="container mx-auto">
        <div className="flex justify-end mb-4 no-print">
            <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer la fiche
            </Button>
        </div>

        <div id="printable-area" className="p-8 border rounded-md bg-white text-black font-serif">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-xl font-bold uppercase">Demande d&apos;accréditation dans le domaine de la cyber sécurité</h1>
                <h2 className="text-lg font-semibold">- Personne Morale -</h2>
                <h3 className="text-2xl font-bold mt-4 border-2 bg-primary text-primary-foreground">Fiche de renseignements</h3>
            </div>
            
            {/* Renseignements Généraux */}
            <div className='space-y-4'>
                <SectionTitle title="Renseignements généraux" />

                <h5 className="font-semibold text-md mt-4">Identité de la société</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <FormField label="Nom" value={companyInfo?.name} />
                  <FormField label="Sigle" value={companyInfo?.acronym} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <FormField label="Secteur d'activité" value={companyInfo?.business_sector} />
                  <FormField label="Identifiant fiscal N°" value={companyInfo?.tax_id} />
                  <FormField label="Registre du commerce" value={companyInfo?.commercial_register} />
                  <FormField label="Nombre du personnel" value={companyInfo?.total_staff} />
                </div>
                <FormField label="Dont... Experts en sécurité informatique" value={companyInfo?.cybersecurity_experts} />
                
                <h5 className="font-semibold text-md mt-6">Identité du représentant juridique</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <FormField label="Nom et Prénom" value={`${legalRepresentative?.first_name} ${legalRepresentative?.last_name}`} />
                  <FormField label="Nationalité" value={"Non renseigné"} />
                </div>
                <FormField label="Fonction" value={legalRepresentative?.job_title} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
                  <FormField label="Pièce d'identité N°" value={legalRepresentative?.idcard_number} />
                  <FormField label="délivrée le" value={legalRepresentative?.idcard_issued_at} />
                  <FormField label="expire le" value={legalRepresentative?.idcard_expires_at} />
                </div>
                <FormField label="Adresse" value={"Non renseigné"} />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <FormField label="Tél" value={legalRepresentative?.phone} />
                  <FormField label="Tél. Portable" value={legalRepresentative?.mobile} />
                </div>
                <FormField label="E-mail" value={legalRepresentative?.email} />

                <h5 className="font-semibold text-md mt-6">Coordonnées de la société</h5>
                <FormField label="Adresse" value={companyInfo?.address} />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <FormField label="Tél" value={companyInfo?.phone} />
                  <FormField label="Tél. Portable" value={companyInfo?.mobile} />
                </div>
                <FormField label="Site Web" value={companyInfo?.website} />
            </div>
            
            {/* Diplômes */}
            <section className="mt-8 page-break-before">
                <SectionTitle number={2} title="Diplômes du Représentant juridique" />
                <Table 
                    headers={['Diplôme', 'Institution', 'Spécialité / Année', 'Références de la pièce justificative*']}
                    data={(representativeDiplomas || []).map(d => [d.degree_name, d.institution, `${d.specialty || ''} / ${d.year_obtained}`, d.file ? 'Fichier joint' : 'N/A'])}
                />
            </section>
            
            {/* Formations */}
            <section className="mt-8">
                <SectionTitle number={3} title="Cycles de formations du Représentant juridique" />
                <Table 
                    headers={['Formation / Certification', 'Institut / Organisme délivrant la certification', 'Promotion / Année', 'Références de la pièce justificative*']}
                    data={(representativeCertifications || []).map(t => [t.training_name, t.institution, t.year_obtained, t.file ? 'Fichier joint' : 'N/A'])}
                />
            </section>
            
            {/* Cursus Professionnel */}
            <section className="mt-8">
                <SectionTitle number={4} title="Cursus professionnel du Représentant juridique" />
                <Table 
                    headers={['Organisme', 'Forme de recrutement (SIVP, Contractuel ...)', 'Fonctions Exercées', 'Durée Du Au', 'Numéro de la pièce justificative*']}
                    data={(representativeExperience || []).map(e => [e.company, 'Non renseigné', e.job_title, `${e.start_date} - ${e.end_date || 'Présent'}`, e.file ? 'Fichier joint' : 'N/A'])}
                />
            </section>

            {/* Accréditation Sollicitée */}
            <section className="mt-8">
                <SectionTitle title="Préciser l'accréditation sollicitée (plusieurs peuvent être sollicitées)" />
                <div className='p-4 border border-black'>
                    <ul className="list-disc list-inside">
                        {selectedAccreditations.length > 0 ? selectedAccreditations.map(acc => <li key={acc}>{acc}</li>) : <li>Aucune accréditation sélectionnée</li>}
                    </ul>
                </div>
            </section>

            {/* Engagement */}
            <section className="mt-8">
                 <SectionTitle title="Engagement et déclaration sur l'honneur" />
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
                    <p className='font-bold'>Signature et cachet</p>
                </div>
                <div>
                    <p>................., le ..... / ..... / 20.....</p>
                </div>
            </div>

        </div>
    </div>
  );
};
