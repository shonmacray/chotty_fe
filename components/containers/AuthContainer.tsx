"use client";
import { FetchUser } from "@/app/apis";
import { UserStoreState, useUserStore } from "@/store/user";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthContainer({ children }: Props): JSX.Element {
  const router = useRouter();
  const path = usePathname();
  const user = useUserStore<UserStoreState>((state) => state);
  const [token, setToken] = useState<string | null>(null);

  const { isLoading, data } = useQuery({
    queryKey: ["user", token],
    queryFn: () => FetchUser(token),
    enabled: token ? true : false,
  });

  useEffect(() => {
    const token = localStorage.getItem("CT_access_token");
    setToken(token);
  }, []);

  useEffect(() => {
    if (token) {
      if (!isLoading && data) {
        user.setUser({ id: data.id });
      }
      router.replace("home");
    } else {
      if (path !== "/auth") {
        router.replace("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isLoading, data]);

  return <div>{children}</div>;
}
