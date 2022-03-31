import {ActionResult, BaseAction} from "./BaseAction";
import { d3Bridge } from "./d3Bridge.cjs"

export class LoadFieldFromCSV extends BaseAction {
    private _csvString: string;
    private _fieldName: any;

    constructor(fieldName: string, csvString: string) {
        super();
        this._fieldName = fieldName;
        this._csvString = csvString;
    }

    protected async _execute(data: any): Promise<ActionResult | void> {

        const csvParse = (await d3Bridge()).csvParse;
        const csvData:Array<any> = csvParse(this._csvString, d => {
            const r = {};

            for (const k in d) {
                r[k] = JSON.parse(d[k])
            }

            return r;
        });
        delete csvData["columns"];
        this.state.setDataFieldValue(this._fieldName, csvData)

        return  null;
    }

}