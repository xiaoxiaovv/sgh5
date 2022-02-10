/**
 * creater:chuanpeng.zhu@dhc.com.cn
 * create time:2016/3/16
 * describe：todo
 **/
APP.controller('CommonSelectController', ['$http', 'CommonLocationService', '$scope', '$rootScope', '$stateParams', '$state', 'CacheService','PopupService',
  function ($http ,CommonLocationService ,$scope, $rootScope, $stateParams, $state, CacheService,PopupService) {

    /** 变量声明 **/
    $scope.data = $stateParams.data;
    $scope.flag = $stateParams.flag;
    $scope.defaultValue = $stateParams.defaultValue;
    $scope.level = $stateParams.level;
    $scope.title = $stateParams.title;


    /** 方法 **/
    $scope.init = function () {
      $scope.addressMessage = CacheService.get('addressInfo');
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
        $http.get("data/region.json")
         .success(function (response) {
           $scope.data = response.data;
         })
        .error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        })
      }
    };

    $scope.goSelect = function (index,item) {
      $scope.level = $scope.level - 1;
      if (item.text != '全部' || item.text != '全国') {//判断如果是全部或者全国则返回上一级目录
        $scope.defaultValue['text' + $scope.level] = item.text;
        $scope.defaultValue['value' + $scope.level] = item.value;
      } else {
      }

      if ($scope.level > -2) {//xyz修改2级本地获取
        $http.get("data/region.json")
         .success(function (response) {
           console.log($scope.level);
           if($scope.level == -1){
             $scope.data = response.data[index].children;
           }else{
             $scope.data = $scope.data[index].children;
           }
           $state.go('commonSelect', {
               'defaultValue': JSON.stringify($scope.defaultValue),//将item 的信息传到下一个页面，下一个页面 往里添加子地址，再传到下一个页面 在goselect的时候请求接口
               'data': JSON.stringify($scope.data),//data 是地址信息list
               'flag': $scope.flag,
               'level': $scope.level
             });
         })
        .error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        });
      }else if ($scope.level > -4) {//xyz添加远端获取
        ah = $scope.level*-1;
        CommonLocationService.getLocationList(item.value,ah).success(function (response) {
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
      }
      else {
        $rootScope.$broadcast($scope.flag, $scope.defaultValue);
        $scope.$ionicGoBack($scope.level);
      }
    };

    $scope.doSelectAll = function () {
      if (!$scope.level) {
        $scope.defaultValue = {
          'text-1': '',
          'text-2': '',
          'text-3': '',
          'value-1': '',
          'value-2': '',
          'value-3': ''
        }
      }
      else if($scope.level==-1) {

      }

      $rootScope.$broadcast($scope.flag, $scope.defaultValue);
      $scope.$ionicGoBack($scope.level - 1);
    };

    $scope.doSelectDingWei = function () {
      $scope.defaultValue = {
        'text-1': $scope.addressMessage.provinceName,
        'text-2': $scope.addressMessage.cityName,
        'text-3': $scope.addressMessage.regionName,
        'text-4': $scope.addressMessage.streetName,
        'value-1': $scope.addressMessage.provinceId,
        'value-2': $scope.addressMessage.cityId,
        'value-3': $scope.addressMessage.areaId,
        'value-4': $scope.addressMessage.streetId
      };
      $rootScope.$broadcast($scope.flag, $scope.defaultValue);
      $scope.$ionicGoBack();
    };


    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    })

  }]);
