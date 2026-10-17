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
      online: "PokéAPI · Public data",
      version: "v9.2",
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
      online: "PokéAPI · Datos públicos",
      version: "v9.2",
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
      filing: "Guardando…",
      observerName: "Distintivo / Nombre del Investigador *",
      fieldNotes: "Notas y Observaciones de Campo *",
      priority: "Prioridad de Observación",
      priorityStandard: "Monitoreo Estándar (Conducta habitual)",
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
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readLocale(): Locale {
  try {
    return localStorage.getItem("silph_locale") === "es" ? "es" : "en";
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
    localStorage.setItem("silph_locale", locale);
    window.dispatchEvent(new Event("locale-change"));
  } catch {
    /* Keep the current preference if browser persistence is unavailable. */
  }
}
export function LocaleProvider({ children }: { children: ReactNode }) {
  // External browser preference with a stable English SSR snapshot; no hydration effect.
  // Partial translations must not relabel the entire English document.
  const locale = useSyncExternalStore(
    subscribeLocale,
    readLocale,
    () => "en" as const,
  );

  const value: LocaleContextValue = {
    locale,
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
