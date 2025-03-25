import { useState, useEffect, useContext, useReducer } from "react";
import L from "leaflet";
import { DataContext, DataContextType, RealtyObject } from "../common.tsx";
import { Header } from "../Header/Header";
import { TopMenu } from "../TopMenu/TopMenu";
import { LeftMenu } from "../LeftMenu/LeftMenu";
import { Map } from "../Map/Map";
import { Footer } from "../Footer/Footer";
import classes from "./Home.module.css";

// Default coordinates encompasses the Dubna town
const initialSouthWestCorner = L.latLng(56.724, 37.12); // L.latLng(56.724, 37.12);
const initialNorthEastCorner = L.latLng(56.77, 37.253); // L.latLng(56.77, 37.253);
const initialBounds: L.LatLngBoundsExpression = L.latLngBounds(
  initialSouthWestCorner,
  initialNorthEastCorner
);

// Function to filter realty objects depending on the "for sale/rent"
// buttons and the chosen select option
const filterRealtyObjects = (
  realtyAction: string,
  realtyType: string,
  objects: RealtyObject[]
): RealtyObject[] => {
  let objectsToShow: RealtyObject[] = [];
  try {
    if (objects) {
      // realtyAction === "all" means that buttons "buy" or "rent" are not clicked
      if (realtyAction === "all") {
        // realtyType === "all" means that the (default) option "all objects" is chosen
        if (realtyType === "all") {
          // By default all the realty objects will be shown (case of the first load page)
          objectsToShow = objects;
        } else {
          // If an option was chosen, objects of correspondent realty type will be shown
          objectsToShow = objects.filter(
            (item) => item.infoType === realtyType
          );
        }
      }
      // Case of the "buy" button clicked
      if (realtyAction === "forSale") {
        if (realtyType === "all") {
          // Case of the default option "all objects" -- all the objects for sale will be shown
          objectsToShow = objects.filter((item) => item.type === "forSale");
        } else {
          // If the user chosed an option
          objectsToShow = objects.filter(
            (item) => item.infoType === realtyType && item.type === "forSale"
          );
        }
      }
      if (realtyAction === "forRent") {
        if (realtyType === "all") {
          objectsToShow = objects.filter((item) => item.type === "forRent");
        } else {
          objectsToShow = objects.filter(
            (item) => item.infoType === realtyType && item.type === "forRent"
          );
        }
      }
    } else {
      return [];
    }
  } catch (e: any) {
    console.log(e.message);
  }
  return objectsToShow;
};

const mapBoundsFromPinPositions = (
  objects: RealtyObject[] | null
): L.LatLngBoundsExpression => {
  if (objects) {
    if (objects.length === 0) {
      return initialBounds;
    } else if (objects.length === 1) {
      const southWestCorner = L.latLng(
        objects[0].position[0] - 0.01, //  широта
        objects[0].position[1] - 0.01 //  долгота
      );
      const northEastCorner = L.latLng(
        objects[0].position[0] + 0.01,
        objects[0].position[1] + 0.01
      );
      const bounds: L.LatLngBoundsExpression = L.latLngBounds(
        southWestCorner,
        northEastCorner
      );
      return bounds;
    } else {
      // finding the most southern and northern coordinates
      objects.sort((a, b) => a.position[0] - b.position[0]);
      const mostSouthern = objects[0].position[0] - 0.01;
      const mostNorthern = objects[objects.length - 1].position[0] + 0.001;
      // finding the most eastern and western coordinates
      objects.sort((a, b) => a.position[1] - b.position[1]);
      const mostEastern = objects[objects.length - 1].position[1];
      const mostWestern = objects[0].position[1];

      const southWestCorner = L.latLng(mostSouthern, mostWestern);
      const northEastCorner = L.latLng(mostNorthern, mostEastern);
      const bounds: L.LatLngBoundsExpression = L.latLngBounds(
        southWestCorner,
        northEastCorner
      );
      return bounds;
    }
  } else {
    return initialBounds;
  }
};

