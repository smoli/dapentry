import {BaseAction} from "./BaseAction";
import {CodeManager} from "../runtime/CodeManager";
import {AppConfig} from "../core/AppConfig";
import {ASSERT} from "../core/Assertions";

export class RenameTableColumn extends BaseAction {
    private readonly _oldColumnName: string;
    private readonly _newColumnName: string;
    private readonly _registerName: string;

    constructor(registerName: string, oldColumnName: string, newColumnName:string) {
        super();
        this._registerName = registerName;
        this._oldColumnName = oldColumnName;
        this._newColumnName = newColumnName;
    }

    get codeManager(): CodeManager {
        return this.state.store.state.code.codeManager;
    }

    protected validate(name:string): boolean {
        return !!name.match(AppConfig.Runtime.allowedColumnNames)
             && AppConfig.Runtime.forbiddenDataFieldNames.indexOf(name) === -1;
    }

    protected async _execute(data: any): Promise<any> {
        ASSERT(!!this.state.store.state.data.fields.find(f => f.name === this._registerName), this._registerName + " does not exists");

        if (!this.validate(this._newColumnName)) {
            const dialog = this.controller.modalFactory.createInfoModal();
            await dialog.show({
                text: `Cannot rename ${this._oldColumnName}. Name ${this._newColumnName} is not a valid name for a table column.`
            });
            return;
        }

        this.state.renameTableColumn(this._registerName, this._oldColumnName, this._newColumnName);
    }
}