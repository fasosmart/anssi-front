"use client";

import React, { useState, useEffect } from 'react';
import { DossierFormData } from "@/types/api";
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { DossierPDFDocument } from './DossierPDFDocument';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

interface StepProps {
  data: Partial<DossierFormData>;
  updateData: (fields: Partial<DossierFormData>) => void;
}

// Helper components from the old DossierSummary
const SectionTitle = ({ title, number }: { title: string; number?: number }) => (
  <h4 className="font-bold mt-6 mb-3 bg-primary text-primary-foreground p-2">
    {number && `${number}. `}{title}
  </h4>
);

const FormField = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <div className={`flex items-end border-b border-gray-300 py-1`}>
    <span className="text-sm font-medium text-gray-600 mr-2">- {label}:</span>
    <span className="text-sm flex-1 text-left font-semibold text-black">{value || '.........................'}</span>
  </div>
);

const Table = ({ headers, data }: { headers: string[]; data: (string | number | null | undefined)[][] }) => (
  <div className="overflow-x-auto border border-black">
    <table className="w-full text-sm border-collapse">
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
              <td key={j} className="p-2 border-black border">{cell || 'N/A'}</td>
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

const InstructionText = ({ children }: { children: React.ReactNode }) => (
    <p className="text-xs italic text-gray-600 mt-2 px-4">
        [{children}]
    </p>
);

export const Step4ReviewSubmit: React.FC<StepProps> = ({ data, updateData }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDeclarationChange = (checked: boolean) => {
      updateData({ declaration: checked });
  };
  
  const accreditationMap: Record<string, string> = {
    apacs: "APACS - Accompagnement et Conseil en sécurité",
    apassi: "APASSI - Audit de la Sécurité des Systèmes d’Information",
    apdis: "APDIS - Détection d’Incidents de Sécurité",
    apris: "APRIS - Réponse aux Incidents de Sécurité",
    apin: "APIN - Investigation Numérique",
  };

  const selectedAccreditations = data.accreditationTypes
  ? Object.entries(data.accreditationTypes)
      .filter(([, isSelected]) => isSelected)
      .map(([key]) => accreditationMap[key])
  : [];
  
  const { companyInfo, legalRepresentative, representativeDiplomas, representativeCertifications, representativeExperience } = data;
  
  return (
    <div className="space-y-8">
       {/* Section Récapitulatif & Preview */}
       <div>
        <div className="flex justify-between items-center mb-4">
        <div>
                <h3 className="text-lg font-medium">Prévisualisation de la Fiche de Renseignements</h3>
          <p className="text-sm text-muted-foreground">
                    Vérifiez le document qui sera joint à votre soumission. Vous pouvez le télécharger ou l&apos;imprimer.
                </p>
            </div>
            <div className="flex items-center space-x-2 no-print">
                <Button onClick={() => window.print()} variant="outline">
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimer
                </Button>
                {isClient && (
                <PDFDownloadLink
                    document={<DossierPDFDocument data={data} />}
                    fileName={`formulaire-accreditation-anssi-guinee-${data.companyInfo?.name || 'dossier'}.pdf`}
                >
                    {({ loading }) =>
                    loading ? (
                        <Button disabled>Génération PDF...</Button>
                    ) : (
                        <Button>
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger en PDF
                        </Button>
                    )
                    }
                </PDFDownloadLink>
                )}
            </div>
        </div>

        <div id="printable-area" className="p-8 border rounded-md bg-white text-black font-serif">
           {/* Header */}
            <div className="flex justify-between items-center border-2 border-black p-4">
                <Image src="/images/anssi_logo.jpg" alt="ANSSI Logo" width={100} height={100} />
                <div className="bg-primary text-primary-foreground text-center p-4 flex-grow ml-4">
                    <h2 className="font-bold text-lg">DEMANDE D&apos;ACCREDITATION DANS LE DOMAINE DE LA CYBER SECURITE.</h2>
                    <p className="font-semibold">- PERSONNE MORALE -</p>
                </div>
            </div>
            <div className="text-center my-4">
                <h3 className="font-bold px-4 py-2 border-2 border-black bg-primary text-primary-foreground">FICHE DE RENSEIGNEMENTS</h3>
            </div>
            
            {/* Renseignements Généraux */}
            <div className='space-y-4'>
                <SectionTitle title="1. Renseignements généraux" />

                <h5 className="font-normal underline text-md mt-4">Identité de la société</h5>
                <div className="pl-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <FormField label="Nom" value={companyInfo?.name} />
                    <FormField label="Sigle" value={companyInfo?.acronym} />
                  </div>
                  <FormField label="Secteur d'activité" value={companyInfo?.business_sector} />
                  <FormField label="Identifiant fiscal N°" value={companyInfo?.tax_id} />
                  <FormField label="Registre du commerce" value={companyInfo?.commercial_register} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <FormField label="Nombre du personnel" value={companyInfo?.total_staff} />
                    <FormField label="Dont... Experts en sécurité informatique" value={companyInfo?.cybersecurity_experts} />
                  </div>
                </div>
                
                <h5 className="font-normal underline text-md mt-6">Identité du représentant juridique</h5>
                <div className="pl-4">
                  <FormField label="Nom et Prénom" value={`${legalRepresentative?.first_name} ${legalRepresentative?.last_name}`} />
                  <FormField label="Nationalité" value={"Non renseigné"} />
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
                </div>

                <h5 className="font-normal underline text-md mt-6">Coordonnées de la société</h5>
                <div className="pl-4">
                  <FormField label="Adresse" value={companyInfo?.address} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <FormField label="Tél" value={companyInfo?.phone} />
                    <FormField label="Tél. Portable" value={companyInfo?.mobile} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <FormField label="E-mail" value={companyInfo?.email} />
                    <FormField label="Site Web" value={companyInfo?.website} />
                  </div>
                </div>
                <InstructionText>
                    Joindre une copie de la Pièce d’Identité, le bulletin N°3 datant de moins de 3 mois, une copie de l&apos;extrait du registre national des entreprises, le statut accompagné d’un justificatif de son publication au Journal Officiel de la République Guinéenne ou au Journal Officiel du Registre National des Entreprises, un certificat de non faillite, l’attestation d’affiliation à la CNSS, la dernière déclaration des salaires et des salariés.
                </InstructionText>
            </div>
            
            {/* Diplômes */}
            <section className="mt-8">
                <SectionTitle number={2} title="Diplômes du Représentant juridique" />
                <Table 
                    headers={['Diplôme', 'Institution', 'Spécialité / Année', 'Références de la pièce justificative*']}
                    data={(representativeDiplomas || []).map(d => [d.degree_name, d.institution, `${d.specialty || ''} / ${d.year_obtained}`, d.file ? 'Fichier joint' : 'N/A'])}
                />
                <InstructionText>
                    Joindre les diplômes universitaires et indiquer la référence du dossier renfermant ces pièces justificatives dans la colonne appropriée
                </InstructionText>
            </section>
            
            {/* Formations */}
            <section className="mt-8">
                <SectionTitle number={3} title="Cycles de formations du Représentant juridique" />
                <Table 
                    headers={['Formation / Certification', 'Institut / Organisme délivrant la certification', 'Promotion / Année', 'Références de la pièce justificative*']}
                    data={(representativeCertifications || []).map(t => [t.training_name, t.institution, t.year_obtained, t.file ? 'Fichier joint' : 'N/A'])}
                />
                <InstructionText>
                    Joindre l’attestation de réussite ou le certificat pour chaque cycle de formation mentionné dans le tableau ci-dessus et indiquer la référence du dossier renfermant ces pièces justificatives dans la colonne appropriée
                </InstructionText>
            </section>
            
            {/* Cursus Professionnel */}
            <section className="mt-8">
                <SectionTitle number={4} title="Cursus professionnel du Représentant juridique" />
                <Table 
                    headers={['Organisme', 'Forme de recrutement (SIVP, Contractuel ...)', 'Fonctions Exercées', 'Durée Du Au', 'Numéro de la pièce justificative*']}
                    data={(representativeExperience || []).map(e => [e.company, 'Non renseigné', e.job_title, `${e.start_date} - ${e.end_date || 'Présent'}`, e.file ? 'Fichier joint' : 'N/A'])}
                />
                <InstructionText>
                    Joindre l’attestation de travail ainsi pièces justificatives de chaque expérience professionnelle mentionnée dans le tableau ci-dessus et indiquer la référence du dossier renfermant ces pièces justificatives dans la colonne appropriée
                </InstructionText>
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

            {/* Engagement from original PDF */}
            <section className="mt-8">
                 <SectionTitle title="Engagement et déclaration sur l'honneur" />
                 <div className='p-4 space-y-2 text-sm'>
                    <p>Je soussigné,</p>
                    <p>- m&apos;engage à respecter les dispositions du cahier des charges, et j&apos;assume mes responsabilités face à toute infraction;</p>
                    <p>- désigne mon correspondant déclaré à l&apos;unique à l&apos;ANSSI Guinée pour traiter mes données à caractère;</p>
                    <p>- déclare sur l&apos;honneur l&apos;exactitude des renseignements contenus dans la présente fiche;</p>
                    <p>- m&apos;engage à informer l&apos;ANSSI Guinée de chaque modification qui survient sur les données déclarées.</p>
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