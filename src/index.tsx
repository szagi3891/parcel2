import React from "react";
import { render } from "react-dom";
import { App } from "./App";

render(
    <div>
        <h1>Hello Worldttdd</h1>
        <App />
    </div>
, document.getElementById("root"));

//@ts-expect-error
if (module.hot) {
    //@ts-expect-error
    module.hot.accept();
}