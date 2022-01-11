import {C} from "../ControlHelper";
import Step from "./Step";

const renderer = {

    render(rm, control: Step) {
        const root = C("", control);




        root.render(rm)
    }
}

export default renderer;