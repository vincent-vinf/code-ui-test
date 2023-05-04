<template>
  <CCard class="mb-3">
    <CCardHeader>
      <h4>验证任务详情</h4>
    </CCardHeader>
    <CCardBody>
      <CCol sm="auto">
        <CFormLabel class="col-form-label"
          >验证名称： {{ batchName }}</CFormLabel
        >
      </CCol>
      <CCol sm="auto">
        <CFormLabel class="col-form-label">语言： {{ runtime }}</CFormLabel>
      </CCol>
      <CCol sm="auto">
        <CFormLabel class="col-form-label"
          >任务创建者： {{ username }}</CFormLabel
        >
      </CCol>
      <CCol sm="auto">
        <CFormLabel class="col-form-label"
          >创建时间： {{ timeStr(createAt) }}</CFormLabel
        >
      </CCol>
      <CTable align="middle" class="mb-0 border" hover responsive>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell>子验证名称</CTableHeaderCell>
            <CTableHeaderCell>状态</CTableHeaderCell>
            <CTableHeaderCell>结果</CTableHeaderCell>
            <CTableHeaderCell>消息</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow
            v-for="item in subtasks"
            :key="item.id"
            @click="gotoInfo(item.id)"
          >
            <CTableDataCell>
              <div>{{ item.verificationName }}</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{{ item.status }}</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{{ item.result }}</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{{ item.message }}</div>
            </CTableDataCell>
          </CTableRow>
          <CTableRow></CTableRow>
        </CTableBody>
      </CTable>
    </CCardBody>
  </CCard>
</template>

<script>
import { ref } from 'vue'
import moment from 'moment'
export default {
  name: 'Detail',
  setup() {
    const batchName = ref('')
    const username = ref('')
    const runtime = ref('')
    const createAt = ref('')
    const subtasks = ref([])
    return {
      batchName,
      runtime,
      username,
      createAt,
      subtasks,
    }
  },
  mounted() {
    if (this.$route.query.id === undefined) {
      this.$router.replace({
        path: '/task/list',
      })
      return
    }
    this.axios
      .get('http://localhost:8003/api/result/' + this.$route.query.id)
      .then((response) => {
        console.log('task:', response.data.data)
        this.subtasks = response.data.data.subTasks
        this.batchName = response.data.data.batchName
        this.runtime = response.data.data.runtime
        this.username = response.data.data.username
        this.createAt = response.data.data.createdAt
      })
      .catch((error) => {
        alert('get task, please try again!')
        console.log(error)
      })
  },
  methods: {
    gotoInfo() {},
    timeStr(t) {
      moment.locale('zh-cn')
      return moment(t).fromNow()
    },
  },
}
</script>
