"use client";

import { useEffect } from "react";

export default function LeadEvent({ branch }) {
  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Lead", branch ? { branch } : {});
    }
  }, [branch]);

  return null;
}