type Action = {
  type: string;
  payload?: {
    bounds?: L.LatLngBoundsExpression;
    show?: string;
    selectedOption?: string;
    availableTypes?: Set<string> | null;
    availableObjects?: RealtyObject[] | null;
    availableSaleTypes?: Set<string> | null;
    availableRentTypes?: Set<string> | null;
    buyButtonState?: string;
    buyButtonHighlighted?: string;
    rentButtonState?: string;
    rentButtonHighlighted?: string;
  };
};

type State = {
  bounds?: L.LatLngBoundsExpression;
  show: string;
  selectedOption: string;
  availableTypes: Set<string> | null;
  availableObjects: RealtyObject[] | null;
  availableSaleTypes: Set<string> | null;
  availableRentTypes: Set<string> | null;
  buyButtonState?: string;
  buyButtonHighlighted?: string;
  rentButtonState?: string;
  rentButtonHighlighted?: string;
};

const reducer = (state: State, action: Action): State => {
  const { type, payload } = action;
  switch (type) {
    case "map": {
      return {
        ...state,
        bounds: payload?.bounds ? payload?.bounds : state.bounds,
      };
    }
    case "initial": {
      return {
        ...state,
        availableObjects: payload?.availableObjects
          ? payload?.availableObjects
          : state.availableObjects,
        availableTypes: payload?.availableTypes
          ? payload?.availableTypes
          : state.availableTypes,
        availableSaleTypes: payload?.availableSaleTypes
          ? payload?.availableSaleTypes
          : state.availableSaleTypes,
        availableRentTypes: payload?.availableRentTypes
          ? payload?.availableRentTypes
          : state.availableRentTypes,
        buyButtonState: payload?.buyButtonState
          ? payload?.buyButtonState
          : state.buyButtonState,
        rentButtonState: payload?.rentButtonState
          ? payload?.rentButtonState
          : state.rentButtonState,
        bounds: payload?.bounds ? payload?.bounds : state.bounds,
      };
    }
    case "buy/rent": {
      return {
        ...state,
        selectedOption: payload?.selectedOption
          ? payload?.selectedOption
          : state.selectedOption,
        availableTypes: payload?.availableTypes
          ? payload?.availableTypes
          : state.availableTypes,
        availableObjects: payload?.availableObjects
          ? payload?.availableObjects
          : state.availableObjects,
        buyButtonHighlighted: payload?.buyButtonHighlighted
          ? payload?.buyButtonHighlighted
          : state.buyButtonHighlighted,
        rentButtonHighlighted: payload?.rentButtonHighlighted
          ? payload?.rentButtonHighlighted
          : state.rentButtonHighlighted,
        show: payload?.show ? payload?.show : state.show,
        bounds: payload?.bounds ? payload?.bounds : state.bounds,
      };
    }
    case "select": {
      return {
        ...state,
        availableObjects: payload?.availableObjects
          ? payload?.availableObjects
          : state.availableObjects,
        selectedOption: payload?.selectedOption
          ? payload?.selectedOption
          : state.selectedOption,
        bounds: payload?.bounds ? payload?.bounds : state.bounds,
      };
    }
    default:
      return { ...state };
  }
};

