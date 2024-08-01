"use client";

import { FetchMessages } from "@/apis";
import { GroupStoreState, useGroupStore } from "@/store/groups";
import { useEffect, useState } from "react";

export default function Chat(): JSX.Element {
  const [messages, setMessages] = useState<any>([]);
  const groupStore = useGroupStore<GroupStoreState>((state) => state);
  const group =
    groupStore.groups.length > 0 && groupStore.current !== null
      ? groupStore.groups.find((group) => group.id === groupStore.current)
      : null;

  useEffect(() => {
    if (groupStore.current) {
      getMessages(groupStore.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupStore.current]);

  const getMessages = async (id: string) => {
    const data = await FetchMessages(id);
    setMessages([...data]);
  };

  return (
    <div>
      {group !== null ? (
        <div>
          <div>
            <h1>{group.name}</h1>
          </div>
          <div>{group.description}</div>
          <div>
            {messages.map((message: any) => (
              <div key={message.id}>
                <p>{message.text}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>Select Chat</div>
      )}
    </div>
  );
}
