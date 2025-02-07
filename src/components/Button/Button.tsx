import cl from "./Button.module.css";

type ButtonProps = {
  children: React.ReactNode;
  clickHandler: () => void;
};

const Button: React.FC<ButtonProps> = ({ children, clickHandler }) => {
  return (
    <button className={cl.button} onClick={clickHandler}>
      {children}
    </button>
  );
};

export default Button;
