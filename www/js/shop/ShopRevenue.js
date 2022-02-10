/**
 * creator:feng.jiang@dhc.com.cn
 * create time:16/3/16
 * describe：ShopRevenueController  小店营收控制器
 **/
APP.controller('ShopRevenueController', ['$scope', '$state', '$ionicHistory', 'ShopRevenueService','PopupService','InAppBrowserService','UrlService',
  function ($scope, $state, $ionicHistory, ShopRevenueService,PopupService,InAppBrowserService,UrlService) {

    /***变量声明***/
    $scope.styleFlag = true;//样式切换标识变量
    $scope.myInComeOut = {};
    $scope.myTrendOut = {};
    //$scope.kjtIsBind = false;  //是否绑定了快捷通
    $scope.earningType = '';    //营收商品类型
    var range = 7;       //营收数据统计范围（7天）
    var accountState = 0;//提现账户状态
    $scope.totalCommission = '';//总佣金收益
    $scope.messaegBalance = '';  //快捷通余额显示
    $scope.numFlag = true;//快捷通余额显示标识
    var isHasBindNums = '';
    /***方法***/

    $scope.init = function () {
      $scope.myInComeOut = [];
      $scope.myTrendOut = [];
      $scope.styleFlag = true;
      $scope.earningType = 'B';
      $scope.loadData(range, $scope.earningType);
      isHasBindBankNums();
      getAccountState($scope.earningType);
      getTotalCommission();


      ShopRevenueService.getKjtBalance()
        .success(function(response){
          if(response.success){
            $scope.messaegBalance = '￥' + response.data.a;
            window.localStorage.setItem('darcy_ktj_token', response.data.t);
            $scope.numFlag = true;
          }else{
            $scope.messaegBalance = response.message;
            $scope.numFlag = false;
          }
        })
        .error(function(error){
          console.log('接口请求错误！')
        })

    };
//查看绑定银行卡张数
    function isHasBindBankNums(){
      ShopRevenueService.isHasBindBankNum()
        .success(function(response){
          if(response.success){
            isHasBindNums = response.data;
          }
        })
    }

    $scope.loadData=function(range,earningType){
      ShopRevenueService.getRevenueInfo(range, earningType)
        .success(function (response, status, headers, config) {
          $scope.myInComeOut = response.data.myInComeOut;
          $scope.myTrendOut = response.data.myTrendOut;
          var myChart = echarts.init(document.getElementById('shopRevenueChart'));
          var str = $scope.myTrendOut.dates;
          for(var i=0;i<$scope.myTrendOut.dates.length;i++)
          {
            str = str.replace('\'','');
          }

          // 指定图表的配置项和数据
          var option = {
            grid: {
              show:true,
              left: '10%',
              top: '5%',
              right: '5%',
              bottom: '15%',
              padding:20,
              backgroundColor:new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                  offset: 0,
                  color: '#1188D7'
              }, {
                  offset: 1,
                  color: '#3CA9F1'
              }]),
            },
            tooltip: {
              trigger: 'axis',
              formatter: "{c}",
              axisPointer: {
                type: 'line',
                lineStyle:{
                  color:'rgba(255,255,255,0.2)',
                  width:2
                }
              }
            },
            xAxis: {
              type : 'category',
              boundaryGap : false,
              data: str.split(','),
              axisLabel:{
                interval: 0,
                rotate: 0,
                textStyle: {
                  fontSize: 8,
                  color: '#7b7b7b'
                }
              },
              splitLine : {
                lineStyle: {
                  color:['#ffffff'],
                  width:1
                }
              },
              axisLine:{
                lineStyle:{
                  color:'#dedede',
                  width:1
                }
              },
              axisTick:{
                lineStyle:{
                  color:'#dedede',
                  width:1
                }
              }
            },
            yAxis: [{
              type: 'value',
              backgroundColor:'#1188D7',
              splitLine : {
                show: false
              },
              axisLabel: {
                textStyle: {
                  fontSize: 8,
                  color: '#7b7b7b'
                }
              },
              axisLine:{
                lineStyle:{
                  color:'#dedede'
                }
              },
              axisTick:{
                lineStyle:{
                  color:'#dedede'
                }
              }
            }],
            series: [{
              name: '统计',
              type: 'line',
              symbol:'circle',
              showSymbol:false,
              symbolSize:6,
              smooth:true,
              areaStyle: {
                normal:{
                  color: 'rgba(255,255,255,0.10)'
                }
              },
              itemStyle: {
                normal: {
                  borderWidth:2,
                  borderColor:'#ffffff',
                  color:'#1188D7',
                 lineStyle: {
                    color: '#ffffff',
                    width: 2
                  },

                }
              },
              data: $scope.myTrendOut.values.split(',')
            }]
          };
          // 使用刚指定的配置项和数据显示图表。
          myChart.setOption(option);
        });

    };
    /*切换商品类型（代理or自营）*/
    var stopQuickFlag = true;//防止短时间内重复点击
    $scope.changeProductType = function (type,flag) {
      if(stopQuickFlag){
        $scope.styleFlag = flag;
        stopQuickFlag = false;
        $scope.earningType = type;
        $scope.loadData(range,$scope.earningType);
        setTimeout(function(){
          stopQuickFlag = true;
        },500);
      }
    };

    //展示富文本
    $scope.goHelpDetail = function(){
      var u = navigator.userAgent;
      if (u.indexOf('iPhone') != -1) {
        var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=' + 15,'营收结算规则');
        ref.addEventListener('exit', function (event) {
        });
      } else {
        $state.go('helpDetail', {'helpId': 15,'content':'营收结算规则'});
      }
    };

    //获取提现账户状态方法
    function getAccountState(earningType){
      ShopRevenueService.getAccountState(earningType)
        .success(function(response){
          if(response.success){
            accountState = response.data;
          }
        })
    }
    //提现按钮点击方法
    var dukeQuickFlag = true;//防止短时间内重复点击
    $scope.withdraw = function() {
      if(dukeQuickFlag){
        dukeQuickFlag = false;
        if (accountState == 1 || accountState == 3 || accountState == 4 || parseInt(isHasBindNums) > 0) {
          if ($scope.myInComeOut) {
            $state.go('mentionCenter', {
              canAmount: $scope.myInComeOut.canAmount
            });
          } else {
            $state.go('mentionCenter', {
              canAmount: 0
            });
          }
        } else {
          $state.go('bankCard');
        }
        setTimeout(function(){
          dukeQuickFlag = true;
        },2000);
      }     
    };
    //页面返回
    $scope.goBack = function () {
      //$ionicHistory.goBack();
      //判断wap是否能获取到上一页路由 没有则返回首页
      if (!$ionicHistory.backView()||$ionicHistory.viewHistory().backView.stateName == 'mentionCenter') {
        $state.go('homePage');
        return;
      }
      ($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('login') > 0) ? $ionicHistory.goBack(-2) : $ionicHistory.goBack();
    };

    //关闭弹窗
    $scope.closePopup = function(){
      $scope.loginIsAuthentication = false;
    }

    function getTotalCommission(){
      ShopRevenueService.getTotalCommission()
        .success(function(response){
          if(response.data.isLogin){
            $scope.totalCommission = response.data.totalReward;
          }else{
            $scope.totalCommission = '';
          }
        })
        .error(function(error){
          console.log('接口请求错误！')
        })
    }

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.loginIsAuthentication = false;
      $scope.loginIsAuthenticationClose = true;
      isHasBindNums = '';
      $scope.init();
    })

  }]);


