import {GfxInterpreter} from "../GfxInterpreter";
import {StyleManager} from "../controls/drawing/Objects/StyleManager";
import {GrCanvas} from "../Geo/GrCanvas";

export async function runCode(code:string):Promise<GfxInterpreter> {
    const styles = new StyleManager();
    let interpreter:GfxInterpreter = new GfxInterpreter();

    interpreter.parse(code);
    interpreter.clearObjects();
    await interpreter.run({
        "$styles": styles.styles,
        "$lastObject": null,
        "Canvas": GrCanvas.create_1_1(1000)
    });

    return interpreter;
}