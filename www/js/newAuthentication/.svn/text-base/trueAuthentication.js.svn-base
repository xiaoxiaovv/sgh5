APP.controller('trueAuthenticationControl', ['PopupService','LoginService','$rootScope','UrlService','InAppBrowserService','UserService','$ionicHistory','$localstorage','ShopApplyService','$stateParams','$timeout','$scope','$state', 'trueAuthenticationService','IMService','$http',
  function (PopupService,LoginService,$rootScope,UrlService,InAppBrowserService,UserService,$ionicHistory,$localstorage,ShopApplyService,$stateParams,$timeout,$scope, $state,trueAuthenticationService,IMService,$http) {
  /*定义变量*/
  $scope.isMake=false;          //信息提示 正确
  $scope.isMatching=false;       //信息提示 错误
  $scope.isPrompts=false;    //是否提示
  $scope.isPopup=false;     //弹出框 认证完成
  $scope.isRetry=false;     //弹出框  未完成
  $scope.isOther=false;     //弹出框  其他微店主ID
  $scope.isTrueMsg=false;     // 是否继续
  $scope.isAgain=false;      // 两分钟无任何操作
  $scope.userType=$stateParams.type;     //是否是新用户
  $scope.IDNumber=''; //身份证号
  $scope.userName=''; //姓名
  $scope.storeCode=0; //店铺码
  $scope.storeType=0; //店铺类型
  $scope.channal='APP';
 // $scope.getLocalStorageObj=function () {
 //     $scope.register_obj=$localstorage.getObject('register_obj');
 //     $scope.newAuthentication_obj=$localstorage.getObject('newAuthentication_obj');
 //  // $scope.newAuthentication_obj=JSON.parse(window.localStorage.getItem("newAuthentication_obj"));
 // //  $scope.register_obj=JSON.parse(window.localStorage.getItem("register_obj"));
 //   $scope.storeName=$scope.newAuthentication_obj.storeName;
 //   $scope.memberType=$scope.newAuthentication_obj.memberType;
 //   $scope.provinceId=$scope.newAuthentication_obj.provinceId;
 //   $scope.cityId=$scope.newAuthentication_obj.cityId;
 //   $scope.regionId=$scope.newAuthentication_obj.regionId;
 //   $scope.regionName=$scope.newAuthentication_obj.regionName;
 //   $scope.streetId=$scope.newAuthentication_obj.streetId;
 //   $scope.address=$scope.newAuthentication_obj.address;
 //   //  $scope.promotionCode=$scope.newAuthentication_obj.promotionCode;
 //   $scope.hrCode=$scope.newAuthentication_obj.hrCode;
 //   $scope.phoneNumber=$scope.register_obj.mobileNum;
 //   $scope.password=$scope.register_obj.password;
 //   $scope.captcha=$scope.register_obj.captcha;
 //   $scope.imgCaptcha=$scope.register_obj.imgCaptcha;
 // };
 // $scope.IWantHasStore=function () {
 //   $scope.newAuthentication_obj=$localstorage.getObject('newAuthentication_obj');
 ////   $scope.newAuthentication_obj=JSON.parse(window.localStorage.getItem("newAuthentication_obj"));
 //   $scope.storeName=$scope.newAuthentication_obj.storeName;
 //   $scope.memberType=$scope.newAuthentication_obj.memberType;
 //   $scope.provinceId=$scope.newAuthentication_obj.provinceId;
 //   $scope.cityId=$scope.newAuthentication_obj.cityId;
 //   $scope.regionId=$scope.newAuthentication_obj.regionId;
 //   $scope.regionName=$scope.newAuthentication_obj.regionName;
 //   $scope.streetId=$scope.newAuthentication_obj.streetId;
 //   $scope.address=$scope.newAuthentication_obj.address;
 //   //   $scope.promotionCode=$scope.newAuthentication_obj.promotionCode;
 //   $scope.phoneNumber=UserService.getUser().mobile;
 // };
  // 填写信息
  $scope.obj={
    isMyName:'',    //姓名
    isMyIdNumber:'' //身份证号
  };
  // 初始化
  $scope.init=function () {

        trueAuthenticationService.doInit()
          .success(function (response) {
            if(response.success){
              $scope.isNotAuthentication=response.data.isAuth; //认证状态
              if(response.data.identity!=null && $scope.isNotAuthentication){ // 实名认证过 特殊处理
                $scope.isOkAuthentication={
                  "color":"#999"
                };
                $scope.IDNumber= response.data.identity.identityNo.replace(/(\d{6})(\d+)(\d{2})/,function(x,y,z,p){
                  var i="";
                  while(i.length<z.length){i+="*"}
                  return y+i+p;
                });
                $scope.userName= response.data.identity.realName.replace(/.{1}/,"*");
                $scope.obj.isMyName=response.data.identity.realName;
                $scope.obj.isMyIdNumber=response.data.identity.identityNo;
                $scope.phoneNumber=response.data.identity.mobile;
              }else{ //未认证
                $scope.isOkAuthentication={
                  "color":"#000"
                };
                $scope.isNotAuthentication = false;
                $scope.phoneNumber=UserService.getUser().mobile;

                $scope.isPopup=false;
                $scope.isMake=false;          //信息提示 正确
                $scope.isMatching=false;       //信息提示 错误
                $scope.isPrompts=false;    //是否提示
              }
            }else{
              $scope.message=response.message;
              $scope.isRetry=true;
            }
          });

  };
  // 弹框中的 确定按钮
  $scope.retry=function () {
    $scope.isRetry=false;
  };
  // 我想想
  $scope.IwantETC=function () {
    $scope.isTrueMsg=false;
  };
  //无任何操作
  // $scope.isCloseNoInfo=function () {
  //   $scope.isAgain=false;
  //   $timeout.cancel($scope.timer);
  // };
  //$scope.commonFun=function () { // 注册开店
  //  trueAuthenticationService.applySubmit($scope.storeName,$scope.memberType,
  //    $scope.promotionCode,$scope.hrCode,$scope.provinceId,$scope.cityId,$scope.regionId,$scope.streetId,
  //    $scope.regionName,$scope.address,$scope.obj.isMyName,$scope.obj.isMyIdNumber,$scope.phoneNumber,
  //    $scope.password,$scope.captcha,$scope.imgCaptcha)
  //    .success(function (response) {
  //      $scope.message=response.message;
  //      if(response.success && response.data!=null){
  //        if(response.data.member!=null){
  //          UserService.setUser(response.data.member);
  //        }
  //        if($scope.isNotAuthentication){
  //          $scope.isPopup=false;
  //        }else{
  //
  //          $scope.isPopup=true;  //完成认证 弹
  //           //xneng登录
  //        if(window.xneng){//小能客服登录
  //          var xnUserId = UserService.getUser().mid.toString();
  //          window.xneng.NTalkerLogin(xnUserId,UserService.getUser().userName,'0', function (success) {
  //            console.log('客服登陆成功')
  //          }, function (error) {
  //            console.log('客服登陆失败');
  //          });
  //        }
  //        }
  //        $scope.isPrompts=false;
  //        $scope.isMatching=false;
  //        IMService.initWebSocket();
  //        // $localstorage.setObject($scope.newAuthentication_obj,null);
  //        //  $localstorage.setObject($scope.register_obj,null);
  //        window.localStorage.setItem('newAuthentication_obj','');
  //        window.localStorage.setItem('register_obj','');
  //        $timeout(function () {  //两秒后关闭
  //          $scope.isPopup=false;
  //          $state.go('shopApplySuccess');
  //        },1000);
  //
  //      }else{  //不成功
  //        console.log('没有成功');
  //        $scope.message=response.message;
  //        $scope.isRetry=true;
  //        $scope.isMatching=true;
  //        $scope.isPrompts=false;
  //        $scope.isPopup=false;
  //      }
  //    });
  //};
  //$scope.commonFunStore=function () { // 我要开店
  //  trueAuthenticationService.applySubmitStore($scope.memberId,$scope.storeName,$scope.memberType,
  //    $scope.promotionCode,$scope.hrCode,$scope.provinceId,$scope.cityId,$scope.regionId,$scope.streetId,
  //    $scope.regionName,$scope.address,$scope.obj.isMyName,$scope.obj.isMyIdNumber,$scope.phoneNumber,$scope.isNotAuthentication)
  //    .success(function (response) {
  //      $scope.message=response.message;
  //      if(response.success && response.data!=null){
  //        if($scope.isNotAuthentication){
  //          $scope.isPopup=false;
  //        }else{
  //          $scope.isPopup=true;  //完成认证 弹
  //        }
  //        $scope.isPrompts=false;
  //        $scope.isMatching=false;
  //        $timeout(function () {  //两秒后关闭
  //          $scope.isPopup=false;
  //          $state.go('shopApplySuccess');
  //        },1000);
  //      }else{  //不成功
  //        console.log('没有成功');
  //        $scope.message=response.message;
  //        $scope.isRetry=true;
  //        $scope.isMatching=true;
  //        $scope.isPrompts=false;
  //        $scope.isPopup=false;
  //      }
  //    });
  //};

  $scope.commonFunctions=function(){
              $scope.isPopup=true;  //完成认证 弹
               //xneng登录
            //if(window.xneng){//小能客服登录
            //  var xnUserId = UserService.getUser().mid.toString();
            //  window.xneng.NTalkerLogin(xnUserId,UserService.getUser().userName,'0', function (success) {
            //    console.log('客服登陆成功')
            //  }, function (error) {
            //    console.log('客服登陆失败');
            //  });
            //}
            $timeout(function () {  //两秒后关闭
                $scope.isPopup=false;
                $state.go('homePage');
              },1000);
  } ;

  //点击确定
  $scope.clickOk=function () {
    //if($scope.promotionCodeRouter){  // 只有分享推广码
    //  $scope.isTrueMsg=false;
    //  trueAuthenticationService.postUserInfoPC($scope.obj.isMyName,$scope.obj.isMyIdNumber,$scope.phoneNumber)
    //    .success(function (response) {
    //      if(response.data){  // 实名认证成功
    //        $scope.message=response.message;
    //        $rootScope.loginIsAuthentication = false;
    //        $scope.isMatching=false;
    //        $scope.isPopup=false;
    //        $scope.isRetry=false;
    //        $scope.isOther=false;
    //       // $scope.commonFun();
    //      }else{
    //        $scope.message=response.message;
    //        $scope.isRetry=true;
    //        $scope.isMatching=true;
    //        $scope.isPrompts=false;
    //        $scope.isPopup=false;
    //      }
    //    });
    //}
  //  else{
      LoginService.checkOpenStore($scope.memberId) //发请求查询 用户是否开过店
        .success(function (response, status, headers, config) {
          if (window.UmengPush) {
            window.UmengPush.getDeviceToken([], function (deviceToken) {
              $http.get(UrlService.getUrl("DEVICE_INFO") + "?device_token=" + deviceToken + "&device_type=" + deviceInfo);
            });
          }
          if (!response.data) {
            $scope.isTrueMsg=false;
            // $rootScope.isBuyer = 0; //不是微店主
            // LoginService.setRole($rootScope.isBuyer);
             // if($scope.memberId){  // 调有id的接口  kjt/bank/realNameAuth.json
             //   if(!$scope.isNotAuthentication){ // 没有实名
                  trueAuthenticationService.postUserMsg($scope.obj.isMyName,$scope.obj.isMyIdNumber,$scope.phoneNumber,$scope.channal)
                    .success(function (response) {
                      if(response.data){  // 实名认证成功
                        $scope.message=response.message;
                        $rootScope.loginIsAuthentication = false;
                        $scope.isPopup=true;  //完成认证 弹
                        $scope.isMatching=false;
                        $scope.isRetry=false;
                        $scope.isOther=false;
                        $timeout(function () {  //两秒后关闭
                          $scope.isPopup=false;
                          $state.go('homePage');
                        },1000);
                        //我要开店
                      //  $scope.commonFunStore();
                      }else{
                             $scope.message=response.message;
                             $scope.isRetry=true;
                             $scope.isMatching=true;
                             $scope.isPrompts=false;
                             $scope.isPopup=false;
                      }
                    });
               // }
                //else if($scope.userType==2 && $scope.isNotAuthentication){ //已经实名
                //  trueAuthenticationService.applySubmitStore($scope.memberId,$scope.storeName,$scope.memberType,
                //    $scope.promotionCode,$scope.hrCode,$scope.provinceId,$scope.cityId,$scope.regionId,$scope.streetId,
                //    $scope.regionName,$scope.address,$scope.obj.isMyName,$scope.obj.isMyIdNumber,$scope.phoneNumber,$scope.isNotAuthentication)
                //    .success(function (response) {
                //      $scope.message=response.message;
                //      if(response.success && response.data!=null){
                //        $scope.isPrompts=false;
                //        $rootScope.loginIsAuthentication = false;
                //        $scope.isMatching=false;
                //        $scope.isPopup=false;
                //        $state.go('shopApplySuccess');
                //      }else{  //不成功
                //        console.log('没有成功');
                //        $scope.message=response.message;
                //        $scope.isRetry=true;
                //        $scope.isMatching=true;
                //        $scope.isPrompts=false;
                //        $scope.isPopup=false;
                //      }
                //    });
                //}
            //  }
              //else{   // 调没有id的接口   kjt/bank/realNameCheckPC.json
              //  trueAuthenticationService.postUserInfoPC($scope.obj.isMyName,$scope.obj.isMyIdNumber,$scope.phoneNumber)
              //    .success(function (response) {
              //      if(response.data){  // 实名认证成功
              //        $scope.message=response.message;
              //        $rootScope.loginIsAuthentication = false;
              //        $scope.isMatching=false;
              //        $scope.isPopup=false;
              //        $scope.isRetry=false;
              //        $scope.isOther=false;
              //    //    $scope.commonFun();
              //      }else{
              //        $scope.message=response.message;
              //        $scope.isRetry=true;
              //        $scope.isMatching=true;
              //        $scope.isPrompts=false;
              //        $scope.isPopup=false;
              //      }
              //    });
              //}

          } else {
            $scope.isTrueMsg=true;
            // $rootScope.isBuyer = 1; //微店主
            // LoginService.setRole($rootScope.isBuyer);
          }
        }).error(function (res) {
        PopupService.showToast('网络连接失败！');
      });
 //  }


  };
  $scope.toRules = function(ruleId,content){
    var u = navigator.userAgent;
    if (u.indexOf('iPhone') != -1) {
      var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=' + ruleId,content);
    } else {
      $state.go('helpDetail', {'helpId': ruleId, 'content': content});
    }
  };
  // 提交
  $scope.isSubmit=function () {
    $scope.isTrueMsg=false;
    trueAuthenticationService.postUserMsg($scope.obj.isMyName,$scope.obj.isMyIdNumber,$scope.phoneNumber,$scope.channal)
      .success(function (response) {
        if(response.data){  // 实名认证成功
          $scope.message=response.message;
          $scope.isMatching=false;
          $scope.isRetry=false;
          $scope.isOther=false;
          $scope.isPopup=true;  //完成认证 弹
          $scope.isPrompts=false;
          $rootScope.loginIsAuthentication = false;
          $scope.mentionCenterNum =  $rootScope.canGetMount;
            $timeout(function () {
              $scope.isPopup=false;
              if($scope.userType==5){
                $state.go('bankCard');
              }
              else if($scope.userType == 2){
                $state.go('homePage');
              }
             else if($scope.userType==8){
                $state.go('mentionCenter',{
                  canAmount: $scope.mentionCenterNum
                });
              }else{
                $state.go('personnalCenter');
              }

              //   watch();
            },600);
        }else{
          $scope.message=response.message;
          $scope.isRetry=true;
          $scope.isMatching=true;
          $scope.isPrompts=false;
          $scope.isPopup=false;
        }
      });
  };
  // 其他店主
  $scope.retry=function () {
    $scope.isRetry=false;
  }
  // 监听
  var watch=$scope.$watch('obj',function () {
    // 两分钟无操作
    // if($scope.obj.isMyName=='' && $scope.obj.isMyIdNumber==''){
    //   $scope.timer=$timeout(function () {
    //     $scope.isAgain=true;
    //   },120000);
    // }else{
    //   $timeout.cancel($scope.timer);
    //   $scope.isAgain=false;
    // }
    if(!(/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test($scope.obj.isMyName)) || !(/(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test($scope.obj.isMyIdNumber)){
      $scope.isMake=false;
      $scope.isPrompts=false;//完全匹配 显示
      $scope.isMatching=false;
    }else{ //异步请求校验接口
      trueAuthenticationService.getUsNameOrId($scope.obj.isMyName,$scope.obj.isMyIdNumber)
        .success(function (response) {
          if(response.data){
            $scope.message=response.message;
            $scope.isPrompts=true;
            $scope.isMake=true;
            $scope.isMatching=false;
            $scope.isRetry=false;
          }else{
            $scope.message=response.message;
            $scope.isMake=false;
            $scope.isPrompts=false;
            $scope.isMatching=true;
            $scope.isRetry=false;
          }
        });
    }
  },true);
  $scope.goBack = function() {
    $ionicHistory.goBack();
  };

  if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
    $scope.paddingtopClass = {
      "margin-top": "16px"
    };
    $scope.paddingtopClasscontent = {
      "top": "60px"
    }
  }else{
    $scope.paddingtopClass = {
      "margin-top": "0px"
    };
    $scope.paddingtopClasscontent = {
      "top": "44px"
    }
  }


  $scope.$on('$ionicView.beforeEnter', function () {

    $scope.memberId=UserService.getUser().mid;
    $scope.isPopup=false;
    $scope.isRetry=false;
    $scope.isMake=false;          //信息提示 正确
    $scope.isMatching=false;       //信息提示 错误
    $scope.isPrompts=false;    //是否提示
    $scope.newAuthentication_obj=$localstorage.getObject('newAuthentication_obj');
   // //$scope.newAuthentication_obj=JSON.parse(window.localStorage.getItem("newAuthentication_obj"));
     $scope.register_obj=$localstorage.getObject('register_obj');
   //// $scope.register_obj=JSON.parse(window.localStorage.getItem("register_obj"));
   //
    $scope.promotionCodeRouter=$scope.newAuthentication_obj.isPromotionCode;
    if($scope.promotionCodeRouter){ //有推广码 取路由中的推广码
   //   $scope.promotionCode=$scope.newAuthentication_obj.isPromotionCode;
      $scope.phoneNumber=$scope.register_obj.mobileNum;
    }else{ // 没有 取缓存推广码
   //   $scope.promotionCode=$scope.newAuthentication_obj.promotionCode;
    }
    if($scope.memberId){
      if($scope.promotionCodeRouter){
        $scope.phoneNumber=$scope.register_obj.mobileNum;
   //     $scope.getLocalStorageObj();
      }else{
    //    $scope.IWantHasStore();
      }
      //  $scope.IWantHasStore();
    }else{
    //  $scope.getLocalStorageObj();
    }

    $scope.init();
    $scope.obj.isMyName='';
    $scope.obj.isMyIdNumber='';
  });
}]);
APP.service('trueAuthenticationService', ['$http', 'UrlService', function ($http, UrlService) {
  this.doInit = function () { //获取
    return $http.get(UrlService.getUrl('TRUE_REALNAMEAUTH')); //
  };
  this.getUsNameOrId = function (username,idNumber) { //获取
    var params = {
      realName: username,
      identityNo:idNumber
    };
  //  return $http.get(UrlService.getUrl('GET_NAMEORID'),params);
    return $http({
       method:'POST',
       url:UrlService.getUrl('GET_NAMEORID'),
       params:params
    });
  };
  this.postUserMsg = function (username,idNumber,phonenumber,channal) {  //发送  有memberid
    var params = {
      realName: username,
      identityNo:idNumber,
      mobile:phonenumber,
      channal:channal
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('POST_USERDATAANDID'),
      params: params
    });
  };
  // 验证没有memberid
  this.postUserInfoPC = function (username,idNumber,phonenumber) {  //发送 POST_USERDATA
    var params = {
      realName: username,
      identityNo:idNumber,
      mobile:phonenumber
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('POST_USERDATA'),
      params: params
    });
  };
  //// 确定 注册开店
  //this.applySubmit = function (storeName,memberType,promotionCode,hrCode,provinceId, cityId, regionId,streetId, regionName, address,
  //                             realName,identityNo,mobileNum,password,captcha,imgCaptcha) {
  //  // 新用户  注册- 完善信息 - 实名
  //  var params={
  //    storeName: storeName, //店铺名称
  //    memberType: memberType,
  //    promotionCode: promotionCode,
  //    hrCode: hrCode,
  //    provinceId: provinceId,
  //    cityId: cityId,
  //    regionId: regionId,
  //    streetId:streetId,
  //    regionName: regionName,
  //    address: address,
  //    realName:realName,     //真实姓名
  //    identityNo:identityNo, //身份证号
  //    mobileNum:mobileNum,
  //    password:password,
  //    captcha:captcha,
  //    imgCaptcha:imgCaptcha
  //  };
  //  return $http({
  //    method: 'POST',
  //    url: UrlService.getUrl('SHOP_SUCCESS_APPLY'),
  //    params: params
  //  });
  //};
  //// 我要开店
  //this.applySubmitStore = function (memberId, storeName,memberType,promotionCode,hrCode,provinceId, cityId, regionId,streetId, regionName, address,
  //                                  realName,identityNo,mobileNum,isNotAuthentication) {
  //  // 历史微店主  完善-实名
  //  var params={
  //    memberId: memberId,   // id
  //    storeName: storeName, //店铺名称
  //    memberType: memberType,
  //    promotionCode: promotionCode,
  //    hrCode: hrCode,
  //    provinceId: provinceId,
  //    cityId: cityId,
  //    regionId: regionId,
  //    streetId:streetId,
  //    regionName: regionName,
  //    address: address,
  //    realName:realName,     //真实姓名
  //    identityNo:identityNo , //身份证号
  //    mobileNum:mobileNum ,    //手机号
  //    isAlreadyAuth:isNotAuthentication?1:0
  //  };
  //  return $http({
  //    method: 'POST',
  //    url: UrlService.getUrl('SHOP_SUCCESS_APPLY'),
  //    params: params
  //  });
  //};
}]);
