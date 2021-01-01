<template>
  <div id="page">
    <div id="singleMeeting">
      <el-container>
        <el-header><h2 style="color: rgba(0, 25, 52, 0.7);">{{this.$route.query.name}}</h2>
        </el-header>
        <el-container>
          <el-aside width="300px">
            <p></p>
            <el-collapse>
              <el-collapse-item title="会议主席：" name="1">
                <span class="members" >{{verDetailContactData.chair}}</span>
              </el-collapse-item>
              <el-collapse-item title="审稿人：" name="2">
                <p class="members" v-for="pcm in verDetailContactData.pcMembers" v-bind:key="pcm" v-bind:index="pcm">{{pcm}}</p>

              </el-collapse-item>
              <el-collapse-item title="投稿人：" name="3">
                <p class="members" v-for="aus in verDetailContactData.authors" v-bind:key="aus" v-bind:index="aus">{{aus}}</p>

              </el-collapse-item>
              <el-collapse-item title="会议状态：" name="4">
                <span style="color: red" v-if="verDetailContactData.state===-1">已拒绝</span>
                <span style="color: red" v-else-if="verDetailContactData.state===0">待审核</span>
                <span style="color: red" v-else-if="verDetailContactData.state===1">已通过</span>
                <span style="color: red" v-else-if="verDetailContactData.state===2">投稿中</span>
                <span style="color: red" v-else-if="verDetailContactData.state===3">审稿中</span>
                <span style="color: red" v-else-if="verDetailContactData.state===4">已发布结果</span>
                <span style="color: red" v-else-if="verDetailContactData.state===5">已举办线下会议</span>
                <span style="color: red" v-else>已结束</span>
              </el-collapse-item>
              <el-collapse-item title="会议标签：" name="5">
                <el-tag
                  :key="tag"
                  v-for="tag in verDetailContactData.topic"
                  :disable-transitions="false"
                  >
                  {{tag}}
                </el-tag>
              </el-collapse-item>
            </el-collapse>

          </el-aside>
          <el-container>
            <el-main>
              <div id="meeting">
                <p><label>会议简称:</label><span class="tableDT">{{verDetailContactData.ShortName}}</span></p>

                <p> <label>举办日期:</label><span class="tableDT">{{verDetailContactData.BeginTime}}</span></p>

                <p><label>投稿截止日期:</label><span class="tableDT">{{verDetailContactData.ContributeDDL}}</span></p>

                <p><label>结果发布日期:</label><span class="tableDT">{{verDetailContactData.ReleaseResultTime}}</span></p>

                <p><label>举办地点:</label><span class="tableDT">{{verDetailContactData.Place}}</span></p>

              </div>


            </el-main>
            <el-footer>


              <el-button type="warning" @click="up()">投稿</el-button>
              <router-link to ="contribute" >  <el-button type="primary">返回搜索页面</el-button></router-link>





            </el-footer>

          </el-container>
        </el-container>
      </el-container>
    </div>
  </div>

</template>

<script>
  export default {
    name: "MeetingDetail",
    created: function () {
      this.$axios.post('/meetingDetail', {
        fullname:this.$route.query.name
      })
        .then(resp => {
          if (resp.status === 200 && resp.data.hasOwnProperty("veryDetailContactData")) {
            this.verDetailContactData = resp.data.veryDetailContactData
            console.log(this.verDetailContactData)
          } else {
            this.$message({
              showClose: true,
              message: 'detail error',
              type: 'warning'
            });
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
    data() {
      return {
        verDetailContactData:{
          FullName:'第32届全国互联网顶尖人才大会',
          chair:'Root',
          pcMembers:[
            'a','b','c'
          ],
          authors:[
            'a','b'
          ],
          state:2,//只有当会议状态处于2的时候才能投稿，所以需要获取一下状态
          ShortName:'互联网大会',
          BeginTime:'2019-10-18',
          ContributeDDL:'2019-11-12',
          ReleaseResultTime:'2019-12-3',
          Place:'上海',
          topic:['吃播','美食'],
        },
        //role表示当前用户在当前会议中的角色，如果他自己是chair的话，投稿功能是禁用的
        role:'',
      };
    },
    methods:{
      // up(){
      //   this.$router.push({path: '/upload',query:{name:this.$route.query.name}});
      // }
      //为了方便测试投稿页面的改动我把这个注释掉了，后面写的差不多了再改回来
      up(){
        this.$axios.post('/judgeRoleInMeeting', {
          //会议的全名
          fullname:this.$route.query.name,
          //用户的名字
          username:this.$store.state.userDetails
        })
          .then(resp => {
            if (resp.status === 200 && resp.data.hasOwnProperty("userRoleInThisConference")) {
              this.role = resp.data.userRoleInThisConference;
              console.log(this.role);
              //判断该用户在该会议中的角色确定是否能投稿
              if(this.role=='chair') {
                this.$message({
                  showClose: true,
                  message: '你是该会议的会议主席，无法投稿！',
                });
              }
              else{
                if(this.verDetailContactData.state===2){
                  this.$router.push({path: '/upload',query:{name:this.$route.query.name}});
                }else{
                  this.$message({
                    showClose: true,
                    message: '现在不是投稿时间',
                    type: 'warning'
                  });
                }

              }
            } else {
              this.$message({
                showClose: true,
                message: 'upload error',
                type: 'warning'
              });
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
    }
  }
</script>

<style scoped>
  #page{
    padding-top: 100px;
    padding-left: 10px;
    padding-right: 10px;
    background-color: #52658F;
    min-height: auto;
    padding-bottom: 30px;
  }
  #singleMeeting{
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    background-color: white;
    border-radius: 2px;box-shadow: 0 2px 4px rgba(0, 0, 0, .44), 0 0 6px rgba(0, 0, 0, .44);color: #0c5460;color: black;
  }
  .members{
    color: rgba(0, 25, 52, 0.7);
  }
  .member{
    margin-top: 20px;

  }
  .el-header{
    padding: 10px;
    background-color: #B3C0D1;
    color: #333;
    text-align: center;

  }
  .el-footer {
    padding: 10px;
    background-color: #B3C0D1;
    color: #333;
  }

  .el-aside {
    padding: 20px;
    background-color: #D3DCE6;
    color: #333;
    text-align: left;
    line-height: 200px;
  }

  .el-main {
    padding: 10px;
    background-color: #F7F5E6;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  .el-tag{
    margin-right: 10px;
  }
  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .el-button{
    margin-right: 100px;
  }
  .el-collapse-item{
    padding: 15px;

  }
  .tableDT{
    color: #c69500;
  }
  #meeting{
    padding: 20px;
    border-radius: 2px;box-shadow: 0 2px 4px rgba(0, 0, 0, .44), 0 0 6px rgba(0, 0, 0, .44);color: #0c5460;color: black;
    background-color: white;
    margin: 20px;
  }
  >>> .el-collapse-item__content{
    padding:0;
  }
</style>
