<template>
  <div class="wrapper">
    <nav-header></nav-header>
    
    <el-container>
      <el-header>
        <router-link to="/"><i class="iconfont icon-index-copy"></i></router-link>
        我的购物车</el-header>
      <el-main>
        <div class="cart-wrap">
          
          <el-row class="first-row">
            <el-col :span="8" ><div >商品信息</div></el-col>
            <el-col :span="4" ><div >单价</div></el-col>
            <el-col :span="4" ><div >数量</div></el-col>
            <el-col :span="4" ><div >金额</div></el-col>
            <el-col :span="4" ><div >操作</div></el-col>
          </el-row>
          
          <el-row class="order-row" v-for="(item,index) in cartList" :key="index">
            <el-col :span="8" class="one-column-content">
              <div class="icon-wrap" @click="editCart('checked',item)">
                <i class="el-icon-circle-check" v-bind:class="{'checked':item.checked=='1'}"></i>
              </div>
              <div class="pic-wrap">
                <img v-bind:src="'./../../static/image/' + item.productImage" alt="" srcset="">
              </div>
              <p class="productName">
                {{item.productName}}
              </p>
            </el-col>
            <el-col :span="4">
              <div class="perPrice">{{item.salePrice | currency('￥')}}</div>
            </el-col>
            <el-col :span="4">
              <div class="el-input-number">
                <span role="button" class="el-input-number__decrease el-input-handle"  @click="editCart('decrease',item)" >
                    <i class="el-icon-minus"></i>
                </span>
                <div class="el-input">
                    <span class="el-input-inner">{{item.productNum}}</span>
                </div>
                <span role="button" class="el-input-number__increase el-input-handle" @click="editCart('increase',item)">
                    <i class="el-icon-plus"></i>
                </span>
              </div>
            </el-col>
            <el-col :span="4"><div class="subtotal-price" >{{item.productNum*item.salePrice | currency('￥')}}</div></el-col>
            <el-col :span="4">
              <div @click="confirm(item)">
                <i class=" el-icon-delete"></i>
              </div>
            </el-col>
          </el-row>

          <el-row class="last-row">
            <el-col :span="8"  >
              <div >
                <div class="icon-wrap" >
                  <i class="el-icon-circle-check" v-bind:class="{'checkAllFlag':checkAllFlag==true}" @click="toggleCheckAll()"></i>
                  <span class="selectAll" @click="toggleCheckAll()">全选</span>
                </div>
              </div>
            </el-col>
            <el-col :span="4" :offset="8"><div >总计:<span class="sum">{{totalPrice | currency('￥')}}</span></div></el-col>
            <el-col :span="3" :offset="1" >
              <div class="countSumBtn" v-bind:class="{'discheckout':checkCount == 0}"
              @click="checkOut"
              >结算</div>
            </el-col>
          </el-row>
         
        </div>
      </el-main>
    </el-container>
    <!-- <nav-footer></nav-footer> -->
    <!-- 是否确认删除 弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>您是否要删除该条商品?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delCart">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import NavHeader from './../components/NavHeader'
