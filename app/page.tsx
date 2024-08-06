"use client";
import { login } from "@/app/apis";
import AppButton from "@/components/Button";
import Input from "@/components/Input";
import { UserStoreState, useUserStore } from "@/store/user";
import { useMutation } from "@tanstack/react-query";
import { Loading02Icon } from "hugeicons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const [form, setForm] = useState({ email_address: "", password: "" });
  const router = useRouter();
  const user = useUserStore<UserStoreState>((state) => state);

  const singin = useMutation({
    mutationKey: ["singin"],
    mutationFn: (data: any) => {
      return login(data);
    },
  });

  const setUser = async () => {
    if (form.email_address && form.password) {
      const data = await singin.mutateAsync(form);

      if (data.statusCode > 300) {
        Array.isArray(data?.message)
          ? data?.message?.forEach((message: string) => {
              toast.error(message);
            })
          : toast.error(data.message);
      } else {
        user.setUser({ ...data.user, access_token: data.access_token });
        localStorage.setItem("CT_access_token", data.access_token);
        router.push("home");
      }
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
        <AppButton variant="secondary" text="Login" onClick={setUser}>
          {singin.isPending && (
            <Loading02Icon size={18} className="animate-spin" />
          )}
        </AppButton>
        <div className="h-1" />
        <p>
          Do not have account?{" "}
          <Link href="/auth" className=" underline">
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
