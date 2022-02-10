/**
 * Created by xy on 2016/3/17.
 */
APP.controller('goldRecordController', ['$rootScope','$localstorage','$scope', '$stateParams', '$state', '$ionicPopup',
  '$timeout', '$http', 'UrlService',
  function($rootScope,$localstorage,$scope, $stateParams, $state, $ionicPopup, $timeout, $http, UrlService) {
    // 上拉加载标志
    $scope.hasmore1 = false;
    $scope.hasmore2 = false;
    $scope.hasmore3 = false;

    $scope.name1 = '';
    $scope.name2 = '';
    $scope.name3 = '';

    $scope.flag = false;
    $scope.a = false;
    $scope.b = true;
    var searchType = 0;
    var startIndex = 1;
    var startIndex1 = 1;
    var startIndex2 = 1;
    var startIndex3 = 1;
    var pageSize = 9;
    var pageN = '';

    var params = {
      'searchType': searchType,
      'startIndex': startIndex,
      'pageSize': pageSize
    };
    $scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);
    chushihua(params);

    // 加载数据
    function chushihua(params) {
      $http.get(UrlService.getUrl('CREDIT_DETAIL'), params)
        .success(function(response) {
          startIndex = 1;
          if (params.searchType == 0) {
            $scope.name1 = response.data.rows;
            pageN = Math.ceil(response.data.total / response.data.pageSize);
            if (params.startIndex >= pageN) {
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.hasmore1 = false;
            } else {
              $scope.hasmore1 = true;
            }
//          console.log(response);
            console.log($scope.name1);
          } else if (params.searchType == 1) {
            $scope.name2 = response.data.rows;
            pageN = Math.ceil(response.data.total / response.data.pageSize);
            if (params.startIndex >= pageN) {
              $scope.hasmore2 = false;
            } else {
              $scope.hasmore2 = true;
            }
          } else if (params.searchType == 2) {
            $scope.name3 = response.data.rows;
            pageN = Math.ceil(response.data.total / response.data.pageSize);
            if (params.startIndex >= pageN) {
              $scope.hasmore3 = false;
            } else {
              $scope.hasmore3 = true;
            }
          }
        })
        .error(function(response) {
          console.log(error);
        });
    }


    //全部加载更多
    $scope.loadMore1 = function() {
      var old = $scope.name1;
      startIndex1 += 1;
      var params = {
        'searchType': searchType,
        'startIndex': startIndex1,
        'pageSize': pageSize
      };

      $http.get(UrlService.getUrl('CREDIT_DETAIL'), params)
        .success(function(response) {
          if (params.searchType == 0) {
            $scope.name1 = old.concat(response.data.rows);
            pageN = Math.ceil(response.data.total / response.data.pageSize);
            if (params.startIndex >= pageN) {
              $scope.hasmore1 = false;
            } else {
              $scope.hasmore1 = true;
            }
            console.log(response);
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        })
        .error(function(response) {
          console.log(error);
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });

      // $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    //来源加载更多
    $scope.loadMore2 = function() {
      var old = $scope.name2;
      startIndex2 += 1;
      var params = {
        'searchType': searchType,
        'startIndex': startIndex2,
        'pageSize': pageSize
      };

      $http.get(UrlService.getUrl('CREDIT_DETAIL'), params)
        .success(function(response) {
          if (params.searchType == 1) {
            $scope.name2 = old.concat(response.data.rows);
            pageN = Math.ceil(response.data.total / response.data.pageSize);
            if (params.startIndex >= pageN) {
              $scope.hasmore2 = false;
            } else {
              $scope.hasmore2 = true;
            }
            console.log(response);
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        })
        .error(function(response) {
          console.log(error);
        });
    };

    //使用加载更多
    $scope.loadMore3 = function() {
      var old = $scope.name3;
      startIndex3 += 1;
      var params = {
        'searchType': searchType,
        'startIndex': startIndex3,
        'pageSize': pageSize
      };

      $http.get(UrlService.getUrl('CREDIT_DETAIL'), params)
        .success(function(response) {
          if (params.searchType == 2) {
            $scope.name3 = old.concat(response.data.rows);
            pageN = Math.ceil(response.data.total / response.data.pageSize);
            if (params.startIndex >= pageN) {
              $scope.hasmore3 = false;
            } else {
              $scope.hasmore3 = true;
            }
            console.log(response);
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        })
        .error(function(response) {
          console.log(error);
        });
    };



    $scope.goBack = function() {
      $scope.$ionicGoBack();
    };

    $scope.show = function() {
      $scope.flag = !$scope.flag;
    }
    $scope.showfalse = function() {
        $scope.flag = false;
      }
      /** 变量声明 **/
    $scope.flag1 = true;
    $scope.flag2 = false;
    $scope.flag3 = false;
    $scope.myObj1 = {
      "background": "#2196F3",
      "color": "#fff"
    };
    $scope.myObj2 = {};
    $scope.myObj3 = {};

    $scope.$on('$ionicView.beforeEnter', function() {
      $scope.flag = false;
      // console.log('lover');
    });


    $scope.showFlag1 = function() {
      searchType = 0;
      startIndex1 = 1;
      params = {
        'searchType': searchType,
        'startIndex': startIndex,
        'pageSize': pageSize
      };
      chushihua(params);
      $scope.flag1 = true;
      $scope.flag2 = false;
      $scope.flag3 = false;
      $scope.myObj1 = {
        "background": "#2196F3",
        "color": "#fff"
      }
      $scope.myObj2 = {}
      $scope.myObj3 = {}
    }

    $scope.showFlag2 = function() {
      searchType = 1;
      startIndex2 = 1;
      params = {
        'searchType': searchType,
        'startIndex': startIndex,
        'pageSize': pageSize
      };
      chushihua(params);
      $scope.flag2 = true;
      $scope.flag1 = false;
      $scope.flag3 = false;
      $scope.myObj2 = {
        "background": "#2196F3",
        "color": "#fff"
      }
      $scope.myObj1 = {}
      $scope.myObj3 = {}
    }

    $scope.showFlag3 = function() {
      searchType = 2;
      startIndex3 = 1;
      params = {
        'searchType': searchType,
        'startIndex': startIndex,
        'pageSize': pageSize
      };
      chushihua(params);
      $scope.flag3 = true;
      $scope.flag1 = false;
      $scope.flag2 = false;
      $scope.myObj3 = {
        "background": "#2196F3",
        "color": "#fff"
      }
      $scope.myObj2 = {}
      $scope.myObj1 = {}
    }

  }
]);
