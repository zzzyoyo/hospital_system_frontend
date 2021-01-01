<script>
export default {
  name: 'Information',
  data(){
    return{
      personalInformation:{}
    }
  },
    created:function(){
        this.$axios.post('/personalInformation',{
            username:this.$store.state.userDetails
        })
        .then(resp => {
            if (resp.status === 200 && resp.data.hasOwnProperty("personalInformation")){
                this.personalInformation = resp.data.personalInformation
            }
            else{
                console.log('个人信息加载失败')
                console.log(resp)
            }
        })
        .catch(error => {
            console.log(error)
        })
    },
  methods:{
    
  }

}
</script>

<template>
<div id = "Information">

<el-card class="box-card">
  <div slot="header" class="clearfix">
    <span><strong><em class="el-icon-postcard"></em>基本信息</strong></span>
  </div>
  <div class="text item">
    <em class="el-icon-user-solid"></em><strong>用户名：</strong>{{personalInformation.username}}
  </div>
  <div class="text item">
   <em class="el-icon-user"></em><strong>姓名：</strong>{{personalInformation.fullname}}
  </div>
  <div class="text item">
    <em class="el-icon-message"></em><strong>邮箱：</strong>{{personalInformation.email}}
  </div>
  <div class="text item">
    <em class="el-icon-place"></em><strong>单位：</strong>{{personalInformation.sector}}
  </div>
  <div class="text item">
    <em class="el-icon-location-information"></em><strong>区域：</strong>{{personalInformation.country}}
  </div>
</el-card>
</div>
</template>

<style scoped>
  .text {
    font-size: 14px;
    text-align:left;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .clearfix{
    font-size:20px;
  }
  .box-card {
    width:350px;
    border-radius: 2px;
    border-color:#333A56;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .44), 0 0 6px rgba(0, 0, 0, .44);
    margin:auto;
    margin-top:50px;
  }
</style>