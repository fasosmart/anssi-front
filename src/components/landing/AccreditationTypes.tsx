import { ShieldCheck, FileScan, Siren, ShieldAlert, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const accreditationTypes = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "APACS",
    subtitle: "Accompagnement et Conseil en sécurité",
    description: "Accompagner les bénéficiaires pour mettre leurs systèmes en conformité avec les exigences de sécurité.",
  },
  {
    icon: <FileScan className="w-8 h-8 text-primary" />,
    title: "APASSI",
    subtitle: "Audit de la Sécurité des Systèmes d’Information",
    description: "Audit d'architecture, de configuration, de code source, tests d'intrusion et audit organisationnel.",
  },
  {
    icon: <Siren className="w-8 h-8 text-primary" />,
    title: "APDIS",
    subtitle: "Détection d’Incidents de Sécurité",
    description: "Services de surveillance, de détection et d'alerte en cas d'incident de sécurité (service SOC).",
  },
  {
    icon: <ShieldAlert className="w-8 h-8 text-primary" />,
    title: "APRIS",
    subtitle: "Réponse aux Incidents de Sécurité",
    description: "Services de réponse aux incidents de sécurité (CERT).",
  },
  {
    icon: <Search className="w-8 h-8 text-primary" />,
    title: "APIN",
    subtitle: "Investigation Numérique",
    description: "Services d’investigation numérique (Forensic).",
  },
];

export function AccreditationTypes() {
  return (
    <section className="py-20 md:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Les Accréditations Délivrées par l&apos;ANSSI
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            L&apos;ANSSI Guinée propose plusieurs types d&apos;accréditations pour couvrir les différents métiers de la cybersécurité.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accreditationTypes.map((accreditation) => (
            <Card key={accreditation.title} className="flex flex-col">
              <CardHeader className="flex-row items-center gap-4 pb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  {accreditation.icon}
                </div>
                <div>
                  <CardTitle>{accreditation.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{accreditation.subtitle}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{accreditation.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}