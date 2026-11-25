"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * The footer's scene (owner, 25 Nov 2026): Day is the default; a visitor can
 * pick Night (the whole footer goes dark: sky, stars, moon, lit windows) or
 * Snowfall with the small icons in the landscape strip. The choice stays in
 * this browser.
 */
export type Scene = "day" | "night" | "snow";
const KEY = "cs-landscape-scene";

const Ctx = createContext<{ scene: Scene; setScene: (s: Scene) => void }>({ scene: "day", setScene: () => {} });

export function FooterSceneProvider({ children }: { children: ReactNode }) {
  const [scene, set] = useState<Scene>("day");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "night" || saved === "snow") set(saved);
    } catch {
      /* storage blocked */
    }
  }, []);
  const setScene = (s: Scene) => {
    set(s);
    try {
      localStorage.setItem(KEY, s);
    } catch {
      /* storage blocked */
    }
  };
  return <Ctx.Provider value={{ scene, setScene }}>{children}</Ctx.Provider>;
}

export const useFooterScene = () => useContext(Ctx);
