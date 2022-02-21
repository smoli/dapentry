export enum DnDDataType {
    Register = "drawable/register",
    ArrayRegister = "drawable/arrayregister",
    PointRegister = "drawable/pointregister"
}

export interface DnDInfo {
    type: DnDDataType,
    value1: any
    value2?: any,
    value3?: any
}

export function serializeDNDInfo(info: DnDInfo): string {
    return JSON.stringify(info);
}

export function deSerializeDNDInfo(string: string): DnDInfo {
    return JSON.parse(string);
}

interface HandlerMap {
    onDragEnter: (DragEvent) => void,
    onDragOver: (DragEvent) => void,
    onDrop: (DragEvent) => void
}

export function prefixed(prefix: string, handlers: HandlerMap): any {
    const r = {};

    Object.keys(handlers)
        .forEach(key => {
            const name = prefix + key[0].toUpperCase() + key.slice(1);
            r[name] = handlers[key];
        });

    return r;
}

export function makeDnDHandlers(dropHandler: (DragEvent) => void, ...allowedTypes: Array<DnDDataType>): HandlerMap {
    return {
        onDragEnter(event: DragEvent) {
            for (const type of allowedTypes) {
                if (event.dataTransfer.types.includes(type)) {
                    event.preventDefault();
                    return;
                }
            }
        },

        onDragOver(event: DragEvent) {
            for (const type of allowedTypes) {
                if (event.dataTransfer.types.includes(type)) {
                    event.preventDefault();
                    return;
                }
            }
        },

        onDrop(event: DragEvent) {
            for (const type of allowedTypes) {
                if (event.dataTransfer.types.includes(type)) {
                    event.preventDefault();
                    dropHandler.call(this, event);
                    return;
                }
            }
        }
    }
}