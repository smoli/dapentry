import {GfxInterpreter} from "../../src/GfxInterpreter";
import {StyleManager} from "../../src/controls/drawing/Objects/StyleManager";

export async function runCode(code:string):Promise<GfxInterpreter> {
    const styles = new StyleManager();
    let interpreter:GfxInterpreter = new GfxInterpreter();

    interpreter.parse(code);
    interpreter.clearObjects();
    await interpreter.run({
        "$styles": styles.styles,
        "$lastObject": null,
    });

    return interpreter;
}