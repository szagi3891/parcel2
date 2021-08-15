import React from "react";
import { render } from "react-dom";
import { App } from "src/App";
// import { fetchGeneral } from "./lib/fetch";

render(
    <div>
        <h1>Program Weroniki i Basi</h1>
        <App />
    </div>
, document.getElementById("root"));

// //@ts-expect-error
// if (module.hot) {
//     //@ts-expect-error
//     module.hot.accept();
// }

// const runMain = async (): Promise<void> => {
//     const result = await fetchGeneral('GET', {
//         url: '/api/sports',
//         timeout: 'default'
//     })
//     // const result = await axios.get('/api/sports');

//     console.info('result', result);
// };

// runMain().catch((err) => {
//     console.error(err);
// })