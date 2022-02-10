/********************************

 creator:dhc-jiangfeng
 create time:2016/4/11
 describe：MicroSchoolDetailController   微学堂详情控制器

 ********************************/
APP.controller('MicroSchoolDetailController', ['$scope', '$stateParams', '$sce', 'MicroSchoolService',
  function ($scope, $stateParams, $sce, MicroSchoolService) {
    /** 变量声明 **/
    $scope.childId = $stateParams.childId;
    $scope.id = $stateParams.id;
    $scope.title = $stateParams.title;
    $scope.trustSrc = function (src) {
      return $sce.trustAsResourceUrl(src);
    };
    /** 方法 **/
    $scope.init = function () {
      $scope.loadData($scope.childId, $scope.id);
    };

    $scope.loadData=function(childId,id){
      MicroSchoolService.getMicroSchoolDetail(childId,id)
        .success(function(resonse,status,headers,config){
          console.log(resonse);
          //$scope.htmlContent = response.context;
        })
    };
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.title = $stateParams.title;
      $scope.childId = $stateParams.childId;
      $scope.id = $stateParams.id;
      $scope.init();
    })
  }]);
