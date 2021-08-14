import React from "react";
import { render } from "react-dom";
import { App } from "src/App";

render(
    <div>
        <h1>Program Weroniki i Basi</h1>
        <App />
    </div>
, document.getElementById("root"));

//@ts-expect-error
if (module.hot) {
    //@ts-expect-error
    module.hot.accept();
}