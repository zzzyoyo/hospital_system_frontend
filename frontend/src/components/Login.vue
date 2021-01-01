<script>

export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{required: true, message: '', trigger: 'blur'}],
        password: [{required: true, message: '', trigger: 'blur'}]
      },
      loading: false
    }
  },
  methods: {
    login (formName,status) {
      this.$refs[formName].validate(valid => {
        if(valid){
          this.$axios.post('/login', {
        username: this.loginForm.username,
        password: this.loginForm.password,
        identity:status
      })
        .then(resp => {
          if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
            this.$message({
              showClose: true,
              message: '登录成功',
              type: 'success'
            })
            if(status == 'admin'){
            this.$store.commit('login', {
              data:resp.data,
              isAdmin:true
            })
              this.$router.replace({path:'/admin'})
            }else{
            this.$store.commit('login',{
              data:resp.data,
              isAdmin:false
            })
                this.$router.replace({path: this.$route.query.redirect?this.$route.query.redirect:'/'})
            }
          }
          else{
            this.$message.error('登录失败')
          }
        })
        .catch(error => {
          if(error.response){
            if(error.response.status === 404){
              this.$message.error('用户名不存在')
              console.log(error.response.data)
            }
            else if(error.response.status === 403){
              this.$message.error('密码错误')
              console.log(error.response.data)
            }
            else{
              this.$message.error('登录失败')
            }
            console.log(error)
          }
          else{
            this.$message.error('登录失败')
            // Something happened in setting up the request that triggered an Error
            console.log(error)
          }
          
        })
        } else {
          this.$message.error('请提交正确的格式')
        }
      })
    }
  }
}
</script>

<template>
  <div id="base_login">
  <div id="home">
  <!-- banner slider -->
  <div id="homepage-slider" class="st-slider">
    <input type="radio" class="cs_anchor radio" name="slider" id="play1" checked="" />
    <input type="radio" class="cs_anchor radio" name="slider" id="slide1" />
    <input type="radio" class="cs_anchor radio" name="slider" id="slide2" />
    <input type="radio" class="cs_anchor radio" name="slider" id="slide3" />
    <div class="images">
      <div class="images-inner">
        <div class="image-slide">
          <div class="banner-w3pvt-1">
            <div class="overlay-w3ls">

            </div>

          </div>
        </div>
        <div class="image-slide">
          <div class="banner-w3pvt-2">
            <div class="overlay-w3ls">

            </div>
          </div>
        </div>
        <div class="image-slide">
          <div class="banner-w3pvt-3">
            <div class="overlay-w3ls">

            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="labels">
      <div class="fake-radio">
        <label for="slide1" class="radio-btn"></label>
        <label for="slide2" class="radio-btn"></label>
        <label for="slide3" class="radio-btn"></label>
      </div>
    </div>
             <!-- banner-hny-info -->
    <div class="banner-hny-info" style="padding-top: 150px" >
    <el-form :model="loginForm"
             :rules="rules"
             class="login_container"
             label-position="left"
             label-width="0px"
             v-loading="loading"
             :ref="loginForm">
      <h3 class="login_title">Login</h3>
      <el-form-item prop="username" >
        <el-input type="text"
                  v-model="loginForm.username"
                  auto-complete="off"
                  placeholder="username"></el-input>
      </el-form-item>
      <el-form-item prop="password" >
        <el-input type="password"
                  v-model="loginForm.password"
                  auto-complete="off"
                  placeholder="password"></el-input>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button type="primary"
                   class="btn more mr-2"
                   style="width: 30%;background: #afb4db;border: none;font-size:15px;font-weight:600"
                   v-on:click="login(loginForm,'user')"><em class="el-icon-user-solid"></em>UserLogin</el-button>
        <el-button type="primary"
                   class="btn more mr-2"
                   style="width: 30%;background: #afb4db;border: none;font-size:15px;font-weight:600"
                   v-on:click="login(loginForm,'admin')"><em class="el-icon-s-custom"></em>AdminLogin</el-button>

          <el-button type="primary"
                   class="btn more mr-2"
                     style="width: 25%;background: #afb4db;border: none;font-size:15px;font-weight:600"><router-link to="register"
                     style="text-decoration: none;color: #232323; font-size:15px">register</router-link></el-button>

      </el-form-item>
    </el-form>
    </div>
    <!-- //banner-hny-info -->
  </div>
  <!-- //banner slider -->
</div>
    
  </div>

</template>



<style scoped>
  body{
    margin: 0px;
    padding: 0px;
  }
  .login_container{
    border-radius: 15px;
    background-clip: padding-box;
    margin: auto;
    padding:20px;
    width: 500px;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .login_title {
    margin: 10px auto 20px auto;
    text-align: center;
    color: #CCCCFF;
  }
  button{
    padding:0;
    margin:15px;
    height:35px;
    box-shadow: 0 0 25px #cac6c6;
  }
</style>
