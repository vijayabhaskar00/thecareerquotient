import type { DetailedHTMLProps, HTMLAttributes, Ref } from "react";

type ModelViewerAttributes = {
  ref?: Ref<HTMLElement>;
  src?: string;
  poster?: string;
  alt?: string;
  autoplay?: boolean;
  "animation-name"?: string;
  "camera-orbit"?: string;
  "camera-target"?: string;
  "field-of-view"?: string;
  "shadow-intensity"?: string;
  exposure?: string;
  "interaction-prompt"?: "auto" | "none";
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & ModelViewerAttributes;
    }
  }
}
