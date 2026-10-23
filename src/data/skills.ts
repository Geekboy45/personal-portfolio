export interface SkillDomain {
  id: string;
  name: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
  skills: { en: string[]; es: string[] };
}

export const skillDomains: SkillDomain[] = [
  {
    id: "engineering",
    name: {
      es: "Ingeniería de Software & Arquitectura",
      en: "Software Engineering & Architecture",
    },
    description: {
      es: "Construcción de sistemas backend modulares, APIs de baja latencia y aplicaciones web con foco en confiabilidad y tipado estricto.",
      en: "Designing modular backend systems, low-latency APIs, and web applications centered on strict typing and resilience.",
    },
    skills: {
      en: [
        "TypeScript",
        "JavaScript",
        "React",
        "Next.js",
        ".NET",
        "ASP.NET Core",
        "REST APIs",
        "Git",
        "Software Architecture",
        "CI/CD",
      ],
      es: [
        "TypeScript",
        "JavaScript",
        "React",
        "Next.js",
        ".NET",
        "ASP.NET Core",
        "REST APIs",
        "Git",
        "Arquitectura de software",
        "CI/CD",
      ],
    },
  },
  {
    id: "cloud-devops",
    name: {
      es: "Cloud & DevOps",
      en: "Cloud & DevOps",
    },
    description: {
      es: "Infraestructura contenerizada, automatización de despliegues continuos y gobernanza de secretos en nube pública.",
      en: "Containerized workloads, automated deployment pipelines, and secret isolation on public cloud infrastructure.",
    },
    skills: {
      en: [
        "Microsoft Azure",
        "Azure Kubernetes Service (AKS)",
        "Kubernetes",
        "Azure DevOps",
        "Azure App Service",
        "Azure Functions",
        "Azure Key Vault",
        "Managed Identity",
        "Docker",
      ],
      es: [
        "Microsoft Azure",
        "Azure Kubernetes Service (AKS)",
        "Kubernetes",
        "Azure DevOps",
        "Azure App Service",
        "Azure Functions",
        "Azure Key Vault",
        "Managed Identity",
        "Docker",
      ],
    },
  },
  {
    id: "data-engineering",
    name: {
      es: "Plataformas de Datos & SQL",
      en: "Data Platforms & SQL",
    },
    description: {
      es: "Modelado relacional robusto, orquestación de flujos ETL y procesamiento analítico de altos volúmenes transaccionales.",
      en: "Relational modeling, robust ETL workflows, and analytical batch processing across complex transaction stores.",
    },
    skills: {
      en: [
        "Python",
        "SQL",
        "PostgreSQL",
        "SQL Server",
        "MySQL",
        "Azure Databricks",
        "Data Modeling",
        "ETL",
        "Data Processing",
      ],
      es: [
        "Python",
        "SQL",
        "PostgreSQL",
        "SQL Server",
        "MySQL",
        "Azure Databricks",
        "Modelado de datos",
        "ETL",
        "Procesamiento de datos",
      ],
    },
  },
  {
    id: "ai-ml",
    name: {
      es: "Inteligencia artificial y visión por computadora",
      en: "AI & Computer Vision",
    },
    description: {
      es: "Integración de pipelines de visión por computadora, extracción documental OCR y modelos predictivos orientados a impacto de negocio.",
      en: "Production computer vision, OCR extraction pipelines, and machine learning models tied directly to business KPIs.",
    },
    skills: {
      en: [
        "Machine Learning",
        "OCR",
        "Computer Vision",
        "AI for Business",
        "OpenAI / LLM Integrations",
        "Predictive Modeling",
        "Customer Segmentation",
      ],
      es: [
        "Aprendizaje automático",
        "OCR",
        "Visión por computadora",
        "IA para negocios",
        "Integraciones con OpenAI / LLM",
        "Modelado predictivo",
        "Segmentación de clientes",
      ],
    },
  },
  {
    id: "analytics-bi",
    name: {
      es: "Inteligencia de negocios y analítica ejecutiva",
      en: "Business Intelligence & Executive Analytics",
    },
    description: {
      es: "Traducción de telemetría de negocio en tableros ejecutivos accionables y modelos de decisión para comités directivos.",
      en: "Transforming raw business telemetry into actionable executive dashboards and decision models for leadership teams.",
    },
    skills: {
      en: [
        "Power BI",
        "Tableau",
        "Advanced Excel",
        "Business Intelligence",
        "Data Visualization",
        "Executive Analytics",
      ],
      es: [
        "Power BI",
        "Tableau",
        "Excel avanzado",
        "Inteligencia de negocios",
        "Visualización de datos",
        "Analítica ejecutiva",
      ],
    },
  },
  {
    id: "product-leadership",
    name: {
      es: "Liderazgo Técnico & Producto",
      en: "Technical Leadership & Product",
    },
    description: {
      es: "Coordinación de células técnicas, puente entre requerimientos de negocio y diseño de solución con mentalidad de ownership.",
      en: "Leading engineering squads, bridging business objectives with pragmatic software design, and end-to-end technical ownership.",
    },
    skills: {
      en: [
        "Technical Leadership",
        "Product Development",
        "Solution Design",
        "Requirements Analysis",
        "Stakeholder Communication",
        "Team Coordination",
        "Process Automation",
        "Business Impact Analysis",
      ],
      es: [
        "Liderazgo técnico",
        "Desarrollo de producto",
        "Diseño de soluciones",
        "Análisis de requerimientos",
        "Comunicación con partes interesadas",
        "Coordinación de equipos",
        "Automatización de procesos",
        "Análisis de impacto en el negocio",
      ],
    },
  },
];

export const corePhilosophy = {
  es: "Mi valor diferencial radica en la convergencia: no concibo la ingeniería sin entender el impacto de negocio, ni propongo modelos de datos o IA aislados de una arquitectura cloud robusta y mantenible.",
  en: "My core differentiator is convergence: I view engineering through business impact, and build data or AI capabilities grounded in robust, production-grade cloud architectures.",
};
