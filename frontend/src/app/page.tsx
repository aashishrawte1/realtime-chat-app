"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Default: go to /chat (you can also fetch the first topicId and redirect there)
    router.push("/chat");
  }, [router]);

  return null; // No UI - instant redirect
}
