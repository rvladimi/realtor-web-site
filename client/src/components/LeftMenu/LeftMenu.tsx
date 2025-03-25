import { RealtyObject } from "../common.tsx";
import { Card } from "../Card/Card";
import classes from "./LeftMenu.module.css";

type Props = {
  currentObjectId: string;
  func: React.Dispatch<React.SetStateAction<string>>;
  availableObjects: RealtyObject[] | null;
};

export const LeftMenu = ({
  currentObjectId,
  func,
  availableObjects,
}: Props) => {
  return (
    <div className={classes.left_menu}>
      {availableObjects?.map((item, index) => {
        return (
          <Card
            key={index}
            cardId={item.id ? item.id : ""}
            currentObjectId={currentObjectId}
            func={func}
            imageSrc={item.images?.[0]}
            description={item.shortDescription}
          />
        );
      })}
    </div>
  );
};
