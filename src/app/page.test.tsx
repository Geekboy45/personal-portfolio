import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PortfolioPage as HomePage } from "@/features/portfolio/portfolio-page";
import { ToastProvider } from "@/components/ui/toast.client";

it("renders Luis Elizondo professional portfolio with headline, metrics and projects", () => {
  render(
    <ToastProvider>
      <HomePage />
    </ToastProvider>,
  );

  // Check Main H1 Heading
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    /Luis Ángel Elizondo Gallegos/i,
  );

  // Check Profile Image
  const profileImage = screen.getByRole("img", {
    name: /Luis Ángel Elizondo Gallegos/i,
  });
  expect(profileImage).toBeInTheDocument();

  // Check CTA navigation link to projects
  const exploreProjectsLink = screen.getByRole("link", {
    name: /Explore selected work/i,
  });
  expect(exploreProjectsLink).toHaveAttribute("href", "#projects");

  // Check Key Impact Metrics are in document
  expect(
    screen.getByRole("heading", { name: /Renewals Coverage/i }),
  ).toBeInTheDocument();
  expect(
    screen.getAllByText(/Verification automation/i)[0],
  ).toBeInTheDocument();
});

it.each([
  ["en", "First, understand the question.", "Photo to be added"],
  ["es", "Primero, entender la pregunta.", "Fotografía pendiente"],
] as const)(
  "renders the complete %s narrative with three gallery slots and public project summaries",
  (locale, chapter, placeholder) => {
    const { container } = render(
      <ToastProvider>
        <HomePage locale={locale} />
      </ToastProvider>,
    );
    expect(screen.getByRole("heading", { name: chapter })).toBeInTheDocument();
    expect(screen.queryByText(placeholder)).not.toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: locale === "es" ? /Retrato de graduación/ : /Graduation portrait/,
      }),
    ).toHaveAttribute("src", expect.stringContaining("luis-graduation.jpeg"));
    expect(
      screen.getByRole("img", {
        name:
          locale === "es"
            ? /fondo de Excelencia Académica/
            : /Academic Excellence backdrop/,
      }),
    ).toHaveAttribute(
      "src",
      expect.stringContaining("luis-academic-excellence.jpeg"),
    );
    expect(screen.getByRole("img", { name: /EXATEC SELIT/ })).toHaveAttribute(
      "src",
      expect.stringContaining("luis-conferencia-selit.jpeg"),
    );
    expect(container.querySelectorAll("#projects article")).toHaveLength(3);
    expect(container.querySelector("#projects button")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name:
          locale === "es"
            ? "Gestor | Validador Documental"
            : "Document Manager | Validator",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "GILSA" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Aeris" })).toBeInTheDocument();
    const projects = container.querySelector("#projects");
    expect(projects).toHaveTextContent("Crediclub");
    expect(projects).toHaveTextContent("Datómicos");
    expect(projects).not.toHaveTextContent("Crédito Central");
    expect(projects).toHaveTextContent(
      locale === "es" ? "renovación de crédito" : "Loan renewal",
    );
    expect(container).not.toHaveTextContent(/Inspect Architecture/i);
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/luis-%C3%A1ngel-elizondo-gallegos-306383239/",
    );
    expect(
      screen.getByRole("link", {
        name: locale === "es" ? "Escríbeme" : "Email me",
      }),
    ).toHaveAttribute("href", "mailto:luisangelelizondo4554@gmail.com");
    expect(container.querySelector('a[href*="github.com"]')).toBeNull();
    expect(container.querySelector('a[href*="subject="]')).toBeNull();
  },
);
