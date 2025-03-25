import classes from "./Footer.module.css";

export const Footer = (props: { children: string }) => {
  return (
    <div className={classes.footer}>
      <div className={classes.footer_content}>
        <div className={`${classes.osm_link} ${classes.hidden}`}>
          карта &nbsp;
          <a
            href="https://www.openstreetmap.org/about"
            target="_blank"
            rel="noreferrer"
          >
            OpenStreetMap
          </a>
        </div>
        <div>{props.children}</div>
        <div className={classes.osm_link}>
          карта &nbsp;
          <a
            href="https://www.openstreetmap.org/about"
            target="_blank"
            rel="noreferrer"
          >
            OpenStreetMap
          </a>
        </div>
      </div>
    </div>
  );
};
