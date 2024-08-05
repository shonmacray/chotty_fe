"use client";

import { FetchMessages, sendJoinRquest } from "@/app/apis";
import { GroupStoreState, useGroupStore } from "@/store/groups";
import { useEffect, useState } from "react";
import AppButton from "../Button";
import { CheckmarkBadge02Icon, SentIcon, Tornado01Icon } from "hugeicons-react";
import { useSocket } from "@/hooks/UseSocket";
import {
  useMutation,
  useQuery,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import { useLogout } from "@/hooks/UseLogout";
import { joinRooms } from "@/helper";

export default function Chat(): JSX.Element {
  const [messages, setMessages] = useState<any>([]);
  const [text, setText] = useState<string>();
  const groupStore = useGroupStore<GroupStoreState>((state) => state);

  const socket = useSocket();
  const logout = useLogout();
  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery({
    queryKey: ["messages", groupStore.current],
    queryFn: () => FetchMessages(groupStore.current!),
    enabled: groupStore.current ? true : false,
  });

  const join = useMutation({
    mutationKey: ["sendJoinRequest"],
    mutationFn: (id: string) => {
      const token = localStorage.getItem("CT_access_token");
      return sendJoinRquest(id, token!);
    },
  });

  let group = null;
  let suggested = null;

  const mygroup = groupStore.groups.find(
    (group) => group.id === groupStore.current
  );
  if (mygroup === undefined) {
    const suggestion = groupStore.suggestions.find(
      (group) => group.id === groupStore.current
    );

    if (suggestion !== undefined) {
      suggested = suggestion;
    }
  } else {
    group = mygroup;
  }

  useEffect(() => {
    if (!isLoading) {
      if (data && data?.error) {
        logout();
      }
    }
  }, [isLoading, data, logout]);

  useEffect(() => {
    socket?.on("member", (data: any) => {
      queryClient.cancelQueries({ queryKey: ["messages", data.group_id] });

      queryClient.setQueryData(["messages", data.group_id], (old: any) => [
        ...old,
        data,
      ]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleSendMessage = () => {
    if (text) {
      socket?.emit("message", {
        text,
        room: group.name,
        group_id: group.id,
        last_id: data.length,
      });
      setText("");
    }
  };

  const joinGroup = async () => {
    if (groupStore.current) {
      const data = await join.mutateAsync(groupStore.current);
      if (data.created) {
        const groups = [...groupStore.groups];
        groups.push(suggested);
        joinRooms(groups, socket);
        groupStore.setGroups(groups);
      }
    }
  };

  return (
    <div className="pb-10 h-full">
      {group !== null || suggested !== null ? (
        <div className="h-full flex flex-col justify-between">
          <div className="flex-1 flex flex-col">
            <div className="h-14 px-5 bg-white flex flex-col justify-center">
              <div className="font-semibold flex gap-2 items-center">
                <h1 className="text-lg">{group?.name || suggested.name}</h1>
                <CheckmarkBadge02Icon size={20} />
              </div>
            </div>
            <div className="flex-1 overflow-scroll py-4">
              <div className="px-5">
                {group?.description || suggested.description}
              </div>
              <div className="px-5 max-h-[350px] pb-4">
                {data &&
                  data.map((message: any, i: number) => (
                    <ul key={message.id}>
                      <li>{message.text}</li>

                      {data[i]?.user_id !== data[i + 1]?.user_id && (
                        <li className="my-1 bg-slate-200">
                          <p className=" text-center text-xs text-slate-700">
                            {`${data[i]?.user.first_name} ${data[i]?.user.last_name}`}
                          </p>
                        </li>
                      )}
                    </ul>
                  ))}
                <div className="h-10" />
              </div>
            </div>
          </div>

          {group ? (
            <div className="flex items-center gap-4 px-5">
              <textarea
                className="flex-1 p-3 rounded-md resize-none h-12"
                value={text}
                placeholder="Type message"
                onChange={(e) => setText(e.target.value)}
              />
              <AppButton text="Send" onClick={handleSendMessage}>
                <SentIcon />
              </AppButton>
            </div>
          ) : (
            <div className="flex justify-center">
              <AppButton
                text={join.isPending ? "loading..." : "Join Group"}
                onClick={joinGroup}
              >
                <Tornado01Icon />
              </AppButton>
            </div>
          )}
        </div>
      ) : (
        <div className="p-10">Select Chat</div>
      )}
    </div>
  );
}
