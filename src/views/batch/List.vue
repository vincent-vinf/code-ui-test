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
    console.log(this.$route.query.batchID !== undefined)
    console.log(this.$route.query.batchID)
    this.axios
      .get('http://localhost:8001/batch/' + this.$route.query.batchID)
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
