export const FetchGroups = async (): Promise<any> => {
  const req = await fetch("http://localhost:8000/chat", { method: "GET" });
  return await req.json();
};

export const FetchMessages = async (groupId: string): Promise<any> => {
  const req = await fetch(`http://localhost:8000/chat/${groupId}`, {
    method: "GET",
  });
  return await req.json();
};

export const FetchMyGroups = async (): Promise<any> => {
  const req = await fetch(`http://localhost:8000/user/groups`, {
    method: "GET",
  });
  return await req.json();
};
