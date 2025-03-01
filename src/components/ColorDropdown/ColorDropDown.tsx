import { pointConsts } from "@/consts/consts"
import { useRef, useState } from "react"
import styles from "./ColorDropdown.module.css"

type Option = { uniqueName: string; colorHEX: string }

type DropDownProps = {
  selected: Option["colorHEX"]
  options?: Option[]
  onChange: (value: string) => void
}

const ColorDropdown: React.FC<DropDownProps> = ({
  selected,
  options = pointConsts.selectColorOptions,
  onChange,
}) => {
  const [selectedColor, setSelectedColor] = useState(selected)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownControls = useRef<HTMLDivElement | null>(null)

  const handleSelect = (option: Option) => {
    setSelectedColor(option.colorHEX)
    setIsOpen(false)
    onChange(option.colorHEX)
  }

  return (
    <div onClick={() => setIsOpen(!isOpen)} className={styles.dropdown}>
      <div className={styles.dropdownControls} ref={dropdownControls}>
        color
        <span
          className={styles.selected}
          style={{ backgroundColor: selectedColor }}
        ></span>
      </div>
      <ul
        style={{ maxWidth: dropdownControls?.current?.clientWidth }}
        className={[isOpen ? styles.listOpened : styles.list].join("")}
      >
        {options.map(option => (
          <li
            key={option.uniqueName}
            className={styles.option}
            style={{ backgroundColor: option.colorHEX }}
            onClick={() => handleSelect(option)}
          />
        ))}
      </ul>
    </div>
  )
}

export default ColorDropdown
