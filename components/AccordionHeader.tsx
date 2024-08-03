import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
}

export default function AccordionHeader({ icon, title }: Props): JSX.Element {
  return (
    <div className="h-14 w-full flex items-center gap-2 bg-white px-3">
      {icon}
      <h1 className="font-medium">{title}</h1>
    </div>
  );
}
