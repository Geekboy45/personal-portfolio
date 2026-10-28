export interface AwardItem {
  id: string;
  title: {
    es: string;
    en: string;
  };
  institution: string;
  date: { en: string; es: string };
  badge: string;
  context: {
    es: string;
    en: string;
  };
}

export const awardsData: AwardItem[] = [
  {
    id: "graduation-excellence-itesm",
    title: {
      es: "Mención Honorífica de Excelencia en la Graduación",
      en: "Graduation Honors for Academic Excellence",
    },
    institution: "Tecnológico de Monterrey",
    date: { en: "June 2025", es: "Junio 2025" },
    badge: "99.43 / 100",
    context: {
      es: "Reconocimiento por obtener uno de los promedios más altos de la Licenciatura en Inteligencia de Negocios.",
      en: "Recognized for achieving one of the highest GPAs in the B.S. in Business Intelligence program.",
    },
  },
  {
    id: "excelencia-academica-itesm",
    title: {
      es: "Reconocimiento a la Excelencia Académica",
      en: "Academic Excellence Distinction",
    },
    institution: "Tecnológico de Monterrey",
    date: {
      en: "December 2022 · June 2025",
      es: "Diciembre 2022 · Junio 2025",
    },
    badge: "Top 1%",
    context: {
      es: "Recibido en dos ocasiones por formar parte del Top 1% de estudiantes de la Escuela de Negocios del Campus Monterrey.",
      en: "Received twice for ranking among the Top 1% of students in the Monterrey Campus Business School.",
    },
  },
  {
    id: "mencion-honorifica-prepatec",
    title: {
      es: "Mención Honorífica de Excelencia",
      en: "Valedictorian Highest Honors Distinction",
    },
    institution: "PrepaTec Campus Eugenio Garza Sada",
    date: { en: "July 2021", es: "Julio 2021" },
    badge: "Top 1 Valedictorian",
    context: {
      es: "Máximo reconocimiento institucional por obtener el mejor promedio general de toda la generación de Bachillerato Bicultural.",
      en: "Highest institutional honor awarded for achieving the top cumulative GPA across the entire graduating Bicultural class.",
    },
  },
];
