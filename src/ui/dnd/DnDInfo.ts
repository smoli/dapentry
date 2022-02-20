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

export function serializeDNDInfo(info: DnDInfo):string {
    return JSON.stringify(info);
}

export function deSerializeDNDInfo(string: string): DnDInfo {
    return JSON.parse(string);
}

export function makeDnDHandlers(dropHandler: (DragEvent) => void, ...allowedTypes:Array<DnDDataType>):
    { onDragEnter: (DragEvent) => void,
        onDragOver: (DragEvent) => void,
        onDrop: (DragEvent) => void
    } {
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
            dropHandler.call(this, event);
        }
    }
}