import cl from "./Button.module.css"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  clickHandler?: () => void
  className?: string
}

const Button: React.FC<ButtonProps> = ({
  children,
  clickHandler,
  ...props
}) => {
  return (
    <button
      className={[cl.button, props?.className].join()}
      onClick={clickHandler}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
