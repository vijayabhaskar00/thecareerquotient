import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Testimonial } from "./Testimonial";

describe("Testimonial", () => {
  it("renders nothing when no verified testimonial is supplied", () => {
    const { container } = render(<Testimonial testimonial={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the quote, author, and role when a testimonial is supplied", () => {
    render(<Testimonial testimonial={{ quote: "They found us the right person fast.", author: "J. Rivera", role: "VP Engineering" }} />);
    expect(screen.getByText(/They found us the right person fast\./)).toBeInTheDocument();
    expect(screen.getByText(/J\. Rivera, VP Engineering/)).toBeInTheDocument();
  });
});
