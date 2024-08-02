import { ChangeEvent } from "react";

interface Props {
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  type?: string;
}

export default function Input({
  placeholder,
  type = "text",
  value,
  onChange,
}: Props): JSX.Element {
  return (
    <input
      className="w-full ring-1 px-3 py-2 rounded-md"
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
    />
  );
}
