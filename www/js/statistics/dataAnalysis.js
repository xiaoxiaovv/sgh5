APP.controller('dataAnalysisController',['$scope','$ionicHistory','$ionicPopup','$ionicScrollDelegate','$stateParams','dataAnalysisService',function($scope,$ionicHistory,$ionicPopup,$ionicScrollDelegate,$stateParams,dataAnalysisService){
  if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
    $scope.paddingtopClass = {
      "margin-top": "16px"
    };
    $scope.paddingtopClasscontent = {
      "top": "60px"
    }
  }else{
    $scope.paddingtopClass = {
      "margin-top": "0px"
    };
    $scope.paddingtopClasscontent = {
      "top": "44px"
    }
  }

  function styleInit1(){
    $scope.byStyle = {
      'color':'#2979FF',
      'border-bottom':"2px solid #2979FF"
    }
    $scope.lgStyle = {
      'color':'#666',
      'border-bottom':"0 solid #2979FF"
    }
  }

  function styleInit2(){
    $scope.byStyleActive = {
      'color':'#2979FF',
      'border-bottom':"2px solid #2979FF"
    }
    $scope.lgStyleActive = {
      'color':'#666',
      'border-bottom':"0 solid #2979FF"
    }
  }
  function styleInit3(){
    $scope.cityByStyle = {
      'color':'#2979FF',
      'border-bottom':"2px solid #2979FF"
    }
    $scope.cityLgStyle = {
      'color':'#666',
      'border-bottom':"0 solid #2979FF"
    }
  }

  $scope.goBack = function() {
    $ionicHistory.goBack();
  };
  $scope.PercentageCal = function(a,b){
    num = parseFloat(a);
    total = parseFloat(b);
    if (isNaN(num) || isNaN(total)) {
    return "-";
    }
    return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00 + "%");
  }
  var datas;
  var datasL;
  var dataActy;
  var chooseType = '本月';
  var partnerMid = '';
  var clearChartdom1;
  var clearChartdom2;
  $scope.isHasData = false;

  function dataInitChoTy(){
    datas = [{
      value: '',
      name: ''
    }, {
      value: '',
      name: ''
    }, {
      value: '',
      name: ''
    }, {
      value: '',
      name: ''
    }, {
      value: '',
      name: ''
    }, {
      value: '',
      name: ''
    }, {
      value: '',
      name: ''
    }, {
      value: '',
      name: ''
    }, {
      value: '',
      name: ''
    }, {
      value: '',
      name: ''
    }, {
      value: '',
      name: ''
    }];
    datasL = [];
  }

  function pieChart() {
    var dom = document.getElementById("container");
    var myChart = echarts.init(dom);
    clearChartdom1 = myChart;
    var app = {};
    var option = null;
    option = {
      graphic: {
        type: 'text',
        left: 'center',
        top: 'center',
        z: 99,
        zLevel: 100,
        style: {
          text: chooseType,
          x: 100,
          y: 100,
          width: 30,
          height: 30
        }
      },
      legend: {
        selectedMode: false,
        x: 'center',
        y: 'bottom',
        data: datasL,
        itemHeight:9,
        itemWidth:9
      },
      clickable: false,
      series: [{
        name: '半径模式',
        type: 'pie',
        radius: [15, 75],
        center: ['50%', "50%"],
        roseType: 'area',
        x: '50%', // for funnel
        max: 40, // for funnel
        sort: 'ascending', // for funnel
        clickable:false,
        label: {
          normal: {
            formatter: '{d}%',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 12
            }
          }
        },
        itemStyle: {
                      normal: {
                          color: function(param) {
                              var colorList = [
                                  '#FB497C',
                                  '#FFBB41',
                                  '#6FE621',
                                  '#4FCCFF',
                                  '#4D7BF3',
                                  '#b7009b',
                                  '#32af01',
                                  '#c10037'
                              ];
                              return colorList[param.dataIndex]
                          }
                      }
                  },
        data: datas,
      }]
    };

    if (option && typeof option === "object") {
      myChart.setOption(option, true);
      myChart.setOption(option);
    }
  }

  function lineChart() {
    var dom = document.getElementById("activeContenter");
    var myChart = echarts.init(dom);
    clearChartdom2 = myChart;
    var app = {};
    var options = null;
    options = {
      title: {
        subtext: '单位：次'
      },
      calculable: true,
      xAxis: [{
        type: 'category',
        axisTick:{
          lineStyle:{
            color:'#fff'
          }
        },
        axisLine:{
          lineStyle:{
            color:'#dedede'
          }
        },
        data: [{
          value: '分享\n店铺',
          textStyle: {
            fontSize: '12',
            color: '#37394C'
          }
        }, {
          value: '分享\n商品',
          textStyle: {
            fontSize: '12',
            color: '#37394C'
          }
        }, {
          value: '任务\n完成',
          textStyle: {
            fontSize: '12',
            color: '#37394C'
          }
        }, {
          value: '社区\n互动',
          textStyle: {
            fontSize: '12',
            color: '#37394C'
          }
        }, {
          value: '评价\n次数',
          textStyle: {
            fontSize: '12',
            color: '#37394C'
          }
        }, {
          value: '登录\n次数',
          textStyle: {
            fontSize: '12',
            color: '#37394C'
          }
        }]
      }],
      yAxis: [{
        axisLabel:{
          textStyle: {
            fontSize: '12',
            color: '#37394C'
          }
        },
        type: 'value',
        splitNumber: 2,
        axisTick:{
          lineStyle:{
            color:'#fff'
          }
        },
        axisLine:{
          lineStyle:{
            color:'#fff'
          }
        }
      }],
      series: [{
        name: '完成了',
        type: 'bar',
        itemStyle: {
                      normal: {
                          color: function(param) {
                              var colorList = [
                                  '#67AAF9'
                              ];
                              return colorList[0]
                          }
                      }
                  },
        barWidth:'7',
        data: dataActy
      }]
    };
    if (options && typeof options === "object") {
      myChart.setOption(options, true);
      myChart.setOption(options);
    }
  }

  $scope.init = function(){
    dataAnalysisService.doInit(partnerMid).success(function(response){
      if(response.success){
        $scope.dataUpdate = response.data;
        if(response.data){
          $scope.dataUpdateAddTime = parseInt(response.data.addTime)*1000;
        }
      }
    })
  }
  $scope.disbuBL = function(choTyp){
    dataAnalysisService.distributionBL(choTyp,partnerMid).success(function(response){
      if(response.success){
        if(response.data.length <= 0){
          $scope.isHasData = true;
          return;
        }else{
          $scope.isHasData = false;
        }
        for(var i=0; i<response.data.length;i++){
          datas[i].value = response.data[i].mySaleNum;
          datas[i].name = response.data[i].cateName;
          datasL[i] = response.data[i].cateName;
          if(i == response.data.length-1){
            datas.length = response.data.length;
             pieChart();
          }
        }
        if(response.data.length == 0){
          pieChart();
        }
      }
    })
  }
  $scope.actyBL = function(chohTyp){
    dataAnalysisService.activityBL(chohTyp,partnerMid).success(function(response){
      if(response.success){
          $scope.dataActivity = response.data;
          dataActy[0] =  response.data.STORE_SHARE;
          dataActy[1] =  response.data.PRODUCT_SHARE;
          dataActy[2] =  response.data.TASK;
          dataActy[3] =  response.data.COMMUNITY;
          dataActy[4] =  response.data.ASSESS;
          dataActy[5] =  response.data.LOGIN;
          lineChart();
      }
    })
  }
  $scope.salesCity = function(chohTyp){
    dataAnalysisService.salesCity(chohTyp,partnerMid).success(function(response){
      if(response.success){
        if(response.data.length>0){
          //alert(JSON.stringify(response.data));
          $scope.dataRegional = response.data;
        }else{
          $scope.dataRegional = null;
        }
      }
    })
  }
  $scope.chooseCityDate=function(DATE){
    //TODO 城市销量统计
    if(DATE == 'BY'){
      $scope.salesCity(true);
      styleInit3();
    }else{
      $scope.salesCity(false);
      $scope.cityLgStyle = {
        'color':'#2979FF',
        'border-bottom':"2px solid #2979FF"
      }
      $scope.cityByStyle = {
        'color':'#666',
        'border-bottom':"0 solid #2979FF"
      }
    }

  }
  $scope.chooseDate = function(DATE){
    dataInitChoTy();
    if(clearChartdom1){
      clearChartdom1.dispose();
    }
    if(DATE == 'BY'){
      chooseType = '本月';
      $scope.disbuBL('true');
      styleInit1();
    }else{
      chooseType = '累计';
      $scope.disbuBL('false');
      $scope.lgStyle = {
        'color':'#2979FF',
        'border-bottom':"2px solid #2979FF"
      }
      $scope.byStyle = {
        'color':'#666',
        'border-bottom':"0 solid #2979FF"
      }
    }
  }
  $scope.chooseActive = function(ACTIVE){
    if(clearChartdom2){
      clearChartdom2.dispose();
    }
    dataActy=[];
    if(ACTIVE == 'BY'){
      $scope.actyBL(true);
      styleInit2();
    }else{
      $scope.actyBL(false);
      $scope.lgStyleActive = {
        'color':'#2979FF',
        'border-bottom':"2px solid #2979FF"
      }
      $scope.byStyleActive = {
        'color':'#666',
        'border-bottom':"0 solid #2979FF"
      }
    }
  }

  $scope.$on('$ionicView.beforeEnter',function(){
    $scope.containerPic = true;
    $scope.activeContenterPic = true;
    $scope.isHasData = false;
    chooseType = '本月';
    partnerMid = '';
    partnerMid = $stateParams.memberId;
    styleInit1();
    styleInit2();
    styleInit3();
    dataInitChoTy();
    dataActy=[];
    $ionicScrollDelegate.scrollTop();
    $scope.dataUpdate = null;
    $scope.dataUpdateAddTime = null;
    $scope.dataActivity = '';
    $scope.dataRegional = null;
    $scope.init();
    $scope.disbuBL(true);
    $scope.actyBL(true);
    $scope.salesCity(true);
  });

  $scope.$on('$ionicView.beforeLeave', function() {
    if(clearChartdom1){
      clearChartdom1.dispose();
    }
    if(clearChartdom2){
      clearChartdom2.dispose();
    }
    $scope.containerPic = false;
    $scope.activeContenterPic = false;
  });

}])

APP.service('dataAnalysisService', ['$http', 'UrlService', function ($http, UrlService) {
  //获取最新动态
  this.doInit = function (memberId) {
    var params = {
      memberId:memberId
    };
    return $http.get(UrlService.getUrl('DATA_ANALYSIS_UPDATE'),params);
  };
  //销售商品分析
  this.distributionBL = function (onlyCurrentMonth,memberId) {
    var params = {
      onlyCurrentMonth:onlyCurrentMonth,
      memberId:memberId
    };
    return $http.get(UrlService.getUrl('DATA_ANALYSIS_DISTRIBUTION'), params);
  };
  //活跃度分析
  this.activityBL = function (onlyCurrentMonth,memberId) {
    var params = {
      onlyCurrentMonth:onlyCurrentMonth,
      memberId:memberId
    };
    return $http.get(UrlService.getUrl('DATA_ANALYSIS_ACTIVITY'), params);
  };
  //销售地区分析
  this.salesCity = function (onlyCurrentMonth,memberId) {
    var params = {
      onlyCurrentMonth:onlyCurrentMonth,
      memberId:memberId
    };
    return $http.get(UrlService.getUrl('DATA_ANALYSIS_SALES'), params);
  };
}]);
