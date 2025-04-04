import { useState } from "react";
import classes from "./Slider.module.css";

type SliderProps = {
  pics: string[];
};

export function Slider({ pics }: SliderProps) {
  const [isClicked, setIsClicked] = useState(false);
  const [index, setIndex] = useState(0);

  const imageSize = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const height = parseInt(
      getComputedStyle(event.target as HTMLImageElement).height
    );
    if (height > 700) {
      setIsClicked(false);
      const width = parseInt(
        getComputedStyle(event.target as HTMLImageElement).width
      );
      const coeff = height / width;
      (event.target as HTMLImageElement).style.width =
        Math.round(700 / coeff) + "px";
    } else {
      (event.target as HTMLImageElement).style.width = "";
    }
  };

  return (
    <>
      <div className={classes.carousel}>
        <LeftArrow index={index} setIndex={setIndex} />

        <div
          className={classes.carousel_img_container}
          onClick={() => setIsClicked(!isClicked)}
        >
          <img
            src={`https://mysite.com/static/${pics[index]}`}
            onLoad={imageSize}
            alt="realty pic"
          />
        </div>

        <RightArrow
          index={index}
          upperLimit={pics.length - 1}
          setIndex={setIndex}
        />
      </div>

      <MiniGalery
        data={pics}
        isClicked={isClicked}
        setIndex={setIndex}
        index={index}
      />
    </>
  );
}

type ArrowProps = {
  index: number;
  upperLimit?: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
};

function LeftArrow(props: ArrowProps) {
  const arrowClass =
    props.index > 0 ? classes.arrow : `${classes.arrow} ${classes.unclickable}`;
  const fillCircle = props.index > 0 ? "white" : "#CFCFCF";
  const fillPolygon = props.index > 0 ? "rgba(71, 61, 138, 0.9)" : "#4D4D4D";

  return (
    <div
      className={arrowClass}
      onClick={() => {
        if (props.index > 0) {
          const nextIndex: number = props.index - 1;
          props.setIndex(nextIndex);
        }
      }}
    >
      <svg width="100px" height="100px" viewBox="0 0 512 512">
        <g transform="rotate(180,256,256)">
          <circle cx="256" cy="256" r="256" fill={fillCircle} />
          <polygon
            fill={fillPolygon}
            points="193.447,338.438 234.081,379.08 357.161,256 234.081,132.928 193.447,173.562 275.877,256 "
          />
        </g>
      </svg>
    </div>
  );
}

function RightArrow(props: ArrowProps) {
  const arrowClass =
    props.upperLimit && props.index < props.upperLimit
      ? classes.arrow
      : `${classes.arrow} ${classes.unclickable}`;
  const fillCircle =
    props.upperLimit && props.index < props.upperLimit ? "white" : "#CFCFCF";
  const fillPolygon =
    props.upperLimit && props.index < props.upperLimit
      ? "rgba(71, 61, 138, 0.9)"
      : "#4D4D4D";

  return (
    <div
      className={arrowClass}
      onClick={() => {
        if (props.upperLimit && props.index < props.upperLimit) {
          const nextIndex: number = props.index + 1;
          props.setIndex(nextIndex);
        }
      }}
    >
      <svg width="100px" height="100px" viewBox="0 0 512 512">
        <g>
          <circle cx="256" cy="256" r="256" fill={fillCircle} />
          <polygon
            fill={fillPolygon}
            points="193.447,338.438 234.081,379.08 357.161,256 234.081,132.928 193.447,173.562 275.877,256 "
          />
        </g>
      </svg>
    </div>
  );
}

type MiniGaleryProps = {
  data: string[];
  isClicked: boolean;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  index: number;
};

function MiniGalery(props: MiniGaleryProps) {
  if (props.data.length > 1) {
    return (
      <div className={classes.mini_galery}>
        {props.data.map((item: string, itemIndex: number) => {
          const borderStyle =
            itemIndex === props.index
              ? { border: "3px solid #b478ed" }
              : { border: "3px solid #f2f2f2" };
          return (
            <div
              key={itemIndex}
              className={classes.mini_pic_wrapper}
              style={borderStyle}
              onClick={() => {
                const currentIndex = itemIndex;
                props.setIndex(currentIndex);
              }}
            >
              <img
                src={`https://mysite.com/static/${item}`}
                alt="realty mini pic"
              />
            </div>
          );
        })}
      </div>
    );
  } else {
    return null;
  }
}
