import {Interpreter} from "./runtime/interpreter/Interpreter";
import {Circle} from "./runtime/gfx/Circle";
import {Rect} from "./runtime/gfx/Rect";

document.getElementById("ui").innerText = "UPDATE23"

const i = new Interpreter();
i.addContext("ui", document.getElementById("ui"));
