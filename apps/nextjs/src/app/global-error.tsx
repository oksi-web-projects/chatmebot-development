"use client";

import { useEffect } from "react";
import Bugsnag from "@bugsnag/js";

Bugsnag.start({
  apiKey: "940cd77fceeee746ed114504be7ac578",
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    Bugsnag.notify(error, (event) => {
      event.severity = "error";
      event.unhandled = true;
    });
  }, [error]);
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
