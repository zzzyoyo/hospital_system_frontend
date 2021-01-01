<template>
  <div id="audit">
    <div class="meetingBlock">
      <h5>会议主题：<span style="color:#5b25ff;">{{contactName}}</span></h5><br>
      <el-button @click="drawer = true" type="primary" style="position:fixed;top:100px;right:40px;">
        目录
      </el-button>

      <el-drawer
        title="点击标题跳转到相应位置"
        :visible.sync="drawer"
        :with-header="true"
        size="20%">
        <ul><li v-for="(aus,index) in authors" :key='"menu"+index' style="text-align: left;padding-left: 20px;" @click='scrollToEssay(index)'><el-link type="primary" style="font-size:20px"><i class="el-icon-caret-right" ></i>{{aus.title}}</el-link></li></ul>
      </el-drawer>
      <el-divider>我的审核稿件</el-divider>
      <div v-for="(aus,index) in authors"  :id="index" :key='aus.title' style="margin-bottom:50px">
        <h3 style='margin-top:20px'>标题:{{aus.title}}</h3>
        <p ><i class="el-icon-user"></i><span >作者:</span>{{aus.name}} <a @click.prevent="downloadEssay(aus.link)" type="primary" :href='aus.link' style="margin-right:5px">点击下载</a><a target="_Blank" type="primary" :href='aus.link'>点击预览</a></p>
        <div>摘要：
          <el-input
            type="textarea"
            autosize
            style="width:80%;"
            :disabled="true"
            v-model="aus.extract">
          </el-input>
        </div>
        <br>

        <div v-if="aus.essayState===0" id="未批阅">
          <el-button-group style="margin-top:20px">
            <el-button type="success" @click='toEdit(aus.name,aus.title)'>审核</el-button>
          </el-button-group>
        </div>

        <div v-else-if="aus.essayState===1" id="已批阅待首次确认">
          <p>第一次讨论</p>

          <div class="firstDiscussArea">

            <ul id="indexWay" align="left">
              <li v-for="(firstDiscuss,index) in aus.firstDiscussion"  v-bind:key="firstDiscuss.speaker">
                <p style="color: #005cbf">第{{index+1}}楼：{{firstDiscuss.speaker}}<span style="color: black">:{{firstDiscuss.content}}</span></p>
                <el-button  class="el-icon-right" @click="reply1(aus,firstDiscuss.speaker,firstDiscuss.content)">回复TA</el-button>
              </li>
            </ul>
            <br>
            <div  style="padding-left: 10%">
              <el-button @click="myView1(aus)">发表我的看法</el-button>
            </div>
          </div>

          <el-dialog
            title="回复评论"
            :visible.sync="commentWindowVisible1"
            center>
            <el-input v-model="aPieceOfComment"></el-input>

            <el-button-group style="margin-left: 20%;margin-top: 5%">
              <el-button @click="commentWindowVisible1=false">取消</el-button>
              <el-button type="success" @click="sendMyComment1(aPieceOfComment)">发布评论1</el-button>
            </el-button-group>
          </el-dialog>

          <br>
          <el-button-group style="margin-top:20px">
            <el-button @click="doNotChange1(aus)">不修改评分</el-button>
            <el-button type="success" @click='firstChange(aus.name,aus.title)'>首次修改评审结果</el-button>
          </el-button-group>
        </div>

        <div v-else-if="aus.essayState===2" id="已首次确认">

          <p>第一次讨论</p>

          <div class="firstDiscussArea">

            <ul id="indexWay1" align="left">
              <li v-for="(firstDiscuss,index) in aus.firstDiscussion"  v-bind:key="firstDiscuss.speaker">
                <p style="color: #005cbf">第{{index+1}}楼：{{firstDiscuss.speaker}}<span style="color: black">:{{firstDiscuss.content}}</span></p>
                <el-button  class="el-icon-right" @click="reply1(aus,firstDiscuss.speaker,firstDiscuss.content)">回复TA</el-button>
              </li>
            </ul>
            <br>
            <div  style="padding-left: 10%">
              <el-button @click="myView1(aus)">发表我的看法</el-button>
            </div>
          </div>

          <el-dialog
            title="回复评论"
            :visible.sync="commentWindowVisible1"
            center>
            <el-input v-model="aPieceOfComment"></el-input>

            <el-button-group style="margin-left: 20%;margin-top: 5%">
              <el-button @click="commentWindowVisible1=false">取消</el-button>
              <el-button type="success" @click="sendMyComment1(aPieceOfComment)">发布评论1</el-button>
            </el-button-group>
          </el-dialog>

          <br>


          <el-button-group style="margin-top:20px">
            <el-button type="success" disabled>已首次确认</el-button>
          </el-button-group>
        </div>

        <div v-else-if="aus.essayState===3" id="已录用">
          <el-button-group style="margin-top:20px">
            <el-button type="success" disabled>已录用</el-button>
          </el-button-group>
        </div>

        <div v-else-if="aus.essayState===4" id="已驳回但未提交rebuttal">
          <el-button-group style="margin-top:20px">
            <el-button type="warning" disabled>已驳回</el-button>
          </el-button-group>
        </div>

        <div v-else-if="aus.essayState===5" id="已提交rebuttal待再次确认">

          <p>第二次讨论</p>
          <p >Rebuttal:<span style="color: #005cbf">{{aus.rebuttal}}</span></p>

          <div class="secondDiscussArea">

            <ul id="indexWay2" align="left">
              <li v-for="(secondDiscuss,index) in aus.secondDiscussion"  v-bind:key="secondDiscuss.speaker">
                <p style="color: #005cbf">第{{index+1}}楼：{{secondDiscuss.speaker}}<span style="color: black">:{{secondDiscuss.content}}</span></p>
                <el-button  class="el-icon-right" @click="reply2(aus,secondDiscuss.speaker,secondDiscuss.content)">回复TA</el-button>
              </li>
            </ul>
            <div  style="padding-left: 10%">
              <el-button @click="myView2(aus)">发表我的看法</el-button>
            </div>

          </div>

          <el-dialog
            title="回复评论"
            :visible.sync="commentWindowVisible2"
            center>
            <el-input v-model="aPieceOfComment"></el-input>

            <el-button-group style="margin-left: 20%;margin-top: 5%">
              <el-button @click="commentWindowVisible2=false">取消</el-button>
              <el-button type="success" @click="sendMyComment2(aPieceOfComment)">发布评论2</el-button>
            </el-button-group>

          </el-dialog>

          <br>
          <el-button-group style="margin-top:20px">
            <el-button @click="doNotChange2(aus)">不修改评分</el-button>
            <el-button type="success" @click='secondChange(aus.name,aus.title)'>再次修改评审结果</el-button>
          </el-button-group>
        </div>

        <div v-else id="已再次确认">
          <p>第二次讨论</p>
          <p >Rebuttal:<span style="color: #005cbf">{{aus.rebuttal}}</span></p>

          <div class="secondDiscussArea">

            <ul id="indexWay22" align="left">
              <li v-for="(secondDiscuss,index) in aus.secondDiscussion"  v-bind:key="secondDiscuss.speaker">
                <p style="color: #005cbf">第{{index+1}}楼：{{secondDiscuss.speaker}}<span style="color: black">:{{secondDiscuss.content}}</span></p>
                <el-button  class="el-icon-right" @click="reply2(aus,secondDiscuss.speaker,secondDiscuss.content)">回复TA</el-button>
              </li>
            </ul>
            <div  style="padding-left: 10%">
              <el-button @click="myView2(aus)">发表我的看法</el-button>
            </div>

          </div>

          <el-dialog
            title="回复评论"
            :visible.sync="commentWindowVisible2"
            center>
            <el-input v-model="aPieceOfComment"></el-input>

            <el-button-group style="margin-left: 20%;margin-top: 5%">
              <el-button @click="commentWindowVisible2=false">取消</el-button>
              <el-button type="success" @click="sendMyComment2(aPieceOfComment)">发布评论2</el-button>
            </el-button-group>

          </el-dialog>

          <br>

          <el-button-group style="margin-top:20px">
            <el-button type="success" disabled>已再次确认</el-button>
          </el-button-group>
        </div>

        <el-divider></el-divider>
      </div>
      <el-button type="primary" class="enterMeetingBt" @click="seeDetail()">进入会议</el-button>
    </div>
  </div>
