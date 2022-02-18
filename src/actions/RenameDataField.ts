import {BaseAction} from "./BaseAction";
import {CodeManager} from "../runtime/CodeManager";

export class RenameDataField extends BaseAction {
    private readonly _oldName: string;
    private readonly _newName: string;

    constructor(oldName: string, newName:string) {
        super();
        this._oldName = oldName;
        this._newName = newName;
    }

    get codeManager(): CodeManager {
        return this.state.store.state.code.codeManager;
    }

    protected async _execute(data: any): Promise<any> {
        const exists = this.codeManager.registerExists(this._newName)
                    || !!this.state.getDataField(this._newName);

        if (exists) {
            const dialog = this.controller.modalFactory.createInfoModal();
            await dialog.show({
                text: `Cannot rename ${this._oldName}. Name ${this._newName} is already in use.`
            });
            return;
        }

        this.codeManager.renameRegister(this._oldName, this._newName);
        this.state.renameDataField(this._oldName, this._newName);
    }
}