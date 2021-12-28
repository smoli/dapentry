export interface IState {
    id:string;
    data:any;
}

class State implements IState {

    private readonly _id:string
    private _data:any

    constructor(id:string, data:any = null) {
        this._id = id;
        this._data = data;
    }

    public get id():string {
        return this._id;
    }

    public get data():any {
        return this._data;
    }

    public set data(value:any) {
        this._data = value;
    }
}

const statePool: { [key: string]: any } = {};

export function state(id:string, data:any = null):IState {
    let r = statePool[id];

    if (!r) {
        r = new State(id, data)
        statePool[id] = r;
    }

    r.data = data;

    return r;
}


export class StateMachine {
    private readonly _transitions: { [key: string]: { [key: (string|number|symbol)]: IState }} = {}

    private _state:IState = null;

    constructor() {
    }

    public start(initialState:IState) {
        this._state = initialState;
    }

    get state():IState {
        return this._state;
    }

    public add(whenInState:IState, andHappening:(string|number|symbol), thenToState:IState):void {
        let transitions = this._transitions[whenInState.id];

        if (!transitions) {
            this._transitions[whenInState.id] = transitions = {}
        }
        transitions[andHappening] = thenToState;
    }

    public next(happening:(string|number|symbol)):IState {
        let transitions = this._transitions[this.state.id];

        if (transitions && transitions[happening]) {
            this._state = transitions[happening];
        }

        return this.state;
    }
}