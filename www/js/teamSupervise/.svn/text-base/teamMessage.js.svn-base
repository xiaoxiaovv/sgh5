/**
 * Created by lenovo on 2017-7-24.
 */
APP.controller('teamMessageController', ['$stateParams','$ionicHistory','$ionicScrollDelegate','$scope', 'teamMessageService', 'UserService', 'UrlService','PopupService','CreditService','$state',
  function ($stateParams,$ionicHistory,$ionicScrollDelegate,$scope, teamMessageService, UserService, UrlService, PopupService, CreditService,$state) {

    $scope.isBasics=false;  //基本信息
    $scope.userId=$stateParams.memberId;
    $scope.selectedIndex=0;
    $scope.orderFlag = 3;
    $scope.orderStatus = 0;
    $scope.pageIndex = 0;
    $scope.pageSize = 10;
    $scope.typeTeam = $stateParams.type;



    $scope.goBack = function() {
      $ionicHistory.goBack();
    };

    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova ) {//只有ios app 特有的样式
      $scope.paddingtopClass = {
        "padding-top": "20px"
      };
      $scope.paddingtopClasscontent = {
        "top": "276px"
      }
    }else{
      $scope.androidClass = {
        "line-height": "44px"
      };
      $scope.paddingtopClasscontent = {
        "top": "260px"
      }
    }

    $scope.switchCheck = function(index){
      $ionicScrollDelegate.scrollTop();
      if(index==0){
        $scope.isBasics=false;
      }else{
        $scope.isBasics=true;
      }
      if(index==1){
        $scope.selectedIndex=0;
        $scope.orderInit($scope.selectedIndex);
      }
      if($scope.checkArr[index]==true){

      }else{
        $scope.hasMore=true;
    //    $scope.connectionMsg.partners=[];//切换时 把数组清空
        $scope.pageIndex = 0;//人脉或合伙人的 页数置为0
        $scope.checkArr = [false,false];
        $scope.checkArr[index] = !$scope.checkArr[index];
        $scope.relationshipType = index==0?1:2;
        $scope.init();
      }
    };

    $scope.backToLastView = function(){
      $state.go('teamSupervise');
      $ionicHistory.clearCache();//回到首页 清除 cacheView
    };
    $scope.gotoPartnerDetail = function(memberId,relationshipType){
      if(relationshipType == 1){
        $state.go('partnerDetail',{ownerId:memberId});
      }else{
        $state.go('connectionDetail',{ownerId:memberId});
      }
    };
    $scope.gotoSpreadConnection = function(partnerId){
      $state.go('spreadConnection',{partnerId:partnerId});
    };


    $scope.init = function(){
      teamMessageService.getConnectionMsg($scope.userId)
        .success(function(response){
          console.log(response)
          if(response.success){
            $scope.productList = response.data;
            $scope.firstOrderTime=$scope.productList.firstOrderTime;
            console.log($scope.firstOrderTime)
          }
        })
    };
    $scope.orderInit=function (ind) {
      teamMessageService.getOrderList($scope.orderFlag,ind,$scope.userId,$scope.pageIndex,$scope.pageSize)
        .success(function (response) {
          console.log(response)
          if(response.success){
             $scope.orders=response.data.orders;  //orderProducts
             $scope.hasMore=response.data.orders.length < response.data.countResult
             console.log($scope.orders)
          }else{
             console.log('拿不到数据')
          }
        });
    };
    // 排序
    $scope.orderByList=function (index) {
      $scope.selectedIndex=index;
      $scope.pageIndex=0;
      $ionicScrollDelegate.scrollTop();
      $scope.orderInit($scope.selectedIndex);
    };


    //时间戳转时间
    $scope.timeFun=function(nS) {
      return new Date(parseInt(nS) * 1000).toLocaleString().replace(/\//g, "-").replace(/日/g, " ");
    };

    //上拉时加载更多的合伙人 信息
    $scope.loadMore = function(){
      $scope.pageIndex++;
      teamMessageService.getOrderList($scope.orderFlag,$scope.selectedIndex,$scope.userId,$scope.pageIndex,$scope.pageSize)
        .success(function(response){
          console.log(response);
          if(response.success){
              if(response.data.orders.length<response.data.countResult){
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.hasMore = true;
                $scope.orders = $scope.orders.concat(response.data.orders);
              }else{
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.hasMore = false;//没有更多的数据了 无法上拉加载更多数据
              }
          }
        })
    };


    $scope.$on('$ionicView.beforeEnter', function (e,v) {
      // var heightTHis = parseInt(document.getElementById('thisHeader').clientHeight)+60;
      // if (ionic.Platform.platform().indexOf('ios') != -1) {//只有ios app 特有的样式 && window.cordova
      //   $scope.paddingtopClass = {
      //     "padding-top": "20px"
      //   };
      //   $scope.paddingContentClass = {
      //     "top": heightTHis+'px'
      //   };
      // }else{
      //   $scope.paddingtopClass = {
      //     "padding-top": "0"
      //   };
      //   $scope.paddingContentClass = {
      //     "top": (heightTHis-20)+'px'
      //   };
      // }
      //如果是返回回来的不采取操作，使用缓存
      if(v.direction=='back'){
        $ionicScrollDelegate.scrollTop();
        return;
      }
      $ionicScrollDelegate.scrollTop();
      $scope.relationshipType = 1;
      $scope.checkArr =[true,false];
      //是否还有更多的合伙人或人脉 数据
      $scope.hasMore = true;
      $scope.init($scope.userID);
      $scope.orderFlag = 3;
      $scope.orderStatus = 0;
      $scope.pageIndex = 0;
      $scope.pageSize = 10;
    })
  }]);

APP.service('teamMessageService', ['$http', 'UrlService','CalculateStrLength' ,function ($http, UrlService,CalculateStrLength) {
  this.getConnectionMsg = function(userId){ //基本信息
    var param = {
      memberId:userId
    }
    return $http.get(UrlService.getUrl('TEAM_USERINFO'),param);
  };
  this.getOrderList = function(orderFlag,orderStatus,userId,pageIndex ,pageSize){ //订单列表
    var param = {
      orderFlag:orderFlag,
      orderStatus:orderStatus,
      queryMemberId:userId,
      pageIndex:pageIndex,
      pageSize:pageSize,
      noLoading: true
    }
    return $http.get(UrlService.getUrl('ORDER_LIST'),param);
  };

}]);
