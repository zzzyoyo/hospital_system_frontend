<script>
import Information from './Information'
import Invite from './Invite'
import ContactState from './ContactState'
import Chair from './Chair'
import MyEssayState from "./MyEssayState";
import Audit from "./Audit";
export default {
  name: 'Personal',
  components:{
    Information,
    Invite,
    ContactState,
    Chair,
    MyEssayState,
    Audit
  },
  data(){
    return{
      name:'huiyi1',
      currentComponent:Information,
      currentContact:'',
      needContactName:false,//子组件是否需要会议名，默认个人页面不需要
      contacts:[{
        shortname:'会议1',
        fullname:'bababab会议',
        roles:['Chair']
      },{
        shortname:'会议2',
        fullname:'bababwwwab会议',
        roles:['Author']
      },{
        shortname:'会议3',
        fullname:'babsdfabab会议',
        roles:['Author','PCmember']
      },{
        shortname:'会议4',
        fullname:'babsdfabab会议',
        roles:['Chair']
      }]
    }
  },
  created:function(){
    this.$axios.post('/personal',{
      username:this.$store.state.userDetails
    })
    .then(resp => {
      if (resp.status === 200 && resp.data.hasOwnProperty("respContactData")){
        this.contacts = resp.data.respContactData
      }
      else{
        this.personalError()
        //alert('Personal error')
        console.log(resp)
      }
    })
    .catch(error => {
      if(error.response){
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      console.log(error.response)
      } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
      }
      console.log(error.config);
    })
  },
  methods:{
    personalError() {
      this.$message({
        showClose: true,
        message: 'Personal error',
        type: 'warning'
      });
    },
    
    information(){
      this.currentComponent = Information
    },
    contactState(){
      this.currentComponent = ContactState
    },
    invite(){
      this.currentComponent = Invite
    },
    logoff(){
        this.$confirm('此操作将永久删除当前用户, 是否继续?', '确认注销', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/logoff',{
            username: this.$store.state.userDetails
          })
          .then(resp => {
            if (resp.status === 200){
               this.$store.commit('logout')
               this.$message({
                 type: 'success',
                 message: '注销成功'
               })
               this.$router.replace({path:'/'})
            }
            else{
              this.$message.error('注销失败')
              console.log(error)
            }
          })
          .catch(error => {
            this.$message.error('注销失败')
            console.log(error)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '注销取消'
          });          
        });
    },
    transaction(fullname,role){
      //alert(shortname)
      //alert(role)
      this.needContactName = true
      this.currentContact = fullname
      if(role == 'Chair'){
        this.currentComponent = Chair
      }
      else if(role == 'PCmember'){
        //PCmember
        this.currentComponent = Audit
      }
      else if(role == 'Author'){
        //author
        this.currentComponent = MyEssayState
      }
      else{
        alert('invalid role')
      }
    }
  }
}
</script>

<template>
<div id = "Personal">
    <el-container>
  <el-header></el-header>
  <el-container>
    <el-aside width="200px">
        <el-menu>
        <el-menu-item index="information" @click='information'>我的个人信息</el-menu-item>
        <el-submenu index="transaction">
        <template slot="title">我参加的会议</template>
        <el-submenu v-for="contact in contacts" v-bind:index="contact.shortname" v-bind:key="'submenu'+contact.shortname">
          <template slot="title">{{contact.shortname}}</template>
          <el-menu-item v-for="role in contact.roles" v-bind:key="role+contact.shortname"  v-bind:index="role" @click='transaction(contact.fullname,role)'>{{role}}</el-menu-item>
        </el-submenu>
        </el-submenu>
        <el-menu-item index="contactState" @click='contactState'>我申请的会议</el-menu-item>
        <el-menu-item index="invite" @click='invite'>我受到的邀请</el-menu-item>
        <el-menu-item index="logoff" @click='logoff'>注销账号</el-menu-item>
      
    </el-menu>
    </el-aside>
    <el-main>
    <component v-if="needContactName" v-bind:is="currentComponent" :contactName='currentContact' :key='currentContact'></component>
    <component v-else v-bind:is="currentComponent" :key='currentContact'></component>    
    </el-main>
  </el-container>
  <el-footer></el-footer>
</el-container>
</div>
</template>

<style scoped>
    .el-header,.el-footer {
    background-color: #52658F;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #E8E8E8;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #F7F5E6;
    color: #333;
    text-align: center;
  }
  .el-container {
    min-height:460px;
  }  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
