import { ClipboardList, Wrench, Banknote } from 'lucide-react';

const prerequisites = [
  {
    icon: <ClipboardList className="w-10 h-10 text-primary" />,
    title: 'Conditions Administratives',
    items: [
      'Exercer sur le territoire de la République de Guinée.',
      'Être titulaire d’une licence en informatique ou équivalent.',
      'Détenir un certificat professionnel en sécurité des SI.',
      "Avoir une expérience professionnelle d'au moins 3 ans.",
      'Disposer d’une adresse physique sur le territoire guinéen.',
    ],
  },
  {
    icon: <Wrench className="w-10 h-10 text-primary" />,
    title: 'Conditions Techniques',
    items: [
      'Détenir un manuel de procédures organisationnelles et techniques.',
      'Utiliser des outils validés par l’ANSSI Guinée pour les missions.',
    ],
  },
  {
    icon: <Banknote className="w-10 h-10 text-primary" />,
    title: 'Conditions Financières',
    items: [
      'Paiement des frais de traitement de dossier.',
      'Paiement des frais annuels d’accréditation.',
    ],
  },
];

export function AccreditationPrerequisites() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Prérequis pour l'Accréditation
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Assurez-vous de remplir toutes les conditions nécessaires avant de commencer votre demande.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {prerequisites.map((category) => (
            <div key={category.title} className="bg-secondary p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold">{category.title}</h3>
              </div>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {category.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}