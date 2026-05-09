import { Hero } from "./components/Hero";
import { IdeaNetworkMap } from "./components/IdeaNetworkMap";
import { MemeticTree } from "./components/MemeticTree";
import { ReligionTimeline } from "./components/ReligionTimeline";
import { IdeaRadar } from "./components/IdeaRadar";
import { SystemsGrid } from "./components/SystemsGrid";
import { AskTheSystem } from "./components/AskTheSystem";
import { Section } from "./components/Section";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <main className="shell">
      <Hero />
      <Section id="network" titleKey="sec1_title" subKey="sec1_sub"><IdeaNetworkMap /></Section>
      <Section id="lineage" titleKey="sec2_title" subKey="sec2_sub"><MemeticTree /></Section>
      <Section id="religion" titleKey="sec3_title" subKey="sec3_sub"><ReligionTimeline /></Section>
      <Section id="score"   titleKey="sec4_title" subKey="sec4_formula"><IdeaRadar /></Section>
      <Section id="systems" titleKey="sec5_title" subKey="sec5_sub"><SystemsGrid /></Section>
      <Section id="ask"     titleKey="sec6_title" subKey="sec6_sub"><AskTheSystem /></Section>
      <Footer />
    </main>
  );
}
