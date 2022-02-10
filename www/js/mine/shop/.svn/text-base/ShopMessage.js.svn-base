/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/16
 * describe：ShopMessageController 测试控制器
 **/

APP.controller('ShopMessageController', ['$scope', 'ShopMessageService', '$rootScope','PopupService',
  function ($scope, ShopMessageService, $rootScope,PopupService) {
    /** 变量声明 **/
    $scope.shopMessageID = '';
    $scope.shopMessageName = '';
    $scope.shopMessageAddress = '';
    $scope.shopMessageDetailAddress = '';
    $scope.shopMessageLegend = '';
    $scope.provinceId = '';
    $scope.cityId = '';
    $scope.regionId = '';
    $scope.isHaierCloud = '';
    $scope.hrCode = '';
    /** 方法 **/
      //页面初始化
    $scope.init = function () {
      $scope.isHaierCloud = false;
      ShopMessageService.getShopMessage()
        .success(function (response, status, headers, config) {
          console.log(response);
          if (response.success) {
            $scope.shopMessageID = response.data.storeInfo.memberId;
            $scope.shopMessageName = response.data.storeInfo.storeName;
            $scope.shopMessageAddress = response.data.storeInfo.regionName;
            $scope.shopMessageDetailAddress = response.data.storeInfo.address;
            $scope.shopMessageLegend = response.data.storeInfo.memberName;
            $scope.provinceId = response.data.storeInfo.provinceId;
            $scope.cityId = response.data.storeInfo.cityId;
            $scope.regionId = response.data.storeInfo.regionId;
            $scope.hrCode = response.data.storeInfo.hrCode;
            if($scope.shopMessageLegend=='海尔云店')
            {
              $scope.isHaierCloud =true;
            }
          }
          else
          {
            PopupService.showToast(response.message);
          }
        });
    };

    //viewWillAppear
    $scope.$on('$ionicView.beforeEnter', function () {

      $scope.init();
    });

    //修改名字回调
    $rootScope.$on('SHOP_NAME', function (event, data) {
      $scope.shopMessageName = data;
    });

    //修改联盟回调
    $rootScope.$on('SHOP_LEGEND', function (event, data) {
      $scope.shopMessageLegend = data;
      if($scope.shopMessageLegend == '海尔云店')
      {
        $scope.isHaierCloud = false;
      }
    });

    //修改地址回调
    $rootScope.$on('SHOP_ADDRESS', function (event, data) {
      $scope.shopMessageAddress = data;
    });

    //修改详细地址回调
    $rootScope.$on('SHOP_DETAILADDRESS', function (event, data) {
      $scope.shopMessageDetailAddress = data;
    });

  }]);
/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016-3-17
 * describe：店铺信息网络数据加载
 **/
APP.service('ShopMessageService', ['$http', 'UrlService', function ($http, UrlService) {
  //获取店铺信息
  this.getShopMessage = function () {
    return $http.get(UrlService.getUrl('SHOPINFO_INIT'));
  };
}]);

