/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/4/12
 * describe：买家中心Controller
 **/

APP.controller('BuyerCenterController', ['$scope', 'AccountMessageService', '$state', 'UserService', 'LoginService',
  'PopupService','$stateParams','RegisterService','$rootScope',
  function ($scope, AccountMessageService, $state, UserService, LoginService,PopupService,$stateParams,RegisterService,$rootScope) {
    /*变量*/
    $scope.isBuyer = LoginService.getRole();//判断用户角色信息；0为买家；1为卖家
    $scope.shareStoreId = $stateParams.shareStoreId;
    //加载数据
    $scope.init = function (chooseOrder) {
      //个人头像和用户名
      var tempMassage = UserService.getUser();
      if (!tempMassage.avatarImageFileId) {
        $scope.avatarImageFileId = $rootScope.imgBaseURL+"img/ic_person.png";
      } else {
        $scope.avatarImageFileId = tempMassage.avatarImageFileId;
      }
      $scope.mid = tempMassage.mid;
      $scope.sessionId = tempMassage.sessionValue;
      $scope.token = tempMassage.token;
      $scope.header = '2e8352919709910328ec6b6b682a74f3';
    };

    //我要开店
    $scope.applyShop = function(){
      if($scope.isBuyer==0){
        RegisterService.wdApply().success(function(response){
          if(response.success){
            if(response.data){//绑定过手机
              $state.go('shopApply');
            }else{//没绑定过手机
              $state.go('registerForStore');
            }

          }else{//接口异常
            PopupService.showToast('服务端错误');
          }

        }).error(function(){


          alert('网络错误');
        });


        $state.go('shopApply');
      }else{
        //PopupService.showToast('您已经开店啦！');
        if($scope.shareStoreId){
          $state.go('myStore',{storeId:$scope.mid,shareStoreId:$scope.shareStoreId});
        }else{
          $state.go('myStore',{storeId:$scope.mid});
        }
      }
    };
    //退出登录
    $scope.logOut = function () {
      if ($scope.sessionId == undefined) {
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
    //页面返回
    $scope.goBack = function () {
      $state.go('homePage');
    };
    $scope.$on('$ionicView.beforeEnter', function () {
      /*************add by wangshuang   判断用户角色  STARTA******************/
      $scope.isBuyer = LoginService.getRole();//判断用户角色信息；0为买家；1为卖家
      /*************add by wangshuang   判断用户角色  END******************/
      $scope.init(0);
    });
  }]);
