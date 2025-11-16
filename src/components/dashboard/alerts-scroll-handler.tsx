"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function AlertsScrollHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if we have the #alerts hash in the URL
    const hash = window.location.hash;
    
    if (hash === "#alerts") {
      // Small delay to ensure page is fully rendered
      setTimeout(() => {
        const element = document.getElementById("alerts-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          // Highlight the section briefly
          element.classList.add("ring-2", "ring-rose-500", "ring-offset-2", "rounded-xl");
          setTimeout(() => {
            element.classList.remove("ring-2", "ring-rose-500", "ring-offset-2");
          }, 2000);
        }
      }, 300);
    }
  }, [searchParams]);

  return null;
}

