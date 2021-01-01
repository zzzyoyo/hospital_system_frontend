<template>
  <div id="base_register">
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
    <div class="banner-hny-info" style="padding: 10px" >
    <el-form :model="registerForm" :rules="rules" class="register_container" label-position="left"
             label-width="0px" v-loading="loading" :ref="registerForm">
      <h3 class="register_title">Register</h3>
      <el-form-item prop="username" >
        <el-input type="text" v-model="registerForm.username" 
                  auto-complete="off" placeholder="username,e.g. rjgc2020" ></el-input>
      </el-form-item>
      <el-form-item prop="password" >
        <el-input type="password" v-model="registerForm.password"
                  auto-complete="off" placeholder="password, e.g. rjgclab2"></el-input>
      </el-form-item>
      <el-form-item prop="email">
        <el-input type="email" v-model="registerForm.email"
                  auto-complete="off" placeholder="email" ></el-input>
      </el-form-item>
      <el-form-item prop="fullname">
        <el-input type="text" v-model="registerForm.fullname" 
                  auto-complete="off" placeholder="fullname"></el-input>
      </el-form-item>
      <el-form-item prop="sector" >
        <el-cascader v-model="registerForm.sector"
                     :options="sectorOption"
                     :props="{ expandTrigger: 'hover' }"
                     placeholder="sector"
                     style='width:100%'
                     :show-all-levels=false
        ></el-cascader>
      </el-form-item>
      <el-form-item prop="country" >
      <el-cascader v-model="registerForm.country"
                   :options="options"
                   :props="{ expandTrigger: 'hover' }"
                   placeholder="country"
                   style='width:100%'
                   :show-all-levels=false
      ></el-cascader>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-button type="primary" class="btn more mr-2" style="width: 30%;background: #afb4db;border: none" v-on:click="register(registerForm)">register</el-button>
      </el-form-item>
    </el-form>
    </div>
    <!-- //banner-hny-info -->
  </div>
  <!-- //banner slider -->
</div>
    
  </div>
</template>

<script>
import {usernameValid, passwordValid, emailValid} from '../assets/js/dataValid';
import {countries} from '../assets/js/countries';
import {sectors} from '../assets/js/sectors';

export default {
  name: 'Register',
  data () {
    return {
      registerForm: {
        username: '',
        password: '',
        fullname: '',
        email: '',
        sector:'',
        country:''
      },
      rules: {
        // blur 失去鼠标焦点时触发验证
        username: [{required: true, message: '', trigger: 'blur'}, {validator: usernameValid, trigger: 'blur'},{min: 5, max: 32, message: 'Please input 5-32 characters', trigger: 'blur'}],
        password: [{required: true, message: '', trigger: 'blur'}, {validator: passwordValid, trigger: 'blur'},{min: 6, max: 32, message: 'Please input 6-32 characters', trigger: 'blur'}],
        email: [{required: true, message: '', trigger: 'blur'}, {validator: emailValid, trigger: 'blur'}],
        fullname: [{required: true, message: '', trigger: 'blur'}]
      },
      loading: false,
      options:countries,
      sectorOption:sectors,
    }
  },
  methods: {
    userTypeChange() {
    },
    register(formName) {
      this.$refs[formName].validate(valid => {
        if(valid){
          this.$axios.post('/register', {
              username: this.registerForm.username,
              password: this.registerForm.password,
              fullname: this.registerForm.fullname,
              email: this.registerForm.email,
              sector: this.registerForm.sector,
              country: this.registerForm.country
            }
          )
            .then(resp => {
              // 根据后端的返回数据修改
              if(resp.status === 200 && resp.data.hasOwnProperty("id")) {
                // 跳转到login
                this.$message({
                  showClose: true,
                  message:'注册成功，快去登录吧',
                  type:'success'
                })
                this.$router.replace('/login')
              }
              else{
                this.$message.error('返回数据异常，注册失败')
              }
            })
            .catch(error => {
              if(error.response){
                if(error.response.status === 400){
                  this.$message.error('用户名已被使用，注册失败')
                  console.log(error.response.data)
                }
                else{
                  this.$message.error('注册失败')
                  console.log(error)
                }
              } else {
                     // Something happened in setting up the request that triggered an Error
                  this.$message.error('注册失败')
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

<style scoped>
  .register_container{
    border-radius: 15px;
    background-clip: padding-box;
    width: 500px;
    top:10px;
    margin:auto;
    margin-top:90px;
    padding:20px;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .register_title{
    margin-bottom:10px;
    text-align: center;
    color: #CCCCFF;
  }
  button{
    padding:0;
    height:35px;
    font-weight:600;
    box-shadow: 0 0 25px #cac6c6;
  }
</style>
