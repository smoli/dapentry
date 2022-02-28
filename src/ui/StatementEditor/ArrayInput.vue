<template>
  <span class="drawable-array-input">

    <span v-if="listMode"
          @dragenter="onDragEnter"
          @dragover="onDragOver"
          @drop="onDrop">
      <button class="drawable-array-input-iterator" v-if="itemCount > 1" @click="prevIndex">&lt;</button>
      <component :is="displayedSegment.type"
                 :content="displayedSegment" @change="onChange"></component>
      <button class="drawable-array-input-iterator" v-if="itemCount > 1" @click="nextIndex">&gt;</button>
      <span class="drawable-array-input-index">{{ displayedIndex }}/{{ itemCount }}</span>
    </span>
    <span v-else>
      <GrowingInput :value="placeHolder"
                    @focus="onSingleRepFocus"
                    @change="onSingleRepChange"
                    @dragenter="onDragEnter"
                    @dragover="onDragOver"
                    @drop="onDrop"/>
<!--      <button @click="onSwitchMode">&hellip;</button>-->
    </span>
  </span>
</template>

<script lang="ts">
import NumberInput from "./NumberInput.vue";
import {createSegmentInfoForToken} from "./createSegments";
import AtRegisterInput from "./AtRegisterInput.vue";
import PointInput from "./PointInput.vue";
import SimpleInput from "./SimpleInput.vue";
import StringInput from "./StringInput.vue";
import ExpressionInput from "./ExpressionInput.vue";
import Static from "./Static.vue";
import GrowingInput from "./GrowingInput.vue";
import {deSerializeDNDInfo, DnDDataType, makeDnDHandlers} from "../dnd/DnDInfo";


export default {
  name: "ArrayInput",
  components: { GrowingInput, AtRegisterInput, PointInput, NumberInput, StringInput, SimpleInput, ExpressionInput, Static },
  props: ["content"],
  inject: ["controller"],

  data() {
    return {
      displayedIndex: 0,
      listMode: false
    }
  },

  computed: {
    placeHolder() {
        return `List(${this.content.token.value.length})`
    },

    displayedSegment() {
      return createSegmentInfoForToken(
          this.content.token.value[this.displayedIndex],
          this.content.statementIndex,
          [...this.content.subIndexes, this.displayedIndex])
    },
    itemCount() {
      if (!this.content) {
        return 0;
      }
      return this.content.token.value.length;
    }
  },

  methods: {
    onSwitchMode() {
        this.listMode = !this.listMode;
    },

    prevIndex() {
      if (this.displayedIndex > 0) {
        this.displayedIndex -= 1;
      }
    },

    nextIndex() {
      if (this.displayedIndex < this.content.token.value.length - 1) {
        this.displayedIndex += 1;
      }
    },

    onSingleRepFocus(event) {
        event.target.value = "";
    },

    onSingleRepChange(event) {
      if (event.target.value === "") {
        return;
      }
      this.controller.updateStatement(this.content.statementIndex, this.content.subIndexes, event.target.value);
    },

    ...makeDnDHandlers(function (event: DragEvent) {
      event.preventDefault();
      const info = deSerializeDNDInfo(event.dataTransfer.getData(DnDDataType.ArrayRegister));
      this.controller.updateStatement(this.content.statementIndex, this.content.subIndexes, info.value1);
    }, DnDDataType.ArrayRegister),
  }
}
</script>
