/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/3/22
 * describe：登录控制器
 **/
APP.controller('relactOKController', ['$stateParams','$timeout','relactOKService','$interval', '$rootScope', '$scope', '$localstorage', 'LoginService', '$state', 'UserService', '$ionicPopup', 'PopupService', '$ionicHistory', '$http', 'UrlService',
  function ($stateParams,$timeout,relactOKService,$interval, $rootScope, $scope, $localstorage, LoginService, $state, UserService, $ionicPopup,  PopupService, $ionicHistory, $http, UrlService) {
    /** 变量声明 **/
    
    //IOS特殊样式
    $scope.leftArrow = {};
    $scope.rightButton = {};
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) { //只有ios app 特有的样式
      $scope.leftArrow = {
        'margin-top': '36px'
      };
      $scope.rightButton = {
        'top': '36px'
      };
    }
    $scope.init=function(){
      // $scope.frontView=$rootScope.thirdFrontView;
      // if($scope.frontView.stateName.length>0){
      //   $timeout(function(){
      //     $state.go($scope.frontView.stateName,$scope.frontView.stateParams)
      //   },5000)
      // }
      
    }

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.nickname=$stateParams.nikename;
      $scope.mobile=$stateParams.mobile;
      $scope.email=$stateParams.email;
      if($scope.mobile.length>1){
        $scope.user=$scope.mobile;
      }else{
        $scope.user=$scope.email;
      }
      
      

    })


   
  }
]);

APP.service('relactOKService', ['$http', 'UrlService', '$localstorage', function ($http, UrlService, $localstorage) {

}]);
