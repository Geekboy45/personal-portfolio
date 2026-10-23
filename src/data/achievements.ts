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
    id: "excelencia-academica-itesm",
    title: {
      es: "Reconocimiento a la Excelencia Académica",
      en: "Academic Excellence Distinction",
    },
    institution: "Tecnológico de Monterrey",
    date: { en: "December 2022", es: "Diciembre 2022" },
    badge: "Top 1%",
    context: {
      es: "Otorgado al Top 1% de estudiantes con trayectoria académica sobresaliente dentro de la Escuela de Negocios del Campus Monterrey.",
      en: "Awarded exclusively to the Top 1% of students demonstrating outstanding academic performance across the Monterrey Campus Business School.",
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
