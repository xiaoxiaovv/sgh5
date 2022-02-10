/**
 * 刘成杰 2017-07-16.
 */
APP.controller('testingStoreListController', ['$ionicHistory','BannerThemeService','CLASSIFYMESSAGECRNTERService','$ionicScrollDelegate', '$ionicSlideBoxDelegate', 'GoodsService', 'HomePageService', 'CalculateStrLength', 'homeMakeActListService', '$interval', '$http', '$scope', '$stateParams',
  '$state', 'UserService', '$timeout', '$rootScope','newTestingStoreService','CommonAddressService','testingStoreListService',
  function ($ionicHistory,BannerThemeService,CLASSIFYMESSAGECRNTERService,$ionicScrollDelegate, $ionicSlideBoxDelegate, GoodsService, HomePageService, CalculateStrLength, homeMakeActListService, $interval, $http, $scope, $stateParams, $state, UserService, $timeout, $rootScope,newTestingStoreService,CommonAddressService,testingStoreListService) {
   

    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
      $scope.paddingtopClass = {
        "margin-top": "16px"
      };
      $scope.paddingtopClasscontent = {
        "top": "105px"
      }
    }else{
      $scope.paddingtopClass = {
        "margin-top": "0px"
      };
      $scope.paddingtopClasscontent = {
        "top": "89px"
      }
    }
    $scope.storetype = function(type){
      $ionicScrollDelegate.scrollTop();
       $scope.nearbyType = type;
       $scope.pageIndex = 1;
       $scope.nolist = false;
       testingStoreListService.getNearbyList($scope.cityIds,1,$scope.lat,$scope.lons,$scope.pageIndex,5,1,$scope.nearbyType)
            .success(function(res){
              if(res.success){
                if(res.data){
                  if(res.data.length <= 1){
                    $scope.nolist = true;
                  }
          if(res.data.length<5){
            $scope.hasmore=false;
        
          }else{
            $scope.hasmore=true;
           
          }
          
          $scope.lists=res.data;
                }
              }
            })
            
            testingStoreListService.getRecently($scope.cityIds,1,$scope.lat,$scope.lons,1,$scope.nearbyType)
            .success(function(res){
              if(res.success){
                if(res.data){
                  $scope.isAdress=true;
                  $scope.recently=res.data;
                }
              }
            })
    }
    $scope.init = function () {
      $scope.pageIndex=1;
      newTestingStoreService.getNearbyType().success(function(res){
            $scope.types = res.data;
        });
          $scope.lons=$rootScope.globalConstant.lon; //青岛崂山中韩街道
          $scope.lat=$rootScope.globalConstant.lat;
          if($rootScope.globalConstant.positionStatus){
            $scope.cityIds = CommonAddressService.getAddressInfo().cityId+'';
            testingStoreListService.getNearbyList($scope.cityIds,1,$scope.lat,$scope.lons,$scope.pageIndex,5,1,$scope.nearbyType)
            .success(function(res){
              if(res.success){
                if(res.data){
                  if(res.data.length <= 1){
                    $scope.nolist = true;
                  }
          if(res.data.length<5){
            $scope.hasmore=false;
          
          }else{
            $scope.hasmore=true;
            
          }
          
          $scope.lists=res.data;
                }
              }
            })
            
            testingStoreListService.getRecently($scope.cityIds,1,$scope.lat,$scope.lons,1,$scope.nearbyType)
            .success(function(res){
              if(res.success){
                if(res.data){
                  $scope.isAdress=true;
                  $scope.recently=res.data;
                }
              }
            })
          }else{
            $scope.cityIds = 173;//青岛
            testingStoreListService.getNearbyList($scope.cityIds,1,36.108883,120.45709,$scope.pageIndex,5,1,$scope.nearbyType)
            .success(function(res){
              if(res.success){
                if(res.data){
                  if(res.data.length <= 1){
                    $scope.nolist = true;
                  }
          if(res.data.length<5){
            $scope.hasmore=false;
          
          }else{
            $scope.hasmore=true;
          
          }
          
          $scope.lists=res.data;
                }
              }
            })

            testingStoreListService.getRecently($scope.cityIds,1,36.108883,120.457091,1,$scope.nearbyType)
            .success(function(res){
              if(res.success){
                if(res.data){
                  $scope.isAdress=true;
                  $scope.recently=res.data;
                }
              }
            })

          }
    }
    $scope.loadmore=function(){
      $scope.pageIndex++;
      testingStoreListService.getNearbyList($scope.cityIds,1,$scope.lat,$scope.lons,$scope.pageIndex,5,1,$scope.nearbyType)
        .success(function(res){
          console.log(res)
          $scope.lists=$scope.lists.concat(res.data);
          if(res.data.length==0){
            $scope.hasmore=false;
          
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }else{
            $scope.hasmore=true;
          
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
    $scope.settingsList='';//是否显示佣金本地存储

    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      if (v.direction == 'back') {

      }else{
        $scope.types=[];
      $scope.nolist = false;
      $scope.nearbyType = $stateParams.nearbyType;
      $scope.storeId = UserService.getUser().mid;
      $scope.init();
      }
      
    });
  }
]);


APP.service('testingStoreListService', ['$http', 'UrlService', function ($http, UrlService) {
  
  this.getRecently=function(cityId,itemsId,latitude,longitude,type,nearbyType){
  var param={
    cityId:cityId,
    itemsId:itemsId,
    latitude:latitude,
    longitude:longitude,
    type:type,
    nearbyType:nearbyType
  }
  return $http.get(UrlService.getNewUrl('RECENTLY_WORK'),param);
}
this.getNearbyList = function(cityId,itemsId,latitude,longitude,pageIndex,pageSize,type,nearbyType){
  var param={
    cityId:cityId,
    itemsId:itemsId,
    latitude:latitude,
    longitude:longitude,
    pageIndex:pageIndex,
    pageSize:pageSize,
    type:type,
    nearbyType:nearbyType
  }
  return $http.get(UrlService.getNewUrl('NEARBY_LIST'),param);
}
}]);
