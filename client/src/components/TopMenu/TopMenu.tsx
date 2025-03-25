import { Button } from "../Button/Button";
import { correspondence } from "../common.tsx";
import classes from "./TopMenu.module.css";

type OptionsProps = {
  available: Set<string> | null;
};

function Options({ available }: OptionsProps) {
  if (available) {
    const content = [];
    for (const item of available) {
      content.push(
        <option key={item} value={item}>
          {correspondence(item)}
        </option>
      );
    }
    return content;
  } else {
    return null;
  }
}

type TopMenuProps = {
  buttonColorMode: "dark" | "light";
  buyFunc: () => void;
  buyState?: string;
  buyHighlighted?: string;
  rentFunc: () => void;
  rentState?: string;
  rentHighlighted?: string;
  option: string;
  selectFunc: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  availableTypes: Set<string> | null;
};

export const TopMenu = ({
  buttonColorMode,
  buyFunc,
  buyState,
  buyHighlighted,
  rentFunc,
  rentState,
  rentHighlighted,
  option,
  selectFunc,
  availableTypes,
}: TopMenuProps) => {
  return (
    <div className={classes.realty_choice}>
      <Button
        onClick={buyFunc}
        inactive={buyState}
        highlighted={buyHighlighted}
        colorMode={buttonColorMode}
      >
        продажа
      </Button>
      <Button
        onClick={rentFunc}
        inactive={rentState}
        highlighted={rentHighlighted}
        colorMode={buttonColorMode}
      >
        аренда
      </Button>
      <select
        className={classes.realty_select}
        value={option}
        onChange={selectFunc}
      >
        <option value="all">все объекты</option>
        <Options available={availableTypes} />
      </select>
    </div>
  );
};
