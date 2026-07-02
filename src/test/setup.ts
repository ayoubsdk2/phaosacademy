import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Global framer-motion mock — Proxy returns a passthrough component for every
// motion.<tag> access (motion.div, motion.button, motion.p, etc.) so individual
// tests no longer need brittle per-file mocks.
vi.mock("framer-motion", () => {
  const passthrough = (tag: string) =>
    ({ children, ...props }: any) => React.createElement(tag, props, children);
  const motion = new Proxy(
    {},
    {
      get: (_t, prop: string) => passthrough(prop),
    },
  );
  return {
    motion,
    AnimatePresence: ({ children }: any) => children,
    useReducedMotion: () => false,
    useMotionValue: (v: any) => ({ get: () => v, set: () => {}, on: () => () => {} }),
    useTransform: (_v: any, _i: any, o: any) => ({ get: () => (Array.isArray(o) ? o[0] : o), set: () => {} }),
    useAnimation: () => ({ start: () => Promise.resolve(), stop: () => {}, set: () => {} }),
  };
});
