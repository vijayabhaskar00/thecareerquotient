import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

describe("NotFound", () => {
  it("renders a 404 heading and a link back home", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/couldn't find that page/i);
    expect(screen.getByRole("link", { name: "Go Home" })).toHaveAttribute("href", "/");
  });
});
