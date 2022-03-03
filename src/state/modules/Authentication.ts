import {AnnotatedCodeLine, CodeManager, CreationInfo} from "../../runtime/CodeManager";
import {ASSERT} from "../../core/Assertions";
import {AppConfig} from "../../core/AppConfig";
import {GfxCircle} from "../../runtime/gfx/GfxCircle";
import {GfxRect} from "../../runtime/gfx/GfxRect";
import {GfxLine} from "../../runtime/gfx/GfxLine";
import {GfxPolygon} from "../../runtime/gfx/GfxPolygon";


export interface UserInfo { name: string, email: string, verified: boolean }

export interface AuthenticationState {
    authenticated: boolean,
    token: string,
    user: UserInfo
}

export const authenticationState = {

    state(): AuthenticationState {
        return {
            authenticated: false,
            token: null,
            user: null
        }
    },

    getters: {
    },

    mutations: {
        authenticated(state: AuthenticationState, payload: { token: string, user: UserInfo }) {
            state.authenticated = true;
            state.token = payload.token;
            state.user = {...payload.user};

        },

        logout(state: AuthenticationState) {
            state.authenticated = false;
            state.token = null;
            state.user = null;
        }

    }
}
