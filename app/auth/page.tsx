"use client";
import AppButton from "@/components/Button";
import Input from "@/components/Input";
import { UserStoreState, useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signup } from "../apis";
import { useMutation } from "@tanstack/react-query";
import { Loading02Icon } from "hugeicons-react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function Signup(): JSX.Element {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email_address: "",
    password: "",
  });
  const router = useRouter();
  const user = useUserStore<UserStoreState>((state) => state);

  const create = useMutation({
    mutationKey: ["create"],
    mutationFn: (data: any) => {
      return signup(data);
    },
  });

  const setUser = async () => {
    if (
      form.email_address &&
      form.password &&
      form.first_name &&
      form.last_name
    ) {
      const data = await create.mutateAsync(form);
      console.log(data);

      if (data.statusCode > 300) {
        Array.isArray(data?.message)
          ? data?.message?.forEach((message: string) => {
              toast.error(message);
            })
          : toast.error(data.message);
      } else {
        const timeout = 1000;
        toast.success("Account Created!", { autoClose: timeout });

        setTimeout(() => {
          user.setUser({ ...data.user, access_token: data.access_token });
          localStorage.setItem("CT_access_token", data.access_token);
          router.push("home");
        }, timeout);
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-100">
      <div className="w-[290px] space-y-4">
        <p className="text-3xl my-4 font-bold text-center">Create Account</p>
        <div className="h-2" />
        <div>
          <Input
            placeholder="First Name"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          />
        </div>
        <div>
          <Input
            placeholder="Last Name"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          />
        </div>
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

        <AppButton variant="secondary" text="Create Account" onClick={setUser}>
          {create.isPending && (
            <Loading02Icon size={18} className="animate-spin" />
          )}
        </AppButton>
        <div className="h-1" />
        <p>
          I have an account{" "}
          <Link href="/" className=" underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
