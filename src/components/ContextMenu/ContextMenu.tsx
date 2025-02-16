import X from "@/assets/img/x.svg";
import { Coords } from "@/services/types";
import Button from "../Button/Button";
import styles from "./ContextMenu.module.css";

type ContextMenuProps = {
  coords: Coords;
  children: React.ReactNode;
  onClose: () => void;
};

const ContextMenu: React.FC<ContextMenuProps> = ({
  coords,
  children,
  onClose,
}) => {
  return (
    <div
      className={styles.contextMenu}
      style={{ top: coords.y - 30, left: coords.x }}
    >
      {children}
      <Button className={styles.closeMenuBtn} clickHandler={onClose}>
        <img src={X} alt="close" />
      </Button>
    </div>
  );
};

export default ContextMenu;
