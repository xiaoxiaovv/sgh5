/**
 * Created by xy on 2016/3/22.
 */
APP.controller('OrderConfirmController', ['$scope', '$stateParams', '$rootScope', '$state', 'orderConfirmService', '$ionicPopup', '$timeout', 'PopupService', 'LoginService','$http','UrlService','$ionicHistory','$ionicScrollDelegate','$ionicLoading',
  function ($scope, $stateParams, $rootScope, $state, orderConfirmService, $ionicPopup, $timeout, PopupService, LoginService,$http,UrlService,$ionicHistory,$ionicScrollDelegate, $ionicLoading) {
    /** 变量声明 **/
    $scope.o2oTypeMap = {};
    $scope.htmlContent = $stateParams.content;
    $scope.title = $stateParams.title;
    $scope.tabNav = 'selection';
    $scope.couponsPrice = 0;//优惠券优惠金额
    $scope.couponAmount = 0;//卡券优惠金额
    $scope.smallPrice = [];//小计金额（优惠前）
    $scope.snewPrice = [];//小计金额（优惠后）
    $scope.allPrice = 0;//合计金额（优惠前）
    $scope.newPrice = 0;//合计金额（优惠后）
    $scope.isBook=$stateParams.Book;//是否支持预定

    //规格参数
    $scope.attrValueNames = $stateParams.attrValueNames || '';
    $scope.skku = $stateParams.skku || '';

    $scope.disableSubmitBtn = false;//是否禁用订单提交按钮

    $scope.searchGoodsName = {
      name: '',//卡券码输入框
      giftName: ''//礼品券码输入框
    };
    $scope.invoiceHead = undefined;//电子发票发票头
    $scope.zzsInvoice = undefined;//增值税发票
    $scope.searchButton = false;//卡券兑换按钮
    $scope.giftSearchButton = false;//礼品券兑换按钮
    $scope.canUseGiftCard = undefined;//是否可以使用礼品券 true为可用
    $scope.item = {
      isChecked: false,//卡券单选框
      isGiftChecked: false//礼品券单选框
    };
    $scope.data = {
      memberId: ''
    };//卡券兑换短信验证码

    $scope.deliMap = {
      '9:0000': '9:00-13:00',
      '130000': '13:00-18:00',
      '180000': '18:00-21:00'
    };
    $scope.pointsChecked = [false,false,false];//积分选中状态
    var tempPointsChecked = [false,false,false];//暂存积分选中状态数组
    $scope.couponsDiscount = null;//所有优惠券优惠金额
    $scope.seaShellDiscount = 0;//使用海贝积分优惠金额
    $scope.diamondDiscount = 0;//使用钻石优惠金额
    $scope.insuranceDiscount = 0;//使用保险积分优惠金额
    $scope.pointsList = null;//各种积分信息数组
    var payAmount = null;//积分扣减基数，积分使用不影响此变量
    var pointsUsedList = [3, 2, 1];//已使用积分数组，传入服务端
    $scope.buttonDisabled = [true, true, true];//积分开关禁用控制数组
    $scope.orderInitParams = JSON.parse($stateParams.orderInitParams); // createOrder入参数 yl
    $scope.selectedPayType = null; //支付方式 yl
    $scope.privilege = ''; //特权码
    $scope.giftList = []; // 赠品信息
    $scope.isHasCode = false;
    $scope.isFillIn = false; // 返回填写
    $scope.isHxCode = false;
    $scope.goBack = function() {
      $ionicHistory.goBack();
    };

    // if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
    //   $scope.paddingtopClass = {
    //     "margin-top": "16px"
    //   };
    //   $scope.paddingtopClasscontent = {
    //     "top": "60px"
    //   }
    // }else{
    //   $scope.paddingtopClass = {
    //     "margin-top": "0px"
    //   };
    //   $scope.paddingtopClasscontent = {
    //     "top": "44px"
    //   }
    // }
    // 去验证 核销
    $scope.goWriteOff = function () {
      var privilegeCode = document.getElementById('privilegeCode');
      if(privilegeCode.value!=''){
        orderConfirmService.postPrivilegeCode(privilegeCode.value)
          .success(function (res) {
            if(res.success && res.result){
              PopupService.showToast('验证成功');
              $scope.privilege = privilegeCode.value;
              $scope.isHxCode = true;
              //  PopupService.showToast(res.message);
              orderConfirmService.updateOrder($scope.orderInitParams)
                .success(function (res) {
                  console.log(res)
                  if(res.success){
                    PopupService.showToast('验证成功');
                    console.log('123')
                    if(res.data.hb!=null){
                      $scope.privilege = res.data.hb.c;
                      $scope.giftList = res.data.hb.p;
                    }else{
                      $scope.privilege = privilegeCode.value;
                      $scope.giftList = [];
                    }

                  }else{
                    PopupService.showToast(res.message);
                    $scope.giftList = [];
                  }
                })
            }else{
              PopupService.showToast(res.message);
              $scope.isHxCode = false;
              $scope.privilege = '';
              $scope.giftList = [];
              // PopupService.showToast(res.message);
            }
          })
      }else{
        PopupService.showToast('请填写正确的特权码');
      }
    }
    /** 方法   参数 是否是发票改变后跳入 **/
    $scope.init = function (updateType) { // updataType 是否要更新数据 yl
      $scope.o2oAttrId = $stateParams.o2oAttrId;
      //卡券 优惠券 通用 商品
      //卡券：只有020商品可以显示(product.o2oTypeMapValue==3)并且不为活动商品（!orderConfirmMessage.isActivity）
      //优惠券：不为活动商品（!orderConfirmMessage.isActivity）
      //通用券：不为活动商品（!orderConfirmMessage.isActivity）
      resetVariable();
      orderConfirmService[(updateType?'updateOrder':'doInit')]($scope.orderInitParams)
        .success(function (response, status, headers, config) {
            if(!response.success){
              $state.go('homePage');
              return;
            }
            console.log(response)
            //处理null
            // for(var i=0; i < response.data.ordersCommitWrapM.orderProductList.length;i++){
            //   if(response.data.ordersCommitWrapM.orderProductList[i].attrValueName == 'null' || response.data.ordersCommitWrapM.orderProductList[i].attrValueName == null){
            //     var arr = [];
            //     response.data.ordersCommitWrapM.orderProductList[i].attrValueName = arr;
            //   }else{
            //     var str = response.data.ordersCommitWrapM.orderProductList[i].attrValueName;
            //     var arr = str.split(',');
            //     response.data.ordersCommitWrapM.orderProductList[i].attrValueName = arr;
            //   }
            // };
            if(response.data.hb!=null){
              $scope.giftList = response.data.hb.p;
              $scope.privilege = response.data.hb.c;
            }
            $scope.orderConfirmMessage = response.data;
            $scope.pointsList = response.data.bl ? response.data.bl : null;//可使用积分list
            $scope.canUseGiftCard = $scope.orderConfirmMessage.canUseGiftCard;
            $scope.regAddress = $scope.orderConfirmMessage.addr;
            $scope.regInvoice = $scope.orderConfirmMessage.inv.iti;
            $scope.invoiceHead = $scope.orderConfirmMessage.inv.iti;
            $scope.o2oTypeMap = $scope.orderConfirmMessage.o2oTypeMap;
            $scope.zzsInvoice = $scope.orderConfirmMessage.inv.iti;
            $scope.isBooking = $scope.orderConfirmMessage.book ? 1 : 0;
            $scope.selectedPayType = {
              code: $scope.orderConfirmMessage.pays[0].code,
              name: $scope.orderConfirmMessage.pays[0].name,
            }
            //如果订单里的所有商品数量总和超过2，则不支持货到付款，（前端 daba 实现）
            $scope.proNumberTotal = 0;//初始化 商品数量总数为0
            for (var i = 0, proArrLength = $scope.orderConfirmMessage.ops.length; i < proArrLength; i++) {
              $scope.proNumberTotal += $scope.orderConfirmMessage.ops[i].num;
            }
            //如果支持预定且没货，点击是isBooking改为1
            if ($scope.isBook == 1) {
              $scope.isBooking = 1;
            }
            $scope.paymentType = $scope.orderConfirmMessage.pays;
            $scope.paymentCode = $scope.paymentType[0].paymentCode;
            $scope.codFlag = false;//货到付款的标志
            var length = $scope.orderConfirmMessage.pays.length;

            if (length == 2) {
              $scope.codFlag = true;
            }
            // if ($scope.isOnlinePay[0]) {
            //   $scope.choosePayType(0);
            // } else {
            //   if ($scope.codFlag && $scope.proNumberTotal <= 2) {
            //     $scope.choosePayType(1);
            //   } else {
            //     $scope.choosePayType(0);
            //   }
            // }

            // if (!$scope.orderConfirmMessage.ordersCommitWrapM.order.couponCodeValue) {
            //   $scope.orderConfirmMessage.ordersCommitWrapM.order.couponCodeValue = 0;
            // }
            // for (var i = 0; i < $scope.orderConfirmMessage.ops.length; i++) {
            //   $scope.smallPrice[i] = $scope.orderConfirmMessage.ops[i].price * $scope.orderConfirmMessage.ops[i].num;
            //   // $scope.orderConfirmMessage.ordersCommitWrapM.orderProductList[i].couponCodeValue = $scope.orderConfirmMessage.ordersCommitWrapM.orderProductList[i].couponCodeValue ? $scope.orderConfirmMessage.ordersCommitWrapM.orderProductList[i].couponCodeValue : 0;
            //   // $scope.orderConfirmMessage.ordersCommitWrapM.orderProductList[i].couponAmount = $scope.orderConfirmMessage.ordersCommitWrapM.orderProductList[i].couponAmount ? $scope.orderConfirmMessage.ordersCommitWrapM.orderProductList[i].couponAmount : 0;
            //   // 使用商品优惠券后每个商品的金额
            //   if ($scope.orderConfirmMessage.ordersCommitWrapM.orderProductList[i].couponAmount == 0) {
            //     if ($scope.smallPrice[i] - $scope.orderConfirmMessage.ordersCommitWrapM.orderProductList[i].couponCodeValue > 0) {
            //       $scope.snewPrice[i] = $scope.smallPrice[i] - $scope.orderConfirmMessage.ordersCommitWrapM.orderProductList[i].couponCodeValue;
            //       //计算商品优惠券折扣金额
            //       $scope.couponsDiscount = $scope.couponsDiscount + $scope.orderConfirmMessage.ordersCommitWrapM.orderProductList[i].couponCodeValue;
            //     } else {
            //       $scope.snewPrice[i] = 0.01;
            //     }
            //   }
            //   //使用卡券后每个商品的金额
            //   else if ($scope.orderConfirmMessage.ordersCommitWrapM.orderProductList[i].couponAmount != 0) {
            //     if ($scope.smallPrice[i] - $scope.orderConfirmMessage.ordersCommitWrapM.orderProductList[i].couponAmount > 0) {
            //       $scope.snewPrice[i] = $scope.smallPrice[i] - $scope.orderConfirmMessage.ordersCommitWrapM.orderProductList[i].couponAmount;
            //     } else {
            //       $scope.snewPrice[i] = 0.01;
            //     }
            //   }
            //   $scope.couponsPrice += $scope.orderConfirmMessage.ordersCommitWrapM.orderProductList[i].couponCodeValue;
            //   //通用优惠券优惠金额
            //   if ($scope.orderConfirmMessage.ordersCommitWrapM.order.couponCodeValue != 0) {
            //     $scope.couponsPrice = 0;
            //     $scope.couponsPrice = $scope.orderConfirmMessage.ordersCommitWrapM.order.couponCodeValue;
            //   }
            //   for (var prop in $scope.o2oTypeMap) {//o2oTypeMap 这个map 存放了商品是否是 oto   用这个value 判断 o2o类型
            //     if (prop == $scope.orderConfirmMessage.ordersCommitWrapM.orderProductList[i].productId) {
            //       $scope.orderConfirmMessage.ordersCommitWrapM.orderProductList[i].o2oTypeMapValue = $scope.o2oTypeMap[prop];
            //     }
            //   }
            //   $scope.allPrice = $scope.allPrice + $scope.smallPrice[i];
            //   payAmount = $scope.allPrice;//计算积分的初始值，未使用优惠券
            //   //使用商品优惠券后合计金额
            //   if ($scope.orderConfirmMessage.ordersCommitWrapM.order.couponCodeValue == 0) {
            //     $scope.newPrice = $scope.newPrice + $scope.snewPrice[i];
            //     if($scope.newPrice<0){
            //       $scope.newPrice = 0.01;
            //     }
            //     payAmount = $scope.newPrice;//支付金额扣除商品优惠券
            //   }
            // }
            // //使用通用优惠券后合计金额
            // if ($scope.orderConfirmMessage.ordersCommitWrapM.order.couponCodeValue != 0) {
            //   $scope.newPrice = $scope.allPrice - $scope.couponsPrice;
            //   if($scope.newPrice<0){
            //     $scope.newPrice = 0.01;
            //   }
            //   payAmount = $scope.newPrice;
            //   //优惠券折扣减去通用优惠券
            //   $scope.couponsDiscount = $scope.couponsDiscount + $scope.orderConfirmMessage.ordersCommitWrapM.order.couponCodeValue;
            // }
            $scope.couponsDiscount = $scope.orderConfirmMessage.tca; //订单总共的优惠金额
            $scope.allPrice = $scope.orderConfirmMessage.pam;//合计金额（优惠前）
            $scope.newPrice = $scope.orderConfirmMessage.oam;//合计金额（优惠后）
            payAmount = $scope.orderConfirmMessage.oam;
            //计算各种积分使用情况
            if ($scope.orderConfirmMessage.bl) {
              initPoint($scope.orderConfirmMessage.bl);
            }
          }
        ).error(function (response, status, headers, config) {

        });
    };
    /*初始化数据方法*/
    function resetVariable(){
      $scope.seashellDiscount = 0;
      $scope.diamondDiscount = 0;
      $scope.insuranceDiscount = 0;
      $scope.couponsPrice = 0;
      $scope.couponAmount = 0;
      $scope.allPrice = 0;
      $scope.newPrice = 0;
      $scope.orderData = {};
      $scope.htmlContent = $stateParams.content;
      $scope.title = $stateParams.title;
      $scope.searchGoodsName.name = null;
      $scope.searchGoodsName.giftName = null;
      $scope.codFlag = false;
      $scope.couponsDiscount = null;
      $scope.buttonDisabled = [true,true,true];//积分按钮默认不可点击
      pointsUsedList = []
    }
    //支付方式选择
    $scope.isOnlinePay = [true, false];
    $scope.choosePayType = function (name, code) {
      if($scope.selectedPayType.code == code){return;}
      orderConfirmService.choosePayType({
        "name":name,
        "code":code
      }).success(function (response) {
        if (response.success == true) {
          $scope.isOnlinePay = [false, true];
          $scope.selectedPayType = {
            name: name,
            code: code
          }
        } else {
          console.log(response.message);
        }
      });
    }


    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      $scope.isHasCode = false;
      $scope.isFillIn = false;

      // if($ionicHistory.viewHistory().forwardView && ($ionicHistory.viewHistory().forwardView.stateName == 'address'
      //     || $ionicHistory.viewHistory().forwardView.stateName == 'useCouponsList'
      //     || $ionicHistory.viewHistory().forwardView.stateName == 'sendGoodsTime'
      //     || $ionicHistory.viewHistory().forwardView.stateName == 'invoiceSetup'
      //   )){ //收获地址返回 yl
      //   $scope.init(true); //更新页面接口
      // }else{
      //   $scope.init(); //更新页面接口
      // }
      if(v.direction == 'back'){
        $scope.init(true);
      }else{
        $scope.init();
        $scope.privilege = '';
        $scope.giftList = [];
        $scope.isHxCode = false;
      }
      $scope.isBuyerForOrder = LoginService.getRole();//判断用户角色信息；0为买家；1为卖家
      if ($scope.isBuyerForOrder == 0) {
        $scope.footerSubmit = {position: 'fixed', bottom: '0px'};
      } else {
        $scope.footerSubmit = {position: 'fixed', bottom: '49px'};
      }
    });

    $scope.$on('$ionicView.afterLeave', function (e, v) {
      $rootScope.isInvoice = false;

    });

    /** 监听是否输入卡券码 **/
    $scope.$watch('searchGoodsName.name', function (newVal, oldVal) {
      if (newVal) {
        $scope.searchButton = true;
      } else {
        $scope.searchButton = false;
        $scope.item.isChecked = false;
      }
    });

    /** 监听是否输入礼品券码 **/
    $scope.$watch('searchGoodsName.giftName', function (newVal, oldVal) {
      if (newVal) {
        $scope.giftSearchButton = true;
      } else {
        $scope.giftSearchButton = false;
        $scope.item.isGiftChecked = false;
      }
    });


    /* 发票信息跳转 */
    $scope.toInvoice = function (invoiceType) {
      $state.go('invoiceSetup', {invoiceHead: $scope.invoiceHead, invoiceType: invoiceType, enterPage: 0});
    };
    function commonSubmit() {
      if ($scope.disableSubmitBtn === true) {
        return;
      }
      if (!$scope.regAddress) {
        var alertInvoice = $ionicPopup.alert({
          template: '收货地址必须填写！',
          okText: '知道了'
        });
        return;
      }
      if (!(/^[^&<>]+$/.test($scope.regAddress))) {
        var alertAddress = $ionicPopup.alert({
          template: '详细地址不能包含特殊字符！',
          okText: '知道了'
        });
      } else {

        $scope.disableSubmitBtn = true;
        $scope.isHasCode = false;
        $scope.isFillIn = true;
        console.log('提交了')
        orderConfirmService.toSubmit($scope.isBooking, pointsUsedList)
          .success(function (response, status, headers, config) {

            /*$ionicLoading.show({
             template: '正在创建订单',//resultStatus,
             noBackdrop: true,
             duration: 10000
             });*/

            if (response.success === true) {
              //$rootScope.registOrderSuccessCallback(new Date().getTime(), 10000, function (id, isTimeout, message) {
              $scope.disableSubmitBtn = false;
              $ionicLoading.hide();
              console.log('aaaaaaaaaaaaaa',response)
              if (window.cordova) {
                $rootScope.gio.track('SubmitOrder', {
                  paymentMethod: response.data.pyc,
                  totalPrice: $scope.allPrice != $scope.newPrice ? $scope.newPrice : $scope.allPrice,
                  productCount: $scope.proNumberTotal
                });
              };
              //if (isTimeout === false) {
              var data = response;
              if (data.success === true && data.data && data.data.os) {
                var messageData = data.data;
                // var paymentWay = response.data.order.paymentCode;
                var paymentWay = data.data.pyc;
                if (data.data.ps == 101) { //已经支付 yl
                  $state.go('orderManage');
                  return;
                }
                //xneng
                if(window.xneng){
                  var xn_order_ref='';
                  var fromState = $rootScope.xnFromState,toState = $rootScope.xnToState,fromParams = $rootScope.xnFromParams,toParams = $rootScope.xnToParams;
                  var arr=fromState.url.split("/:");
                  if(arr.length>0){
                    for(var i=1;i<arr.length;i++){
                      xn_order_ref+='/'+fromParams[arr[i]]
                    }
                    xn_order_ref=UrlService.getHead().match(/(\S*)v3/)[1]+'www/index.html#/'+fromState.name+xn_order_ref;
                  }
                  var xn_order_url='';
                  var arr=toState.url.split("/:");
                  if(arr.length>0){
                    for(var i=1;i<arr.length;i++){
                      xn_order_url+='/'+toParams[arr[i]]
                    }
                    xn_order_url=UrlService.getHead().match(/(\S*)v3/)[1]+'www/index.html#/'+toState.name+xn_order_url;
                  }
                  /**
                   * 订单页轨迹标准接口
                   * @param title 商品页的名字
                   * @param url 商品页的url
                   * @param ref 上一页url
                   * @param sellerid 商户id (android单独需要的参数)
                   * @param orderid 订单id (android单独需要的参数)
                   * @param orderprice 订单价格 (android单独需要的参数)
                   * @return  0：发送轨迹成功，701:发送轨迹失败
                   */
                  window.xneng.NTalkerOrderAction(
                    '提交订单',
                    xn_order_url,
                    xn_order_ref,
                    '',
                    messageData.os,
                    messageData.oa,
                    function(success){
                      console.log(' 订单页轨迹标准接口---success')
                    },
                    function(error){
                      console.log(' 订单页轨迹标准接口---fail')
                    }
                  )

                }
                /*百分点创建订单成功埋点*/
                if (window.baifend) {
                  var itemId = [];
                  var baifendprice = [];
                  var baifendnumber = [];
                  for(var i = 0;i<$scope.orderConfirmMessage.ops.length;i++){
                    itemId[i]=$scope.orderConfirmMessage.ops[i].sku;
                    baifendprice[i]=$scope.orderConfirmMessage.ops[i].price;
                    baifendnumber[i]=$scope.orderConfirmMessage.ops[i].num;
                  }
                  var params = {
                    uid:$scope.orderConfirmMessage.mid?($scope.orderConfirmMessage.mid+''):'',
                    total:messageData.oa
                  }
                  $rootScope.itemId = itemId;
                  $rootScope.baifendprice = baifendprice;
                  $rootScope.proNumberTotal = baifendnumber;
                  window.baifend.onOrder(messageData.orderSn,itemId,baifendprice,baifendnumber,messageData.orderAmount,params);
                }
                //跳转页面
                if (paymentWay == 'online') {
                  if($scope.orderConfirmMessage.tca>0){
                    $rootScope.couponXyzType = true;
                  }
                  $state.go('paymentxyz', {
                    orderSn: response.data.os,
                    totalAmount: response.data.oa
                  });
                } else {
                  $state.go('afterOrderSubmit', {
                    messageData: JSON.stringify(messageData),
                    paymentCode: paymentWay
                  });
                }
              } else {
                // $scope.showPopup(response.message);
                var myPop = $ionicPopup.confirm({
                  template: data.message ? data.message : "创建订单失败",
                  okText: '返回上一页',
                  cancelText: '留在此页'
                });
                myPop.then(function (res) {
                  if (res) {
                    $ionicHistory.goBack(-1);
                  }
                });
              }
              /*} else {
               var myPop = $ionicPopup.confirm({
               template: "等待创建订单超时，请转到订单列表页查看订单是否创建成功",
               okText: '跳到订单列表页',
               cancelText: '留在此页'
               });
               myPop.then(function (res) {
               if (res) {
               $state.go('orderManage');
               }
               });
               }*/
              // });
            } else {
              $scope.disableSubmitBtn = false;
              $ionicLoading.hide();

              var myPop = $ionicPopup.confirm({
                template: response.message,
                okText: '返回上一页',
                cancelText: '留在此页'
              });
              myPop.then(function (res) {
                if (res) {
                  $ionicHistory.goBack(-1);
                } else {

                }
              });
            }
          }).error(function (err) {
          console.error(err);
          $scope.disableSubmitBtn = false;
          $ionicLoading.hide();
        });
      }
    }
    $scope.goBackFill = function () {
      $scope.isHasCode = false;
      $scope.isFillIn = true;
    }
    /* 确认订单跳转 */
    $scope.toSubmit = function (index) {
      if($scope.orderConfirmMessage.ot == 9){ //软装
        console.log('ruanzhuang')
        if(index == 2){ // 弹窗中确定
          console.log('但窗里的确定')
          commonSubmit();
        }
        else if(!$scope.isFillIn && ($scope.privilege=='' || $scope.giftList==[])){
          console.log('弹窗')
          $scope.isHasCode = true;
        }
        else if($scope.isFillIn){ // 返回填写 直接提交
          console.log('返回填写 不填写 直接提交')
          commonSubmit();
        }
        else  if(index == 1){ // 点了返回 再次提交信息
          commonSubmit();
        }
      }else{
        console.log('bu shi ruan zhuang')
        commonSubmit();
      }

      // if ($scope.disableSubmitBtn === true) {
      //   return;
      // }
      // if (!$scope.regAddress) {
      //   var alertInvoice = $ionicPopup.alert({
      //     template: '收货地址必须填写！',
      //     okText: '知道了'
      //   });
      //   return;
      // }
      // if (!(/^[^&<>]+$/.test($scope.regAddress))) {
      //   var alertAddress = $ionicPopup.alert({
      //     template: '详细地址不能包含特殊字符！',
      //     okText: '知道了'
      //   });
      // } else {
      //   $scope.disableSubmitBtn = true;
      //   orderConfirmService.toSubmit($scope.isBooking, pointsUsedList)
      //     .success(function (response, status, headers, config) {
      //
      //       /*$ionicLoading.show({
      //         template: '正在创建订单',//resultStatus,
      //         noBackdrop: true,
      //         duration: 10000
      //       });*/
      //
      //       if (response.success === true) {
      //         //$rootScope.registOrderSuccessCallback(new Date().getTime(), 10000, function (id, isTimeout, message) {
      //           $scope.disableSubmitBtn = false;
      //           $ionicLoading.hide();
      //           console.log('aaaaaaaaaaaaaa',response)
      //           if (window.cordova) {
      //             $rootScope.gio.track('SubmitOrder', {
      //               paymentMethod: response.data.pyc,
      //               totalPrice: $scope.allPrice != $scope.newPrice ? $scope.newPrice : $scope.allPrice,
      //               productCount: $scope.proNumberTotal
      //             });
      //           };
      //           //if (isTimeout === false) {
      //             var data = response;
      //             if (data.success === true && data.data && data.data.os) {
      //               var messageData = data.data;
      //               // var paymentWay = response.data.order.paymentCode;
      //               var paymentWay = data.data.pyc;
      //               if (data.data.ps == 101) { //已经支付 yl
      //                 $state.go('orderManage');
      //                 return;
      //               }
      //               //xneng
      //               if(window.xneng){
      //                   var xn_order_ref='';
      //                   var fromState = $rootScope.xnFromState,toState = $rootScope.xnToState,fromParams = $rootScope.xnFromParams,toParams = $rootScope.xnToParams;
      //                   var arr=fromState.url.split("/:");
      //                   if(arr.length>0){
      //                     for(var i=1;i<arr.length;i++){
      //                       xn_order_ref+='/'+fromParams[arr[i]]
      //                     }
      //                     xn_order_ref=UrlService.getHead().match(/(\S*)v3/)[1]+'www/index.html#/'+fromState.name+xn_order_ref;
      //                   }
      //                   var xn_order_url='';
      //                   var arr=toState.url.split("/:");
      //                   if(arr.length>0){
      //                     for(var i=1;i<arr.length;i++){
      //                       xn_order_url+='/'+toParams[arr[i]]
      //                     }
      //                     xn_order_url=UrlService.getHead().match(/(\S*)v3/)[1]+'www/index.html#/'+toState.name+xn_order_url;
      //                   }
      //                     /**
      //                    * 订单页轨迹标准接口
      //                    * @param title 商品页的名字
      //                    * @param url 商品页的url
      //                    * @param ref 上一页url
      //                    * @param sellerid 商户id (android单独需要的参数)
      //                    * @param orderid 订单id (android单独需要的参数)
      //                    * @param orderprice 订单价格 (android单独需要的参数)
      //                    * @return  0：发送轨迹成功，701:发送轨迹失败
      //                    */
      //                   window.xneng.NTalkerOrderAction(
      //                     '提交订单',
      //                     xn_order_url,
      //                     xn_order_ref,
      //                     '',
      //                     messageData.os,
      //                     $messageData.oa,
      //                     function(success){
      //                         console.log(' 订单页轨迹标准接口---success')
      //                     },
      //                     function(error){
      //                         console.log(' 订单页轨迹标准接口---fail')
      //                     }
      //                   )
      //
      //               }
      //               /*百分点创建订单成功埋点*/
      //               if (window.baifend) {
      //                 var itemId = [];
      //                 var baifendprice = [];
      //                 var baifendnumber = [];
      //                 for(var i = 0;i<$scope.orderConfirmMessage.ops.length;i++){
      //                     itemId[i]=$scope.orderConfirmMessage.ops[i].sku;
      //                     baifendprice[i]=$scope.orderConfirmMessage.ops[i].price;
      //                     baifendnumber[i]=$scope.orderConfirmMessage.ops[i].num;
      //                 }
      //                 var params = {
      //                     uid:$scope.orderConfirmMessage.mid?($scope.orderConfirmMessage.mid+''):'',
      //                     total:messageData.oa
      //                 }
      //                 $rootScope.itemId = itemId;
      //                 $rootScope.baifendprice = baifendprice;
      //                 $rootScope.proNumberTotal = baifendnumber;
      //                 window.baifend.onOrder(messageData.orderSn,itemId,baifendprice,baifendnumber,messageData.orderAmount,params);
      //               }
      //               //跳转页面
      //               if (paymentWay == 'online') {
      //                 if($scope.orderConfirmMessage.tca>0){
      //                   $rootScope.couponXyzType = true;
      //                 }
      //                 $state.go('paymentxyz', {
      //                   orderSn: response.data.os,
      //                   totalAmount: response.data.oa
      //                 });
      //               } else {
      //                 $state.go('afterOrderSubmit', {
      //                   messageData: JSON.stringify(messageData),
      //                   paymentCode: paymentWay
      //                 });
      //               }
      //             } else {
      //               // $scope.showPopup(response.message);
      //               var myPop = $ionicPopup.confirm({
      //                 template: data.message ? data.message : "创建订单失败",
      //                 okText: '返回上一页',
      //                 cancelText: '留在此页'
      //               });
      //               myPop.then(function (res) {
      //                 if (res) {
      //                   $ionicHistory.goBack(-1);
      //                 }
      //               });
      //             }
      //           /*} else {
      //             var myPop = $ionicPopup.confirm({
      //               template: "等待创建订单超时，请转到订单列表页查看订单是否创建成功",
      //               okText: '跳到订单列表页',
      //               cancelText: '留在此页'
      //             });
      //             myPop.then(function (res) {
      //               if (res) {
      //                 $state.go('orderManage');
      //               }
      //             });
      //           }*/
      //        // });
      //       } else {
      //         $scope.disableSubmitBtn = false;
      //         $ionicLoading.hide();
      //
      //         var myPop = $ionicPopup.confirm({
      //           template: response.message,
      //           okText: '返回上一页',
      //           cancelText: '留在此页'
      //         });
      //         myPop.then(function (res) {
      //           if (res) {
      //             $ionicHistory.goBack(-1);
      //           } else {
      //
      //           }
      //         });
      //       }
      //     }).error(function (err) {
      //     console.error(err);
      //     $scope.disableSubmitBtn = false;
      //     $ionicLoading.hide();
      //   });
      // }
    };
    /* 确认订单跳转 */
    // $scope.toSubmit = function () {
    //   if($scope.disableSubmitBtn === true){
    //     return;
    //   }
    //   if (!$scope.regAddress) {
    //     var alertInvoice = $ionicPopup.alert({
    //       template: '收货地址必须填写！',
    //       okText: '知道了'
    //     });
    //     return;
    //   }
    //   if (!(/^[^&<>]+$/.test($scope.regAddress))) {
    //     var alertAddress = $ionicPopup.alert({
    //       template: '详细地址不能包含特殊字符！',
    //       okText: '知道了'
    //     });
    //   } else {
    //     $scope.disableSubmitBtn = true;
    //     orderConfirmService.toSubmit($scope.isBooking,pointsUsedList)
    //       .success(function (response, status, headers, config) {
    //
    //         /*$ionicLoading.show({
    //           template: '正在创建订单',//resultStatus,
    //           noBackdrop: true,
    //           duration: 10000
    //         });*/
    //
    //         if (response.success === true) {
    //           //$rootScope.registOrderSuccessCallback(new Date().getTime(), 10000, function (id, isTimeout, message) {
    //             $scope.disableSubmitBtn = false;
    //             $ionicLoading.hide();
    //             console.log('aaaaaaaaaaaaaa',response)
    //             if (window.cordova) {
    //               $rootScope.gio.track('SubmitOrder', {
    //                 paymentMethod: response.data.pyc,
    //                 totalPrice: $scope.allPrice != $scope.newPrice ? $scope.newPrice : $scope.allPrice,
    //                 productCount: $scope.proNumberTotal
    //               });
    //             };
    //             //if (isTimeout === false) {
    //               var data = response;
    //               if (data.success === true && data.data && data.data.os) {
    //                 var messageData = data.data;
    //                 // var paymentWay = response.data.order.paymentCode;
    //                 var paymentWay = data.data.pyc;
    //                 if (data.data.ps == 101) { //已经支付 yl
    //                   $state.go('orderManage');
    //                   return;
    //                 }
    //                 //跳转页面
    //                 if (paymentWay == 'online') {
    //                   if($scope.orderConfirmMessage.tca>0){
    //                     $rootScope.couponXyzType = true;
    //                   }
    //                   $state.go('paymentxyz', {
    //                     orderSn: response.data.os,
    //                     totalAmount: response.data.oa
    //                   });
    //                 } else {
    //                   $state.go('afterOrderSubmit', {
    //                     messageData: JSON.stringify(messageData),
    //                     paymentCode: paymentWay
    //                   });
    //                 }
    //               } else {
    //                 // $scope.showPopup(response.message);
    //                 var myPop = $ionicPopup.confirm({
    //                   template: data.message ? data.message : "创建订单失败",
    //                   okText: '返回上一页',
    //                   cancelText: '留在此页'
    //                 });
    //                 myPop.then(function (res) {
    //                   if (res) {
    //                     $ionicHistory.goBack(-1);
    //                   }
    //                 });
    //               }
    //             /*} else {
    //               var myPop = $ionicPopup.confirm({
    //                 template: "等待创建订单超时，请转到订单列表页查看订单是否创建成功",
    //                 okText: '跳到订单列表页',
    //                 cancelText: '留在此页'
    //               });
    //               myPop.then(function (res) {
    //                 if (res) {
    //                   $state.go('orderManage');
    //                 }
    //               });
    //             }*/
    //          // });
    //         } else {
    //           $scope.disableSubmitBtn = false;
    //           $ionicLoading.hide();
    //
    //           var myPop = $ionicPopup.confirm({
    //             template: response.message,
    //             okText:'返回上一页',
    //             cancelText:'留在此页'
    //           });
    //           myPop.then(function (res) {
    //             if(res){
    //               $ionicHistory.goBack(-1);
    //             }else{
    //
    //             }
    //           });
    //         }
    //       }).error(function (err) {
    //         console.error(err);
    //       $scope.disableSubmitBtn = false;
    //       $ionicLoading.hide();
    //       });
    //   }
    // };

    /* 支付方式跳转 */
    $scope.toPayment = function (pcode) {
      $state.go('payment', {paymentCode: pcode});
    };
    $scope.tosendGoodsTime = function () {
      $state.go('sendGoodsTime');
    };

    //提示消息弹出框
    $scope.showPopup = function (message) {
      var myPopup = $ionicPopup.show({
        template: message
      });
      $timeout(function () {
        myPopup.close();
      }, 1000);
    };

    //点击礼品券兑换按钮
    $scope.useGiftCard = function (cardCode) {
      if (!cardCode) {
        return;
      }
      orderConfirmService.useGiftCard(cardCode)
        .success(function (response, status, header, config) {
          if (response.success == true) {
            $scope.item.isGiftChecked = true;
            if (response.result.flag == 'N') {
              PopupService.showAlert('提示', response.result.failedReason, '');
            } else {
              $scope.item.isGiftChecked = true;
              $scope.init(true);
            }
          } else {
            PopupService.showAlert('提示', '验证优惠券失败', '');
          }
        });
    };

    //取消兑换礼品券
    $scope.cancleGiftCard = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: '提示',
        template: '是否确认取消优惠?',
        okText: '确定',
        cancelText: '取消'
      });
      confirmPopup.then(function (res) {
        if (res) {
          orderConfirmService.cancleGiftCard()
            .success(function (response, status, header, config) {
              if (response.result == true) {
                PopupService.showAlert('提示', '取消成功', '');
                $scope.init(true);
              } else {
                $scope.showPopup('取消失败');
              }
            });
        } else {
          console.log('You are not sure');
        }
      });
    };

    //点击卡券兑换按钮
    $scope.useCard = function (cardID, productId, number, storeCode) {
      if (!cardID) {
        return;
      }
      orderConfirmService.useCard(cardID, productId, number, storeCode)
        .success(function (response, status, header, config) {
          if (response.success == true) {
            if (response.result.flag == 'N') {
              PopupService.showAlert('提示', response.result.failedReason, '');
            } else {
              $scope.couponsForTransfer();
            }
          } else {
            PopupService.showAlert('提示', '验证优惠券失败', '');
          }
        });
    };
    var timer;
    $scope.couponsForTransfer = function () {
      $scope.expiredSecond = 121;//120 秒后验证码过期
      if (timer) {
        $timeout.cancel(timer);
      }
      function loop() {
        $scope.expiredSecond = $scope.expiredSecond - 1;
        if ($scope.expiredSecond > 0) {
          $scope.searchButton = false;
          timer = $timeout(function () {
            loop();
          }, 1000);
        } else {
          $scope.searchButton = true;
          myPopup2.close();
        }
      }

      loop();
      var myPopup2 = $ionicPopup.show({
        //'<div class="row padding-0 margin-top-15"><span class="col-30 text-align-c">会员名</span> <span class="col-70 color-text-red" type="text" ng-bind="data.messsage"></span></div>'
        template: '<div class="row padding-0"><span class="col-30 text-align-c">验证码</span> <input class="col-60 border text-align-c" style="border-color: #32BEFF !important;height: 20px" type="number" ng-model="data.memberId" placeholder="请输入验证码"></div><div> 验证码将在<span class="color-text-red" ng-bind="expiredSecond"></span>秒后过期</div>',
        title: '请输入验证码',
        subTitle: '请输入验证码',
        scope: $scope,
        buttons: [
          {text: '取消'},
          {
            text: '<b>确定</b>',
            type: 'button-positive',
            onTap: function (e) {
              if ($scope.data.memberId) {
                orderConfirmService.cardCheck($scope.data.memberId)
                  .success(function (response, status, header, config) {
                    if (response.success == true) {
                      PopupService.showAlert('提示', '使用成功', '');
                      $scope.init(true);
                      myPopup2.close();
                    } else {
                      PopupService.showAlert('提示', response.message, '');
                    }
                  });
              } else {
                PopupService.showAlert('提示', '请输入验证码', '');
              }
              e.preventDefault();
            }
          }
        ]
      });
    };

    //选择卡券
    $scope.goCard = function () {
      chooseSort(1);
    };

    //选择礼品券
    $scope.goGiftCard = function () {
      chooseSort(2);
    };

    //通用券跳转 2通用， 1商品
    $scope.goUseCouponList = function (param) {
      if(!param.couponId){ // 当前未使用过优惠券时
        if (param.type == 1) {
          if(!chooseSort(0)){
            return;
          }
        } else if (param.type == 2) {
          if(!chooseSort(3)){
            return;
          }
        }
      }
      $state.go('useCouponsList', param)
    };
    // 各种优惠券选择顺序的判断    yl
    var alertMsg = '礼品券不可与优惠券/卡券同时使用，请核对要使用的优惠券';
    function chooseSort(type){
      //  0店铺优惠券  1卡券  2礼品券  3 平台优惠券
      if (!$scope.regAddress) {
        var alertInvoice = $ionicPopup.alert({
          template: '收货地址必须填写！',
          okText: '知道了'
        });
        return;
      }
      //通用券已使用
      if (type != 3 && $scope.orderConfirmMessage.coAmt) {
        var alertCoupon = $ionicPopup.alert({
          template: alertMsg,
          okText: '知道了'
        });
        return;
      }
      //商品优惠已使用
      if(type != 0){
        for (var i = 0; i < $scope.orderConfirmMessage.ops.length; i++) {
          if ($scope.orderConfirmMessage.ops[i].ca) {
            alertCoupon = $ionicPopup.alert({
              template: alertMsg,
              okText: '知道了'
            });
            return;
          }
        }
      }
      //商品卡券已使用
      if(type != 1){
        // for (var i = 0; i < $scope.orderConfirmMessage.ops.length; i++) {
        //   if ($scope.searchButton == true || $scope.orderConfirmMessage.ordersCommitWrapM.orderProductList[i].couponAmount != 0) {
        //     alertCoupon = $ionicPopup.alert({
        //       template: alertMsg,
        //       okText: '知道了'
        //     });
        //     return;
        //   }
        // }
      }
      // 礼品券已使用
      if(type !=2){
        if ($scope.giftSearchButton == true || $scope.orderConfirmMessage.useGiftCard == true) {
          alertCoupon = $ionicPopup.alert({
            template: alertMsg,
            okText: '知道了'
          });
          return;
        }
      }
      return true;
    }
    /***********************积分相关方法*************************/
    function initPoint(list) {//未使用任何积分的情况
      pointsUsedList = [];
      $ionicScrollDelegate.resize();
      $scope.seashellDiscount = 0;
      $scope.diamondDiscount = 0;
      $scope.insuranceDiscount = 0;
      var len = list.length;
      for (var j = 0; j < len; j++) {
        var pointDiscount = null, //抵扣金额
          canUsePoint = null;//可用积分
        pointDiscount = mul(payAmount , list[j].quota);
        if(pointDiscount>$scope.newPrice){
          //抵扣金额大于支付金额，取支付金额
          pointDiscount = $scope.newPrice
        }
        canUsePoint = Math.floor(mul(pointDiscount , list[j].proportion));
        pointDiscount = canUsePoint/list[j].proportion;
        if(canUsePoint>$scope.pointsList[j].count){
          //可用积分大于总积分，取总积分，并重新计算抵扣金额
          canUsePoint = $scope.pointsList[j].count;
          pointDiscount = canUsePoint/list[j].proportion;
        }
        $scope.pointsList[j].pointDiscount = pointDiscount;
        $scope.pointsList[j].canUsePoint = canUsePoint;
        $scope.pointsChecked[j] = false;
        tempPointsChecked[j] = false;
        if($scope.pointsList[j].canUsePoint>0){
          $scope.buttonDisabled[j] = false;//按钮置为可点击
        }
      }
    }

    $scope.countPoint = function (index,type) {
      if($scope.pointsList[index].canUsePoint == 0)return;
      //操作积分模块，重新计算各种积分
      $scope.pointsChecked[index] = !$scope.pointsChecked[index];
      if(tempPointsChecked[index] ==true&&$scope.pointsChecked[index]==false){
        //取消任意一种均重置
        $scope.newPrice = $scope.newPrice + $scope.diamondDiscount + $scope.seashellDiscount + $scope.insuranceDiscount;//已抵扣金额，恢复
        initPoint($scope.orderConfirmMessage.bl);
        tempPointsChecked[index] = $scope.pointsChecked[index];
        return;
      }else if(tempPointsChecked[index] ==false&&$scope.pointsChecked[index]==true){
        var pointDiscount, canUsePoint;
        pointDiscount = mul(payAmount , $scope.pointsList[index].quota);
        if(pointDiscount>$scope.newPrice){
          pointDiscount = $scope.newPrice
        }
        canUsePoint = Math.floor(mul(pointDiscount , $scope.pointsList[index].proportion));
        pointDiscount = canUsePoint/$scope.pointsList[index].proportion;
        if(canUsePoint>$scope.pointsList[index].count){
          canUsePoint = $scope.pointsList[index].count;
          pointDiscount = canUsePoint/$scope.pointsList[index].proportion;
        }
        $scope.pointsList[index].pointDiscount = pointDiscount;
        $scope.pointsList[index].canUsePoint = canUsePoint;
        $scope.newPrice = $scope.newPrice - pointDiscount;
        switch (type) {//计算折扣金额
          case 'diamond':
            $scope.diamondDiscount = pointDiscount;
            break;
          case 'seashell':
            $scope.seashellDiscount = pointDiscount;
            break;
          case 'insurance':
            $scope.insuranceDiscount = pointDiscount;
            break;
          default :
            break;
        }
        pointsUsedList.push({
          benefitType:type,
          count:canUsePoint,
          amt:pointDiscount
        });
        for(var i = 0;i<$scope.pointsList.length;i++){
          //选中一种，并计算其他未选中的模块
          if($scope.pointsChecked[i] == false && i != index){
            var pointDiscountOther, canUsePointOther;
            pointDiscountOther = mul(payAmount , $scope.pointsList[i].quota);
            if(pointDiscountOther>$scope.newPrice){
              pointDiscountOther = $scope.newPrice
            }
            canUsePointOther = Math.floor(mul(pointDiscountOther,$scope.pointsList[i].proportion));
            pointDiscountOther = canUsePointOther/$scope.pointsList[i].proportion;
            if(canUsePointOther ==0){
              $scope.buttonDisabled[i] = true;//可用积分为零，不可选择
            }
            if(canUsePointOther>$scope.pointsList[i].count){
              canUsePointOther = $scope.pointsList[i].count;
              pointDiscountOther = canUsePointOther/$scope.pointsList[i].proportion;
            }
            $scope.pointsList[i].pointDiscount = pointDiscountOther;
            $scope.pointsList[i].canUsePoint = canUsePointOther;
          }
        }
        tempPointsChecked[index] = $scope.pointsChecked[index];
      }
      $ionicScrollDelegate.resize();
    };
    $scope.switchOn = {
      "background" : "#4fa7ec",
      "border-color" : "#4fa7ec"
    };
    $scope.switchOff = {
      "background" : "#fff",
      "border-color" : "#e6e6e6"
    };
    /*解决浮点数计算精度丢失四则运算方法*/
    function add(a, b) {
      var c, d, e;
      try {
        c = a.toString().split(".")[1].length;
      } catch (f) {
        c = 0;
      }
      try {
        d = b.toString().split(".")[1].length;
      } catch (f) {
        d = 0;
      }
      return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
    }
    function sub(a, b) {
      var c, d, e;
      try {
        c = a.toString().split(".")[1].length;
      } catch (f) {
        c = 0;
      }
      try {
        d = b.toString().split(".")[1].length;
      } catch (f) {
        d = 0;
      }
      return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
    }
    function mul(a, b) {
      var c = 0,
        d = a.toString(),
        e = b.toString();
      try {
        c += d.split(".")[1].length;
      } catch (f) {}
      try {
        c += e.split(".")[1].length;
      } catch (f) {}
      return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
    }
    function div(a, b) {
      var c, d, e = 0,
        f = 0;
      try {
        e = a.toString().split(".")[1].length;
      } catch (g) {}
      try {
        f = b.toString().split(".")[1].length;
      } catch (g) {}
      return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
    }
  }]);

