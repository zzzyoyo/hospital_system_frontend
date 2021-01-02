<template>
  <el-container style="height: 500px; border: 1px solid #eee">
    <el-header></el-header>
    <el-main>
      病人{{patientName}}的核酸检测单
      <el-table
        :data="sheetTable"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="result"
          label="结果"
          width="180">
        </el-table-column>
        <el-table-column
          prop="conditianal_rating"
          label="病情评级|0：轻症 1： 重症 2：危重">
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
    export default {
      name: "nucleicAcidTestSheet",
      created: function(){
        this.$axios.post('/nucleicAcidTestSheet',{
          patientID: this.patientID
        })
          .then(resp => {
            if(resp.status === 200){
              this.sheetTable = resp.data.sheetTable;
            }
          })
          .catch(err => {
            console.log(err);
            this.$message.error('页面信息加载失败')
          })
      },
      data(){
        return{
          patientID: this.$route.query.id,
          patientName: this.$route.query.name,
          sheetTable:[{date:'2021年1月2日15:19:08', result:'阴性', conditianal_rating:0},{date:'2021年1月2日15:19:08', result:'阳性', conditianal_rating:0}]
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
