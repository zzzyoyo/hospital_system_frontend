<template>
    <div id="examInformation">
      <div id="page">
        <p>投稿人姓名:{{this.$route.query.contactName}}</p>
        <p>文章标题:{{this.$route.query.essayTitle}}</p>
        <el-form :ref="commentForm" :model="commentForm" label-width="80px" :rules="rules">
          <el-form-item label="稿件评分" prop="score">
            <el-cascader v-model="commentForm.score"
                         :options="scoreOption"
                         :props="{ expandTrigger: 'hover' }"
                         placeholder="请输入论文得分"
                         style='width:100%'
                         :show-all-levels=false
            ></el-cascader>
          </el-form-item>
          <el-form-item label="confidence" prop="confidence">
            <el-cascader v-model="commentForm.confidence"
                         :options="confidenceOption"
                         :props="{ expandTrigger: 'hover' }"
                         placeholder="请输入论文confidence"
                         style='width:100%'
                         :show-all-levels=false
            ></el-cascader>
          </el-form-item>
            <el-form-item label="评语" prop="comment">
              <el-input type="textarea"
                        v-model="commentForm.comment"
                        placeholder="请输入论文评语"
                        maxlength="800"
                        autosize
                        show-word-limit
              ></el-input>
          </el-form-item>
          <el-form-item>

            <el-button v-if="this.$route.query.auditWay==='audit'" type="success" @click="submit(commentForm)" round>Submit</el-button>
            <el-button v-else-if="this.$route.query.auditWay==='firstChange'" type="success" @click="submitFirstChange(commentForm)" round>提交第一次修改</el-button>
            <el-button v-else type="success" @click="submitSecondChange(commentForm)" round>提交第二次修改</el-button>
          </el-form-item>
        </el-form>
      </div>

    </div>
</template>

