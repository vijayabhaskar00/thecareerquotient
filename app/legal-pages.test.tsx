import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PrivacyPage from "./privacy/page";
import TermsPage from "./terms/page";
import CookiePolicyPage from "./cookie-policy/page";
import AccessibilityPage from "./accessibility/page";
import CandidatePrivacyPage from "./candidate-privacy/page";
import EmployerTermsPage from "./employer-terms/page";

const pages: [string, () => React.JSX.Element][] = [
  ["Privacy Policy", PrivacyPage],
  ["Terms of Service", TermsPage],
  ["Cookie Policy", CookiePolicyPage],
  ["Accessibility Statement", AccessibilityPage],
  ["Candidate Privacy Notice", CandidatePrivacyPage],
  ["Employer Terms", EmployerTermsPage],
];

describe("legal pages", () => {
  it.each(pages)("%s renders its title and the counsel-review notice", (title, Page) => {
    render(<Page />);
    expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
    expect(screen.getByRole("note")).toBeInTheDocument();
  });
});
