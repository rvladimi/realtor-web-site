import { useState, useRef } from "react";
import classes from "./Password.module.css";

type Props = {
  checkFunc: (p: boolean) => void;
};

export const Password = (props: Props) => {
  const [errorPassword, setErrorPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = async () => {
    const value = inputRef.current ? inputRef.current.value : "";

    const pwd = { password: value };
    try {
      const result = await fetch(`https://mysite.com/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(pwd),
      });
      if (result.status === 200) {
        props.checkFunc(true);
      } else {
        setErrorPassword(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const enterPasswd = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      submit();
    }
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.form_wrapper}>
        <div className={classes.form_wrapper_inner}>
          <span>пароль</span>
          <input
            ref={inputRef}
            type="text"
            name="passwd"
            onKeyDown={enterPasswd}
            onChange={() => setErrorPassword(false)}
          />
          <button onClick={submit}>отправить</button>
        </div>
        {errorPassword && <div className={classes.error}>Неверный пароль</div>}
      </div>
    </div>
  );
};
