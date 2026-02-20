type ButtonIconComponentProps = {
  icon: React.ReactNode;
  onClick: () => void;
  title?: string;
  onMouseDown?: (e: React.MouseEvent) => void;

};
const ButtonIconComponent = (props: ButtonIconComponentProps) => {
  const { ...prop } = props;
  return (
    <button className="border rounded-lg flex items-center justify-center p-2"
      onClick={prop.onClick}
      onMouseDown={prop.onMouseDown}>
      <div>
        {prop.title ? prop.title : <></>}
      </div>
      {prop.icon}
    </button>
  );
};
export default ButtonIconComponent;
