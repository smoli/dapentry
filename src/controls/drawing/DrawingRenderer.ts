import Drawing from "./Drawing";
import {C} from "../ControlHelper";
import Control from "sap/ui/core/Control";

const renderer = {

    render(rm, control: Drawing) {
        const root = C("div", control);
        root.appendControl(control.getAggregation("_svg") as Control);
        root.render(rm)
    }
}

export default renderer;