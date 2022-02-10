'use strict';

/**
 *  start @ zyr 2017.08.04
 */
APP.controller('storeTeamOwnerController', ['$http', '$scope', '$cacheFactory', 'storeTeamOwnerService', '$stateParams', '$ionicSlideBoxDelegate', '$state', '$ionicSideMenuDelegate', '$cookieStore', 'UserService', '$ionicPopup', '$timeout', 'LoginService', '$rootScope', '$ionicScrollDelegate', '$ionicModal', 'BannerThemeService', '$localstorage', 'VersionService', 'PopupService', 'PersonalCenterService','HomePageService', 'ShopService', function ($http, $scope, $cacheFactory, storeTeamOwnerService, $stateParams, $ionicSlideBoxDelegate, $state, $ionicSideMenuDelegate, $cookieStore, UserService, $ionicPopup, $timeout, LoginService, $rootScope, $ionicScrollDelegate, $ionicModal, BannerThemeService, $localstorage, VersionService, PopupService, PersonalCenterService,HomePageService,ShopService) {
  $scope.navtabs = [{ 'title': '店铺数据' }, { 'title': '团队数据' }, { 'title': '个人数据' }];
  $scope.flagNum = false;
  $scope.messageImgUrl = "http://cdn09.ehaier.com/shunguang/H5/www/img/message_gray@2x.png";
  if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
    //只有ios app 特有的样式
    $scope.paddingtopClass = {
      "margin-top": "16px"
    };
    $scope.paddingtopClasscontent = {
      "top": "60px"
    };
  } else {
    $scope.paddingtopClass = {
      "margin-top": "0px"
    };
    $scope.paddingtopClasscontent = {
      "top": "44px"
    };
  }
  function getStoreData(visitType, daysType) {
    storeTeamOwnerService.storeInfo({ visitType: visitType, daysType: daysType }).success(function (response) {
      if (response.success == true) {
        $scope.storeVisitInfo = response.data.storeVisitInfo;
        $scope.commonVisitList = response.data.commonVisitList;
        console.log(response.data);
      }
    });
  }
  //排序
  function sortObj(obj) {
    var arr = [];
    for (var i in obj) {
      arr.push([obj[i], i]);
    };
    arr.reverse();
    console.log(arr);
    var len = arr.length;
    var obj = [];
    for (var i = 0; i < len; i++) {
      obj.push({ date: arr[i][1], act: arr[i][0] });
    }
    return obj;
  }
  // 缓存 数据
  // $scope.$emit('userObj',{

  // })

  $scope.setStorage = function (img, name, time, where, userId, daysType) {
    $scope.userinfo = {
      img: img,
      name: name,
      time: time,
      where: where
    };
    storeTeamOwnerService.visitorInfo = $scope.userinfo;
    storeTeamOwnerService.getVisitorBrowHis(userId, daysType).success(function(response){
      if (response.success) {
        $scope.visiProductList = response.data;
        if ($scope.visiProductList.length == 0) {
          return false;
        } else {
          //ui-sref='VisitorBrowHistory({userId: visitor.userId,daysType:daysType})';
          $state.go('VisitorBrowHistory',{userId: userId, daysType:daysType});
        }
      }
    });

  };
  // 用户 memberId
  // $scope.memberId = UserService.getUser().mid;
  //切换 tab
  $scope.storeActived = true;
  $scope.teamActived = false;
  $scope.ownerActived = false;
  // 详细页面的 title
  $scope.partnerTitle = 'partner';
  $scope.teamTitle = 'team';
  $scope.switchType = function (index) {
    if (!$scope.typeState[index]) {
      $scope.typeState = [false, false, false];
      $scope.typeState[index] = true;
      //
    }
    if (index == 0) {
      //店铺数据
      console.log(index);
      $scope.storeActived = true;
      $scope.teamActived = false;
      $scope.ownerActived = false;
      getStoreData($scope.visitType, $scope.daysType);
    } else if (index == 1) {
      //团队数据
      console.log(index);
      $scope.storeActived = false;
      $scope.teamActived = true;
      $scope.ownerActived = false;
      storeTeamOwnerService.teamInfo().success(function (response) {
        if (response.success == true) {
          $scope.teamDetail = response.data;
        }
      });
    } else if (index == 2) {
      //个人数据
      console.log(index);
      $scope.storeActived = false;
      $scope.teamActived = false;
      $scope.ownerActived = true;
      storeTeamOwnerService.ownerInfo().success(function (response) {
        if (response.success == true) {
          $scope.ownerDetail = response.data;
          $scope.ownerMonthReport = response.data.storeMemberMonthReport;
          $scope.ownerteamLevel = response.data.teamLevel;
          $scope.items = response.data.map;
          var lists = sortObj(response.data.map);
          console.log(lists);
          $scope.lists = lists;
        }
      });
      storeTeamOwnerService.ownerCommi().success(function (response) {
        if (response.success == true) {
          //预计佣金
          $scope.predictCommi = response.data.newBrokerageAmount;
          //累计佣金
          $scope.totalCommi = response.data.totalBrokerageAmount;
        }
      });
    }
    $ionicScrollDelegate.scrollTop();
  };
  $scope.dayType = function (index) {
    if (!$scope.dayState[index]) {
      $scope.dayState = [false, false];
      $scope.dayState[index] = true;
    }
    if (index == 0) {
      $scope.rankText = '7天访客排行榜';
      $scope.daysType = 'WEEK';
      getStoreData($scope.visitType, $scope.daysType);
    } else if (index == 1) {
      $scope.rankText = '30天访客排行榜';
      $scope.daysType = 'MONTH';
      getStoreData($scope.visitType, $scope.daysType);
    }
  };

  $scope.$on('$ionicView.beforeEnter', function (e, v) {
    if (v.direction == 'back') {
      HomePageService.getUnReadMsg()
      .success(function (res) {
        if (res.data > 0) {
          $scope.flagNum = true;
        } else {
          $scope.flagNum = false;
        }
      })
      return;
    }
    //接受上个页面参数
    // $scope.userMemberId = PersonalCenterService.userMemberId;
    // console.log($scope.userMemberId);
    //获取memberId yl
    // ShopService.getMessage()
    //   .success(function (response) {
    //     if (response.success) {
    //       $scope.userMemberId= response.data.memberId;
    //     }
    // })
    $scope.userMemberId= JSON.parse(localStorage.getItem('USER_CACHE_KEY')).mid || '';
    $scope.typeState = [true, false, false];
    $scope.dayState = [true, false];
    // 店铺数据 的 排行榜 列表 描述
    $scope.rankText = '7天访客排行榜';
    //默认 最近7天
    $scope.daysType = 'WEEK';
    $scope.visitType = 'STORE';
    $scope.init();
  });
  // days 最近7天 最近30天 切换
  $scope.days = [{ 'text': '最近7天' }, { 'text': '最近30天' }];

  // 历史 数据弹窗
  $scope.items = {};
  $scope.openHis = function () {
    var myPopup = $ionicPopup.show({
      template: '\n          <div class=\'his-box\' scrollbar-y="false">\n            <h3>\u5386\u53F2\u56E2\u961F\u6D3B\u8DC3\u5EA6</h3>\n            <h5>\u6700\u8FD112\u4E2A\u6708</h5>\n            <div class=\'his-nav\' flex=\'main:justify cross:center\'>\n              <div>\u5E74/\u6708</div>\n              <div>\u6D3B\u8DC3\u5EA6</div>\n            </div>\n            <div class=\'his-list\'>\n              <div class=\'his-item\' ng-repeat=\'list in lists\' flex=\'main:justify cross:center\'>\n                <div class=\'his-month\'>{{list.date}}</div>\n                <div class=\'his-act\'>{{list.act}}%</div>\n              </div>\n            </div>\n            <div class=\'his-close\'>\n              <div class="close-img" ng-click=\'closeHis()\'>\n                <img ng-src="{{imgBaseURL}}img/hisClose@2x.png" alt="\u5173\u95ED" />\n              </div>\n              <span class=\'close-bor\'></span>\n            </div>\n          </div>\n        ',
      scope: $scope
    });
    $scope.closeHis = function () {
      myPopup.close();
    };
  };
  // 返回按钮
  $scope.goBack = function () {
    $scope.$ionicGoBack();
  };
  var user = UserService.getUser();
  console.log(user);
  // 默认请求

  /* $scope.daysType = 'WEEK';
   $scope.visitType = 'STORE';
   storeTeamOwnerService.storeInfo({visitType:$scope.visitType,daysType:$scope.daysType}).success(function(response){
     if (response.success == true) {
       $scope.storeVisitInfo = response.data.storeVisitInfo;
       $scope.commonVisitList = response.data.commonVisitList;
       console.log(response.data);
     }
   })*/
  $scope.init = function () {
    getStoreData($scope.visitType, $scope.daysType);
    $scope.storeActived = true;
    $scope.teamActived = false;
    $scope.ownerActived = false;
    HomePageService.getUnReadMsg()
      .success(function (res) {
        if (res.data > 0) {
          $scope.flagNum = true;
        } else {
          $scope.flagNum = false;
        }
      })
  };
  // 时间过滤
  // 进度条
  $scope.PercentageCal = function (a, b) {
    var num = parseFloat(a);
    var total = parseFloat(b);
    if (total > num) {
      if (isNaN(num) || isNaN(total)) {
        return "-";
      }
      return total <= 0 ? "0%" : Math.round(num / total * 10000) / 100.00 + "%";
    } else {
      return "100%";
    }
  };
}]);

APP.service('storeTeamOwnerService', ['$http', 'UrlService', function ($http, UrlService) {
  //店铺数据 请求
  this.storeInfo = function (param) {
    var url = UrlService.getUrl('GET_STORE_DATA');
    return $http.get(url, param);
  };
  //团队数据 请求
  this.teamInfo = function (param) {
    var url = UrlService.getUrl('GET_TEAM_DATA');
    return $http.get(url, param);
  };
  //个人数据 请求
  this.ownerInfo = function (param) {
    var url = UrlService.getUrl('GET_OWNER_DATA');
    return $http.get(url, param);
  };
  //  个人数据的 佣金
  this.ownerCommi = function (param) {
    var url = UrlService.getUrl('REPORT_DETAIL_PLUS');
    return $http.get(url, param);
  };
  // 访客信息
  this.visitorInfo = '';
  // 加载访客浏览商品的记录
  this.getVisitorBrowHis = function (userId, daysType) {
    var params = {
      'userId': userId,
      'daysType': daysType
    };
    return $http.get(UrlService.getUrl('GET_VISI_BROW_HIS'), params);
  };
}]);
