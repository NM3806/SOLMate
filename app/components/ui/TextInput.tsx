interface TextInputProps {
    type?: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    min?: string | number;
    step?: string | number;
  }
  
  export default function TextInput({
    type = "text",
    placeholder,
    value,
    onChange,
    min,
    step,
  }: TextInputProps) {
    return (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        step={step}
        className="w-full p-3 border rounded-lg border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-zinc-500"
      />
    );
  }
  