import {RegisterStore} from "./RegisterStore";

type Context = Node;

interface ContextDictionary {
    [key: string]: Context
}


export class Interpreter {

    private contexts:ContextDictionary = {};

    private registers:RegisterStore = new RegisterStore();
    private program = [];

    private executed: boolean = false;
    private context: Context = null;


    constructor() {

    }

    public addContext(name: string, context: Context): void {
        this.contexts[name] = context;
    }

    public switchContext(name: string): void {
        this.context = this.contexts[name];
    }




}