<template>
  <div class="wrapper">
    <div class="parent">
      <router-link to="/"><i class="iconfont icon-index-copy"></i></router-link>
       
      <slot name="title" class="title"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name:'NavBreader1',
  components:{},
  props:{},
  data(){
    return {
    }
  },
  watch:{},
  computed:{},
  methods:{},
  created(){},
  mounted(){}
}
</script>
<style lang="stylus" scoped>
.wrapper{
  .parent{
    position:relative
    height:70px;
    line-height:70px;
    padding-left:60px;
    padding-top:5px;
    font-size:28px;
    letter-spacing :5px;
    background-color :#ff6666;
    color:#6f6266;
    i{
        font-size:28px;
        color:#f0f0f0;
        position:absolute
        left:20px;
        top:5px;
    }
    
  }
}
</style>