<script>
    export default {
        name: "ReadOver",
       data(){
          return{
            commentForm:{
              score:'',
              confidence:'',
              comment:''
            },
            rules: {
              score: [{required: true, message: '', trigger: 'blur'}],
              confidence: [{required: true, message: '', trigger: 'blur'}],
              comment: [{required: true, message: '', trigger: 'blur'}],
            },
            scoreOption:[
              {
                value:'',
                label:'reject',
                children:[
                  {value:'-2',label:'-2'},
                ]
              },
              {
                value:'',
                label:'weak reject',
                children:[
                  {value:'-1',label:'-1'},
                ]
              },
              {
                value:'',
                label:'weak accept',
                children:[
                  {value:'1',label:'1'},
                ]
              },
              {
                value:'',
                label:'accept',
                children:[
                  {value:'2',label:'2'},
                ]
              },

            ],
            confidenceOption:[
              {
                value:'very low',
                label:'very low',
              },
              {
                value:'low',
                label:'low',
              },
              {
                value:'high',
                label:'high',
              },
              {
                value:'very high',
                label:'very high',
              },
            ],
          }
       },
      methods:{
        submit (formName) {
              this.$refs[formName].validate(valid => {
                if(valid){
                  this.$axios.post('/sendCommentInformation', {
                    pcmemberFullName:this.$store.state.userDetails,
                    paperTitle:this.$route.query.essayTitle,
                    meetingFullname:this.$route.query.contactName,
                    score:this.commentForm.score,
                    confidence:this.commentForm.confidence,
                    comments:this.commentForm.comment,
                  })
                    .then(resp => {
                      if (resp.status === 200 ) {
                        this.$message({
                          showClose: true,
                          message: '批阅成功!',
                          type: 'success'
                        });

                        this.$router.replace({path:'/personal'})
                      }
                      else{
                        this.$message({
                          showClose: true,
                          message: '批阅失败!',
                          type: 'error'
                        });
                        // alert('批阅失败')
                      }
                    })
                    .catch(error => {
                      if(error.response){
                        if(error.response.status === 400){
                          this.$message.error(error.response.data.message)
                        }
                        else{
                          this.$message({
                            showClose: true,
                            message: 'read over error',
                          });
                        }
                      }
                      else{
                        this.$message({
                          showClose: true,
                          message: 'read over error',
                        });
                      }
                      console.log(error)
                      //alert('contact error')
                    })
                } else {
                  //alert('wrong submit')
                  this.$message({
                    showClose: true,
                    message: 'wrong submit!',
                    type: 'error'
                  });
                }
              })
        },
        submitFirstChange (formName) {
          this.$refs[formName].validate(valid => {
            if(valid){
              this.$axios.post('/sendFirstCommentChangeInformation', {
                pcmemberFullName:this.$store.state.userDetails,
                paperTitle:this.$route.query.essayTitle,
                meetingFullname:this.$route.query.contactName,
                score:this.commentForm.score,
                confidence:this.commentForm.confidence,
                comments:this.commentForm.comment,
              })
                .then(resp => {
                  if (resp.status === 200 ) {
                    this.$message({
                      showClose: true,
                      message: '批阅成功!',
                      type: 'success'
                    });
                    // alert("批阅成功")
                    this.$router.replace({path:'/personal'})
                  }
                  else{
                    this.$message({
                      showClose: true,
                      message: '批阅失败!',
                      type: 'error'
                    });
                    // alert('批阅失败')
                  }
                })
                .catch(error => {
                  if(error.response){
                    if(error.response.status === 400){
                      this.$message.error(error.response.data.message)
                    }
                    else{
                      this.$message({
                        showClose: true,
                        message: 'read over error',
                      });
                    }
                  }
                  else{
                    this.$message({
                      showClose: true,
                      message: 'read over error',
                    });
                  }
                  console.log(error)
                  //alert('contact error')
                })
            } else {
              //alert('wrong submit')
              this.$message({
                showClose: true,
                message: 'wrong submit!',
                type: 'error'
              });
            }
          })
        },
        submitSecondChange (formName) {
          this.$refs[formName].validate(valid => {
            if(valid){
              this.$axios.post('/sendSecondCommentChangeInformation', {
                pcmemberFullName:this.$store.state.userDetails,
                paperTitle:this.$route.query.essayTitle,
                meetingFullname:this.$route.query.contactName,
                score:this.commentForm.score,
                confidence:this.commentForm.confidence,
                comments:this.commentForm.comment,
              })
                .then(resp => {
                  if (resp.status === 200 ) {
                    this.$message({
                      showClose: true,
                      message: '批阅成功!',
                      type: 'success'
                    });
                    // alert("批阅成功")
                    this.$router.replace({path:'/personal'})
                  }
                  else{
                    this.$message({
                      showClose: true,
                      message: '批阅失败!',
                      type: 'error'
                    });
                    // alert('批阅失败')
                  }
                })
                .catch(error => {
                  if(error.response){
                    if(error.response.status === 400){
                      this.$message.error(error.response.data.message)
                    }
                    else{
                      this.$message({
                        showClose: true,
                        message: 'read over error',
                      });
                    }
                  }
                  else{
                    this.$message({
                      showClose: true,
                      message: 'read over error',
                    });
                  }
                  console.log(error)
                  //alert('contact error')
                })
            } else {
              //alert('wrong submit')
              this.$message({
                showClose: true,
                message: 'wrong submit!',
                type: 'error'
              });
            }
          })
        }

      }
    }
</script>

<style scoped>
  #examInformation{
    background-color: #52658F;
    padding-top: 120px;
    padding-left: 100px;
    padding-right: 100px;
    min-height: auto;
    padding-bottom: 30px;
  }
   #page{
     padding: 20px;
     border-radius: 2px;box-shadow: 0 2px 4px rgba(0, 0, 0, .44), 0 0 6px rgba(0, 0, 0, .44);color: #0c5460;color: black;
     background-color: white;
     margin: 20px;
     margin-bottom: 70px;
   }
</style>
