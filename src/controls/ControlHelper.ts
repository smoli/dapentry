import Control from "sap/ui/core/Control";
import Element from "sap/ui/core/Element";
import RenderManager from "sap/ui/core/RenderManager";

export interface CNode {
    attr(name:string, value:any):CNode;
    class(name:string, doit:boolean):CNode;
    style(name:string, value:string):CNode;
    text(text:string):CNode;
    append(tag:string):CNode;
    appendControl(control:Control):CNode;
    appendElement(element:Element):CNode;
    render(rm:RenderManager);
}

export function C(tag, control):CNode {

    function CNode(tag, control = null):void {

        this.tag = tag;
        this.control = control;

        this.attributes = {};
        this.classes = [];
        this.styles = {};
        this.innertext = null;
        this.children = [];

        this.attr = (name, value) => {
            this.attributes[name] = value;
            return this;
        };

        this.class = (name, doit = true) => {
            if (doit) {
                this.classes.push(name);
            }
            return this;
        };

        this.style = (name, value) => {
            this.styles[name] = value;
            return this;
        };

        this.text = text => {
            this.innertext = text;
            return this;
        };

        this.append = (tag) => {
            if (this.control && !this.tag) {
                throw new Error("Controls cannot have children");
            }
            const n = new CNode(tag);
            this.children.push(n);
            return n;
        };

        this.appendControl = (control) => {
            if (this.control && !this.tag) {
                throw new Error("Controls cannot have children");
            }
            const n = new CNode(null, control);
            this.children.push(n);
            return n;
        };

        this.appendElement = (element, rendermethod) => {
            const n = new CNode(null, element);
            n.rendermethod = rendermethod;
            this.children.push(n);
            return n;
        };

        this.render = (oRm) => {
            if (this.tag) {
                oRm.write(`<${this.tag}`);
                if (this.control) {
                    oRm.writeControlData(this.control);
                }

                Object.keys(this.attributes).forEach(n => oRm.writeAttribute(n, this.attributes[n]));
                if (this.classes.length) {
                    this.classes.forEach(c => oRm.addClass(c));
                    oRm.writeClasses();
                }

                Object.keys(this.styles).forEach(n => oRm.addStyle(n, this.styles[n]));
                oRm.writeStyles();

                oRm.write(">");

            } else if (this.control) {
                if (this.rendermethod) {
                    this.control[this.rendermethod].call(this.control, oRm, this.control);
                } else {
                    oRm.renderControl(this.control);
                }
            }

            this.children.forEach(ch => ch.render(oRm));

            if (this.innertext) {
                oRm.write(this.innertext);
            }

            if (this.tag) {
                oRm.write(`</${this.tag}>`);
            }
        };

        return this;
    }

    return new CNode(tag, control) as CNode;
}