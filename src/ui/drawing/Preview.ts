export default {

    template: `
      <div v-html="fullSvgCode"/>`,

    name: "Preview",
    props: {
        svgCode: String,
        width: {
            type: Number,
            default: 100
        },
        height: {
            type: Number,
            default: 100
        },
        vbWidth: {
            type: Number,
            default: 1000
        },
        vbHeight: {
            type: Number,
            default: 1000
        }
    },

    computed: {

        fullSvgCode() {
            const pre = `<svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 ${this.vbWidth} ${this.vbHeight}"
                width="${this.width}" height="${this.height}">`

            const post = `</svg>`

            return pre + this.svgCode + post;
        }
    }
}
