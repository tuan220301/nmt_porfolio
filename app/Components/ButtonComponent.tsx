type ButtonComponentProps = {
  title: string;
  onClick: () => void;
}
const ButtonComponent = (props: ButtonComponentProps) => {
  const { title, onClick } = props;
  return (
    <button onClick={onClick}>{title}</button>
  )
}
export default ButtonComponent;