APP.service('orderConfirmService', ['$http', 'UrlService', function ($http, UrlService) {

  this.doInit = function (orderInitParams) { //yl
    return $http({
      method: 'POST',
      url: UrlService.getUrl('CONFIRM_ORDER'),
      data: orderInitParams
    });
  };
  // 选择优惠券后，更新结算页数据
  this.updateOrder = function () { //yl
    return $http({
      method: 'post',
      url: UrlService.getUrl('UPDATE_ORDER'),
    });
  };

  this.toSubmit = function (isBooking,benefitList) {
    var params = {
      remark: '',
      isBooking: isBooking,
      benefitList:benefitList
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('ORDER_SUBMIT'),
      data: params
    });
  };

  /**
   * 卡券兑换
   * @param cardCode
   * @param productId
   * @param number
   * @param storeCode
   * @returns {*}
   */
  this.useCard = function (cardCode, productId, number, storeCode) {
    var params = {
      cardCode: cardCode,
      productId: productId,
      number: number,
      storeCode: storeCode
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('CARD_COUPONS_USED'),
      params: params
    });
  };

  this.cardCheck = function (captcha) {
    var param = {
      captcha: captcha
    };
    return $http.get(UrlService.getUrl('CARD_ CODE_CHECK'), param);//'h5/sgl/order/orderInfo.html'
  };

  /**
   * 礼品券兑换
   * @param cardCode
   * @param number
   * @param amount
   * @param customId
   * @returns {*}
   */
  this.useGiftCard = function (cardCode) {
    var params = {
      cardCode: cardCode,
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('GIFT_CARD_COUPONS_USED'),
      params: params
    });
  };

  /**
   * 取消礼品券兑换
   * @param couponCode
   * @returns {*}
   */
  this.cancleGiftCard = function () {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('GIFT_CARD_COUPONS_CANCLE'),
      // params: params
    });
  };
  /**
   * 选择支付方式
   */
  this.choosePayType = function(params){
    return $http({
      method: 'POST',
      url: UrlService.getUrl('SUBMIT_PAY_WAY'),
      data: params
    })
  }
  // 核销特权码
  this.postPrivilegeCode = function (code) {
    var params = {
      c:code
    }
    return $http({
      method:'POST',
      url:UrlService.getUrl('POST_PRIVILEGE_CODE'),
      params:params
    })
  }

}]);
