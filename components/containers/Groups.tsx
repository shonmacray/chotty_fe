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

  useEffect(() => {
    getMyGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllGroups = async () => {
    const data = await FetchGroups();
    groupStore.setGroups(data);
  };

  const getMyGroups = async () => {
    const data = await FetchMyGroups();
    const groups = data.map((groupsU: any) => groupsU.group);

    joinRooms(groups);
  };

  const joinRooms = (data: any) => {
    const rooms = data.map((room: any) => room.name);
    socket.emit("join", rooms);
  };

  const setCurrent = (id: string) => {
    groupStore.setCurrent(id);
  };

  return (
    <div>
      <div>
        <h1>Public Groups</h1>
        <ul>
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
      {/* <div>
        <h1></h1>
      </div> */}
    </div>
  );
}
