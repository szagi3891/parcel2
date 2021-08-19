import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import { Jumbo } from "./jumbo/Jumbo";
import { Main } from "./Main";
import { Walizka } from "./walizka/Walizka";

type TabType = 'tab1' | 'tab2' | 'jumbo';

class Menu {
    @observable tab: TabType = 'tab1';

    onChange = (id: TabType) => {
        this.tab = id;
    }
}

interface ButtonPropsType {
    id: TabType,
    label: string,
    onClick: (id: TabType) => void,
}

const Button = observer((props: ButtonPropsType) => {
    const { id, label, onClick } = props;

    const buttonOnClick = () => {
        onClick(id);
    };

    return (
        <button onClick={buttonOnClick}>
            { label }
        </button>
    )
});

interface RenderContentPropsType {
    tabMenu: Menu
}

const RenderContent = observer((props: RenderContentPropsType) => {
    const { tabMenu } = props;

    if (tabMenu.tab === 'tab1') {
        return <Main />;
    }

    if (tabMenu.tab === 'tab2') {
        return <Walizka />;
    }

    if (tabMenu.tab === 'jumbo') {
        return <Jumbo />;
    }

    return <div>Default</div>;
});

export const App = observer(() => {

    const [ tabMenu ] = React.useState(() => new Menu());

    return (
        <div>
            <div>
                <Button
                    id="tab1"
                    onClick={tabMenu.onChange}
                    label="Label1"
                />
                <Button
                    id="tab2"
                    onClick={tabMenu.onChange}
                    label="Label2"
                />
                <Button
                    id="jumbo"
                    onClick={tabMenu.onChange}
                    label="Jumbo"
                />
            </div>
            <RenderContent tabMenu={tabMenu} />
        </div>
    )
});
