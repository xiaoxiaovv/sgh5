/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/16
 * describe：Mine 测试控制器
 **/
APP.controller('SetupController', ['$ionicPopup', 'AccountMessageService', '$rootScope','$scope', 'PlatformService', 'LoginService', 'UserService', '$state', '$localstorage','IMService',
  function ($ionicPopup, AccountMessageService, $rootScope, $scope, PlatformService, LoginService, UserService, $state, $localstorage,IMService) {
    /** 方法 **/
    $scope.goToScore = function () {
      var u = navigator.userAgent;
      if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        if (PlatformService.getPlatform() == 'APP') {
          cordova.InAppBrowser.open('http://app.qq.com/#id=detail&appid=1104761357', '_system', 'location=yes');
        } else {
          window.open('http://app.qq.com/#id=detail&appid=1104761357');
        }
      } else if (u.indexOf('iPhone') > -1) {
        if (PlatformService.getPlatform() == 'APP') {
          cordova.InAppBrowser.open('https://itunes.apple.com/cn/app/shun-guang-wei-dian/id1035160364?mt=8', '_system', 'location=yes');
        } else {
          window.open('https://itunes.apple.com/cn/app/shun-guang-wei-dian/id1035160364?mt=8');
        }
      } else {
        if (PlatformService.getPlatform() == 'APP') {
          cordova.InAppBrowser.open('http://app.qq.com/#id=detail&appid=1104761357', '_system', 'location=yes');
        } else {
          window.open('http://app.qq.com/#id=detail&appid=1104761357');
        }
      }
    };


   $scope.switchOn = {
       "background" : "#4fa7ec",
       "border-color" : "#4fa7ec"
   }
    $scope.switchOff = {
       "background" : "#fff",
       "border-color" : "#e6e6e6"
   }
   $scope.borderBottom = {
    //  "border-bottom":"1px solid #eee",
     "margin-bottom":"3px"
   }

  $scope.switchState = function(index){
    $scope.settingsList[index].checked = !$scope.settingsList[index].checked;
    console.log(index+'-----'+$scope.settingsList[index].checked)
    var arr = JSON.parse(localStorage.getItem('setSwitch'));
    for(var i = arr.length-1;i>=0;i--){
      if($scope.memberId == arr[i].id){
        arr[i].list[index].checked = $scope.settingsList[index].checked;
        localStorage.setItem('setSwitch',JSON.stringify(arr));

      }
    }
    switch (index){
      case 0:
        $rootScope.isCommission = $scope.settingsList[index].checked;

        break;
      case 1:
        $rootScope.cashSwitch = $scope.settingsList[index].checked;
        break;
      case 2:
        $rootScope.goldRainSwitch = $scope.settingsList[index].checked;

        break;
    }
  };

    $scope.init = function(){

      $scope.memberId = UserService.getUser().mid;
      console.log('memberId是：'+$scope.memberId);
      var setSwitch = JSON.parse(localStorage.getItem('setSwitch'));
      var isExist = false;
        for(var i=setSwitch.length-1;i>=0;i--){
          if(setSwitch[i].id==$scope.memberId){
            $scope.settingsList = setSwitch[i].list;
            isExist = true;

          }
        }



        // var commissionIs = localStorage.getItem('Commission');
        // var cashSwitch = localStorage.getItem('cashSwitch');
        // var goldRainSwitch = localStorage.getItem('goldRainSwitch');
        // if(commissionIs == 'false'){
        //   $scope.settingsList = [
        //       { text: "显示佣金", checked: false }
        //     ];
        // }else{
        //   $scope.settingsList = [
        //       { text: "显示佣金", checked: true }
        //     ];
        // }
        // if(cashSwitch == 'false'){
        //   $scope.cashItem =
        //       { text: "提现通知", checked: false }
        //     ;
        // }else{
        //   $scope.cashItem =
        //       { text: "提现通知", checked: true }
        //     ;
        // }
        // if(goldRainSwitch == 'false'){
        //   $scope.goldRainItem =
        //       { text: "金币雨", checked: false }
        //     ;
        // }else{
        //   $scope.goldRainItem =
        //       { text: "金币雨", checked: true }
        //     ;
        // }
    };

    //注销登录
    $scope.goGuidePage = function () {
      $state.go('guidePage');
    };
    $scope.user = UserService.getUser();
    console.log($scope.user);
    $scope.accountToken = $scope.user.token;
    $scope.accountSessionId = $scope.user.sessionValue;
    $scope.accountHeaderKey = '2e8352919709910328ec6b6b682a74f3';
    $scope.unload = function () {
      IMService.destroyWebSocket();
      if ($scope.user.sessionValue == undefined) {
        UserService.clearUser();
        $scope.goGuidePage();
        LoginService.setRole(undefined);
        window.localStorage.setItem('isLogin', UserService.isUserLogin());
        $localstorage.set('storeId','');
      }
      else {
        AccountMessageService.unloadAccount($scope.accountToken, $scope.accountSessionId, $scope.accountHeaderKey)
          .success(function (response, status, headers, config) {
            console.log(response);
            if (response.success) {
              UserService.clearUser();
              LoginService.setRole(undefined);
              $scope.goGuidePage();
              // const Bearer = `Bearer${response.data}`;
              var Bearer = 'Bearer'+response.data;
              window.localStorage.setItem('sg_login_token_secret', Bearer);
              window.localStorage.setItem('isLogin', UserService.isUserLogin());
              $localstorage.set('storeId','');
            }
          });
      }
    };

    $scope.goToDelete = function () {
      var confirmPopup = $ionicPopup.confirm({
        template: '确认退出登录?',
        cancelText: '取消',
        okText: '确定'
      });
      confirmPopup.then(function(res) {
      if(res) {
        $scope.unload();
      } else {
        console.log('You are not sure');
      }
    });
    };

    $scope.$on('$ionicView.enter', function () {
        $scope.init();
    })

  }]);
