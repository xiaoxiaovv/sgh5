/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/18
 * describe：LegendController 测试控制器
 **/

APP.controller('ShopLegendController', ['$scope', '$stateParams','ShopLegendService','$rootScope','PopupService',
  function ($scope, $stateParams,ShopLegendService,$rootScope,PopupService) {

    /** 变量声明 **/
    $scope.selectText = $stateParams.default;//默认联盟分类
    var provinceId = $stateParams.provinceId;
    var cityId = $stateParams.cityId;
    var regionId = $stateParams.regionId;
    $scope.hrCode = {
      value:$stateParams.hrCode
    };
    $scope.hrCodeOld = $stateParams.hrCode;
    $scope.goToLegend = false;//判断是否进入到联盟分类
    $scope.isHaierCloud = false;
    /** 方法 **/
      //页面初始化
    $scope.init = function () {
      $scope.hrCode = {
        value:$stateParams.hrCode
      };
      $scope.hrCodeOld = $stateParams.hrCode;
      $scope.showAlert = false;
      $scope.showAlertCheck = false;
      if($scope.selectText !='海尔云店') {
        $scope.isHaierCloud = false;
      }
    };
    //保存修改
    $scope.doChange = function () {
      $scope.showAlert = false;
      $scope.showAlertCheck = false;
      var pattern = /^(?!HR|hr|Hr|hr).*$/;
      if($scope.selectText=='人人服务（服务兵创业）')
      {
        $scope.valueUnion=10;
        if(pattern.exec($scope.hrCode.value)||$scope.hrCode.value.length>20||$scope.hrCode.value.length<8)
        {
          $scope.showAlert = true;
          return;
        }
      }
      if($scope.hrCodeOld == $scope.hrCode.value)
      {
        ShopLegendService.doInit($scope.valueUnion,provinceId,cityId,regionId,$scope.hrCode.value)
          .success(function (response, status, headers, config) {
            console.log(response);
            if(response.success == true)
            {
              $rootScope.$broadcast('SHOP_LEGEND', $scope.selectText);
              $scope.showAlert = false;
              $scope.$ionicGoBack();
            }
            else
            {
              if(response.message){
                PopupService.showToast(response.message);
              }
              else
              {
                PopupService.showToast("未知异常");
              }
            }
          });
      }
      else
      {
        ShopLegendService.check($scope.hrCode.value).success(function(response, status, headers, config){
          console.log(response);
          if(response)
          {
            ShopLegendService.doInit($scope.valueUnion,provinceId,cityId,regionId,$scope.hrCode.value)
              .success(function (response, status, headers, config) {
                console.log(response);
                if(response.success == true)
                {
                  $rootScope.$broadcast('SHOP_LEGEND', $scope.selectText);
                  $scope.showAlert = false;
                  $scope.$ionicGoBack();
                }
                else
                {
                  if(response.message){
                    PopupService.showToast(response.message);
                  }
                  else
                  {
                    PopupService.showToast("未知异常");
                  }
                }
              });
          }
          else
          {
            $scope.showAlertCheck = true;
          }
        });
      }
    };

    //添加联盟分类
    $rootScope.$on('SHOP_SELECT_UNION', function (event, data) {
      $scope.goToLegend = true;
      $scope.textUnion = data['text'];
      $scope.valueUnion = data['value'];
      $scope.selectText = $scope.textUnion;
      if($scope.selectText=='海尔云店') {
        $scope.isHaierCloud = true;
      }
    });

    $scope.$on('$ionicView.beforeEnter', function (e,v) {
      console.log(v.direction);
      if(v.direction=='forward')
      {
        $scope.selectText = $stateParams.default;
      }
      $scope.init();
    });

  }]);
/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016-3-24
 * describe：保存联盟选项设置
 **/
APP.service('ShopLegendService', ['$http', 'UrlService', function ($http, UrlService) {
  this.check = function (hrCode){
    var params = {
      'hrCode': hrCode
    };
    return $http.get(UrlService.getUrl('CHECKHRCODE_INIT'), params);
  };
  this.doInit = function (memberType,p,c,r,hrCode) {
    var params = {
      'memberType': memberType,
      'provinceId': p,
      'cityId': c,
      'regionId': r,
      'hrCode':hrCode
    };
    console.log('修改店铺信息参数');
    console.log(params);
    return $http({
      method: 'POST',
      url: UrlService.getUrl('EDITSHOP_INIT'),
      params: params
    });
  };
}]);
