export function UNREACHABLE(message:string = "") {
    throw new Error("Branch should not be reached. " + message);
}

export function NOT_IMPLEMENTED(message: string = "") {
    throw new Error("Branch not implement. " + message);
}