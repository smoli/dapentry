<template>
  <!--  <samp class="drawable-statement-preview">{{ selectedLine }}</samp>-->
  <div class="drawable-statement-editor">
    <component v-for="segment of segments" :is="segment.type" :content="segment"></component>
  </div>
</template>

<script lang="ts">
import Static from "./Static.vue";
import {Parser, Token, TokenTypes} from "../../runtime/interpreter/Parser";
import {getTextIdForTokens} from "../core/GetTextIdForTokens";
import {UNREACHABLE} from "../../core/Assertions";
import SimpleInput from "./SimpleInput.vue";
import NumberInput from "./NumberInput.vue";
import PointInput from "./PointInput.vue";


function createSegments(tokens: Array<Token>, textTemplate: string): Array<any> {
  if (!tokens || !tokens.length) {
    return []
  }

  const t = textTemplate;

  const matches = t.match(/([\w\s]+|\{\d+\})/g);

  const segments = [];

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i]
    if (m[0] == "{") {
      const index = Number(m.match(/(\d+)/)[0]);
      const token = tokens[index];

      switch (token.type) {
        case TokenTypes.REGISTER:
          segments.push({ type: "SimpleInput", token, index });
          break;
        case TokenTypes.REGISTERAT:
          segments.push({ type: "SimpleInput", token, index });
          break;
        case TokenTypes.NUMBER:
          segments.push({ type: "NumberInput", token, index });
          break;
        case TokenTypes.STRING:
          segments.push({ type: "SimpleInput", token, index });
          break;
        case TokenTypes.POINT:
          segments.push({ type: "PointInput", token, index });
          break;
        case TokenTypes.ARRAY:
          segments.push({ type: "SimpleInput", token, index });
          break;
        case TokenTypes.EXPRESSION:
          segments.push({ type: "SimpleInput", token, index });
          break;

        default:
          UNREACHABLE("Unsupported token type " + TokenTypes[token.type]);
      }
    } else {
      segments.push({ type: "Static", value: m });
    }
  }

  return segments;
}


export default {
  name: "StatementEditor",
  components: { PointInput, NumberInput, SimpleInput, Static },
  computed: {
    segments() {
      const selection: Array<number> = this.$store.state.code.selectedLines;

      if (selection.length !== 1) {
        return { text: "NO" };
      }

      const code = this.$store.state.code.code;
      const codeLine = code[selection[0]];

      const tokens = Parser.parseLine(codeLine);
      const textID = getTextIdForTokens(tokens);


      return createSegments(tokens, this.$i18n.tm("statements." + textID))
    }
  }
}
</script>
