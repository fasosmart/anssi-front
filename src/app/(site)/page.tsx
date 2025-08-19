import { Hero } from "@/components/landing/Hero";
import { ProcessSteps } from "@/components/landing/ProcessSteps";
import { AccreditationTypes } from "@/components/landing/AccreditationTypes";
import { AccreditationPrerequisites } from "@/components/landing/AccreditationPrerequisites";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProcessSteps />
      <AccreditationTypes />
      <AccreditationPrerequisites />
    </main>
  );
}