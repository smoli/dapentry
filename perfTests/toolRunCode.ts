import {GfxInterpreter} from "../src/GfxInterpreter";
import {StyleManager} from "../src/drawing/StyleManager";
import {GrCanvas} from "../src/geometry/GrCanvas";
import {AppConfig} from "../src/AppConfig";

export async function runCode(code:string):Promise<GfxInterpreter> {
    const styles = new StyleManager();
    let interpreter:GfxInterpreter = new GfxInterpreter();

    interpreter.parse(code);
    interpreter.clearObjects();
    await interpreter.run({
        [AppConfig.Runtime.styleRegisterName]: styles.styles,
        "$lastObject": null,
        [AppConfig.Runtime.canvasObjectName]: GrCanvas.create_1_1(1000)
    });

    return interpreter;
}