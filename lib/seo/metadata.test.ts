import { describe, it, expect } from "vitest";
import { buildMetadata, SITE_URL } from "./metadata";

describe("buildMetadata", () => {
  it("builds a title suffixed with the site name and a canonical URL", () => {
    const metadata = buildMetadata({ title: "Direct Hire", description: "Find permanent talent.", path: "/services/direct-hire" });
    expect(metadata.title).toBe("Direct Hire | TheCareerQuotient");
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/services/direct-hire`);
    expect(metadata.openGraph?.title).toBe("Direct Hire");
    expect(metadata.twitter?.card).toBe("summary_large_image");
  });
});
