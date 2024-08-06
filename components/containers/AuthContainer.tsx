"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthContainer({ children }: Props): JSX.Element {
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    const token = localStorage.getItem("CT_access_token");

    if (token) {
      router.replace("home");
    } else {
      if (path !== "/auth") {
        router.replace("/");
      }
    }
  }, [router, path]);

  return <div>{children}</div>;
}
