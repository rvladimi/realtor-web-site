/* The page design follows the idea that 1) there should be an immediate reaction on every user action;
 2) nothing should change suddenly for the user to realize what is happening.
 
 To implement the second the CSS transition height is used, which results in smooth accordeons 
 in case of every change of the form height. So all the code logic is built around that
 */

import { useState, useEffect, useRef, useReducer, useContext } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { RealtyObject, DataContext, DataContextType } from "../common.tsx";
import Dots from "react-activity/dist/Dots";
import "react-activity/dist/Dots.css";
import classes from "./Form.module.css";

const provider = new OpenStreetMapProvider();

type Props = {
  objectData: RealtyObject;
  showFormFunc: (p: boolean) => void;
};

type FileWithSrc = File & {
  src?: string;
};

type Action = {
  type: string;
  payload?: {
    initialHeight?: number;
    formHeight?: number;
    warning?: string;
    questionHeight?: number;
    questionShow?: boolean;
    addressAdditionCheck?: boolean;
    files?: FileWithSrc[] | null;
    showFiles?: boolean;
  };
};

type State = {
  id?: string;
  initialHeight: number;
  formHeight: number;
  warning?: string;
  questionHeight: number;
  questionShow?: boolean;
  addressAdditionCheck?: boolean;
  files?: FileWithSrc[] | null;
  showFiles?: boolean;
};

const reducer = (state: State, action: Action): State => {
  const { type, payload } = action;
  switch (type) {
    case "initial": {
      return {
        ...state,
        initialHeight: payload?.initialHeight
          ? payload?.initialHeight
          : state.initialHeight,
        formHeight: payload?.formHeight
          ? payload?.formHeight
          : state.formHeight,
        questionHeight: payload?.questionHeight
          ? payload?.questionHeight
          : state.questionHeight,
      };
    }
    case "formHeight": {
      return {
        ...state,
        formHeight: payload?.formHeight
          ? payload?.formHeight
          : state.formHeight,
      };
    }
    case "warning": {
      return {
        ...state,
        warning: payload?.warning,
      };
    }
    case "address addition": {
      return {
        ...state,
        addressAdditionCheck: payload?.addressAdditionCheck,
        warning: payload?.warning,
      };
    }
    case "question": {
      return {
        ...state,
        questionShow: payload?.questionShow,
      };
    }
    case "files": {
      return {
        ...state,
        files: payload?.files,
        showFiles: payload?.showFiles,
      };
    }
    default:
      return { ...state };
  }
};

