'use strict';

APP.controller('signDateController', ['CirclePageService', 'signDateService', 'PopupService', '$scope', '$stateParams', '$rootScope', '$state', '$ionicActionSheet', '$timeout', 'UserService', '$ionicLoading', 'PlatformService', 'ionicDatePicker', '$ionicPopup', 'LoginService', '$localstorage', function (CirclePageService, signDateService, PopupService, $scope, $stateParams, $rootScope, $state, $ionicActionSheet, $timeout, UserService, $ionicLoading, PlatformService, ionicDatePicker, $ionicPopup, LoginService, $localstorage) {
  /** 变量声明 **/
  if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
    //只有ios app 特有的样式
    $scope.paddingtopClass = {
      "padding-top": "30px"
    };
  } else {
    $scope.paddingtopClass = {
      "padding-top": "14px"
    };
  }
  /** 方法 **/

  //返回
  $scope.goBack = function () {
    $scope.$ionicGoBack();
  };
  //viewWillAppear
  $scope.$on('$ionicView.beforeEnter', function (e, v) {
    if (v.direction == 'back') {
      return;
    }
    $scope.month = new Date().getMonth();
    $scope.year = new Date().getFullYear();
    // getCurrentDays($scope.year, $scope.month);
    $scope.init();
  });
  $scope.init = function () {
    $scope.isMoreSign='';
    $scope.signSucDate = CirclePageService.signSuccessDate;
    $scope.topicName = CirclePageService.topicName;
    console.log($scope.signSucDate.signYear, $scope.signSucDate.signMonth);

    /*$scope.nowYear = new Date().getFullYear();
    $scope.nowMonth = new Date().getMonth();
    $scope.nowDay = new Date().getDate();
    */
    $scope.defaultDate = $scope.signSucDate.signYear + '-' + $scope.signSucDate.signMonth + '-' + $scope.signSucDate.signDay;
    $scope.userId = $stateParams.userId;
    $scope.topicId = $stateParams.topicId;
    $scope.monthFlag = Number($stateParams.monthFlag);
    console.log($scope.userId, $scope.topicId, $scope.monthFlag);
    console.log($scope.defaultDate);
    getSignFun($scope.userId, $scope.topicId, $scope.monthFlag, $scope.signSucDate.signYear, $scope.signSucDate.signMonth);
    // getSignFun($scope.userId, $scope.topicId, $scope.monthFlag,2017,11);
  };

  //补签
  $scope.replenishSign = function () {
    $scope.replenishPopup = $ionicPopup.show({
      template: '<div class=\'rep-box\'>\n                    <div class=\'rep-close\' ng-click=\'closeReplenishPopup()\'><img ng-src="{{imgBaseURL}}img/signIn/sign_close.png" alt="\u5173\u95ED" /></div>\n                    <div class=\'rep-head\'>\u9009\u62E9\u8865\u7B7E\u65E5\u671F</div>\n                    <div class=\'rep-content\'>\n                      <div class=\'con-date\' ng-click=\'selectDate()\'>\n                        \n                        <div class=\'input\'>{{defaultDate}}</div>\n                        <i><img ng-src="{{imgBaseURL}}img/signIn/date_icon.png" alt="" /></i>\n                      </div>\n                      <div class=\'con-info\'>\u8865\u7B7E\u5C06\u6D88\u8017\u60A8<span style=\"font-size:22px;\">{{replenishSignGolds}}</span>\u4E2A\u91D1\u5E01</div>\n                    </div>\n                    <div class=\'rep-foot\' ng-click=\'replenishSuccess(defaultDate,2,topicId,userId)\'>\u786E\u8BA4\u8865\u7B7E</div>\n                  </div>',
      cssClass: 'replenishPopup',
      scope: $scope
    });
    $scope.closeReplenishPopup = function () {
      $scope.replenishPopup.close();
    };
  };
  //补签成功
  $scope.replenishSuccess = function (replenishSignDate, signType, topicId, userId) {
    var circleSignType = 2;
    var replenishYear = replenishSignDate.split('-')[0];
    var replenishMonth = replenishSignDate.split('-')[1];
    console.log(replenishYear, replenishMonth);
    if (replenishYear == $scope.signSucDate.signYear && replenishMonth == $scope.signSucDate.signMonth) {
      signDateService.getReplenishSign(replenishSignDate, signType, topicId, userId).success(function (res) {
        if (res.success) {
          console.log(res);
          $scope.signInfoData = res.data;
          $scope.replenishPopup.close();
          $scope.replenishSucPopup = $ionicPopup.show({
            template: '<div class=\'suc-box\'>\n                          <div class=\'suc-close\' ng-click=\'closeReplenishSucPopup()\'><img src="{{imgBaseURL}}img/signIn/sign_close.png" alt="" /></div>\n                          <div class=\'suc-bg\'><img src="{{imgBaseURL}}img/signIn/buqian_bg.png" alt="" /></div>\n                          <div class=\'suc-content\'>\n                            <div class=\'suc-title\' flex=\'main:center cross:center\'>\n                              <div class=\'suc-icon\' flex=\'cross:center\'><img src="{{imgBaseURL}}img/signIn/sign_icon.png" alt="" /></div>\n                              <div class=\'title-text\'>\u7B7E\u5230\u6392\u540D<span style=\"font-size:16px;\">{{signInfoData.rank}}</span></div>\n                            </div>\n                               </div>\n                          <div class=\'suc-foot\' ng-click=\'closeReplenishSucPopup()\'>\u77E5\u9053\u5566</div>\n                        </div>',
            cssClass: 'replenishSucPopup',
            scope: $scope
          });
        } else {
          PopupService.showToast(res.message);
        }
      });
      //关闭补签成功的弹窗
      $scope.closeReplenishSucPopup = function () {
        $scope.replenishSucPopup.close();
        $scope.init();
      };
    } else {
      PopupService.showToast('对不起，只能补签当月');
    }
  };
  //选择日期
  $scope.selectDate = function () {
    if (PlatformService.getPlatform() == 'APP') {
      var fromYear = $scope.signSucDate.signYear;
      var fromMonth = $scope.signSucDate.signMonth;
      var fromDay = $scope.signSucDate.signDay;
      var options = {
        date: new Date(fromYear, fromMonth - 1, fromDay),
        mode: 'date',
        cancelButton: false,
        locale: "zh-Hans" // ios 时间控件已经中国化 todo  android
      };
      datePicker.show(options, function (date) {
        $timeout(function () {
          var day = date.getDate();
          var month = date.getMonth() + 1;
          var year = date.getFullYear();
          if (month < 10) {
            month = '0' + month;
          }
          if (day < 10) {
            day = '0' + day;
          }
          // alert(year + '-' + month + '-' + day);
          $scope.defaultDate = year + '-' + month + '-' + day;
        }, 200);
      });
    } else {
      var fromMonth = $scope.signSucDate.signMonth;
      var fromYear = $scope.signSucDate.signYear;
      console.log(fromYear, fromMonth);
      var ipObj1 = {
        inputDate: new Date(),
        weeksList: ['日', '一', '二', '三', '四', '五', '六'],
        monthsList: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        from: new Date(fromYear, fromMonth - 1, 1), //Optional
        to: new Date(), //Optional
        mondayFirst: true, //Optional
        closeOnSelect: false, //Optional
        templateType: 'popup',
        setLabel: '设置',
        closeLabel: '关闭',
        dateFormat: 'yyyy-MM-dd',
        callback: function callback(val) {
          //Mandatory
          console.log('Return value from the datepicker popup is : ', new Date(val).getMonth() + 1);
          var monthWeb = new Date(val).getMonth() + 1;
          var dayWeb = new Date(val).getDate();
          if (monthWeb < 10) {
            monthWeb = '0' + monthWeb;
          }
          if (dayWeb < 10) {
            dayWeb = '0' + dayWeb;
          }
          var birthday = new Date(val).getFullYear() + '-' + monthWeb + '-' + dayWeb;
          $scope.defaultDate = new Date(val).getFullYear() + '-' + monthWeb + '-' + dayWeb;
        } //Optional
      };
      ionicDatePicker.openDatePicker(ipObj1);
    }
  };
  //跳转签到排行
  $scope.signChart = function (topicId) {
    $state.go('signInChart', { topicId: topicId });
  };
  $scope.weeks = ['日', '一', '二', '三', '四', '五', '六'];
  function getCurrentDays(year, month) {
    var localYear = year;
    var localMonth = month;
    $scope.month = month;
    //console.log(year,month);
    $scope.fullDay = new Date(year, localMonth, 0).getDate(); //当前月总天数 
    $scope.startWeek = new Date(year, localMonth - 1, 1).getDay(); //当月第一天 周几
    $scope.lastMonthDay = new Date(year, localMonth - 1, 0).getDate(); //上月最后一天(总天数)
    $scope.nextMonthDay = new Date(year, localMonth + 1, 0).getDate(); //下月最后一天总数
    $scope.total = ($scope.fullDay + $scope.startWeek) % 7 == 0 ? $scope.fullDay + $scope.startWeek : $scope.fullDay + $scope.startWeek + (7 - ($scope.fullDay + $scope.startWeek) % 7);
    $scope.fullPrevMonth = [];
    $scope.fullNextMonth = [];
    $scope.fullCurrentMonth = [];
    //上个月的日期
    for (var i = 0; i < $scope.lastMonthDay; i++) {
      $scope.fullPrevMonth[i] = i + 1;
    }
    //下个月的日期
    for (var i = 0; i < $scope.nextMonthDay; i++) {
      $scope.fullNextMonth[i] = i + 1;
    }
    //当前月的日期
    /*for (var i=0;i<$scope.fullDay;i++) {
      $scope.fullCurrentMonth[i] = i+1;
    }*/
    for (var i = 0; i < $scope.signList.length; i++) {
      $scope.fullCurrentMonth[i] = i + 1;
    }
    $scope.prevLast = $scope.fullPrevMonth.splice($scope.lastMonthDay - $scope.startWeek, $scope.startWeek);
    $scope.nextFrist = $scope.fullNextMonth.splice(0, 7 - ($scope.fullDay + $scope.startWeek) % 7);
    //当前页面所需要显示的日期
    $scope.currentDays = $scope.prevLast.concat($scope.signList).concat($scope.nextFrist);
  }
  //日期格式化
  function getSignFun(userId, topicId, monthFlag, year, month) {
    signDateService.getSignDate(userId, topicId, monthFlag, year, month).success(function (res) {
      if (res.success) {
        $scope.isMoreSign=res.data.replenishSignGolds;
        var signList = res.data.list;
        var getDate = signList[0].signDate.split('-');
        $scope.signList = res.data.list;
        $scope.getYear = Number(getDate[0]);
        $scope.getMonth = Number(getDate[1]);
        $scope.signCount = res.data.signCount;
        $scope.replenishSignGolds = res.data.replenishSignGolds;
        $scope.signRules = res.data.signRules;
        console.log($scope.getYear, $scope.getMonth);
        getCurrentDays($scope.getYear, $scope.getMonth);
      }
    });
  }
  //外链跳转 方法
  $scope.tolink = function (url) {
    console.log(url);
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      if (PlatformService.getPlatform() == 'APP') {
        cordova.InAppBrowser.open(url, '_system', 'location=yes');
      } else {
        window.open(url);
      }
    } else if (u.indexOf('iPhone') > -1) {
      if (PlatformService.getPlatform() == 'APP') {
        cordova.InAppBrowser.open(url, '_system', 'location=yes');
      } else {
        window.open(url);
      }
    } else {
      if (PlatformService.getPlatform() == 'APP') {
        cordova.InAppBrowser.open(url, '_system', 'location=yes');
      } else {
        window.open(url);
      }
    }
  };
  // 日期跳转到 活动页面
  $scope.signDateActive = function (content, type, postProductEntity) {
    //无活动
    if (type == 0) {
      console.log(content);
      return;
    } else if (type == 1) {
      //跳转到商品详情
      console.log(content);
      $state.go('productDetail', {
        productId: postProductEntity.productId,
        o2oType: postProductEntity.o2oType,
        fromType: postProductEntity.fromType,
        storeId: postProductEntity.storeId
      });
    } else if (type == 2) {
      //跳转到 内链
      console.log(content);
      //$tate.
    } else if (type == 3) {
      //跳转到外链
      console.log(content);
      $scope.tolink(content);
    }
  };
  //上个月
  $scope.prevMonth = function () {
    if ($scope.getMonth - 1 == 0) {
      $scope.getYear -= 1;
      $scope.getMonth = 12;
    } else {
      $scope.getMonth -= 1;
    }
    console.log($scope.signSucDate.signYear, $scope.signSucDate.signMonth);
    console.log($scope.getYear, $scope.getMonth);
    $scope.monthFlag += 1;
    getSignFun($scope.userId, $scope.topicId, $scope.monthFlag, $scope.getYear, $scope.getMonth);
  };
  //下个月
  $scope.nextMonth = function () {
    if ($scope.getMonth + 1 == 13) {
      $scope.getYear += 1;
      $scope.getMonth = 1;
    } else {
      $scope.getMonth += 1;
    }
    console.log($scope.signSucDate.signYear, $scope.signSucDate.signMonth);
    console.log($scope.getYear, $scope.getMonth);
    $scope.monthFlag -= 1;
    getSignFun($scope.userId, $scope.topicId, $scope.monthFlag, $scope.getYear, $scope.getMonth);
  };
}]);

