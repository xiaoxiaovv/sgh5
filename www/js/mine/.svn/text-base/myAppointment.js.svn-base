/**
 * 刘成杰 2017-07-16.
 */
APP.controller('myAppointmentController', ['$ionicScrollDelegate','$interval', 'myAppointmentService', 'CalculateStrLength', '$interval', '$http', '$scope', '$stateParams',
  '$state', 'UserService', '$timeout', '$rootScope', 'PopupService','HomePageService',
  function ($ionicScrollDelegate,$interval, myAppointmentService, CalculateStrLength, $interval, $http, $scope, $stateParams, $state, UserService, $timeout, $rootScope, PopupService,HomePageService) {

    $scope.pageIndex = 1;
    $scope.hasMore = false;
    $scope.data = [];
    $scope.storeId = UserService.getUser().mid;
    $scope.flagNum = false;
    $scope.messageImgUrl = "http://cdn09.ehaier.com/shunguang/H5/www/img/message_gray@2x.png";
    $scope.goProductDetail = function (productId) {
      $state.go('productDetail', {
        fromType: '',
        fromUrl: '',
        o2oType: 0,
        productId: productId,
        storeId: $scope.storeId
      })
    }

    function calCountTime(index, hasBegan) {
      var tempHasBegan = hasBegan;
      var timer = $interval(function () {
        if (tempHasBegan) {
          var time = $scope.data[index].purchaseEndTime - new Date().getTime();
        } else {
          var time = $scope.data[index].purchaseStartTime - new Date().getTime();
        }
        if (time < 0) { //倒计时时间为0时
          if (!tempHasBegan) { //如果抢购已经从未开始状态变为 开始状态
            tempHasBegan = true;
            $scope.data[index].hasBegan = true;
            $scope.data[index].days = 0;
            $scope.data[index].hours = 0;
            $scope.data[index].minutes = 0;
            $scope.data[index].seconds = 0;
          } else { //如果抢购已经从开始状态变为 结束状态
            $scope.data[index].hasOver = true;
            for (var i = 0, overCount = 0; i < $scope.data.length; i++) {
              if ($scope.data[i].hasOver) {
                overCount++;
              } else {
                break;
              }
            }
            if (overCount == $scope.data.length) {
              $scope.noData = true;
            }
            $interval.cancel(timer);
          }
        } else {
          $scope.data[index].days = parseInt(time / (1000 * 60 * 60 * 24));
          $scope.data[index].hours = parseInt((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          $scope.data[index].minutes = parseInt((time % (1000 * 60 * 60)) / (1000 * 60));
          $scope.data[index].seconds = Math.floor((time % (1000 * 60)) / 1000);
        }
      }, 1000);
      $scope.intervalArr.push(timer);
    }
    //计算倒计时的方法
    function calTime(arr) {
      var nowTime = new Date().getTime();
      var length = arr.length;
      for (var i = 0; i < length; i++) {
        arr[i].hasOver = false; //是否抢购已经结束
        if (arr[i].purchaseStartTime > nowTime) { //抢购未开始
          arr[i].hasBegan = false;
          console.log(arr[i])
          calCountTime(i, false);
        } else if (arr[i].purchaseStartTime < new Date().getTime() && nowTime < arr[i].purchaseEndTime) { //抢购已经开始 但是未结束
          arr[i].hasBegan = true;
          console.log(arr[i])
          calCountTime(i, true);
        }
      }
      console.log($scope.data);
    }
    $scope.init = function () {
      $scope.noData = false; //是否没有预约商品
      $scope.data = [];
      myAppointmentService.getMyAppointment($scope.pageIndex)
        .success(function (res) {
          console.log(res);
          if (res.data.length == 5) { //如果还有预约商品
            $scope.hasMore = true;
            $scope.data = $scope.data.concat(res.data);
            calTime($scope.data);
          } else if (res.data.length < 5 && res.data.length != 0) {
            $scope.hasMore = false;
            $scope.data = $scope.data.concat(res.data);
            calTime($scope.data);
          } else if (!res.data || res.data.length == 0) {
            $scope.noData = true;
            console.log($scope.noData);
          }
        })
        HomePageService.getUnReadMsg()
          .success(function (res) {
            if (res.data > 0) {
              $scope.flagNum = true;
            } else {
              $scope.flagNum = false;
            }
          });
    }
    $scope.loadMore = function () {
      $scope.pageIndex++;
      myAppointmentService.getMyAppointment($scope.pageIndex)
        .success(function (res) {
          console.log(res);
          if (res.data.length == 5) { //如果还有预约商品
            $scope.hasMore = true;
            calTime(res.data);
            $scope.data = $scope.data.concat(res.data);
          } else if (res.data.length < 5 && res.data.length != 0) {
            $scope.hasMore = false;
            calTime(res.data);
            $scope.data = $scope.data.concat(res.data);
          }else{
            $scope.hasMore = false;
          }
        })
    }
    $scope.$on('$ionicView.beforeLeave', function (e, v) {
      for (var i = 0, length = $scope.intervalArr.length; i < length; i++) {
        $interval.cancel($scope.intervalArr[i]);
      }
    })

    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      $ionicScrollDelegate.scrollTop();
      $scope.pageIndex =1;
      $scope.intervalArr = []; //定时器数组
      $scope.init();
    });

  }
]);


APP.service('myAppointmentService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getMyAppointment = function (pageIndex) {
    var params = {
      pageIndex: pageIndex
    }
    return $http.get(UrlService.getNewUrl('MYAPPOINTMENT'), params);
  }
}]);
