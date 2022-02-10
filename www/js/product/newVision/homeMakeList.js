/**
 * 刘成杰 2017-07-16.
 */
APP.controller('homeMakeListController', ['$ionicHistory','BannerThemeService','CLASSIFYMESSAGECRNTERService','$ionicScrollDelegate', '$ionicSlideBoxDelegate', '$q', 'GoodsService', 'HomePageService', 'CalculateStrLength', 'homeMakeListService', '$interval', '$http', '$scope', '$stateParams',
  '$state', 'UserService', '$timeout', '$rootScope', 'PopupService', 'ShopService',
  function ($ionicHistory,BannerThemeService,CLASSIFYMESSAGECRNTERService,$ionicScrollDelegate, $ionicSlideBoxDelegate, $q, GoodsService, HomePageService, CalculateStrLength, homeMakeListService, $interval, $http, $scope, $stateParams, $state, UserService, $timeout, $rootScope, PopupService, ShopService) {
   

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
  //跳转到贴子详情页
  $scope.toNoteDetails = function (id, isShort, index) {
    // $scope.noteIndex = index;
    // console.log('$scope.noteIndex', $scope.noteIndex);
    $state.go('noteDetails', { noteId: id});
  };
    $scope.init = function () {
      $scope.pageIndex=1;
      HomePageService.isWdHost()
        .success(function (res) {
          console.log(res);
          $scope.isWdHost = res.data.isHost;
        })
        if($scope.index==0){
          homeMakeListService.getTopic($scope.index,1,$scope.pageIndex,6)
          .success(function(res){
            console.log(res);
            $scope.list=res.data.storys;
            if(res.data.storys.length<6){
              $scope.hasmore=false;
              $scope.bottomIF=true;
            }else{
              $scope.hasmore=true;
              $scope.bottomIF=false;
            }
          })
        }else{
          homeMakeListService.getTopic($scope.index,2,$scope.pageIndex,6)
          .success(function(res){
            console.log(res);
            $scope.list=res.data.storys
            if(res.data.storys.length<6){
              $scope.hasmore=false;
              $scope.bottomIF=true;
            }else{
              $scope.hasmore=true;
              $scope.bottomIF=false;
            }
          })
        }
        
    }
    $scope.loadMore=function(){
      $scope.pageIndex++;
      if($scope.index==0){
        homeMakeListService.getTopic($scope.index,2,$scope.pageIndex,6)
        .success(function(res){
          console.log(res);
          $scope.list=$scope.list.concat(res.data.storys)
          if(res.data.storys.length<6){
            $scope.hasmore=false;
            $scope.bottomIF=true;
          }else{
            $scope.hasmore=true;
            $scope.bottomIF=false;
          }
        })
      }else{
        homeMakeListService.getTopic($scope.index,2,$scope.pageIndex,6)
        .success(function(res){
          console.log(res);
          $scope.list=$scope.list.concat(res.data.storys)
          if(res.data.storys.length<6){
            $scope.hasmore=false;
            $scope.bottomIF=true;
          }else{
            $scope.hasmore=true;
            $scope.bottomIF=false;
          }
        })
      }
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
      $scope.index=$stateParams.index;
      console.log($scope.index)
      $scope.hasmore=false;
      $scope.bottomIF=false;
      $scope.storeId = UserService.getUser().mid;
      $scope.init();
    });

  }
]);


APP.service('homeMakeListService', ['$http', 'UrlService', function ($http, UrlService) {
  
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
  this.getAdornhomeCates = function(){
    return $http.get(UrlService.getNewUrl('ADORNHOME_CATES'));
  }
  this.getTopic=function(group,itemsId,pageIndex,pageSize){
    var param={
      group:group,
      itemsId:itemsId,
      pageIndex:pageIndex,
      pageSize:pageSize
    }
  return $http.get(UrlService.getNewUrl('NEW_HOME_TOPIC'),param);
}
}]);
