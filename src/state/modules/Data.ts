import {ASSERT, UNREACHABLE} from "../../core/Assertions";

export type DataFieldValue = number | string | Array<number>;

export interface DataField {
    name: string,
    value: DataFieldValue
}

export interface DataState {
    fields: Array<DataField>
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
                    return `LOAD ${field.name}, [${field.value.join(", ")}]`;
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
            state.fields = [...state.fields, { name: payload.name, value: payload.value }];
        },

        removeField(state: DataState, name: string) {
            state.fields = this.state.fields.filter(f => f.name !== name);
        },

        setFieldValue(state: DataState, payload: { name: string, value: DataFieldValue }) {
            state.fields = state.fields.map(f => {
                if (f.name === payload.name) {
                    return { name: f.name, value: payload.value }
                }
                return f;
            })
        }
    }
}
