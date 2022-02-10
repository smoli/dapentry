export function UNREACHABLE(message:string = "") {
    throw new Error("Branch should not be reached. " + message);
}

export function NOT_IMPLEMENTED(message: string = "") {
    throw new Error("Branch not implement. " + message);
}

export function ASSERT(condition:boolean, message: string) {
    if (condition === false) {
        throw new Error("Assertion violated. " + message);
    }
}
