import {DialogCloseReason} from "../core/ModalFactory";
import * as _ from "lodash";
import Preview from "../drawing/Preview.vue"

export default {
    template: `
      <div class="drawable-modal-confirm">
      <h1>Save drawing to library</h1>
      <div>
        <div class="drawable-save-drawing-form">
          <form>
            <fieldset>
              <legend>General</legend>
              <p><label for="save-drawing-name">Name *</label><input pattern="[a-zA-Z][a-zA-Z0-9-_]+"
                                                                     id="save-drawing-name"
                                                                     v-model="name"></p>
              <div class="drawable-form-validation-message">{{ validation.messageFor.name }}</div>
              <p><label for="save-drawing-description">Description *</label><input id="save-drawing-description"
                                                                                   v-model="description"></p>
              <div class="drawable-form-validation-message">{{ validation.messageFor.description }}</div>
            </fieldset>

            <fieldset>
              <legend>Published Objects</legend>
              <desc>Guides will always be included as unpublished.</desc>
              <ul>
                <li class="drawable-save-form-objects" v-for="(obj,i) of publishedObjects">
                  <input :id="'save-drawing-cbx' + i" type="checkbox" v-model="obj.use"/>
                  <label :for="'save-drawing-cbx' + i">{{ obj.object.uniqueName }}</label>
                </li>
              </ul>
              <br/>
              <div class="drawable-form-validation-message">{{ validation.messageFor.publishedObjects }}</div>
            </fieldset>
            <fieldset>
              <legend>Fields and Arguments</legend>
              <desc>Public args can be changed when reusing the drawing.</desc>
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
            </fieldset>
          </form>
        </div>
        <div class="drawable-save-drawing-preview">
          <form>
            <fieldset>
              <legend>Preview</legend>
              <Preview :svg-code="svgPreview" 
                       :width="previewWidth" :height="previewHeight" 
                       :vb-width="previewVBWidth" :vb-height="previewVBHeight"/>
              <i>ALPHA Version: <br/>
                This is the contents of your drawing board right <br/>
                now and might not fully reflect the settings on the left.<br/>
                This will be fixed in future versions.</i>
            </fieldset>
          </form>
        </div>
      </div>
      <div class="drawable-modal-footer">
        <button @click="onYes" class="drawable-ui-accept" :disabled="!validation.valid">Save Drawing</button>
        <button @click="onNo" class="drawable-ui-decline">Cancel</button>
      </div>
      </div>
    `,

    name: "SaveDrawingDialog",
    components: { Preview },
    props: ["handler"],


    data() {

        const previewWidth = 300;
        const previewHeight = this.$store.state.drawing.dimensions.height * previewWidth / this.$store.state.drawing.dimensions.width

        return {
            name: "",
            description: "",
            previewWidth,
            previewHeight,
            previewVBWidth: this.$store.state.drawing.dimensions.width,
            previewVBHeight: this.$store.state.drawing.dimensions.height,
            arguments: this.$store.state.data.fields.map(field => {
                return {
                    description: "",
                    field,
                    public: false
                }
            }),
            publishedObjects: this.$store.state.drawing.objects
                .filter(object => object.type !== ObjectType.Canvas && !object.isGuide)
                .map(object => {
                    return {
                        use: true,
                        object
                    }
                }),
            validation: new ValidationResult(),
            validationActive: false,
            svgPreview: this.$store.state.drawing.preview
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
import preview from "../drawing/Preview.vue";


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
            res.error("publishedObjects", "Please select at least one object");
        }

        if (data.name.length === 0) {
            res.error("name", "Please enter a name");
        } else if (!data.name.match(/^[a-zA-Z][a-zA-Z0-9-_]+$/)) {
            res.error("name", "Start with a character, then a-z, A-Z, 0-9, - or _")
        }

        const nameExists = await API.doesNameExist(data.name);

        if (nameExists.data) {
            res.error("name", `${data.name} already exists`);
        }

        if (data.description.length === 0) {
            res.error("description", "Please provide a description");
        }

        return res;
    }
}