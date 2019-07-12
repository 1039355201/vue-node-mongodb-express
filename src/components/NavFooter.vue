<template>
  <div class="wrapper">
     <footer class="footer">
           <span class="footer-left">
                <span>Region</span>
                <select class="footer__region__select">
                <option value="en-US">USA</option>
                <option value="zh-CN">China</option>
                </select> 
           </span>
           <span class="footer-right">     
                <span>Copyright © 2019 QingKong Design.</span>
                <a href="#">
                About Us
                </a>
                <a href="#">
                Terms &amp; Conditions
                </a>
                <a href="#">
                Privacy Policy
                </a>
           </span>
  </footer>
   
  </div>
</template>

<script>
export default {
  name:'NavFooter',
  components:{},
  props:{},
  data(){
    return {
      value:'',
      options: [{
          value: '选项1',
          label: 'China'
        }, {
          value: '选项2',
          label: 'USA'
        }],
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
  .row-bg{
    overflow:hidden 
    background-color:#ccc;
    height 80px
    line-height 80px
    font-size:18px;
    color:#666
    .region{
      
      .select{
        width 110px
      }
    }
    a{
      color:#666
    }
  }
}
.footer{
    width: 100%;
    height: 80px;
    background: #ccc;
    color: #ada9a5;
    position:absolute;
    left : 0;
    right:0;
    bottom : 0;
}
.footer-left{
    position: absolute;
    top:40%;
}
.footer-right{
    position: absolute;
    bottom:10%;
    top:40%;
    right:5%;
    a{
       color: #ada9a5;
    }
}
</style>