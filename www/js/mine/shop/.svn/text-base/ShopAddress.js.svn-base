/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/18
 * describe：ShopAddressController 测试控制器
 **/

APP.controller('ShopAddressController', ['$scope', '$stateParams', '$rootScope', 'ShopAddressServicee', 'PopupService', '$timeout',
  function ($scope, $stateParams, $rootScope, ShopAddressServicee, PopupService, $timeout) {

    /** 变量声明 **/
    $scope.provinceId = '';
    $scope.cityId = '';
    $scope.regionId = '';
    $scope.textOne = '';
    $scope.textTwo = '';
    $scope.textThree = '';
    $scope.textFour = '';
    $scope.textALL = '';
    $scope.panGoOn = false;
    $scope.address = {
      value: $stateParams.default
    };
    $scope.detailAddress = {
      value: $stateParams.defaultDetail
    };
    $scope.updateResult = true;
    $scope.updateContent = '';
    var hrCode = $stateParams.hrCode;
    var memberType = $stateParams.memberType;
    /** 方法 **/
    //页面初始化
    $scope.init = function () {
      hrCode = $stateParams.hrCode;
      var memberType = $stateParams.memberType;
      if ($scope.panGoOn == false) {
        $scope.address = {
          value: $stateParams.default
        };
        $scope.provinceId = $stateParams.provinceId;
        $scope.cityId = $stateParams.cityId;
        $scope.regionId = $stateParams.regionId;
      }
      $scope.detailAddress = {
        value: $stateParams.defaultDetail
      };
      $scope.panGoOn = false;
    };

    //viewWillAppear
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });

    //保存
    $scope.doChange = function () {
      if (!$scope.address.value) {
        PopupService.showToast('您输入的地址不能为空');
        return;
      }
      if (!$scope.detailAddress.value) {
        PopupService.showToast('您输入的地址不能为空');
        return;
      }
      if($scope.detailAddress.value.length>50||$scope.detailAddress.value.length<2) {
        PopupService.showToast('你输入的地址字符长度应在2-50之间');
        return;
      }
      //调用修改地址接口
      console.log("调用修改地址接口");
      ShopAddressServicee.doInit($scope.address.value, $scope.detailAddress.value,$scope.provinceId,$scope.cityId,$scope.regionId,hrCode,memberType)
        .success(function (respone, status, headers, config) {
          if (respone.success == true) {
            $rootScope.$broadcast('SHOP_ADDRESS', $scope.address.value);
            $rootScope.$broadcast('SHOP_DETAILADDRESS', $scope.detailAddress.value);
            $scope.$ionicGoBack();
          }
          else {
            $scope.showResult('修改失败');
          }
        });
    };

    //选择地址后回调
    $rootScope.$on('SHOPADDRESS_LOCATION', function (event, data) {
      console.log(data);
      $scope.panGoOn = true;
      $scope.textOne = data['text-1'];
      $scope.textTwo = data['text-2'];
      $scope.textThree = data['text-3'];
      $scope.textFour = data['text-4'];
      $scope.provinceId = data['value-1'];
      $scope.cityId = data['value-2'];
      $scope.regionId = data['value-3'];
      $scope.textALL = $scope.textOne + $scope.textTwo + $scope.textThree + $scope.textFour;
      $scope.address = {
        value: $scope.textALL
      };
      console.log($scope.provinceId);
    });

    //修改结果显示
    $scope.showResult = function (result) {
      $scope.updateContent = result;
      $scope.updateResult = false;
      $timeout(function () {
        $scope.updateResult = true;
      }, 1000);
    };

  }]);
/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016-3-24
 * describe：保存店铺地址
 **/
APP.service('ShopAddressServicee', ['$http', 'UrlService', function ($http, UrlService) {
  this.doInit = function (regionName, address,provinceId,cityId,regionId,hrCode,membertype) {
    var params = {};
    if(membertype == '人人服务（服务兵创业）')
    {
      var params = {
        'provinceId': provinceId,
        'cityId': cityId,
        'regionId': regionId,
        'regionName': regionName,
        'address': address,
        'hrCode':hrCode,
        'memberType':10
      };
    }
    else
    {
      var params = {
        'provinceId': provinceId,
        'cityId': cityId,
        'regionId': regionId,
        'regionName': regionName,
        'address': address
      };
    }

    console.log('修改地址接口参数');
    console.log(params);
    return $http({
      method: 'POST',
      url: UrlService.getUrl('EDITSHOP_INIT'),
      params: params
    });
  };
}]);
