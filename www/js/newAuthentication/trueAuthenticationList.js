/**
 * Created by lenovo on 2018-1-11.
 */

APP.controller('trueAuthenticationListControl', ['trueAuthenticationService','PopupService','LoginService','$rootScope','UrlService','InAppBrowserService','UserService','$ionicHistory','$localstorage','ShopApplyService','$stateParams','$timeout','$scope','$state', 'trueAuthenticationListService','IMService','$http',
  function (trueAuthenticationService,PopupService,LoginService,$rootScope,UrlService,InAppBrowserService,UserService,$ionicHistory,$localstorage,ShopApplyService,$stateParams,$timeout,$scope, $state,trueAuthenticationListService,IMService,$http) {
    /*定义变量*/
    $scope.isTrueAuthentication = false; //身份证认证
    $scope.isStaff = false; //员工认证

    $scope.init = function (){
      trueAuthenticationService.doInit() //身份认证
        .success(function(res){
           if(res.success){
              console.log(res)
              if(res.data.identity!=null){ //已认证
                $scope.isTrueAuthentication = true;
              }else{
                $scope.isTrueAuthentication = false;
              }
              if(res.data.empInfo!=null){
                $scope.isStaff = true;
              }else{
                $scope.isStaff = false;
              }

           }else{
             PopupService.showToast(res.message);
           }
        })
    };


    $scope.toRules = function(ruleId,content){
      var u = navigator.userAgent;
      if (u.indexOf('iPhone') != -1) {
        var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=' + ruleId,content);
      } else {
        $state.go('helpDetail', {'helpId': ruleId, 'content': content});
      }
    };
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
      $scope.init();

    });
  }]);
APP.service('trueAuthenticationListService', ['$http', 'UrlService', function ($http, UrlService) {
  //this.doInit = function () { //获取
  //  return $http.get(UrlService.getUrl('TRUE_REALNAMEAUTH')); //
  //};
  //this.getUsNameOrId = function (username,idNumber) { //获取
  //  var params = {
  //    realName: username,
  //    identityNo:idNumber
  //  };
  //  return $http.get(UrlService.getUrl('GET_NAMEORID'),params); //
  //};
  //this.postUserMsg = function (username,idNumber,phonenumber,channal) {  //发送  有memberid
  //  var params = {
  //    realName: username,
  //    identityNo:idNumber,
  //    mobile:phonenumber,
  //    channal:channal
  //  };
  //  return $http({
  //    method: 'POST',
  //    url: UrlService.getUrl('POST_USERDATAANDID'),
  //    params: params
  //  });
  //};
  //// 验证没有memberid
  //this.postUserInfoPC = function (username,idNumber,phonenumber) {  //发送 POST_USERDATA
  //  var params = {
  //    realName: username,
  //    identityNo:idNumber,
  //    mobile:phonenumber
  //  };
  //  return $http({
  //    method: 'POST',
  //    url: UrlService.getUrl('POST_USERDATA'),
  //    params: params
  //  });
  //};
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
