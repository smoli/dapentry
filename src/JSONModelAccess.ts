import JSONModel from "sap/ui/model/json/JSONModel";

type filterFunc = (any, number?) => boolean;

type pathPart = (string | number | filterFunc);

interface setter {
    to: (newValue: any) => void;
}

interface pusher {
    to: (...parts: Array<pathPart>) => void;
}

interface remover {
    from: (...parts: Array<pathPart>) => any;
}


export class JSONModelAccess {
    private _model: JSONModel;
    private _basePath: string;

    constructor(model: JSONModel, basePath: string = "") {
        this._model = model;
        this._basePath = basePath;
    }

    protected constructPath(parts: Array<pathPart>): string {

        const pathParts: Array<(string | number)> = [];
        if (this._basePath) {
            pathParts.push(this._basePath);
        }

        for (const p of parts) {
            if (typeof p === "string" || typeof p === "number") {
                pathParts.push(p);
            } else if (typeof p === "function") {
                const tmpPath = pathParts.join("/");

                const arrOrObj = this._model.getProperty(tmpPath);

                if (Array.isArray(arrOrObj)) {
                    let found = false;
                    for (let i = 0; i < arrOrObj.length; i++) {
                        if (p(arrOrObj[i], i)) {
                            pathParts.push(i);
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        return null;
                    }
                }
            }
        }

        return pathParts.join("/");
    }

    get(...parts: Array<pathPart>) {
        return this._model.getProperty(this.constructPath(parts));
    }

    set(...parts: Array<pathPart>): setter {
        return {
            to: newValue => {
                this._model.setProperty(this.constructPath(parts), newValue);
            }
        }
    }

    /**
     * Insert an entry at the end of an array
     * @param value
     */
    push(value:any): pusher {
        return {
            to: (...parts: Array<pathPart>) => {
                const path = this.constructPath(parts);
                const arr = this._model.getProperty(path);
                arr.push(value);
                this._model.setProperty(path, arr);
            }
        }
    }

    /**
     * Remove the last entry from an array
     */
    pop(): remover {
        return {
            from: (...parts: Array<pathPart>):any => {
                const path = this.constructPath(parts);
                const arr = this._model.getProperty(path);
                const r = arr.pop();
                this._model.setProperty(path, arr);
                return r;
            }
        }
    }

    /**
     * Remove property from object or entry from array.
     *
     * If a predicate is used for array removal this will
     * only remove the first matching entry.
     *
     * @param identifier
     */
    remove(identifier: (string|number|filterFunc)): remover {

        return {
            from: (...parts: Array<pathPart>):any => {
                const path = this.constructPath(parts);
                const arrOrObject = this._model.getProperty(path);

                if (Array.isArray(arrOrObject)) {
                    let index;
                    if (typeof identifier === "function") {
                        index = arrOrObject.findIndex(identifier);
                    } else if (typeof identifier === "number") {
                        index = identifier;
                    } else {
                        index = Number(identifier);
                    }

                    if (isNaN(index)) {
                        throw new Error(`Identifier ${identifier} not supported for arrays`)
                    }

                    arrOrObject.splice(index, 1);
                } else if (typeof arrOrObject === "object") {
                    let key;
                    if (typeof identifier === "function") {
                        throw new Error("Removing from an object with a predicate makes no sense")
                    } else {
                        key = "" + identifier;
                    }

                    delete arrOrObject[key];
                }

                this._model.setProperty(path, arrOrObject);
            }
        }

    }

}