// 二级路由
var express=require('express');
var router=express.Router();

// 加载表的模型
var Goods=require('./../models/goods')
var User=require('./../models/user')


// 路由
router.get('/list',function(req,res,next){
  // console.log(req.query);
  
  var page = parseInt(req.query.page);
  var pageSize = parseInt(req.query.pageSize);
  var sort = parseInt(req.query.sort);
  var skip = page * pageSize;
  var priceChecked = req.query.priceChecked;
  var priceLow=0,priceHigh=8000;
 
  if (priceChecked!='all'){
    switch (true) {
      case priceChecked == '0':
        priceLow = 0; priceHigh = 100;
        break;
      case priceChecked == '1':
        priceLow = 100; priceHigh = 500;
        break;
      case priceChecked == '2':
        priceLow = 500; priceHigh = 1000;
        break;
      case priceChecked == '3':
        priceLow = 1000; priceHigh = 5000;
        break;
     
    }
  }
  var param = {
    salePrice: {
      $gt: priceLow,
      $lte: priceHigh
    }
  }
  Goods.find(param).skip(skip).limit(pageSize).sort({ 'salePrice': sort}).exec(function (err, data) {
    // console.log(data, param, priceLow, priceHigh)
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.status(200).json({
        ret:1,
        data:data
      })
    }
  })

 
  
  
})


// 加入购物车 
router.post('/addCart',function(req,res,next){
  // var userId = "196255774";
  var userId=req.cookies.userId;
  var productId=req.body.productId;
  User.findOne({userId:userId},function(err,userInfo){
    if(err){
      res.status(500).json({
        code:1,
        msg:err.message
      })
    }else{
      // console.log(userInfo);
      if (userInfo){
         Goods.findOne({productId:productId},function(err,goodInfo){ 
        if (err) {
          res.status(501).json({
            code: 1,
            msg: err.message
          })
        }else{
          //if (goodInfo) 证明超市有这件商品
          
            let goodItem=0;
            userInfo.cartList.forEach((item)=>{
              if(item.productId==productId){
                if (!item.productNum){
                  item.productNum=0
                }
                item.productNum++;
                goodItem = 1;
              }
            })
            // 是第二次加入
            if (goodItem==1) {
              userInfo.save(function(err,userSave){
                if (err) {
                  res.status(502).json({
                    code: 1,
                    msg: err.message
                  })
                } else{
                  res.status(200).json({
                    code: 0,
                    msg: '保存成功'
                  })
                }
              })
            }else{
               // 第一次加入
               goodInfo.productNum=1;
               goodInfo.checked='1';

               userInfo.cartList.push(goodInfo);

               userInfo.save(function (err, userSave) {
                 if (err) {
                   res.status(503).json({
                     status: '1',
                     msg: err.message
                   })
                 } else {
                   res.status(200).json({
                     status: '0',
                     msg: '保存成功'
                   })
                 }
               })
            
          }
        }
       
        
      })
    }
     
  }
  })
})
// 根据商品名搜索商品 
router.post('/searchGoods',function(req,res,next){
  var productName = req.body.productName;
  
  Goods.findOne({productName: productName},function(err,goodInfo){
    if(err){
      res.status(500).json({
        code:1,
        msg:err.message
      })
    }else{
    if (goodInfo){
      res.status(200).json({
        code: 0,
        msg: '',
        result: goodInfo
      })
    }else{
      res.status(200).json({
        code: 2,
        msg: '商品不存在',
       
      })
    }
     
     
  }
  })
})
// 查找所有
router.post('/searchAllGoods',function(req,res,next){
  
  
  Goods.findOne(function(err,goodInfo){
    if(err){
      res.status(500).json({
        code:1,
        msg:err.message
      })
    }else{
    if (goodInfo){
      res.status(200).json({
        code: 0,
        msg: '',
        result: goodInfo
      })
    }else{
      res.status(200).json({
        code: 2,
        msg: '商品不存在',
       
      })
    }
     
     
  }
  })
})


//加入购物车功能
// router.post('/addcart', function (req, res, next) {
//   // cookie中存储用户的登录信息 确保用户购物车中之前的商品还在
//   // var userId = req.cookies.userId;
//   var userId = "196255774";;
//   var productId = req.body.productId;
//   // console.log(productId);
//   Users.findOne({
//     userId: userId
//   }, function (err, userDoc) {
//     if (err) {
//       res.status(200).json({
//         code: 1,
//         msg: err.message
//       })
//     } else {
//       // console.log(userDoc);//用户所有的个人信息 购物车 地址 登录 密码
//       if (userDoc) {
//         Goods.findOne({
//           productId: productId
//         }, function (err, goodDoc) {
//           //  console.log(goodDoc);
//           if (err) {
//             res.status(200).json({
//               code: 1,
//               msg: err.message
//             })
//           } else {
//             // console.log(goodDoc);

//             // 第二次某条商品加载进来的数据 就是在cartlist中存在这条数据
//             let goodItem = 0;
//             userDoc.cartList.forEach(function (item) {
//               if (item.productId == productId) {
//                 item.productNum++;
//                 goodItem = 1;
//               }
//             });
//             if (goodItem == 1) {
//               userDoc.save(function (err, userSave) {
//                 if (err) {
//                   res.status(200).json({
//                     code: 1,
//                     msg: err.message
//                   })
//                 } else {
//                   // console.log(2)
//                   res.status(200).json({
//                     code: 0,
//                     msg: '添加成功'
//                   })
//                 }
//               })
//               //保存数量加过之后的
//             } else {
//               goodDoc.productNum = 1;
//               goodDoc.checked = 1;
//               // console.log(goodDoc)
//               userDoc.cartList.push(goodDoc);
//               // 数据持久化
//               userDoc.save(function (err, userSave) {
//                 if (err) {
//                   res.status(200).json({
//                     code: 1,
//                     msg: err.message
//                   })
//                 } else {
//                   //console.log(0)
//                   res.status(200).json({
//                     code: 0,
//                     msg: '添加成功'
//                   })
//                 }
//               })
//             }
//             //保存新加的商品至购物车
//           }
//         })
//       }
//     }

//   })
// })


module.exports=router