/**
 * creator:feng.jiang@dhc.com.cn
 * create time:16/3/29
 * describe：小店营收服务
 **/
APP.service('ShopRevenueService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getRevenueInfo = function (range, earningType) {
    var params = {
      range: range,
      earningType: earningType
    };
    return $http.get(UrlService.getUrl('REVENUE_INFO'), params);
  };
  this.getAccountState = function (earningType) {
    var params = {
      earningType:earningType
    };
    return $http.get(UrlService.getUrl('GET_ACCOUNT_STATE'),params);
  };
  //设置绑定
  this.bind = function () {
    /* return $http.get(UrlService.getUrl('KBIND_INIT'));*/
    return $http.get(UrlService.getUrl('KBIND_INIT'));
  };
  //设置激活
  this.activation = function () {
    /* return $http.get(UrlService.getUrl('KBIND_ACTIVATION'));*/
    return $http.get(UrlService.getUrl('KBIND_ACTIVATION'));
  };
  //是否绑定银行卡
  this.isHasBindBankNum = function () {
    return $http.get(UrlService.getUrl('BANK_HASBINGNUM_NEW'));
  };
  //设置认证
  this.realName = function () {
    /* return $http.get(UrlService.getUrl('KBIND_REALNAME'));*/
    return $http.get(UrlService.getUrl('KBIND_REALNAME'));
  };
  this.getTotalCommission = function(){
    var params = {
      startDate:'',
      endDate:''
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('GET_TOTAL_COMMISSION'),
      params: params
    });
  };

  this.getKjtBalance = function () {
    return $http.get(UrlService.getUrl('GETKJTACCOUNT'));
  }
}]);
