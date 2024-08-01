"use client";
import { FetchGroups } from "@/apis";
import { GroupStoreState, useGroupStore } from "@/store/groups";
import { useEffect } from "react";

export default function Groups(): JSX.Element {
  const groupStore = useGroupStore((state: GroupStoreState) => state);

  useEffect(() => {
    getGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getGroups = async () => {
    const data = await FetchGroups();
    groupStore.setGroups(data);
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
