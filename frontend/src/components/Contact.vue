<template>
  <div id="Page"  >


      <div id="form">

        <el-form :model="contactForm"
                 :rules="rules"
                 class="contact_container"
                 label-position="left"
                 label-width="0px"
                 v-loading="loading"
                 :ref="contactForm">
          <el-form-item prop="shortname" style="margin-bottom:25px">
              <label class="lb">会议简称:</label>
              <el-input type="text"
                        class="textW"
                        v-model="contactForm.shortname"
                        auto-complete="off"
                        placeholder="请填写会议简称"></el-input>
            </el-form-item>
            <el-form-item prop="fullname" style="font-size:15px;color:#f00;margin-bottom:25px">
              <label class="lb">会议全称:</label>
              <el-input type="text"
                        class="textW"
                        v-model="contactForm.fullname"
                        auto-complete="off"
                        placeholder="请填写会议全称"></el-input>
            </el-form-item>
            <el-form-item prop="deadline" style="font-size:15px;color:#f00;margin-bottom:25px">
              <label class="lb">投稿截止日期:</label>
              <el-date-picker
                v-model="contactForm.deadline"
                align="right"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions"
                format="yyyy-MM-dd "
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="resultReleaseTime" style="font-size:15px;color:#f00;margin-bottom:25px">
              <label class="lb">结果发布日期:</label>
              <el-date-picker
                v-model="contactForm.resultReleaseTime"
                align="right"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions1"
                format="yyyy-MM-dd "
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="organizationTime" style="font-size:15px;color:#f00;margin-bottom:25px">
              <label class="lb">举办时间:</label>
              <el-date-picker
                v-model="contactForm.organizationTime"
                align="right"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions2"
                format="yyyy-MM-dd "
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="place" style="font-size:15px;color:#f00;margin-bottom:25px">
              <label class="lb">举办地点:</label>
              <el-cascader v-model="contactForm.place" :options="options" :props="{ expandTrigger: 'hover' }" placeholder="举办地点" :show-all-levels=false></el-cascader>
            </el-form-item>

          <el-form-item prop="topic" style="margin-bottom:25px">
            <label class="lb">会议标签:</label>
           <div class="window" id="inputTopic">
             <el-tag
               :key="tag"
               v-for="tag in contactForm.topic"
               closable
               :disable-transitions="false"
               @close="handleClose(tag)">
               {{tag}}
             </el-tag>
           </div>

            </el-form-item>

          <div class="window" id="topicList">

            <strong>topic 列表</strong><br>
            <el-tag
              class="d-tag"
              :key="defaultTag"
              v-for="defaultTag in tagList"
              @click="addTopic(defaultTag)"
              type="success"
              @focus="changeHighLight(defaultTag)"
              :disable-transitions="false"
            >
              {{defaultTag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

          </div>

            <el-form-item style="width: 100%">
              <el-button type="primary"
                         class="btn more mr-2"
                         style="width: 20%;background: #feac00;border: none;font-size:15px;font-weight:600"
                         v-on:click="contact(contactForm)">申请会议</el-button>
            </el-form-item>

          <!-- //banner-hny-info -->
        </el-form>
        <el-button v-show="bt_visible" :plain="true" @click="contactError"></el-button>
        <el-button v-show="bt_visible" :plain="true" @click="wrongSubmit"></el-button>
        <el-button v-show="bt_visible" :plain="true" @click="success"></el-button>
        <el-button v-show="bt_visible" :plain="true" @click="fail"></el-button>
      </div>
    </div>



</template>

<script>
import {countries} from '../assets/js/countries';
export default {
  name: 'Contact',
  data () {
    return {
      tagList: [],
      inputVisible: false,
      inputValue: '',
      bt_visible:false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      pickerOptions1: {
        disabledDate(time) {
         /* if (this.contactForm.deadline) {
           return (time.getTime() < (new Date(this.contactForm.deadline).getTime() - 24 * 60 * 60 * 1000));
          }
          else{*/
            return time.getTime() < Date.now();
      //   }
        },
      },
      pickerOptions2: {
        disabledDate(time) {
         /* if (this.contactForm.deadline) {
            return (time.getTime() < (new Date(this.contactForm.deadline).getTime() - 24 * 60 * 60 * 1000));
          }
          else{*/
            return time.getTime() < Date.now();
         // }
        },
      },
      contactForm: {
        shortname: '',
        fullname: '',
        deadline: '',
        resultReleaseTime: '',
        organizationTime: '',
        place: '',
        topic:[],
      },
      options:countries,
      rules: {
        shortname: [{required: true, message: '', trigger: 'blur'}],
        fullname: [{required: true, message: '', trigger: 'blur'}],
        deadline: [{required: true, message: '', trigger: 'blur'}, { trigger: 'blur'}],
        resultReleaseTime: [{required: true, message: '', trigger: 'blur'}, { trigger: 'blur'}],
        organizationTime: [{required: true, message: '', trigger: 'blur'}, { trigger: 'blur'}],
         // place: [{required: true, message: '', trigger: 'blur'}, { trigger: 'blur'}]
       // topic: [{required: true, message: '', trigger: 'blur'}, { trigger: 'blur'}],
      },
      loading: false
    }
  },
  created:function(){
    this.$axios.post('/getTagsList',{
    })
      .then(resp => {
        if(resp.status === 200 && resp.data.hasOwnProperty('allTagsInDataBase')){
          this.tagList = resp.data.allTagsInDataBase
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
    handleClose(tag) {
      this.contactForm.topic.splice(this.contactForm.topic.indexOf(tag), 1);
      //把删掉的标签扔回未选里面去
      this.tagList.push(tag);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.tagList.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },

    addTopic(str){
        this.contactForm.topic.push(str);
        //标签被选过一次就不能再重复选了
      this.tagList.splice(this.tagList.indexOf(str), 1);
    },


    userTypeChange() {
    },
    contactError() {
      this.$message({
        showClose: true,
        message: 'contact error',
        type: 'warning'
      });
    },

    wrongSubmit() {
      this.$message({
        showClose: true,
        message: 'wrong submit',
        type: 'error'
      });
    },
    success() {
      this.$message({
        showClose: true,
        message: '申请成功',
        type: 'success'
      });
    },
    fail() {
      this.$message({
        showClose: true,
        message: '申请失败',
      });
    },
    contact (formName) {
      if(formName.topic.length===0){
        this.$message({
          showClose: true,
          message: '会议标签数不能少于一个',
          type: 'warning'
        });
      }
      else{
        this.$refs[formName].validate(valid => {
          if(valid){
            this.$axios.post('/contact', {
              chairname:this.$store.state.userDetails,
              shortname: this.contactForm.shortname,
              fullname: this.contactForm.fullname,
              deadline: this.contactForm.deadline,
              resultReleaseTime: this.contactForm.resultReleaseTime,
              organizationTime: this.contactForm.organizationTime,
              place: this.contactForm.place,
              topic: this.contactForm.topic,
            })
              .then(resp => {
                if (resp.status === 200 ) {
                  this.success()
                  // alert("申请成功")
                  this.$router.replace({path:'/'})
                }
                else{
                  if(resp.status === 406 ||resp.status === 409 ){
                    this.$message({
                      showClose: true,
                      message: '请检查三个日期顺序!',
                    });
                  }
                  this.$message({
                    showClose: true,
                    message: '申请失败',
                  });
                }
              })
              .catch(error => {
                if(error.response){
                  if(error.response.status === 400){
                    this.$message.error(error.response.data.message)
                  }
                  else if(error.response.status=== 406 ||error.response.status === 409 ){
                    this.$message({
                      showClose: true,
                      message: '请检查三个日期顺序!',
                    });
                  }
                }
                else{
                  this.$message({
                    showClose: true,
                    message: 'contact error',
                    type: 'warning'
                  });
                }
                console.log(error)
                //alert('contact error')
              })
          } else {
            this.wrongSubmit()
            //alert('wrong submit')
          }
        })
      }


    }
  }
}
</script>
<style scoped>
  .contact_container{
    border-radius: 15px;
    background-clip: padding-box;
    background-color: #F7F5E6;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .contact_title {
    margin: 0px auto 10px auto;
    text-align: center;
    color: #494e8f;
  }


  .lb{
      margin-bottom: 25px;
      color: #2e3131;
      position:absolute;
      left:300px;
      font-size:17px;
      padding:3px;
  }
  .textW >>> input{
      border-radius: 5px;
      width: 250px;
      font-size:17px;
  }
  >>> .el-form-item__error{
    position:absolute;
    left:433px;
  }
  .el-form{
    padding: 20px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  #Page{
    padding-top: 100px;
    padding-left: 10px;
    padding-right: 10px;
    background-color: #52658F;
    min-height: auto;
    padding-bottom: 30px;
  }
  #form{
    padding: 20px;
    border-radius: 2px;box-shadow: 0 2px 4px rgba(0, 0, 0, .44), 0 0 6px rgba(0, 0, 0, .44);color: #0c5460;color: black;
    background-color: #e4e9ed;
    margin-bottom: 20px;
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
    width: 250px;
    padding: 2px;
  }
  #topicList{
    padding: 20px;
  }




  
</style>
