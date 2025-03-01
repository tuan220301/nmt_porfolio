type InputProps = {
  placeholder?: string;
  onChangeText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  type: string;
  icon?: React.ReactNode;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const InputComponent = ({ placeholder, onChangeText, value, type, icon, onEnter }: InputProps) => {
  return (
    <div
      className="h-full flex items-center justify-between bg-gray-50 p-2.5 border rounded-lg transition-colors 
      focus-within:border-blue-400 focus-within:border-2 w-full dark:bg-[#202023] border-gray-300"
    >
      <input
        value={value}
        type={type}
        placeholder={placeholder || ""}
        onChange={onChangeText}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onEnter) {
            onEnter(e);
          }
        }}
        className={`h-full bg-gray-50 text-gray-900 text-sm dark:bg-[#202023] 
        dark:placeholder-gray-400 dark:text-white border-0 focus:ring-0 outline-none ${icon ? "w-2/3" : "w-full"}`}
      />
      {icon && <div>{icon}</div>}
    </div>
  );
};

export default InputComponent;

