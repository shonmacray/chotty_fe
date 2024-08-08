import { ReactNode } from "react";

interface Props {
  text: string;
  children?: ReactNode;
  variant?: "secondary" | "default";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick: () => void;
}

export default function AppButton({
  text,
  variant = "default",
  children,
  type = "button",
  disabled = false,
  onClick,
}: Props): JSX.Element {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`text-md flex justify-center items-center gap-1 ${
        disabled ? "bg-gray-500" : "bg-sky-500 active:bg-sky-400"
      }  px-5 rounded-lg text-white font-medium ${
        variant === "secondary" ? "w-full py-2" : "py-3"
      }`}
    >
      {children} <p>{text}</p>
    </button>
  );
}
