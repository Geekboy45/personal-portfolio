import { Hero } from "@/features/portfolio/hero";
import { ImpactMetrics } from "@/features/portfolio/impact-metrics";
import { ProjectsSection } from "@/features/portfolio/projects-section";
import { VisualBanner } from "@/features/portfolio/visual-banner";
import { CareerStory } from "@/features/portfolio/career-story";
import { SkillsSection } from "@/features/portfolio/skills-section";
import { EducationSection } from "@/features/portfolio/education-section";
import { ContactSection } from "@/features/portfolio/contact-section.client";

export function PortfolioPage({ locale = "en" }: { locale?: "es" | "en" }) {
  return (
    <main id="main-content" className="mx-auto max-w-7xl px-6 py-6 sm:py-10">
      <Hero locale={locale} />
      <ImpactMetrics locale={locale} />
      <CareerStory locale={locale} />
      <ProjectsSection locale={locale} />
      <VisualBanner locale={locale} />

      <SkillsSection locale={locale} />
      <EducationSection locale={locale} />
      <ContactSection locale={locale} />
    </main>
  );
}
