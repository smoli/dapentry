import {ActionResult, BaseAction} from "./BaseAction";
import LoginDialog, {LoginDialogHandler, LoginDialogOptions} from "../ui/Login/LoginDialog";
import {DialogCloseReason} from "../ui/core/ModalFactory";
import {API, ResponseStatus} from "../api/API";


export class Login extends BaseAction {
    private dialog: LoginDialogHandler;


    protected async login(data: { email: string, password: string }) {
        const loginResult = await API.login(data.email, data.password);
        if (loginResult.status === ResponseStatus.OK) {
            const userResult = await API.getUser();

            this.state.authenticated(loginResult.data.token, userResult.data);
        } else {
            await this.showLogin({
                errorMessage: "Unknown email or password",
                email: data.email
            })
        }
    }

    protected async register(data: { name: string, email: string, password: string, confirmPassword: string }) {
        const registerResult = await API.register(data.name, data.email, data.password, data.confirmPassword);

        if (registerResult.status === ResponseStatus.OK) {
            await this.showLogin({
                infoMessage: "You can now login. An verification email was sent your way.",
                email: data.email
            })
        } else {
            await this.showLogin({
                errorMessage: "Unable to register " + data.name + ", " + data.email,
                registerNewAccount: true,
                name: data.name,
                email: data.email
            })
        }
    }

    protected async showLogin(options: LoginDialogOptions = {}) {
        const result = await this.dialog.show(options);
        if (result.reason === DialogCloseReason.OK) {

            if (result.data.registerNewAccount) {
                await this.register(result.data);
            } else {
                await this.login(result.data);
            }
        }
    }

    protected async _execute(data: any):Promise<ActionResult> {
        const handler = LoginDialogHandler;
        const component = LoginDialog;

        this.dialog = this.controller.modalFactory.createModal<LoginDialogHandler>(component, handler);


        await this.showLogin();
        return {}
    }
}