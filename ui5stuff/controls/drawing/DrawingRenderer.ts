import Drawing from "./Drawing";
import {C} from "../ControlHelper";
import Control from "sap/ui/core/Control";

const renderer = {

    render(rm, control: Drawing) {
        const root = C("span", control);
        root.class("stsDrawingWrapper");
        root.appendControl(control.getAggregation("_svg") as Control);
        root.render(rm)
    }
}

export default renderer;
