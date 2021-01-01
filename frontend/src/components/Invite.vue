<script>
export default {
  name: 'Invite',
  data(){
    return{
      dialogTableVisible:false,
      myTopic:[],
      invites:[],
      refutation:'',
    }
  },
  created: function () {
    this.$axios.post('/receivedInvitation', {
      username: this.$store.state.userDetails
    })
      .then(resp => {
        if (resp.status === 200 && resp.data.hasOwnProperty("invitesData")) {
          this.invites = resp.data.invitesData
        } else {
          this.inviteError()
            console.log(resp)
        }
      })
      .catch(error => {
        if (error.response) {
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          this.$message({
            showClose: true,
            message: '请求已发出，但服务器响应的状态码不在 2xx 范围内',
            type: 'warning'
          });
          console.log(error.response)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
        }
        console.log(error.config);
      })
  },
  methods:{
    handleClose(tag,certainTagSet) {
      this.myTopic.splice(this.myTopic.indexOf(tag), 1);
      //把删掉的标签扔回未选里面去
      certainTagSet.push(tag);
    },
    addTopic(str,certainTagSet){
      this.myTopic.push(str);
      //标签被选过一次就不能再重复选了
      certainTagSet.splice(certainTagSet.indexOf(str), 1);
    },
    // refuseTest(refusedMeetingObject){
    //   this.invites.splice(this.invites.indexOf(refusedMeetingObject), 1);
    // },
    refuse(refusedMeetingObject){

        this.$axios.post('/refuseInvitation', {
          username: this.$store.state.userDetails,
          fullname:refusedMeetingObject.FullName,
          refutation:true
        })
          .then(resp => {
            if (resp.status === 200 ) {
              this.invites.splice(this.invites.indexOf(refusedMeetingObject), 1);
              this.$message({
                showClose: true,
                message: '已拒绝',
                type: 'success'
              });
            } else {
              this.$message({
                showClose: true,
                message: 'refuse error',
                type: 'warning'
              });
              console.log(resp)
            }
          })
          .catch(error => {
            if (error.response) {
              // 请求已发出，但服务器响应的状态码不在 2xx 范围内
              this.$message({
                showClose: true,
                message: '请求已发出，但服务器响应的状态码不在 2xx 范围内',
                type: 'warning'
              });
              console.log(error.response)
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message)
            }
            console.log(error.config);
          })
    },


    agree(agreedMeetingObject){
      if(this.myTopic.length===0){
        this.$message({
          showClose: true,
          message: '请至少选择一个Topic',
          type: 'warning'
        });
      }
      else{
        this.dialogTableVisible=false
           var tmp=[];
        for(var i=0;i<this.myTopic.length;i++){
          tmp.push(this.myTopic[i])
        }


        this.$axios.post('/refuseInvitation', {
          username: this.$store.state.userDetails,
          fullname:agreedMeetingObject.FullName,
          refutation:false,
          topic:tmp,
        })
          .then(resp => {
            if (resp.status === 200) {
             // this.myTopic.cleanup();
              this.myTopic.splice(0,this.myTopic.length)
              this.$message({
                showClose: true,
                message: '已同意',
                type: 'success'
              });
              this.invites.splice(this.invites.indexOf(agreedMeetingObject), 1);
            } else {
              this.$message({
                showClose: true,
                message: 'refuse error',
                type: 'warning'
              });
              console.log(resp)
            }
          })
          .catch(error => {
            if (error.response) {
              // 请求已发出，但服务器响应的状态码不在 2xx 范围内
              this.$message({
                showClose: true,
                message: '请求已发出，但服务器响应的状态码不在 2xx 范围内',
                type: 'warning'
              });
              console.log(error.response)
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message)
            }
            console.log(error.config);
          })
      }


    },
    seeDetail(){
      this.$router.push({path: '/meetingDetail',query:{name:this.contactName}});
    },
    inviteError() {
      this.$message({
        showClose: true,
        message: 'invite error',
        type: 'warning'
      });
    },
  }

}
</script>

<template>
<div id = "Invite">

  <h5>审稿邀请</h5>
  <div class="invitation" v-for="ins in invites" v-bind:key="ins.FullName" v-bind:index="ins.FullName">


    <p><em class="el-icon-user"></em><span class="ivt">Chair:</span>{{ins.chair}}</p>
    <p><em class="el-icon-notebook-1"></em><span class="ivt">Meeting's FullName:</span>{{ins.FullName}}</p>



      <el-button type="success" class="goTo" @click="dialogTableVisible = true">同意</el-button>

      <el-dialog title="选择专属会议标签" :visible.sync="dialogTableVisible">
        <el-form>
          <el-form-item label="专属标签">
            <el-tag
              :key="tag"
              v-for="tag in myTopic"
              closable
              :disable-transitions="false"
              @close="handleClose(tag,ins.topic)">
              {{tag}}
            </el-tag>
          </el-form-item>
          <el-form-item label="会议标签">
            <el-tag
              class="d-tag"
              :key="defaultTag"
              v-for="defaultTag in ins.topic"
              @click="addTopic(defaultTag,ins.topic)"
              type="success"
              :disable-transitions="false"
            >
              {{defaultTag}}
            </el-tag>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="agree(ins)">确 定</el-button>
        </div>
      </el-dialog>
      <el-button type="danger" class="goTo" @click="refuse(ins)">拒绝</el-button>
    </div>




  </div>



</template>
<style scoped>
  .ivt{
    color: #c69500;
  }
  .invitation{
    margin: 20px;
    padding: 20px;
    border-radius: 2px;box-shadow: 0 2px 4px rgba(0, 0, 0, .44), 0 0 6px rgba(0, 0, 0, .44);color: #0c5460;color: black;
    background-color: white;
  }
</style>

