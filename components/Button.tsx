interface Props {
  text: string;
  variant?: "secondary" | "default";
  onClick: () => void;
}

export default function AppButton({
  text,
  variant = "default",
  onClick,
}: Props): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={`text-md bg-sky-500 px-5 rounded-lg text-white font-medium ${
        variant === "secondary" ? "w-full py-2" : "py-3"
      }`}
    >
      {text}
    </button>
  );
}
