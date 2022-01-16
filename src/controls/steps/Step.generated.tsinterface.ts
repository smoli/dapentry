import Event from "sap/ui/base/Event";
import { $ControlSettings } from "sap/ui/core/Control";
import {Token} from "../../runtime/interpreter/Parser";

declare module "./Step" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $StepSettings extends $ControlSettings {
        tokens?: Array<Token>;
        codeIndex?: number;
        level?: number;
        selected?: boolean;
        press?: (event: Event) => void;
    }

    export default interface Step {

        // property: tokens
        getTokens(): Array<Token>;
        setTokens(tokens: Array<Token>): this;

        // property: codeIndex
        getCodeIndex(): number;
        setCodeIndex(codeIndex: number): this;

        // property: level
        getLevel(): number;
        setLevel(level: number): this;

        // property: selected
        getSelected(): boolean;
        setSelected(selected: boolean): this;

        // event: press
        attachPress(fn: (event: Event) => void, listener?: object): this;
        attachPress<CustomDataType extends object>(data: CustomDataType, fn: (event: Event, data: CustomDataType) => void, listener?: object): this;
        detachPress(fn: (event: Event) => void, listener?: object): this;
        firePress(parameters?: object): this;
    }
}