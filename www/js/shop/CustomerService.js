/**
 * creater:lizhi@camelotchina.com
 * create time:2017/08/02
 * describe：售后维修
 **/
APP.controller('CustomerServiceController', ['RetainageService', '$scope', '$stateParams', '$timeout', '$state', '$ionicModal', 'CustomerServiceService', '$ionicScrollDelegate', 'LoginService',
    '$ionicLoading', '$rootScope', 'PaymentService', '$ionicPopup', 'PopupService', '$ionicHistory', 'InAppBrowserService', 'UserService',
    'EasyConnectService', 'AfterOrderSubmitService', 'ConfirmReceiveService',
    function(RetainageService, $scope, $stateParams, $timeout, $state, $ionicModal, CustomerServiceService, $ionicScrollDelegate, LoginService, $ionicLoading, $rootScope,
        PaymentService, $ionicPopup, PopupService, $ionicHistory, InAppBrowserService, UserService, EasyConnectService, AfterOrderSubmitService, ConfirmReceiveService) {

        /** 变量声明 **/
        $scope.isBuyer = LoginService.getRole(); //判断用户角色信息；0为买家；1为卖家
        $scope.isShowDown = true; //是否显示向下按钮
        $scope.isShowUp = false; //是否显示向下按钮
        $scope.isClick = false; //判断按钮点击次数
        $scope.orderFlag = 0; //订单类型 0代表全部
        $scope.orderStatus = 5; // 售后/维权
        $scope.isIos = false;
        $scope.BDO = false; //批量删除状态
        var BDOrder;
        var payInfo = ''; //支付信息

        $scope.pageIndex = 0; //分页页数
        $scope.pageIndexSearch = 0; //搜索结果分页
        $scope.pageSize = 5; //每页显示条数
        $scope.hasMoreData = false; //默认不加载下拉刷新
        $scope.orderAmountData = [];
        $scope.orderList = [];
        $scope.searchOrderList = [];
        $scope.memberId;
        //搜索结果 是否为空
        $scope.emptySearch = false;
        var idForDelete = ''; //待删除订单的id
        /** 方法 **/
        $scope.init = function() {
            console.log($ionicHistory.backView());
            var u = navigator.userAgent;

            if (u.indexOf('iPhone') != -1) {
                $scope.isIos = true;
            } else {
                $scope.isIos = false;
            }
            $scope.memberId = UserService.getUser().mid;

            $scope.orderType = '全部订单'; //初始订单类型
            $scope.availableToTop(); //回到头部

            //$scope.orderStatus = $stateParams.orderStatus ? $stateParams.orderStatus : ''; //从消息中心跳转来 待定的状态参数orderStatus
            $scope.loadOrderAmount(0);
            $scope.loadOrderList(false, 0, $scope.orderStatus, 0, 5, '');
            if ($scope.isBuyer == '0') {
                $scope.isShowDown = false;
                $scope.isShowUp = false;
            } else {
                $scope.isShowDown = true;
                $scope.isShowUp = false;
            }
            $scope.pageIndex = 0; //分页页数
        };
        // 批量删除
        $scope.batchDeleteOrder = function() {
                $state.go('batchDeleteOrder');
            }
            //加载数据
        $scope.loadOrderList = function(upDataFlag, orderFlag, orderStatus, pageIndex, pageSize, keyword, isSearch, zActivityOrder) {
            CustomerServiceService.getOrderList(orderFlag, orderStatus, pageIndex, pageSize, keyword, zActivityOrder)
                .success(function(response) {
                    console.log(response);
                    if (response.success) {
                        //批量删除状态
                        if (orderStatus == 'closed') {
                            BDOrder = response.data.canDeleteAll;
                            if (response.data.canDeleteAll) {
                                $scope.BDO = true;
                            } else {
                                $scope.BDO = false;
                            }
                        } else {
                            BDOrder = false;
                            $scope.BDO = false;
                        }

                        $scope.emptySearch = false;
                        //如果搜索结果为空
                        if (!response.data.orders.length) {
                            $scope.emptySearch = true;
                        }
                        if (upDataFlag) {
                            if (isSearch) {
                                $scope.searchOrderList = $scope.searchOrderList.concat(response.data.orders);
                                console.log($scope.searchOrderList)
                            } else {
                                if (orderFlag == 3) { //众筹订单
                                    var tempArr = response.data.orders;
                                    for (var i = 0, length = tempArr.length; i < length; i++) {
                                        if (tempArr[i].zActivityOrder == 1) {
                                            $scope.orderList.push(tempArr[i]);
                                        }
                                    }
                                } else {
                                    $scope.orderList = $scope.orderList.concat(response.data.orders);
                                }

                            }

                        } else {
                            if (isSearch) {
                                $scope.searchOrderList = response.data.orders;
                                console.log($scope.searchOrderList)
                            } else {
                                if (orderFlag == 3) { //众筹订单
                                    var tempArr = response.data.orders;
                                    for (var i = 0, length = tempArr.length; i < length; i++) {
                                        if (tempArr[i].zActivityOrder == 1) {
                                            $scope.orderList.push(tempArr[i]);
                                        }
                                    }
                                } else {
                                    $scope.orderList = response.data.orders;
                                }

                            }
                        }
                        if (isSearch) {
                            $scope.hasMoreDataSearch = response.data.orderProductSize; //搜索怎么不分页
                        } else {
                            $scope.hasMoreData = response.data.orderProductSize;
                            console.log($scope.hasMoreData + '1111');
                        }
                        $ionicScrollDelegate.resize();
                        $scope.isHaveDate = $scope.orderList.length != 0;
                    }
                    if (upDataFlag) {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        };
        $scope.loadOrderAmount = function(chooseOrder) {
            CustomerServiceService.getOrderAmount(chooseOrder)
                .success(function(response) {
                    if (response.success) {
                        $scope.orderAmountData = response.data;
                    }
                });
        };
        //加载更多
        $scope.loadMore = function() {
            $scope.pageIndex++;
            $scope.loadOrderList(true, $scope.orderFlag, $scope.orderStatus, $scope.pageIndex, $scope.pageSize, '');
        };
        $scope.loadMoreSearch = function() {
            $scope.pageIndexSearch++;
            $scope.loadOrderList(true, $scope.orderFlag, $scope.orderStatus, $scope.pageIndex, $scope.pageSize, '', true);
        };

        //支付 重要方法
        $scope.payTest = function(orderSn, paymentCode, totalAmount) {


            if (!window.cordova) {

                if (paymentCode == 'alipaymobile') { //支付宝

                    //PopupService.showToast("请使用顺逛微店app支付或登录顺逛微店公众号付款。");
                    //return;

                    window.location.href = "http://m.ehaier.com/v2/h5/pay/alipay/request.html?orderSn=" + orderSn;


                } else if (paymentCode == 'wxpay') {

                    var userAgent = window.navigator.userAgent;

                    if (!userAgent || userAgent.indexOf("MicroMessenger") == -1) {

                        PopupService.showToast("请使用顺逛微店app支付或登录顺逛微店公众号付款。");
                        return;
                    }
                    if (userAgent.substring(userAgent.indexOf("MicroMessenger") + 15, userAgent.indexOf("MicroMessenger") + 16) < 5) {

                        PopupService.showToast("微信版本过低，请使用5.0及以上版本。");
                        return;
                    }
                    window.location.href = "http://m.ehaier.com/v2/h5/pay/wxpay/pay.html?showwxpaytitle=1&orderSn=" + orderSn + "&orderAmount=" + totalAmount + ".00";


                } else if (paymentCode == 'kjtpay') {
                    //查看是否绑定kjt
                    EasyConnectService.getMessage().success(function(response, status, headers, config) {
                        if (response.data.kjtAccount && response.data.kjtAccount.memberKjtpayAccount) { //已经绑定了快捷通
                            window.location.href = "http://m.ehaier.com/v2/h5/pay/kjtpay/request.html?orderSn=" + orderSn + "&kjtAcount=" + response.data.kjtAccount.memberKjtpayAccount;
                        } else {
                            $ionicPopup.alert({
                                template: '您还未绑定快捷通',
                                okText: '去绑定'
                            }).then(function(y) {

                                $state.go('easyConnect');
                            });

                        }

                    }).error(function() {

                        //网络失败
                        alert('网络失败');
                    });

                }
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
                    var callbackUrl = "http://m.ehaier.com/v2/h5/pay/app/alipay/notify.html";
                    if (window.device && window.device.hasNewAliPay) {
                        AfterOrderSubmitService.getAliPayInfo(out_trade_no, totalAmount, callbackUrl)
                            .success(function(response) {
                                if (response.errorCode == -200) { //在支付时库存不足，极少出现的情况
                                    PopupService.showToast('库存不足，请稍后再试!');
                                    return;
                                };
                                payInfo = response.result;
                                window.alipay.pay({
                                    payInfo: payInfo
                                }, function(resultStatus) {
                                    $ionicLoading.show({
                                        template: "支付宝支付成功" + '', //resultStatus,
                                        noBackdrop: true,
                                        duration: 3000
                                    });
                                    $scope.showPay = false;
                                }, function(message) {
                                    $ionicLoading.show({
                                        template: "支付宝支付失败 " + '', //message,
                                        noBackdrop: true,
                                        duration: 3000
                                    });
                                })
                            })
                            .error(function(err) {
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

                            function(resultStatus) {
                                $ionicLoading.show({
                                    template: "支付宝支付成功" + '', //resultStatus,
                                    noBackdrop: true,
                                    duration: 3000
                                });

                                //支付成功 ,刷页面
                                $scope.init();
                            },
                            function(message) {
                                $ionicLoading.show({
                                    template: "支付宝支付失败 " + '', //message,
                                    noBackdrop: true,
                                    duration: 3000
                                });
                            });
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
                var param = { orderSn: orderSn };
                PaymentService.wPay(param).success(function(response) {
                    if (response.errorCode == -200) { //在支付时库存不足，极少出现的情况
                        PopupService.showToast('库存不足，请稍后再试!');
                        return;
                    };
                    if (response.data) { //微信支付 先访问后台，得到preorder  的 json
                        var json = JSON.stringify(response.data);

                        window.wechatPay.pay(json, function(d) { //微信支付成功

                            $ionicLoading.show({
                                template: "微信支付成功",
                                noBackdrop: true,
                                duration: 3000
                            });
                            $scope.init();

                        }, function(msg) {

                            $ionicLoading.show({
                                template: "微信支付失败: " + msg,
                                noBackdrop: true,
                                duration: 3000
                            });

                        });
                    } else {
                        alert('response.data is undefined');
                    }


                }).error(function(msg) {
                    alert(msg);
                });


            } else if (paymentCode == 'kjtpay') { //快捷通支付   cod 货到付款

                EasyConnectService.getMessage().success(function(response, status, headers, config) {
                    if (response.data.kjtAccount && response.data.kjtAccount.memberKjtpayAccount) { //已经绑定了快捷通

                        var param = {
                            orderSn: orderSn,
                            kjtAmount: response.data.kjtAccount.memberKjtpayAccount
                        };
                        PaymentService.kjtPay(param).success(function(res) {
                            if (res.errorCode == -200) { //在支付时库存不足，极少出现的情况
                                PopupService.showToast('库存不足，请稍后再试!');
                                return;
                            };
                            if (res.success) {
                                var ref = InAppBrowserService.open(res.data);
                                ref.addEventListener('exit', function(event) {
                                    $scope.init();
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
                        }).then(function(y) {

                            $state.go('easyConnect');
                        });

                    }

                }).error(function() {

                    //网络失败
                    alert('网络失败');
                });

            }

        };

        //跳转支付页面xyz
        $scope.toPamentxyz = function(orderSn) {
            var params = { orderSn: orderSn };
            PaymentService.orderPayCheck(params).success(function(response) {
                if (response.errorCode == -200) { //在支付时库存不足，极少出现的情况
                    PopupService.showAlert('提示', response.message, function() {});
                } else {
                    $state.go('paymentxyz', { orderSn: orderSn });
                }
            });
        };

        //支付尾款跳转优惠卷页面或者支付页面xyz
        $scope.Pamentxyz = function(orderSn, a, c) {
            RetainageService.getOrderList(orderSn).success(function(response) {
                if(response.success==false){
                  PopupService.showToast(response.message);
                }else{
                    couponLists = response.data.couponList;
                // alert(couponLists.length);
                    if (couponLists.length > 0) {
                        // alert(c);
                        if (c) {
                            $state.go('Retainage', { relationOrderSn: orderSn });
                        } else {
                            $state.go('paymentxyz', { orderSn: orderSn });
                        }
                    } else {
                        $state.go('paymentxyz', { orderSn: orderSn });
                    }
                }    
            });
        };

        //根据订单状态筛选订单
        $scope.changeOrder = function(obj) {
            $scope.orderList = [];
            $scope.pageIndex = 0;
            $scope.availableToTop();
            $scope.orderStatus = obj;
            console.log('chage--order');
            $scope.loadOrderList(false, $scope.orderFlag, $scope.orderStatus, $scope.pageIndex, $scope.pageSize, '');
        };

        //跳到订单追踪页面
        $scope.goOrderTrack = function(obj) {
            $scope.closeSearchModal();
            $state.go('orderTracking', { orderSn: obj });
        };
        //跳到退款详情页面
        $scope.goRefundDetailk = function(orderProductId, memberId) {
            $state.go('refundDetail', { orderProductId: orderProductId, memberId: memberId });
        };
        //跳到订单详情页面
        $scope.goOrderDetails = function(orderSn, cOrderSn, isRightService, orderProductId, memberId, isSearch) {


            // if ($scope.memberId != memberId) {
            //   console.log('not my order ---return---');
            //   return;
            // }
            if (isSearch) {
                $scope.closeSearchModal();
            }
            if (isRightService) {

                $state.go('orderDetail', { orderSn: orderSn, cOrderSn: cOrderSn });

            } else {


                $state.go('orderDetail', { orderSn: orderSn, cOrderSn: cOrderSn });

            }
        };


        //跳到商品评价页面
        $scope.goAssess = function(orderId, cOrderSn, isSingle) {
            if (isSingle) {
                $state.go('assess', { orderId: orderId, cOrderSn: cOrderSn });
            } else {
                $state.go('assess', { orderId: orderId, cOrderSn: '' });
            }
        };

        //跳到查看评价页面
        $scope.goLookAssess = function(orderId, cOrderSn, isSingle) {
            if (isSingle) {
                $state.go('lookAssess', { orderId: orderId, cOrderSn: cOrderSn });
            } else {
                $state.go('lookAssess', { orderId: orderId, cOrderSn: '' });
            }
        };

        //取消订单
        $scope.orderCancel = function(obj) {
            $scope.cancelOrderId = obj;
            PopupService.showConfirm('', '确认要取消此订单？', confirmCancelOrder, '确定');

        };

        function confirmCancelOrder() {
            CustomerServiceService.cancelOrder($scope.cancelOrderId, 'mstore')
                .success(function(response) {});
            $timeout(function() {
                $scope.availableToTop();
                $scope.pageIndex = 0;
                //$scope.orderStatus = '';
                $scope.search.keyWord = '';
                $scope.loadOrderList(false, $scope.orderFlag, '', $scope.pageIndex, $scope.pageSize, '');
                $scope.loadOrderAmount($scope.orderFlag);
            }, 1000);
        }

        //确认收货
        $scope.confirmReceive = function(isSingle, cOrderSn, orderId) {
            if (isSingle) {
                PopupService.showConfirm('', '"确认收货"将代表您已收到所购商品！', sureClick, '确认');

                function sureClick(result) {
                    if (result) {
                        ConfirmReceiveService.confirmReceive(cOrderSn)
                            .success(function(response) {
                                if (response.success) {
                                    $scope.init();
                                } else {
                                    PopupService.showToast(response.message);
                                }
                            })
                    } else {
                        //do noting
                    }
                }
            } else {
                $state.go('confirmReceive', { orderId: orderId });
            }
        };

        //返回顶部
        $scope.availableToTop = function() {
            $ionicScrollDelegate.$getByHandle('availableHandle').scrollTop();
        };
        $scope.$on('$ionicView.beforeEnter', function(e, v) {
            $scope.raiseStatusOne = {
                "background": "red",
                "color": "#ffffff"
            }
            $scope.raiseStatusTwo = {
                "background": "red",
                "color": "#ffffff"
            }
            $scope.raiseStatusThree = {
                "background": "red",
                "color": "#ffffff"
            }
            $scope.raiseStatusFour = {
                "background": "red",
                "color": "#ffffff"
            }
            $scope.orderFlag = 0; //订单类型 0代表全部初始化
            //批量删除状态``
            if (BDOrder) {
                $scope.BDO = true;
            } else {
                $scope.BDO = false;
            }
            if (v.direction == 'back') { //不需要刷新  $ionicView.enter

            } else {
                //需要刷新
                $scope.init();
            }
        });

        $scope.deleteOrder = function(orderId) {
            idForDelete = orderId;
            PopupService.showConfirm('', '确认删除此订单？', deleteSuccess, '删除');
        };

        //删除订单方法
        function deleteSuccess(flag) {
            if (flag) {
                CustomerServiceService.deleteOrder(idForDelete)
                    .success(function(response) {
                        if (response.success) {
                            $scope.init();
                        } else {
                            PopupService.showToastShort(response.message);
                            idForDelete = '';
                        }
                    })
                    .error(function(error) {
                        PopupService.showToastShort('删除失败！');
                        idForDelete = '';
                    })
            } else {
                idForDelete = '';
            }
        }

        $rootScope.$on('AFTER_COMMIT', function(event) {
            $scope.loadOrderAmount(0);
            //$scope.changeOrder('rightService'); //初始化 售后 /维权
        });
    }
]);


/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016-03-21
 * describe：订单管理Service
 **/
APP.service('CustomerServiceService', ['$http', 'UrlService', function($http, UrlService) {
    //获取订单列表数据
    this.getOrderList = function(orderFlag, orderStatus, pageIndex, pageSize, keyword) {
        var params = {
            orderFlag: orderFlag,
            orderStatus: orderStatus,
            pageIndex: pageIndex,
            pageSize: pageSize,
            keyword: keyword
        };
        return $http.get(UrlService.getNewUrl('ORDER_MANAGE'), params);
    };
    //获取订单数量统计
    this.getOrderAmount = function(chooseOrder) {
        var params = {
            chooseOrder: chooseOrder
        };
        return $http.get(UrlService.getNewUrl('ORDER_AMOUNT'), params);
    };
    //取消订单
    this.cancelOrder = function(orderId, cancelFlag) {
        var params = {
            orderId: orderId,
            cancelFlag: cancelFlag
        };
        return $http.get(UrlService.getUrl('CANCEL_ORDER'), params);
    };
    //立即支付
    this.payOrder = function(orderSn) {
        var params = {
            orderSn: orderSn
        };
        return $http.get(UrlService.getUrl('PAY_ORDER'), params);
    };
    //删除订单
    this.deleteOrder = function(orderId) {
        var params = {
            orderId: orderId
        };
        return $http.get(UrlService.getUrl('DELETE_ORDER'), params);
    }
}]);

/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/3/30
 * describe：自定义过滤器：限制字符长度
 **/
APP.filter("cut", function() {
    return function(value, wordwise, max, tail) {
        if (!value) return '';
        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;
        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf('');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }
        return value + (tail || '…');
    }
});