APP.service('signDateService', ['$http', 'UrlService', function ($http, UrlService) {
  //用户签到的日历
  this.getSignDate = function (userId, topicId, monthFlag, year, month) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('CIRCLE_SIGN_DATE'),
      data: {
        userId: userId,
        topicId: topicId,
        monthFlag: monthFlag,
        year: year,
        month: month
      }
    });
  };
  //确认补签
  this.getReplenishSign = function (replenishSignDate, signType, topicId, userId) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('CIRCLE_REPLENISH_SIGN'),
      data: {
        replenishSignDate: replenishSignDate,
        signType: signType,
        topicId: topicId,
        userId: userId
      }
    });
  };
  //获取用户信息方法
  this.getUserData = function (type, userId) {
    var postData = {
      type: type,
      id: userId
    };
    return $http({
      method: 'post',
      url: UrlService.getUrl('USER_SIMPLE_INFO'),
      data: postData
    });
    //return $http.get("data/userInfo.json", {});
  };
  //我的圈子接口
  this.getMyTopics = function (pageNumber, pageSize, userId) {
    return $http({
      method: 'post',
      url: UrlService.getUrl('GETMYTOPICLIST'),
      data: {
        pageIndex: pageNumber,
        pageSize: pageSize,
        userId: userId
      }
    });
  };
}]);
/*APP.filter('extraContentFilter',function() {
 return function(url) {
   return if(url.indexOf('http://mobiletest.ehaier.com')!=-1){
     url.spli
   }else{

   }
 };
});*/