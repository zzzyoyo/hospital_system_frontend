<template>
  <div id="navigation">
    <!--/top-nav -->
    <div class="top_w3pvt_main container">
      <!--/header -->
      <header class="nav_w3pvt text-center ">
        <!-- nav -->
        <nav class="wthree-w3ls">
          <div id="logo">

            <h1> <a class="navbar-brand px-0 mx-0" href="index.html">首页</a></h1>

          </div>

          <label for="drop" class="toggle">导航</label>
          <input type="checkbox" id="drop" />
          <ul class="menu mr-auto">
            <li class="active"><router-link to="personal" style='text-transform:none'>{{ msg }}</router-link></li>
            <li>
              <!-- First Tier Drop Down -->
              <label for="drop-2" class="toggle toggle-2"> <span class="fa fa-angle-down" aria-hidden="true"></span> </label>
              <a href="#">操作指南 </a>
              <input type="checkbox" id="drop-2" />
              <ul>

                <li><a href="" class="drop-text">如何投稿</a></li>
                <li><a href="" class="drop-text">如何开办会议</a></li>
                <li><a href="" class="drop-text">账号丢失</a></li>
                <li><a href="" class="drop-text">人工服务</a></li>
              </ul>
            </li>
            <li><a href="">关于我们</a></li>
            <li class="social-icons ml-lg-3"><router-link v-bind:to='path' @click.native='logout' v-if='out' >登出</router-link><router-link to='login' v-else>登录</router-link></li>
            

          </ul>
        </nav>
        <!-- //nav -->
      </header>
      <!--//header -->
    </div>
    <!-- //top-nav -->
  </div>
</template>


<script>
export default {
  name: 'Navigation',
  computed:{
      msg(){
        return this.$store.state.userDetails?this.$store.state.userDetails.username:"个人空间"
      },
      out(){//whether logout or not
        return this.$store.state.userDetails
      },
      path(){
        return this.$route.path
      }
    
  },
  methods:{
    logout(){
      this.$confirm('您确定要退出登录吗？', '确认登出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.$store.commit('logout')
           this.$router.replace({path:'/'})
          this.$message({
            type: 'success',
            message: '登出成功'
          }); 
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '登出取消'
          });          
        });
     
    }
  }

}
</script>
