<script>
export default {
  name: 'HelloWorld'
}
</script>

<template>
  <div class="helloWorld">
    <!-- home -->
  <div id="home">
    <!-- banner slider -->
    <div id="homepage-slider" class="st-slider">
      <input type="radio" class="cs_anchor radio" name="slider" id="play1" checked="" />
      <input type="radio" class="cs_anchor radio" name="slider" id="slide1" />
      <input type="radio" class="cs_anchor radio" name="slider" id="slide2" />
      <input type="radio" class="cs_anchor radio" name="slider" id="slide3" />
      <div class="images">
        <div class="images-inner">
          <div class="image-slide">
            <div class="banner-w3pvt-1">
              <div class="overlay-w3ls">

              </div>

            </div>
          </div>
          <div class="image-slide">
            <div class="banner-w3pvt-2">
              <div class="overlay-w3ls">

              </div>
            </div>
          </div>
          <div class="image-slide">
            <div class="banner-w3pvt-3">
              <div class="overlay-w3ls">

              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="labels">
        <div class="fake-radio">
          <label for="slide1" class="radio-btn"></label>
          <label for="slide2" class="radio-btn"></label>
          <label for="slide3" class="radio-btn"></label>
        </div>
      </div>
      <!-- banner-hny-info -->
      
      <div class="banner-hny-info">
        <h3>让世界看见你的观点</h3>
        <div class="top-buttons mx-auto text-center mt-md-5 mt-3">
          <router-link to="contribute" class="btn more mr-2">投稿</router-link>
          <router-link to = "contact" class="btn">申请会议</router-link>
        </div>
      <div class="d-flex banner" style="margin:3em 0 2em 2em">
          <div class="col-md-4">
            <div class="d-md-flex justify-content-center">
              <h5 class="counter">13228029</h5>
              <p class="para-w3pvt">篇文章</p>
            </div>
          </div>
            <div class="col-md-4">
            <div class="d-md-flex justify-content-center">
              <h5 class="counter">3504</h5>
              <p class="para-w3pvt">场会议</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="d-md-flex justify-content-center">
              <h5 class="counter">10663276</h5>
              <p class="para-w3pvt">位会员</p>
            </div>
          </div>
        </div>

      </div>
      <!-- //banner-hny-info -->
    </div>
    <!-- //banner slider -->
  </div>
  </div>
</template>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
li {
  display: inline-block;
  margin: 0 10px;
}
</style>
