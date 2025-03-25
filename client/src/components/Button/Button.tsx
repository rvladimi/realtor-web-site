//import classes from "./Button.module.css";
import classes from "./Button.module.css";

type Props = {
  // active: Home -> TopMenu -> Button
  inactive?: string; // the button is unclickable
  // color: Home -> Header -> Button, Admin -> Button
  colorMode?: "dark" | "light"; // button is dark on the light background and vice versa
  // highlighted: Home -> TopMenu -> Button
  highlighted?: string; // clicked button gets highlighted
  // onClick: Home -> Header -> Button, Home -> TopMenu -> Button, Admin -> Button
  onClick: () => void;
  children: string;
};

export const Button = ({
  inactive,
  colorMode,
  highlighted,
  onClick,
  children,
}: Props) => {
  let cls = classes.button;
  if (inactive) {
    cls += ` ${classes.inactive}`;
  }
  if (colorMode === "dark") {
    cls += ` ${classes.dark}`;
  }
  if (colorMode === "light") {
    cls += ` ${classes.light}`;
  }
  if (highlighted) {
    cls += ` ${classes.highlighted}`;
  }

  return (
    <div className={cls} onClick={onClick}>
      {children}
    </div>
  );
};
