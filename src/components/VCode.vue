<template>
  <div class="example">
    <codemirror
      v-model="codeValue"
      placeholder="Code goes here..."
      :style="{ height: '200px' }"
      :autofocus="false"
      :indent-with-tab="true"
      :tab-size="2"
      :disabled="$props.readonly"
      :extensions="extensions"
    />
  </div>
</template>

<script>
import { computed } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { basicSetup } from 'codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { langs } from '@uiw/codemirror-extensions-langs'
import { python } from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'

export default {
  name: 'VCode',
  props: {
    language: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  components: { Codemirror },
  computed: {
    codeValue: {
      get: function () {
        return this.code
      },
      set: function (value) {
        this.$emit('update:code', value)
      },
    },
  },

  setup(props) {
    const extensions = computed(() => {
      const result = [basicSetup, oneDark]
      switch (props.language) {
        case 'Python':
          result.push(python())
          break
        case 'Javascript':
          result.push(javascript())
          break
        case 'Shell':
          result.push(langs.shell())
          break
      }

      return result
    })

    return {
      extensions,
    }
  },
}
</script>
