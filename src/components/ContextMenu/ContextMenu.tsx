import X from "@/assets/img/x.svg"
import { Coords } from "@/services/types"
import { useEffect, useRef, useState } from "react"
import Button from "../Button/Button"
import styles from "./ContextMenu.module.css"

type ContextMenuProps = {
  coords: Coords
  children: React.ReactNode
  onClose: () => void
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  coords,
  children,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null)
  const [menuOffset, setMenuOffset] = useState<Coords>({ x: 10, y: 0 })

  useEffect(() => {
    if (!menuRef?.current) {
      return
    }
    setMenuOffset({
      x: 10,
      y: menuRef.current.clientHeight,
    })
  }, [])

  return (
    <div
      ref={menuRef}
      className={styles.contextMenu}
      style={{
        top: coords.y - menuOffset.y / 2,
        left: coords.x + menuOffset.x,
      }}
    >
      <div className={styles.contextMenuContent}>{children}</div>
      <Button className={styles.closeMenuBtn} clickHandler={onClose}>
        <img src={X} alt="close" />
      </Button>
    </div>
  )
}

export default ContextMenu