import NavFooter from './../components/NavFooter'
import {currency} from '@/util/currency.js'
import { mapMutations } from 'vuex'
export default {
  name:'Cart',
  components:{
    NavHeader,
    NavFooter,
  },
  props:{},
  data(){
    return {
      cartList:[],
      dialogVisible:false,
      goods:{},
      
    }
  },
  watch:{},
  computed:{
    // 判断是否全选
    checkAllFlag(){
      return this.checkCount==this.cartList.length
    },
    // 计算全选的商品数目
    checkCount(){
      var count=0;
      this.cartList.forEach((item)=>{
        if(item.checked=='1'){
          count ++;
        }
      })
      return count
    },
    // 计算总价
    totalPrice(){
      var sum=0
      this.cartList.forEach((item)=>{
        if(item.checked=='1'){
          sum += item.productNum*item.salePrice;
        }
      })
      return sum
    }
  },
  filters:{
    currency:currency
  },
  methods:{
    ...mapMutations({getCartNum:'cartNum'}),
    getCartList(){

      this.axios.get('/users/cartList').then((res) => {
        res = res.data;
        if(res.code === 0){
          this.cartList=res.result.cartList
          // console.log(this.cartList);  
        }
      })
    },
    // 修改购物车商品属性(选中、增加、减一)
    editCart(flag,goods){
      switch (flag) {
        case 'decrease':
          if(goods.productNum<=1){
            return
          }//商品数量少于或等于1的时候不准再减
          goods.productNum--;
          this.getCartNum(-1);
          break;
        case 'increase':
          goods.productNum++;
          this.getCartNum(1);
          break;
        case 'checked':
          goods.checked=goods.checked=='1'?'-1':'1'
          break;
      
        default:
          break;
      }
      this.axios.post('users/editCart',
      {productId:goods.productId,
      checked:goods.checked,
      productNum:goods.productNum}).then((res)=>{
        res = res.data;
        if(res.code === 0){
          this.getCartList()
        }else{
          alert('服务器繁忙,请稍后重试！')
        }
      })     
    },
    // 是否确认删除
    confirm(item){
      this.dialogVisible=true;
      this.goods=item;
    },
    delCart(){
      this.dialogVisible = false;
      var productId=this.goods.productId;
      this.axios.post('users/cartDel',{productId:productId}).then((res)=>{
        res = res.data;
        if(res.code === 0){
          this.getCartList();
          var number = -this.goods.productNum;
          this.getCartNum(number);
        }else{
          alert('服务器繁忙,请稍后重试！')
        }
      })
    },
   
    //选中全部商品 
    toggleCheckAll(){
      var flag = !this.checkAllFlag;
      // console.log(flag);
      
      this.cartList.forEach((item, index) => {
          item.checked = flag  ? '1':'-1'
      })
      this.axios.post('/users/editCheckAll',{
          checkAll:flag
      }).then((result) => {
          let res = result.data;
          if(res.code == 0){
              console.log('update suc')
          }
      })
    },
    // 结算进入下一步
    checkOut(){
      if(this.checkCount>0){
        this.$router.push('/address')
      }
    }


  },
  created(){},
  mounted(){
    this.$nextTick(()=>{
      this.getCartList();
    })
    
  }
}
</script>
<style lang="stylus" scoped>
.wrapper{
  .el-container{
    background-color: #E9EEF3;
    .el-header{
      height:70px;
      line-height:70px;
      padding-left:30px;
      padding-top:5px;
      font-size:28px;
      letter-spacing :5px;
      background-color :#ff6666;
      color:#6f6266;
      i{
        font-size:28px;
        color:#f0f0f0
      }
    }
    .el-main { 
      color: #606266;
      text-align: center;     
    }
  } 
    .cart-wrap{
      .first-row ,.last-row{
        background: #6a7584;
        font-size: 16px;
        color: white;
        letter-spacing: 5px;
        height: 50px;
        line-height: 50px;
      }
      .last-row{
        letter-spacing: 0;
        font-size:20px;
        height: 80px;
        line-height: 80px;
        .icon-wrap{
          text-align :left;
          padding-left:20px;
          i{
            font-size: 25px;
            margin-right:20px;
            &:hover{
                color: #ee7a23;
            }
          }
          .checkAllFlag{
            color: #ee7a23;
          }
          .selectAll{
            &:hover{
              color: #ee7a23;
            }
          } 
        }
        .sum{
          color:#CB1313;
          margin-left:10px;
        }
        .countSumBtn{
          background-color :#CB1313
          cursor pointer
        }
        .discheckout{
          background-color :#8A8181
        }
      }
      .order-row{
         background:#fff;
         font-size: 24px; 
         line-height 100px;
         border-bottom :1px solid #eee;
        .one-column-content{
          display:flex;
          justify-content :space-between;
          .icon-wrap{
            height 100px   
            padding-left:10px;
              i{
                  font-size: 25px;
                      &:hover{
                      color: #ee7a23;
                  }
              }
              .checked{
                color:#ee7a23
              }
          }
          .pic-wrap{
                  flex:1
                  height: 100px;
                  img{
                      height: 100%;
                      width: 40%;
                  }
          }
         
          .productName{
            padding-right:10px;
            font-weight :bold;
          }
        }
        .perPrice{
          color:#606266
        }
        .el-input-number{
          position: relative;
          display: inline-block;
          width: 180px;
          line-height: 38px;
          border: 1px solid #ccc;
           .el-input{
             border: 1px solid #ccc;
           }
            
           .el-input-handle{
             transition: all .3s linear;
             &:hover{
               background-color: #bde6ff;
             }
           }
         }
         .el-icon-delete{
           font-size: 25px;
           &:hover{
               color: #ee0023;
               transform :scale(1.5);
               transition:transform .3s linear
           }
         }
         .subtotal-price{
           color:#CB1313
         }
  
    }
    }
    

  
}
</style>