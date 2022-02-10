/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/18
 * describe：ShopNameController 测试控制器
 **/

APP.controller('ShopNameController', ['$scope', '$stateParams', '$rootScope', 'ShopNameService', 'PopupService', '$timeout',
  function ($scope, $stateParams, $rootScope, ShopNameService, PopupService, $timeout) {

    /** 变量声明 **/
    $scope.name = {
      value: $stateParams.default
    };
    $scope.updateResult = true;
    $scope.updateContent = '';
    /** 方法 **/
      //页面初始化
    $scope.init = function () {
      $scope.name = {
        value: $stateParams.default
      };
    };

    //viewWillAppear
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });

    //保存
    $scope.doChange = function () {
      if (!$scope.name.value) {
        PopupService.showToast('您输入的店铺名称不能为空');
        return;
      }else if((/[\ud800-\udbff][\udc00-\udfff]/g).test($scope.name.value)){
        PopupService.showToast('亲，不可以使用表情喔!');
        return;
      }
      //调用校验昵称接口

      ShopNameService.checkName($scope.name.value)
        .success(function(response, status, headers, config){
        if(response.data)
        {
          ShopNameService.changeName($scope.name.value)
            .success(function (response, status, headers, config) {
              if(response.success) {
                console.log(response);
                // $rootScope.$broadcast('SHOP_NAME', $scope.name.value);
                $scope.$ionicGoBack();
              }
            });
        }
          else
        {
          PopupService.showToast("您的名称中含有敏感词,请重新输入");
        }
      });

    };

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
 * describe：ShopNameService服务
 **/
APP.service('ShopNameService', ['$http', 'UrlService', function ($http, UrlService) {
  //校验名称
  this.checkName = function (name) {
    var params = {
      'checkword': name
    };
    return $http.get(UrlService.getUrl('CHECKSHOPNAME_INIT'), params);
  };
  //修改名称
  this.changeName = function (name) {
    var params = {
      'wdName': name
    };
    return $http.get(UrlService.getUrl('CHANGESHOPNAME_INIT'), params);
  };
}]);
