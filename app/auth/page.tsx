"use client";
import AppButton from "@/components/Button";
import Input from "@/components/Input";
import { UserStoreState, useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";
import { signup } from "../apis";
import { useMutation } from "@tanstack/react-query";
import { Loading02Icon } from "hugeicons-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface FormInput {
  first_name: string;
  last_name: string;
  email_address: string;
  password: string;
}

export default function Signup(): JSX.Element {
  const FormInputSchema = z.object({
    first_name: z.string().min(3, { message: "First name is to short" }),
    last_name: z.string().min(3, { message: "Last name is to short" }),
    email_address: z.string().email().trim(),
    password: z.string().min(8, { message: "Password is to short" }),
  });

  const { handleSubmit, control } = useForm<FormInput>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email_address: "",
      password: "",
    },
    mode: "onBlur",
    resolver: zodResolver(FormInputSchema),
  });

  const router = useRouter();
  const user = useUserStore<UserStoreState>((state) => state);

  const create = useMutation({
    mutationKey: ["create"],
    mutationFn: (data: any) => {
      return signup(data);
    },
  });

  const onSubmit: SubmitHandler<FormInput> = async (form) => {
    const data = await create.mutateAsync(form);

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
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-100">
      <form onSubmit={handleSubmit(onSubmit)} className="w-[290px] space-y-4">
        <p className="text-3xl my-4 font-bold text-center">Create Account</p>
        <div className="h-2" />
        <div>
          <Input control={control} name="first_name" placeholder="First name" />
        </div>
        <div>
          <Input control={control} name="last_name" placeholder="Last name" />
        </div>
        <div>
          <Input
            control={control}
            name="email_address"
            placeholder="Email address"
          />
        </div>
        <div>
          <Input
            control={control}
            name="password"
            placeholder="Password"
            type="password"
          />
        </div>
        <div className="h-3" />

        <AppButton
          type="submit"
          variant="secondary"
          text="Create Account"
          onClick={() => {}}
        >
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
      </form>
    </main>
  );
}
