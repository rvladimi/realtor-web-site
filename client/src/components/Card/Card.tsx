import { useNavigate } from "react-router-dom";
import classes from "./Card.module.css";

type CardProps = {
  imageSrc?: string;
  cardId: string;
  currentObjectId: string;
  func: any;
  description?: string;
};

export function Card({
  cardId,
  currentObjectId,
  imageSrc,
  description,
  func,
}: CardProps) {
  const navigate = useNavigate();

  let cls = classes.card;
  if (currentObjectId === "") {
    cls += ` ${classes.card_regular}`;
  } else if (currentObjectId === cardId) {
    cls += ` ${classes.card_highlighted}`;
  } else {
    cls += ` ${classes.card_bleary}`;
  }

  return (
    <div
      id={cardId}
      className={cls}
      onClick={() => {
        if (cardId) func(cardId);
        navigate(`/realty-object/${cardId}`);
      }}
    >
      <div className={classes.image_wrapper}>
        {/* <img src={`http://localhost:5050/${imageSrc}`} alt="realty object" /> */}
        <img src={`images/${imageSrc}`} alt="realty object" />
      </div>
      <div className={classes.description}>{description}</div>
    </div>
  );
}
