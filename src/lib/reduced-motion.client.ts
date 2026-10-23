"use client";

import { useSyncExternalStore } from "react";

const preferenceKey = "portfolio-reduced-motion";
const preferenceEvent = "portfolio-motion-change";
let sessionPreference: boolean | null = null;

function subscribe(notify: () => void) {
  const query =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
  function onStorage(event: StorageEvent) {
    if (event.key === preferenceKey || event.key === null) {
      sessionPreference = null;
      notify();
    }
  }
  query?.addEventListener("change", notify);
  window.addEventListener(preferenceEvent, notify);
  window.addEventListener("storage", onStorage);
  return () => {
    query?.removeEventListener("change", notify);
    window.removeEventListener(preferenceEvent, notify);
    window.removeEventListener("storage", onStorage);
  };
}

function readSnapshot() {
  const system =
    typeof window.matchMedia !== "function" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let user = sessionPreference ?? false;
  if (sessionPreference === null) {
    try {
      user = localStorage.getItem(preferenceKey) === "reduce";
    } catch {
      /* Session preference still works without browser storage. */
    }
  }
  return (system ? 1 : 0) | (user ? 2 : 0);
}

export function setMotionPreference(reduced: boolean) {
  sessionPreference = reduced;
  try {
    localStorage.setItem(preferenceKey, reduced ? "reduce" : "system");
  } catch {
    /* The in-memory preference remains usable. */
  }
  window.dispatchEvent(new Event(preferenceEvent));
}

export function useMotionPreference() {
  const snapshot = useSyncExternalStore(subscribe, readSnapshot, () => 1);
  return {
    reducedMotion: snapshot !== 0,
    systemReducedMotion: (snapshot & 1) !== 0,
  };
}

export function useReducedMotion() {
  return useMotionPreference().reducedMotion;
}
