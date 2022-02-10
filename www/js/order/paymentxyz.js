/**
 * Created by xyz on 2016/12/22.
 */
APP.controller('PaymentControllerxyz', ['AfterOrderSubmitService', '$scope', '$stateParams', '$rootScope', '$state', '$ionicActionSheet', 'PaymentService', '$ionicLoading', '$ionicHistory', 'PopupService', 'InAppBrowserService', 'EasyConnectService', '$ionicPopup', '$http', 'UrlService','UserService','WhiteShowsService',
    function (AfterOrderSubmitService, $scope, $stateParams, $rootScope, $state, $ionicActionSheet, PaymentService, $ionicLoading, $ionicHistory, PopupService, InAppBrowserService, EasyConnectService, $ionicPopup, $http, UrlService,UserService,WhiteShowsService) {


        /** 请求接口 */
        $scope.orderSn = $stateParams.orderSn;
        $scope.priceinit = '500.00';
        $scope.alipaymobile = [];
        $scope.alipaymobiles = false;
        $scope.kjtpay = [];
        $scope.kjtpays = false;
        $scope.wxpay = [];
        $scope.wxpays = false;
        $scope.canClick = true;
        $scope.showIous = true; //是否支持顺逛白条支付
        $scope.canPayWhiticos = false;
        $scope.icosImg = $rootScope.imgBaseURL+'img/baitiao-paylist.png';
        $scope.iousStatus = -1;// 白条状态
        // $scope.ccbfenqi = true;
        //变量声明
        $scope.htmlContent = $stateParams.content;
        $scope.title = $stateParams.title;
        $scope.payWay = 'alipaymobile';
        $scope.totalAmount = $stateParams.totalAmount;

        $scope.paymentCode = '';
        $scope.payWayList = [];
        $scope.payment = '';
        $scope.showPay = true;
        $scope.isToStore = false;
        var shareStoreId = ''; //订单详情页的shareStoreId
        var payInfo = '';
        $scope.isRed = false;
        $scope.urlImg = 'http://m.ehaier.com/www/img/jh.png';
        $scope.canClick = true;
        $scope.showCcb = true;
        var bv = '';


        //xyz获取订单信息  //接口请求xyz
        var params = {
            orderSn: $scope.orderSn
        };

        $scope.toPay = function () {
            // if ($scope.canClick) {
            //     $state.go('ccbfenqi', params);
            // }
            var params = {
                totalAmount:$scope.price,
                orderSn:$scope.orderSn
            }
            $state.go('bankCardChose', params);
        };

        $scope.init = function () {
            $http.get(UrlService.getUrl('TO_ORDER_SUBMIT_SUCCESS'), params)
                .success(function (response) {
                    $scope.price = response.data.orders.orderAmount;
                     // 判断顺逛白条是否可用
                    if ($scope.price >= 600) {
                        $scope.canPayWhiticos = true;
                        $scope.icosImg = $rootScope.imgBaseURL+'img/baitiao-paylist.png';
                    } else {
                        // console.log('123123');
                        $scope.canPayWhiticos = false;
                        $scope.icosImg = $rootScope.imgBaseURL+'img/baitiao-paylist-1.png';
                    }
                    var paywayList = response.data.paywayList;
                    for (var i = 0; i < paywayList.length; i++) {
                        if (paywayList[i].paymentCode == 'alipaymobile') {
                            $scope.alipaymobile = paywayList[i];
                            $scope.alipaymobiles = true;
                        } else if (paywayList[i].paymentCode == 'kjtpay') {
                            $scope.kjtpay = paywayList[i];
                            $scope.kjtpays = true;
                        } else if (paywayList[i].paymentCode == 'wxpay') {
                           
                            // 浏览器嗅探，判断是否是微信内置浏览器，微信支付只有在微信中显示
                            // var ua = window.navigator.userAgent.toLowerCase(); 
                            // if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
                                $scope.wxpay = paywayList[i];
                                $scope.wxpays = true; 
                            // }
                        }
                    }
                    if (response.data.isSupportLk !== true) {
                        $scope.showCcb = false;
                    } else if (response.data.isSupportLk == true && response.data.islk == true) {
                        $scope.isRed = true;
                        $scope.urlImg = 'http://m.ehaier.com/www/img/ic-ccb.png';
                        $scope.canClick = true;
                    } else if (response.data.isSupportLk == true && response.data.islk !== true) {
                        $scope.canClick = false;
                    }
                    if(typeof(_fxcmd)!='undefined'){
                        _fxcmd.push(['trackOrder',{oid:$scope.orderSn,otp:$scope.price+''},[]]);
                    }
                    
                })

        };

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
            bv = $ionicHistory.viewHistory().backView;
            if ($rootScope.paySuccess) {
                $ionicPopup.alert({
                    template: '此订单已经支付',
                    okText: '确定'
                }).then(function (y) {
                    $scope.goList();
                });
            } else {
                ////
            }
        });

      $scope.goList = function () {
        if (bv) {
          if (bv.stateName == 'orderManage' || bv.stateName == 'orderSearch') {
            $ionicHistory.goBack(-1);
          } else if (bv.stateName=='Retainage') {
            $state.go('orderManage');
          } else {
            $ionicHistory.goBack(-2);
          }
        } else {
          $state.go('orderManage');
        }
      };
        $scope.toSpendBai = function () {
            var parmas = {orderSn:$stateParams.orderSn}
            $state.go('spendBaiInstallment',parmas);
        }
        $scope.goCart = function () {
            $state.go('orderManage');
        };

        var orderSn, paymentCode, totalAmount;
        /** 方法 **/

        $scope.payWayMap = {
            'alipaymobile': '支付宝',
            'paymentName': '建行信用卡分期',
            'kjtpay': '快捷通',
            'wxpay': '微信支付'
        };
        // 白条支付
        $scope.iousPay = function () {
            console.log($scope.canPayWhiticos);
            console.log($scope.iousStatus);
             // 获取白条的状态
            WhiteShowsService.queryIousStatus({
                userId:UserService.getUser().ucId,
                token:UserService.getUser().accessToken
            }).success(function (res) {

                if (res.success) {

                    $scope.iousStatus = res.data.applyStatus;
                    if (!$scope.canPayWhiticos) {
                        return;
                    };
                    if ($scope.iousStatus == 2 || $scope.iousStatus == 3) {
                        $state.go('applyForWhite');
                    } else if ($scope.iousStatus == 0) {
                        // 申请中直接打开消费金融
                        WhiteShowsService.applyForOpen({
                            resultUrl:'http://m.ehaier.com/www/index.html',
                            userId:UserService.getUser().ucId,
                            token:UserService.getUser().accessToken
                        }).success(function (res) {
                            // console.log(res);
                            if(res.success) {
                                WhiteShowsService.openApplyWhiteShows(res.data.redirectUrl,window.location.href);
                            }
                        })
                        // var url = 'http://www.baidu.com';
                        // var backUrl = 'kkk';
                        // WhiteShowsService.openApplyWhiteShows(url, backUrl);
                    } else if ($scope.iousStatus == 1) {
                        console.log('211');
                        PaymentService.orderPayCheck(params).success(function (response) {
                            if(response.errorCode == -200){//在支付时库存不足，极少出现的情况
                                PopupService.showAlert('提示',response.message,function(){
                                });
                            } else {
                                console.log(985);
                                // 已经有白条的额度
                                WhiteShowsService.payApply({
                                    userId:UserService.getUser().ucId,
                                    token:UserService.getUser().accessToken,
                                    orderSn:$stateParams.orderSn,
                                    resultUrl:'http:www.baidu.com'
                                }).success(function(res) {
                                    console.log(41242);
                                    if (res.success) {
                                        // console.log(res);
                                        WhiteShowsService.openApplyWhiteShows(res.data.redirectUrl,window.location.href);
                                    };
                                })
                            }
                        });

                    }


                }
            })


        }

        /* 选择支付方式 */
        $scope.checkedpay = function (pcode) {
            $scope.paymentCode = pcode;
            orderSn = $stateParams.orderSn;
            totalAmount = $scope.price;
            $scope.payTest(orderSn, $scope.paymentCode, totalAmount);
        };

        //支付 重要方法
        $scope.payTest = function (orderSn, paymentCode, totalAmount) {

            if (!window.cordova) {
                var params ={
                    orderSn :orderSn
                };
                PaymentService.orderPayCheck(params).success(function (response) {
                    if(response.errorCode == -200){//在支付时库存不足，极少出现的情况
                        PopupService.showAlert('提示',response.message,function(){
                        });

                    }else { //通过库存校验才  通过网页 支付
                if (paymentCode == 'alipaymobile') { //支付宝
                    window.location.href = UrlService.getHeadV2()+"h5/pay/alipay/request.html?orderSn=" + orderSn;

                } else if (paymentCode == 'wxpay') {

                    var userAgent = window.navigator.userAgent;

                    if (!userAgent || userAgent.indexOf("MicroMessenger") == -1) {

                        PopupService.showToast("请使用与定金相同的支付方式-微信支付，登录顺逛微店公众号付款。");
                        return;
                    }
                    if (userAgent.substring(userAgent.indexOf("MicroMessenger") + 15, userAgent.indexOf("MicroMessenger") + 16) < 5) {

                        PopupService.showToast("微信版本过低，请使用5.0及以上版本。");
                        return;
                    }
                    window.location.href = UrlService.getHeadV2()+"h5/pay/wxpay/pay.html?showwxpaytitle=1&orderSn=" + orderSn + "&orderAmount=" + totalAmount + ".00";

                } else if (paymentCode == 'kjtpay') {

                    //查看是否绑定kjt
                    EasyConnectService.getMessage().success(function (response, status, headers, config) {
                        if (response.data.kjtAccount && response.data.kjtAccount.memberKjtpayAccount) { //已经绑定了快捷通

                            //window.location.href = "http://mobiletest.ehaier.com:38080/v2/h5/pay/kjtpay/request.html?orderSn=" + orderSn + "&kjtAcount=" + response.data.kjtAccount.memberKjtpayAccount;
                            window.location.href = UrlService.getHeadV2()+"h5/pay/kjtpay/request.html?orderSn=" + orderSn + "&kjtAcount=" + response.data.kjtAccount.memberKjtpayAccount;
                        } else {
                            $ionicPopup.alert({
                                template: '您还未绑定快捷通',
                                okText: '去绑定'
                            }).then(function (y) {
                                $state.go('bankCard');
                            });

                        }

                    }).error(function () {

                        //网络失败
                        alert('网络失败');
                    });

                }
                    }
                });
                return;
            }

            if (paymentCode == 'alipaymobile') {

                if (window.alipay) {
                    /**
                     * out_trade_no: 订单号(不能重复)
                     * subject: 商品名称
                     * body:  描述
                     * total_fee: 价格
                     * successCallback: 成功回调
                     * errorCallback: 失败回调
                     * callbackUrl: 回调地址/支付宝调用 */
                    var out_trade_no = orderSn;
                    var subject = "1x51";
                    var body = "x5企业版";
                    var callbackUrl = UrlService.getHeadV2()+"h5/pay/app/alipay/notify.html";
                    if (window.device && window.device.hasNewAliPay) {
                        AfterOrderSubmitService.getAliPayInfo(out_trade_no, totalAmount, callbackUrl)
                            .success(function (response) {
                                if (response.errorCode == -200) {//在支付时库存不足，极少出现的情况
                  PopupService.showAlert('提示',response.message,function(){
                  });
                                    return;
                                }
                                payInfo = response.result;
                                window.alipay.pay({
                                    payInfo: payInfo
                                }, function (resultStatus) {
                                    //$ionicLoading.show({
                                    //  template: "支付宝支付成功" + '', //resultStatus,
                                    //  noBackdrop: true,
                                    //  duration: 3000
                                    //});
                                    $scope.showPay = false;
                                    $state.go('payResultSuccess');
                                }, function (message) {
                                    //$ionicLoading.show({
                                    //  template: "支付宝支付失败 " + '', //message,
                                    //  noBackdrop: true,
                                    //  duration: 3000
                                    //});
                                    $state.go('payResultFailure');
                                })
                            })
                            .error(function (err) {
                                console.log('网络连接错误');
                            });
                    } else {
                        window.alipay.pay({
                                tradeNo: out_trade_no,
                                subject: "海尔顺逛微店",
                                body: "顺逛微店-订单号:" + out_trade_no,
                                price: totalAmount,
                                notifyUrl: callbackUrl
                            },
                            function (resultStatus) {
                                //$ionicLoading.show({
                                //  template: "支付宝支付成功" + '', //resultStatus,
                                //  noBackdrop: true,
                                //  duration: 3000
                                //});
                                $state.go('payResultSuccess');
                            }, function (message) {
                                //$ionicLoading.show({
                                //  template: "支付宝支付失败 " + '', //message,
                                //  noBackdrop: true,
                                //  duration: 3000
                                //});
                                $state.go('payResultFailure');
                            })
                    }
                } else {
                    alert('支付宝 插件不存在');
                }
            } else if (paymentCode == 'wxpay') { //微信支付
                if (!window.wechatPay) {
                    alert('微信支付插件未加载 ');
                    // return ;
                }
                //发请求 得到微信支付的签名等信息
                var param = {
                    orderSn: orderSn
                };
                PaymentService.wPay(param).success(function (response) {
                    if (response.errorCode == -200) {//在支付时库存不足，极少出现的情况
            PopupService.showAlert('提示',response.message,function(){
            });
                        return;
                    }
                    ;
                    if (response.data) { //微信支付 先访问后台，得到preorder  的 json
                        var json = JSON.stringify(response.data);

                        window.wechatPay.pay(json, function (d) { //微信支付成功
                            //$ionicLoading.show({
                            //  template: "微信支付成功",
                            //  noBackdrop: true,
                            //  duration: 3000
                            //});
                            $scope.showPay = false;
                            $state.go('payResultSuccess');
                        }, function (msg) {
                            //$ionicLoading.show({
                            //  template: "微信支付失败: " + msg,
                            //  noBackdrop: true,
                            //  duration: 3000
                            //});
                            $state.go('payResultFailure');
                        });
                    } else {
                        alert('网络连接错误');
                    }
                }).error(function (msg) {
                    alert(msg);
                });
            } else if (paymentCode == 'kjtpay') { //快捷通支付   cod 货到付款
                EasyConnectService.getMessage().success(function (response, status, headers, config) {
                    if (response.data.kjtAccount && response.data.kjtAccount.memberKjtpayAccount) { //已经绑定了快捷通
                        var param = {
                            orderSn: orderSn,
                            kjtAmount: response.data.kjtAccount.memberKjtpayAccount
                        };
                        PaymentService.kjtPay(param).success(function (res) {
                            if (res.errorCode == -200) {//在支付时库存不足，极少出现的情况
                PopupService.showAlert('提示',res.message,function(){
                });
                                return;
                            }
                            ;
                            if (res.success) {
                                var ref = InAppBrowserService.open(res.data);
                                ref.addEventListener('exit', function (event) {
                                    $state.go('orderManage');
                                });
                            } else {
                                $ionicPopup.alert({
                                    template: res.message,
                                    okText: '知道了'
                                });
                            }
                        });
                    } else {
                        $ionicPopup.alert({
                            template: '您还未绑定快捷通',
                            okText: '去绑定'
                        }).then(function (y) {
                            $state.go('bankCard');
                        });
                    }
                }).error(function () {
                    //网络失败
                    alert('网络失败');
                });
            }
        };
    }]);
