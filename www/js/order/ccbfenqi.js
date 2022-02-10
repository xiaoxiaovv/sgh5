/**
 * Created by daba on 2016/12/21.
 */
APP.controller('CcbFenqiController', ['$q','CcbFenqiService','$scope','$stateParams', '$rootScope', '$state', 'orderConfirmService', '$ionicPopup', '$timeout', 'PopupService', 'LoginService','$http','InAppBrowserService','UrlService','PaymentService','UserService',
  function ($q,CcbFenqiService,$scope, $stateParams, $rootScope, $state, orderConfirmService, $ionicPopup, $timeout, PopupService, LoginService,$http,InAppBrowserService,UrlService,PaymentService,UserService) {

    $scope.imgUrl = 'http://cdn09.ehaier.com/shunguang/H5/www/img/CCB.png';
    $scope.title = '建行信用卡';
    if ($stateParams.whereName.indexOf('ceb') >= 0) {
      $scope.imgUrl = 'http://cdn09.ehaier.com/shunguang/H5/www/img/12CEB.png';
      $scope.title = '光大信用卡';
    };
    $scope.whereName = $stateParams.whereName;
    console.log($stateParams.whereName);
    
    $scope.$on('$ionicView.beforeEnter',function(){
      //判断是不是 ios
      $scope.isAndroid = ionic.Platform.isAndroid();
      if($scope.isAndroid){
        $scope.androidOrIosStyle={
          "right":"5px"
        }
      }else{
        $scope.androidOrIosStyle={
          "left":"70px"
        }
      }
      // $scope.payMargin = {
      //   "margin-top":"10px"
      // }
      $scope.isShowDet = false;
      $scope.isChooseFenqi = false;
      $scope.orderSn = $stateParams.orderSn;
      //拉取分期数据
//       $.ajax({  
//         url:'http://mobiletest.ehaier.com:38080/paycenter/pay/fenqi/cost.html',  
//         type: "GET",  
//         async: false,
//         dataType: "jsonp",
//         jsonp: "callback", //服务端用于接收callback调用的function名的参数   
//         jsonpCallback: "callback_result", //callback的function名称,服务端会把名称和data一起传递回来   
//         data:{ "orderSn":"D17052617580984831","channel":"pc","payType":"ccb_fenqi"}, 
//         success: function(json) {  
//          console.log(json);  
//         },  
//         error: function(){alert('Error');}  
// }); 

      CcbFenqiService.getCcbCost($scope.orderSn,'sg',$stateParams.whereName)
        .success(function(response){
          console.log(response);
          $scope.payList = response.data.costInfo;
          
          // console.log($scope.payList, $scope.number);
          $scope.totalFee = response.data.totalFee;
          $scope.benefitFee = response.data.benefitFee;
          $scope.payFee = response.data.payFee;
          $scope.cfgMark = response.data.cfgMark;
          //活动信息
          $scope.feeInfo = response.data.feeInfo==null?false:response.data.feeInfo;
          //分期的 种类
          var fenqiTypeNum = $scope.payList.length;
          //初始化分期数 的数组
          for(var i=0;i<fenqiTypeNum;i++){
            $scope.payList[i].fenqiNum=false;
          }
          // 设置默认分期数为不分期
          $scope.payList[0].fenqiNum = true;
          $scope.number=$scope.payList[0].number;
          for(var i=fenqiTypeNum-1;i>=0;i--){
            if($scope.payList[i].isFree==1){
              //如果当前期数是 免息
              $scope.payList[i].isFree=true;
            }else{
              //当前期数没有免息
              $scope.payList[i].isFree=false;
            }
          }
        })
      
    });

    $scope.showDetail = function(){
      $scope.isShowDet = !$scope.isShowDet;
    }
    $scope.changeFenqiNum = function(number){
      $scope.isChooseFenqi=true;
      var fenqiTypeNum = $scope.payList.length;
      //初始化分期数 的数组
      for(var i=0;i<fenqiTypeNum;i++){
        if($scope.payList[i].number==number){
          $scope.payList[i].fenqiNum = true;
          $scope.number=number;

        }else{
          $scope.payList[i].fenqiNum = false;
        }
      }
    }
    function payRequest (params){
      var deferred = $q.defer();
      // if (params.payType == 'ceb_fenqi') {
      //   CcbFenqiService.payRequestWithGuangDaTest(params)
      //   .success(function(response){
      //     console.log(response);
      //     deferred.resolve(response);
      //   })
      // } else {
        CcbFenqiService.payRequest(params)
        .success(function(res1){
          console.log(res1);
          deferred.resolve(res1);
        })
      // }
      
      return deferred.promise;
    }
    $scope.toPay = function(){
      //如果没有选择分期数
      // console.log($scope.isChooseFenqi)
      if(!$scope.number){
        PopupService.showToast('请选择一种分期方式');
        return;
      }else{
        //如果是 网页端
        if (!window.cordova) {
          

            var par ={
                orderSn :$scope.orderSn
            };
            PaymentService.orderPayCheck(par).success(function (response) {
                if(response.errorCode == -200){//在支付时库存不足，极少出现的情况
                    PopupService.showAlert('提示',response.message,function(){
                    });

                }else{
                  console.log($scope.cfgMark);
                  var params = {
                    orderSn:$scope.orderSn,
                    num:$scope.number,
                    channel:'sg',
                    payType:$stateParams.whereName,
                    cfgMark:$scope.cfgMark,
                    memberId:UserService.getUser().mid
                  };

                  payRequest(params)
                    .then(function(res){
                      console.log('------', res);
                        if (res.errorCode != 13 && res.success) {
                          var myUrlAddress = null;
                          if (params.payType == 'ceb_fenqi') {
                            myUrlAddress = res.data.cebfenqi.actionUrl+'?Plain='+res.data.cebfenqi.plain + '&Signature='+res.data.cebfenqi.sign;
                          } else {
                            var installNum = '';
                            if (res.data.ccbfenqi.INSTALLNUM) {
                              installNum = '&INSTALLNUM=' + res.data.ccbfenqi.INSTALLNUM;
                            }
                            myUrlAddress = res.data.ccbfenqi.actionUrl+'&REMARK1='+res.data.ccbfenqi.REMARK1+'&CLIENTIP='+res.data.ccbfenqi.CLIENTIP+'&BRANCHID='+res.data.ccbfenqi.BRANCHID
                                               +'&REMARK2='+res.data.ccbfenqi.REMARK2+'&TXCODE='+res.data.ccbfenqi.TXCODE+'&REGINFO='+res.data.ccbfenqi.REGINFO+'&CURCODE='+res.data.ccbfenqi.CURCODE
                                               +'&GATEWAY='+res.data.ccbfenqi.GATEWAY+'&PROINFO='+res.data.ccbfenqi.PROINFO+'&MERCHANTID='+res.data.ccbfenqi.MERCHANTID+installNum
                                               +'&ORDERID='+res.data.ccbfenqi.ORDERID+'&POSID='+res.data.ccbfenqi.POSID+'&PAYMENT='+res.data.ccbfenqi.PAYMENT+'&MAC='+res.data.ccbfenqi.MAC
                                               +'&TYPE='+res.data.ccbfenqi.TYPE+'&TIMEOUT='+res.data.ccbfenqi.TIMEOUT;
                            console.log(myUrlAddress);
                          }
                          
                          window.location.href = myUrlAddress;
                        } else if(res.errorCode == 13 && !res.success) {
                          PopupService.showConfirm('提示','由于优惠活动已结束，支付金额将按照应付金额进行支付', function (isOk) {
                            if (isOk) {
                              console.log(12)
                              params.joinActivity = 1;
                              console.log(params);
                              payRequest(params).then(function (res) {
                                if (!res.success) { return; }
                                var myUrlAddress = null;
                                if (params.payType == 'ceb_fenqi') {
                                  myUrlAddress = res.data.cebfenqi.actionUrl+'?Plain='+res.data.cebfenqi.plain + '&Signature='+res.data.cebfenqi.sign;
                                } else {
                                  console.log(12,res);
                                  var installNum = '';
                                  if (res.data.ccbfenqi.INSTALLNUM) {
                                    installNum = '&INSTALLNUM=' + res.data.ccbfenqi.INSTALLNUM;
                                  }
                                  var myUrlAddress = res.data.ccbfenqi.actionUrl+'&REMARK1='+res.data.ccbfenqi.REMARK1+'&CLIENTIP='+res.data.ccbfenqi.CLIENTIP+'&BRANCHID='+res.data.ccbfenqi.BRANCHID
                                                     +'&REMARK2='+res.data.ccbfenqi.REMARK2+'&TXCODE='+res.data.ccbfenqi.TXCODE+'&REGINFO='+res.data.ccbfenqi.REGINFO+'&CURCODE='+res.data.ccbfenqi.CURCODE
                                                     +'&GATEWAY='+res.data.ccbfenqi.GATEWAY+'&PROINFO='+res.data.ccbfenqi.PROINFO+'&MERCHANTID='+res.data.ccbfenqi.MERCHANTID+installNum
                                                     +'&ORDERID='+res.data.ccbfenqi.ORDERID+'&POSID='+res.data.ccbfenqi.POSID+'&PAYMENT='+res.data.ccbfenqi.PAYMENT+'&MAC='+res.data.ccbfenqi.MAC
                                                     +'&TYPE='+res.data.ccbfenqi.TYPE+'&TIMEOUT='+res.data.ccbfenqi.TIMEOUT;
                                }
                                window.location.href = myUrlAddress;
                              })
                            } else {
                              $state.go('orderManage', {orderStatus:1,orderFlag:1});
                            }
                          })
                          
                        }  
                      
                      
                })
            // window.location.href = UrlService.getServiceV2('CCB_FENQI_W')+'?reference='+paramPay.orderSn+"&number="+paramPay.number;
            }

          });
        }
        else{
          //如果是 手机端
          var params ={
            orderSn :$scope.orderSn
          };
          PaymentService.orderPayCheck(params).success(function (response) {
            if(response.errorCode == -200){//在支付时库存不足，极少出现的情况
              PopupService.showAlert('提示',response.message,function(){
              });

            }else{//验证通过 则 发建行支付
              var params = {
                orderSn:$scope.orderSn,
                num:$scope.number,
                channel:'sg',
                payType:$stateParams.whereName,
                cfgMark:$scope.cfgMark,
                memberId:UserService.getUser().mid
              };
              payRequest(params)
                .then(function(res){
                  
                    if (res.errorCode != 13 && res.success) {
                      // console.log(2);
                      //   console.log(res);
                      // payRequest(params).then(function(response){
                        pay(res);
                      // });
                    } else if(res.errorCode == 13 && !res.success) {
                      PopupService.showConfirm('提示','由于优惠活动已结束，支付金额将按照应付金额进行支付', function (isOk) {
                        
                        if (isOk) {
                          params.joinActivity = 1;
                          payRequest(params).then(function(response){
                            console.log(32123000000000000);
                            console.log(response);
                            if (response.success) {
                              pay(response);
                            }
                            
                          });
                        } else {
                          $state.go('orderManage', {orderStatus:1,orderFlag:1});
                        }
                      });
                    }
                   
                  
                  
                })
            }

          });

      }
      }



    }
    function pay (res) {
      // var ccbUrl = res.actionUrl+'&REMARK1='+res.REMARK1+'&CLIENTIP='+res.CLIENTIP+'&BRANCHID='+res.BRANCHID
      //                                        +'&REMARK2='+res.REMARK2+'&TXCODE='+res.TXCODE+'&REGINFO='+res.REGINFO+'&CURCODE='+res.CURCODE
      //                                        +'&GATEWAY='+res.GATEWAY+'&PROINFO='+res.PROINFO+'&MERCHANTID='+res.MERCHANTID+'&INSTALLNUM='+res.INSTALLNUM
      //                                        +'&ORDERID='+res.ORDERID+'&POSID='+res.POSID+'&PAYMENT='+res.PAYMENT+'&MAC='+res.MAC
      //
      // console.log('pay-唤起webview');
      var fenqiUrl = '';
      // console.log(1);
      // console.log(res);
      // console.log($stateParams);
      // console.log($stateParams.whereName);
      if ($stateParams.whereName == 'ceb_fenqi') {
        // console.log(21);
        fenqiUrl = res.data.cebfenqi.actionUrl+'?Plain='+res.data.cebfenqi.plain + '&Signature='+res.data.cebfenqi.sign;
        // console.log(23);
      } else {
        // console.log(2);
        var installNum = '';
        if (res.data.ccbfenqi.INSTALLNUM) {
          installNum = '&INSTALLNUM=' + res.data.ccbfenqi.INSTALLNUM;
        }
        // console.log(3);
        // console.log(res.data);
        // console.log(res.data.ccbfenqi);
        fenqiUrl = res.data.ccbfenqi.actionUrl+'&REMARK1='+res.data.ccbfenqi.REMARK1+'&CLIENTIP='+res.data.ccbfenqi.CLIENTIP+'&BRANCHID='+res.data.ccbfenqi.BRANCHID
                           +'&REMARK2='+res.data.ccbfenqi.REMARK2+'&TXCODE='+res.data.ccbfenqi.TXCODE+'&REGINFO='+res.data.ccbfenqi.REGINFO+'&CURCODE='+res.data.ccbfenqi.CURCODE
                           +'&GATEWAY='+res.data.ccbfenqi.GATEWAY+'&PROINFO='+res.data.ccbfenqi.PROINFO+'&MERCHANTID='+res.data.ccbfenqi.MERCHANTID+installNum
                           +'&ORDERID='+res.data.ccbfenqi.ORDERID+'&POSID='+res.data.ccbfenqi.POSID+'&PAYMENT='+res.data.ccbfenqi.PAYMENT+'&MAC='+res.data.ccbfenqi.MAC
                           +'&TYPE='+res.data.ccbfenqi.TYPE+'&TIMEOUT='+res.data.ccbfenqi.TIMEOUT;                                        

        // console.log(fenqiUrl);
      }
      // console.log(123);
      // console.log($rootScope.isIOS)
      if($rootScope.isIOS){
        console.log('如果是iOS');
        var ref = null;
        console.log(fenqiUrl);

        // ref =  cordova.InAppBrowser.open(ccbUrl, '_blank', 'location=no','toolbar=yes');
        ref =  cordova.InAppBrowser.open(fenqiUrl, '_blank', 'location=no,shownativetitlebar=yes,titlebartitlestr='+$scope.title+'分期');

        ref.addEventListener('exit', function (event) {
          $state.go('orderManage');
        });
        ref.addEventListener('loadstart', function (event) {
          // if(event.url == 'http://m.ehaier.com/www/index.html#/orderManage//'){
          if(event.url.indexOf('orderManage')!=-1){
            ref.close();
            $state.go('orderManage');
          }
        });
      }else{
//        console.log('如果不是iOS');
        $state.go('ccbPay',{url:fenqiUrl,orderSn:$scope.orderSn});
      }
    }
    
  }]);
