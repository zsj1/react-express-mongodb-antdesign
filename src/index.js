import React from "react";
import ReactDom from "react-dom";
import thunk from "redux-thunk";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import App from './app'

import reducers from "./reducer";
import "./config";
import "./index.css";

const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  )
);

// boss genius me msg 4个页面
ReactDom.render(
  <Provider store={store}>
    <BrowserRouter>
      <App></App>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
