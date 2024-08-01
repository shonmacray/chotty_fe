interface Props {
  text: string;
  onClick: () => void;
}

export default function AppButton({ text, onClick }: Props): JSX.Element {
  return (
    <button
      onClick={onClick}
      className="text-md bg-sky-500 px-5 py-3 rounded-lg text-white font-medium"
    >
      {text}
    </button>
  );
}
