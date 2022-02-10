/**
 * creator:feng.jiang@dhc.com.cn
 * create time:16/3/17
 * describe：RevenueDetailController   小店营收表单详细内容控制器
 **/
APP.controller('RevenueDetailController', ['$scope', '$stateParams', 'RevenueDetailService', '$rootScope', '$ionicPopup', 'PlatformService', 'ionicDatePicker', '$timeout',
  function($scope, $stateParams, RevenueDetailService, $rootScope, $ionicPopup, PlatformService, ionicDatePicker, $timeout) {
    /** 变量声明 **/
    $scope.nulldata = false; //没数据的默认展示
    $scope.type = $stateParams.code; //接受参数，用于判断营收类型
    $scope.title = $stateParams.title; //导航标题
    $scope.revenueList = []; //营收列表
    $scope.total = ''; //营收总额
    $scope.reward = {}; //预计收益中奖励相关内容
    $scope.rewardO = {}; //非预计收益中奖励相关内容
    $scope.isRewardA = false;
    $scope.isRewardB = false;
    $scope.isRewardC = false;
    $scope.isRewardY = false;
    $scope.isRewardZ = false;
    $scope.isRewardTZ = false;
    $scope.isRewardD = false;
    $scope.isRewardXY = false;
    $scope.startTime = '';
    $scope.endTime = '';
    $scope.rewardStart = '';
    $scope.rewardEnd = '';
    //请求参数
    $scope.earningType = $stateParams.earningType;
    var rewardType = 'all',
      page = 0,
      pageSize = 10;


    /** 方法 **/
    $scope.init = function() {
      $scope.earningType = $stateParams.earningType;
      page = 0;
      $scope.isRewardA = false;
      $scope.isRewardB = false;
      $scope.isRewardC = false;
      $scope.isRewardY = false;
      $scope.isRewardZ = false;
      $scope.isRewardTZ = false;
      $scope.isRewardD = false;
      $scope.isRewardYC = false;
      $scope.isRewardXY = false;
      if ($scope.type == 4) {
              $scope.rewardStart = tomindate();
              $scope.rewardEnd = tostrdate(new Date());
            }else{
              $scope.rewardStart = '';
              $scope.rewardEnd = '';
            }
      $scope.loadData($scope.earningType, $scope.type, rewardType, page, pageSize, $scope.rewardStart, $scope.rewardEnd);
    };

    $scope.loadData = function(earningType, type, rewardType, page, pageSize, rewardStart, rewardEnd) {
      RevenueDetailService.getRevenueList(earningType, type, rewardType, page, pageSize, rewardStart, rewardEnd)
        .success(function(response, status, headers, config) {
          console.log(response);
          $scope.nulldata = false;
          if (response.success) {
            $scope.total = response.data.total;
            if (response.data.reward) {
              $scope.reward = response.data.reward;
            }
            if (response.data.rewardO) {
              $scope.rewardO = response.data.rewardO;
            }
            
            if (type != 1) {
              if ($scope.total == '0' && response.data.rewardO.expectBrokerage == '' && response.data.rewardO.expectMonth == '' && response.data.rewardO.expectOpen == '' && response.data.rewardO.expectOpenCommend == '' && response.data.rewardO.expectRecommend == '' && response.data.rewardO.expectLeader == '' && response.data.rewardO.expectDzLeader == '' && response.data.rewardO.expectXyAmount == '' && response.data.rewardO.expectThreeLevel == '') {
                  $scope.nulldata = true;
                }
            }
            if (response.data.rewardA) {
              $scope.isRewardA = true;
            }
            if (response.data.rewardB && response.data.rewardB.length != 0) {
              $scope.isRewardB = true;
            }
            if (response.data.rewardC && response.data.rewardC.length != 0) {
              $scope.isRewardC = true;
            }
            if (response.data.rewardY && response.data.rewardY.length != 0) {
              $scope.isRewardY = true;
            }
            if (response.data.rewardZ && response.data.rewardZ.length != 0) {
              $scope.isRewardZ = true;
            }
            if (response.data.rewardTZ && response.data.rewardTZ.length != 0) {
              $scope.isRewardTZ = true;
            }
            if (response.data.rewardD && response.data.rewardD.length != 0) {
              $scope.isRewardD = true;
            }
            if (response.data.rewardXY && response.data.rewardXY.length != 0) {
              $scope.isRewardXY = true;
            }   
          } else {
            $scope.revenueList = [];
            console.log('返回数据有误！');
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };
    $scope.chooseTime = function() {
      $scope.startTime = $scope.rewardStart;
      $scope.endTime = $scope.rewardEnd;
      var myPopup = $ionicPopup.show({
        cssClass: 'xvv-popupTime',
        template: '<div class="xvv-Time"><div>选择时间</div><div ng-click="lookDateModel(1)"><p>开始</p><p>{{startTime}}</p></div><div><img src="http://cdn09.ehaier.com/shunguang/H5/www/img/goOrder@2x.png"/></div><div ng-click="lookDateModel(2)"><p>结束</p><p>{{endTime}}</p></div></div>',
        scope: $scope,
        buttons: [{
          text: '取消'
        }, {
          text: '确定',
          type: 'button-positive',
          onTap: function(e) {
            e.preventDefault();
            $scope.rewardStart = $scope.startTime;
            $scope.rewardEnd = $scope.endTime;
            myPopup.close();
            $scope.loadData($scope.earningType, $scope.type, rewardType, page, pageSize, $scope.rewardStart, $scope.rewardEnd);   
          }
        }]
      })
    }
    //调原生选择日期插件
    $scope.lookDateModel = function(twodata) {
      if (PlatformService.getPlatform() == 'APP') {
        var options = {
          date: new Date(),
          mode: 'date',
          cancelButton: false,
          locale: "zh-Hans" // ios 时间控件已经中国化 todo  android
        };
        datePicker.show(options, function(date) {
          var day = date.getDate();
          var month = date.getMonth() + 1;
          var year = date.getFullYear();
          if (month < 10) {
            month = '0' + month;
          }
          if (day < 10) {
            day = '0' + day;
          }
          $timeout(function() {
            if (twodata == 1) {
              $scope.startTime = year + '年' + month + '月' + day + '日';
            }
            if (twodata == 2) {
              $scope.endTime = year + '年' + month + '月' + day + '日';
            }
          }, 200);
        });
      } else {
        var ipObj1 = {
          inputDate: new Date(),
          weeksList: ['日', '一', '二', '三', '四', '五', '六'],
          monthsList: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          from: new Date(1900, 1, 1), //Optional
          to: new Date(), //Optional
          mondayFirst: true, //Optional
          closeOnSelect: false, //Optional
          templateType: 'popup',
          setLabel: '设置',
          closeLabel: '关闭',
          dateFormat: 'yyyy-MM-dd',
          callback: function(val) {
            var monthWeb = new Date(val).getMonth() + 1;
            var dayWeb = new Date(val).getDate();
            if (monthWeb < 10) {
              monthWeb = '0' + monthWeb;
            }
            if (dayWeb < 10) {
              dayWeb = '0' + dayWeb;
            }
            if (twodata == 1) {
              $scope.startTime = new Date(val).getFullYear() + '年' + monthWeb + '月' + dayWeb + '日';
            }
            if (twodata == 2) {
              $scope.endTime = new Date(val).getFullYear() + '年' + monthWeb + '月' + dayWeb + '日';
            }

          }
        };
        ionicDatePicker.openDatePicker(ipObj1);
      }
    }
    //2018/01/01转换为2018年01月01日
    //new data转换为2018/01/01
    function tostrdate(date) {
      var date = date.getFullYear() + '年' + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '月' + (date.getDate() > 9 ? date.getDate() : ('0' + date.getDate())) + '日';
      console.log(date);
      return date;
    }

    function tomindate() {
      var Nowdate = new Date();
      var vYear = Nowdate.getFullYear();
       var vMon = Nowdate.getMonth() + 1;
       var vDay = Nowdate.getDate();
       var daysInMonth = new Array(0,31,28,31,30,31,30,31,31,30,31,30,31);
        if(vMon==1){
            vYear = Nowdate.getFullYear()-1;
            vMon = 12;
        }else{
            vMon = vMon -1;
        }
        if(vYear%4 == 0 && vYear%100 != 0  || vYear%400 == 0 ){
        daysInMonth[2]= 29;
       }
       if(daysInMonth[vMon] < vDay){
       vDay = daysInMonth[vMon];
       }
       if(vDay<10){
           vDay="0"+vDay;
        }
        if(vMon<10){
           vMon="0"+vMon;
       }
        var date =vYear + "年"+ vMon + "月" + vDay + "日";
       console.log(date)
       return date;
    }
    $scope.$on('$ionicView.beforeEnter', function(e,v) {
      if (v.direction == 'back'){
        
      }else{
        $scope.init();
      } 
    });

  }
]);


/**
 * creator:feng.jiang@dhc.com.cn
 * create time:16/3/30
 * describe：营收提现详细服务
 **/
APP.service('RevenueDetailService', ['$http', 'UrlService', function($http, UrlService) {
  this.getRevenueList = function(earningType, type, rewardType, page, pageSize, beginDate, endDate) {
    var params = {
      earningType: earningType,
      type: type,
      rewardType: rewardType,
      page: page,
      pageSize: pageSize,
      beginDate: beginDate,
      endDate: endDate
    };
    return $http.get(UrlService.getUrl('REVENUE_LIST'), params);
  };
}]);
