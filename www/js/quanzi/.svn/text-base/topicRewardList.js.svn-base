/**
 * Created by 峂峂 on 2016/3/16.
 */

APP.controller('topicRewardListController', ['$ionicHistory','$http', '$scope', 'topicRewardListService', '$stateParams',
  '$state', '$cookieStore', '$ionicPopup', '$timeout',
  'LoginService', '$rootScope','$ionicModal',
  '$localstorage', 'PopupService','NoteDetailsService','$ionicScrollDelegate',
  function ($ionicHistory,$http ,$scope, topicRewardListService, $stateParams, $state,
            $cookieStore, $ionicPopup, $timeout, LoginService, $rootScope, $ionicModal,
            $localstorage, PopupService,NoteDetailsService,$ionicScrollDelegate) {

    $scope.tipId='';
    $scope.page=1;
    $scope.getList=function(){
      var tipId={
        tipId:parseInt($scope.tipId),
        pageIndex:1,
        pageSize:5,
        sort:1,
        type:1
      }
      topicRewardListService.getList(tipId)
      .success(function(response){
        $scope.shantotal=response.data;
        $scope.shanList=response.data.ucTips;
        if(response.data.total>$scope.shanList.length){
          $scope.hasmore=true;
        }else{
          $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hasmore = false;
            // PopupService.showToast('没有更多商品了');
        }
        console.log(response);
      })


    }

    $scope.loadMore=function(){
      console.log('2233');
      $scope.page=$scope.page+1;
      var tipId={
        tipId: parseInt($scope.tipId),
        pageIndex:$scope.page,
        pageSize:5,
        sort:1,
        type:1
      }
      topicRewardListService.getList(tipId)
      .success(function(response){
        $scope.shanList=$scope.shanList.concat(response.data.ucTips);
        $scope.$broadcast('scroll.infiniteScrollComplete');
        if(response.data.total>$scope.shanList.length){
          $scope.hasmore=true;
          console.log(5566);
        }else{
          $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hasmore = false;
            PopupService.showToast('没有更多了');
        }
        console.log(response);
      })

    }
    $scope.gotoothers = function (item) {
      $state.go('personalHomepageHe', {othersId: item.userId});
    }
    //关注圈主
    $scope.follow = function (item,index) {
      console.log(item);
        if (item.isFollow) {
            var isFollow = {
                id: item.userId,
                isFollow: 0
            };
            NoteDetailsService.followNote(isFollow)
                .success(function (response) {
                    if (response.success == true) {
                      console.log(response);
                      for(var i=0;i<$scope.shanList.length;i++){
                        if($scope.shanList[i].userId==$scope.shanList[index].userId){
                          $scope.shanList[i].isFollow=false;
                        }
                      }
                    }else{
                      PopupService.showToast(response.message);
                    }
                });
        } else{
            var isFollow = {
                id: item.userId,
                isFollow: 1
            };
            NoteDetailsService.followNote(isFollow)
                .success(function (response) {
                    if (response.success == true) {
                      for(var i=0;i<$scope.shanList.length;i++){
                        if($scope.shanList[i].userId==$scope.shanList[index].userId){
                          $scope.shanList[i].isFollow=true;
                        }
                      }
                    }else{
                      PopupService.showToast(response.message);
                    }
                });
        }
    };
    $scope.scrollToTop = function () {
      $ionicScrollDelegate.$getByHandle('rewardHandle').scrollTop(true);
      $scope.showTopBtn = false;
    };
    //获取滑动高度
    $scope.getScrollHeight = function () {
      console.log('进方法了么');
      $scope.scrollHeight = Math.abs(document.getElementById("bbb").getBoundingClientRect().top);//获取滚动高度
      console.log(document.getElementById("bbb"));
      if ($scope.scrollHeight > $scope.phoneHeight * 2) {
        $scope.showTopBtn = true;
      } else {
        $scope.showTopBtn = false;
      }
      console.log('$scope.scrollHeight', $scope.scrollHeight);
      console.log('$scope.phoneHeight', $scope.phoneHeight);
      console.log('$scope.showTopBtn', $scope.showTopBtn);
    };
    $scope.init=function(){
      $scope.phoneHeight = document.documentElement.clientHeight / 2;//获取手机屏幕高度
      $scope.hasmore=false;
      $scope.page=1;
      $scope.tipId=$stateParams.tipId;
      $scope.getList();
    }
    $scope.goBack = function () {
      $scope.$ionicGoBack();
    };
    $scope.$on('$ionicView.beforeEnter', function (e, v) {
     $scope.init();
    });
  }
])
APP.service('topicRewardListService', ['$http', 'UrlService', function ($http, UrlService) {
  //获得打赏列表
  this.getList = function (topicId) {
    // return $http({
    //   method: 'get',
    //   url: UrlService.getUrl('CIRCLE_SHAN_LIST'),
    //   data: topicId
    // });
    return $http.get(UrlService.getUrl('CIRCLE_SHAN_LIST'),topicId);
  };
  

}]);