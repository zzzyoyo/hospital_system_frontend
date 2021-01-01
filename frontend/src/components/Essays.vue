//这个组件包含该会议的所有稿件，以及分配和审核状态
<script>
export default{
    name:'Essays',
    props:{
        contactName:String,
        state:Number
    },
    data(){
        return{
            dialogDatePickerVisible:false,
            rebuttalDeadline:'',
            pickerOptions:{
                disabledDate(time){
                    return time.getTime() <= (Date.now() + 3600 * 1000 * 24 * 7);//一周后
                }
            },
            essaysData:[{
                title:'title1',
                writer:['zyr','hty'],
                topic:['Beauty','Life','Food'],
                author:'Mary',
                assignment:[{
                    name:'hhh',
                    essayState:1
                },{
                    name:'ddd',
                    essayState:0
                },{
                    name:'ddd',
                    essayState:0
                }],
                state:0
            },{
                title:'title2',
                writer:['zyr','hty'],
                topic:['Beauty','Life','Food'],
                author:'Mary',
                assignment:[{
                    name:'hhh',
                    essayState:1
                },{
                    name:'ddd',
                    essayState:1
                },{
                    name:'ddd',
                    essayState:1
                }],
                state:1
            },{
                title:'title3',
                writer:['zyr','hty'],
                topic:['Beauty','Life','Food'],
                author:'Mary',
                assignment:[{
                    name:'hhh',
                    essayState:1
                },{
                    name:'ddd',
                    essayState:1
                },{
                    name:'ddd',
                    essayState:2
                }],
                state:1
            },{
                title:'title4',
                writer:['zyr','hty'],
                topic:['Beauty','Life','Food'],
                author:'Mary',
                assignment:[{
                    name:'hhh',
                    essayState:2
                },{
                    name:'ddd',
                    essayState:2
                },{
                    name:'ddd',
                    essayState:2
                }],
                state:2
            },{
                title:'title5',
                writer:['zyr','hty'],
                topic:['Beauty','Life','Food'],
                author:'Mary',
                assignment:[{
                    name:'hhh',
                    essayState:6
                },{
                    name:'ddd',
                    essayState:6
                },{
                    name:'ddd',
                    essayState:6
                }],
                state:6
            },{
                title:'title6',
                writer:['zyr','hty'],
                topic:['Beauty','Life','Food'],
                author:'Mary',
                assignment:[{
                    name:'hhh',
                    essayState:5
                },{
                    name:'ddd',
                    essayState:6
                },{
                    name:'ddd',
                    essayState:6
                }],
                state:5
            },{
                title:'title7',
                writer:['zyr','hty'],
                topic:['Beauty','Life','Food'],
                author:'Mary',
                assignment:[{
                    name:'hhh',
                    essayState:3
                },{
                    name:'ddd',
                    essayState:3
                },{
                    name:'ddd',
                    essayState:3
                }],
                state:3
            },{
                title:'title8',
                writer:['zyr','hty'],
                topic:['Beauty','Life','Food'],
                author:'Mary',
                assignment:[{
                    name:'hhh',
                    essayState:4
                },{
                    name:'ddd',
                    essayState:4
                },{
                    name:'ddd',
                    essayState:4
                }],
                state:4
            }]
        }
    },
    watch:{
        state:function(val){
            if(val >= 3){
                //post for assignment
        this.$axios.post('/essaysData',{
            contactFullName:this.contactName,
            contactState:val
        })
        .then(resp => {
            if(resp.status === 200 && resp.data.hasOwnProperty('respEssaysData')){
                this.essaysData = resp.data.respEssaysData
                this.transform();
                this.convert();
            }
            else{
                console.log('返回数据有误')
                console.log(resp)
            }
        })
        .catch(error => {
            console.log('稿件加载失败')
            console.log(error)
        })
            }
        }
    },
    created:function(){
        //this.transform();
        //this.convert();
        this.$axios.post('/essaysData',{
            contactFullName:this.contactName,
            contactState:this.state
        })
        .then(resp => {
            if(resp.status === 200 && resp.data.hasOwnProperty('respEssaysData')){
                this.essaysData = resp.data.respEssaysData
                console.log('返回论文状态：')
                console.log(this.essaysData)
                //console.log(resp.data.respEssaysData)
                //将字符数组处理成字符串
                //this.transform();
                //将论文状态从数字换成文字
                this.convert();
            }
            else{
                console.log('返回数据有误')
                console.log(resp)
            }
        })
        .catch(error => {
            console.log('稿件加载失败')
            console.log(error)
        })
    },
    methods:{
        showDialog(){
            //以确保state==3
            for(var i = 0; i < this.essaysData.length;i++){
                if(this.essaysData[i].state !== '已完成'){
                    this.$message.error('还有稿件未完成，无法公布结果')
                    return
                }
            }
            //全部完成才选择日期
            this.dialogDatePickerVisible = true
        },
        releaseResult(){
            //发布结果
            this.dialogDatePickerVisible = false
            this.$axios.post('/releaseResult',{
                contactFullName:this.contactName,
                rebuttalDeadline:this.rebuttalDeadline
            })
            .then(resp => {
                if(resp.status === 200){
                    this.$message({type:'success',message:'发布成功'})
                    this.$emit('releaseResult')
                }
            })
            .catch(error => {
                if(error.repsonse){
                    this.$message.error('发布失败')
                }
                else{
                    this.$message.error('出现了一些错误，请重试')
                }
                console.log('发布失败')
                console.log(error)
            })
        },
        releaseSecondResult(){
            //以确保state==5
            for(var i = 0; i < this.essaysData.length;i++){
                if(this.essaysData[i].state !="未提交驳斥" && this.essaysData[i].state != '已完成'){
                    this.$message.error('还有稿件未完成，无法公布结果')
                    return
                }
            }
            //发布结果
            this.$axios.post('/releaseSecondResult',{
                contactFullName:this.contactName
            })
            .then(resp => {
                if(resp.status === 200){
                    this.$message({type:'success',message:'发布成功'})
                    this.$emit('releaseSecondResult')
                }
            })
            .catch(error => {
                if(error.repsonse){
                    this.$message.error('发布失败')
                }
                else{
                    this.$message.error('出现了一些错误，请重试')
                }
                console.log('发布失败')
                console.log(error)
            })
        },
        endRebuttal(){
            this.$axios.post('/endRebuttal',{
                contactFullName:this.contactName
            })
            .then(resp => {
                if(resp.status === 200){
                    this.$message({type:'success',message:'驳斥提交阶段已结束'})
                    this.$emit('endRebuttal')
                }
            })
            .catch(error => {
                if(error.response){
                    if(error.response.status === 400){
                        this.$message('还未到预期截至时间，不能提前截止')
                    }
                    else{this.$message.error('终止失败')}
                }
                else{
                    this.$message.error('出现了一些错误，请重试')
                }
                console.log('终止失败')
                console.log(error)
            })
        },
        transform(){
            //将字符数组处理成字符串
    for(var i = 0;i < this.essaysData.length; i++){
      var temp = "";
      var arrTopic = this.essaysData[i].topic;
      for(var j = 0;j < arrTopic.length; j++){
        if(j > 0){
          temp += '/';
        }
        temp += arrTopic[j];
      }
      this.essaysData[i].topic = temp;
      temp = "";
      var arrWriter = this.essaysData[i].writer;
      for(var j = 0;j < arrWriter.length; j++){
        if(j > 0){
          temp += ',';
        }
        temp += arrWriter[j];
      }
      this.essaysData[i].writer = temp;
    }
        },
        convert(){
            for(var i=0;i < this.essaysData.length;i++){
                var assignment = this.essaysData[i].assignment;
                var stateText;
                for(var j = 0;j < assignment.length;j++){
                    switch(assignment[j].essayState){
                        case 0:{
                            stateText = "批阅中";
                            break;
                        }
                        case 1:{
                            stateText = "已批阅";
                            break;
                        }
                        case 2:{
                            stateText = "已确认";
                            break;
                        }
                        case 3:{
                            stateText = "未提交驳斥";
                            break;
                        }
                        case 4:{
                            stateText = "未提交驳斥";
                            break;
                        }
                        case 5:{
                            stateText = "未确认";
                            break;
                        }
                        case 6:{
                            stateText = "已确认";
                            break;
                        }
                        default:
                            break;
                    }
                    assignment[j].essayState = stateText;
                }
                switch(this.essaysData[i].state){
                        case 0:{
                            stateText = "批阅中";
                            break;
                        }
                        case 1:{
                            stateText = "确认中";
                            break;
                        }
                        case 2:{
                            stateText = "已完成";
                            break;
                        }
                        case 3:{
                            stateText = "未提交驳斥";
                            break;
                        }
                        case 4:{
                            stateText = "未提交驳斥";
                            break;
                        }
                        case 5:{
                            stateText = "确认中";
                            break;
                        }
                        case 6:{
                            stateText = "已完成";
                            break;
                        }
                        default:
                            break;
                }
                this.essaysData[i].state = stateText
            }
        }
    }
}
</script>

