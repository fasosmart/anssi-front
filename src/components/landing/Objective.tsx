import { Target, CheckCircle } from 'lucide-react';

export function Objective() {
  const objectives = [
    "Décrire la démarche et les obligations pour l'accréditation.",
    "Identifier, localiser et évaluer les prestataires en cybersécurité en Guinée.",
    "Ériger les prestataires qualifiés en partenaires de confiance.",
    "Renforcer la sécurité des systèmes d'information des administrations et des opérateurs d'importance vitale (OIV)."
  ];

  return (
    <section className="py-20 md:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="bg-primary/10 rounded-lg p-8">
                <Target className="w-48 h-48 text-primary mx-auto" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Notre Objectif
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Le processus d'accréditation vise à établir un écosystème de confiance en qualifiant les acteurs de la cybersécurité en République de Guinée, conformément à la stratégie nationale.
            </p>
            <ul className="space-y-4">
              {objectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary mr-4 flex-shrink-0 mt-1" />
                  <span className="text-muted-foreground">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}