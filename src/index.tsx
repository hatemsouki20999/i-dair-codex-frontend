import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store, { AppDispatch } from "./redux/store/store";
import { Provider, useDispatch } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { getAppClientId } from "./services/global.services";
import BigLoader from "./components/Loader/bigLoader";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const theme = createTheme();
const isLocal = process.env.REACT_APP_IS_LOCAL === "True";
const defaultClientId =
  "211024496583-p73rd21p3hs3neeoctf5s5e6ogd0scrr.apps.googleusercontent.com";
const AppWrapper = () => {
  const [googleClientId, setGoogleClientId] = useState("");
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    if (!isLocal) {
      dispatch(getAppClientId())
        .then((data) => {
          setGoogleClientId(data.payload.data.client_id);
        })
        .catch((error) => {
          console.error("Error fetching Google Client ID:", error);
        });
    } else {
      setGoogleClientId(defaultClientId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!googleClientId) {
    return <BigLoader />;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
};

root.render(
  <Provider store={store}>
    <AppWrapper />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
