import { ReactElement } from "react";

interface ListItemProps {
  active: boolean;
  text: string;
  unseen?: number;
  onClick: () => void;
}

export default function ListItem({
  active,
  text,
  unseen,
  onClick,
}: ListItemProps): ReactElement {
  return (
    <li className={`${active ? "font-semibold" : ""}`}>
      <button
        className="flex items-center w-full justify-between"
        onClick={onClick}
      >
        <p>{text}</p>

        {unseen && (
          <p className="h-5 w-5 flex items-center justify-center rounded-full bg-rose-600 text-white text-xs font-normal">
            {unseen > 9 ? 9 + "+" : unseen}
          </p>
        )}
      </button>
    </li>
  );
}
