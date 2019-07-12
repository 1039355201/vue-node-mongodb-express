<template>
  <div class="wrapper">
    <el-steps :active="active" finish-status="success">
      <el-step title="确认收货地址"></el-step>
      <el-step title="确认订单"></el-step>
      <el-step title="支付订单"></el-step>
      <el-step title="支付完成"></el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  name:'Step',
  components:{},
  props:{
    active:{
      type:Number,
      default:1,
    }
  },
  data(){
    return {
    }
  },
  
  methods:{},
  created(){},
  mounted(){}
}
</script>
<style lang="stylus" scoped>
.wrapper{
  margin-top:25px;
}
</style>