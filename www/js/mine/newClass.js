/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/16
 * describe：AboutUsController 测试控制器
 **/

APP.controller('NewClassController', ['$scope','$rootScope','$http', 'UrlService','PersonalCenterService',
  function ($scope,$rootScope,$http, UrlService,PersonalCenterService) {
    /** 变量声明 **/

    var isIOS =  window.cordova && (ionic.Platform.platform().indexOf('ios') != -1);
    if(isIOS){

      $scope.versionShow = '版本V'+ $rootScope.globalConstant.versionIOS ;
    }
    else{
      $scope.versionShow = '版本V'+ $rootScope.globalConstant.versionANDROID ;

    }

    $scope.goNewHand = function() {
      var link = UrlService.getHead() + 'mstore/sg/helpDetail.html?id=613';
      if (window.emc) {
        window.emc.presentH5View(link, '新手必读');
      } else {
        window.location.href = link;
      }
    };

    //海尔大学免登
    $scope.goLearningHaier = function(){
      PersonalCenterService.learningHaier().success(function(res){
        if(res.data != -100){
          /******注意要转码********/
          var url = encodeURI(res.data);
          // alert(url);
          if (window.cordova) {
            
             
            window.emc.presentH5View(url, "海尔大学");
          } else {
            window.location.href = url ;
          }
        }else{
          $state.go('login');
        }
      })
    };

    /** 方法 **/
    $scope.softwareUpdate = function () {
      //内部检查更新
      /* var version = CDFG_MASSAGE.GET_VERSION;    //本地版本号
       //获取服务器版本号
       AboutUsService.getVersionInfo()
       .success(function (response) {
       if (response.success) {
       var localVersion = response.data;

       if (version < localVersion) {
       var confirmPopup = $ionicPopup.confirm({
       title: '版本检测',
       template: "最新版本号：" + localVersion + "，请更新！", //从服务端获取更新的内容
       $scope: $scope,
       buttons: [
       {text: 'Cancel'},
       {
       text: '<b>更新</b>',
       type: 'button-positive',
       onTap: function () {
       if (navigator.app) {
       //填入更新地址
       navigator.app.loadUrl('http://app.qq.com/#id=detail&appid=1104761357', {openExternal: true});
       } else {
       var u = navigator.userAgent;
       if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
       window.open = cordova.InAppBrowser.open('http://app.qq.com/#id=detail&appid=1104761357', '_blank', 'location=yes');
       } else if (u.indexOf('iPhone') > -1) {
       window.open = cordova.InAppBrowser.open('http://app.qq.com/#id=detail&appid=1104761357', '_system', 'location=yes');
       } else {
       window.open = cordova.InAppBrowser.open('http://app.qq.com/#id=detail&appid=1104761357', '_system', 'location=yes');
       }
       }
       }
       }
       ]
       });
       $timeout(function () {
       confirmPopup();
       }, 4000);
       } else {
       var alertPopup = $ionicPopup.alert({
       title: '版本检测',
       template: "版本号：" + localVersion + "，是最新版，无需更新！" //从服务端获取更新的内容
       });
       $timeout(function () {
       alertPopup();
       }, 2000);
       }
       }
       });*/

      //直接跳到指定网页进行更新
     /* var u = navigator.userAgent;
      if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        if (PlatformService.getPlatform() == 'APP') {
          window.open = cordova.InAppBrowser.open('http://app.qq.com/#id=detail&appid=1104761357', '_system', 'location=yes');
        } else {
          window.open('http://app.qq.com/#id=detail&appid=1104761357');
        }
      } else if (u.indexOf('iPhone') > -1) {
        if (PlatformService.getPlatform() == 'APP') {
          window.open = cordova.InAppBrowser.open('https://itunes.apple.com/cn/app/shun-guang-wei-dian/id1035160364?mt=8', '_system', 'location=yes');
        } else {
          window.open('https://itunes.apple.com/cn/app/shun-guang-wei-dian/id1035160364?mt=8');
        }
      } else {
        if (PlatformService.getPlatform() == 'APP') {
          window.open = cordova.InAppBrowser.open('http://app.qq.com/#id=detail&appid=1104761357', '_system', 'location=yes');
        } else {
          window.open('http://app.qq.com/#id=detail&appid=1104761357');
        }
      }
      */
    }
  }]);

// APP.service('PersonalCenterService', ['$http', 'UrlService', function ($http, UrlService) {
//   //个人中心
//   this.personalInit = function () {
//     return $http.get(UrlService.getNewUrl('PERSONAL_CENTER'));
//   };

//   this.diamondInit = function () {
//     return $http.get(UrlService.getNewUrl('GET_NEW_DIAMOND'));
//   };

//   this.personalApply = function (param) {
//     var url = UrlService.getUrl('GET_APPLY_MENGZHU');
//     return $http.get(url, param);
//   };
//   //存储 memberId
//   this.userMemberId = '';
//   //海尔大学免登
//   this.learningHaier = function(){
//     return $http.get(UrlService.getNewUrl('GET_learningHaier'));
//   }
// }]);
/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/6/16
 * describe：AboutUsService
 **/
/*APP.service('AboutUsService', ['$http', 'UrlService', function ($http, UrlService) {
 //检测版本更新
 this.getVersionInfo = function () {
 return $http.get(UrlService.getUrl('CHECK_UPDATA'));
 };
 }]);*/
