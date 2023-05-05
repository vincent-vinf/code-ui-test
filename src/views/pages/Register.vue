<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="9" :lg="7" :xl="6">
          <CCard class="mx-4">
            <CCardBody class="p-4">
              <CForm>
                <h1>Register</h1>
                <p class="text-medium-emphasis">Create your account</p>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Username"
                    autocomplete="username"
                    v-model="username"
                  />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput
                    placeholder="Email"
                    autocomplete="email"
                    v-model="email"
                  />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder="Password"
                    autocomplete="new-password"
                    v-model="password"
                  />
                </CInputGroup>
                <CInputGroup class="mb-4">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder="Repeat password"
                    autocomplete="new-password"
                    v-model="repeat"
                  />
                </CInputGroup>
                <div class="d-grid">
                  <CButton color="success" @click="register"
                    >Create Account</CButton
                  >
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'Register',
  setup() {
    return {
      username: '',
      email: '',
      password: '',
      repeat: '',
    }
  },
  methods: {
    register() {
      if (this.username === '') {
        alert('username can not be empty!')
        return
      }
      if (this.password === '') {
        alert('password can not be empty!')
        return
      }
      if (this.password !== this.repeat) {
        alert('passwords do not match!')
        return
      }
      if (this.email === '') {
        alert('email can not be empty!')
        return
      }

      this.axios
        .post('http://localhost:8002/api/user/register', {
          username: this.username,
          email: this.email,
          passwd: this.password,
        })
        .then((res) => {
          localStorage.setItem('authToken', res.data.token)
          this.$router.replace({
            path: '/batch/list',
          })
        })
        .catch(function (error) {
          console.log(error)
          alert('register failed!')
        })
    },
  },
}
</script>
