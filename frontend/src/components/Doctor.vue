<template>
  <el-container>
    <el-header>Doctor</el-header>
    <el-main>
      <el-container style="height: 500px; border: 1px solid #eee">
        <el-aside width="200px">
          <p>当前治疗区域：area</p>
          <p>护士长：{{headNurse}}</p>
          <el-card class="box-card" style="width: 100%;">
            <div slot="header" class="clearfix">
              <span>病房护士</span>
            </div>
            <div v-for="nurse in wardNurse_tableData" :key="nurse.name" class="text item">
              {{nurse.name+': ' }}
              <span v-for="patient in nurse.patients" :key="'nurse'+patient">{{patient+' '}}</span>
            </div>
          </el-card>
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
          <el-table :data="patient_tableData" height="350">
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
            <el-table-column
              fixed="right"
              label="操作">
              <template slot-scope="scope">
                <el-button @click="acid_test(scope.row,scope.$index)" type="text" size="small">进行核酸检测</el-button>


                <el-button @click="ratingRevise_dialogVisible=true" type="text" size="small">修改病情评级</el-button>
                <el-dialog
                  title="修改病情评级"
                  :visible.sync="ratingRevise_dialogVisible"
                  width="30%"
                  append-to-body>
                  <el-radio-group v-model="radio">
                    <el-radio :label="0">0：轻症</el-radio>
                    <el-radio :label="1">1：重症</el-radio>
                    <el-radio :label="2">2：危重症</el-radio>
                  </el-radio-group>
                  <span slot="footer" class="dialog-footer">
                      <el-button @click="ratingRevise_dialogVisible = false">取 消</el-button>
                      <el-button type="primary" @click="ratingRevise_dialogVisible = false; ratingRevise(scope.row,scope.$index) ">确 定</el-button>
                    </span>
                </el-dialog>


                <el-button @click="statusRevise_dialogVisible = true" type="text" size="small">修改生命状态</el-button>
                <el-dialog
                  title="修改生命状态"
                  :visible.sync="statusRevise_dialogVisible"
                  width="30%"
                  append-to-body>
                  <el-radio-group v-model="radio">
                    <el-radio :label="0">0：住院</el-radio>
                    <el-radio :label="1">1：出院</el-radio>
                    <el-radio :label="2">2：死亡</el-radio>
                  </el-radio-group>
                  <span slot="footer" class="dialog-footer">
    <el-button @click="statusRevise_dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="statusRevise_dialogVisible = false; statusRevise(scope.row,scope.$index)">确 定</el-button>
  </span>
                </el-dialog>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
    export default {
      name: "Doctor",
      created: function (){
        this.$axios.post('/doctor',{
          doctor: this.$store.state.userDetails.username
        })
          .then(resp => {
            if(resp.status === 200){
              this.area = resp.data.area;
              this.headNurse = resp.data.headNurse;
              this.wardNurse_tableData = resp.data.wardNurse_tableData;
              this.patient_tableData = resp.data.patient_tableData;
            }
          })
          .catch(err => {
            console.log(err);
            this.$message.error('医生页面加载失败');
          })
      },
      data() {
        const item = {
          patientID:1,
          username: '王小虎',
          condition_rating: 0,
          living_status:0,
        };
        return {
          area:0,
          headNurse:'张冬瓜',
          wardNurse_tableData:[{name:'111', patients:['aaa','bbb','ccc']},{name:'121', patients:['aaa','bbb','ccc']},{name:'131', patients:['aaa','bbb','ccc']}],
          patient_tableData: Array(20).fill(item),
          ratingRevise_dialogVisible: false,
          statusRevise_dialogVisible: false,
          radio: 0,
          leave: 2,
          trans: 2,
          status: 3
        }
      },
      methods:{
        acid_test(row, index){
          alert("nucleic_acid_test");
        },
        ratingRevise(row, index){
          alert("Revise rating of patient "+row.username+" to "+this.radio);
          this.$axios.post('/ratingRevise',{
            patiendID: row.patientID,
            condition_rating: this.radio
          })
            .then(resp => {
              if (resp.status === 200 ){
                this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success'
                });
                row.condition_rating = this.radio;
              }
              else {
                console.log(err);
                this.$message.error('修改失败')
              }
            })
            .catch(error => {
              console.log(err);
              this.$message.error('修改失败')
            })
        },
        statusRevise(row, index){
          alert("Revise status of patient"+row.username);
          this.$axios.post('/statusRevise',{
            patiendID: row.patientID,
            living_status: this.radio
          })
            .then(resp => {
              if (resp.status === 200 ){
                this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success'
                });
                row.living_status = this.radio;
              }
              else {
                this.$message.error('修改失败')
              }
            })
            .catch(error => {
              console.log(err);
              this.$message.error('修改失败')
            })
        },
        select(){
          this.$axios.post('/select',{
            area_type: this.area,
            leave: this.leave,
            trans: this.trans,
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
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>
