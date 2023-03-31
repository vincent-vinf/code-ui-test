<template>
  <CCard class="mb-3">
    <CCardHeader>
      <h4>创建验证</h4>
    </CCardHeader>
    <CCardBody>
      <CRow>
        <CCol sm="auto">
          <CFormLabel for="caseFile" class="col-form-label"
            >验证名称：
          </CFormLabel>
        </CCol>

        <CCol sm="auto">
          <CFormInput
            placeholder="Name"
            v-model="batchName"
            aria-label="Name"
          />
        </CCol>
      </CRow>

      <CFormLabel for="runtime" class="col-form-label">运行时：</CFormLabel>
      <CFormSelect
        id="runtime"
        v-model="code.runtime"
        :options="runtimeSelector"
      >
      </CFormSelect>
      <div style="padding-top: 10px"></div>
      <CCard class="mb-3">
        <CCardHeader v-if="code.code">
          <strong>基础验证项</strong>
        </CCardHeader>
        <CCardBody>
          <CCardGroup>
            <Action
              v-model:code="code.code.init.command"
              v-model:files="code.code.init.files"
              action-name="初始化"
            ></Action>

            <Action
              v-model:code="code.code.verify"
              v-model:files="code.code.files"
              action-name="验证"
            ></Action>
          </CCardGroup>
          <div style="padding-top: 15px"></div>
          <CFormLabel for="caseFile" class="col-form-label"
            >测试样例数量：
            <CBadge color="primary">{{ code.code.cases.length }}</CBadge>
          </CFormLabel>
          <div style="padding-top: 12px"></div>

          <CRow>
            <CCol sm="auto">
              <CFormLabel for="caseFile" class="col-form-label"
                >测试样例文件：
              </CFormLabel>
            </CCol>
            <CCol>
              <CFormInput type="file" id="caseFile" @change="getFile" />
            </CCol>
            <CCol sm="auto">
              <CButton color="primary" @click="uploadCaseFile"
                >上传测试样例
              </CButton>
            </CCol>
          </CRow>

          <div style="padding-top: 12px"></div>
          <CRow>
            <CCol sm="auto">
              <CFormLabel for="caseFile" class="col-form-label"
                >测试样例：
              </CFormLabel>
            </CCol>
            <CCol xs>
              <CFormInput
                placeholder="Name"
                v-model="caseName"
                aria-label="Name"
              />
            </CCol>
            <CCol xs>
              <CFormInput
                placeholder="Input"
                v-model="caseInput"
                aria-label="Input"
              />
            </CCol>
            <CCol xs>
              <CFormInput
                placeholder="Output"
                v-model="caseOutput"
                aria-label="Output"
              />
            </CCol>
            <CCol sm="auto">
              <CButton color="primary" @click="uploadCase"
                >添加测试样例
              </CButton>
            </CCol>
          </CRow>
          <div style="padding-top: 10px"></div>
        </CCardBody>
      </CCard>
      <CCard class="mb-3">
        <CCardHeader><strong>自定义验证项</strong></CCardHeader>
        <CCardBody>
          <CRow :xs="{ cols: 1, gutter: 4 }" :md="{ cols: 3 }">
            <CCol xs v-for="(v, index) in customs" :key="v.name">
              <Action
                v-model:code="v.custom.command"
                v-model:files="v.custom.files"
                :action-name="v.name"
                :close="
                  () => {
                    customs.splice(index, 1)
                  }
                "
              ></Action>
            </CCol>
            <CCol xs>
              <CCard class="h-100">
                <CCardHeader>添加自定义验证项</CCardHeader>
                <CCardBody>
                  <CForm>
                    <CFormInput
                      type="text"
                      label="验证项名称："
                      placeholder="e.g. Lint"
                      v-model="addCustomName"
                    />
                    <div style="padding-top: 10px"></div>
                    <CButton color="primary" @click="addCustom">确定</CButton>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <div class="d-grid col-3 mx-auto">
        <button type="button" class="btn btn-primary" @click="createBatch()">
          创建
        </button>
      </div>
    </CCardBody>
  </CCard>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Cards',
  setup() {
    const code = ref({
      name: 'Basic verification',
      runtime: 'Python',
      code: {
        init: {
          name: 'test',
          command: 'ls /',
          files: [],
        },
        cases: [],
        files: [],
        verify: 'code-match match ./output ./answer',
      },
    })
    const customs = ref([])
    return {
      caseFile: null,
      addCustomName: '',
      code,
      customs,
      runtimeSelector: [
        { label: 'Python' },
        { label: 'Javascript' },
        { label: 'Golang' },
      ],
      batchName: '',
      caseInput: '',
      caseOutput: '',
      caseName: '',
      caseUUID: '',
    }
  },
  methods: {
    createBatch() {
      if (this.batchName === '') {
        alert('Name is required!')
        return
      }
      let req = {
        name: this.batchName,
        verifications: [],
      }

      if (this.code.code.cases.length !== 0) {
        req.verifications.push(this.code)
      }

      for (let index = 0; index < this.customs.length; index++) {
        this.customs[index].runtime = this.code.runtime
        this.customs[index].custom.name = this.customs[index].name
        req.verifications.push(this.customs[index])
      }

      console.log(req)
      if (req.verifications.length === 0) {
        alert(
          'The basic verification item does not specify a case and no custom verification item is created',
        )
        return
      }
      this.axios
        .post('http://localhost:8001/batch', req)
        .then((response) => {
          console.log(response.data)
          this.$router.replace({
            path: '/batch',
            query: { id: response.data.data.id },
          })
        })
        .catch((error) => {
          alert('Creation failed, please try again!')
          console.log(error)
        })
    },
    addCustom() {
      if (this.addCustomName === '') {
        alert('Please specify a name first!')
        return
      }
      for (const elem of this.customs) {
        if (elem.name === this.addCustomName) {
          alert('Verification item names cannot be repeated!')
          return
        }
      }
      this.customs.push({
        name: this.addCustomName,
        runtime: '',
        custom: {
          command: '',
          files: [],
        },
      })
    },
    uploadCase() {
      if (this.caseName === '') {
        alert('Please specify the test case name!')
        return
      }
      if (this.caseOutput === '') {
        alert('Please specify at least the output!')
        return
      }

      this.axios
        .post(
          'http://localhost:8001/batch/case',
          [
            {
              name: this.caseName,
              input: this.caseInput,
              output: this.caseOutput,
            },
          ],
          {
            params: {
              uuid: this.caseUUID,
            },
          },
        )
        .then((res) => {
          console.log('upload: ', res.data.data.cases)
          this.caseUUID = res.data.data.uuid
          this.addCasesToArray(res.data.data.cases)
        })
        .catch((error) => {
          alert('Upload case failed, please try again!')
          console.log(error)
        })
    },
    uploadCaseFile() {
      if (this.caseFile === null || this.caseFile.length === 0) {
        alert('Please select a file first!')
        return
      }
      let f = this.caseFile[0]
      let formData = new FormData()
      formData.append('file', f)
      this.axios
        .post('http://localhost:8001/batch/case/file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: {
            uuid: this.caseUUID,
          },
        })
        .then((res) => {
          console.log('upload: ', res.data.data.cases)
          this.caseUUID = res.data.data.uuid
          this.addCasesToArray(res.data.data.cases)
        })
        .catch((error) => {
          alert('Upload case file failed, please try again!')
          console.log(error)
        })
    },
    login() {
      this.axios
        .post('http://localhost:8002/user/login', {
          email: 'g@qq.com',
          passwd: '123',
        })
        .then((res) => {
          localStorage.setItem('authToken', res.data.token)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    getFile(e) {
      this.caseFile = e.target.files
    },
    addCasesToArray(cases) {
      for (const elem of cases) {
        this.code.code.cases.push({
          Name: elem.Name,
          In: { ossPath: elem.In.ossPath },
          Out: { ossPath: elem.Out.ossPath },
        })
      }

      console.log(this.code.code.cases)
    },
  },
  mounted() {
    this.login()
  },
}
</script>
