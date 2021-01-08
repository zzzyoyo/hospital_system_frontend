<template>
  <el-container>
    <el-header>病房护士的界面</el-header>
    <el-container>
      <el-aside>
        <p>我所在的治疗区域(1：轻症 2：重症 4：危重症)：{{area}}</p>
        <p>主治医生：{{doctor}}</p>
        <p>护士长：{{headNurse}}</p>
      </el-aside>
      <el-main>
        <div style="text-align: right">
          是否满足出院条件：
          <el-radio-group v-model="leave">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
            <el-radio :label="2">不筛选</el-radio>
          </el-radio-group>
          <br>
          是否待转入其他治疗区域：
          <el-radio-group v-model="trans">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
            <el-radio :label="2">不筛选</el-radio>
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
          <button @click="select()">筛选</button>
        </div>
        <el-table :data="myPatient_tableData" height="400">
          <el-table-column prop="patientID" label="病人ID">
          </el-table-column>
          <el-table-column prop="username" label="姓名">
          </el-table-column>
          <el-table-column prop="condition_rating" label="病情评级|0：轻症 1： 重症 2：危重">
          </el-table-column>
          <el-table-column prop="living_status" label="生命状态|0：住院 1：出院 2：死亡">
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
          <el-table-column prop="state_record" label="日常记录">
            <template slot-scope="scope">
              <el-form :model="recordForm[scope.$index]"
                       class="login_container"
                       label-position="left"
                       label-width="0px"
                       :ref="recordForm[scope.$index]">
                <el-form-item prop="temperature" required>
                  <el-input type="text"
                            v-model="recordForm[scope.$index].temperature"
                            auto-complete="off"
                            placeholder="温度（℃）"></el-input>
                </el-form-item>
                <el-form-item prop="symptom" required>
                  <el-input type="text"
                            v-model="recordForm[scope.$index].symptom"
                            auto-complete="off"
                            placeholder="症状"></el-input>
                </el-form-item>
                <el-form-item prop="date" required>
                  <el-date-picker
                    v-model="recordForm[scope.$index].date"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item style="width: 100%">
                  <el-button @click="daily_record(scope.row,scope.$index)" type="primary" size="small">提交记录</el-button>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
    export default {
      name: "WardNurse",
      created: function (){
        this.$axios.post('/wardNurse',{
          username: this.$store.state.userDetails.username
        })
          .then(resp => {
            if(resp.status === 200){
              console.log(resp.data)
              this.area = resp.data.area;
              this.doctor = resp.data.doctor;
              this.headNurse = resp.data.headNurse;
              this.myPatient_tableData = resp.data.patient_tableData;
              const arecord = {
                temperature: null,
                symptom: null,
                date: null
              };
              this.recordForm = Array(this.myPatient_tableData.length).fill(arecord);
            }
          })
          .catch(err => {
            console.log(err);
            this.$message.error('病房护士页面加载失败');
          })
      },
      data() {
        const item = {
          patientID:1,
          username: '王小虎',
          condition_rating: 0,
          living_status:0,
        };
        const arecord = {
          temperature: null,
          symptom: null,
          date: null
        };
        return {
          area:0,
          doctor: '张哼哼',
          headNurse:'张冬瓜',
          myPatient_tableData: Array(20).fill(item),
          radio: 0,
          leave: 2,
          trans: 2,
          status: 3,
          recordForm: Array(20).fill(arecord)
        }
      },
      methods:{
        daily_record(row, index){
          // alert("daily_record for"+row.username);
          console.log(this.recordForm[index]);
          this.$axios.post("/addDailyRecord",{
            patientName: row.username,
            temperature: parseFloat(this.recordForm[index].temperature),
            symptom: this.recordForm[index].symptom,
            date: this.recordForm[index].date
          })
            .then(resp => {
              if(resp.status === 200){
                this.$message({
                  showClose: true,
                  message: '记录成功',
                  type: 'success'
                });
              }
              else {
                this.$message.error("记录失败");
              }
            })
            .catch(err => {
              console.log(err);
              this.$message.error("记录失败");
          })
        },
        select(){
          this.$axios.post('/selectFromMyPatient',{
            area_type: this.area,
            wardNurseName:this.$store.state.userDetails.username,
            leave: this.leave,
            trans: this.trans,
            status: this.status
          })
            .then(resp => {
              if(resp.status === 200){
                this.myPatient_tableData = resp.data.patient_tableData;
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
        }
      }
    }
</script>

<style scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
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
