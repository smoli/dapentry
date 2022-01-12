import {C} from "../ControlHelper";
import {StepList} from "./StepList";

const renderer = {

    render(rm, control:StepList) {
        const root = C("div", control);

        // @ts-ignore
        const steps = control.getSteps();

        steps.forEach(s => {
            root.appendControl(s);
        })


        root.render(rm)
    }
}

export default renderer;