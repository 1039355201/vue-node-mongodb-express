<template>
  <div class="wrapper">
    <div class="img-wrapper" >
        <img src="@/assets/homeHeader.jpg" alt="" srcset="" v-bind:class="{'rotate':flag==true}">
    </div>
    <div class="from">
      
      <p class="title">用户注册</p>
      <form class="from-content">
        <div class="form-group">
          <label for="exampleInputEmail1">邮箱</label>
          <input type="text" class="form-control input_text" id="exampleInputEmail1" placeholder="Email" autofocus v-model="email">
        </div>
        <div class="form-group">
          <label for="exampleInputUserName">用户名</label>
          <input type="text" class="form-control input_text" id="exampleInputUserName" placeholder="UserName"  v-model="userName">
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">密码</label>
          <input type="password" class="form-control input_text" id="exampleInputPassword1" placeholder="Password" v-model="userPwd">
        </div>
        <div class="form-group">
          <label for="exampleInputRePassword1">确认密码</label>
          <input type="password" class="form-control input_text" id="exampleInputRePassword1" placeholder="confirmPwd" v-model="confirmPwd">
        </div>
       
        <div >
          <label class="tip">{{tip}}</label>
        </div>
        <button type="submit" ref="btn" class="btn btn-success btn-block" @click="register" >注册</button>
      </form>

      <p class="register">已有账号?<router-link to="/login">点击登录</router-link></p>
    </div>
  </div>
</template>

<script>
export default {
  name:'Register',
  components:{},
  props:{},
  data(){
    return {
      email:'',
      tip:'请输入注册账号和密码!',
      userName:'',
      userPwd:'',
      confirmPwd:'',
      flag:false,
    }
  },
  watch:{},
  computed:{},
  methods:{
    register(){
      if(this.email==''){
        this.tip='邮箱不能为空!'
        return 
      }else if(this.userName==''){
        this.tip='用户名不能为空!'
        return
      }else{
        if(this.userPwd==''){
          this.tip='密码不能为空!'  
          return
        }else if(this.userPwd !==  this.confirmPwd){
          this.tip='两次密码不一致!'  
          return
        }
      }
      this.axios.post('users/register',{
         email: this.email,
         userName: this.userName,
         userPwd: this.userPwd,
      }).then((res)=>{
        res=res.data;
        if(res){
          switch (res.code) {
            case 2: this.tip='邮箱已被注册~';break;
            case 3: this.tip='用户名已存在~';break;
            case 0: alert('注册成功~'); this.$router.push('/login'); break;
          
            default: break;
          }
          
        }
        console.log(res);
        
      })
    }
  },
  created(){},
  mounted(){
    this.flag=true;
  }
}
</script>
<style lang="stylus" scoped>
.wrapper{
  position:relative;
  display:flex;
  justify-content :center;
  align-items :center;
  width:100vw;
  height 100vh;
  .img-wrapper{
      position:absolute;
      top:4%;
      // left:45%;
      margin:0 auto;
      height: 150px;
      width 150px;
      border-radius :50%;
      overflow:hidden;
      img{
        width:100%;
        &:hover{
          animation: img1 5s both 0.3s linear ;
          cursor pointer
        }
      }
       @keyframes img1 {
         0%{
           transform :rotate(0 deg)
         }
         50%{
           transform :rotate(180 deg)
   
         }
         100%{
           transform :rotate(360 deg)
         }
      } 
      
    }
  .rotate{
    animation: img 5s both 0.3s linear  ;
  }  
  @keyframes img {
      0%{
        transform :rotate(0 deg)
      }
      50%{
        transform : rotate(180 deg)
        // transform :scale(1.2)
      }
      100%{
        transform :rotate(360 deg)
      }
  }  
  .from{
    display:flex;
    flex-direction :column;
    justify-content :center;
    align-items :center;
    width 400px
    
    p.title{
      font-size:28px;
    }
    .from-content{
      width 350px
      border:1px solid #ccc;
      border-radius :5px;
      padding:20px;
      
      .input_text{
        display:inline-block;
        height 40px
        line-height 40px;
        font-size:18px;
      }
      button{
        color:#fff;
        font-size:18px;
        letter-spacing :5px;
      }
      .tip{
        color:red;
        letter-spacing :2px;
      }
    }
    p.register{
      margin-top:15px;
      font-size:18px;
      width 350px
      border:1px solid #ccc;
      border-radius :5px;
      padding:10px;
    }
    
  }
}
</style>