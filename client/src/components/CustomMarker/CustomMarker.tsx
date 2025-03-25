import { useContext } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { detectBrowser, MobileContext, MobileContextType } from "../common.tsx";
import classes from "./CustomMarker.module.css";

const mainColor = "#372f6a";
const highlightedColor = getComputedStyle(
  document.documentElement
).getPropertyValue("--highlighted-color");

type Props = {
  id: string;
  position: [number, number];
  markerSign: string;
  shortDescription?: string;
  currentObjectId: string;
  handler: React.Dispatch<React.SetStateAction<string>>;
};

export function CustomMarker(props: Props) {
  const { mobile } = useContext(MobileContext) as MobileContextType;
  const originalId = props.id.slice(1);
  const color: string =
    originalId === props.currentObjectId ? highlightedColor : mainColor;

  const createIcon = (markerSign: string, color: string) => {
    return L.divIcon({
      html: `
      <div class=${classes.pin_container}>
        <svg class=${classes.pin} viewBox="0 0 200 250" preserveAspectRatio="xMidYMid meet">
          <circle cx="100" cy="100" fill="${color}" r="100" />
          <polygon fill="${color}" points="100,250 180,160 20,160"/>
          <text fill="#FFFFFF" font-family="sans-serif" font-size="900%" font-weight="700" text-anchor="middle" x="100" xml:space="preserve" y="125">
          ${markerSign}
          </text>
        </svg>
      </div>
      `,
      className: `${classes.custom_marker}`,
      iconSize: L.point(33, 33, true),
    });
  };

  return (
    <Marker
      position={props.position as L.LatLngExpression}
      icon={createIcon(props.markerSign!, color)}
      eventHandlers={{
        click: () => {
          // Clicking a pin on the map leads to scrolling the correspondent card into view.
          // Also an event listener is set which allows to cancel the highlighting the pin and the card
          // by clicking the area outside the pin
          if (originalId !== "") {
            const browser = detectBrowser();
            const card = document.getElementById(originalId);
            if (mobile) {
              if (browser !== "Firefox") {
                const parent = card?.parentElement;
                parent?.scroll({
                  left: card?.offsetLeft,
                  behavior: "smooth",
                });
              } else {
                card?.scrollIntoView({
                  behavior: "smooth",
                });
              }
            } else {
              const top = card?.offsetTop ? card?.offsetTop - 8 : 0;
              window.scroll({
                top: top,
                behavior: "smooth",
              });
            }

            const clickHandler = (event: MouseEvent) => {
              const pinColor = (event.target as HTMLElement)
                ?.closest(`.${classes.pin}`)
                ?.firstElementChild?.getAttribute("fill");
              if (!pinColor || pinColor === highlightedColor) {
                if (props.handler) props.handler("");
              }
            };
            document.body.addEventListener("click", clickHandler);

            if (props.handler) props.handler(originalId);
            return () =>
              document.body.removeEventListener("click", clickHandler);
          }
        },
        mouseover: (event) => event.target.openPopup(),
        mouseout: (event) => event.target.closePopup(),
      }}
    >
      <Popup>{props.shortDescription}</Popup>
    </Marker>
  );
}
