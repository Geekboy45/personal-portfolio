interface ProjectOverview {
  id: string;
  company: string;
  title: { en: string; es: string };
  summary: { en: string; es: string };
}

// Brief public summaries: approved project names and outcomes, no implementation details.
export const projectsData: ProjectOverview[] = [
  {
    id: "document-validation",
    company: "Crediclub",
    title: {
      en: "Document Manager | Validator",
      es: "Gestor | Validador Documental",
    },
    summary: {
      en: "Document management and validation: ~80% automation and ~70% less manual review work.",
      es: "Gestión y validación documental: ~80% de automatización y ~70% menos carga de revisión manual.",
    },
  },
  {
    id: "gilsa",
    company: "Datómicos",
    title: {
      en: "GILSA",
      es: "GILSA",
    },
    summary: {
      en: "Data and analytics for GILSA, turning information into useful insights for business decisions.",
      es: "Datos y analítica para GILSA, transformando información en hallazgos útiles para decisiones de negocio.",
    },
  },
  {
    id: "aeris",
    company: "Crediclub",
    title: { en: "Aeris", es: "Aeris" },
    summary: {
      en: "Loan renewal platform achieving 100% renewals coverage and simpler operations for the team.",
      es: "Plataforma de renovación de crédito con 100% de cobertura y una operación más simple para el equipo.",
    },
  },
];
