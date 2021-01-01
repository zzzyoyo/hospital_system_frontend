<script>
export default {
  name: 'Admin',
  data(){
      return{
          contactData:[{
              shortname:'shortname',
              fullname:'fullname',
              deadline:'deadline',
              resultReleaseTime:'2021-1-1',
              organizationTime: '2021-2-1',
              place: 'China',
              applicant:'applicant',
              topic:['computer','scope','config']
          },{
              shortname:'shortname',
              fullname:'fullname',
              deadline:'deadline',
              resultReleaseTime:'2021-1-1',
              organizationTime: '2021-2-1',
              place: 'China',
              applicant:'applicant',
              topic:['computer','scope','config']
          }]
      }
  },
  created:function(){
    this.$axios.post('/admin',{
      adminName:this.$store.state.userDetails
    })
    .then(resp => {
      if (resp.status === 200 && resp.data.hasOwnProperty("respContactData")){
        this.contactData = resp.data.respContactData       
    for(var i = 0;i < this.contactData.length; i++){
      var temp = "";
      var arrTopic = this.contactData[i].topic;
      for(var j = 0;j < arrTopic.length; j++){
        if(j > 0){
          temp += '/';
        }
        temp += arrTopic[j];
      }
      this.contactData[i].topic = temp;
    }
      }
      else{
        this.$message.error('Admin error,try again')
        console.log(resp)
      }
    })
    .catch(error => {
      if(error.response){
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      console.log(error.response)
      } else {
      // Something happened in setting up the request that triggered an Error
      console.log(error.message)
      }
      console.log(error.config);
    })
  },
  methods:{
      pass(row,index){
          //alert("pass");
          this.$axios.post('/passContact',{
            fullname:row.fullname,
            adminName:this.$store.state.userDetails,
            username:row.applicant
          })
          .then(resp => {
            if (resp.status === 200){
              this.$message('succeed to pass')
              //移除该行
              this.contactData.splice(index, 1)
            }
            else{
              this.$message.error('Some mistake, please try again')
            }
          })
          .catch(error => {
            this.$message.error('Some mistake, please try again')
      if(error.response){
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      console.log(error.response)
      } else {
      // Something happened in setting up the request that triggered an Error
      console.log(error.message)
      }
      console.log(error.config);
          })
      },
      refuse(row,index){
          //alert("refuse");
          this.$axios.post('/refuseContact',{
            fullname:row.fullname,
            adminName:this.$store.state.userDetails
          })
          .then(resp => {
            if (resp.status === 200){
              this.$message('succeed to refuse')
              //移除该行
              this.contactData.splice(index, 1)
            }
            else{
              this.$message.error('Some mistake, please try again')
            }
          })
          .catch(error => {
            this.$message.error('Some mistake, please try again')
      if(error.response){
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      console.log(error.response)
      } else {
      // Something happened in setting up the request that triggered an Error
      console.log(error.message)
      }
      console.log(error.config);
          })
      }
  }
}
</script>

<template>
<div id = "Admin">
    <el-container>
  <el-header></el-header>
  <el-main>
  <h3>管理员--会议申请处理</h3>
  <el-table
    :data="contactData"
    height="400"
    border
    stripe
    style="width: 100%">
    <el-table-column
      prop="shortname"
      label="会议简称">
    </el-table-column>
    <el-table-column
      prop="fullname"
      label="会议全称">
    </el-table-column>
    <el-table-column
      prop="deadline"
      label="投稿截止日期">
    </el-table-column>
    <el-table-column
      prop="resultReleaseTime"
      label="结果发布日期">
    </el-table-column>
    <el-table-column
      prop="organizationTime"
      label="举办时间">
    </el-table-column>
    <el-table-column
      prop="place"
      label="举办地点">
    </el-table-column>
    <el-table-column
      prop="place"
      label="举办地点">
    </el-table-column>
    <el-table-column
      prop="applicant"
      label="申请人">
    </el-table-column>
    <el-table-column
      prop="topic"
      label="会议主题">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作">
      <template slot-scope="scope">
        <el-button @click="pass(scope.row,scope.$index)" type="text" size="small">通过</el-button>
        <el-button @click="refuse(scope.row,scope.$index)" type="text" size="small">驳回</el-button>
      </template>
    </el-table-column>
  </el-table>
  </el-main>
</el-container>
</div>
</template>

<style scoped>
    .el-header{
    background-color: #52658F;
    color: #333;
    text-align: center;
    line-height: 60px;
  }  
  .el-main {
    background-color: #F7F5E6;
    color: #333;
    text-align: center;
    padding:30px;
  }
  body > .el-container {
    margin-bottom: 40px;
  }
  h3{
      margin:10px;
      text-align:left;
  }
</style>