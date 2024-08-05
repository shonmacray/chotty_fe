export const FetchGroups = async (token: string | null): Promise<any> => {
  const req = await fetch("http://localhost:8000/chat", {
    method: "GET",
    headers: { authorization: `Bearer ${token}` },
  });

  return await req.json();
};

export const FetchMessages = async (groupId: string): Promise<any> => {
  const req = await fetch(`http://localhost:8000/chat/${groupId}`, {
    method: "GET",
  });
  return await req.json();
};

export const FetchMyGroups = async (token: string | null): Promise<any> => {
  const req = await fetch(`http://localhost:8000/user/groups`, {
    method: "GET",
    headers: { authorization: `Bearer ${token}` },
  });
  return await req.json();
};

interface loginData {
  email_address: string;
  password: string;
}

export const login = async (data: loginData): Promise<any> => {
  const req = await fetch(`http://localhost:8000/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await req.json();
};

export const sendJoinRquest = async (
  id: string,
  token: string
): Promise<any> => {
  const req = await fetch(`http://localhost:8000/chat/join/${id}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return await req.json();
};
