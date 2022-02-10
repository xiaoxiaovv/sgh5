/**
 * Created by ZXT on 2016/3/15.
 */
APP.controller('ProductRatedController', ['$scope', '$stateParams', '$rootScope', 'ProductRatedService', '$ionicPopup', '$timeout', '$ionicScrollDelegate', '$state', 'UserService', 'UrlService',
  function($scope, $stateParams, $rootScope, ProductRatedService, $ionicPopup, $timeout, $ionicScrollDelegate, $state, UserService, UrlService) {
    /** 变量声明 **/
    $scope.allComment = true;//全部评价
    $scope.goodComment = false;//好评
    $scope.neutralComment = false;//中评
    $scope.negativeComment = false;//差评
    $scope.havePicComment = false;//有图
    $scope.productId = $stateParams.productId;
    $scope.assessLevel = 'all'; //判断是什么评价
    $scope.hasPic = ''; //判断是否有图
    $scope.pageSize = 5;
    $scope.pageIndex = 1;
    $scope.assessList = []; //评价列表数组
    $scope.assessListDay = []; //评价列表数组
    $scope.isHasData = true; //是否有评价数据
    $scope.hasMore = false; //是否可以加载更多
    $scope.productRatedSub = {
      top: '43px'
    };
    $scope.productRatedContent = {
      top: '128px'
    }
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) { //只有ios app 特有的样式
      $scope.productRatedSub = {
        top: '63px'
      }
      $scope.productRatedContent = {
        top: '148px'
      }
    }
    $scope.isCheckStyle = {
      "color": "#fff",
      "background": "#fd4f00"
    }
    $scope.noCheckStyle = {
      "color": "#000",
      "background": "#fdebeb"
    }
    /** 方法 **/
      //页面初始化
    $scope.initData = function () {
      // 获取数据条数接口
      ProductRatedService.getData($scope.productId)
        .success(function (response, status, headers, config) {
          $scope.assessData = response.data;
        });
      // 获取新的标签
      ProductRatedService.getTabData($scope.productId)
        .success(function(response, status, headers, config) {
          $scope.markData = response.data;
        });
      $scope.pageIndex = 1;
      $scope.assessList = [];
      getAssessList(false);
    };
    function getAssessList(noLoading) {
      ProductRatedService.loadData($scope.productId, $scope.pageIndex, $scope.pageSize, $scope.assessLevel, noLoading)
        .success(function(response, status, headers, config) {
          if ((response.data == null || response.data.length == 0)&&$scope.pageIndex==1) {
            $scope.isHasData = false;
          }else{
            $scope.isHasData = true;
            $scope.assessList = $scope.assessList.concat(response.data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hasMore = (response.data.length == 5);
            for (var i = 0; i < $scope.assessList.length; i++) {
              if ($scope.assessList[i].experienceTime!=null) {
                var date1 = $scope.assessList[i].experienceTime;
                var date2 = $scope.assessList[i].createTime;
                var str = (date1 - date2) / 1000;
                var day = parseInt(str / (24 * 60 * 60));
                if(day>0){
                  $scope.assessList[i].dayTime = day;
                }else{
                  $scope.assessList[i].dayTime = 0;
                }
              } else {
                $scope.assessList[i].dayTime = 0;
              }
            }
          }
        });
    }
    $scope.loadMore = function() {
      $scope.pageIndex = $scope.pageIndex + 1;
      getAssessList(true);
    };
    //回退
    $scope.goBack = function() {
      $scope.$ionicGoBack();
    };
    /**
     * 选择评价类型
     * */
    $scope.clickCommentType = function(str) {
      $ionicScrollDelegate.scrollTop();
      $scope.allComment =  str == "all"; //全部评价
      $scope.goodComment = str == "praise"; //好评
      $scope.neutralComment = str == "neutral"; //中评
      $scope.negativeComment = str == "poor"; //差评
      $scope.havePicComment = str == "image"; //有图
      $scope.assessLevel = str;
      $scope.hasPic = '';

      $scope.pageIndex = 1;
      $scope.assessList = [];
      getAssessList(false);
    };

    $scope.showLarge = function(img) {
      $scope.showBigImage = true;
      $scope.largeImg = img;
    };
    $scope.closeImg = function() {
      $scope.showBigImage = false;
    };
    $scope.$on('$ionicView.beforeEnter', function() {
      $ionicScrollDelegate.scrollTop();
      $scope.isHasData = true;
      $scope.initData();
    });


  }
]);


APP.service('ProductRatedService', ['$http', 'UrlService', function($http, UrlService) {
  //加载数据
  this.getData = function(productId) {
    var params = {
      'productId': productId
    };
    return $http.get(UrlService.getUrl('PRODUCT_RATED_TOASSESS_LIST'), params);
  };
  //新标签接口
  this.getTabData = function(productId) {
    var params = {
      'productId': productId
    };
    return $http.get(UrlService.getUrl('PRODUCT_ASSESS_MARK'), params);
  };
  //评价列表
  this.loadData = function(productId, pageIndex, pageSize, commentType, noLoading) {
    var params = {
      'productId': productId,
      'pageIndex': pageIndex,
      'pageSize': pageSize,
      'commentType': commentType, //好评为1,中评为2,差评为3
      'noLoading': noLoading
    };
    return $http.get(UrlService.getUrl('PRODUCT_RATED_ASSESS_LIST'), params);
  };
}]);