<template>
<div id='Essays'>
<el-table
    :data="essaysData"
    border
    stripe
    style="width: 100%">
    <el-table-column
      prop="title"
      label="论文标题">
    </el-table-column>
    <el-table-column
      prop="writer"
      label="论文作者">
    </el-table-column>
    <el-table-column
      prop="topic"
      label="论文主题">
    </el-table-column>
    <el-table-column
      prop="author"
      label="投稿人">
    </el-table-column>
    <el-table-column
      width='200px'
      label="论文状态">
      <template v-slot="scope">
      <p v-if="state < 3">未分配</p>
<div v-else-if='state == 3'>
<el-popover
  placement="left"
  trigger="click">
  <el-table :data="essaysData[scope.$index].assignment">
    <el-table-column property="name" label="审稿人"></el-table-column>
    <el-table-column property="essayState" label="状态"></el-table-column>
  </el-table>
  <el-button slot="reference">初审,{{essaysData[scope.$index].state}},点击查看</el-button>
</el-popover>
</div>
<div  v-else-if='state == 5 || state == 4'>
<p v-if='essaysData[scope.$index].state == "未提交驳斥"'>未提交驳斥，不进行复审</p>
<el-popover
  v-else
  placement="left"
  trigger="click">
  <el-table :data="essaysData[scope.$index].assignment">
    <el-table-column property="name" label="审稿人"></el-table-column>
    <el-table-column property="essayState" label="状态"></el-table-column>
  </el-table>
  <el-button slot="reference">复审,{{essaysData[scope.$index].state}},点击查看</el-button>
</el-popover>
</div>
      <p v-else>已发布最终结果</p>
      </template>
    </el-table-column>
  </el-table>
  <el-button v-if="state==3" type="info" icon="el-icon-message" @click='showDialog' style='float:right; margin-top:10px'>发布初审结果</el-button>
  <el-button v-if="state==5" type="info" icon="el-icon-message" @click='releaseSecondResult' style='float:right; margin-top:10px'>发布最终结果</el-button>
  <el-button v-if="state==4" type="info" icon="el-icon-message" @click='endRebuttal' style='float:right; margin-top:10px'>终止驳斥提交</el-button>
<el-dialog title="选择驳斥提交截止日期，至少距离今天一周" :visible.sync="dialogDatePickerVisible">
    <el-date-picker
      v-model="rebuttalDeadline"
      type="date"
      :picker-options="pickerOptions"
      align="right"
      placeholder="选择截止日期"
      value-format="yyyy-MM-dd">
    </el-date-picker>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogDatePickerVisible = false">取 消</el-button>
    <el-button type="primary" @click="releaseResult">确 定</el-button>
  </div>
</el-dialog>
</div>
</template>