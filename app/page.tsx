"use client";
import { login } from "@/app/apis";
import AppButton from "@/components/Button";
import Input from "@/components/Input";
import { UserStoreState, useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({ email_address: "", password: "" });
  const router = useRouter();
  const user = useUserStore<UserStoreState>((state) => state);

  const setUser = async () => {
    if (form.email_address && form.password) {
      const data = await login(form);

      user.setUser({ ...data.user, access_token: data.access_token });
      localStorage.setItem("CT_access_token", data.access_token);
      router.push("home");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-100">
      <div className="w-[290px] space-y-4">
        <p className="text-3xl my-4 font-bold text-center">Login</p>
        <div className="h-2" />
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
        <div className="h-3" />

        <AppButton variant="secondary" text="Login" onClick={setUser} />
      </div>
    </main>
  );
}
