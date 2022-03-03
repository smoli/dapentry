import {DialogCloseReason} from "../core/ModalFactory";
import {ModalDialogHandler} from "../core/ModalDialogHandler";
import {ValidationResult} from "../core/ValidationResult";

export default {
    template: `
      <div class="drawable-modal-confirm">
      <h1>Login</h1>
      <form>
        <div class="drawable-form-validation-message">{{ handler.initialMessage }}</div>
        <label>Email address *</label><input v-model="email"><br/>
        <div class="drawable-form-validation-message">{{ validation.messageFor.email }}</div>
        <label>Password *</label><input type="password" v-model="password"><br/>
        <div class="drawable-form-validation-message">{{ validation.messageFor.password }}</div>
      </form>
      
      <div class="drawable-modal-footer">
        <button @click="onLogin" class="drawable-ui-accept" :disabled="!validation.valid">Login</button>
        <button @click="onCancel" class="drawable-ui-decline">Cance</button>
      </div>
      </div>
    `,

    name: "LoginDialog",
    props: ["handler"],


    data() {
        return {
            email: "",
            password: "",
            validation: new ValidationResult(),
            validationActive: false
        }
    },

    watch: {
        async email() {
            this.validation = await this.validate();
        },

        async password() {
            this.validation = await this.validate();
        }
    },

    methods: {

        validate() {
            if (!this.validationActive) {
                return Promise.resolve(this.validation);
            }
            return this.handler.validate(this.$data);
        },

        async onLogin() {
            this.validationActive = true;
            this.validation = await this.validate();
            if (this.validation.valid) {
                this.handler.login(this.$data);
            }
        },
        onCancel() {
            this.handler.cancel();
        }
    }
}


export class LoginDialogHandler extends ModalDialogHandler {
    private _initialMessage: string;


    async show(initialMessage:string = null) {
        this._initialMessage = initialMessage;
        return super.show();
    }

    get initialMessage():string {
        return this._initialMessage;
    }

    async login(data) {
        const validation = await this.validate(data);

        if (validation.valid) {
            this.close(DialogCloseReason.OK, data);
        }
    }

    cancel() {
        this.close(DialogCloseReason.CANCEL);
    }

    async validate(data: { email: string, password: string }): Promise<ValidationResult> {
        const res = new ValidationResult();
        if (data.email.length < 1) {
            res.error("email", "Please provide your email address");
        }

        if (data.password.length < 1) {
            res.error("password", "Please provide your password");
        }

        return res;
    }
}