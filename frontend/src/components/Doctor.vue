<template>
  <el-container>
    <el-header>Doctor</el-header>
    <el-main>
      当前治疗区域：1
      医生的界面
      每个治疗区域有一个主治医生，可以管理护士长、护士和病人的
      信息。主治医生可以查看当前治疗区域的病人信息并支持不同条件的筛选（例如
      根据是否满足出院条件、是否待转入其他治疗区域、病人生命状态等）；可以查
      看当前治疗区域的护士长及病房护士信息，以及病房护士负责的病人；可以修改
      病人的病情评级；可以修改病人的生命状态；可以为病人进行核酸检测（添加新
      的检测单）；轻症治疗区域的主治医生可以根据病人情况决定病人是否可以康复
      出院。
      <el-container style="height: 500px; border: 1px solid #eee">
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
          <el-menu :default-openeds="['1', '3']">
            <el-submenu index="1">
              <template slot="title"><i class="el-icon-message"></i>导航一</template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <template slot="title">选项4</template>
                <el-menu-item index="1-4-1">选项4-1</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title"><i class="el-icon-menu"></i>导航二</template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="2-1">选项1</el-menu-item>
                <el-menu-item index="2-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="2-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="2-4">
                <template slot="title">选项4</template>
                <el-menu-item index="2-4-1">选项4-1</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title"><i class="el-icon-setting"></i>导航三</template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="3-1">选项1</el-menu-item>
                <el-menu-item index="3-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="3-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="3-4">
                <template slot="title">选项4</template>
                <el-menu-item index="3-4-1">选项4-1</el-menu-item>
              </el-submenu>
            </el-submenu>
          </el-menu>
        </el-aside>

        <el-container>
          <el-header style="text-align: right; font-size: 12px">
            <el-dropdown>
              <i class="el-icon-setting" style="margin-right: 15px"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>查看</el-dropdown-item>
                <el-dropdown-item>新增</el-dropdown-item>
                <el-dropdown-item>删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span>王小虎</span>
          </el-header>

          <el-main>
            <el-table :data="tableData">
              <el-table-column prop="patientID" label="病人ID">
              </el-table-column>
              <el-table-column prop="username" label="姓名">
              </el-table-column>
              <el-table-column prop="condition_rating" label="病情评级|0：轻症 1： 重症 2：危重症">
              </el-table-column>
              <el-table-column prop="living_status" label="生命状态|0：住院 1：出院 2：死亡">
              </el-table-column>
              <el-table-column prop="test_sheet" label="核酸检测单">
                <template slot-scope="scope">
                  <router-link :to="{ path: 'test_sheet', query: { id: scope.row.patientID }}">核酸检测单</router-link>
                </template>
              </el-table-column>
              <el-table-column prop="state_record" label="状态记录表">
                <template slot-scope="scope">
                  <router-link :to="{ path: 'state_record', query: { id: scope.row.patientID }}">状态记录表</router-link>
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
                    <el-radio v-model="radio" label="0">0：住院 </el-radio>
                    <el-radio v-model="radio" label="1">1：出院 </el-radio>
                    <el-radio v-model="radio" label="2">2：死亡 </el-radio>
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
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
    export default {
      name: "Doctor",
      data() {
        const item = {
          patientID:1,
          username: '王小虎',
          condition_rating: 0,
          living_status:0,
        };
        return {
          tableData: Array(20).fill(item),
          ratingRevise_dialogVisible: false,
          statusRevise_dialogVisible: false,
          radio: 0
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
                this.$message.error('修改失败')
              }
            })
            .catch(error => {
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
              this.$message.error('修改失败')
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
    line-height: 160px;
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
