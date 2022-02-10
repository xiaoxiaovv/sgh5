/**
大巴纯爷们 2017年04月25日17:07:43
 **/
APP.controller('StatisticsController', ['$ionicHistory','$q','$scope', '$ionicHistory', '$state', 'StatisticsService','$ionicScrollDelegate',
  function ($ionicHistory,$q,$scope, $ionicHistory, $state, StatisticsService,$ionicScrollDelegate) {
    
  $scope.backToLastView = function(){
      $state.go('personnalCenter');
      $ionicHistory.clearCache();//回到首页 清除 cacheView
    }
  if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
        $scope.paddingtopClass = {
          "padding-top": "30px"
        }
      }else{
        $scope.paddingtopClass = {
          "padding-top": "14px"
        }
      }
  $scope.switchType = function(type){
    console.log($scope.typeState);
    if(!$scope.typeState[type]){
      $scope.typeState = [false,false];
      $scope.typeState[type] = true;
      $scope.isPersonalStat = !$scope.isPersonalStat;
    }
  }
  $scope.scrollToTop = function(){
    $ionicScrollDelegate.scrollTop({shouldAnimate:true});
    $scope.isShowScrollToTopButton = false;
  }
  $scope.watchScrollPosition = function(){
    if($ionicScrollDelegate.getScrollPosition().top>10){
      $scope.isShowScrollToTopButton = true;
    }
  }
  //对 数组或对象每一项的某个字段长度 做限制
  function limitArrLength(originalContent,limitLength){
    for (var i in originalContent){
      originalContent[i].storeName = StatisticsService.limitStrLength(originalContent[i].storeName,limitLength);
    }
  }
//数组或对象深拷贝
  function deepCopy(o) {
    if (o instanceof Array) {
        var n = [];
        for (var i = 0; i < o.length; ++i) {
            n[i] = deepCopy(o[i]);
        }
        return n;

    } else if (o instanceof Object) {
        var n = {}
        for (var i in o) {
            n[i] = deepCopy(o[i]);
        }
        return n;
    } else {
        return o;
    }
}
//对象深拷贝的 处理函数
function dealDeepCopy(original){
  var deferred = $q.defer();
  deferred.resolve(deepCopy(original));
  return deferred.promise;
}
  $scope.switchConnectionType = function(type){
    if($scope.connectionType[type]==false){
      $scope.connectionType = [false,false];
      $scope.connectionType[type] = true;
      $scope.optionArr = [true,false];//当月 累计 数组
      if(type==0&&$scope.hasPartner){
        //当月表格数据 
        dealDeepCopy($scope.partnerData.brokerageReportList)
          .then(function(res){
            limitArrLength(res,$scope.nowStoreNameLength);
            $scope.nowMonthContent = res;
          })
        //累计表格数据
        dealDeepCopy($scope.partnerData.brokerageReportList)
          .then(function(res){
            limitArrLength(res,$scope.totalStoreNameLength);
            $scope.totalContent = res;
          })
      }
      if(type==1&&$scope.hasConnection){
        //当月表格数据 
        dealDeepCopy($scope.connectionData.brokerageReportList)
          .then(function(res){
            limitArrLength(res,$scope.nowStoreNameLength);
            $scope.nowMonthContent = res;
          })
        //累计表格数据
        dealDeepCopy($scope.connectionData.brokerageReportList)
          .then(function(res){
            limitArrLength(res,$scope.totalStoreNameLength);
            $scope.totalContent = res;
          })
      }
    }
  }
  $scope.switchOption = function(index){
    if($scope.optionArr[index]==false){
      $scope.optionArr = [false,false];
      $scope.optionArr[index] = true;
      $scope.isShowOption = !$scope.isShowOption;
    }
  }
  $scope.closeOption = function(){
    $scope.isShowOption = !$scope.isShowOption;
  }
  //日式格式化
  Date.prototype.Format = function (fmt) { 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

  //把时间戳 转换为 2017-04-05 12:12:12 的格式
  $scope.timeTransform = function(time){
    var newDate = new Date();
    newDate.setTime(time);
    var lastOrderTime = newDate.Format("yyyy-MM-dd hh:mm:ss");
    // lastOrderTime = lastOrderTime.substring(0,10)+" "+lastOrderTime.substring(12,19);
    return lastOrderTime;
  }
  $scope.init = function(){
    StatisticsService.getReportMessage()
      .success(function(response){
        console.log(response);
        $scope.allData = response.data;
        if(response.data.subLevelReportList.length!=0){//如果有合伙人或者人脉
          $scope.hasSubLevel = true;// 该用户有 合伙人和人脉
          if(response.data.subLevelReportList[0]&&!$.isEmptyObject(response.data.subLevelReportList[0])){//如果有合伙人
            $scope.hasPartner = true;// 该用户有 合伙人
            $scope.partnerData = response.data.subLevelReportList[0];//合伙人数据
            if(response.data.subLevelReportList[1]&&!$.isEmptyObject(response.data.subLevelReportList[1])){
              $scope.hasConnection = true;// 该用户有 人脉
              $scope.connectionData = response.data.subLevelReportList[1];//人脉数据
              //当月表格数据 
              dealDeepCopy($scope.partnerData.brokerageReportList)
                .then(function(res){
                  console.log(res)
                  limitArrLength(res,$scope.nowStoreNameLength);
                  $scope.nowMonthContent = res;
                })
              
              //累计表格数据
              dealDeepCopy($scope.partnerData.brokerageReportList)
                .then(function(res){
                  limitArrLength(res,$scope.totalStoreNameLength);
                  $scope.totalContent = res;
                })
              
            }else{
              $scope.hasConnection = false;// 该用户没有有 人脉
              //当月表格数据 
              dealDeepCopy($scope.partnerData.brokerageReportList)
                .then(function(res){
                  $scope.nowMonthContent = res;
                  limitArrLength($scope.nowMonthContent,$scope.nowStoreNameLength);
                })
              //累计表格数据
              dealDeepCopy($scope.partnerData.brokerageReportList)
                .then(function(res){
                  $scope.totalContent = res;
                  limitArrLength($scope.totalContent,$scope.totalStoreNameLength);
                })
              
            }
          }else{
            $scope.hasPartner = false;// 该用户没有 合伙人
            $scope.hasConnection = false;// 该用户没有有 人脉
          }
        }else{
          $scope.hasSubLevel = false;//
          $scope.hasPartner = false;// 该用户没有 合伙人
          $scope.hasConnection = false;// 该用户没有有 人脉
        }
        console.log('hasSubLevel----'+$scope.hasSubLevel);
        console.log('hasPartner----'+$scope.hasPartner);
        console.log('hasConnection----'+$scope.hasConnection);
        
      })
    StatisticsService.getReportMessagePlus()
      .success(function(response){
        console.log(response);
        $scope.newBrokerageAmount = response.data.newBrokerageAmount;
        $scope.totalBrokerageAmount = response.data.totalBrokerageAmount;
      })
}
  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.isPersonalStat = false;//是否是个人统计
    $scope.typeState = [true,false];//贡献佣金 个人统计数组
    $scope.connectionType = [true,false];//合伙人 人脉数组
    $scope.optionArr = [true,false];//当月 累计 数组
    $scope.isShowOption = false;//是否显示 选项
    $scope.isShowScrollToTopButton = false;
    //当月和累计的 店铺名称字数限制
    $scope.nowStoreNameLength = Math.floor((window.innerWidth-24)*0.21/13*4-3);//当月 可以放的字符长度 汉字占两个字符 字母占一个
    $scope.totalStoreNameLength = Math.floor((window.innerWidth-24)*0.38/13*2-1);//累计 可以放的字符长度 汉字占两个字符 字母占一个
    $scope.init();
      })
  }]);
APP.service('StatisticsService', ['$http', 'UrlService','CalculateStrLength', function ($http, UrlService,CalculateStrLength) {
  this.getReportMessage = function(){
   
  return $http.get(UrlService.getUrl('REPORT_DETAIL'));
 }
 this.getReportMessagePlus = function(){
   
  return $http.get(UrlService.getUrl('REPORT_DETAIL_PLUS'));
 }
 this.limitStrLength = function(str,limitLength){
  return CalculateStrLength.limitStrLength(str,limitLength);
 }
}]);
