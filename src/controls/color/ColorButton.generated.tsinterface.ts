import { $ControlSettings } from "sap/ui/core/Control";

declare module "./ColorButton" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $ColorButtonSettings extends $ControlSettings {
        color?: string;
    }

    export default interface ColorButton {

        // property: color
        getColor(): string;
        setColor(color: string): this;
    }
}