export const Form = ({ objectData, showFormFunc }: Props) => {
  const { setData } = useContext(DataContext) as DataContextType;
  const [addressWarning, setAddressWarning] = useState("");
  const [addressError, setAddressError] = useState("");
  const [latitudeFilled, setLatitudeFilled] = useState(false);
  const [longitudeFilled, setLongitudeFilled] = useState(false);
  const [latitudeWarning, setLatitudeWarning] = useState("");
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [descriptionError, setDescriptionError] = useState("");
  const [shortDescriptionError, setShortDescriptionError] = useState("");

  const formRef = useRef<HTMLDivElement>(null);
  const addressWarningRef = useRef<HTMLInputElement>(null);
  const warningRef = useRef<HTMLInputElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const latRef = useRef<HTMLInputElement>(null);
  const lonRef = useRef<HTMLInputElement>(null);
  const savedImagesRef = useRef<HTMLDivElement>(null);
  const newImagesRef = useRef<HTMLDivElement>(null);

  const init: State = {
    id: objectData.id,
    initialHeight: 0,
    formHeight: 0,
    warning: "",
    questionHeight: 0,
    questionShow: false,
    addressAdditionCheck: true,
    files: null,
    showFiles: false,
  };
  // warnings/explanations and files are displayed along with
  // changing the height of the form, so it's a usecase for a reducer
  const [state, dispatch] = useReducer(reducer, init);

  useEffect(() => {
    const formWrapper = formRef.current;

    const question = questionRef.current;
    if (formWrapper && question) {
      const action = {
        type: "initial",
        payload: {
          initialHeight: formWrapper.scrollHeight,
          formHeight: formWrapper.scrollHeight,
          questionHeight: question.scrollHeight,
        },
      };
      dispatch(action);
    }
    if (objectData.position) {
      setLatitudeFilled(true);
      setLongitudeFilled(true);
    }

    const funcStart = () => {
      formWrapper?.removeEventListener("transitionstart", funcStart);
      const buttons =
        formWrapper?.previousElementSibling?.querySelectorAll("button");
      if (buttons) {
        for (const item of buttons) {
          item.setAttribute("disabled", "");
        }
      }
    };

    formWrapper?.addEventListener("transitionstart", funcStart);

    const funcEnd = () => {
      formWrapper?.removeEventListener("transitionend", funcEnd);
      const buttons =
        formWrapper?.previousElementSibling?.querySelectorAll("button");
      if (buttons) {
        for (const item of buttons) {
          item.removeAttribute("disabled");
        }
      }
      formWrapper?.previousElementSibling?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    formWrapper?.addEventListener("transitionend", funcEnd);
  }, []);

  useEffect(() => {
    const warningAriaHeight = warningRef.current?.scrollHeight;
    const warningHeight = warningAriaHeight ? warningAriaHeight : 0;

    const questionAriaHeight = questionRef.current?.scrollHeight;
    const questionHeight = questionAriaHeight ? questionAriaHeight : 0;

    const filesAriaHeight = newImagesRef.current?.scrollHeight;
    const filesHeight = filesAriaHeight ? filesAriaHeight : 0;

    let totalHeight = state.initialHeight;
    if (state.warning) totalHeight += warningHeight;
    if (state.questionShow) totalHeight += questionHeight;
    if (state.showFiles) totalHeight += filesHeight;

    const action = {
      type: "formHeight",
      payload: {
        formHeight: totalHeight,
      },
    };
    dispatch(action);
  }, [state.warning, state.questionShow, state.showFiles]);

  const formId = objectData.id ? objectData.id : "newAd";

  const handleAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Checking correctness of the inserted  objectData
    setLatitudeFilled(false);
    setLongitudeFilled(false);
    if (addressError) setAddressError("");
    const reg = /([+?_|^$#@%&><!~*}{\][;:=])|([a-zA-Z])/g;
    const value = event.target.value;
    const check = reg.test(value);
    if (check) setAddressError("адрес содержит недопустимые символы");

    const action: Action = {
      type: "warning",
      payload: {
        warning: "",
      },
    };
    dispatch(action);
  };

  const checkDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (descriptionError) setDescriptionError("");
    const reg = /[+#@&><=}{\][]/g;
    const value = event.target.value;
    const check = reg.test(value);
    if (check) setDescriptionError("описание содержит недопустимые символы");
  };

  const checkShortDescription = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (shortDescriptionError) setShortDescriptionError("");
    const reg = /[+#@&><=}{\][]/g;
    const value = event.target.value;
    const check = reg.test(value);
    if (check)
      setShortDescriptionError("описание содержит недопустимые символы");
  };

  const handleAddressAdditionCheck = () => {
    // If there is a warning for now, it's related to previous attempt
    // and should disappear
    const action: Action = {
      type: "address addition",
      payload: {
        addressAdditionCheck: !state.addressAdditionCheck,
      },
    };
    if (state.warning) {
      if (action.payload) {
        action.payload.warning = "";
      }
    }
    dispatch(action);
  };

  const findPosition = async () => {
    // A new address is assumed to have been inserted when user click the button
    setLatitudeWarning("");
    const address = addressWarningRef.current;
    if (address?.value) {
      setActivityIndicator(true);
      const addition = " Дубна, Московская область, Россия";
      const enteredAddress = state.addressAdditionCheck
        ? address.value + addition
        : address.value;

      const searchResult = await provider.search({ query: enteredAddress });
      setActivityIndicator(false);

      let text;

      if (searchResult[0]?.raw) {
        const latitude = latRef.current;
        const longitude = lonRef.current;
        if (latitude && longitude) {
          latitude.value = searchResult[0].raw.lat;
          longitude.value = searchResult[0].raw.lon;
          setLatitudeFilled(true);
          setLongitudeFilled(true);
        }
        const addressResult = searchResult[0].raw.display_name;

        if (!addressResult.includes("Московская область")) {
          text = addressResult;
        } else {
          text = "";
        }
      } else {
        text =
          "Не удалось определить координаты. Уточните адрес и повторите попытку, либо введите вручную";
      }

      const action = {
        type: "warning",
        payload: {
          warning: text,
        },
      };
      dispatch(action);
    } else {
      setAddressWarning("Введите адрес");
    }
  };

  const latitudeCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length >= 2) {
      if (parseFloat(value) < 54) {
        setLatitudeWarning(" южнее Московской области. Долгота вместо широты?");
      } else {
        setLatitudeWarning("");
        setLatitudeFilled(true);
      }
    } else {
      setLatitudeWarning("");
      setLatitudeFilled(false);
    }
  };

  const longitudeCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length >= 2) {
      setLongitudeFilled(true);
    } else {
      setLongitudeFilled(false);
    }
  };

  let newDataPromise: Promise<RealtyObject[] | string>;

  async function formSubmit(event: React.FormEvent) {
    event.preventDefault();
    // On clicking the "save" button the form area starts to diminish at first
    const formWrapper = formRef.current;
    formWrapper?.addEventListener("transitionend", func);
    if (formWrapper) formWrapper.style.height = "0px";
    // Simultaneously the new or changed ad is sent to the server
    const sendingResult = await sendData();

    if (sendingResult === "ok") {
      // Getting the data back from the server in order to update "data" in the DataContext.
      // Id of a new ad is unknown, so one has to get all the data from server
      // and then create completely new "data" instead of just updating the data.
      // The final result is like reloading the web page in fact
      newDataPromise = getNewData();
    } else {
      // If the server's response is not ok, the user will be informed
      alert(
        `Что-то пошло не так. Если проблема с интернетом, попробуйте еще раз позже. ${sendingResult}`
      );
    }

    // After the area completely disappears the callback "func" is called
    async function func() {
      newDataPromise
        ?.then((result) => {
          // Normally newData is an array, in case of errors it's a string
          if (Array.isArray(result)) {
            showFormFunc(false);
            setData(result);
          } else {
            // If there is an error, the data will not be changed.
            // Nevetheless it may have saved on the server. We should warn the user anyway
            alert(
              `Что-то пошло не так, попробуйте обновить страницу ${result}`
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });

      formWrapper?.removeEventListener("transitionend", func);
    }

    async function sendData(): Promise<string> {
      const formData = new FormData(event.target as HTMLFormElement);
      formData.append("infoType", objectData.infoType);
      if (state.addressAdditionCheck) {
        formData.append("addressExtension", "Московская обл, г. Дубна, ");
      }
      if (objectData?.id) formData.append("id", objectData.id);

      const savedFilesArea = savedImagesRef.current;
      const inputs = savedFilesArea?.querySelectorAll("input");
      const filesToDelete: (string | null)[] = [];
      const filesToSave: (string | null)[] = [];
      if (inputs?.length) {
        for (const item of inputs) {
          if (item.checked) {
            filesToDelete.push(item.getAttribute("data-src"));
          } else {
            filesToSave.push(item.getAttribute("data-src"));
          }
        }
        formData.append("filesToDelete", JSON.stringify(filesToDelete));
      }

      try {
        const result = await fetch(`https://mysite.com/record/`, {
          method: "POST",
          body: formData,
        });
        if (result.ok) {
          return "ok";
        } else {
          return result.statusText;
        }
      } catch (err) {
        return (err as Error).toString();
      }
    }

    async function getNewData(): Promise<RealtyObject[] | string> {
      try {
        const response = await fetch("https://mysite.com/record");
        if (response.ok) {
          const arr = await response.json();
          arr.forEach((item: any) => {
            item.id = item._id;
            delete item._id;
          });
          return arr;
        } else {
          //throw new Error(`HTTP error! status: ${response.status}`);
          return `HTTP error status ${response.status}`;
        }
      } catch (error) {
        return (error as Error).toString();
      }
    }
  }

  const handleCancel = async () => {
    const func = () => {
      formWrapper?.removeEventListener("transitionend", func);
      showFormFunc(false);
    };

    const formWrapper = formRef.current;
    formWrapper?.addEventListener("transitionend", func);
    if (formWrapper) formWrapper.style.height = "0px";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const pictures: FileWithSrc[] = [...e.target.files];
      for (const item of pictures) {
        if (item.type.startsWith("image/")) {
          item.src = URL.createObjectURL(item);
        } else {
          alert("All the chosen files must be images!");
          e.target.value = "";
          break;
        }
      }
      if (e.target.value !== "") {
        const action = {
          type: "files",
          payload: {
            files: pictures,
            showFiles: true,
          },
        };
        dispatch(action);
      }
    }
  };

  const handleQuestion = () => {
    if (!state.questionShow) {
      const action = {
        type: "question",
        payload: {
          questionShow: true,
        },
      };
      dispatch(action);
    }
  };

  return (
    <div
      className={classes.wrapper}
      ref={formRef}
      style={{
        height: state.formHeight + "px",
      }}
    >
      <form id={formId} onSubmit={formSubmit} encType="multipart/form-data" />
      <div className={classes.sale_rent}>
        <label>
          Продажа
          <input
            type="radio"
            name="type"
            value="forSale"
            form={formId}
            defaultChecked={true}
          />
        </label>
        <label>
          Аренда
          <input type="radio" name="type" value="forRent" form={formId} />
        </label>
      </div>
      <label>
        Цена (руб)
        <input
          type="number"
          name="infoPrice"
          defaultValue={objectData.infoPrice || ""}
          form={formId}
        />
      </label>
      <div>
        <label className={addressWarning ? classes.warning : ""}>
          {addressWarning ? addressWarning : "Адрес"}
          <input
            ref={addressWarningRef}
            type="search"
            name="infoAddress"
            defaultValue={objectData.infoAddress || ""}
            onBlur={() => setAddressWarning("")}
            onChange={handleAddress}
            size={40}
            form={formId}
          />
        </label>
        <button className={classes.position_button} onClick={findPosition}>
          Найти широту и долготу
        </button>

        {addressError && (
          <div className={`${classes.warning} ${classes.error}`}>
            {addressError}
          </div>
        )}

        <div className={classes.address_addition}>
          <input
            type="checkbox"
            checked={state.addressAdditionCheck}
            onChange={handleAddressAdditionCheck}
          />
          <span className={classes.notification}>
            добавить к адресу{" "}
            <span className={classes.it}>
              "Дубна, Московская область, Россия"
            </span>
          </span>
        </div>

        <div className={classes.notification}>
          Если точный адрес отсутствует, введите широту и долготу вручную
          <button onClick={handleQuestion}>&#10067;</button>
          <div
            ref={questionRef}
            className={classes.question}
            style={{
              height: state.questionShow ? state.questionHeight + "px" : "0px",
            }}
          >
            Получить их можно на карте Яндекс, кликнув правой кнопкой мыши в
            нужном месте карты, далее пункт "что здесь?", далее "скопировать
            координаты"
          </div>
        </div>

        <div
          ref={warningRef}
          className={`${classes.address_fault} ${classes.notification} ${classes.warning}`}
        >
          {state.warning}
        </div>
      </div>

      {activityIndicator && <Dots />}
      <div>
        <label>
          {latitudeFilled && (
            <span className={classes.green_check}>&#9989;</span>
          )}{" "}
          Широта
          <input
            ref={latRef}
            type="number"
            step="any"
            name="latitude"
            placeholder={objectData.position ? "" : "56.XXXXXXX"}
            defaultValue={objectData.position ? objectData.position[0] : ""}
            onChange={latitudeCheck}
            form={formId}
            required
          />
        </label>
        {latitudeWarning && (
          <span className={classes.warning}>{latitudeWarning}</span>
        )}
      </div>
      <label>
        {longitudeFilled && (
          <span className={classes.green_check}>&#9989;</span>
        )}{" "}
        Долгота
        <input
          ref={lonRef}
          type="number"
          step="any"
          name="longitude"
          placeholder={objectData.position ? "" : "37.XXXXXXX"}
          defaultValue={objectData.position ? objectData.position[1] : ""}
          onChange={longitudeCheck}
          form={formId}
          required
        />
      </label>

      {objectData.infoType !== "flat" &&
        objectData.infoType !== "townhouse" &&
        objectData.infoType !== "cottage" && (
          <label>
            Площадь
            <input
              type="text"
              name="infoArea"
              defaultValue={objectData.infoArea || ""}
              form={formId}
            />
          </label>
        )}
      {(objectData.infoType === "flat" ||
        objectData.infoType === "townhouse" ||
        objectData.infoType === "cottage") && (
        <>
          <label>
            Количество комнат
            <input
              type="number"
              step="1"
              name="numberOfRooms"
              defaultValue={objectData.infoDetails?.numberOfRooms || ""}
              form={formId}
            />
          </label>

          <label>
            Общая площадь (
            {
              <span className={classes.notification}>
                м<sup>2</sup>
              </span>
            }
            )
            <input
              type="number"
              step="0.1"
              name="totalArea"
              defaultValue={objectData.infoDetails?.totalArea || ""}
              form={formId}
            />
          </label>

          <label>
            Жилая площадь (
            {
              <span className={classes.notification}>
                м<sup>2</sup>
              </span>
            }
            )
            <input
              type="number"
              step="0.1"
              name="residentialArea"
              defaultValue={objectData.infoDetails?.residentialArea || ""}
              form={formId}
            />
          </label>

          <label>
            Площадь кухни (
            {
              <span className={classes.notification}>
                м<sup>2</sup>
              </span>
            }
            )
            <input
              type="number"
              step="0.1"
              name="kitchenArea"
              defaultValue={objectData.infoDetails?.kitchenArea || ""}
              form={formId}
            />
          </label>

          {objectData.infoType === "flat" && (
            <label>
              Этаж
              <input
                type="number"
                step="1"
                name="floor"
                defaultValue={objectData.infoDetails?.floor || ""}
                form={formId}
              />
            </label>
          )}

          <label>
            Всего этажей
            <input
              type="number"
              step="1"
              name="totalFloors"
              defaultValue={objectData.infoDetails?.totalFloors || ""}
              form={formId}
            />
          </label>
        </>
      )}
      {(objectData.infoType === "townhouse" ||
        objectData.infoType === "cottage") && (
        <label>
          Площадь участка
          <input
            type="number"
            step="0.1"
            name="landArea"
            defaultValue={objectData.infoDetails?.landArea || ""}
            form={formId}
          />
        </label>
      )}

      <div className={classes.description}>
        <span className={classes.form_label}>Короткое описание (для фото)</span>
        <textarea
          name="shortDescription"
          defaultValue={objectData.shortDescription || ""}
          form={formId}
          rows={3}
          cols={50}
          maxLength={500}
          onChange={checkShortDescription}
        />

        {shortDescriptionError && (
          <div className={`${classes.warning} ${classes.description_error}`}>
            {shortDescriptionError}
          </div>
        )}
      </div>

      <div className={classes.description}>
        <span className={classes.form_label}>Описание</span>
        <textarea
          name="infoDescription"
          defaultValue={objectData.infoDescription || ""}
          form={formId}
          rows={30}
          cols={90}
          maxLength={5000}
          onChange={checkDescription}
        />

        {descriptionError && (
          <div className={`${classes.warning} ${classes.description_error}`}>
            {descriptionError}
          </div>
        )}
      </div>

      <div className={classes.photo}>
        <div className={classes.form_label}>Фото</div>
        <div ref={savedImagesRef}>
          {objectData?.images &&
            objectData.images.map((item, index) => (
              <div className={classes.image_control} key={index}>
                <div className={classes.image_container}>
                  <img src={`https://mysite.com/static/${item}`} />
                </div>
                <input data-src={item} type="checkbox" />
                <span className={classes.photo_info}>удалить</span>
              </div>
            ))}
        </div>

        <div className={classes.input_group}>
          <input
            type="file"
            name="files"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            form={formId}
          />
          <div className={classes.files_area} ref={newImagesRef}>
            {state.files &&
              state.files.map((file, index) => (
                <div className={classes.file} key={index}>
                  <div className={classes.thumbnail}>
                    <img
                      src={file.src}
                      onLoad={async () => {
                        if (file.src) URL.revokeObjectURL(file.src);
                      }}
                    />
                  </div>
                  <div className={classes.photo_info}>
                    {file.name} &nbsp; {(file.size / 1000000).toFixed(2)}Mb
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className={classes.form_buttons}>
        <button type="submit" form={formId}>
          Сохранить
        </button>
        <button onClick={handleCancel}>Отменить</button>
      </div>
    </div>
  );
};