</template>

<script>
  import pdf from 'vue-pdf'

  export default {
    name: "Audit",
    props:['contactName'],
    components:{pdf},
    data() {
      return {
        aPieceOfComment:'',

        firstDiscussAreaVisible:false,
        secondDiscussAreaVisible:false,

        commentWindowVisible1:false,
        commentWindowVisible2:false,
        currentAus:{},

        drawer:false,
        pageCount:[10,10,10],

        authors:  [
          { name: 'Sam',
            extract:'xxxxxxxxxxxxxxxxx',
            link: 'https://dakaname.oss-cn-hangzhou.aliyuncs.com/file/2018-12-28/1546003237411.pdf',
            title:'wssdffl1',
            essayState:0,
            rebuttal:'',
            firstDiscussion:[],
            secondDiscussion:[],
          },
          {name: 'AEFam',
            extract:'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            link: 'http://image.cache.timepack.cn/nodejs.pdf',
            title:'dgdfhdh',
            essayState:1,
            rebuttal:'',
            firstDiscussion:[
              {
                speaker:'msdsn',
                content:'我觉得给吧'
              },
              {
                speaker:'sdjod',
                content:'没道理'
              },
              {
                speaker:'sdddw',
                content:'开玩笑丢掉的吧'
              },
            ],
            secondDiscussion:[
              {
                speaker:'msdsn',
                content:'我觉得给吧'
              },
              {
                speaker:'sdjod',
                content:'没道理'
              },
              {
                speaker:'sdddw',
                content:'开玩笑丢掉的吧'
              },
            ],

          },
          {name: 'Ssdfam',
            extract:'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            link: '',
            title:'retrdfhdfg',
            essayState:2,
            rebuttal:'',
            firstDiscussion:[],
            secondDiscussion:[],
          },
          {name: 'dfgddd',
            extract:'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            link: 'http://image.cache.timepack.cn/nodejs.pdf',
            title:'asevvh',
            essayState:3,
            rebuttal:'',
            firstDiscussion:[],
            secondDiscussion:[],
          },
          {name: 'awrcxd',
            extract:'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            link: 'http://image.cache.timepack.cn/nodejs.pdf',
            title:'dgdh',
            essayState:4,
            rebuttal:'',
            firstDiscussion:[],
            secondDiscussion:[],
          },
          {name: 'ertgfd',
            extract:'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            link: 'http://image.cache.timepack.cn/nodejs.pdf',
            title:'dgsbljh',
            essayState:5,
            rebuttal:'什么评委什么眼光啊真的是！',
            firstDiscussion:[
              {
                speaker:'msdsn',
                content:'我觉得给吧'
              },
              {
                speaker:'sdjod',
                content:'没道理'
              },
              {
                speaker:'sdddw',
                content:'开玩笑丢掉的吧'
              },
            ],
            secondDiscussion:[
              {
                speaker:'msdsn',
                content:'我觉得给吧'
              },
              {
                speaker:'sdjod',
                content:'没道理'
              },
              {
                speaker:'sdddw',
                content:'开玩笑丢掉的吧'
              },
            ],
          },
          {name: 'ghthrtj',
            extract:'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            link: 'http://image.cache.timepack.cn/nodejs.pdf',
            title:'dfhghfhdh',
            essayState:6,
            rebuttal:'',
            firstDiscussion:[],
            secondDiscussion:[],
          },

        ],

      }
    },
    created: function () {
      this.$axios.post('/audit', {
        username: this.$store.state.userDetails,
        contactName:this.contactName
      })
        .then(resp => {
          if (resp.status === 200 && resp.data.hasOwnProperty("essayNeedHandle")) {
            this.authors = resp.data.essayNeedHandle
            this.pageCount = new Array(this.authors.length)
            for(var i = 0; i < this.authors.length;i++){
              //一定要用闭包或者foreach,加载pdf页数
              var auditVM = this;
              (function(ii){
                //alert('初始元素'+i+":"+auditVM.pageCount[ii])
                pdf.createLoadingTask(auditVM.authors[ii].link).promise.then(PDF => {
                  auditVM.pageCount[ii] = PDF.numPages
                })
                //alert("now:"+auditVM.pageCount[i])
              })(i)
            }
          } else {
            this.auditError()
            console.log(resp)
          }
        })
        .catch(error => {
          if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            if(error.response.status === 404){
              this.$message('该会议还没有收到投稿哦~')
            }
            else{console.log(error.response)}
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message)
          }
        })
    },
    methods: {
      reply1(aus,speaker,content){
        this.currentAus=aus;
        this.commentWindowVisible1=true;
        this.aPieceOfComment='[回复'+speaker+':'+content+']';
      },
      reply2(aus,speaker,content){
        this.currentAus=aus;
        this.commentWindowVisible2=true;
        this.aPieceOfComment='[回复'+speaker+':'+content+']';
      },
      myView1(aus){
        this.currentAus=aus;
        this.commentWindowVisible1=true;
        this.aPieceOfComment='';
      },
      myView2(aus){
        this.currentAus=aus;
        this.commentWindowVisible2=true;
        this.aPieceOfComment='';
      },
      doNotChange1(aus){
        this.$axios.post('/doNotChangeInFirstDiscussion', {
          meetingFullname:this.contactName,
          authorName:aus.name,
          essayTitle:aus.title,
          pcMemberUsername: this.$store.state.userDetails,

        })
          .then(resp => {
            if (resp.status === 200) {
              this.$message({
                showClose: true,
                message: '已确认不修改！',
                type: 'success'
              });
              this.$router.go(0);
            } else {
              this.$message({
                showClose: true,
                message: '操作异常！',
                type: 'warning'
              });
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
      doNotChange2(aus){
        this.$axios.post('/doNotChangeInSecondDiscussion', {
          meetingFullname:this.contactName,
          authorName:aus.name,
          essayTitle:aus.title,
          pcMemberUsername: this.$store.state.userDetails,

        })
          .then(resp => {
            if (resp.status === 200) {
              this.$message({
                showClose: true,
                message: '已确认不修改！',
                type: 'success'
              });
              this.$router.go(0);
            } else {
              this.$message({
                showClose: true,
                message: '操作异常！',
                type: 'warning'
              });
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
      sendMyComment1(content){
        if(content.length===0){
          this.$message({
            showClose: true,
            message: '评论长度不能为空',
            type: 'warning'
          });
        }
        else{
          //还要把这条记录增加到数据库里面去
          this.addFirstDiscussionCommentToBackend(content)
          this.commentWindowVisible1=false;
        }

      },
      addFirstDiscussionCommentToBackend(content){
        this.$axios.post('/addFirstDiscussionCommentToBackend', {
          meetingFullname:this.contactName,
          authorName:this.currentAus.name,
          essayTitle:this.currentAus.title,

          speaker: this.$store.state.userDetails,
          content:content,
        })
          .then(resp => {
            if (resp.status === 200) {
              this.$message({
                showClose: true,
                message: '评论成功',
                type: 'success'
              });
              this.$router.go(0);
            } else {
              this.$message({
                showClose: true,
                message: '评论异常！',
                type: 'warning'
              });
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
      sendMyComment2(content){
        if(content.length===0){
          this.$message({
            showClose: true,
            message: '评论长度不能为空',
            type: 'warning'
          });
        }
        else{
          //还要把这条记录增加到数据库里面去
          this.addSecondDiscussionCommentToBackend(content)
          this.commentWindowVisible2=false;
        }

      },
      addSecondDiscussionCommentToBackend(content){
        this.$axios.post('/addSecondDiscussionCommentToBackend', {
          meetingFullname:this.contactName,
          authorName:this.currentAus.name,
          essayTitle:this.currentAus.title,

          speaker: this.$store.state.userDetails,
          content:content,
        })
          .then(resp => {
            if (resp.status === 200) {
              this.$message({
                showClose: true,
                message: '评论成功',
                type: 'success'
              });
              this.$router.go(0);
            } else {
              this.$message({
                showClose: true,
                message: '评论异常！',
                type: 'warning'
              });
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
      downloadEssay(url){
        let link = document.createElement('a')
        fetch(url).then(res => res.blob()).then(blob => { // 将链接地址字符内容转变成blob地址
          link.href = URL.createObjectURL(blob)
          console.log(link.href)
          link.download = ''
          link.click()
        })
      },
      seeDetail(){
        this.$router.push({path: '/meetingDetail',query:{name:this.contactName}});
      },
      auditError() {
        this.$message({
          showClose: true,
          message: 'audit error',
          type: 'warning'
        });
      },
      //跳转到审稿信息提交界面
      toEdit(name,title){
        this.$router.push({path: '/readOver',query:{contactName:name,essayTitle:title,auditWay:'audit'}});
      },
      firstChange(name,title){
        this.$router.push({path: '/readOver',query:{contactName:name,essayTitle:title,auditWay:'firstChange'}});
      },
      secondChange(name,title){
        this.$router.push({path: '/readOver',query:{contactName:name,essayTitle:title,auditWay:'secondChange'}});
      },
      scrollToEssay(index){
        document.getElementById(index).scrollIntoView();
      }
    }
  }
</script>

<style scoped>
  .meetingBlock{
    margin: 20px;
    padding: 20px;
    border-radius: 2px;box-shadow: 0 2px 4px rgba(0, 0, 0, .44), 0 0 6px rgba(0, 0, 0, .44);color: #0c5460;color: black;
    background-color: white;
  }
  .discussArea{
    padding-left: 10%;
  }
  .secondDiscussArea{
    margin: 5%;
    padding: 5%;
    border-radius: 2px;box-shadow: 0 2px 4px rgba(0, 0, 0, .44), 0 0 6px rgba(0, 0, 0, .44);color: #0c5460;color: black;
  }
  .firstDiscussArea{
    margin: 5%;
    padding: 5%;
    border-radius: 2px;box-shadow: 0 2px 4px rgba(0, 0, 0, .44), 0 0 6px rgba(0, 0, 0, .44);color: #0c5460;color: black;
  }

</style>

