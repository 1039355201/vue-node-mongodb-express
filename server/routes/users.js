var express = require('express');
var router = express.Router();
require('./../util/dateformat.js')
// 加载表的模型
var Goods = require('./../models/goods')
var User = require('./../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
/* 登录. */
router.post('/login', function(req, res, next) {
  /**{
        userName:this.userName,
        userPwd:this.userPwd,
      } */
  var param=req.body;    
  var userName = param.userName;
  var userPwd = param.userPwd;
  User.findOne({userName:userName},function(err,data){
    if(err){
      res.status(504).json({
        code:1,
        msg:err.message
      })
    } else if (!data){
        res.status(200).json({
          code: 2,
          msg: '用户不存在'
        })  
    }else{
      if (data.userPwd == userPwd) {
         res.cookie('userName', data.userName, {
           path: '/',
           maxAge: 1000 * 60 * 60
         });
         res.cookie('userId', data.userId, {
           path: '/',
           maxAge: 1000 * 60 * 60
         });

         res.status(200).json({
           code: 0,
           msg: '密码输入正确'
         })
      }else{
        res.status(200).json({
          code: 1,
          msg: '密码输入错误'
        })
      } 
    }
  })
  // res.send('respond with a resource');
});
// 退出登录
router.get('/loginout',function(req,res,next){
  res.cookie('userId','',{
    path:'/',
    maxAge:-1
  })
  res.cookie('userName', '', {
    path:'/',
    maxAge:-1
  })
  res.status(200).json({
    code:0,
    msg:'退出登录成功!'
  })  
})
//验证用户是否登录
router.get('/checkLogin', function (req, res, next) {
  if(req.cookies.userId){
    res.status(200).json({
      code: 0,
      msg: '当前已登录!',
      result:req.cookies.userName
    })
  }else{
    res.status(200).json({
      code: 1,
      msg: '当前未登录'
    })
  }
  
})


// 根据用户拿到购物车的数量
router.get('/cartList', function (req, res, next) {
  var userId=req.cookies.userId;
  User.findOne({userId:userId},function(err,userInfo){
    if(err){
      res.status(500).json({
        code: 1,
        msg: 'server is error!'
      })
    }else{
      res.status(200).json({
        code: 0,
        msg: 'success',
        result: userInfo
      })
      
    }
  })
})
// 修改用户购物车数量
router.post('/editCart', function (req, res, next) {
  var userId=req.cookies.userId;
  var productId = req.body.productId;
  var checked = req.body.checked;
  var productNum = req.body.productNum;
  User.update({
        'userId': userId,
        'cartList.productId': productId
      }, {
        "cartList.$.productNum": productNum,
        "cartList.$.checked": checked
      },
      function (err, data) {
    if(err){
      res.status(500).json({
        code: 1,
        msg: 'server is error!'
      })
    }else{
      res.status(200).json({
        code: 0,
        msg: 'success',
        result: ''
      })
      
    }
  })
})
//删除购物车的某件商品
router.post('/cartDel', function (req, res, next) {
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  // console.log(productId);$pull是删除的意思 根据条件对子文档进行删除
  User.update({
    userId: userId
  }, {
    $pull: {
      'cartList': {
        productId: productId
      }
    }
  }, function (err, data) {
    if (err) {
      res.status(500).json({
        code: 1,
        msg: err.message,
        result: ''
      })
    } else {
      res.status(200).json({
        code: 0,
        msg: 'success',
        result: ''
      })
    }
  })
})
// 检查是否全选
router.post('/editCheckAll',function(req,res,next){
  var checkAllFlag = req.body.checkAll?'1':'-1';
  var userId=req.cookies.userId;
  User.findOne({userId: userId}, function (err, userInfo) {
    if (err) {
      res.status(500).json({
        code: 1,
        msg: 'server is error!'
      })
    } else {
      userInfo.cartList.forEach((item)=>{
        item.checked = checkAllFlag
      })
      userInfo.save((err, data) => {
        if (err) {
          res.status(500).json({
            code: 1,
            msg: err.message
          })
        } else {
          res.status(200).json({
            code: 0,
            msg: 'success'
          })
        }
      })
     
    }
  })
 
})
// 根据用户拿到他的收货地址
router.get('/addressList', function (req, res, next) {
  var userId=req.cookies.userId;
  User.findOne({userId:userId},function(err,userInfo){
    if(err){
      res.status(500).json({
        code: 1,
        msg: 'server is error!'
      })
    }else{
      res.status(200).json({
        code: 0,
        msg: 'success',
        result: userInfo.addressList
      })
      
    }
  })
})
// 根据用户id删除他的收货地址
router.post('/addressDel', function (req, res, next) {
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  // console.log(productId);$pull是删除的意思 根据条件对子文档进行删除
  User.update({
    userId: userId
  }, {
    $pull: {
      'addressList': {
        addressId: addressId
      }
    }
  }, function (err, data) {
    if (err) {
      res.status(500).json({
        code: 1,
        msg: err.message,
        result: ''
      })
    } else {
      res.status(200).json({
        code: 0,
        msg: 'success',
        result: ''
      })
    }
  })
})
// 根据用户id设置他的默认收货地址
router.post('/setDefalutAddress', function (req, res, next) {
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  // console.log(productId);$pull是删除的意思 根据条件对子文档进行删除
  User.findOne({
    userId: userId
  }, function (err, userInfo) {
    if (err) {
      res.status(500).json({
        code: 1,
        msg: err.message,
        result: ''
      })
    } else {
      userInfo.addressList.forEach((item)=>{
        if (item.addressId == addressId){
          item.isDefault=true;
        } else {
          item.isDefault = false;
        }
      })
      userInfo.save(function (err, data) {
        if (err) {
          res.status(500).json({
            code: 1,
            msg: '设置默认保存失败',
            result: ''
          })
        } else {
          res.status(200).json({
            code: 0,
            msg: '设置默认成功',
            result: ''
          })
        }
      })
    }
  })
})
// 根据用户id设置添加他的收货地址
router.post('/addAddress', function (req, res, next) {
  var userId = req.cookies.userId;
  var addressInfo={};

  addressInfo.addressId = req.body.addressId;
  addressInfo.userName = req.body.userName;
  addressInfo.streetName = req.body.streetName;
  addressInfo.postCode = req.body.postCode;
  addressInfo.tel = req.body.tel;
  addressInfo.isDefault = req.body.isDefault;

  User.findOne({
    userId: userId
  }, function (err, userInfo) {
    if (err) {
      res.status(500).json({
        code: 1,
        msg: err.message,
        result: ''
      })
    } else {
      userInfo.addressList.unshift(addressInfo);
      userInfo.save(function(err,data){
        if(err){
          res.status(500).json({
            code: 1,
            msg: '地址添加失败',
            result: ''
          })
        }else{
          res.status(200).json({
            code: 0,
            msg: '地址添加成功',
            result: ''
          })
        }
      })
    }
  })
})
// 添加订单
router.post('/payment', function (req, res, next) {
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  var totalPrice = req.body.totalPrice;

  User.findOne({
    userId: userId
  }, function (err, userInfo) {
    if (err) {
      res.status(500).json({
        code: 1,
        msg: err.message,
        result: ''
      })
    } else {
      var addressInfo = {};//找到下单地址
      var goodsList = []; //找到下单的商品
      userInfo.addressList.forEach((item)=>{
        if (item.addressId == addressId){
          addressInfo=item;
        }
      })
      userInfo.cartList.forEach((item) => {
        if (item.checked == 1) {
          goodsList.push(item);
        }
      });
      var orderId = '';
      var r1 = Math.floor(Math.random() * 9) + 1;
      var r2 = Math.floor(Math.random() * 9) + 1;
      var time = new Date().Format('yyyyMMddhhmmss');
      orderId = '322' + r1 + time + r2;
      //console.log(orderId);
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');

      var order = {
        orderId: orderId,
        orderTotal: totalPrice,
        addressInfo: addressInfo,
        goodsList: goodsList,
        orderStatus: "1",
        createDate: createDate
      }
      //console.log(order);
      userInfo.orderList.unshift(order);
      userInfo.save(function (err, data) {
        if (err) {
          res.status(500).json({
            code: 1,
            msg: '订单添加失败',
            result: ''
          })
        } else {
          res.status(200).json({
            code: 0,
            msg: '订单添加成功',
            result: orderId
          })
        }
      })
    }
  })
})
//根据orderId查找该用户历史订单 并将购买总价返回
router.get('/orderPay', function(req,res,next){
  var userId=req.cookies.userId;
  var orderId = req.query.orderId;
  var totalPrice;
  User.findOne({
        userId: userId
      }, function (err, userInfo) {
    if(err){
      res.status(500).json({
        code:1,
        msg:''
      })
    }else{
      userInfo.orderList.forEach((item)=>{
        if (item.orderId == orderId) {
          totalPrice=item.orderTotal;
        }
      })
      res.status(200).json({
        code: 0,
        msg: '',
        result: totalPrice
      })
    }
  })
})
//用户注册
/**email:this.email,
           userName:this.userName,
           userPwd:this.password */
router.post('/register',function(req,res,next){
  let email = req.body.email
  let userName = req.body.userName
  let userPwd = req.body.userPwd
  let userId='';
  var r1 = Math.floor(Math.random() * 9) + 1;
  var r2 = Math.floor(Math.random() * 9) + 1;
  var time = new Date().Format('yyyyMMddhhmmss');
  userId = '322' + r1 + time + r2;
  User.findOne({
    $or: [{
        email: email
      },
      {
        userName: userName
      }
    ]},function(err,data){
      if(err){
        res.status(500).json({
          code:1,
          msg:err.message
        })
      }else{
        if(data&&data.email==email){
          res.status(200).json({
            code: 2,
            msg: '邮箱已被注册!'
          })
        }
        if (data && data.userName == userName) {
          res.status(200).json({
            code: 3,
            msg: '用户名已存在!'
          })
        }
        new User({
          email: email,
          userName: userName,
          userPwd: userPwd,
          userId: userId
        }).save(function(err,data){
          if (err) {
            res.status(500).json({
              code: 1,
              msg: err.message
            })
          } else {
            res.status(200).json({
              code: 0,
              msg: '注册成功'
            })
          }
        })
      }
    })
})

module.exports = router;
