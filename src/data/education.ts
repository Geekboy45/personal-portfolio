export interface EducationItem {
  id: string;
  institution: string;
  degree: {
    es: string;
    en: string;
  };
  period: { en: string; es: string };
  grade?: string;
  location: string;
  concentrations?: {
    es: string[];
    en: string[];
  };
  highlights: {
    es: string[];
    en: string[];
  };
}

export const educationData: EducationItem[] = [
  {
    id: "itesm-bi",
    institution: "Tecnológico de Monterrey",
    degree: {
      es: "Licenciatura en Inteligencia de Negocios (Business Intelligence)",
      en: "B.S. in Business Intelligence",
    },
    period: { en: "Aug 2021 – Jun 2025", es: "Ago 2021 – Jun 2025" },
    grade: "99.43 / 100",
    location: "Monterrey, NL, México",
    concentrations: {
      es: [
        "Inteligencia Artificial con Impacto en los Negocios",
        "Herramientas de Analítica de Datos e Inteligencia Artificial",
      ],
      en: ["AI with Business Impact", "Data Analytics and AI Tools"],
    },
    highlights: {
      es: [
        "Promedio general sobresaliente: 99.43",
        "Beca al Talento Académico durante toda la carrera universitaria.",
        "Asesor académico de Matemáticas y Comunicación.",
        "Servicio Social y evaluación de calidad como Mystery Shopper TecServices.",
      ],
      en: [
        "Outstanding cumulative GPA: 99.43 / 100",
        "Academic Talent Scholarship recipient throughout the entire degree.",
        "Peer tutor in Mathematics and Analytical Communication.",
        "Community leadership and quality auditing as Mystery Shopper for TecServices.",
      ],
    },
  },
  {
    id: "ib-diploma",
    institution: "International Baccalaureate (IB)",
    degree: {
      es: "Diploma del Bachillerato Internacional — Business Management",
      en: "International Baccalaureate Diploma — Business Management",
    },
    period: { en: "2019 – 2021", es: "2019 – 2021" },
    grade: "7 / 7",
    location: "Ginebra, Suiza / Monterrey",
    highlights: {
      es: [
        "Calificación perfecta (7/7) en Business Management bajo estándares internacionales.",
        "Formación en pensamiento crítico, resolución de casos empresariales y método de investigación.",
      ],
      en: [
        "Perfect score (7/7) in Business Management under rigorous international standards.",
        "Advanced training in strategic case analysis, corporate finance, and structured research.",
      ],
    },
  },
  {
    id: "prepatec",
    institution: "Tecnológico de Monterrey / PrepaTec",
    degree: {
      es: "Bachillerato Bicultural",
      en: "Bicultural High School Diploma",
    },
    period: { en: "2018 – 2021", es: "2018 – 2021" },
    location: "Campus Eugenio Garza Sada, Monterrey",
    highlights: {
      es: [
        "Mejor promedio de toda la generación bicultural.",
        "Mención Honorífica de Excelencia académica.",
      ],
      en: [
        "Top GPA of the entire graduating bicultural class.",
        "Graduated with Highest Academic Honors (Mención Honorífica de Excelencia).",
      ],
    },
  },
];