export function Home() {
  const { data } = useContext(DataContext) as DataContextType;
  const [currentObjectId, setCurrentObjectId] = useState("");

  const init: State = {
    show: "all", // all the realty objects are shown on the map
    selectedOption: "all", // the default selector option "все объекты"
    availableTypes: null,
    availableObjects: null,
    availableSaleTypes: null,
    availableRentTypes: null,
    //bounds: initialBounds,
  };

  const [state, dispatch] = useReducer(reducer, init);

  // setting the data to show on the map, for the buy/rent buttons,
  // and for the realty type selector
  useEffect(() => {
    if (data) {
      const allAvailableTypes: Set<string> = new Set();
      data?.forEach((item) => {
        allAvailableTypes.add(item.infoType);
      });

      const availableSaleTypes: Set<string> = new Set();
      data?.forEach((item) => {
        if (item.type === "forSale") availableSaleTypes.add(item.infoType);
      });

      const availableRentTypes: Set<string> = new Set();
      data?.forEach((item) => {
        if (item.type === "forRent") availableRentTypes.add(item.infoType);
      });

      // Rent or Buy button is inactive if there are no objects of rent or buy type
      const sale = data?.findIndex((item) => item.type === "forSale");
      const rent = data?.findIndex((item) => item.type === "forRent");

      const action = {
        type: "initial",
        payload: {
          availableObjects: data,
          availableTypes: allAvailableTypes,
          availableSaleTypes,
          availableRentTypes,
          buyButtonState: sale < 0 ? "inactive" : undefined,
          rentButtonState: rent < 0 ? "inactive" : undefined,
          bounds: mapBoundsFromPinPositions(data),
        },
      };
      dispatch(action);
    }
  }, [data]);

  // selected realty object will be shown on the center of the map
  useEffect(() => {
    const el = state.availableObjects?.find(
      (item) => item.id === currentObjectId
    );
    if (el) {
      const action = {
        type: "map",
        payload: {
          bounds: mapBoundsFromPinPositions([el]),
        },
      };
      dispatch(action);
    }
  }, [currentObjectId]);

  const buyClick = () => {
    // Preparing all the objects for sale to show
    const realtyObjectsToShow = data
      ? filterRealtyObjects("forSale", "all", data)
      : [];
    const action = {
      type: "buy/rent",
      payload: {
        selectedOption: "all",
        availableTypes: state.availableSaleTypes,
        availableObjects: realtyObjectsToShow,
        rentButtonHighlighted: "",
        buyButtonHighlighted: "highlighted",
        bounds: realtyObjectsToShow
          ? mapBoundsFromPinPositions(realtyObjectsToShow)
          : state.bounds,
        show: "forSale",
      },
    };
    dispatch(action);
  };

  const rentClick = () => {
    const realtyObjectsToShow = data
      ? filterRealtyObjects("forRent", "all", data)
      : [];

    const action = {
      type: "buy/rent",
      payload: {
        selectedOption: "all",
        availableTypes: state.availableRentTypes,
        availableObjects: realtyObjectsToShow,
        buyButtonHighlighted: "",
        rentButtonHighlighted: "highlighted",
        bounds: realtyObjectsToShow
          ? mapBoundsFromPinPositions(realtyObjectsToShow)
          : state.bounds,
        show: "forRent",
      },
    };
    dispatch(action);
  };

  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const chosenType = event.target.value;
    const realtyObjectsToShow = data
      ? filterRealtyObjects(state.show, chosenType, data)
      : [];

    const action = {
      type: "select",
      payload: {
        availableObjects: realtyObjectsToShow,
        selectedOption: chosenType,
        bounds: realtyObjectsToShow
          ? mapBoundsFromPinPositions(realtyObjectsToShow)
          : state.bounds,
      },
    };
    dispatch(action);
  };

  return (
    <>
      <Header buttonColorMode="light" />

      <TopMenu
        buttonColorMode="dark"
        buyFunc={buyClick}
        buyState={state.buyButtonState}
        buyHighlighted={state.buyButtonHighlighted}
        rentFunc={rentClick}
        rentState={state.rentButtonState}
        rentHighlighted={state.rentButtonHighlighted}
        option={state.selectedOption}
        selectFunc={selectChange}
        availableTypes={state.availableTypes}
      />

      <div className={classes.content_wrapper}>
        <LeftMenu
          currentObjectId={currentObjectId}
          func={setCurrentObjectId}
          availableObjects={state.availableObjects}
        />
        <Map
          bounds={state.bounds ? state.bounds : initialBounds}
          currentObjectId={currentObjectId}
          availableObjects={state.availableObjects}
          func={setCurrentObjectId}
        />
      </div>

      <Footer>Дубна 2025</Footer>
    </>
  );
}
