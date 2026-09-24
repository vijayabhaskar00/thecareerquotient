import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock next/font/google for tests
vi.mock("next/font/google", () => ({
  Plus_Jakarta_Sans: (config: object) => ({
    ...config,
    variable: "__variable_plus_jakarta_sans__c2e4d3",
    className: "plus_jakarta_sans__c2e4d3",
  }),
}));

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
