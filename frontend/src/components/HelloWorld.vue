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
