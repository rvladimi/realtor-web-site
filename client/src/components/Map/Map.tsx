import { useEffect, Dispatch, SetStateAction } from "react";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L, { MarkerCluster } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { CustomMarker } from "../CustomMarker/CustomMarker";
import { correspondence, RealtyObject } from "../common.tsx";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/assets/css/leaflet.css";
import classes from "./Map.module.css";

const SearchField = () => {
  const provider = new OpenStreetMapProvider();
  // @ts-expect-error (official example has the same)
  const searchControl = new GeoSearchControl({
    provider: provider,
  });
  const map = useMap();
  useEffect(() => {
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, []);
  return null;
};

function FitMapBounds(props: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  if (props.bounds) {
    map.fitBounds(props.bounds);
  }
  return null;
}

const createClusterCustomIcon = function (cluster: MarkerCluster) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: `${classes.custom_marker_cluster}`,
    iconSize: L.point(33, 33, true),
  });
};

type Props = {
  bounds: L.LatLngBoundsExpression;
  currentObjectId: string;
  availableObjects: RealtyObject[] | null;
  func: Dispatch<SetStateAction<string>>;
};

export function Map({
  bounds,
  currentObjectId,
  availableObjects,
  func,
}: Props) {
  return (
    <div className={classes.map_scroll}>
      <MapContainer
        className={classes.custom_map_container}
        //bounds={bounds}
        scrollWheelZoom={true}
        attributionControl={false}
      >
        <SearchField />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitMapBounds bounds={bounds} />

        {!currentObjectId && (
          <MarkerClusterGroup
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={80}
            spiderfyOnMaxZoom={true}
          >
            {availableObjects?.map((pin, index) => (
              <CustomMarker
                key={index}
                id={"p" + pin.id}
                position={pin.position}
                markerSign={correspondence(pin.infoType)
                  .slice(0, 1)
                  .toUpperCase()}
                shortDescription={pin.shortDescription}
                currentObjectId={currentObjectId}
                handler={func}
              />
            ))}
          </MarkerClusterGroup>
        )}
        {currentObjectId && (
          <>
            {availableObjects?.map((pin, index) => (
              <CustomMarker
                key={index}
                id={"p" + pin.id}
                position={pin.position}
                markerSign={correspondence(pin.infoType)
                  .slice(0, 1)
                  .toUpperCase()}
                shortDescription={pin.shortDescription}
                currentObjectId={currentObjectId}
                handler={func}
              />
            ))}
          </>
        )}
      </MapContainer>
    </div>
  );
}
