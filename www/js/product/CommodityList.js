  APP.controller('CommodityListController', ['$scope', '$localstorage', '$rootScope','UseCouponsService','$stateParams','$ionicScrollDelegate','PopupService',
    function ($scope,$localstorage,$rootScope,UseCouponsService,$stateParams,$ionicScrollDelegate,PopupService) {
      if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
       $scope.paddingtopClass = {
         "margin-top": "16px"
       };
       $scope.paddingtopClasscontent = {
         "top": "60px"
       }
     }else{
       $scope.paddingtopClass = {
         "margin-top": "0px"
       };
       $scope.paddingtopClasscontent = {
         "top": "44px"
       }
     }
     //样式蓝色or红色
      $scope.backGroundBlue = {
        "background":"url("+$rootScope.imgBaseURL+"img/couponblue.png) no-repeat",
        "background-size": "100% 118px"
      }
      $scope.backGroundRed = {
        "background":"url("+$rootScope.imgBaseURL+"img/coupon.png) no-repeat",
        "background-size": "100% 118px"
      }
     $scope.goBack = function() {
        $scope.$ionicGoBack();
     };
      $scope.productList = [];
      $scope.couponList = [];
      var couponsId = $stateParams.couponId;
      $scope.hasmore = false;
      var startIndex = 1;
      var pageSize = 5;
      //获取商品列表
      $scope.getShopData = function() {
          UseCouponsService.doInit(couponsId, 1, 5)
          .success(function(response) {
            // $ionicScrollDelegate.scrollTop();
            if(response.success){
              if(response.coupon){
                $scope.couponList = response.coupon;
              }
              if(response.productsList){
                $scope.productList = response.productsList;
              }
              if($scope.productList.length < response.storeItemsCounts){
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.hasmore = true;
              }else{
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.hasmore = false;
              }
            }else{
              PopupService.showToast(response.message);
            }
          });
      }

       //数据上拉加载
       $scope.loadMore = function(){
         startIndex++;
         UseCouponsService.doInit(couponsId,startIndex,pageSize)
           .success(function (response, status, headers, config) {
               if(response.productsList){
                 $scope.productList = $scope.productList.concat(response.productsList);
               }
               if($scope.productList.length < response.storeItemsCounts){
                 $scope.$broadcast('scroll.infiniteScrollComplete');
                 $scope.hasmore = true;
               }else{
                   $scope.$broadcast('scroll.infiniteScrollComplete');
                 $scope.hasmore = false;
               }
           });
       }

       $scope.$on('$ionicView.beforeEnter', function() {
         $scope.hasmore = false;
         startIndex = 1;
         $scope.getShopData();
       });
    }]);

    APP.service('UseCouponsService', ['$http', 'UrlService', function ($http, UrlService) {
      //初始化
      this.doInit = function (couponId,startIndex,pageSize) {
        var params = {
            couponId: couponId,
            startIndex: startIndex,
            pageSize: pageSize
        };
        return $http.get(UrlService.getUrl('USE_COUPONS_LIST'), params);
      };
    }]);
