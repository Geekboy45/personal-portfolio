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
      es: "Sistemas backend, APIs y aplicaciones web diseñados para simplificar operaciones y facilitar su mantenimiento.",
      en: "Backend systems, APIs and web applications designed to simplify operations and remain maintainable.",
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
      es: "Servicios en Azure, cargas en Kubernetes y despliegues automatizados con gestión segura de secretos.",
      en: "Azure services, Kubernetes workloads and automated deployments with secure secrets management.",
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
      es: "Modelado y transformación de datos para conectar la operación con productos analíticos útiles.",
      en: "Data modeling and transformation that connect daily operations with useful analytics products.",
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
      es: "OCR, visión por computadora e integraciones con IA para automatizar la revisión de documentos y apoyar decisiones.",
      en: "OCR, computer vision and AI integrations that automate document review and support decisions.",
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
      es: "Segmentación de clientes y tableros ejecutivos para entender comportamientos y priorizar decisiones de negocio.",
      en: "Customer segmentation and executive dashboards to understand behavior and guide business decisions.",
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
      es: "Coordinación de equipos y decisiones de arquitectura que conectan las necesidades del negocio con la entrega de software.",
      en: "Team coordination and architecture decisions that connect business needs with software delivery.",
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
