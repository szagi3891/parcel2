import { action, computed, observable } from "mobx";
import { Fetch } from "./Fetch";
// import ding_src from 'url:./ding.mp3';


export class WalizkaState {
    @observable offsetLeft = 0;
    @observable offsetTop = 0;

    @observable.ref currentHolding: ImageState | null = null;

    @observable.ref allChilds: Array<ImageState>;

    readonly fetch: Fetch;

    constructor(private readonly listSrc: Array<string>) {
        this.allChilds = this.createState(listSrc);
        this.fetch = new Fetch();
    }

    private createState(listSrc: Array<string>): Array<ImageState> {
        return listSrc.map((src, index) => {
            const offsetLeft = 102 * index;     //2 margin
            const offsetTop = 100;
            return new ImageState(this, src, offsetLeft, offsetTop);
        });
    }

    @action onMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
        this.offsetLeft = e.clientX;
        this.offsetTop = e.clientY;

        if (this.currentHolding !== null) {
            this.currentHolding.eventMove(this.offsetLeft, this.offsetTop);
        }
    }

    onMouseUp = () => {
        if (this.currentHolding !== null) {
            this.currentHolding.eventEnd();
            this.currentHolding = null;
        }
    }

    onMouseDown = (current: ImageState) => {
        if (this.currentHolding !== null) {
            this.currentHolding.eventEnd();
            this.currentHolding = null;
        }

        this.currentHolding = current;

        const allChilds = this.allChilds.filter((item) => item !== current);
        allChilds.push(current);

        this.allChilds = allChilds;
    }

    resetAll = () => {
        this.allChilds = this.createState(this.listSrc);
    }
}


interface MouseDragType {
    startLeft: number,
    startTop: number,
    left: number,
    top: number,
}


export class ImageState {
    @observable staticOffsetLeft: number = 0;
    @observable staticOffsetTop: number = 0;

    @observable drag: null | MouseDragType = null;

    constructor(
        private readonly parent: WalizkaState,
        readonly src: string,
        staticOffsetLeft: number,
        staticOffsetTop: number,
    ) {
        this.staticOffsetLeft = staticOffsetLeft;
        this.staticOffsetTop = staticOffsetTop;
    }

    @action onMouseDown = () => {
        this.parent.onMouseDown(this);

        this.drag = {
            startLeft: this.parent.offsetLeft,
            startTop: this.parent.offsetTop,
            left: this.parent.offsetLeft,
            top: this.parent.offsetTop,
        };
    }

    @action eventMove = (left: number, top: number) => {
        if (this.drag === null) {
            return;
        }

        this.drag.left = left;
        this.drag.top = top;
    }

    @computed get offsetLeft(): number {
        if (this.drag === null) {
            return this.staticOffsetLeft;
        }

        return this.staticOffsetLeft + (this.drag.left - this.drag.startLeft);
    }

    @computed get offsetTop(): number {
        if (this.drag === null) {
            return this.staticOffsetTop;
        }

        return this.staticOffsetTop + (this.drag.top - this.drag.startTop);
    }
    
    eventEnd = () => {
        if (this.drag !== null) {
                
            this.staticOffsetLeft = this.offsetLeft;
            this.staticOffsetTop = this.offsetTop;
            this.drag = null;

            // const audio = new Audio(ding_src);
            // audio.play();
        }
    }

    @action reset = () => {
        this.staticOffsetLeft = 0;
        this.staticOffsetTop = 0;
        this.drag = null;
    }
}
