<template>
  <CCard>
    <CCardHeader>
      <CRow>
        <CCol>
          {{ actionName }}
        </CCol>
        <CCol sm="auto">
          <CCloseButton v-if="!readonly && close" @click="close" />
        </CCol>
      </CRow>
    </CCardHeader>
    <CCardBody>
      <VCode
        :language="language"
        v-model:code="codeValue"
        :readonly="readonly"
      ></VCode>
      <ul class="list-group list-group-flush">
        <li
          class="list-group-item"
          v-for="(f, index) in filesValue"
          :key="f.name + '-' + f.ossPath"
        >
          <div class="row">
            <div class="col">{{ f.name }}</div>
            <div class="col">{{ f.path }}</div>
            <CCloseButton
              sm="auto"
              v-if="!readonly"
              @click="filesValue.splice(index, 1)"
            />
          </div>
        </li>
        <li class="list-group-item">
          <CButton
            color="primary"
            @click="fileUploaderVisible = true"
            v-if="!readonly"
            >添加文件映射
          </CButton>
        </li>
      </ul>
    </CCardBody>
  </CCard>
  <CModal :visible="fileUploaderVisible" @close="closeSelector">
    <CModalHeader>
      <CModalTitle>添加文件</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm>
        <CFormInput
          type="text"
          id="filePath"
          placeholder="path/to/example.txt"
          text="文件挂载路径"
          v-model="path"
        />

        <div style="padding-top: 20px"></div>
        <CFormInput type="file" id="formFile" @change="getFile" />
      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="closeSelector"> 取消</CButton>
      <CButton color="primary" @click="uploadFile">上传</CButton>
    </CModalFooter>
  </CModal>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Action',
  props: {
    actionName: {
      type: String,
      required: true,
    },
    close: {
      type: Function,
    },
    language: {
      type: String,
      default: 'Shell',
    },
    code: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    files: {
      type: Array,
    },
  },
  computed: {
    codeValue: {
      get: function () {
        return this.code
      },
      set: function (value) {
        this.$emit('update:code', value)
      },
    },
    filesValue: {
      get: function () {
        return this.files
      },
      set: function (value) {
        this.$emit('update:files', value)
      },
    },
  },
  setup() {
    const fileUploaderVisible = ref(false)
    return {
      fileUploaderVisible,
      file: null,
      path: '',
    }
  },
  methods: {
    closeSelector() {
      this.fileUploaderVisible = false
      this.file = null
      this.path = ''
    },
    getFile(e) {
      this.file = e.target.files
    },
    uploadFile() {
      if (this.file === null || this.file.length === 0) {
        alert('Please select a file first!')
        return
      }
      let f = this.file[0]
      let formData = new FormData()
      formData.append('file', f)
      this.axios
        .post('http://localhost:8001/batch/file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          console.log('upload: ', res.data)
          this.filesValue.push({
            path: this.path,
            name: f.name,
            ossPath: res.data.data,
          })
          this.closeSelector()
        })
        .catch((error) => {
          alert('Upload failed, please try again!')
          console.log(error)
        })
    },
  },
}
</script>

<style scoped></style>
