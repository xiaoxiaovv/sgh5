
/**
 * Created by xy on 2016/3/17.
 */
APP.controller('CartController', ['$rootScope','HomePageService','$scope', '$stateParams', 'CartService', '$state', '$ionicPopup','LoginService',
  '$timeout', '$cookies','PopupService','ProductDetailService','$ionicScrollDelegate','GetCouponsService','$location','UserService','$localstorage','IMService','UrlService',
  function ($rootScope,HomePageService,$scope, $stateParams, CartService, $state, $ionicPopup, LoginService,$timeout, $cookies,PopupService,ProductDetailService,$ionicScrollDelegate,GetCouponsService,$location,UserService,$localstorage,IMService,UrlService) {
    /** 变量声明 **/
    $scope.remindSuccess = false;
    var startIndex = 1;
    var pageSize = 5;
    $scope.getcoupons = true;
    $scope.hasMoreCoupons = false;
    var logConpousArr = [];
    $scope.all = {
      isAllChecked:true//全选标识
    };
    // 去结算页面 所需参数对象 y;
    $scope.orderInitParams = null;
    //判断是否为微信浏览器
    var userLookAgent;
    var isWeChat;
    //获取优惠券方法
    $scope.logConpous = function (){
      ProductDetailService.getShopCoupons(logConpousArr[0],logConpousArr[1],logConpousArr[2],logConpousArr[3],startIndex,pageSize,logConpousArr[4])
        .success(function (response, status, headers, config) {
          if(response.success){
            if(startIndex == 1){
              startIndex++;
              $scope.shopCoupons=response.data;
              $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
              if($scope.shopCoupons.length<response.totalCount){
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.hasMoreCoupons = true;
              }else {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.hasMoreCoupons = false;
              }
            }else {
              startIndex++;
              $scope.shopCoupons=$scope.shopCoupons.concat(response.data);
              if($scope.shopCoupons.length<response.totalCount){
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.hasMoreCoupons = true;
              }else {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.hasMoreCoupons = false;
              }
            }
          }else{
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hasMoreCoupons = false;
          }
        });
    };
    //关闭优惠券按钮点击函数
    $scope.closeCoupons = function () {
      startIndex = 1;//初始化优惠券开始页
      logConpousArr = [];
      $scope.getcoupons = false;
    };
    //打开优惠券按钮点击函数
    $scope.openCoupons = function (productId,brandId,cateId,price,o2oAttrId) {
      logConpousArr[0] = productId;
      logConpousArr[1] = brandId;
      logConpousArr[2] = cateId;
      logConpousArr[3] = price;
      logConpousArr[4] = o2oAttrId;
      $scope.logConpous();
      $scope.getcoupons = true;
    };
    //领取优惠券方法
    $scope.getNewCoupons = function(id){
      HomePageService.isWdHost()
        .success(function (res) {
          $rootScope.isWdHost = res.data.isHost;
          if($rootScope.isWdHost==-1){//如果没有登录 跳转到登录页面
            $state.go('login');
          }else{
            GetCouponsService.doGetNewCoupons(id)
              .success(function (response) {
                if(response.success){
                  $rootScope.couponXyzType = true;
                  $ionicScrollDelegate.scrollTop();
                  startIndex = 1;
                  $scope.logConpous();
                }else{
                  $scope.remindSuccess = true;
                  $scope.message = response.message;
                  setTimeout(function(){
                    $scope.$apply(function(){
                      $scope.remindSuccess = false;
                    });
                  },1500);
                }
              });
          }
        })
    };

    $scope.init = function () {
      $scope.tabNav = 'cart';
      $scope.isShow = false;
      $scope.noGoods = false;
      $scope.cartMessage = {};
      //选中商品列表
      $scope.cartSelectedMode = [];
      $scope.htmlContent = $stateParams.content;
      $scope.title = $stateParams.title;
      HomePageService.isWdHost()
        .success(function (res) {
          $rootScope.isWdHost = res.data.isHost;
        });
        ProductDetailService.getCartNum().success(function(res){
        if(res.success){
          $rootScope.BottomCartNum = res.data;
        };
      });
      CartService.loadCartMessage()
        .success(function (response, status, headers, config) {
          $scope.isShow = false;
          if (response.totalCount == 0) {
            $scope.noGoods = true;
          } else {
            $scope.cartMessage = response;
            $scope.cartSubTitle = "总共" + $scope.cartMessage.totalCount + "件商品";
            $scope.noGoods = false;
            $scope.isShow = true;
            $scope.checkAll(true);//初始化时选中全部商品
          }

        }).error(function () {
          $scope.isShow = false;
          $scope.showPopup("查询购物车失败");
        });
      $scope.all.isAllChecked = false;
    };
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.remindSuccess = false;
      $scope.getcoupons = false;
      $scope.hasMoreCoupons = false;
      $scope.isBuyerForCart = LoginService.getRole();
      $scope.init();
      $scope.footerSubmit ={position :'fixed',bottom:'49px'};
      //判断是否为微信浏览器
      userLookAgent = window.navigator.userAgent.toLowerCase();
      isWeChat = userLookAgent.match(/MicroMessenger/i) == 'micromessenger';
    });
    $scope.htmlContent = $stateParams.content;
    $scope.title = $stateParams.title;
    $scope.all.isAllChecked = false;
    //金额合计
    $scope.totalMoney = 0;


    /** 方法 **/
      // 记录选中的商品索引
    $scope.saveSelectedIndex = function (index, isChecked) {
      var _index = $scope.cartSelectedMode.indexOf(index);
      if (isChecked) {
        if (_index < 0)
          $scope.cartSelectedMode.push(index);
      } else {
        $scope.cartSelectedMode.splice(_index, 1);
      }
    };

    //商品选中逻辑处理
    $scope.selectedChanged = function (product, isChecked, index) {
      $scope.saveSelectedIndex(index, isChecked);
      $scope.all.isAllChecked = ($scope.cartSelectedMode.length == $scope.cartMessage.data.carts.length);
      $scope.accountTotalMoney();
    };

    //商品全选逻辑处理
    $scope.checkAll = function (isChecked) {
      $scope.all.isAllChecked = isChecked;
      angular.forEach($scope.cartMessage.data.carts, function (product, index) {
        product.isChecked = isChecked;
        $scope.saveSelectedIndex(index, isChecked);
      });
      $scope.accountTotalMoney();

    };

    //删除商品
    $scope.deleteProduct = function (index) {
      $scope.cartSelectedMode.splice(index, 1);
      //当skku不为空 把skku替换sku
      if($scope.cartMessage.data.carts[index].skku == null || $scope.cartMessage.data.carts[index].skku == 'null' ){
        var sku = $scope.cartMessage.data.carts[index].sku;
      }else{
        var sku = $scope.cartMessage.data.carts[index].skku;
      };
      CartService.deleteProduct(sku,$scope.cartMessage.data.carts[index].productId)
        .success(function (response, status, headers, config) {
          if (response.success == true) {
            $scope.init();
            if ($scope.cartMessage.data != undefined) {
              $scope.accountTotalMoney();
            }
          } else {
            alert('删除商品失败');
          }
        });
    };

    var nusLoading = false;//防止多次点击的 负数出现的bug
    //商品数量减少
    $scope.nus = function (index) {
      if(nusLoading){
        return ;
      }
      if ($scope.cartMessage.data.carts[index].number <= 1) {
        $scope.cartMessage.data.carts[index].number = 1;
      } else {
        nusLoading = true;
        //当skku不为空 把skku替换sku
        if($scope.cartMessage.data.carts[index].skku == null || $scope.cartMessage.data.carts[index].skku == 'null' ){
          var sku = $scope.cartMessage.data.carts[index].sku;
        }else{
          var sku = $scope.cartMessage.data.carts[index].skku;
        };
        CartService.nusplus(sku,$scope.cartMessage.data.carts[index].productId, $scope.cartMessage.data.carts[index].number - 1)
          .success(function (response, status, headers, config) {
            $scope.cartMessage.data.carts[index].number -= 1;
            $scope.accountTotalMoney();
            nusLoading = false;
            ProductDetailService.getCartNum().success(function(res){
        if(res.success){
          $rootScope.BottomCartNum = res.data;
        };
      });
          });
      }
    };


    var plusLoading = false;

    //商品数量增加
    $scope.plus = function (index) {
      //请求网络
      if(plusLoading){
        return;
      }
      plusLoading = true;
      //当skku不为空 把skku替换sku
      if($scope.cartMessage.data.carts[index].skku == null || $scope.cartMessage.data.carts[index].skku == 'null' ){
        var sku = $scope.cartMessage.data.carts[index].sku;
      }else{
        var sku = $scope.cartMessage.data.carts[index].skku;
      };
      CartService.nusplus(sku,$scope.cartMessage.data.carts[index].productId, $scope.cartMessage.data.carts[index].number + 1)
        .success(function (response, status, headers, config) {
          if(response.success==false){
            var cuowuxinxi=response.message;
            //当skku不为空 把skku替换sku
            if($scope.cartMessage.data.carts[index].skku == null || $scope.cartMessage.data.carts[index].skku == 'null' ){
              var sku = $scope.cartMessage.data.carts[index].sku;
            }else{
              var sku = $scope.cartMessage.data.carts[index].skku;
            };
            CartService.nusplus(sku,$scope.cartMessage.data.carts[index].productId, $scope.cartMessage.data.carts[index].number)
        .success(function(res){
          PopupService.showToast(cuowuxinxi);
            plusLoading = false;
            return false;
            });
          }else{
            $scope.cartMessage.data.carts[index].number += 1;
          $scope.accountTotalMoney();
          plusLoading = false;
          }
          ProductDetailService.getCartNum().success(function(re){
        if(re.success){
          $rootScope.BottomCartNum = re.data;
        };
      });
        });
    };

    //计算总金额
    $scope.accountTotalMoney = function () {
      var tempSum = 0;
      angular.forEach($scope.cartMessage.data.carts, function (product, index) {
        var _index = $scope.cartSelectedMode.indexOf(index);
        if (_index > -1) {
          tempSum += product.number * product.nowPrice;//darcywang 使用新的字段nowPrice
          $scope.cartSelectedMode.sort(function (a, b) {
            return a > b ? 1 : -1
          });
        }
      });
      $scope.totalMoney = tempSum;
    };


    //结算
    $scope.settlement = function () {
      // if(isWeChat){
      //    CartService.check_login().success(function(response){
      //     if (response.data) {
      //       UserService.setUser(response.data);////
      //       IMService.initWebSocket();////
      //       window.localStorage.setItem('isLogin', UserService.isUserLogin());////
      //       if(response.data.sessionValue){
      //         $localstorage.set('sg_login_token_secret','Bearer'+response.data.sessionValue);//把token存到本地
      //       }else{
      //         $localstorage.set('sg_login_token_secret','Bearer'+ GetStatisticInfoService.generateUUID());
      //       }
      //       if ($scope.cartSelectedMode.length  > 0) {
      //         var tmpProduct = [];
      //         var productIds = [];
      //         var goodsNumbers = [];
      //         for (var i = 0; i < $scope.cartSelectedMode.length ; i++) {
      //           tmpProduct[i] = $scope.cartMessage.data.carts[$scope.cartSelectedMode[i]]
      //         }
      //         angular.forEach(tmpProduct, function (value, key) {
      //           productIds[key] = value.productId;
      //           goodsNumbers[key] = value.number;
      //         });
      //         productIds = productIds.join(',');
      //         goodsNumbers = goodsNumbers.join(',');

      //         //订单尾款
      //         CartService.checkPageInfo(productIds,goodsNumbers)
      //           .success(function(response){
      //             if(response.success==false){
      //               $scope.showPopup(response.message);
      //             }else{
      //               CartService.settlement(productIds, goodsNumbers)
      //                 .success(function (response, status, headers, config) {
      //                   if(response.success == false){
      //                     $scope.showPopup(response.message);
      //                   }else{
      //                     if (response.success == true && response.data != null) {
      //                     $scope.cartSelectedMode = [];
      //                     var expireDate = new Date();
      //                     expireDate.setDate(expireDate.getDate() + 1);
      //                     $cookies.put('is_book', '', {expires: expireDate, path: '/'});
      //                     $state.go('orderConfirm');
      //                   } else {
      //                     $scope.showPopup('结算失败');
      //                   }
      //                 }
      //               });
      //             }
      //           })
      //       } else {
      //         $scope.showPopup('您未选择任何商品');
      //       }//////////////////////////
      //     }else{
      //       var login_token=$localstorage.get('sg_login_token_secret');
      //       var normalURL=$location.absUrl();
      //       var startPos=normalURL.indexOf("html?");
      //       if(startPos!=-1){
      //         var endPos =normalURL.indexOf("#",startPos);
      //         var startURL=normalURL.substring(0,startPos)+"html";
      //         var endURL=normalURL.substring(endPos);
      //         var currentUrl=encodeURIComponent(startURL+endURL) + encodeURIComponent('/') + login_token;
      //       }else{
      //         var currentUrl=encodeURIComponent(normalURL) + encodeURIComponent('/') + login_token;
      //       }
      //       CartService.state_id(currentUrl)
      //         .success(function(response){
      //           var state_URL=response.data;
      //           var APPID = UrlService.getCPUrl('WXSQ_ID');
      //           var REDIRECT_URI=encodeURIComponent(UrlService.getCPUrl('WXSQ_URL')+'platform/web/member/wxWebLogin.json');
      //           var weixinUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + APPID + '&redirect_uri=' + REDIRECT_URI +'&response_type=code&SCOPE=snsapi_userinfo' + '&state=' + state_URL + '#wechat_redirect';
      //           document.location.href=weixinUrl;
      //         })
      //     }
      //   })
      //   return;
      // }
      if($rootScope.isWdHost==-1){//如果还没有登录 先去登录
        $state.go('login');
        return;
      }
      if ($scope.cartSelectedMode.length  > 0) {
        var tmpProduct = [];
        var productIds = [];
        var goodsNumbers = [];
        var goodsNames = [];
        var attrValueNames = '';
        var skku = '';
        var o2oAttrId = "";
        for (var i = 0; i < $scope.cartSelectedMode.length ; i++) {
          tmpProduct[i] = $scope.cartMessage.data.carts[$scope.cartSelectedMode[i]]
        }
        angular.forEach(tmpProduct, function (value, key) {
          productIds[key] = value.productId;
          goodsNumbers[key] = value.number;
          goodsNames[key] = value.productName;

          if(value.attrValueNames == null || value.attrValueNames == 'null'){
            attrValueNames+=null+";";
          }else{
            attrValueNames+=value.attrValueNames+';';
          };
          if(value.skku == null || value.skku == 'null' ){
            skku+=null+";";
          }else{
            skku+=value.skku+';';
          }
          if(value.o2oAttrId == null || value.o2oAttrId == 'null' ){
            o2oAttrId+=null+";";
          }else{
            o2oAttrId+=value.o2oAttrId+';';
          }
        });
        
        //去掉尾部的;
        attrValueNames = attrValueNames.substring(0,attrValueNames.length-1);
        skku = skku.substring(0,skku.length-1);
        o2oAttrId = o2oAttrId.substring(0,o2oAttrId.length-1);

        productIds = productIds.join(',');
        goodsNumbers = goodsNumbers.join(',');
        goodsNames = goodsNames.join(',');

        //订单尾款
        CartService.checkPageInfo(productIds,goodsNumbers)
          .success(function(response){
            if(response.success==false){
              $scope.showPopup(response.message);
            }else{
              var proList = [];
              for(var i = 0; i<productIds.split(',').length; i++){
                if(attrValueNames.split(';')[i] != 'null'){ //有属性切换的商品
                  proList.push({
                    "proId": productIds.split(',')[i],
                    "num": goodsNumbers.split(',')[i],
                    'sku': skku.split(';')[i],
                    'name': attrValueNames.split(';')[i]
                  })
                }else{
                  proList.push({
                    "proId": productIds.split(',')[i],
                    "num": goodsNumbers.split(',')[i],
                  })
                }
              }
              $scope.orderInitParams = {
                "proList": proList,
                "street": ''
              }
              CartService.settlement($scope.orderInitParams)
                .success(function (response, status, headers, config) {
                  if(response.success == false){
                    $scope.showPopup(response.message);
                  }else{
                    if (response.success == true && response.data != null) {
                    $scope.cartSelectedMode = [];
                    var expireDate = new Date();
                    expireDate.setDate(expireDate.getDate() + 1);
                    $cookies.put('is_book', '', {expires: expireDate, path: '/'});

                    
                    // $state.go('orderConfirm',{attrValueNames:attrValueNames,skku:attrValueNames,o2oAttrId:o2oAttrId});
                    $state.go('orderConfirm',{orderInitParams: JSON.stringify($scope.orderInitParams)}); //yl
                  } else {
                    $scope.showPopup('结算失败');
                  }
                }
              });
            }
          })
      } else {
        $scope.showPopup('您未选择任何商品');
      }
    };

    $scope.showPopup = function (message) {
      var myPopup = $ionicPopup.show({
        template: message
      });
      $timeout(function () {
        myPopup.close();
      }, 1000);
    };
  }]);


