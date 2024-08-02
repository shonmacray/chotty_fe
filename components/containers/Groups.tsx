"use client";
import { FetchGroups, FetchMyGroups } from "@/apis";
import { socket } from "@/apis/socket";
import { GroupStoreState, useGroupStore } from "@/store/groups";
import {
  ArrowUp01Icon,
  Cards02Icon,
  EggsIcon,
  FireIcon,
  GiftIcon,
} from "hugeicons-react";
import { useEffect } from "react";

export default function Groups(): JSX.Element {
  const groupStore = useGroupStore((state: GroupStoreState) => state);

  useEffect(() => {
    getAllGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllGroups = async () => {
    const groupdata = await FetchGroups();
    const mygroups = await FetchMyGroups();

    const groups = mygroups.map((groupsU: any) => groupsU.group);
    joinRooms(groups);

    groupStore.setGroups(groups);
    groupStore.setSuggestions(groupdata);
  };

  const joinRooms = (data: any) => {
    const rooms = data.map((room: any) => room.name);
    socket.emit("join", rooms);
  };

  const setCurrent = (id: string) => {
    groupStore.setCurrent(id);
  };

  return (
    <div className="">
      <div>
        <div className="h-14 flex items-center gap-2 bg-white px-3">
          <EggsIcon />
          <h1 className="font-semibold">Groups</h1>
        </div>
        <ul className="px-3 pt-4">
          {groupStore.groups &&
            groupStore.groups.map((group) => (
              <li key={group.id}>
                <button onClick={() => setCurrent(group.id)}>
                  {group.name}
                </button>
              </li>
            ))}
        </ul>
      </div>
      <div className="px-3 py-3">
        <h1>Suggested</h1>
        <ul>
          {groupStore.suggestions &&
            groupStore.suggestions.map((group) => (
              <li key={group.id}>
                <button onClick={() => setCurrent(group.id)}>
                  {group.name}
                </button>
              </li>
            ))}
        </ul>
      </div>
      <div className="h-14 flex items-center gap-2 bg-white px-3">
        <FireIcon />
        <h1 className="">Rewards</h1>
      </div>
      <div className="h-14 flex items-center gap-2 bg-white px-3">
        <Cards02Icon />
        <h1 className="">Subscriptions</h1>
      </div>
    </div>
  );
}
