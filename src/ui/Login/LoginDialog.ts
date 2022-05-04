import {DialogCloseReason} from "../core/ModalFactory";
import {ModalDialogHandler} from "../core/ModalDialogHandler";
import {ValidationResult} from "../core/ValidationResult";
import {I18n} from "vue-i18n";

export default {
    template: `
      <div class="drawable-modal-confirm">
      <div v-if="!registerNewAccount">
        <h1>Login</h1>
        <form>
          <fieldset>
            <div class="drawable-form-validation-message">{{ handler.initialErrorMessage }}</div>
            <desc>{{ handler.initialInfoMessage }}</desc>
            <p><label for="login-email">Email address *</label><input id="login-email" type="email" v-model="email"></p>
            <div class="drawable-form-validation-message">{{ validation.messageFor.email }}</div>
            <p><label for="login-password">Password *</label><input id="login-password" type="password"
                                                                    v-model="password"></p>
            <div class="drawable-form-validation-message">{{ validation.messageFor.password }}</div>
          </fieldset>
        </form>
        <p>No account yet? <a class="drawable-action-link" @click="onDoRegister">Create a new one</a></p>
      </div>

      <div v-else>
        <h1>Register a new account</h1>
        <form>
          <fieldset>
            <div class="drawable-form-validation-message">{{ handler.initialErrorMessage }}</div>
            <desc>{{ handler.initialInfoMessage }}</desc>

            <div class="drawable-form-validation-message">{{ handler.initialMessage }}</div>
            <p><label for="register-email">Email address *</label><input id="register-email" type="email"
                                                                         v-model="email"></p>
            <div class="drawable-form-validation-message">{{ validation.messageFor.email }}</div>
            <p><label for="register-name">Name *</label><input id="register-name" v-model="name"></p>
            <div class="drawable-form-validation-message">{{ validation.messageFor.name }}</div>
            <p><label for="register-password">Password *</label><input id="register-password" type="password"
                                                                       v-model="password"></p>
            <div class="drawable-form-validation-message">{{ validation.messageFor.password }}</div>
            <p><label for="register-pw-confirm">Confirm Password *</label><input id="register-pw-confirm"
                                                                                 type="password"
                                                                                 v-model="confirmPassword"></p>
            <div class="drawable-form-validation-message">{{ validation.messageFor.confirmPassword }}</div>
          </fieldset>
        </form>
        <p>By registering an account you agree to the
            <a href="https://www.dapentry.com/termsofservice-en.html" target="termsofservice">Terms of Service</a> and the
            <a href="https://www.dapentry.com/privacy-en.html" target="privacy">Privacy Policy</a>
        </p>
        <p>Already have an account? <a class="drawable-action-link" @click="onDoLogin">Login</a></p>
      </div>

      <div class="drawable-modal-footer">
        <button v-if="registerNewAccount" @click="onLogin" class="drawable-ui-accept" :disabled="!validation.valid">
          Register
        </button>
        <button v-else @click="onLogin" class="drawable-ui-accept" :disabled="!validation.valid">Login</button>
        <button @click="onCancel" class="drawable-ui-decline">Cancel</button>
      </div>
      </div>
    `,

    name: "LoginDialog",
    props: ["handler"],


    data() {
        return {
            email: this.handler.email || "",
            password: "",
            confirmPassword: "",
            name: this.handler.name || "",
            validation: new ValidationResult(),
            validationActive: false,
            registerNewAccount: this.handler.doRegisterNewAccount
        }
    },

    watch: {
        async email() {
            this.validation = await this.validate();
        },

        async password() {
            this.validation = await this.validate();
        },

        async name() {
            this.validation = await this.validate();
        },

        async confirmPassword() {
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
        },

        onDoRegister() {
            this.registerNewAccount = true;
        },

        onDoLogin() {
            this.registerNewAccount = false;
        }
    }
}

export interface LoginDialogOptions {
    infoMessage?: string,
    errorMessage?: string,
    registerNewAccount?: boolean,
    name?:string,
    email?:string
}


export class LoginDialogHandler extends ModalDialogHandler {
    private _options: LoginDialogOptions;

    constructor(onShow: () => void, onClose: () => void, i18n: I18n) {
        super(onShow, onClose, i18n);
    }


    async show(options: LoginDialogOptions) {
        this._options = options;
        return ModalDialogHandler.prototype.show.call(this);
        // return super.show();
    }

    get initialErrorMessage(): string {
        return this._options.errorMessage;
    }

    get initialInfoMessage(): string {
        return this._options.infoMessage;
    }

    get doRegisterNewAccount():boolean {
        return this._options.registerNewAccount;
    }

    get name():string {
        return this._options.name;
    }

    get email():string {
        return this._options.email;
    }

    async login(data) {
        const validation = await this.validate(data);

        if (validation.valid) {
            this.close(DialogCloseReason.OK, data);
        }
    }

    async register(data) {
        const validation = await this.validate(data);

        if (validation.valid) {
            this.close(DialogCloseReason.OK, data);
        }
    }

    cancel() {
        this.close(DialogCloseReason.CANCEL);
    }

    async validate(data: { email: string, password: string, registerNewAccount: boolean, name: string, confirmPassword: string }): Promise<ValidationResult> {
        const res = new ValidationResult();
        if (data.email.length < 1) {
            res.error("email", "Please provide your email address");
        } else {
            // Just the basics. The rest will be handled by email verification
            const m = data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
            if (!m) {
                res.error("email", "Please enter a valid email address")
            }
        }

        if (data.password.length < 1) {
            res.error("password", "Please provide your password");
        }

        if (data.registerNewAccount) {
            if (data.confirmPassword.length < 1) {
                res.error("confirmPassword", "Please confirm your password");
            } else if (data.password !== data.confirmPassword) {
                res.error("confirmPassword", "Confirmation does not match password");
            }

            if (data.name.length < 1) {
                res.error("name", "Please enter your name");
            }
        }

        return res;
    }
}