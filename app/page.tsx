"use client";
import AppButton from "@/components/Button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const setUser = () => {
    localStorage.setItem("user", "1");
    router.push("home");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1>Welcome to Chotty!</h1>
      <AppButton text="Continue as shon" onClick={setUser} />
    </main>
  );
}
