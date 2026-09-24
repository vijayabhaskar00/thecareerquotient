import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProcessTimeline } from "./ProcessTimeline";

describe("ProcessTimeline", () => {
  it("renders each step's number, title, and description in order", () => {
    render(
      <ProcessTimeline
        steps={[
          { number: "01", title: "Tell Us What You Need", description: "Share your requirements." },
          { number: "02", title: "We Find & Screen", description: "Candidates are shortlisted." },
        ]}
      />
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("01");
    expect(items[0]).toHaveTextContent("Tell Us What You Need");
    expect(items[1]).toHaveTextContent("We Find & Screen");
  });
});
