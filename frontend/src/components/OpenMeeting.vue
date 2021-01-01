//这个稿件包含会议信息，开启会议功能
<script>
export default{
    name:'OpenMeeting',
    props:{contactInformation:Object},
    data(){
        return{
            
        }
    },
  computed:{
      isDisabled(){
        return this.contactInformation.state >= 2
      }
  },
    created:function(){
    },
    methods:{
        open(){
        
          //this.contactInformation.state = 2
        this.$axios.post('/openMeeting',{
            contactFullName:this.contactInformation.fullname
        })
        .then(resp => {
            if (resp.status === 200){
                this.$message({
                message:'开启会议成功',
                type:'success'
                })
                this.contactInformation.state = 2
            }
            else{
              this.$message.error('开启会议失败')
              console.log(resp)
            }
        })
        .catch(error => {
              this.$message.error('开启会议失败')
            console.log(error)
        })
        }
    }
}
</script>

<template>
<div id='OpenMeeting'>
<el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>会议基本信息</span>
    <el-button style="float: right; padding: 3px 0" type="text" @click='open' :disabled='isDisabled'>开启会议</el-button>
  </div>
  <div class="text item">
    <em class="el-icon-s-opportunity"></em><strong>会议简称：</strong>{{contactInformation.shortname}}
  </div>
  <div class="text item">
   <em class="el-icon-s-opportunity"></em><strong>会议全称：</strong>{{contactInformation.fullname}}
  </div>
  <div class="text item">
    <em class="el-icon-date"></em><strong>投稿截止日期：</strong>{{contactInformation.deadline}}
  </div>
  <div class="text item">
    <em class="el-icon-date"></em><strong>结果发布日期：</strong>{{contactInformation.resultReleaseTime}}
  </div>
  <div class="text item">
    <em class="el-icon-date"></em><strong>举办时间：</strong>{{contactInformation.organizationTime}}
  </div>
  <div class="text item">
    <em class="el-icon-location"></em><strong>举办地点：</strong>{{contactInformation.place}}
  </div>
  <div class="text item">
    <em class="el-icon-notebook-2"></em><strong>会议话题：</strong>{{contactInformation.topic}}
  </div>
</el-card>

<el-steps :active="contactInformation.state" align-center finish-status="success" direction="vertical" style="padding:30px;">
  <el-step title="通过审核" description="通过审核之后才能开启会议"></el-step>
  <el-step title="开启会议" description="请进入【会议基本信息】开启会议：只能开启一次，开启后会议进入投稿状态"></el-step>
  <el-step title="开启初次审稿" description="请进入【程序委员会成员】开启审稿：开启审稿时该会议至少要有3位审稿人，开启后会议进入审稿状态"></el-step>
  <el-step title="发布初审结果" description="请进入【稿件基本情况】发布结果：必须在开启二次审稿之前发布结果，且所有稿件都审核完成"></el-step>
  <el-step title="终止驳斥提交" description="请进入【稿件基本情况】开启第二次审稿：必须在最终结果发布之前开启审稿"></el-step>
  <el-step title="发布最终结果" description="请进入【稿件基本情况】发布结果：必须在举办会议之前发布结果，且所有稿件都审核完成"></el-step>
  <el-step title="举办会议" description="发布结果后按照预定时间在预定地点举办线下会议"></el-step>
  <el-step title="结束会议" description=""></el-step>
</el-steps>
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

  .box-card {
    width: 350px;
    border-radius: 2px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .44), 0 0 6px rgba(0, 0, 0, .44);
    margin:auto;
    margin-top:30px;
    float:left;
  }
</style>