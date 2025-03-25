import { useNavigate } from "react-router-dom";
import { Button } from "../Button/Button";
import classes from "./Header.module.css";

type Props = {
  buttonColorMode: "dark" | "light";
  buttonAim?: "на главную" | "опыт работы";
};

export const Header = ({ buttonColorMode, buttonAim }: Props) => {
  const navigate = useNavigate();

  const buttonClick = () => {
    if (buttonAim === "на главную") {
      navigate("/");
    }
    // if (props.buttonAim === "опыт работы") {
    //   navigate("/");
    // }
  };

  return (
    <div className={classes.header}>
      <div className={classes.photo_container}>
        <img
          className={classes.photo}
          src="/images/tanya.png"
          alt="realtor-photo"
        />
      </div>
      <div className={classes.info}>
        <div className={classes.realtor_info}>
          <div className={classes.realtor_name}>риэлтор Татьяна Рушай</div>
          <div className={classes.realtor_phone}>
            <a href="tel:+79032544110">+7 903 254 41 10</a>
          </div>
        </div>
        <div className={classes.buttons_bar}>
          {buttonAim ? (
            <Button colorMode={buttonColorMode} onClick={buttonClick}>
              {buttonAim}
            </Button>
          ) : (
            <span className={classes.experience}>опыт работы 25 лет</span>
          )}
        </div>
      </div>
    </div>
  );
};
