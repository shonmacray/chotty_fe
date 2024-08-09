const url = process.env.NEXT_PUBLIC_API_URL;

export const FetchGroups = async (token: string | null): Promise<any> => {
  const req = await fetch(`${url}/chat`, {
    method: "GET",
    headers: { authorization: `Bearer ${token}` },
  });

  return await req.json();
};

export const FetchUser = async (token: string | null): Promise<any> => {
  const req = await fetch(`${url}/user`, {
    method: "GET",
    headers: { authorization: `Bearer ${token}` },
  });

  return await req.json();
};

export const FetchMessages = async (groupId: number): Promise<any> => {
  const req = await fetch(`${url}/chat/${groupId}`, {
    method: "GET",
  });
  return await req.json();
};

export const FetchMyGroups = async (token: string | null): Promise<any> => {
  const req = await fetch(`${url}/user/groups`, {
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
  const req = await fetch(`${url}/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await req.json();
};

interface SignupData {
  first_name: string;
  last_name: string;
  email_address: string;
  password: string;
}

export const signup = async (data: SignupData): Promise<any> => {
  const req = await fetch(`${url}/auth/signup`, {
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
  id: number,
  token: string
): Promise<any> => {
  const req = await fetch(`${url}/chat/join/${id}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return await req.json();
};
