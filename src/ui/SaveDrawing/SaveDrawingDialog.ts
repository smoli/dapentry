import {DialogCloseReason} from "../core/ModalFactory";
import * as _ from "lodash";

export default {
    template: `
      <div class="drawable-modal-confirm">
      <h1>Save drawing to library</h1>
      <form>
        <label>Name *</label><input v-model="name"><br/>
        <div class="drawable-form-validation-message">{{ validation.messageFor.name }}</div>

        <label>Description *</label><input v-model="description"><br/>
        <div class="drawable-form-validation-message">{{ validation.messageFor.description }}</div>

        <section>
          <h3>Published objects</h3>
          <div class="drawable-form-validation-message">{{ validation.messageFor.publishedObjects }}</div>
          <span class="drawable-save-form-objects" v-for="(obj,i) of publishedObjects">
              <input :id="'cbx' + i" type="checkbox" v-model="obj.use"/>
              <label :for="'cbx' + i">{{ obj.object.uniqueName }}</label>
            </span>
        </section>
        <section>
          <h3>Arguments of the drawing</h3>
          <span>Public args can be changed when reusing the drawing.</span>
          <table>
            <thead>
            <tr>
              <th>pub</th>
              <th>Name</th>
              <th>Description</th>
              <th>Default Value</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="arg of arguments">
              <td>
                <input v-model="arg.public" type="checkbox"/>
              </td>
              <td>
                {{ arg.field.name }}
              </td>
              <td>
                <input value="" :placeholder="'What does ' + arg.field.name + ' do ...'" v-model="arg.description"/>
              </td>
              <td>
                <span>{{ arg.field.value }}</span>
              </td>
            </tr>
            </tbody>
          </table>
        </section>

      </form>
      <div class="drawable-modal-footer">
        <button @click="onYes" class="drawable-ui-accept" :disabled="!validation.valid">Yes</button>
        <button @click="onNo" class="drawable-ui-decline">No</button>
      </div>
      </div>
    `,

    name: "SaveDrawingDialog",
    props: ["handler"],


    data() {
        return {
            name: "",
            description: "",
            arguments: this.$store.state.data.fields.map(field => {
                return {
                    description: "",
                    field,
                    public: false
                }
            }),
            publishedObjects: this.$store.state.drawing.objects
                .filter(object => object.type !== ObjectType.Canvas)
                .map(object => {
                    return {
                        use: false,
                        object
                    }
                }),
            validation: new ValidationResult(),
            validationActive: false
        }
    },

    watch: {
        name() {
            _.debounce(() => {
                this.validate().then(r => this.validation = r);
            }, 400)();
        },

        async description() {
            this.validation = await this.validate();
        },

        publishedObjects: {
            async handler() {
                this.validation = await this.validate();
            },
            deep: true
        }
    },

    methods: {

        validate() {
            if (!this.validationActive) {
                return Promise.resolve(this.validation);
            }
            return this.handler.validate(this.$data);
        },

        async onYes() {
            this.validationActive = true;
            this.validation = await this.validate();
            if (this.validation.valid) {
                this.handler.yes(this.$data);
            }
        },
        onNo() {
            this.handler.no();
        }
    }
}

import {ModalDialogHandler} from "../core/ModalDialogHandler";
import {GrObject, ObjectType} from "../../geometry/GrObject";
import {API} from "../../api/API";


class ValidationResult {
    errors: { [key: string]: string } = {};

    get valid(): boolean {
        return Object.keys(this.errors).length === 0;
    }

    error(key: string, message: string) {
        this.errors[key] = message;
    }

    get messageFor(): { [key: string]: string } {
        return this.errors;
    }
}

export class SaveDrawingHandler extends ModalDialogHandler {

    async yes(data) {
        const validation = await this.validate(data);

        if (validation.valid) {
            this.close(DialogCloseReason.YES, data);
        }
    }

    no() {
        this.close(DialogCloseReason.NO);
    }

    async validate(data: { name: string, description: string, publishedObjects: Array<{ use: boolean, object: GrObject }> }): Promise<ValidationResult> {
        const res = new ValidationResult();
        const numberOfPublishedObjects = data.publishedObjects.filter(p => p.use).length;
        if (numberOfPublishedObjects === 0) {
            res.error("publishedObjects", "At least one object must be published");
        }


        if (data.name.length === 0) {
            res.error("name", "Name cannot be empty");
        } else if (!data.name.match(/^[a-zA-Z][a-zA-Z0-9-_]+$/)) {
            res.error("name", "Name must start with a character and can only contain character, digits, - and _")
        }

        const nameExists = await API.doesNameExist(data.name);

        if (nameExists.data) {
            res.error("name", `${data.name} already exists`);
        }

        if (data.description.length === 0) {
            res.error("description", "Description cannot be empty");
        }

        return res;
    }
}