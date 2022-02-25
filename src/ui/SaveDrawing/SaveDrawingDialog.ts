import {DialogCloseReason} from "../core/ModalFactory";
import * as _ from "lodash";

export default {
    template: `
      <div class="drawable-modal-confirm">
      <h1>Save drawing to library</h1>
      <div>
        <label>Name *</label><input v-model="name">
        <div>{{ validation.messageFor.name }}</div>
        </div>
      <div>
        <label>Description *</label><input v-model="description">
        <div>{{ validation.messageFor.description }}</div>
      </div>
      
      <p>
        <label>Which objects should be published?</label>
        <div>{{ validation.messageFor.publishedObjects }}</div>
      <ul>
        <li v-for="obj of publishedObjects">
          <input type="checkbox" v-model="obj.use"/>
          {{ obj.object.uniqueName }}
        </li>
      </ul>
      <p>
        <label>Arguments of the drawing</label>
      <ul>
        <table>
          <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Default Value</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="arg of arguments">
            <td>
              {{ arg.field.name }}
            </td>
            <td>
              <input value="" :placeholder="'What does ' + arg.field.name + 'do ...'" v-model="arg.description"/>
            </td>
            <td>
              {{ arg.field.value }}
            </td>
          </tr>
          </tbody>
        </table>
      </ul>
      <div class="drawable-modal-footer">
        <button @click="onYes" class="drawable-ui-accept" :disabled="!validation.valid">Yes</button>
        <button @click="onNo" class="drawable-ui-decline">No</button>
      </div>
      </div>
    `,

    name: "SaveDrawingDialog",
    props: ["handler"],

    async mounted() {
        this.validation = await this.handler.validate(this.$data);
    },

    data() {
        return {
            name: "",
            description: "",
            arguments: this.$store.state.data.fields.map(field => {
                return {
                    description: "",
                    field
                }
            }),
            publishedObjects: this.$store.state.drawing.objects.map(object => {
                return {
                    use: false,
                    object
                }
            }),
            validation: new ValidationResult()
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
            return this.handler.validate(this.$data);
        },

        onYes() {
            this.handler.yes(this.$data);
        },
        onNo() {
            this.handler.no();
        }
    }
}

import {ModalDialogHandler} from "../core/ModalDialogHandler";
import {GrObject} from "../../geometry/GrObject";
import {API} from "../../api/API";


class ValidationResult {
    errors: { [key: string]: string } = { };

    get valid():boolean {
        return Object.keys(this.errors).length === 0;
    }

    error(key: string, message: string) {
        this.errors[key] = message;
    }

    get messageFor():{ [key: string]: string } {
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