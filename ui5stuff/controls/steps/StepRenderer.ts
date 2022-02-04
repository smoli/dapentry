import {C} from "../ControlHelper";
import Step from "./Step";

const renderer = {

    render(rm, control: Step) {
        const root = C("div", control);
        root.text(control.constructText());
        root.class("stsDrawableStep");

        // @ts-ignore
        const level = Number(control.getLevel()) + 0.2;
        root.style("margin-left", level +"em !important");

        // @ts-ignore
        const selected = control.getSelected();
        if (selected) {
            root.class("stsDrawableStepSelected")
        }

        root.render(rm)
    }
}

export default renderer;