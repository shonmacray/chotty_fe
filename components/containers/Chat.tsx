"use client";

import { FetchMessages, sendJoinRquest } from "@/app/apis";
import { GroupStoreState, useGroupStore } from "@/store/groups";
import { useEffect, useRef, useState } from "react";
import AppButton from "../Button";
import { CheckmarkBadge02Icon, SentIcon, Tornado01Icon } from "hugeicons-react";
import { useSocket } from "@/hooks/UseSocket";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLogout } from "@/hooks/UseLogout";
import { joinRooms } from "@/helper";
import { useInView } from "react-intersection-observer";

export default function Chat(): JSX.Element {
  const [text, setText] = useState<string>();
  const groupStore = useGroupStore<GroupStoreState>((state) => state);

  const socket = useSocket();
  const logout = useLogout();
  const queryClient = useQueryClient();

  const { ref, inView, entries } = useInView({
    threshold: 0,
  });
  const lastRef = useRef<HTMLDivElement>(null);

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
    if (data) {
      lastRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group, suggested]);

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
      lastRef.current?.scrollIntoView({ behavior: "smooth" });
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

  console.log(data);

  return (
    <div className="h-full">
      {group !== null || suggested !== null ? (
        <div className="h-full flex flex-col justify-between">
          <div className="flex-1 flex flex-col">
            <div className="h-14 px-5 bg-white flex flex-col justify-center">
              <div className="font-semibold flex gap-2 items-center">
                <h1 className="text-lg">{group?.name || suggested.name}</h1>
                <CheckmarkBadge02Icon size={20} />
              </div>
            </div>
            <div className="flex-1 overflow-scroll pb-4 pt-2">
              <div className="px-5">
                {group?.description || suggested.description}
              </div>
              <div className="px-5 max-h-[350px] pb-4">
                {data &&
                  data.map((message: any, i: number) => (
                    <ul key={message.id}>
                      <li>{message.text}</li>

                      {data[i]?.user_id !== data[i + 1]?.user_id && (
                        <li className="my-1">
                          <p className="text-xs text-sky-700">
                            {`${data[i]?.user.first_name} ${data[i]?.user.last_name}`}
                          </p>
                        </li>
                      )}
                    </ul>
                  ))}
                <div className="h-10" ref={ref} />
                <div className="" ref={lastRef} />
              </div>
            </div>
          </div>

          {group ? (
            <div className="flex items-center gap-4 px-5 mb-10">
              <textarea
                className="flex-1 p-3 rounded-md resize-none h-12"
                value={text}
                placeholder={group?.description || suggested.description}
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
        <div className="p-10 h-full flex justify-center items-center">
          Select Chat
        </div>
      )}
    </div>
  );
}
