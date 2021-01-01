//这个组件包含查看pcmember，发送邀请，开启投稿功能
<script>
export default{
    name:'PCmembers',
    props:{
        contactName:String,
        state:Number
    },
    data(){
        return{
            fullname:'',
            searchResults:[],
            invitedPCmembers:[{
              username:'username',
              fullname:'fullname',
              email:'email',
              country:'country',
              state:'待确认'
          },{
              username:'shortname',
              fullname:'fullname',
              email:'deadline',
              country:'applicant',
              state:'已同意'
          },{
              username:'shortname',
              fullname:'fullname',
              email:'deadline',
              country:'applicant',
              state:'已拒绝'
          }],
            toInvite:[],
            confirmedPCmembers:[],
            confirmedNames:[],
            refusedPCmembers:[],
            waitingPCmembers:[] 
        }
    },
    watch:{
      invitedPCmembers:function(val){
        //清空数组
        this.confirmedNames=[]
        this.confirmedPCmembers=[]
        this.refusedPCmembers=[]
        this.waitingPCmembers=[]
        for(var i = 0; i < this.invitedPCmembers.length; i++){
          var item = this.invitedPCmembers[i]
          if(item.state === '已同意'){
            this.confirmedPCmembers.push(item)
            this.confirmedNames.push(item.username)
          }
          else if(item.state === '已拒绝'){
            this.refusedPCmembers.push(item)
          }
          else if(item.state === '待确认'){
            this.waitingPCmembers.push(item)
          }
          else{
            alert('invalid state')
          }
        }
      }
    },
    created:function(){
      this.$axios.post('/PCmember',{
      contactName:this.contactName
    })
    .then(resp => {
      if (resp.status === 200 && resp.data.hasOwnProperty("respPCmembers")){
        this.invitedPCmembers = resp.data.respPCmembers
      }
      else{
        console.log('PCmember加载失败')
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
        for(var i = 0; i < this.invitedPCmembers.length; i++){
          var item = this.invitedPCmembers[i]
          if(item.state === '已同意'){
            this.confirmedPCmembers.push(item)
            this.confirmedNames.push(item.username)
          }
          else if(item.state === '已拒绝'){
            this.refusedPCmembers.push(item)
          }
          else if(item.state === '待确认'){
            this.waitingPCmembers.push(item)
          }
          else{
            alert('invalid state')
          }
        }
    },
    methods:{
      searchUser(){
        this.$axios.post('/searchUser',{
      fullname:this.fullname
    })
    .then(resp => {
      if (resp.status === 200 && resp.data.hasOwnProperty("searchResults")){
        this.searchResults = resp.data.searchResults
        console.log('search success')
    //筛选已同意的用户和自己
    for(var i = 0;i < this.searchResults.length;i++){
      //alert(this.searchResults[i].username)
      if(this.confirmedNames.indexOf(this.searchResults[i].username) > -1 || this.searchResults[i].username == this.$store.state.userDetails){
        this.searchResults.splice(i, 1); 
        i--;
      }
    }
      }
      else{
        alert('search error')
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
      sendInvitation(){
        if(this.toInvite.length>0){
        this.$axios.post('/sendInvitation',{
      inviter:this.$store.state.userDetails,
      contactName:this.contactName,
      toInvite:this.toInvite
    })
    .then(resp => {
      if (resp.status === 200 && resp.data.hasOwnProperty("respPCmembers")){
        this.invitedPCmembers = resp.data.respPCmembers
        this.$message({
          message: '邀请发送成功',
          type: 'success'
        })
      }
      else{
        this.$message.error('邀请发送失败')
        console.log(resp)
      }
    })
    .catch(error => {
      if(error.response){
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      this.$message.error('请求已发出，但服务器响应的状态码不在 2xx 范围内')
      console.log(error.response)
      } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
      }
      console.log(error.config);
    })
        }
        else{
          this.$message("请选择一名以上用户")
        }
      },
      startReview(wayOfAssignment){
        // this.$emit('startReview')
          if(this.state === 2){
                  if(this.confirmedPCmembers.length >= 3){
                      //上面2个条件都满足才发送请求
              this.$axios.post('startReview',{
                  contactName:this.contactName,
                  way:wayOfAssignment//0代表基于topic，1代表基于负担
              })
              .then(resp => {
                  if (resp.status === 200){
                      this.$message({message: '稿件分配成功，已进入审稿状态，可在【稿件基本情况】查看进度',type: 'success'})
                      //向父组件抛出事件
                      this.$emit('startReview')
                  }
                  else{
                      this.$message({message: '稿件分配失败',type: 'error'})
                  }
              })
              .catch(error => {
                  if(error.response){
                      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                      if(error.response.status === 406){
                          this.$message.error("符合条件的审稿人不足，稿件分配失败")
                      }
                      console.log(error.response)
                  }
                  else{
                      //Something happened in setting up the request that triggered an Error
                      console.log(error)
                  }
              })
                  }
                  else{
                      this.$message.error("审稿人不足3位，无法进行分配")
                  }
          }
          else if(this.state > 2){
              this.$message.error("已开启审稿，不能再次开启")
          }
          else{
              this.$message.error("未开启会议，先去开启会议吧~")
          }
      },
        topic(){
            //alert('基于topic相关度')
            this.startReview(0)
        },
        load(){
            //alert('基于审稿平均负担')
            this.startReview(1)
        }
    }
}
</script>

<template>
<div id="PCmembers">
<el-divider content-position="left"><span style="color:pink;font-size:larger">邀请程序委员会成员</span></el-divider>
<div style="margin-top: 15px;">
  <el-input placeholder="请输入用户姓名进行搜索(不能邀请自己和已同意的成员)" v-model="fullname" clearable>
    <el-button slot="append" icon="el-icon-search" @click='searchUser'></el-button>
  </el-input>
  <div style="margin-top: 15px;" id="searchResults" v-if="searchResults.length > 0">
  <el-divider content-position="left"><span>搜索结果</span></el-divider>
  <el-checkbox-group v-model="toInvite">
  <el-table
    :data="searchResults"
    border
    stripe
    style="width: 100%">
    <el-table-column
      prop="username"
      label="用户名">
      <template slot-scope="scope">
      <el-checkbox :label='scope.row.username'></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column
      prop="fullname"
      label="姓名">
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱">
    </el-table-column>
    <el-table-column
      prop="country"
      label="区域">
    </el-table-column>
  </el-table>
  </el-checkbox-group>
  <el-button type="info" icon="el-icon-message" @click='sendInvitation' style='float:right; margin-top:10px'>发送邀请</el-button>
  </div>
</div>
<div style='margin-top:50px;'>
<el-divider content-position="left"><span style="color:yellowgreen;font-size:larger">邀请状态</span></el-divider>
<el-collapse>
  <el-collapse-item :title="'已同意（包括自己）: '+confirmedPCmembers.length+'人'" name="confirmed" >
    <el-table
    :data="confirmedPCmembers"
    stripe
    style="width: 100%">
    <el-table-column
      prop="username"
      label="用户名">
    </el-table-column>
    <el-table-column
      prop="fullname"
      label="姓名">
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱">
    </el-table-column>
    <el-table-column
      prop="country"
      label="区域">
    </el-table-column>
  </el-table>
  </el-collapse-item>
  <el-collapse-item :title="'已拒绝: '+refusedPCmembers.length+'人'" name="refused">
    <el-table
    :data="refusedPCmembers"
    stripe
    style="width: 100%">
    <el-table-column
      prop="username"
      label="用户名">
    </el-table-column>
    <el-table-column
      prop="fullname"
      label="姓名">
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱">
    </el-table-column>
    <el-table-column
      prop="country"
      label="区域">
    </el-table-column>
  </el-table>
  </el-collapse-item>
  <el-collapse-item :title="'待确认: '+waitingPCmembers.length+'人'" name="waiting">
    <el-table
    :data="waitingPCmembers"
    stripe
    style="width: 100%">
    <el-table-column
      prop="username"
      label="用户名">
    </el-table-column>
    <el-table-column
      prop="fullname"
      label="姓名">
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱">
    </el-table-column>
    <el-table-column
      prop="country"
      label="区域">
    </el-table-column>
  </el-table>
  </el-collapse-item>
</el-collapse> 
<el-popconfirm
  confirmButtonText='基于话题相关度'
  cancelButtonText='基于审稿平均负担'
  title="选择分配方式"
  @onConfirm='topic'
  @onCancel='load'
>
  <el-button  slot="reference" type="info" icon="el-icon-message" style='float:right; margin-top:10px'>开启初次审稿</el-button>
  <el-button>删除</el-button>
</el-popconfirm>
</div>
</div>
</template>