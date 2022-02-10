/**
 * creator:feng.jiang@dhc.com.cn
 * create time:16/3/22
 * describe：SetShopCoverController  设置店铺封面控制器
 **/
APP.controller('SetShopCoverController', ['$scope', 'SetShopCoverService','UserService','$ionicPopup',
  function ($scope, SetShopCoverService,UserService,$ionicPopup) {

    /***变量声明***/
    $scope.shopCoverList = [];  //店铺封面列表
    $scope.storeId = UserService.getUser().mid;//用户storeId

    /***方法***/

    $scope.init = function () {
      $scope.getCover($scope.storeId);
    };

    $scope.getCover=function(storeId){
      SetShopCoverService.getShopCover(storeId)
        .success(function(response,status,header,config){
          $scope.shopCoverList = response.data.shopCover;
          console.log($scope.shopCoverList);
        })
    };
    //封面选择方法
    $scope.chooseCover = function (index) {
      var coverUrl = $scope.shopCoverList[index].coverUrl;
      SetShopCoverService.setShopCover(coverUrl)
        .success(function(response,status,headers,config){
          $scope.getCover($scope.storeId);
          var myPopup = $ionicPopup.show({
            template: '修改店铺模板成功'
          });
          setTimeout(function () {
            myPopup.close();
          }, 1000);
        });
    };

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.storeId = UserService.getUser().mid;
      $scope.init();
    })
  }]);


/**
 * creator:feng.jiang@dhc.com.cn
 * create time:16/4/12
 * describe：店铺封面服务
 **/
APP.service('SetShopCoverService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getShopCover = function (storeId) {
    var params = {
      storeId:storeId
    };
    return $http.get(UrlService.getUrl('GET_SHOP_COVER'), params);
  };
  this.setShopCover = function (coverUrl) {
    var params = {
      url: coverUrl
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('SET_SHOP_COVER'),
      params: params
    });
  }
}]);
