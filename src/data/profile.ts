export interface SocialLink {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "mail" | "document";
}

export interface ProfileData {
  name: string;
  shortName: string;
  headline: {
    es: string;
    en: string;
  };
  summary: {
    es: string;
    en: string;
  };
  currentRole: {
    title: string;
    company: string;
    location: string;
    availability: {
      es: string;
      en: string;
    };
  };
  location: string;
  email: string;
  socials: SocialLink[];
  domains: string[];
}

export const profileData: ProfileData = {
  name: "Luis Angel Elizondo Gallegos",
  shortName: "Luis Elizondo",
  headline: {
    es: "Tech Lead & Software Engineer con enfoque en arquitecturas cloud escalables, automatización de procesos críticos y productos basados en datos.",
    en: "Tech Lead & Software Engineer building scalable cloud systems, automation platforms and data-driven products.",
  },
  summary: {
    es: "Ingeniero y líder técnico con trayectoria multidisciplinaria que combina ingeniería de software, arquitectura cloud, inteligencia artificial y visión de producto. Especializado en transformar desafíos operativos y de negocio en plataformas escalables de alto rendimiento y automatización crítica.",
    en: "Technical leader and software engineer with a multidisciplinary track record bridging software engineering, cloud architecture, artificial intelligence, and product strategy. Focused on turning complex operational hurdles into high-throughput, automated scalable platforms.",
  },
  currentRole: {
    title: "Tech Lead",
    company: "Crediclub",
    location: "Monterrey, NL, México",
    availability: {
      es: "Liderando células de ingeniería & arquitectura",
      en: "Leading engineering cells & cloud architecture",
    },
  },
  location: "Monterrey, Nuevo León, México",
  email: "luisangelelizondo4554@gmail.com",
  socials: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/luis-%C3%A1ngel-elizondo-gallegos-306383239/",
      icon: "linkedin",
    },
  ],
  domains: [
    "Software Engineering",
    "Cloud Architecture",
    "AI & OCR Systems",
    "Data Platforms",
    "Product Leadership",
    "Process Automation",
  ],
};
