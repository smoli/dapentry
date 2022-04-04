import {BaseAction} from "./BaseAction";
import {CodeManager} from "../runtime/CodeManager";
import {AppConfig} from "../core/AppConfig";

export class RenameObject extends BaseAction {
    private readonly _oldName: string;
    private readonly _newName: string;

    constructor(oldName: string, newName: string) {
        super();
        this._oldName = oldName;
        this._newName = newName;
    }
    protected validate(name:string): boolean {
        return !!name.match(AppConfig.Runtime.allowedFieldNames)
            && AppConfig.Runtime.forbiddenDataFieldNames.indexOf(name) === -1;
    }

    protected async _execute(data: any): Promise<any> {
        const exists = !!this.state.getDataField(this._newName);

        if (exists) {
            const dialog = this.controller.modalFactory.createInfoModal();
            await dialog.show({
                text: `Cannot rename ${this._oldName}. Name ${this._newName} is already in use as a data field name.`
            });
            return;
        }

        if (!this.validate(this._newName)) {
            const dialog = this.controller.modalFactory.createInfoModal();
            await dialog.show({
                text: `Cannot rename ${this._oldName}. Name ${this._newName} is not a valid name for an object.`
            });
            return;
        }
        this.state.renameRegister(this._oldName, this._newName);
        this.controller.renameGuide(this._oldName, this._newName);
    }
}