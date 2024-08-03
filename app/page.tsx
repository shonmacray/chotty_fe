"use client";
import { login } from "@/app/apis";
import AppButton from "@/components/Button";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({ email_address: "", password: "" });
  const router = useRouter();

  const setUser = async () => {
    if (form.email_address && form.password) {
      const data = await login(form);

      localStorage.setItem("CT_access_token", data.access_token);
      document.cookie = data.access_token;
      router.push("home");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-100">
      <h1 className="text-2xl font-medium">Welcome to Chotty!</h1>
      <p className="text-xl my-4">Login</p>
      <div className="w-[280px] space-y-4">
        <div>
          <Input
            placeholder="Email Address"
            value={form.email_address}
            onChange={(e) =>
              setForm({ ...form, email_address: e.target.value })
            }
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <AppButton variant="secondary" text="Login" onClick={setUser} />
      </div>
    </main>
  );
}
