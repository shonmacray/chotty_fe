"use client";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthContainer({ children }: Props): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("CT_access_token");

    console.log(token);

    if (token !== null) {
      router.replace("home");
    } else {
      router.replace("/");
    }
  }, [router]);

  return <div>{children}</div>;
}