APP.service('CcbFenqiService', ['$http', 'UrlService', 'UserService', function ($http, UrlService,UserService) {
  this.getCcbCost = function(orderSn,channel,payType){
    // var params = {
    //   orderSn:orderSn,
    //   channel:channel,
    //   payType:payType,
    //   callback:'JSON_CALLBACK',
    //   memberId:UserService.getUser().mid
    // };
    var myUrl = UrlService.getPayCenter('CCB_FENQI')+'?callback=JSON_CALLBACK'+'&orderSn='+orderSn+'&channel='+channel+'&payType='+payType+'&version=1&memberId='+UserService.getUser().mid;
    return $http.jsonp(myUrl);
    
  };
    this.payRequest = function(params, isGuangDa){
      var joinStr = '';
      if (params.joinActivity) {
        var joinStr = '&joinActivity=1';
      }

      var myUrl = UrlService.getPayCenter('CCB_FENQI_W') +'?callback=JSON_CALLBACK'+'&orderSn='+params.orderSn+'&num='+params.num+'&channel='+params.channel+'&payType='+params.payType+'&callbackUrl='+'v3/h5/pay/callback.html&memberId='+params.memberId+'&cfgMark='+params.cfgMark+joinStr;
      console.log(myUrl);
      return $http.jsonp(myUrl);
    }
    this.payRequestWithGuangDaTest = function(params){
      var joinStr = '';
      if (params.joinActivity) {
        var joinStr = '&joinActivity=1';
      }

      var myUrl = UrlService.getGuangDaTestPay() +'?callback=JSON_CALLBACK'+'&orderSn='+params.orderSn+'&num='+params.num+'&channel='+params.channel+'&payType='+params.payType+'&callbackUrl='+'v3/h5/pay/callback.html&memberId='+params.memberId+'&cfgMark='+params.cfgMark+joinStr;
      return $http.jsonp(myUrl);
    }
}]);
