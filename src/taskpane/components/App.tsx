import * as React from "react";
import { store } from "abe-client";
import App, { AppProps } from ".";
import { Provider } from "react-redux";
const BaseApp: React.FC<AppProps> = () => {
  return(
    <Provider store={store}>
      <App title="Abe Test" />
    </Provider>
  )
  }

export default BaseApp;
