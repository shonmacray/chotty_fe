import { ReactNode } from "react";

interface Props {
  text: string;
  children?: ReactNode;
  variant?: "secondary" | "default";
  onClick: () => void;
}

export default function AppButton({
  text,
  variant = "default",
  children,
  onClick,
}: Props): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={`text-md flex justify-center items-center gap-1 bg-sky-500 px-5 rounded-lg text-white font-medium ${
        variant === "secondary" ? "w-full py-2" : "py-3"
      }`}
    >
      {children} <p>{text}</p>
    </button>
  );
}
