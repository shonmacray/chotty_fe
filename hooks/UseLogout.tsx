import { useRouter } from "next/navigation";

export const useLogout = (): any => {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("CT_access_token");
    router.replace("/");
  };

  return logout;
};
