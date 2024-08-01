"use client";

import { FetchMessages } from "@/apis";
import { GroupStoreState, useGroupStore } from "@/store/groups";
import { useEffect, useState } from "react";
import AppButton from "../Button";
import { socket } from "@/apis/socket";

export default function Chat(): JSX.Element {
  const [messages, setMessages] = useState<any>([]);
  const [text, setText] = useState<string>();
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

  useEffect(() => {
    socket.on("member", (data) => {
      const newArr = [...messages];
      newArr.push(data);
      setMessages(newArr);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const getMessages = async (id: string) => {
    const data = await FetchMessages(id);
    setMessages([...data]);
  };

  const handleSendMessage = () => {
    const id = localStorage.getItem("user");
    socket.emit("message", {
      text,
      room: group.name,
      user_id: id,
      group_id: group.id,
    });
    setText("");
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
          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <AppButton text="Send" onClick={handleSendMessage} />
          </div>
        </div>
      ) : (
        <div>Select Chat</div>
      )}
    </div>
  );
}
