"use client";
import { FetchGroups, FetchMyGroups } from "@/apis";
import { socket } from "@/apis/socket";
import { GroupStoreState, useGroupStore } from "@/store/groups";
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
    <div className="space-y-4  h-screen border-r bg-zinc-200 border-zinc-100">
      <div>
        <div className="px-4 h-14 flex items-center bg-white">
          <h1 className="font-semibold">Subscriptions</h1>
        </div>
        <ul className="px-4 pt-4">
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
      <div className="px-4">
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
    </div>
  );
}
