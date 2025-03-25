import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { InView } from "react-intersection-observer";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { Slider } from "../Slider/Slider";
import {
  correspondence,
  DataContext,
  DataContextType,
  MobileContext,
  MobileContextType,
  RealtyType,
} from "../common.tsx";
import classes from "./RealtyObjectInfo.module.css";

type AboutProps = {
  realtyType: RealtyType;
  details?: {
    totalArea: string;
    numberOfRooms?: number;
    residentialArea?: string;
    kitchenArea?: string;
    landArea?: string;
    floor?: number;
    totalFloors?: number;
  };
};

function About(props: AboutProps) {
  if (props.realtyType === "flat" || props.realtyType === "townhouse") {
    const subheader = props.realtyType === "flat" ? "О квартире" : "Об объекте";
    return (
      <>
        <div className={classes.item_header}>{subheader}</div>
        <div className={classes.about}>
          {props.details?.numberOfRooms && (
            <>
              <span>Количество комнат: &nbsp;</span>
              <span className={classes.value}>
                {props.details.numberOfRooms}
              </span>
              <br />
            </>
          )}
          {props.details?.totalArea && (
            <>
              <span>Общая площадь: &nbsp;</span>
              <span className={classes.value}>
                {props.details.totalArea}
              </span>{" "}
              <span className={classes.meter}>м</span>
              <sup>
                <span className={classes.power}>2</span>
              </sup>
              <br />
            </>
          )}
          {props.details?.residentialArea && (
            <>
              <span>Жилая площадь: &nbsp;</span>
              <span className={classes.value}>
                {props.details.residentialArea}
              </span>{" "}
              <span className={classes.meter}>м</span>
              <sup>
                <span className={classes.power}>2</span>
              </sup>
              <br />
            </>
          )}
          {props.details?.kitchenArea && (
            <>
              <span>Площадь кухни: &nbsp;</span>
              <span className={classes.value}>
                {props.details.kitchenArea}
              </span>{" "}
              <span className={classes.meter}>м</span>
              <sup>
                <span className={classes.power}>2</span>
              </sup>
              <br />
            </>
          )}
          {props.realtyType === "flat" && props.details?.floor && (
            <span>
              Этаж: &nbsp;{" "}
              <span className={classes.value}>{props.details.floor}</span>
              {props.details.totalFloors && (
                <span>
                  &nbsp; из &nbsp;
                  <span className={classes.value}>
                    {props.details.totalFloors}
                  </span>
                </span>
              )}
            </span>
          )}
          {props.realtyType === "townhouse" && props.details?.totalFloors && (
            <>
              <span>
                Этажей: &nbsp;{" "}
                <span className={classes.value}>
                  {props.details.totalFloors}
                </span>
              </span>
              <br />
            </>
          )}
          {props.details?.landArea && (
            <>
              <span>Площадь участка: &nbsp;</span>
              <span className={classes.value}>
                {props.details.landArea}
              </span>{" "}
              <span className={classes.meter}>сот.</span>
              <br />
            </>
          )}
        </div>
        <div className={classes.item_header}>Описание</div>
      </>
    );
  } else {
    return <div className={classes.item_header}>Описание</div>;
  }
}

type MobileSliderProps = {
  pics: string[];
};

function MobileSlider({ pics }: MobileSliderProps) {
  const [currentItem, setCurrentItem] = useState(0);
  return (
    <>
      {pics.length > 1 && (
        <div className={classes.indicator}>
          {pics.map((item, index) => {
            const cls =
              index === currentItem
                ? classes.indicator_item_highlighted
                : classes.indicator_item;
            return <div key={index} className={cls}></div>;
          })}
        </div>
      )}
      <div className={classes.mobile_galery}>
        {pics.map((item, index) => {
          return (
            <InView
              key={index}
              as="div"
              threshold={0.7}
              onChange={(inView, entry) => {
                const galery = entry.target.parentElement as HTMLDivElement;
                const imageContainer = entry.target
                  .firstElementChild as HTMLDivElement;
                if (inView && imageContainer && galery) {
                  setCurrentItem(index);
                  if (imageContainer.offsetHeight > 200) {
                    galery.style.height = imageContainer.offsetHeight + "px";
                  } else {
                    galery.style.height = "200px";
                  }
                }
              }}
            >
              <div
                id={"image" + index}
                className={classes.mobile_img_container}
              >
                <img
                  // src={`http://localhost:5050/${props.data[index]}`}
                  src={`../../images/${pics[index]}`}
                  alt="realty pic"
                />
              </div>
            </InView>
          );
        })}
      </div>
    </>
  );
}

function priceFormatter(price?: string): string | undefined {
  if (price && price.length > 3) {
    price += " ";
    const arr = Array.from(price);
    let first = arr.indexOf(" ");
    while (first > 3) {
      arr.splice(first - 3, 0, " ");
      first = arr.indexOf(" ");
    }
    return arr.join("");
  } else {
    return price + " ";
  }
}

export function RealtyObjectInfo() {
  const { data } = useContext(DataContext) as DataContextType;
  const { mobile } = useContext(MobileContext) as MobileContextType;
  const param = useParams();
  const id = param.id;
  const obj = data?.find((item) => item.id === id);
  const header =
    obj?.infoType !== "flat"
      ? correspondence(obj?.infoType)
      : `${obj.infoDetails?.numberOfRooms}-комн. квартира`;

  if (id && obj) {
    return (
      <div className={classes.wrapper}>
        <Header buttonColorMode="light" buttonAim="на главную" />

        <div className={classes.header}>
          <div className={classes.name}>{header}</div>
          <div className={classes.price}>
            {priceFormatter(obj.infoPrice)}&#8381;
          </div>
        </div>
        {mobile && <MobileSlider pics={obj.images ? obj.images : []} />}
        {!mobile && <Slider pics={obj.images ? obj.images : []} />}

        <div className={classes.content}>
          <div className={classes.item_header}>Адрес</div>
          <div className={classes.address}>{obj.infoAddress}</div>
          <About realtyType={obj.infoType} details={obj.infoDetails} />
          <div className={`${classes.about} ${classes.description}`}>
            {obj.infoDescription}
          </div>
        </div>

        <div className={classes.footer_wrapper}>
          <Footer>Дубна 2025</Footer>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
