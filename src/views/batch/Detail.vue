<template>
  <CCard class="mb-3">
    <CCardHeader>
      <h4>验证详情</h4>
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
            readonly
            aria-label="Name"
          />
        </CCol>
      </CRow>
      <div style="padding-top: 10px"></div>
      <CRow>
        <CCol sm="auto">
          <CFormLabel for="caseFile" class="col-form-label">描述：</CFormLabel>
        </CCol>
        <CCol>
          <CFormTextarea
            placeholder="Describe"
            v-model="batchDescribe"
            readonly
            aria-label="Describe"
          />
        </CCol>
      </CRow>

      <CFormLabel for="runtime" class="col-form-label"
        >运行时：{{ runtime }}
      </CFormLabel>
      <div style="padding-top: 10px"></div>
      <CCard class="mb-3" v-if="code !== undefined">
        <CCardHeader>
          <strong>基础验证项</strong>
        </CCardHeader>
        <CCardBody>
          <CCardGroup>
            <Action
              v-model:code="code.init.command"
              v-model:files="code.init.files"
              action-name="初始化"
              readonly
            ></Action>

            <Action
              v-model:code="code.verify"
              v-model:files="code.files"
              readonly
              action-name="验证"
            ></Action>
          </CCardGroup>
          <div style="padding-top: 15px"></div>
          <CFormLabel for="caseFile" class="col-form-label"
            >测试样例数量：
            <CBadge color="primary">{{ code.cases.length }}</CBadge>
          </CFormLabel>
        </CCardBody>
      </CCard>
      <CCard class="mb-3" v-if="customs.length > 0">
        <CCardHeader><strong>自定义验证项</strong></CCardHeader>
        <CCardBody>
          <CRow :xs="{ cols: 1, gutter: 4 }" :md="{ cols: 3 }">
            <CCol xs v-for="(v, index) in customs" :key="v.name">
              <Action
                v-model:code="v.command"
                v-model:files="v.files"
                :action-name="v.name"
                readonly
                :close="
                  () => {
                    customs.splice(index, 1)
                  }
                "
              ></Action>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <div class="d-grid col-3 mx-auto">
        <button type="button" class="btn btn-primary" @click="openSelector">
          创建验证任务
        </button>
      </div>
    </CCardBody>
  </CCard>
  <CModal :visible="createVisible" @close="closeSelector">
    <CModalHeader>
      <CModalTitle>创建验证任务</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <VCode :language="runtime" v-model:code="codeValue"></VCode>
    </CModalBody>
    <CModalFooter>
      <CButton color="primary" @click="create">确认</CButton>
    </CModalFooter>
  </CModal>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Detail',
  setup() {
    const code = ref({
      init: {
        name: 'test',
        command: 'ls /',
        files: [],
      },
      cases: [],
      files: [],
      verify: 'code-match match ./output ./answer',
    })
    const customs = ref([])
    const batchName = ref('')
    const batchDescribe = ref('')
    const runtime = ref('')
    const createVisible = ref(false)
    const codeValue = ref('')

    return {
      code,
      customs,
      batchName,
      batchDescribe,
      runtime,
      createVisible,
      codeValue,
    }
  },
  mounted() {
    if (this.$route.query.id === undefined) {
      this.$router.replace({
        path: '/batch/list',
      })
      return
    }
    this.axios
      .get('http://localhost:8001/api/batch/' + this.$route.query.id)
      .then((response) => {
        console.log('batch:', response.data.data)
        this.batchID = response.data.data.id
        this.batchName = response.data.data.name
        this.batchDescribe = response.data.data.describe
        this.runtime = response.data.data.runtime
        let c = undefined
        for (const elem of response.data.data.verifications) {
          let v = JSON.parse(elem.Data)
          if (v.code !== undefined) {
            c = v.code
          } else if (v.custom !== undefined) {
            this.customs.push(v.custom)
          }
        }
        this.code = c
      })
      .catch((error) => {
        alert('get batch, please try again!')
        console.log(error)
      })
  },
  methods: {
    openSelector() {
      this.createVisible = true
    },
    closeSelector() {
      this.createVisible = false
      this.codeValue = ''
    },
    create() {
      if (this.codeValue === '') {
        alert('empty!')
        return
      }
      let req = {
        batchID: this.batchID,
        code: this.codeValue,
      }
      console.log(req)
      this.axios
        .post('http://localhost:8001/api/batch/task', req)
        .then((response) => {
          console.log('task:', response.data.data)
          this.$router.push({
            path: '/task',
            query: { id: response.data.data.id },
          })
        })
        .catch((error) => {
          alert('Crexx try again!')
          console.log(error)
        })
    },
  },
}
</script>
