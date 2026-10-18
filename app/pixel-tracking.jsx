"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { storeAdSource, trackMetaEvent } from "@/lib/pixel";

export function PixelRouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    storeAdSource();
  }, []);

  useEffect(() => {
    if (!pathname) return;
    if (window.__taraqqiyotPixelPath === pathname) return;

    window.__taraqqiyotPixelPath = pathname;
    trackMetaEvent("PageView");
  }, [pathname]);

  return null;
}

export function ApplicationPageView() {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    const params = new URLSearchParams(window.location.search);
    trackMetaEvent("ViewContent", {
      content_name: params.get("application") || params.get("course") || "ariza_page",
      branch: params.get("branch") || params.get("filial") || "all",
    });
  }, []);

  return null;
}
