"use client";
import { FetchGroups, FetchMyGroups } from "@/app/apis";
import { GroupStoreState, useGroupStore } from "@/store/groups";
import {
  AiMagicIcon,
  Bone01Icon,
  Cards02Icon,
  FireIcon,
  Tornado01Icon,
} from "hugeicons-react";
import { useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import AccordionHeader from "../AccordionHeader";
import { useSocket } from "@/hooks/UseSocket";

export default function Groups(): JSX.Element {
  const groupStore = useGroupStore((state: GroupStoreState) => state);
  const [token, setToken] = useState<string | null>(null);

  const socket = useSocket();

  useEffect(() => {
    const t = localStorage.getItem("CT_access_token");
    setToken(t);

    if (token) {
      getAllGroups(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const getAllGroups = async (token: string | null) => {
    const groupdata = await FetchGroups(token);
    const mygroups = await FetchMyGroups(token);

    // sometimes data comes as object where token is not sent

    const groups = Array.isArray(mygroups)
      ? mygroups?.map((groupsU: any) => groupsU.group)
      : [];
    if (groups.length > 0) {
      joinRooms(groups);
    }

    groupStore.setGroups(groups);
    groupStore.setSuggestions(Array.isArray(groupdata) ? groupdata : []);
  };

  const joinRooms = (data: any) => {
    const rooms = data.map((room: any) => room.name);
    socket?.emit("join", rooms);
  };

  const setCurrent = (id: string) => {
    groupStore.setCurrent(id);
  };

  return (
    <div className="">
      <Accordion transition transitionTimeout={1000}>
        <AccordionItem
          initialEntered
          header={<AccordionHeader icon={<Tornado01Icon />} title="Groups" />}
        >
          <ul className="px-3 py-1 space-y-2">
            {groupStore.groups.length > 0 &&
              groupStore.groups.map((group) => (
                <li key={group.id}>
                  <button onClick={() => setCurrent(group.id)}>
                    {group.name}
                  </button>
                </li>
              ))}
            <li>
              <div className="inline-flex gap-1 py-1 bg-emerald-500 text-white items-center px-3 rounded-full">
                <FireIcon size={16} />
                <p className="text-sm font-medium">Suggested</p>
              </div>
            </li>
            {groupStore.suggestions &&
              groupStore.suggestions.map((group) => (
                <li key={group.id}>
                  <button onClick={() => setCurrent(group.id)}>
                    {group.name}
                  </button>
                </li>
              ))}
          </ul>
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
