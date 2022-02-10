
APP.controller('userMessageController', ['$state','$stateParams','$ionicHistory','$ionicScrollDelegate','$scope', 'userMessageService','$rootScope',
  function ($state,$stateParams,$ionicHistory,$ionicScrollDelegate,$scope, userMessageService,$rootScope) {

    $scope.userId=$stateParams.memberId;
    $scope.name=$stateParams.name;
    $scope.mobile=$stateParams.mobile;
    $scope.isTeamNum=$stateParams.isTeamNum;
    $scope.page=1; //默认 页数
    $scope.pageSize=20;//默认条数 20
    $scope.sortsIndex = 2; //排序 图
    $scope.arrowState = [$rootScope.imgBaseURL+'img/sortT.png',$rootScope.imgBaseURL+'img/sortF.png',$rootScope.imgBaseURL+'img/sort2.png'];

    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
      $scope.paddingtopClass = {
        "padding-top": "20px"
      };
      $scope.paddingtopClasscontent = {
        "top": "246px"
      }
      $scope.teamInfos={
        "top": "46%"
      };
    }else{
      $scope.paddingtopClass = {
        "padding-top": "0"
      };
      $scope.paddingtopClasscontent = {
        "top": "220px"
      }
      $scope.teamInfos={
        "top": "36%"
      };
    }


    $scope.init = function(){
      userMessageService.getConnectionMsg($scope.mobile,$scope.page,$scope.pageSize)
        .success(function(response){
          if(response.success){
            $scope.productList = response.data;
            $scope.userList = response.data.rows;
            $scope.hasmore = $scope.userList.length < response.data.total
          }
        });
    };
    $scope.priceRange=function(price){
      var base=1000;
      var num=Math.floor(price/base);
      if(num>=20){
        return num*base+"~";
      }
      return (num*base)+"~"+(num*base+1000);
    }
    //时间戳转时间
    $scope.timeFun=function(nS) {
      return new Date(parseInt(nS) * 1000).toLocaleString().replace(/\//g, "-").replace(/日/g, " ");
    };
    // 回退
    $scope.goBack = function () {
      $scope.$ionicGoBack();
    };

    //查看详情
    $scope.goBackMsg=function () {
           $state.go('teamMessage',{
             memberId:$scope.userId
           });
    };

    //上拉时加载更多的合伙人或人脉 信息
   /* $scope.loadMore = function(){
      $scope.pageIndex++;
      teamMessageService.getConnectionMsg($scope.relationshipType,$scope.pageIndex,$scope.pageNum)
        .success(function(response){
          console.log(response);
          if(response.success){
            if(response.data.partners){
              if(response.data.partners.length==0){
                $scope.hasMore = false;//没有更多的数据了 无法上拉加载更多数据
                limitArrLength(response.data.partners,$scope.storeNameListLength);
                $scope.connectionMsg.partners = $scope.connectionMsg.partners.concat(response.data.partners);
                $scope.$broadcast('scroll.infiniteScrollComplete');
              }else{
                $scope.hasMore = true;
                limitArrLength(response.data.partners,$scope.storeNameListLength);
                $scope.connectionMsg.partners = $scope.connectionMsg.partners.concat(response.data.partners);
                $scope.$broadcast('scroll.infiniteScrollComplete');
              }
            }

          }
        })
    };*/
    // 用户加载更多
    $scope.userLoadMore=function (page) {
      userMessageService.getConnectionMsg($scope.userId,page,$scope.pageSize)
        .success(function (response) {
          if(response.success){
            if($scope.userList.length < response.data.total){
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.hasmore = true;
              $scope.userList = $scope.userList.concat(response.data.rows);
            }
            else{
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.hasmore = false;
            }
          }
        });
    };

    //数据上拉加载
    $scope.loadMore = function(){
      $scope.page++;
      $scope.userLoadMore($scope.page);

    };


    $scope.$on('$ionicView.beforeEnter', function (e,v) {
      //如果是返回回来的不采取操作，使用缓存
      if(v.direction=='back'){
        $ionicScrollDelegate.scrollTop();
        return;
      }
      $ionicScrollDelegate.scrollTop();
      //页数
      $scope.page = 1;
      //展示数量
      $scope.pageSize = 20;
      //是否还有更多的数据
      $scope.hasMore = true;
      $scope.init($scope.userId,$scope.page,$scope.pageSize);

    })
  }]);

APP.service('userMessageService', ['$http', 'UrlService',function ($http, UrlService) {
  this.getConnectionMsg = function(mobile,page,pageSize){
    var param = {
      mobile:mobile,
      pageNumber:page,
      pageSize:pageSize,
      noLoading: true
    }
    return $http.get(UrlService.getUrl('TEAM_MESSAGE'),param);
  };

}]);
