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
      en: "Centralized document management and validation, reducing manual document-review workload by ~70%.",
      es: "Gestión y validación documental centralizada, con ~70% menos carga de revisión manual.",
    },
  },
  {
    id: "aeris",
    company: "Crediclub",
    title: { en: "Aeris", es: "Aeris" },
    summary: {
      en: "Loan renewal platform that doubled operational productivity and reached 100% renewal coverage without increasing headcount.",
      es: "Plataforma de renovación de crédito que duplicó la productividad y alcanzó 100% de cobertura sin aumentar el equipo.",
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
      en: "Customer segmentation and executive analytics to support inventory-allocation decisions at GILSA.",
      es: "Segmentación de clientes y analítica ejecutiva para apoyar decisiones de distribución de inventario en GILSA.",
    },
  },
];
