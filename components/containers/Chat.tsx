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

  let group = null;

  if (groupStore.groups.length > 0 && groupStore.current !== null) {
    const mygroup = groupStore.groups.find(
      (group) => group.id === groupStore.current
    );
    if (mygroup) {
      group = mygroup;
    } else {
      const suggestion = groupStore.suggestions.find(
        (group) => group.id === groupStore.current
      );
      group = suggestion;
    }
  }

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
    <div className="h-screen pb-10">
      {group !== null ? (
        <div className="h-full flex flex-col justify-between">
          <div className="flex-1 space-y-4">
            <div className="h-14 px-4 bg-white flex items-center">
              <h1 className="font-semibold">{group.name}</h1>
            </div>
            <div className="px-4">{group.description}</div>
            <div className="px-4">
              {messages.map((message: any) => (
                <div key={message.id}>
                  <p>{message.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 px-4">
            <textarea
              className="flex-1 p-3 rounded-md"
              value={text}
              placeholder="Type message"
              onChange={(e) => setText(e.target.value)}
            />
            <AppButton text="Send" onClick={handleSendMessage} />
          </div>
        </div>
      ) : (
        <div>Select Chat</div>
      )}
    </div>
  );
}
