<template>
  <div id="uploadWindow">
    <div id="window">
      <p>投稿会议名：<span style="color: #0c5460">{{this.$route.query.name}}</span></p>
      <el-form :ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="论文标题" prop="title">
          <el-input type="text"
                    v-model="form.title"
                    placeholder="请输入论文标题"
                    maxlength="50"
                    show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="摘要" prop="extract">
          <el-input type="textarea"
                    v-model="form.summary"
                    autosize
                    placeholder="请输入论文摘要"
                    maxlength="800"
                    show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="文章作者" prop="writer">
          <el-tag
            type="info"
            v-for="iwriter in form.writer"
            :disable-transitions="false"
            :key="iwriter.writerName"
            closable
            @close="deleteWriter(iwriter)"
          >
            {{iwriter.writerName}}
          </el-tag>

          <el-button type="text"
                     @click="openAddWindow()"
          >点击添加作者</el-button>
          <el-dialog
            title="作者信息"
            :visible.sync="dialogFormVisible"
            center>

            <el-form :ref="temp" :model="temp" :rules="windowRules">
              <el-form-item label="作者姓名" prop="writerName" >
                <el-input type="text" v-model="temp.writerName"
                          auto-complete="off" placeholder="作者姓名" ></el-input>
              </el-form-item>
              <el-form-item label="单位" prop="sector" >
                <el-cascader v-model="temp.sector"
                             :options="sectorOption"
                             :props="{ expandTrigger: 'hover' }"
                             placeholder="sector"
                             style='width:100%'
                             :show-all-levels=false
                ></el-cascader>
              </el-form-item>
              <el-form-item label="国家" prop="country" >
                <el-cascader v-model="temp.country"
                             :options="options"
                             :props="{ expandTrigger: 'hover' }"
                             placeholder="country"
                             style='width:100%'
                             :show-all-levels=false
                ></el-cascader>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input type="email" v-model="temp.email"
                          auto-complete="off" placeholder="email" ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="addWriter(temp)">确 定</el-button>
            </div>
          </el-dialog>

        </el-form-item>
        
        <el-form-item label="论文标签" prop="topic">
          <div class="window" id="inputTopic" style="margin-bottom:25px">
            <el-tag
              :key="tag"
              v-for="tag in form.topic"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
          </div>
        </el-form-item>

        <div class="window" id="topicList">

          <strong>该会议对应topic</strong><br>
          <el-tag
            class="d-tag"
            :key="defaultTag"
            v-for="defaultTag in form.meetingTags"
            @click="addTopic(defaultTag)"
            type="success"
            :disable-transitions="false"
          >
            {{defaultTag}}
          </el-tag>
        </div>

        <el-form-item>
          <el-upload
            class="upload-demo"
            ref="upload"
            action=""
            accept='.pdf'
            :http-request='uploadFileMethod'
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">重新选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload(form)">上传到服务器</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {emailValid} from '../assets/js/dataValid';
  import {countries} from '../assets/js/countries';
  import {sectors} from '../assets/js/sectors';

  export default {
    name: "EditMyEssay",
    data() {
      return {
        dialogFormVisible: false,
        temp:{
          writerName:'',
          sector:'',
          country:'',
          email:'',
        },
        options:countries,
        sectorOption:sectors,


        fileList:[],
        form: {
          title:this.$route.query.title,
          summary: '',
          writer:[{
            writerName:'第一作者',
            sector:'复旦大学',
            country:'Canada',
            email:'333@qq.com',
          },
            {
              writerName:'第二作者',
              sector:'吃饭大学',
              country:'Canada',
              email:'33344@qq.com',
            },
          ],
          topic:[],
          meetingTags:['标签1','标签2','标签3','标签4',],
        },
        rules: {
          title: [{required: true, message: '', trigger: 'blur'}],
          extract: [{required: true, message: '', trigger: 'blur'}],
          writer: [{required: true, message: '', trigger: 'blur'}],
          topic: [{required: true, message: '', trigger: 'blur'}],
        },
        windowRules:{
          writerName: [{required: true, message: '', trigger: 'blur'}],
          sector: [{required: true, message: '', trigger: 'blur'}],
          country: [{required: true, message: '', trigger: 'blur'}],
          email: [{required: true, message: '', trigger: 'blur'}, {validator: emailValid, trigger: 'blur'}],
        }
      }
    },

    created:function(){
      this.$axios.post('/getHistoryUpload',{
        //会议全名
        meetingFullname:this.$route.query.name,
        //投稿人的名字
        author:this.$store.state.userDetails,
        //投稿文章的标题
        title:this.$route.query.title,
      })
        .then(resp => {
          if(resp.status === 200 && resp.data.hasOwnProperty('historyUpload')){
            this.form = resp.data.historyUpload
          }
          else{
            console.log('返回历史上传错误')
            console.log(resp)
          }
        })
        .catch(error => {
          console.log('历史上传加载失败')
          console.log(error)
        })
    },

    methods: {
      deleteWriter(iwriter) {
        this.form.writer.splice(this.form.writer.indexOf(iwriter), 1);
      },
      openAddWindow(){
        this.dialogFormVisible = true
      },
      addWriter(formName){
        this.$refs[formName].validate(valid =>{
            if (valid){
              var tmp={
                writerName:'',
                sector:'',
                country:'',
                email:'',
              }
              tmp.writerName=formName.writerName
                tmp.sector=formName.sector
                tmp.country=formName.country
                tmp.email=formName.email
                this.form.writer.push(tmp)
              this.dialogFormVisible = false
            }
            else{
              this.$message({
                type:'warning',
                showClose: true,
                message: '表单格式错误'
              })
            }
          }
        )
      },

      handleClose(tag) {
        this.form.topic.splice(this.form.topic.indexOf(tag), 1);
        //把删掉的标签扔回未选里面去
        this.form.meetingTags.push(tag);
      },
      addTopic(str){
        this.form.topic.push(str);
        //标签被选过一次就不能再重复选了
        this.form.meetingTags.splice(this.form.meetingTags.indexOf(str), 1);

      },
      submitUpload(formName) {
        this.$refs[formName].validate(valid => {
          if(valid){
            this.$refs.upload.submit();
          }
          else{
            this.$message.error('请提交正确的格式')
          }
        })
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      uploadFileMethod(param){
        let fileObject = param.file;
        let formData = new FormData();
        formData.append("file", fileObject);
        formData.append('title',this.form.title)
        formData.append('authorname',this.$store.state.userDetails)
        formData.append('summary',this.form.extract)
        
        var writerStr=JSON.stringify(this.form.writer)
        formData.append('writer',writerStr)
       // formData.append('writer',this.form.writer)
        formData.append('topic',this.form.topic)
        formData.append('meetingFullname',this.$route.query.name)
        console.log(formData.get('file'))
        this.$axios.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
          .then(resp => {
            if(resp.status === 200){
              this.$message({
                type:'success',
                showClose: true,
                message: '上传成功'
              })
            }
            else{
              this.$message({
                type:'success',
                showClose: true,
                message: '上传失败'
              })
            }
            console.log(resp)
          })
          .catch(error => {
            this.$message({
              type:'success',
              showClose: true,
              message: '上传失败'
            })
            console.log(error.response)
          })
      }
    }
  }
</script>

<style scoped>
  #uploadWindow{
    background-color: #52658F;
    padding-top: 70px;
    padding-left: 100px;
    padding-right: 100px;
    min-height: auto;
    padding-bottom: 30px;
  }
  #window{
    padding: 20px;
    border-radius: 2px;box-shadow: 0 2px 4px rgba(0, 0, 0, .44), 0 0 6px rgba(0, 0, 0, .44);color: #0c5460;color: black;
    background-color: white;
    margin: 20px;
  }
  .el-button--success{
    background-color:#feac00;
    border-color:#feac00;
  }
  .el-tag{
    margin-left: 5px;
  }
  .window{
    background-color: white;
    margin: 0 auto;
    margin-bottom: 25px;
    border:1px solid lightgrey;
    border-radius: 4px;
  }
  #inputTopic{
    min-height: 45px;
    height:auto;
  }
  #topicList{
    padding: 20px;
  }

</style>
