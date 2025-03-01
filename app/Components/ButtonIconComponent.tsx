type ButtonIconComponentProps = {
  icon: React.ReactNode;
  onClick: () => void;
  title?: string;
}
const ButtonIconComponent = (props: ButtonIconComponentProps) => {
  const { ...prop } = props;
  return (
    <button className="border rounded-lg flex items-center justify-center p-2"
      onClick={prop.onClick}>
      <div>
        {prop.title ? prop.title : <></>}
      </div>
      {prop.icon}
    </button>
  )
}
export default ButtonIconComponent;
