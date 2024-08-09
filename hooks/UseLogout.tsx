export const useLogout = () => {
  const logout = () => {
    localStorage.removeItem("CT_access_token");
    window.location.reload();
  };

  return logout;
};
