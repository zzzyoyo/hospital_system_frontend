<template>
  <div>
    <el-divider content-position="left"><span>我的投稿</span></el-divider>
    <div class="essayBlock">
      <h5>会议主题：<span style="color:#5b25ff;">{{contactName}}</span></h5><br>
      <div v-for='(essay,indexOfEssay) in essays' v-bind:key="essay.title" v-bind:index="essay.title" class="passageBlock">
      <strong class="tit">{{essay.title}}</strong>
<el-input
  type="textarea"
  :autosize="{ minRows: 2}"
  v-model="essay.summary"
  :disabled="true"
  style="margin-bottom:10px;">
</el-input>

<div v-if="essay.meetingState===2">
  <el-button @click="edit(essay.title)" style="margin-top: 10px">编辑</el-button>
</div>
 <div v-else style="padding: 10px ;">
<el-divider>反馈信息</el-divider>
   <el-form v-for='(aComment,index) in essay.commentSet' v-bind:key="'comment'+index" v-bind:index="'comment'+index">
     <el-form-item label="状态">
       <el-tag>{{aComment.status}}</el-tag>
     </el-form-item>
     <el-form-item label="得分">
       <el-input
         type="text"
         :disabled="true"
         v-model="aComment.score"
       >
       </el-input>
     </el-form-item>

     <el-form-item label="confidence">
       <el-input
         type="text"
         :disabled="true"
         v-model="aComment.confidence"
       >

       </el-input>
     </el-form-item>

     <el-form-item label="评语">
       <el-input
         type="textarea"
         :disabled="true"
         v-model="aComment.comment"
       >

       </el-input>
     </el-form-item>
     <el-divider></el-divider>
   </el-form>
   <div v-if="rebuttalNeeded[indexOfEssay]">
  <el-alert
    type="info"
    effect="dark"
    :closable="false"
    style="margin-bottom:10px">
   驳斥提交将在{{essay.rebuttalDeadline}}之后截止，请尽早提交
  </el-alert>
  <el-input placeholder="请输入驳斥内容" v-model="rebuttalText[indexOfEssay]" type="textarea" autosize>
  </el-input>
    <el-button @click="rebuttal(indexOfEssay)" style="margin:20px" type="primary" plain>发送驳斥</el-button>
    </div>
 </div>

      </div>

      </div>
      <el-divider></el-divider>
      <el-button type="primary" class="enterMeetingBt"  @click="seeDetail()" >进入会议</el-button>
    </div>

</template>

<script>
    export default {
        name: "MyEssayState",
      data(){
        return{
          dialogVisible:false,
          rebuttalNeeded:[true,false],
          essays:[
            {
              title:'专门为牛会写的文章',
              summary:'牛牛的会议',
              meetingState:4,
              rebuttalDeadline:'2020-06-16',
              commentSet:[
                {
                  status:'已审核',
                  score:'-1',
                  confidence:'weak',
                  comment:'不好的'
                },
                {
                  status:'已审核',
                  score:'1',
                  confidence:'weak',
                  comment:'挺好的'
                },
                {
                  status:'已审核',
                  score:'2',
                  confidence:'weak',
                  comment:'挺好的'
                }
              ],
              rebuttalState:0
            },
            {
              title:'专门为牛会写的第二篇文章',
              summary:'牛牛的会议',
              meetingState:2,
              commentSet:[],
              rebuttalState:0
            }
          ],
          rebuttalText:[],
        }
      },
      props:['contactName'],
      created: function () {
        this.$axios.post('/userEssayState', {
          username: this.$store.state.userDetails,
          contactName:this.contactName
        })
          .then(resp => {
            if (resp.status === 200 && resp.data.hasOwnProperty("userEssayStateInformation")) {
              this.essays = resp.data.userEssayStateInformation
              console.log('论文信息：')
              console.log(this.essays)
          //判断是否可以提出驳斥
          this.rebuttalNeeded = [];
          for(var i = 0;i < this.essays.length;i++){
            var essay = this.essays[i]
            if(essay.meetingState == 4 && essay.rebuttalState==0  &&(essay.commentSet[0].score == '-1'||essay.commentSet[0].score == '-2'||essay.commentSet[1].score == '-1'||essay.commentSet[1].score == '-2'||essay.commentSet[2].score == '-1'||essay.commentSet[2].score == '-2')){
              this.rebuttalNeeded.push(true)
            }
            else{
              this.rebuttalNeeded.push(false)
            }
          }
            } else {
              this.essayStateError()
                console.log(resp)
            }
          })
          .catch(error => {
            if (error.response) {
              // 请求已发出，但服务器响应的状态码不在 2xx 范围内
              if(error.response.status === 404){
                this.$message('你还没有在这个会议投稿哦~')
              }
              console.log(error.response)
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message)
            }
            console.log(error.config);
          })

      },
      methods: {
          edit(essayTitle){
            this.$router.push({path: '/editMyEssay',query:{name:this.contactName,title:essayTitle}});
          },
        seeDetail(){
          this.$router.push({path: '/meetingDetail',query:{name:this.contactName}});
        },
        essayStateError() {
          this.$message({
            showClose: true,
            message: 'essayState error',
            type: 'warning'
          });
        },
        rebuttal(index){
          this.$axios.post('/rebuttal',{
            username: this.$store.state.userDetails,
            contactName:this.contactName,
            essayTitle:this.essays[index].title,
            rebuttalText:this.rebuttalText[index]
          })
          .then(resp => {
            if (resp.status === 200){
              this.$message({message:'驳斥申请提交成功，请耐心等待结果',type:'success'})
              this.$set(this.rebuttalNeeded,index,false)
            }
          })
          .catch(error => {
            if (error.response) {
              // 请求已发出，但服务器响应的状态码不在 2xx 范围内
              if(error.response.status === 404){
                this.$message('你已经提交过驳斥申请，不能再次提交')
              }
              else{
                this.$message.error('提交失败')
              }
              console.log(error.response)
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message)
            }
            console.log(error.config);
          })
        }
      }
    }
</script>

<style scoped>
.essayBlock{
  padding: 20px;
  border-radius: 2px;box-shadow: 0 2px 4px rgba(0, 0, 0, .44), 0 0 6px rgba(0, 0, 0, .44);color: #0c5460;color: black;
  background-color: white;
  margin: 20px;
}
.enterMeetingBt{
  margin-top: 5px;
  margin-bottom: 5px;
}
.passageBlock{
  padding: 20px;
  background-color: white;
  margin: 0 auto;
  margin-bottom: 25px;
  border:1px solid lightgrey;
  border-radius: 4px;
}
  .tit{
    margin-bottom: 10px;
    color:#0c5460 ;
  }
</style>
