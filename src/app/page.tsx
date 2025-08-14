import { Hero } from "@/components/landing/Hero";
import { ProcessSteps } from "@/components/landing/ProcessSteps";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProcessSteps />
      {/* Les prochaines sections de la landing page viendront ici */}
    </main>
  );
}