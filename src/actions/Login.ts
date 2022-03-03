import {BaseAction} from "./BaseAction";
import LoginDialog, {LoginDialogHandler} from "../ui/Login/LoginDialog";
import {DialogCloseReason} from "../ui/core/ModalFactory";
import {API, ResponseStatus} from "../api/API";


export class Login extends BaseAction {

    protected async _execute(data: any) {
        const handler = LoginDialogHandler;
        const component = LoginDialog;

        const dialog = this.controller.modalFactory.createModal<LoginDialogHandler>(component, handler);

        const showLogin = async (message) => {
            const result = await dialog.show(message);

            if (result.reason === DialogCloseReason.OK) {
                const loginResult = await API.login(result.data.email, result.data.password);

                if (loginResult.status === ResponseStatus.OK) {

                    const userResult = await API.getUser();

                    this.state.authenticated(loginResult.data.token, {
                        name: result.data.email,
                        email: result.data.email,
                        verified: userResult.data.verified
                    });
                } else {
                    await showLogin("Unknown email or password")
                }
            }
        }

        await showLogin(null);
    }
}