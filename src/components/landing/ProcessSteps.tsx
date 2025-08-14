import { UserPlus, Building, FileCheck } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const steps = [
  {
    icon: <UserPlus className="w-8 h-8 text-primary" />,
    title: "1. Créez votre compte",
    description: "Inscrivez-vous rapidement pour accéder à votre espace personnel sécurisé.",
  },
  {
    icon: <Building className="w-8 h-8 text-primary" />,
    title: "2. Enregistrez votre structure",
    description: "Renseignez les informations de votre entreprise ou organisation.",
  },
  {
    icon: <FileCheck className="w-8 h-8 text-primary" />,
    title: "3. Soumettez votre dossier",
    description: "Déposez votre demande d'accréditation en quelques clics.",
  },
];

export function ProcessSteps() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Une procédure simple en 3 étapes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto bg-secondary rounded-full p-3 w-fit mb-4">
                  {step.icon}
                </div>
                <CardTitle>{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}