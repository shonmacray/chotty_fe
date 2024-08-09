"use client";

import { FetchMessages, sendJoinRquest } from "@/app/apis";
import { Group, GroupStoreState, useGroupStore } from "@/store/groups";
import { useEffect, useRef, useState } from "react";
import AppButton from "../Button";
import { CheckmarkBadge02Icon, SentIcon, Tornado01Icon } from "hugeicons-react";
import { useSocket } from "@/hooks/UseSocket";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLogout } from "@/hooks/UseLogout";
import { joinRooms, userColors } from "@/helper";
import { UserStoreState, useUserStore } from "@/store/user";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

const formSchema = z
  .object({
    text: z.string().min(1, { message: "text required" }),
  })
  .required();

const emoji = z.string().emoji();

type FormInput = z.infer<typeof formSchema>;

export default function Chat(): JSX.Element {
  const [group, setGroup] = useState<Group | null>(null);
  const [suggested, setSuggested] = useState<boolean>(false);

  const groupStore = useGroupStore<GroupStoreState>((state) => state);
  const user = useUserStore<UserStoreState>((state) => state);

  const socket = useSocket();
  const logout = useLogout();
  const queryClient = useQueryClient();

  const lastRef = useRef<HTMLDivElement>(null);

  const {
    handleSubmit,
    register,
    resetField,
    formState: { isValid },
  } = useForm<FormInput>({
    resolver: zodResolver(formSchema),
  });

  const { isLoading, data } = useQuery({
    queryKey: ["messages", groupStore.current],
    queryFn: () => FetchMessages(groupStore.current!),
    enabled: groupStore.current ? true : false,
  });

  const join = useMutation({
    mutationKey: ["sendJoinRequest"],
    mutationFn: (id: number) => {
      const token = localStorage.getItem("CT_access_token");
      return sendJoinRquest(id, token!);
    },
  });

  useEffect(() => {
    const mygroup = groupStore.groups?.find(
      (group) => group.id === groupStore.current
    );

    if (mygroup === undefined) {
      const suggestion = groupStore.suggestions.find(
        (group) => group.id === groupStore.current
      );

      if (suggestion !== undefined) {
        setGroup(suggestion);
        setSuggested(true);
      }
    } else {
      setGroup(mygroup);
      setSuggested(false);
    }
  }, [groupStore]);

  useEffect(() => {
    if (group && data) {
      lastRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [group, data]);

  useEffect(() => {
    if (!isLoading) {
      if (data && data?.error) {
        logout();
      }
    }
  }, [isLoading, data, logout]);

  type Message = {
    group_id: number;
    id: number;
    last_id: number;
    room: string;
    text: string;
  };

  useEffect(() => {
    socket?.on("member", (data: Message) => {
      queryClient.cancelQueries({ queryKey: ["messages", data.group_id] });

      queryClient.setQueryData(
        ["messages", data.group_id],
        (old: Message[]) => [...old, data]
      );
    });
  }, [socket, queryClient]);

  const handleSendMessage: SubmitHandler<FormInput> = (values) => {
    const { text } = values;
    if (group) {
      socket?.emit("message", {
        text,
        room: group.name,
        group_id: group.id,
        last_id: data.length,
      });
    }
    resetField("text");
  };

  const joinGroup = async () => {
    if (groupStore.current) {
      const data = await join.mutateAsync(groupStore.current);
      if (data.created) {
        toast.success(`Subscribed to ${group?.name}`);
        const groups = [...groupStore.groups];
        groups.push(group!);
        joinRooms(groups, socket);
        groupStore.setGroups(groups);
      }
    }
  };

  return (
    <div className="h-full">
      {group !== null ? (
        <div className="h-full flex flex-col justify-between">
          <div className="flex-1 flex flex-col">
            <div className="h-14 px-5 bg-white flex flex-col justify-center">
              <div className="font-semibold flex gap-2 items-center">
                <h1 className="text-lg">{group?.name}</h1>
                <CheckmarkBadge02Icon size={20} />
              </div>
            </div>
            <div className="flex-1 overflow-scroll pb-4 pt-2">
              <div className="px-5">
                {group?.description}
                <p className="text-sm font-medium text-yellow-600">
                  {group?.User_group.length} Subscriber
                  {group?.User_group.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="px-5 max-h-[350px] pb-4">
                {data &&
                  data.map((message: Message, i: number) => (
                    <ul key={message.id}>
                      <li
                        className={`${
                          emoji.safeParse(message.text).success ? "text-xl" : ""
                        }`}
                      >
                        {message.text}
                      </li>

                      {data[i]?.user_id !== data[i + 1]?.user_id && (
                        <li className="my-1">
                          <p
                            style={{ color: userColors[data[i].user.color] }}
                            className="text-xs"
                          >
                            {`${
                              user.user?.id === data[i]?.user_id
                                ? "You"
                                : data[i]?.user.first_name +
                                  " " +
                                  data[i]?.user.last_name
                            } 
                            `}
                          </p>
                        </li>
                      )}
                    </ul>
                  ))}
                <div className="h-10" />
                <div className="" ref={lastRef} />
              </div>
            </div>
          </div>

          {!suggested ? (
            <form
              onSubmit={handleSubmit(handleSendMessage)}
              className="flex items-start gap-4 px-5 mb-10"
            >
              <textarea
                className="flex-1 p-3 rounded-md resize-y max-h-20 min-h-12"
                placeholder={group?.description}
                {...register("text")}
              />
              <AppButton
                type="submit"
                text=""
                onClick={() => {}}
                disabled={!isValid}
              >
                <SentIcon />
              </AppButton>
            </form>
          ) : (
            <div className="flex justify-center mb-10">
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
