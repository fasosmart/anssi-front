import { Hero } from "@/components/landing/Hero";
import { ProcessSteps } from "@/components/landing/ProcessSteps";
import { AccreditationTypes } from "@/components/landing/AccreditationTypes";
import { AccreditationPrerequisites } from "@/components/landing/AccreditationPrerequisites";
import { Objective } from "@/components/landing/Objective";
import { CallToAction } from "@/components/landing/CallToAction";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProcessSteps />
      <AccreditationTypes />
      <AccreditationPrerequisites />
      <Objective />
      <CallToAction />
    </main>
  );
}