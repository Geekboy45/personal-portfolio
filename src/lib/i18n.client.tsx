"use client";
import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Locale = "en" | "es";

export const dictionaries = {
  en: {
    nav: {
      registry: "Specimen Registry",
      online: "Tech Lead @ Crediclub · Monterrey",
      version: "v2.5",
      impact: "Impact",
      projects: "Selected Work",
      experience: "Experience",
      skills: "Stack & Domains",
      education: "Education",
      contact: "Contact",
      downloadCv: "Download CV",
    },
    hero: {
      statusBadge: "Active Architecture & Leadership",
      greeting: "Hello, I am",
      viewWork: "Explore Case Studies",
      getInTouch: "Get in Touch",
      copyEmail: "Copy Email",
      emailCopied: "Email copied to clipboard!",
      cvDownloaded: "CV document opened in new tab.",
    },
    sections: {
      impactTag: "EXECUTIVE IMPACT // MEASURABLE CAPACITY",
      impactTitle: "High-Throughput Engineering & Business Impact",
      impactSubtitle:
        "Measurable operational throughput unlocked through internal platforms, automation pipelines, and machine learning architectures.",
      projectsTag: "SYSTEMS ARCHITECTURE // CASE STUDIES",
      projectsTitle: "Selected Case Studies & Engineering Platforms",
      projectsSubtitle:
        "Deep dives into production cloud architectures, computer vision automation, and operational data platforms.",
      experienceTag: "CAREER JOURNEY // CONTINUOUS PROGRESSION",
      experienceTitle: "Professional Evolution & Leadership",
      experienceSubtitle:
        "Multidisciplinary growth spanning business intelligence, analytics, artificial intelligence, product architecture, and engineering leadership.",
      skillsTag: "DOMAINS & CAPABILITIES // ZERO RATING BARS",
      skillsTitle: "Core Technical Domains & Cloud Ecosystem",
      skillsSubtitle:
        "Production tools, cloud infrastructure, and technical competencies categorized by engineering domains.",
      educationTag: "ACADEMIC EXCELLENCE // FOUNDATIONS",
      educationTitle: "Education & Honors",
      educationSubtitle:
        "Rigorous academic training in business intelligence, artificial intelligence, and strategic management.",
    },
    explore: {
      tag: "SILPH RESEARCH // SPECIMEN REGISTRY",
      subtag: "FIELD ARCHIVE",
      title: "Specimen Catalog & Field Analysis",
      description:
        "Index of biological records, elemental classifications, and telemetry data. Search by specimen name or catalog ID.",
      searchPlaceholder: "Search by specimen name or #number…",
      searchAria: "Search Pokémon across the collection",
      cataloged: "cataloged",
      page: "Page",
      of: "of",
      noResults: "No Pokémon found matching your search.",
      prev: "← Previous",
      next: "Next →",
      inspect: "Inspect",
      fieldNote: "Field Note",
      loading: "Opening telemetry and field records…",
    },
    pokedex: {
      telemetryTab: "Telemetry",
      loreTab: "Field Lore",
      logTab: "Observation Log",
      specimen: "SPECIMEN",
      height: "Height (ALT)",
      weight: "Weight (PESO)",
      ratio: "Ratio (BMI)",
      measurements: "Physical Measurements",
      elementalTypes: "Elemental Types",
      stats: "Base Stat Calibration",
      max: "MAX 255",
      habitat: "Habitat",
      captureRate: "Capture Rate",
      status: "Status",
      legendary: "Legendary",
      standard: "Standard",
      canonicalEntry: "Canonical Field Log",
      secondaryEntry: "Alternative Translation",
      ecologicalData: "Ecological Data",
      saveRecord: "Save Record",
      filing: "Filing Log…",
      observerName: "Observer Callsign / Researcher Name *",
      fieldNotes: "Field Notes & Observations *",
      priority: "Observation Priority",
      priorityStandard: "Standard Monitoring (Regular behavior)",
      priorityHigh: "Priority Research (Unusual sighting)",
      priorityCritical: "Critical Phenomenon (Evolutionary spike)",
      favorite: "Favorite",
      offline: "Offline",
      onlineTelemetry: "ONLINE TELEMETRY",
    },
  },
  es: {
    nav: {
      registry: "Registro de Especímenes",
      online: "Tech Lead @ Crediclub · Monterrey",
      version: "v2.5",
      impact: "Impacto",
      projects: "Proyectos",
      experience: "Trayectoria",
      skills: "Tecnologías",
      education: "Educación",
      contact: "Contacto",
      downloadCv: "Descargar CV",
    },
    hero: {
      statusBadge: "Arquitectura & Liderazgo Activo",
      greeting: "Hola, soy",
      viewWork: "Ver Case Studies",
      getInTouch: "Contactar",
      copyEmail: "Copiar Correo",
      emailCopied: "¡Correo copiado al portapapeles!",
      cvDownloaded: "Documento CV abierto en pestaña nueva.",
    },
    sections: {
      impactTag: "IMPACTO EJECUTIVO // CAPACIDAD MEDIBLE",
      impactTitle: "Ingeniería de Alto Rendimiento e Impacto de Negocio",
      impactSubtitle:
        "Capacidad operativa liberada y escalabilidad medida a través de plataformas internas, pipelines de automatización y arquitecturas de IA.",
      projectsTag: "ARQUITECTURA DE SISTEMAS // CASE STUDIES",
      projectsTitle: "Case Studies Seleccionados & Plataformas de Ingeniería",
      projectsSubtitle:
        "Análisis en profundidad de arquitecturas cloud en producción, visión por computadora y plataformas operativas basadas en datos.",
      experienceTag: "EVOLUCIÓN PROFESIONAL // CRECIMIENTO CONTINUO",
      experienceTitle: "Trayectoria Profesional & Liderazgo Técnico",
      experienceSubtitle:
        "Crecimiento multidisciplinario desde inteligencia de negocios y analítica hasta ingeniería de software y liderazgo de células.",
      skillsTag: "DOMINIOS & CAPACIDADES // SIN BARRAS DE RATING",
      skillsTitle: "Dominios Técnicos & Ecosistema Cloud",
      skillsSubtitle:
        "Herramientas de producción, infraestructura en la nube y competencias técnicas agrupadas por dominio.",
      educationTag: "EXCELENCIA ACADÉMICA // FUNDAMENTOS",
      educationTitle: "Educación & Distinciones",
      educationSubtitle:
        "Formación académica rigurosa en inteligencia de negocios, inteligencia artificial y gestión estratégica.",
    },
    explore: {
      tag: "INVESTIGACIÓN SILPH // REGISTRO DE ESPECÍMENES",
      subtag: "ARCHIVO DE CAMPO",
      title: "Catálogo de Especímenes y Análisis de Campo",
      description:
        "Índice de registros biológicos, clasificaciones elementales y telemetría de campo. Búsqueda por nombre o número de catálogo.",
      searchPlaceholder: "Buscar por nombre de espécimen o #número…",
      searchAria: "Buscar Pokémon en toda la colección",
      cataloged: "catalogados",
      page: "Página",
      of: "de",
      noResults: "No se encontraron Pokémon con ese criterio.",
      prev: "← Anterior",
      next: "Siguiente →",
      inspect: "Inspeccionar",
      fieldNote: "Nota de Campo",
      loading: "Iniciando telemetría y registros de campo…",
    },
    pokedex: {
      telemetryTab: "Telemetría",
      loreTab: "Historia de Campo",
      logTab: "Bitácora de Observación",
      specimen: "ESPÉCIMEN",
      height: "Altura (ALT)",
      weight: "Peso (PESO)",
      ratio: "Ratio (BMI)",
      measurements: "Medidas Físicas",
      elementalTypes: "Tipos Elementales",
      stats: "Calibración de Estadísticas Base",
      max: "MÁX 255",
      habitat: "Hábitat",
      captureRate: "Tasa de Captura",
      status: "Estado",
      legendary: "Legendario",
      standard: "Estándar",
      canonicalEntry: "Registro Canónico de Campo",
      secondaryEntry: "Traducción Alternativa",
      ecologicalData: "Datos Ecológicos",
      saveRecord: "Guardar Registro",
      filing: "Archivando Bitácora…",
      observerName: "Indicativo / Nombre del Investigador *",
      fieldNotes: "Notas y Observaciones de Campo *",
      priority: "Prioridad de Observación",
      priorityStandard: "Monitoreo Estándar (Comportamiento habitual)",
      priorityHigh: "Investigación Prioritaria (Avistamiento inusual)",
      priorityCritical: "Fenómeno Crítico (Pico evolutivo)",
      favorite: "Favorito",
      offline: "Desconectado",
      onlineTelemetry: "TELEMETRÍA EN LÍNEA",
    },
  },
} as const;

