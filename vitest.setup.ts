import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock next/font/google for tests
const mockFont = (name: string) => (config: object) => ({
  ...config,
  variable: `__variable_${name}__c2e4d3`,
  className: `${name}__c2e4d3`,
});

vi.mock("next/font/google", () => ({
  Instrument_Sans: mockFont("instrument_sans"),
  Archivo: mockFont("archivo"),
}));


// The 3D viewer needs WebGL; tests only exercise the static poster.
vi.mock("@google/model-viewer", () => ({}));

if (typeof window !== "undefined") {
  if (!window.matchMedia) {
    window.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
  }

  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: ReadonlyArray<number> = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  // @ts-expect-error jsdom has no IntersectionObserver
  window.IntersectionObserver = MockIntersectionObserver;
}
