<template>
  <el-container>
    <el-header>HeadNurse</el-header>
    <el-main>
      <el-container style="height: 500px; border: 1px solid #eee">
        <el-aside width="200px">
          <p>当前治疗区域：area</p>
          <el-card class="box-card" style="width: 100%;">
            <div slot="header" class="clearfix">
              <span>病房护士 <button @click="addNurse_dialogVisible=true">增加病房护士</button></span>
              <el-dialog
                title="空闲的护士"
                :visible.sync="addNurse_dialogVisible"
                width="30%">
                <span>请从下列的空闲护士中选择你要增加到该治疗区域的病房护士</span>
                <el-radio-group v-model="addNurse_radio">
                  <el-radio v-for="nurse in nullWardNurse" :key="'addnurse'+nurse" :label="nurse">{{nurse}}</el-radio>
                </el-radio-group>
                <span slot="footer" class="dialog-footer">
    <el-button @click="addNurse_dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addNurse_dialogVisible = false;addNurse()">确 定</el-button>
  </span>
              </el-dialog>
            </div>
            <div v-for="nurse in wardNurse_tableData" :key="nurse.name" class="text item">
              {{nurse.name+': ' }}
              <span v-for="patient in nurse.patients" :key="'nurse'+patient">{{patient+' '}}</span>
              <button @click="deleteNurse(nurse)">删除该护士</button>
            </div>
          </el-card>
        </el-aside>
        <el-main>
          <el-container>
            <el-aside>
              <el-card class="box-card" style="width: 100%;">
                <div slot="header" class="clearfix">
                  <span>病床信息</span>
                </div>
                <el-table
                  :data="bed_patient_tableData"
                  style="width: 100%">
                  <el-table-column
                    prop="bedID"
                    label="病床号">
                  </el-table-column>
                  <el-table-column
                    prop="patientName"
                    label="对应病人，若空闲则为'无'">
                  </el-table-column>
                </el-table>
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
              <el-table :data="patient_tableData" height="300">
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
              </el-table>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
    export default {
      name: "HeadNurse",
      created: function (){
        this.$axios.post('/headNurse',{
          username: this.$store.state.userDetails.username
        })
          .then(resp => {
            if(resp.status === 200){
              this.area = resp.data.area;
              this.wardNurse_tableData = resp.data.wardNurse_tableData;
              this.bed_patient_tableData = resp.data.bed_patient_tableData;
              this.patient_tableData = resp.data.patient_tableData;
              this.nullWardNurse = resp.data.nullWardNurse;
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
          wardNurse_tableData:[{name:'111', patients:['aaa','bbb','ccc']},{name:'121', patients:['aaa','bbb','ccc']},{name:'131', patients:['aaa','bbb','ccc']}],
          bed_patient_tableData: [{bedID: 1, patientName: '张三'},{bedID: 2, patientName: '王小虎'},{bedID: 3, patientName: '无'}],
          patient_tableData: Array(20).fill(item),
          addNurse_dialogVisible: false,
          addNurse_radio: null,
          radio: 0,
          leave: 2,
          trans: 2,
          status: 3,
          nullWardNurse:['王五','karry','gamma','gtyry']
        }
      },
      methods:{
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
        },
        deleteNurse(nurse){
          alert('delete nurse'+nurse.name);
          this.$axios.post('/deleteNurse',{
            nurseName: nurse.name,
            area_type: this.area
          })
            .then(resp => {
              if(resp.status === 200){
                this.$message({
                  showClose: true,
                  message: '删除'+nurse.name+'护士成功',
                  type: 'success'
                });
                location.reload();
              }
            })
            .catch(err => {
              console.log(err);
              if(error.response.status === 400){
                this.$message.error('没有其他空闲的护士，不能删除');
              }
              else{
                this.$message.error('删除失败');
              }
            })
        },
        addNurse(){
          alert('add '+this.addNurse_radio);
          if(this.addNurse_radio==null){
            this.$message({
              showClose: true,
              message: '请先选择一个护士',
              type: 'info'
            });
            return;
          }
          this.$axios.post('/addNurse',{
            nurseName: this.addNurse_radio,
            area_type: this.area
          })
            .then(resp => {
              if(resp.status === 200){
                this.$message({
                  showClose: true,
                  message: '添加'+this.addNurse_radio+'护士成功',
                  type: 'success'
                });
                location.reload();
              }
            })
            .catch(err => {
              console.log(err);
              this.$message.error('添加失败');
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
</style>
