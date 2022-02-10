/**
 * Created by xy on 2016/3/22.
 */
APP.controller('SendGoodsTimeController', ['$ionicHistory','$scope', '$stateParams', '$rootScope', '$state', '$ionicActionSheet', 'SendGoodsTimeService','PopupService','$timeout',
  function ($ionicHistory,$scope, $stateParams, $rootScope, $state, $ionicActionSheet, SendGoodsTimeService,PopupService,$timeout) {
    /** 变量声明 **/
    $scope.htmlContent = $stateParams.content;
    $scope.title = $stateParams.title;

    $scope.data = {
      //"date": [
      //  {"text": "2016-04-18(星期一)"},
      //  {"text": "2016-04-19(星期二)"},
      //  {"text": "2016-04-20(星期三)"},
      //  {"text": "2016-04-21(星期四)"},
      //  {"text": "2016-04-22(星期五)"},
      //  {"text": "2016-04-23(星期六)"},
      //  {"text": "2016-04-24(星期日)"},
      //  {"text": "2016-04-25(星期一)"},
      //  {"text": "2016-04-26(星期二)"},
      //  {"text": "2016-04-27(星期三)"}
      //
      //],
      "time": [
        {"text": "9:00-13:00"},
        {"text": "13:00-18:00"},
        {"text": "18:00-21:00"}

      ]
    };

    $scope.zfb_checked = true;
    $scope.huod_checked = false;
    $scope.kjt_checked = false;

    /** 方法 **/
    $scope.init = function () {
      $scope.htmlContent = $stateParams.content;
      $scope.title = $stateParams.title;

      $scope.dateTimes = [];
      $scope.datas = {};

      SendGoodsTimeService.getSendGoodsDates().success(function (response, status, headers, config) {
        $scope.storeInfo = response.data;
        console.log($scope.storeInfo);
        for (var i = 0; i < response.data.length; i++) {
          console.log(response.data[i]);
          //
          $scope.datas = {"text": response.data[i]};
          $scope.dateTimes.push($scope.datas)
        }
        console.log($scope.dateTimes);

      });
      console.log('do init!!');
    };

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });
    /* 选择日期 */
    $scope.chooseDate = function () {
      var hideSheet = $ionicActionSheet.show({
        buttons: $scope.dateTimes,
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          console.log(index);
          $scope.dateChoose = $scope.dateTimes[index].text;
          return true;
        },
        cssClass:'limitScrollHeight'
      });
    };
    /* 选择时间段 */
    $scope.chooseTime = function () {

      var hideSheet = $ionicActionSheet.show({
        buttons: $scope.data.time,
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          $scope.timeChoose = $scope.data.time[index].text;
          return true;
        }
      });
    };

    $scope.confirm = function () {
      if(!$scope.dateChoose){
        PopupService.showToast('请填写配送时间');
        return;
      }
      $scope.dateChoose =  $scope.dateChoose.substr(0,10);
      $scope.timeChoose = '';
      SendGoodsTimeService.confirmSendGoodsDates(1, $scope.dateChoose, $scope.timeChoose)
        .success(function (response, status, headers, config) {
          if (response.success == true) {
           // $state.go('orderConfirm');
            $ionicHistory.goBack();
          }
        console.log(response);
      })
    }

  }]);


APP.service('SendGoodsTimeService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getSendGoodsDates = function () {//memberId
    // var params = {
    //   toUrl: 2
    // };
    return $http({
      method:'POST',
      url:UrlService.getUrl('PAY_WAY')
    });
    //return $http.get(UrlService.getUrl('STORE_INFO'), params);
  //  return $http.get(UrlService.getUrl('PAY_WAY'), params);
  };
  this.confirmSendGoodsDates = function (delivery, yuyueDay, yuyueTime) {//memberId
    var params = {
      cd: delivery,
      day: yuyueDay,
      time: yuyueTime
    };
    //return $http.get(UrlService.getUrl('STORE_INFO'), params);
    //return $http.post(UrlService.getUrl('SUBMIT_DELIVE_WAY'), params);
    return $http({
      method: 'POST',
      url: UrlService.getUrl('SUBMIT_DELIVE_WAY'),
      params: params
    });
  };
}]);
