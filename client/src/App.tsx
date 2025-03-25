import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Home } from "./components/Home/Home";
import { Admin } from "./components/Admin/Admin";
import { RealtyObjectInfo } from "./components/RealtyObjectInfo/RealtyObjectInfo";
import { Password } from "./components/Password/Password";
import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop";
import {
  DataContext,
  RealtyObject,
  MobileContext,
  raw,
} from "./components/common.tsx";
//import "./App.css";

export function App() {
  const [data, setData] = useState<RealtyObject[] | null>(null);
  const [mobile, setMobile] = useState(false);
  const [passwdCheck, setPasswdCheck] = useState(false);

  // The code below is commented for this web-site to work without a server side.
  // The data ("raw") are taken from the file commom.tsx instead.
  // But the admin page requires a server side
  useEffect(() => {
    // (async () => {
    //   try {
    //     const response = await fetch("http://localhost:5050/record");

    //     if (response.ok) {
    //       const arr = await response.json();
    //       arr.forEach((item: any) => {
    //         item.id = item._id;
    //         delete item._id;
    //       });
    //       setData(arr);
    //     } else {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //   } catch (error) {
    //     console.error("A problem occurred with your fetch operation: ", error);
    //   }
    // })();

    setData(raw);

    const checkMobile = () => {
      if (window.matchMedia("(orientation: portrait)").matches) {
        setMobile(true);
      } else {
        setMobile(false);
      }
    };

    checkMobile();

    window.addEventListener("orientationchange", function () {
      checkMobile();
    });
  }, []);

  return (
    <MobileContext.Provider value={{ mobile, setMobile }}>
      <DataContext.Provider value={{ data, setData }}>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/admin"
              element={
                passwdCheck ? (
                  <Admin />
                ) : (
                  <Password checkFunc={setPasswdCheck} />
                )
              }
            />
            <Route path="/realty-object/:id" element={<RealtyObjectInfo />} />
          </Routes>
        </BrowserRouter>
      </DataContext.Provider>
    </MobileContext.Provider>
  );
}
