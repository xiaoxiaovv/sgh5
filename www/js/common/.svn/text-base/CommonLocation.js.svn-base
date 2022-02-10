/**
 * creater:chuanpeng.zhu@dhc.com.cn
 * create time:2016/3/16
 * describe：todo
 **/
APP.controller('CommonLocationController', ['$scope', '$rootScope', '$stateParams', 'CommonLocationService', '$state',
  'CommonAddressService', 'GoodsService', '$timeout','PopupService',
  function ($scope, $rootScope, $stateParams, CommonLocationService, $state, CommonAddressService, GoodsService, $timeout,PopupService) {

    /** 变量声明 **/
    $scope.addressTitle = $stateParams.title;
    $scope.data = $stateParams.data;
    $scope.flag = $stateParams.flag;
    $scope.defaultValue = $stateParams.defaultValue;
    $scope.level = $stateParams.level;
    var addressMessage = {};//自动定位地址信息

    /** 方法 **/
    $scope.init = function () {//第一次 undefined
      $scope.addressTitle = $stateParams.title;
      if ($stateParams.defaultValue) {
        $scope.defaultValue = JSON.parse($stateParams.defaultValue);
      } else {
        $scope.defaultValue = {};
      }
      $scope.level = $stateParams.level;
      if ($stateParams.data) {
        $scope.data = JSON.parse($stateParams.data);
      } else {
        //第一次取全国的省直辖市信息
        CommonLocationService.getLocationList(0,0).success(function (response) {
          $scope.data = response.data;
        }).error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        })
      }
    };

    var isGoing = false;
    $scope.goSelect = ionic.Utils.debounce(function () {
      var item = arguments[0];
      $scope.level = $scope.level - 1;//-1,下一个 为 －2 ，
      $scope.defaultValue['text' + $scope.level] = item.text;
      $scope.defaultValue['value' + $scope.level] = item.value;
      if ($scope.level > -4) {
        CommonLocationService.getLocationList(item.value,item.grade).success(function (response) {
          $scope.data = response.data;
          $state.go('commonLocation', {
            'defaultValue': JSON.stringify($scope.defaultValue),//将item 的信息传到下一个页面，下一个页面 往里添加子地址，再传到下一个页面 在goselect的时候请求接口
            'data': JSON.stringify($scope.data),//data 是地址信息list
            'flag': $scope.flag,
            'level': $scope.level
          });
        }).error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        });
      } else {
        if (isGoing) {
          return;
        }
        $timeout(function () {
          isGoing = false;
        }, 1500);
        $rootScope.$broadcast($scope.flag, $scope.defaultValue);
        isGoing = true;
        $scope.$ionicGoBack($scope.level);
      }
    }, 300);


    $scope.getPosition = function () {
      if ($rootScope.globalConstant.autoPosition == '定位中···') {
        return;
      }
      addressMessage = CommonAddressService.getAddressInfo();
      var detailAddress = addressMessage.regionName + '/' + addressMessage.streetName;
      GoodsService.addAddress(addressMessage.provinceId, addressMessage.cityId, addressMessage.areaId, detailAddress, addressMessage.streetId)
        .success(function () {
          var autoAddress = {
            'text-1': addressMessage.provinceName,
            'text-2': addressMessage.cityName,
            'text-3': addressMessage.regionName,
            'text-4': addressMessage.streetName,
            'value-1': addressMessage.provinceId,
            'value-2': addressMessage.cityId,
            'value-3': addressMessage.areaId,
            'value-4': addressMessage.streetId
          };
          $rootScope.$broadcast($scope.flag, autoAddress);
          $scope.$ionicGoBack($scope.level - 1);
        })
    };
    $scope.goBack = function () {
      $scope.$ionicGoBack();
    };

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });
  }]);


/**
 * creater:chuanpeng.zhu@dhc.com.cn
 * create time:2016-3-17
 * describe：地址服务，为地址选择提供数据
 **/
APP.service('CommonLocationService', ['$http', 'UrlService', '$timeout', function ($http, UrlService, $timeout) {
  this.getLocationList = function (parentId,regionType) {
    var params = {
      parentId: parentId,
      regionType:regionType
    };
    return $http.get(UrlService.getUrl('GET_REGION_BY_ID_TYPE'), params);
  };
}]);
