interface Props {
  placeholder: string;
  type?: string;
}
import { useController, UseControllerProps } from "react-hook-form";

export default function Input(
  props: UseControllerProps<any> & Props
): JSX.Element {
  const { field, fieldState } = useController(props);

  return (
    <div>
      <input
        className={`w-full ring-1  ${
          fieldState.isTouched && fieldState.invalid
            ? "ring-rose-600"
            : "ring-gray-200"
        } focus:ring-sky-600 px-4 py-2 rounded-md`}
        {...field}
        placeholder={props.placeholder}
        type={props.type}
      />
      {fieldState.isTouched && fieldState.invalid && (
        <p className="pt-1 text-sm text-rose-600">{field.name} is required</p>
      )}
    </div>
  );
}
