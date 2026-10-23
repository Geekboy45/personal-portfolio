interface EducationPhoto {
  id: string;
  src: string | null;
  orientation?: "portrait";
  alt: { en: string; es: string };
  caption: { en: string; es: string };
}

// Replace null with a reviewed /images/... path and accurate alt text.
export const educationPhotos: EducationPhoto[] = [
  {
    id: "academic-excellence",
    src: "/images/profile/luis-academic-excellence.jpeg",
    alt: {
      en: "Portrait in front of the Business School Academic Excellence backdrop at Tec de Monterrey",
      es: "Retrato frente al fondo de Excelencia Académica de la Escuela de Negocios del Tec de Monterrey",
    },
    caption: {
      en: "Top 1% of Business School Award - Tec de Monterrey",
      es: "Reconocimiento al Top 1% de la Escuela de Negocios - Tec de Monterrey",
    },
  },
  {
    id: "graduation",
    src: "/images/profile/luis-graduation.jpeg",
    orientation: "portrait",
    alt: {
      en: "Graduation portrait wearing a blue stole at Tec de Monterrey",
      es: "Retrato de graduación con estola azul en el Tec de Monterrey",
    },
    caption: {
      en: "Graduation - Tec de Monterrey",
      es: "Graduación - Tec de Monterrey",
    },
  },
  {
    id: "exatec-selit",
    src: "/images/profile/luis-conferencia-selit.jpeg",
    alt: {
      en: "Speaking beside a lectern at the EXATEC SELIT conference at Tec de Monterrey",
      es: "Participación junto al atril en la conferencia EXATEC SELIT del Tec de Monterrey",
    },
    caption: {
      en: "EXATEC SELIT Conference - Tec de Monterrey",
      es: "Conferencia EXATEC SELIT - Tec de Monterrey",
    },
  },
];
