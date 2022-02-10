/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/4/14
 * describe：联盟分类Controller
 **/

APP.controller('CommonUnionController', ['$scope', '$rootScope', '$stateParams', 'CommonUnionService','$timeout','$ionicLoading',
  function ($scope, $rootScope, $stateParams, CommonUnionService,$timeout,$ionicLoading) {

    /** 变量声明 **/
    $scope.dataUnion = [];
    $scope.flag = $stateParams.flag;
    $scope.defaultValue = $stateParams.defaultValue;
    $scope.selectSigal = $stateParams.data;

    /** 方法 **/
    $scope.init = function () {
      if ($stateParams.defaultValue) {
        $scope.defaultValue = JSON.parse($stateParams.defaultValue);
      } else {
        $scope.defaultValue = {};
      }
      $scope.dataUnion = [];
      CommonUnionService.getUnionList()
        .success(function (response) {
          var index = undefined;
          for (var i = 0, len = response.data.length; i < len; i++) {
            if($scope.selectSigal==response.data[i].dictionary_display_value)
            {
              index = i;
            }
            $scope.dataUnion.push({
              key: response.data[i].dictionary_db_value, //类型ID
              text: response.data[i].dictionary_display_value, //联盟名称
              imgSelect: $rootScope.imgBaseURL+'img/ic_select.png', //被选中图片
              imgUnselect: $rootScope.imgBaseURL+'img/ic_check.png', //未被选中图片
              isSelect: false //是否被选中
            })
          }
          if(index){
            $scope.dataUnion[index].isSelect = true;
          }

        });
    };

    $scope.goSelect = function (item,index) {

      $scope.defaultValue['text'] = item.text;
      $scope.defaultValue['value'] = item.key;
      angular.forEach($scope.dataUnion, function(data){
        data.isSelect = false;
      });
      //选择
      $scope.dataUnion[index].isSelect = true;
      $rootScope.$broadcast($scope.flag, $scope.defaultValue);
      $scope.$ionicGoBack();

    };

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    })

  }]);


/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/4/14
 * describe：联盟分类Service
 **/
APP.service('CommonUnionService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getUnionList = function () {
    return $http.get(UrlService.getUrl('COMMON_UNION'));
  };
}]);
