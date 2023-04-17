<template>
  <CCard class="mb-3">
    <CCardHeader>
      <h4>验证任务列表</h4>
    </CCardHeader>
    <CCardBody>
      <CTable align="middle" class="mb-0 border" hover responsive>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell>验证名称</CTableHeaderCell>
            <CTableHeaderCell>语言</CTableHeaderCell>
            <CTableHeaderCell>创建者</CTableHeaderCell>
            <CTableHeaderCell>创建时间</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow
            v-for="item in batchList"
            :key="item.id"
            @click="gotoInfo(item.id)"
          >
            <CTableDataCell>
              <div>{{ item.batchName }}</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{{ item.runtime }}</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{{ item.username }}</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{{ timeStr(item.createdAt) }}</div>
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
  name: 'ListTask',
  setup() {
    const batchList = ref([])
    return {
      batchList,
    }
  },
  mounted() {
    this.axios
      .get('http://localhost:8003/result')
      .then((response) => {
        console.log(response.data.data)
        this.batchList = response.data.data
      })
      .catch((error) => {
        alert('List failed, please try again!')
        console.log(error)
      })
  },
  methods: {
    timeStr(t) {
      moment.locale('zh-cn')
      return moment(t).fromNow()
    },
    gotoInfo(id) {
      this.$router.push({
        path: '/task',
        query: { id: id },
      })
    },
  },
}
</script>
