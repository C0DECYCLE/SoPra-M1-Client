import React from "react";
import Header from "./components/views/Header";
import AppRouter from "./components/routing/routers/AppRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div>
      <Header height="100" />
      <AppRouter />
      <ToastContainer position="top-center" theme="colored" />
    </div>
  );
};

export default App;
