//这个组件为中间组件，包含会议状态以及多个与chair身份相关的子组件
<script>
import OpenMeeting from './OpenMeeting'
import PCmembers from './PCmembers'
import Essays from './Essays'

export default{
    name: 'Chair',
    props:['contactName'],
    components:{
      OpenMeeting,
      PCmembers,
      Essays
    },
    data(){
        return{
            activeName:'openMeeting',
            contactInformation:{
              shortname:'shortname',
              fullname:'fullname',
              deadline:'2020-12-08',
              resultReleaseTime:'2021-1-1',
              organizationTime: '2021-2-1',
              place: 'China',
              state:1,
              topic:'computer/network/biology'
            }
        }
    },
    watch:{
    },
    created:function(){
      this.$axios.post('/contactInformation',{
            contactFullName:this.contactName
        })
        .then(resp => {
            if (resp.status === 200 && resp.data.hasOwnProperty("contactInformation")){
                this.contactInformation = resp.data.contactInformation
            }
            else{
                console.log('会议信息加载失败')
            }
        })
        .catch(error => {
            console.log(error)
        })
    },
    methods:{
      handleClick(tab, event) {
        //console.log(tab, event);
      }
    }
}
</script>

<template>
<div id="Chair">
  <h3 style="margin:10px;">{{contactName}}</h3>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="会议基本信息" name="openMeeting" ><OpenMeeting :contactInformation='contactInformation'></OpenMeeting></el-tab-pane>
    <el-tab-pane label="程序委员会成员" name="PCmember"><PCmembers :contactName='contactName'  :state="contactInformation.state" v-on:startReview='contactInformation.state = 3' ></PCmembers></el-tab-pane>
    <el-tab-pane label="稿件基本情况" name="lll" ><Essays :contactName='contactName'  :state="contactInformation.state" v-on:releaseResult='contactInformation.state = 4' v-on:releaseSecondResult='contactInformation.state = 6' v-on:endRebuttal='contactInformation.state = 5'></Essays></el-tab-pane>
  </el-tabs>
</div>
</template>

<style scoped>
  .el-input {
    width: 70%;
  }
  label{
    margin:0;
  }
  h4{
    margin:10px
  }
  >>> .el-collapse-item__header{
    padding-left:10px;
  }
</style>