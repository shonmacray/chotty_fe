"use client";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthContainer({ children }: Props): JSX.Element {
  const router = useRouter();
  useEffect(() => {
    const token = document.cookie;

    if (token) {
      router.replace("home");
    } else {
      router.replace("/");
    }
  }, [router]);

  return <div>{children}</div>;
}