APP.service('CartService', ['$http', 'UrlService', function ($http, UrlService) {

  this.loadCartMessage = function () {
    return $http.get(UrlService.getUrl('CART_LIST'));
  };
  this.getNumber = function () {
    return $http.get(UrlService.getUrl('SPECIALTY_CART_NUM'));
  };
  this.nusplus = function (sku,productId, number) {
    var params = {
      'sku':sku,
      'productId': productId,
      'number': number,
        noLoading:true
    };
    return $http.get(UrlService.getUrl('GOODS_NUMBER'), params);
  };

  this.deleteProduct = function (sku,productId) {
    var params = {
      'sku':sku,
      'productId': productId
    };
    return $http.get(UrlService.getUrl('DELETE'), params);
  };

  this.settlement = function (orderInitParams) {
    // var params = {
    //   'productIds': productIds,
    //   'numbers': numbers,
    //   'attrValueNames':attrValueNames,
    //   'skku':skku
    // };
    // return $http.get(UrlService.getUrl('CONFIRM_ORDER'), params);
    //  618优化 yl
    return $http({
      method: 'POST',
      url: UrlService.getUrl('CONFIRM_ORDER'),
      data: orderInitParams,
    });
  };
  this.checkPageInfo=function(productIds, productNames){
    var params = {
      'productIds': productIds,
      'productNames': productNames
    };
    return $http.get(UrlService.getUrl('CHECK_PAGE_INFO'),params)
  };
  this.check_login=function(){
   return $http.get(UrlService.getUrl('CHECK_LOGIN'))
   };
   this.state_id=function(state_url){
    var params = {
      'data': state_url
    };
    return $http.get(UrlService.getUrl('STATE_ID'),params)
  }
}]);
