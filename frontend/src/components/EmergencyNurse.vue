<template>
  <el-container>
    <el-header>emergencyNurse</el-header>
    <el-container>
      <el-aside>
        <el-form :model="registerPatientForm"
                 class="login_container"
                 label-position="left"
                 label-width="0px"
                 v-loading="loading"
                 :ref="registerPatientForm">
          登记新病人
          <el-form-item prop="name" required>
            <el-input type="text"
                      v-model="registerPatientForm.name"
                      auto-complete="off"
                      placeholder="病人姓名"></el-input>
          </el-form-item>
          <el-form-item prop="condition_rating" required>
            <el-select v-model="registerPatientForm.condition_rating" placeholder="病情评级">
              <el-option label="轻症" :value=0></el-option>
              <el-option label="重症" :value=1></el-option>
              <el-option label="危重症" :value=2></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="result" required>
            <el-select v-model="registerPatientForm.result" placeholder="核酸检测结果">
              <el-option label="阴性" value="阴性"></el-option>
              <el-option label="阳性" value="阳性"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="date" required>
            <el-date-picker
              v-model="registerPatientForm.date"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-button type="primary"
                       class="btn more mr-2"
                       style="width: 30%;background: #afb4db;border: none;font-size:15px;font-weight:600"
                       v-on:click="register(registerPatientForm)">登记</el-button>
          </el-form-item>
        </el-form>
      </el-aside>
      <el-main>
        <div style="text-align: right">
          是否在隔离区：
          <el-radio-group v-model="isolated">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
            <el-radio :label="2">不筛选</el-radio>
          </el-radio-group>
          <br>
          治疗区域：
          <el-radio-group v-model="areaID">
            <el-radio :label="0">轻症区域</el-radio>
            <el-radio :label="1">重症区域</el-radio>
            <el-radio :label="2">危重症区域</el-radio>
            <el-radio :label="-1">不筛选</el-radio>
          </el-radio-group>
          <br>
          生命状态：
          <el-radio-group v-model="status">
            <el-radio :label="0">住院</el-radio>
            <el-radio :label="1">出院</el-radio>
            <el-radio :label="2">死亡</el-radio>
            <el-radio :label="3">不筛选</el-radio>
          </el-radio-group>
          <br>
          病情评级：
          <el-radio-group v-model="status">
            <el-radio :label="0">轻症</el-radio>
            <el-radio :label="1">重症</el-radio>
            <el-radio :label="2">危重症</el-radio>
            <el-radio :label="3">不筛选</el-radio>
          </el-radio-group>
          <br>
          <button @click="select()">筛选</button>
        </div>
        <el-table :data="patient_tableData" height="400">
          <el-table-column prop="patientID" label="病人ID">
          </el-table-column>
          <el-table-column prop="username" label="姓名">
          </el-table-column>
          <el-table-column prop="condition_rating" label="病情评级|0：轻症 1： 重症 2：危重">
          </el-table-column>
          <el-table-column prop="living_status" label="生命状态|0：住院 1：出院 2：死亡">
          </el-table-column>
          <el-table-column prop="area" label="所在区域">
          </el-table-column>
          <el-table-column prop="test_sheet" label="核酸检测单">
            <template slot-scope="scope">
              <router-link :to="{ path: 'test_sheet', query: { id: scope.row.patientID , name: scope.row.username}}">核酸检测单</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="state_record" label="状态记录表">
            <template slot-scope="scope">
              <router-link :to="{ path: 'state_record', query: { id: scope.row.patientID, name: scope.row.username }}">状态记录表</router-link>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
    export default {
      name: "EmergencyNurse",
      created: function (){
        this.$axios.post('/emergencyNurse',{
          emergencyNurse: this.$store.state.userDetails.username
        })
          .then(resp => {
            if(resp.status === 200){
              this.patient_tableData = resp.data.patient_tableData;
            }
          })
          .catch(err => {
            console.log(err);
            this.$message.error('急诊护士页面加载失败');
          })
      },
      data() {
        const item = {
          patientID:1,
          username: '王小虎',
          condition_rating: 0,
          living_status:0,
          area:'隔离区'
        };
        return {
          patient_tableData: Array(20).fill(item),
          radio: 0,
          areaID:-1,
          isolated:2,
          status: 3,
          rating:3,
          registerPatientForm: {
            name: null,
            condition_rating: null,
            result:null,
            date:null
          }
        }
      },
      methods:{
        select(){
          this.$axios.post('/selectAll',{
            areaID: this.areaID,
            isolated: this.isolated,
            rating: this.rating,
            status: this.status
          })
            .then(resp => {
              if(resp.status === 200){
                this.patient_tableData = resp.data.patient_tableData;
                this.$message({
                  showClose: true,
                  message: '筛选成功',
                  type: 'success'
                });
              }
            })
            .catch(err => {
              console.log(err);
              this.$message.error("筛选失败");
            })
        },
        register(formName){
          this.$refs[formName].validate(valid => {
            if(valid){
              alert(this.registerPatientForm.date);
              this.$axios.post('/registerPatient',{
                name: this.registerPatientForm.name,
                condition_rating: this.registerPatientForm.condition_rating,
                result: this.registerPatientForm.result,
                date: this.registerPatientForm.date
              })
                .then(resp => {
                  if(resp.status === 200){
                    this.$message({
                      showClose: true,
                      message: '登记成功，病人已进入'+resp.data.area,
                      type: 'success'
                    });
                    locate.reload();
                  }
                })
                .catch(err => {
                  console.log(err);
                  this.$message.error('登记失败');
                })
            }
            else{
              alert('请提交正确格式');
            }
          })
        }
      }
    }
</script>

<style scoped>
  body{
    margin: 0px;
    padding: 0px;
  }
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
  }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
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
</style>
