"use client";
import { login } from "@/app/apis";
import AppButton from "@/components/Button";
import Input from "@/components/Input";
import { UserStoreState, useUserStore } from "@/store/user";
import { useMutation } from "@tanstack/react-query";
import { Loading02Icon } from "hugeicons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitErrorHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface FormInput {
  email_address: string;
  password: string;
}

export default function Home() {
  const { handleSubmit, control } = useForm<any>({
    defaultValues: {
      email_address: "",
      password: "",
    },
    mode: "onChange",
  });
  const router = useRouter();
  const user = useUserStore<UserStoreState>((state) => state);

  const singin = useMutation({
    mutationKey: ["singin"],
    mutationFn: (data: any) => {
      return login(data);
    },
  });

  const onSubmit: SubmitErrorHandler<FormInput> = async (form) => {
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
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-100">
      <form className="w-[290px] space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <p className="text-3xl my-4 font-bold text-center">Login</p>
        <div className="h-2" />
        <div>
          <Input
            placeholder="Email address"
            name="email_address"
            control={control}
            rules={{ required: true }}
          />
        </div>
        <div>
          <Input
            placeholder="Password"
            name="password"
            type="password"
            control={control}
            rules={{ required: true }}
          />
        </div>
        <div className="h-3" />
        <AppButton
          type="submit"
          variant="secondary"
          text="Login"
          onClick={() => {}}
        >
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
      </form>
    </main>
  );
}
