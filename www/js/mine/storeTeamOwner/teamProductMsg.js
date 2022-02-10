APP.controller('teamProductMsgController', ['storeTeamOwnerService','$http', '$scope', 'teamProductMsgService', '$stateParams', '$ionicSlideBoxDelegate',
  '$state', '$ionicSideMenuDelegate', '$cookieStore', 'UserService', '$ionicPopup', '$timeout',
  'LoginService', '$rootScope', '$ionicScrollDelegate', '$ionicModal', 'BannerThemeService',
  '$localstorage', 'VersionService', 'PopupService',
  function(storeTeamOwnerService,$http, $scope, teamProductMsgService, $stateParams, $ionicSlideBoxDelegate, $state, $ionicSideMenuDelegate, $cookieStore, UserService, $ionicPopup, $timeout, LoginService, $rootScope, $ionicScrollDelegate, $ionicModal, BannerThemeService, $localstorage, VersionService, PopupService) {
    //定义变量
    $scope.data = [];
    $scope.statisticDays = [];
    var clearChartdom = '';
    var titleData1 = '';
    var titleData2 = '';
    var titleData = '';

    $scope.titleList = ['访客数', '浏览次数', '商品访客数', '商品浏览量', '分享访问人数', '分享访问次数']

    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) { //只有ios app 特有的样式
      $scope.paddingtopClass = {
        "margin-top": "16px"
      };
      $scope.paddingtopClasscontent = {
        "top": "60px"
      }
    } else {
      $scope.paddingtopClass = {
        "margin-top": "0px"
      };
      $scope.paddingtopClasscontent = {
        "top": "44px"
      }
    }

    function circlePic(){
      var dom = document.getElementById("shopRevenueChart");
      var myChart = echarts.init(dom);
      clearChartdom = myChart;
      var option = null;
      //走势图
      option = {
        title: {
          text: titleData,
          left: '30%',
          top: '2%',
          textStyle: {
                fontWeight: 'normal',              //标题颜色
                fontSize: 14,
                color: '#172434',
                letterSpacing: 0,
                lineHeight: 14
            },
        },
        // grid: {
        //   left: '14%',
        //   top: '18%',
        //   right: '5%',
        //   bottom: '15%'
        // },
        tooltip: {
          trigger: 'axis',
          formatter: "{c}",
          axisPointer: {
            type: 'none'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: $scope.statisticDays,
          // data: [7.1,7.2,7.3,7.4,7.5,7.6,7.7],
          axisLabel: {
            interval: 0,
            rotate: 0,
            textStyle: {
              fontSize: 8,
              color: '#7b7b7b'
            }
          },
          splitLine: {
            lineStyle: {
              color: ['#ffffff'],
              width: 1
            }
          },
          axisLine: {
            lineStyle: {
              color: '#dedede'
            }
          },
          axisTick: {
            lineStyle: {
              color: '#dedede'
            }
          }
        },
        yAxis: [{
          type: 'value',
          splitLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              fontSize: 8,
              color: '#7b7b7b'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#dedede'
            }
          },
          axisTick: {
            lineStyle: {
              color: '#dedede'
            }
          }
        }],
        series: [{
          name: '统计',
          type: 'line',
          symbolSize: 8,
          areaStyle: {
            normal: {
              color: '#cee9f6'
            }
          },
          lineStyle: {
            color: '#37bfff'
          },
          itemStyle: {
            normal: {
              color: '#37bfff'
            }
          },
          data: $scope.data
          // data: ['1','2','3','4','5','6','7']
        }]
      };
      if (option && typeof option === "object") {
        myChart.setOption(option, true);
        myChart.setOption(option);
      }
    }

    function dataMoW(typeNums,stoViInfo){
      if(typeNums == 1){
        titleData2 = stoViInfo.storeUv;
        return;
      }
      if(typeNums == 2){
        titleData2 = stoViInfo.storePv;
        return;
      }
      if(typeNums == 3){
        titleData2 = stoViInfo.productUv;
        return;
      }
      if(typeNums == 4){
        titleData2 = stoViInfo.productPv;
        return;
      }
      if(typeNums == 5){
        titleData2 = stoViInfo.shareUv;
        return;
      }
      if(typeNums == 6){
        titleData2 = stoViInfo.sharePv;
        return;
      }
    }

    function weekOrMonth(wOrm,typeDays,typeNums,stoViInfo){
      for (var i = 0; i < wOrm.length; i++) {
        $scope.statisticDays.push(wOrm[i].statisticDays);
        if(typeNums == 1){
          $scope.data.push(wOrm[i].storeUv);
        }else if (typeNums == 2) {
          $scope.data.push(wOrm[i].storePv);
        }else if (typeNums == 3) {
          $scope.data.push(wOrm[i].productUv);
        }else if (typeNums == 4) {
          $scope.data.push(wOrm[i].productPv);
        }else if (typeNums == 5) {
          $scope.data.push(wOrm[i].shareUv);
        }else if (typeNums == 6) {
          $scope.data.push(wOrm[i].sharePv);
        }
      }
      if(typeDays == 'WEEK'){
        dataMoW(typeNums,stoViInfo);
        titleData1 = 7;
        titleData = '最近'+titleData1+'天'+': '+titleData2 + $scope.titleText;
      }else{
        dataMoW(typeNums,stoViInfo);
        titleData1 = 30;
        titleData = '最近'+titleData1+'天'+': '+titleData2 + $scope.titleText;
      }
    }

    //入口
    $scope.commonFun = function(number, days) {
      teamProductMsgService.storeInfo(number, days)
        .success(function(response) {
          if (response.success) {
            $scope.commonVisitList = response.data.commonVisitList; // 访客数据
            $scope.daysType=response.data.commonVisitDetail.statisticDays==7?'WEEK':'MONTH';
            $scope.commonVisitDetail = response.data.commonVisitDetail; // 平台次数
            $scope.myInComeOut = response.data.commonVisitTendencyList; // 走势数据
            $scope.storeVisitInfo = response.data.storeVisitInfo;//近期方可总数
            if ($scope.num == 1) {
              weekOrMonth($scope.myInComeOut,days,$scope.num,$scope.storeVisitInfo);
              circlePic();
            } else
            if ($scope.num == 2) {
              weekOrMonth($scope.myInComeOut,days,$scope.num,$scope.storeVisitInfo);
              circlePic();
            } else
            if ($scope.num == 3) {
              weekOrMonth($scope.myInComeOut,days,$scope.num,$scope.storeVisitInfo);
              circlePic();
            } else
            if ($scope.num == 4) {
              weekOrMonth($scope.myInComeOut,days,$scope.num,$scope.storeVisitInfo);
              circlePic();
            } else
            if ($scope.num == 5) {
              weekOrMonth($scope.myInComeOut,days,$scope.num,$scope.storeVisitInfo);
              circlePic();
            } else
            if ($scope.num == 6) {
              weekOrMonth($scope.myInComeOut,days,$scope.num,$scope.storeVisitInfo);
              circlePic();
            }
          } else {
            console.log('没拿到数据');
          }
        });
    };

    //初始化
    $scope.init = function() {
      if (($scope.num == 1 || $scope.num == 2) && ($scope.days == 'WEEK' || $scope.days == 'MONTH')) { //平台访客数
        $scope.store = 'STORE';
        $scope.commonFun($scope.store, $scope.days);
      } else
      if (($scope.num == 3 || $scope.num == 4) && ($scope.days == 'WEEK' || $scope.days == 'MONTH')) { //商品访客数
        $scope.product = 'PRODUCT';
        $scope.commonFun($scope.product, $scope.days);
      } else
      if (($scope.num == 5 || $scope.num == 6) && ($scope.days == 'WEEK' || $scope.days == 'MONTH')) { //分享访客数
        $scope.share = 'SHARE';
        $scope.commonFun($scope.share, $scope.days);
      }
      if ($scope.num == 1 || $scope.num == 3 || $scope.num == 5) {
        $scope.personNum = true;
        $scope.titleText = '人';
      } else if ($scope.num == 2 || $scope.num == 4 || $scope.num == 6) {
        $scope.titleText = '次';
      }
    };
    $scope.setStorage = function(num, img,name,time,where, userId, daysType) {
      if (num == 3 || num ==4) {
        $scope.userinfo = {
          img: img,
          name: name,
          time: time,
          where: where
        }
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
      } else {
        return false;
      }
      
    }
    // 返回按钮
    $scope.goBack = function() {
      $scope.$ionicGoBack();
    }
    $scope.$on('$ionicView.beforeEnter', function() {
      titleData1 = '';
      titleData2 = '';
      titleData = '';
      $scope.num = $stateParams.num; //确定入口
      $scope.days = $stateParams.type; //确定入口
      $scope.data = [];
      $scope.statisticDays = [];
      $scope.fsfsafa = true;
      $scope.init();
    });
    $scope.$on('$ionicView.beforeLeave', function() {
      if(clearChartdom){
        clearChartdom.dispose();
      }
      $scope.fsfsafa = false;
    });
  }
]);


APP.service('teamProductMsgService', ['$http', 'UrlService', function($http, UrlService) {
  //店铺数据 请求
  this.storeInfo = function(visitType, daysType) {
    var params = {
      visitType: visitType,
      daysType: daysType
    };
    return $http.get(UrlService.getUrl('STORE_PRODUCT'), params);
  };
}]);
