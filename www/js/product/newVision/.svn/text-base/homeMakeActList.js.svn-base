/**
 * 刘成杰 2017-07-16.
 */
APP.controller('homeMakeActListController', ['$ionicHistory','BannerThemeService','CLASSIFYMESSAGECRNTERService','$ionicScrollDelegate', '$ionicSlideBoxDelegate', '$q', 'GoodsService', 'HomePageService', 'CalculateStrLength', 'homeMakeActListService', '$interval', '$http', '$scope', '$stateParams',
  '$state', 'UserService', '$timeout', '$rootScope', 'PopupService', 'ShopService',
  function ($ionicHistory,BannerThemeService,CLASSIFYMESSAGECRNTERService,$ionicScrollDelegate, $ionicSlideBoxDelegate, $q, GoodsService, HomePageService, CalculateStrLength, homeMakeActListService, $interval, $http, $scope, $stateParams, $state, UserService, $timeout, $rootScope, PopupService, ShopService) {
   

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
    $scope.bottomIF=false;

    $scope.init = function () {
      $scope.pageindex=1;
      HomePageService.isWdHost()
        .success(function (res) {
          console.log(res);
          $scope.isWdHost = res.data.isHost;
        })
        homeMakeActListService.getlists($scope.pageindex,5)
        .success(function(res){
          console.log(res)
          if(res.data.length<5){
            $scope.hasmore=false;
            $scope.bottomIF=true;
          }else{
            $scope.hasmore=true;
            $scope.bottomIF=false;
          }
          
          $scope.lists=res.data;
        })
    }
    $scope.loadMore=function(){
      $scope.pageindex++;
      homeMakeActListService.getlists($scope.pageindex,5)
        .success(function(res){
          console.log(res)
          $scope.lists=$scope.lists.concat(res.data);
          if(res.data.length==0){
            $scope.hasmore=false;
            $scope.bottomIF=true;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }else{
            $scope.hasmore=true;
            $scope.bottomIF=false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        })
    }
    //返回上一页
    $scope.goBack = ionic.Utils.debounce(function () {
      $ionicHistory.goBack();
    },300);
    $scope.$on('$ionicView.beforeLeave', function (e, v) {

    })
    /*swiper轮播*/
    // $scope.swpcfurnish1;
    $scope.$on('$ionicView.enter', function (e, v) {
      
      $ionicScrollDelegate.scrollTop();
    });
    $scope.settingsList='';//是否显示佣金本地存储

    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      
      $scope.storeId = UserService.getUser().mid;
      $scope.init();
    });

  }
]);


APP.service('homeMakeActListService', ['$http', 'UrlService', function ($http, UrlService) {
  
  this.getFurnishBottom = function (parentCateId, provinceId, cityId, areaId, streetId) {
    var params = {
      parentCateId: parentCateId,
      provinceId: provinceId,
      cityId: cityId,
      districtId: areaId,
      streetId: streetId
    }
    return $http.get(UrlService.getNewUrl('FURNISH_BOTTOM'), params);
  }
  this.getlists= function(pageIndex,pageSize){
    var params = {
      pageIndex:pageIndex,
      pageSize:pageSize
    }
    return $http.get(UrlService.getNewUrl('ACT_LIST'),params);
  }
}]);
