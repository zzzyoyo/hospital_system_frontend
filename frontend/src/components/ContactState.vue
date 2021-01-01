<script>
export default {
  name: 'ContactState',
  data(){
    return{
      //这个会议的状态： 审核中、已通过、已驳回
      myContactState:[
        ],

    }
  },
  created: function () {
    this.$axios.post('/userContactState', {
      username: this.$store.state.userDetails
    })
      .then(resp => {
        if (resp.status === 200 && resp.data.hasOwnProperty("myContactStateDelivered")) {
          this.myContactState = resp.data.myContactStateDelivered
        } else {
          this.contactStateError()
            console.log(resp)
        }
      })
      .catch(error => {
        if (error.response) {
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          console.log(error.response)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
        }
        console.log(error.config);
      })
  },
  methods: {
    contactStateError() {
      this.$message({
        showClose: true,
        message: 'contactState error',
        type: 'warning'
      });
    },
    seeDetail(fullname){
      this.$router.push({path: '/meetingDetail',query:{name:fullname}});
    }
  }


}
</script>

<template>
<div id = "ContactState">
  <el-divider content-position="left"><span>我申请的会议状态</span></el-divider>
    <div class="MeetingBox" v-for="conState in myContactState" v-bind:key="conState.ShortName" v-bind:index="conState.ShortName">
      <div class="text_item">
        <strong>会议简称</strong><span class="para">{{conState.ShortName}}</span>
      </div>
      <div class="text_item">
        <strong>会议全名</strong><span class="para">{{conState.FullName}}</span>
      </div>
      <div class="text_item">
        <strong>投稿截止日期</strong><span class="para">{{conState.ContributeDDL}}</span>
      </div>
      <div class="text_item">
        <strong>结果发布日期</strong><span class="para">{{conState.ReleaseResultTime}}</span>
      </div>
      <div class="text_item">
        <strong>会议举办日期</strong><span class="para">{{conState.ReleaseResultTime}}</span>
      </div>
      <div class="text_item">
        <strong>举办地点</strong><span class="para">{{conState.Place}}</span>
      </div>
      <div class="text_item">
        <strong>审核状态</strong><span class="state">{{conState.contactState}}</span>
      </div>

    </div>

</div>
</template>
<style scoped>
  .MeetingBox{
    padding: 20px;
    border-radius: 2px;box-shadow: 0 2px 4px rgba(0, 0, 0, .44), 0 0 6px rgba(0, 0, 0, .44);color: #0c5460;color: black;
    background-color: white;
    margin: 20px;
  }
  .text_item{
    margin-top: 20px;
  }
  .para{
    margin-left: 30px;
    color: #c69500;
  }
  .enterMeetingBt{
    margin-top: 20px;
  }
  .state{
    color: #ff1e1a;
    margin-left: 30px;
  }
</style>

