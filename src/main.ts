import { Interpreter } from "./Interpreter";

document.getElementById("ui").innerText = "UPDATE23"

const i = new Interpreter();
i.addContext("ui", document.getElementById("ui"));
