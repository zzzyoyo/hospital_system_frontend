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
                    v-model="form.extract"
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
          <el-button plain v-if="form.writer.length>=2" @click="swapWindow()">
                   交换作者顺序
          </el-button>

          <el-dialog
            title="请输入要交换的两个作者的序号"
            :visible.sync="swapVisible"
            center>

            <el-form>
              <el-form-item label="标签一的序号">
                <el-input type="text" v-model="swap1" placeholder="标签一的序号" ></el-input>
              </el-form-item>

              <el-form-item label="标签二的序号">
                <el-input type="text" v-model="swap2" placeholder="标签二的序号" ></el-input>
             </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
              <el-button @click="swapVisible = false">取 消</el-button>
              <el-button type="primary" @click="swap()">确 定</el-button>
            </div>

          </el-dialog>























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
            v-for="defaultTag in meetingTags"
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
  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
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
    name: "Upload",
    data() {
      return {
        swap1:'',
        swap2:'',
        swapVisible:false,
        dialogFormVisible: false,
        temp:{
          writerName:'',
          sector:'',
          country:'',
          email:'',
        },
        options:countries,
        sectorOption:sectors,
        meetingTags:['养生','旅游'],

        fileList:[],
        form: {
          title: '',
          extract: '',
          writer:[
          ],
          topic:[],
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
      this.$axios.post('/getMeetingTags',{
        fullname:this.$route.query.name
      })
        .then(resp => {
          if(resp.status === 200 && resp.data.hasOwnProperty('allMeetingTags')){
            this.meetingTags = resp.data.allMeetingTags
          }
          else{
            console.log('返回标签列表错误')
            console.log(resp)
          }
        })
        .catch(error => {
          console.log('加载标签列表加载失败')
          console.log(error)
        })
    },

    methods: {
      swap(){
        var reg=/^[0-9]+.?[0-9]*$/;
        if(reg.test(this.swap1)&&reg.test(this.swap2)){
               if(this.swap1>=0&&this.swap1<this.form.writer.length&&this.swap2>=0&&this.swap2<this.form.writer.length){
                 var media=this.form.writer[this.swap1]
                 this.form.writer[this.swap1]=this.form.writer[this.swap2]
                 this.form.writer[this.swap2]=media
                 this.swapVisible=false
               }
               else{
                 this.$message({
                   type:'warning',
                   showClose: true,
                   message: '请输入正确的序号'
                 })
               }
        }
        else{
          this.$message({
            type:'warning',
            showClose: true,
            message: '请输入阿拉伯数字'
          })
        }
      },
      swapWindow(){
        this.swapVisible=true
      },
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
            this.dialogFormVisible = false;
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
        this.meetingTags.push(tag);
      },
      addTopic(str){
        this.form.topic.push(str);
        //标签被选过一次就不能再重复选了
        this.meetingTags.splice(this.meetingTags.indexOf(str), 1);

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
            //formData.append('writer',this.form.writer)

            formData.append('topic',this.form.topic)
            formData.append('meetingFullname',this.$route.query.name)
            console.log(formData.get('file'))
            console.log(formData.get('writer'))
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
              if(error.response){
                if(error.response.status === 400){
                  this.$message.error('论文标题重复，上传失败')
                }
                else if(error.response.status === 404){
                  this.$message.error('会议不存在，上传失败')
                }
                else{
                  this.$message.error('上传失败')
                }
              }
              else{
                this.$message.error('上传失败')
              }
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
