interface MetricItem {
  id: string;
  displayValue: string;
  title: { en: string; es: string };
  copy: { en: string; es: string };
}

// Aggregate outcomes only; implementation details stay outside public content.
export const impactMetrics: MetricItem[] = [
  {
    id: "coverage",
    displayValue: "100%",
    title: { en: "Renewals coverage", es: "Cobertura de renovaciones" },
    copy: {
      en: "Operational coverage achieved through internal platform development.",
      es: "Cobertura operativa alcanzada mediante el desarrollo de plataformas internas.",
    },
  },
  {
    id: "verification",
    displayValue: "~80%",
    title: {
      en: "Verification automation",
      es: "Automatización de validaciones",
    },
    copy: {
      en: "Signature volume automatically approved by the verification service.",
      es: "Volumen de firmas aprobado automáticamente por el servicio de validación.",
    },
  },
  {
    id: "workload",
    displayValue: "~70%",
    title: { en: "Fewer manual reviews", es: "Menos revisiones manuales" },
    copy: {
      en: "Reduction in manual document review workload.",
      es: "Reducción de la carga de revisión documental manual.",
    },
  },
  {
    id: "capacity",
    displayValue: "+25 FTE",
    title: {
      en: "Equivalent capacity unlocked",
      es: "Capacidad equivalente liberada",
    },
    copy: {
      en: "Aggregate operational capacity unlocked through automation.",
      es: "Capacidad operativa agregada liberada mediante automatización.",
    },
  },
];
