import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function HomeLayout({ children }: Props): JSX.Element {
  return <div className="bg-gray-100">{children}</div>;
}