export type Dictionary = {
  [K in keyof typeof dictionaries.en]: {
    [P in keyof (typeof dictionaries.en)[K]]: string;
  };
};

interface LocaleContextValue {
  locale: Locale;
  routeLocale?: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readLocale(): Locale {
  try {
    const stored =
      localStorage.getItem("portfolio_locale") ||
      localStorage.getItem("silph_locale");
    return stored === "es" ? "es" : "en";
  } catch {
    return "en";
  }
}
function subscribeLocale(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener("locale-change", notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener("locale-change", notify);
  };
}
function setLocale(locale: Locale) {
  try {
    localStorage.setItem("portfolio_locale", locale);
    localStorage.setItem("silph_locale", locale);
    window.dispatchEvent(new Event("locale-change"));
  } catch {
    /* Keep the current preference if browser persistence is unavailable. */
  }
}
export function LocaleProvider({
  children,
  routeLocale,
}: {
  children: ReactNode;
  routeLocale?: Locale;
}) {
  const preference = useSyncExternalStore(
    subscribeLocale,
    readLocale,
    () => "en" as const,
  );

  const locale = routeLocale ?? preference;
  const value: LocaleContextValue = {
    locale,
    routeLocale,
    setLocale,
    t: dictionaries[locale],
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    return {
      locale: "en",
      setLocale: () => {},
      t: dictionaries.en,
    };
  }
  return context;
}
