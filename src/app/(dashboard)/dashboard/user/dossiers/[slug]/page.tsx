"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useEntity } from '@/contexts/EntityContext';
import { getDemandDetails } from '@/lib/apiClient';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Calendar, User, FileText, Hash, Clock, AlertTriangle, Smartphone, MapPin, BadgeInfo, Download, ArrowRight 
} from 'lucide-react';

const statusConfig = {
  approved: { label: "Approuvé", variant: "default", icon: <FileText className="h-4 w-4" /> },
  submitted: { label: "Soumis", variant: "secondary", icon: <Clock className="h-4 w-4" /> },
  rejected: { label: "Rejeté", variant: "destructive", icon: <AlertTriangle className="h-4 w-4" /> },
  under_review: { label: "En cours d'examen", variant: "outline", icon: <Clock className="h-4 w-4" /> },
  draft: { label: "Brouillon", variant: "secondary", icon: <FileText className="h-4 w-4" /> },
};

const DetailItem = ({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="flex items-start space-x-3">
    {icon && <div className="text-muted-foreground mt-1">{icon}</div>}
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="font-medium">{value || 'N/A'}</p>
    </div>
  </div>
);

export default function DossierDetailPage() {
  const { slug } = useParams();
  const { activeEntity } = useEntity();
  const [demand, setDemand] = useState<any>(null); // Replace with a proper type
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (activeEntity?.slug && typeof slug === 'string') {
        setIsLoading(true);
        try {
          const data = await getDemandDetails(activeEntity.slug, slug);
          setDemand(data);
        } catch (error) {
          toast.error("Impossible de charger les détails de la demande.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    if(activeEntity) fetchDetails();
  }, [activeEntity, slug]);
  
  const formatDate = (dateString: string | null) => dateString ? new Date(dateString).toLocaleDateString() : null;
  
  if (isLoading) return <div className="text-center p-8">Chargement...</div>;
  if (!demand) return <div className="text-center p-8">Demande introuvable.</div>;

  const currentStatus = statusConfig[demand.status as keyof typeof statusConfig] || statusConfig.draft;

  return (
    <div className="space-y-6">
      <Link href="/dashboard/user/dossiers" className="inline-flex items-center text-sm font-medium text-primary hover:underline mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la liste des demandes
      </Link>
      
      <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Demande d'accréditation</h1>
          <p className="text-muted-foreground">Type : {demand.type_accreditation?.name}</p>
        </div>
        <Badge variant={currentStatus.variant as "default" | "secondary" | "destructive" | "outline"} className="text-base px-4 py-2 self-start md:self-center">
          {currentStatus.icon}
          <span className="ml-2">{currentStatus.label}</span>
        </Badge>
      </header>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Informations sur la demande</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-6">
              <DetailItem label="Date de création" value={formatDate(demand.created_at)} icon={<Calendar size={16}/>} />
              <DetailItem label="Dernière modification" value={formatDate(demand.updated_at)} icon={<Calendar size={16}/>} />
              <DetailItem label="Date de soumission" value={formatDate(demand.submission_date)} icon={<Calendar size={16}/>} />
              <DetailItem label="Date d'approbation" value={formatDate(demand.approval_date)} icon={<Calendar size={16}/>} />
              <DetailItem label="Valide du" value={formatDate(demand.valid_from)} icon={<Calendar size={16}/>} />
              <DetailItem label="Valide jusqu'au" value={formatDate(demand.valid_to)} icon={<Calendar size={16}/>} />
              <DetailItem label="Numéro de certificat" value={demand.certificate_number} icon={<Hash size={16}/>} />
            </CardContent>
          </Card>
          
           {demand.status === 'rejected' && (
             <Card>
                <CardHeader><CardTitle className="text-destructive">Informations sur le rejet</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <DetailItem label="Date de rejet" value={formatDate(demand.rejection_date)} icon={<Calendar size={16}/>} />
                    <DetailItem label="Motif du rejet" value={demand.reason_for_rejection} icon={<AlertTriangle size={16}/>} />
                </CardContent>
             </Card>
           )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Représentant Légal</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <DetailItem label="Nom complet" value={`${demand.representative?.first_name} ${demand.representative?.last_name}`} icon={<User size={16}/>} />
              <DetailItem label="Poste" value={demand.representative?.job_title} />
              <DetailItem label="Adresse" value={demand.representative?.address} icon={<MapPin size={16}/>} />
              <DetailItem label="Email" value={demand.representative?.email} />
              <DetailItem label="Téléphone" value={demand.representative?.phone} />
              <DetailItem label="Mobile" value={demand.representative?.mobile} icon={<Smartphone size={16}/>} />
              <DetailItem label="N° CNI" value={demand.representative?.idcard_number} icon={<BadgeInfo size={16}/>} />
              <DetailItem label="Délivrée le" value={formatDate(demand.representative?.idcard_issued_at)} icon={<Calendar size={16}/>} />
              <DetailItem label="Expire le" value={formatDate(demand.representative?.idcard_expires_at)} icon={<Calendar size={16}/>} />
              <DetailItem 
                label="Fichier CNI" 
                value={
                  demand.representative?.idcard_file ? (
                    <a href={demand.representative.idcard_file} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                      Voir le document <Download size={14} className="ml-2" />
                    </a>
                  ) : 'Non fourni'
                } 
                icon={<FileText size={16}/>} 
              />
            </CardContent>
            <CardFooter>
              <Button asChild variant="secondary" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href={`/dashboard/user/representatives/${demand.representative?.slug}`}>
                  Voir les infos complètes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Remarques</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{demand.notes || 'Aucune remarque fournie.'}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
