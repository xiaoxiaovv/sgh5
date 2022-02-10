
APP.controller('taskShareController', ['$scope', '$state', 'ShareService','$rootScope','PopupService','$ionicHistory', 'UserService',
function($scope, $state, ShareService,$rootScope,PopupService,$ionicHistory,UserService) {

    $scope.colorStyle1 = {
      "color": "#030303"
    }
    $scope.colorStyle2 = {
      "color": "blue"
    }

  //任务排序
  function sortMission(missionArr){
    var tempArr = [];//临时存放士兵突击意外的任务
    var tempArrPlus = [];//存放 士兵突击
    for(var length=missionArr.length,i=length-1;i>=0;i--){
      if(missionArr[i].taskType==5){
        tempArrPlus.push(missionArr[i]);
      }else if(missionArr[i].isFinished){
        tempArr.push(missionArr[i]);
      }else{
        tempArr.unshift(missionArr[i]);
      }
    }

    return tempArrPlus.concat(tempArr);
  }

  $scope.share = '';
  var a = 0;
  var b = 100;
  $scope.loadData = function(){
    ShareService.myShare(a, b)
      .success(function(response) {
        console.log(response.data.rows);
        $scope.share = sortMission(response.data.rows);
        console.log($scope.share);
      }).error(function() {
        console.log("error");
      })
  }
  $scope.goBack = function(){
    $scope.$ionicGoBack();
  }
  $scope.goShare = function(flag, id, taskType) {
        console.log(id + "......" + taskType);
        if (taskType == 7) {
          $state.go('competition', {
            taskDestId:'',
            taskType:taskType,
            memberId:$scope.xyzMemberId
          });
        } else {
        $state.go('missionDetail', {
          taskId: id
        });
      }
    }

  $scope.shake = function() {
    alert('lover');
  }

  $scope.$on('$ionicView.enter', function(e,v){
    if(v.direction == 'back'){
      console.log('back-------------');
      if($rootScope.shareSucBack){//如果是分享任务成功后返回回来的
        $rootScope.shareSucBack = false;
        $rootScope.freshMission = true;
        $rootScope.missionLists = function(){
          $scope.loadData();
        };
      }else{//没分享成功返回回来的
        $scope.loadData();
      }

    }else{
      $scope.loadData();
    }

  });

  $scope.$on('$ionicView.beforeEnter', function(){
      $scope.xyzMemberId = UserService.getUser().mid;
  });

  }
]);


APP.service('ShareService', ['$http', 'UrlService', function($http, UrlService) {
  //获取任务信息
  this.myShare = function(startIndex, pageSize) {
    var params = {
      'startIndex': startIndex,
      'pageSize': pageSize
    };
    return $http.get(UrlService.getUrl('SHAER_TASK'), params);
  };

  //获取任务信息
  this.myHistoryShare = function() {
    return $http.get(UrlService.getUrl('SHAER_HISTORY_TASK'));
  };

  
}]);
