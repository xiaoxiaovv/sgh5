/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/4/12
 * describe：直接购买Controller
 **/

APP.controller('DirectPurchaseController', ['$scope', 'UserService', 'AccountMessageService',
  '$state','LoginService','RegisterService','PopupService','$ionicPopup',
  function ($scope, UserService, AccountMessageService, $state,LoginService,RegisterService,PopupService,$ionicPopup) {

    /** 变量声明 **/
      //IOS特殊样式
    $scope.topPlus = {};
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
      $scope.topPlus = {'padding-top': '42px'};
    }
    /** 方法 **/
    $scope.init = function () {
      var tempMassage = UserService.getUser();
      $scope.sessionId = tempMassage.sessionValue;
      $scope.token = tempMassage.token;
      $scope.header = '2e8352919709910328ec6b6b682a74f3';
    };
    //注销
    $scope.userLogOut = function () {
      if ( !$scope.sessionId ) {
        UserService.clearUser();
        LoginService.setRole(undefined);
        $state.go('guidePage');
      } else {
        AccountMessageService.unloadAccount($scope.token, $scope.sessionId, $scope.header)
          .success(function (response, status, headers, config) {
            console.log(response);
            if (response.success) {
              UserService.clearUser();
              LoginService.setRole(undefined);
              $state.go('guidePage');
              // const Bearer = `Bearer${response.data}`;
              var Bearer = 'Bearer'+response.data;
              window.localStorage.setItem('sg_login_token_secret', Bearer);
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
        $scope.userLogOut();
      } else {
        console.log('You are not sure');
      }
    });
    };

    $scope.goShopApply = function(){

      RegisterService.wdApply().success(function(response){
       if(response.success){
         if(response.data){//绑定过手机
           $state.go('newAuthenticationHome');
         }else{//没绑定过手机
           $state.go('registerForStore');
         }

       }else{//接口异常
         PopupService.showToast('服务端错误');
       }



      }).error(function(){


        alert('网络错误');
      });


    };
    $scope.goSelection = function(){

      $state.go('homePage');
    };
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });
  }]);
