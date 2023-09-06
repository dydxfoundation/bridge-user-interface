import "./polyfills";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { store } from "@/state/_store";

import { ErrorBoundary } from "./components/ErrorBoundary";

import "./index.css";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ErrorBoundary>
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  </ErrorBoundary>
);
