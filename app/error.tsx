"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-screen flex-col-center container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Something went wrong!</h1>
      <p className="mb-4">{error.message}</p>
      <Button
        onClick={() => reset()}
        className="text-white font-bold py-2 px-4 rounded"
      >
        Try again
      </Button>
    </div>
  );
}
