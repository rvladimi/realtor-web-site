import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../Button/Button.tsx";
import { Form } from "../Form/Form.tsx";
import classes from "./Admin.module.css";
import {
  correspondence,
  RealtyObject,
  RealtyType,
  DataContext,
  DataContextType,
} from "../common.tsx";

function ListItem({ item }: { item: RealtyObject }) {
  const [deleted, setDeleted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { data, setData } = useContext(DataContext) as DataContextType;

  const clickRemove = async () => {
    const deletionConfirmed = confirm("Подтвердите удаление");
    if (deletionConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:5050/record/${item.id}`,
          { method: "DELETE" }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          setDeleted(true);
          const deletedId = data?.findIndex((el) => el.id === item.id);
          if (deletedId !== undefined && deletedId !== -1 && data) {
            data.splice(deletedId, 1);
            const newData = [...data];
            setData(newData);
          }
        }
      } catch (error) {
        console.error("A problem occurred with the fetch operation: ", error);
      }
    }
  };

  const clickChange = () => {
    setShowForm(true);
  };

  return (
    <div className={deleted ? classes.deleted : classes.normal}>
      <div className={classes.list_item_info}>
        <div className={classes.list_info_area}>
          <div>
            <span>
              {item.infoDetails?.numberOfRooms
                ? `${correspondence(item.infoType)} ` +
                  item.infoDetails.numberOfRooms +
                  "-комн."
                : `${correspondence(item.infoType)}`}
            </span>
          </div>
          <div>{item.infoAddress}</div>
        </div>
        <div className={classes.list_buttons_area}>
          <button onClick={clickRemove}>удалить</button>
          <button onClick={clickChange}>изменить</button>
        </div>
      </div>

      {showForm && <Form objectData={item} showFormFunc={setShowForm} />}
    </div>
  );
}

export function Admin() {
  const [realty, setRealty] = useState<RealtyType>("choice");
  const [showForm, setShowForm] = useState(false);
  const { data } = useContext(DataContext) as DataContextType;
  const navigate = useNavigate();

  useEffect(() => {
    setShowForm(!showForm);
  }, [realty]);

  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRealty(event.target.value as RealtyType);
    setShowForm(false);
  };

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.main_page_button}>
          <Button colorMode="light" onClick={() => navigate("/")}>
            на главную
          </Button>
        </div>
        <div className={classes.inner_wrapper}>
          {data && (
            <>
              <div className={`${classes.header} ${classes.list_header}`}>
                список объявлений
              </div>
              <div className={classes.list}>
                {data.map((item, index) => {
                  return <ListItem key={index} item={item} />;
                })}
              </div>
            </>
          )}

          <div className={classes.add_ad}>
            <div className={`${classes.header} ${classes.add_header}`}>
              добавить объявление
            </div>

            <div className={classes.select_container}>
              <select
                className={classes.realty_select}
                value={realty}
                onChange={selectChange}
              >
                <option value="choice">тип недвижимости</option>
                <option value="flat">квартира</option>
                <option value="townhouse">таунхаус</option>
                <option value="room">комната</option>
                <option value="cottage">дом</option>
                <option value="dacha">дача</option>
                <option value="land">земля</option>
                <option value="garage">гараж</option>
                <option value="commercial">коммерческая</option>
              </select>
            </div>

            {showForm && realty !== "choice" && (
              <Form
                objectData={{ infoType: realty } as RealtyObject}
                showFormFunc={setShowForm}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
