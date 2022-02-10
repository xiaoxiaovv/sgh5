/**
 * creator:feng.jiang@dhc.com.cn
 * create time:16/3/22
 * describe：ShopRenovateController  店铺装修控制器
 **/

APP.controller('ShopRenovateController', ['$scope', 'SetShopCoverService', 'UserService',
  function ($scope, SetShopCoverService, UserService) {

    /***变量声明***/
    $scope.shopCoverUrl = '';  //当前店铺封面
    $scope.storeId = UserService.getUser().mid;//用户storeId

    /***方法***/
    $scope.init = function () {
      SetShopCoverService.getShopCover($scope.storeId)
        .success(function (response) {
          for (var i = 0, len = response.data.shopCover.length; i < len; i++) {
            if (response.data.shopCover[i].selected == true)
              $scope.shopCoverUrl = response.data.shopCover[i].coverUrl;
          }
        })
    };
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.storeId = UserService.getUser().mid;
      $scope.init();
    })
  }]);
