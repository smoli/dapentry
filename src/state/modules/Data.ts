import {ASSERT, UNREACHABLE} from "../../core/Assertions";

export type DataFieldValue = number | string | Array<number> | Array<{ [key: string]: DataFieldValue }>;

// IMPORTANT: NEVER CHANGE THE NAMES OF THESE!
//            The names of this enum are used to store the
//            argument type of drawings in the library
//            changing a name of this would invalidate stored data
export enum DataFieldType {
    Number,
    List,
    String,
    Table
}

export interface DataField {
    name: string,
    value: DataFieldValue
    type: DataFieldType,
    description: string,
    published: boolean
}

export interface DataState {
    fields: Array<DataField>
}


function getFieldTypeFromValue(value: DataFieldValue): DataFieldType {

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


function checkType(value: DataFieldValue, type: DataFieldType) {
    switch (type) {
        case DataFieldType.Number:
            return typeof value === "number"

        case DataFieldType.List:
            if (!Array.isArray(value)) {
                return false;
            }

            const t1 = typeof value[0];
            return !( value as Array<any> ).find(v => typeof v !== t1);


        case DataFieldType.String:
            return typeof value === "string"

        case DataFieldType.Table:
            if (!Array.isArray(value)) {
                return false;
            }

            const v1 = value[0];
            for (const v of value) {
                for (const k1 of Object.keys(v1)) {
                    if (!v.hasOwnProperty(k1)) {
                        return false;
                    }
                }
                for (const k2 of Object.keys(v)) {
                    if (!v1.hasOwnProperty(k2)) {
                        return false;
                    }
                }
            }
            return true;
    }
}

function getNextColumnName(currentRow) {
    const alpha = "abcdefghijklmnopqrstuvwxyz".split("");
    let suffix = 1;

    const maxI = Math.max(...Object.keys(currentRow).map(v => alpha.indexOf(v)));

    if (maxI < alpha.length - 1) {
        return alpha[maxI + 1];
    }

    while (currentRow.hasOwnProperty("z" + suffix)) {
        suffix++;
    }

    return "z" + suffix;
}


function getDefaultState(): DataState {
    return {
        fields: []
    }
}

export const dataState = {

    state(): DataState {
        return getDefaultState();
    },

    getters: {
        dataCode(state: DataState) {


            return state.fields.map(field => {

                switch (field.type) {
                    case DataFieldType.Number:
                        return `LOAD ${field.name}, ${field.value}`;
                    case DataFieldType.List:
                        return `ITER ${field.name}, [${( field.value as Array<any> ).join(", ")}]`;

                    case DataFieldType.String:
                        return `LOAD ${field.name}, ${field.value}`;

                    case DataFieldType.Table:
                        ASSERT(( field.value as Array<any> ).length > 0, "Table must not be empty");
                        const columns = Object.keys(field.value[0]);
                        const values = ( field.value as Array<any> ).map(v => Object.values(v))

                        return `ITER ${field.name}, [${values.map(v => `[${v.join(",")}]`).join(",")}](${columns.join(",")})`


                }
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

        reset(state: DataState) {
            Object.assign(state, getDefaultState());
        },

        setData(state: DataState, fields: Array<DataField>) {
            state.fields = fields;
        },

        addField(state: DataState, payload: { name: string, value: DataFieldValue, description: string, published: boolean }) {
            if (state.fields.find(f => f.name === payload.name)) {
                UNREACHABLE(`Duplicate field ${payload.name}`);
            }

            const type = getFieldTypeFromValue(payload.value)

            if (!checkType(payload.value, type)) {
                throw  new Error("Data does not match type " + DataFieldType[type] + "\n" + JSON.stringify(payload.value));
            }

            state.fields = [...state.fields, {
                name: payload.name,
                value: payload.value,
                description: payload.description,
                published: payload.published,
                type
            }];
        },

        removeField(state: DataState, name: string) {
            state.fields = state.fields.filter(f => f.name !== name);
        },

        renameField(state: DataState, payload: { oldName: string, newName: string }) {
            state.fields = state.fields.map(f => f.name === payload.oldName ? { ...f, name: payload.newName } : f)
        },

        setFieldValue(state: DataState, payload: { name: string, value: DataFieldValue }) {
            state.fields = state.fields.map(f => {
                if (f.name === payload.name) {
                    return {
                        name: f.name,
                        value: payload.value,
                        type: f.type,
                        description: f.description,
                        published: f.published,
                    }
                }
                return f;
            })
        },

        setListFieldValue(state: DataState, payload: { name: string, index: number, value: DataFieldValue }) {
            state.fields = state.fields.map(f => {
                if (f.name === payload.name) {
                    ASSERT(Array.isArray(f.value), "Can only set item value on array values");
                    const value = ( f.value as Array<any> ).map((v, i) => i === payload.index ? payload.value : v)
                    return {
                        name: f.name,
                        value, type:
                        DataFieldType.List,
                        description: f.description,
                        published: f.published
                    }
                }
                return f;
            })
        },

        setTableCellValue(state: DataState, payload: { name: string, index: number, column: string, value: DataFieldValue }) {
            state.fields = state.fields.map(f => {
                if (f.name === payload.name) {
                    ASSERT(f.type === DataFieldType.Table, "Can only set value on table");
                    ASSERT(( f.value as Array<any> ).length > 0, "Can only set value on non-empty table");

                    if (!f.value[0].hasOwnProperty(payload.column)) {
                        return f;
                    }

                    const value = ( f.value as Array<any> )
                        .map((v, i) => i !== payload.index ? v : {
                            ...v,
                            [payload.column]: payload.value
                        })
                    return {
                        name: f.name,
                        value,
                        type: DataFieldType.Table,
                        description: f.description,
                        published: f.published
                    }
                }
                return f;
            })
        },

        addValueToField(state: DataState, payload: { name: string, value: ( number | string ) }) {
            // @ts-ignore
            state.fields = state.fields.map(f => {
                if (f.name !== payload.name) {
                    return f;
                }

                switch (f.type) {
                    case DataFieldType.Number:
                        return {
                            name: f.name,
                            value: [f.value, payload.value],
                            type: DataFieldType.List,
                            description: null,
                            published: true
                        }

                    case DataFieldType.List:
                        return {
                            name: f.name,
                            value: [...( f.value as Array<any> ), payload.value],
                            type: DataFieldType.List,
                            description: null,
                            published: true
                        }

                    case DataFieldType.String:
                        break;

                    case DataFieldType.Table:
                        const v1 = f.value[0];
                        const row = {}
                        Object.keys(v1).forEach(k => row[k] = payload.value);
                        return {
                            name: f.name,
                            value: [...( f.value as Array<any> ), row],
                            type: DataFieldType.Table,
                            description: null,
                            published: true
                        }


                }

            })
        },

        addColumnToField(state: DataState, payload: { name: string, value: DataFieldValue }) {
            state.fields = state.fields.map(f => {
                if (f.name !== payload.name) {
                    return f;
                }

                switch (f.type) {
                    case DataFieldType.Number:
                        return {
                            name: f.name,
                            value: [{ a: f.value, b: payload.value }],
                            type: DataFieldType.Table,
                            description: f.description,
                            published: f.published
                        }

                    case DataFieldType.List:
                        return {
                            name: f.name,
                            value: ( f.value as Array<any> ).map(v => {
                                return {
                                    a: v,
                                    b: payload.value
                                }
                            }),
                            type: DataFieldType.Table,
                            description: f.description,
                            published: f.published
                        }

                    case DataFieldType.String:
                        return f;

                    case DataFieldType.Table:
                        ASSERT(( f.value as Array<any> ).length > 0, "Table should not be empty")
                        const v1 = f.value[0]
                        const name = getNextColumnName(v1);

                        return {
                            name: f.name,
                            value: ( f.value as Array<any> ).map(v => {
                                return {
                                    ...v,
                                    [name]: payload.value
                                }
                            }),
                            type: DataFieldType.Table,
                            description: f.description,
                            published: f.published
                        }

                }

            })
        },

        renameTableColumn(state: DataState,
                          payload: { name: string, oldColumn: string, newColumn: string }) {
            state.fields = state.fields.map(f => {
                if (f.name !== payload.name) {
                    return f;
                }

                ASSERT(f.type === DataFieldType.Table, "Can only rename Columns of table fields");
                ASSERT(( f.value as Array<any> ).length > 0, "Can only rename Columns of non-empty tables")

                if (f.value[0].hasOwnProperty(payload.newColumn)) {
                    return f;
                }

                return {
                    name: f.name,
                    value: ( f.value as Array<any> ).map(v => {
                        v[payload.newColumn] = v[payload.oldColumn];
                        delete v[payload.oldColumn];
                        return v;
                    }),
                    type: DataFieldType.Table,
                    description: f.description,
                    published: f.published
                }
            })
        },

        removeTableColumn(state: DataState, payload: { name: string, column: string }) {
            state.fields = state.fields.map(f => {
                if (f.name !== payload.name) {
                    return f;
                }

                ASSERT(f.type === DataFieldType.Table, "Can only rename Columns of table fields");
                ASSERT(( f.value as Array<any> ).length > 0, "Can only rename Columns of non-empty tables")

                if (!f.value[0].hasOwnProperty(payload.column)) {
                    return f;
                }

                const colNames = Object.keys(f.value[0]);
                if (colNames.length === 2) {
                    const remaining = colNames.find(n => n !== payload.column);
                    return {
                        name: f.name,
                        description: f.description,
                        published: f.published,
                        value: ( f.value as Array<any> ).map(v => {
                            return v[remaining];
                        }),
                        type: DataFieldType.List
                    }
                }

                return {
                    name: f.name,
                    description: f.description,
                    published: f.published,
                    value: ( f.value as Array<any> ).map(v => {
                        delete v[payload.column];
                        return v;
                    }),
                    type: DataFieldType.Table
                }
            })
        }
    }
}
