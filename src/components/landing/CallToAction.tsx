import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';

export function CallToAction() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-6 text-center">
        <Rocket className="w-16 h-16 text-primary mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Prêt à devenir un partenaire de confiance ?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Rejoignez un réseau d&apos;experts qualifiés et contribuez à la sécurisation de l&apos;écosystème numérique guinéen.
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/register">Démarrer votre demande d&apos;accréditation</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}