"use client";
import { FetchGroups, FetchMyGroups } from "@/app/apis";
import { GroupStoreState, useGroupStore } from "@/store/groups";
import {
  AiMagicIcon,
  Cards02Icon,
  FireIcon,
  Tornado01Icon,
} from "hugeicons-react";
import { useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import AccordionHeader from "../AccordionHeader";
import { useSocket } from "@/hooks/UseSocket";
import { useQuery } from "@tanstack/react-query";
import { useLogout } from "@/hooks/UseLogout";
import { joinRooms } from "@/helper";
import { useUserStore } from "@/store/user";
import ListItem from "../ListItem";

export default function Groups(): JSX.Element {
  const groupStore = useGroupStore((state: GroupStoreState) => state);
  const user = useUserStore((state) => state.user);
  const [token, setToken] = useState<string | null>(null);

  const socket = useSocket();
  const logout = useLogout();

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["suggested"],
    queryFn: () => {
      return FetchGroups(token);
    },
    enabled: token ? true : false,
  });

  const { isLoading: mygroupsLoading, data: mygroups } = useQuery({
    queryKey: ["mygroups", token],
    queryFn: () => FetchMyGroups(token),
    enabled: token ? true : false,
  });

  useEffect(() => {
    if (!mygroupsLoading) {
      if (mygroups?.length > 0) {
        joinRooms(mygroups, socket);
        groupStore.setGroups(mygroups);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mygroupsLoading, mygroups]);

  useEffect(() => {
    if (!isLoading && data) {
      if (data.error) {
        logout();
      } else {
        groupStore.setSuggestions(data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading]);

  useEffect(() => {
    if (groupStore.groups?.length > 0) {
      refetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupStore.groups]);

  useEffect(() => {
    const t = localStorage.getItem("CT_access_token");
    setToken(t || user?.access_token!);
  }, [token, user?.access_token]);

  const setCurrent = (id: number) => {
    groupStore.setCurrent(id);
  };

  return (
    <div>
      <Accordion transition transitionTimeout={1000}>
        <AccordionItem
          initialEntered
          header={<AccordionHeader icon={<Tornado01Icon />} title="Groups" />}
        >
          {isLoading || mygroupsLoading ? (
            <div />
          ) : (
            <ul className="px-3 py-1 space-y-2">
              {groupStore.groups?.length > 0 &&
                groupStore.groups.map((group) => (
                  <ListItem
                    key={group.id}
                    active={group.id === groupStore.current}
                    text={group.name}
                    onClick={() => setCurrent(group.id)}
                    unseen={30}
                  />
                ))}
              {groupStore.suggestions.length > 0 && (
                <li>
                  <div className="inline-flex gap-1 py-1 bg-purple-200 text-black items-center px-3 rounded-full">
                    <FireIcon size={16} />
                    <p className="text-sm font-medium">Suggested</p>
                  </div>
                </li>
              )}

              {groupStore.suggestions &&
                groupStore.suggestions.map((group) => (
                  <ListItem
                    key={group.id}
                    active={group.id === groupStore.current}
                    text={group.name}
                    onClick={() => setCurrent(group.id)}
                  />
                ))}
            </ul>
          )}
        </AccordionItem>

        <AccordionItem
          header={<AccordionHeader icon={<AiMagicIcon />} title="Rewards" />}
        >
          <div className="px-3">
            Quisque eget luctus mi, vehicula mollis lorem. Proin fringilla vel
            erat quis sodales.
          </div>
        </AccordionItem>

        <AccordionItem
          header={
            <AccordionHeader icon={<Cards02Icon />} title="Subscriptions" />
          }
        >
          <div className="px-3">
            Suspendisse massa risus, pretium id interdum in, dictum sit amet
            ante.
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
