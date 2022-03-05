import {ASSERT, UNREACHABLE} from "../../core/Assertions";

export type DataFieldValue = number | string | Array<number>;

export enum DataFieldType {
    Number,
    List,
    String,
    Table
}

export interface DataField {
    name: string,
    value: DataFieldValue
    type: DataFieldType
}

export interface DataState {
    fields: Array<DataField>
}


function getFieldTypeFromValue(value: DataFieldValue):DataFieldType {

    if (typeof value === "number") {
        return DataFieldType.Number;
    }

    if (typeof value === "string") {
        return DataFieldType.String;
    }

    if (Array.isArray(value)) {
        if (value.length && typeof value[0] === "number") {
            return DataFieldType.List;
        }

        return DataFieldType.Table;
    }

}


export const dataState = {

    state(): DataState {
        return {
            fields: []
        }
    },

    getters: {
        dataCode(state: DataState) {
            return state.fields.map(field => {
                if (Array.isArray(field.value)) {
                    return `ITER ${field.name}, [${field.value.join(", ")}]`;
                }
                return `LOAD ${field.name}, ${field.value}`;
            });
        },

        dataCodeLength(state: DataState) {
            return state.fields.length;
        },

        newFieldName: (state: DataState) => (prefix: string): string => {
            ASSERT(!!prefix, "Data field name prefix must not be empty");

            let n = prefix;
            let i = 1;

            while (state.fields.find(f => f.name === n + i)) {
                i++;
            }

            return n + i;
        }
    },

    mutations: {
        setData(state: DataState, fields: Array<DataField>) {
            state.fields = fields;
        },

        addField(state: DataState, payload: { name: string, value: DataFieldValue }) {
            if (state.fields.find(f => f.name === payload.name)) {
                UNREACHABLE(`Duplicate field ${payload.name}`);
            }
            state.fields = [...state.fields, { name: payload.name, value: payload.value, type: getFieldTypeFromValue(payload.value) }];
        },

        removeField(state: DataState, name: string) {
            state.fields = state.fields.filter(f => f.name !== name);
        },

        renameField(state: DataState, payload: { oldName: string, newName: string} ) {
            state.fields = state.fields.map(f => f.name === payload.oldName ? { ...f, name: payload.newName} : f)
        },

        setFieldValue(state: DataState, payload: { name: string, value: DataFieldValue }) {
            state.fields = state.fields.map(f => {
                if (f.name === payload.name) {
                    return { name: f.name, value: payload.value, type: f.type }
                }
                return f;
            })
        },

        setListFieldValue(state: DataState, payload: { name: string, index: number, value: DataFieldValue }) {
            state.fields = state.fields.map(f => {
                if (f.name === payload.name) {
                    ASSERT(Array.isArray(f.value), "Can only set item value on array values");
                    const value = (f.value as Array<any>).map((v, i) => i === payload.index ? payload.value : v)
                    return { name: f.name, value, type: DataFieldType.List }
                }
                return f;
            })
        },

        addValueToField(state: DataState, payload: { name: string, value: (number | string ) }) {
            // @ts-ignore
            state.fields = state.fields.map(f => {
                if (f.name !== payload.name) {
                    return f;
                }

                if (Array.isArray(f.value)) {
                    return { name: f.name, value: [...f.value, payload.value ], type: DataFieldType.List}
                }

                return { name: f.name, value: [f.value, payload.value ], type: DataFieldType.List}
            })
        }
    }
}
