<template>
  <button @click="createBatch">xxxx</button>
</template>

<script>
export default {
  name: 'ListBatch',
  setup() {
    return {}
  },
  mounted() {
    let id = ''
    if (this.$route.query.batchID !== undefined) {
      id = '/' + this.$route.query.id
    }
    this.axios
      .get('http://localhost:8001/batch' + id)
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        alert('Creation failed, please try again!')
        console.log(error)
      })
  },
  methods: {},
}
</script>
