<template>
  <div class="wrapper">
    <nav-header></nav-header>
    <nav-breader1>
      <p slot="title">我的订单</p>
    </nav-breader1>
     <el-container>
      <el-header>
        <step :active="4"></step>
      </el-header>
      <el-main>
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="24">
            <div class="img">
              <img src="/static/mallimg/success.png" alt="" srcset="">
            </div>
            <p class="finish">您的订单编号:{{orderId}}已经支付完成!</p>
            <p class="finish"><span class="seconds">{{second}}</span>秒后自动跳回<router-link to='/'>首页</router-link></p>
          </el-col>
        </el-row>
      </el-main>
     </el-container>    
  </div>
</template>

<script>
import NavHeader from './../components/NavHeader'
import NavBreader1 from './../components/NavBreader1'
import Step from './../components/Step'
export default {
  name:'OrderSuccess',
  components:{
    NavHeader,
    NavBreader1,
    Step,
  },
  props:{},
  data(){
    return {
      timeId:null,
      second:8,
      orderId:''
    }
  },
  watch:{},
  computed:{},
  methods:{
    autoSkip(){
      this.timeId=setInterval(() => {
        if(this.second>0){
          this.second--;
        }else{
          clearInterval(this.timeId);
          this.$router.push('/');
        }
      }, 1000);
    },
  
  },
  created(){},
  mounted(){
    this.orderId = this.$route.query.orderId;
    this.autoSkip();
  }
}
</script>
<style lang="stylus" scoped>
.wrapper{
  .el-container{
    background-color :#fff
    .el-main{
      .el-col{
        text-align :center;
        .img{
          margin-bottom:30px;
        }
        p{
          font-size:24px;
          height 50px
          line-height 50px
          
        }
        .seconds{
          color:#f00;
          margin-right:5px;
        }
      }
    }
    
  }
}
</style>