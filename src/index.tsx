import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AppWithTheme } from "./App";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CssBaseline />
        <AppWithTheme />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);