"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "tcq_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(CONSENT_KEY) === null);
    } catch {
      setVisible(false);
    }
  }, []);

  function respond(value: "accepted" | "declined") {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // localStorage unavailable; hide the banner anyway rather than block the page
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-50 flex flex-col gap-3 border-t border-navy-100 bg-white p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between"
      style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <p className="text-sm text-navy-700">
        We use cookies to improve your experience on this site. Read our{" "}
        <a href="/cookie-policy" className="underline">
          Cookie Policy
        </a>{" "}
        to learn more.
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => respond("declined")}>
          Decline
        </Button>
        <Button onClick={() => respond("accepted")}>Accept</Button>
      </div>
    </div>
  );
}
