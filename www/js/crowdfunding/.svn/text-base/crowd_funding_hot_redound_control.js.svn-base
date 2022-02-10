/**
 * Created by lenovo on 2017-6-30.
 */
// 选择更多档位
APP.controller('crowd_funding_hot_redound_control', ['$rootScope','HomePageService','$stateParams', '$state', '$scope', 'CrowdFundingServer_hot', '$timeout', 'UserService', 'GoodsService', 'CommonAddressService','LoginService',
function ($rootScope,HomePageService,$stateParams, $state, $scope, CrowdFundingServer_hot, $timeout, UserService, GoodsService, CommonAddressService,LoginService) {
    $scope.redoundId = $stateParams.zActivityId; //获取参数id
    $scope.isHotPopup = false; // 选择数量模块是否显示
    $scope.hotPopupNum = 1; // 选择数量  默认为1
    $scope.isExcess = false; // 是否超额
    $scope.isGo = false; // 点击支持按钮 是否显示
    $scope.isFull = false; // 限额已满按钮
    $scope.isStatus = false; // 是否 预热
    $scope.isStars = false; // 是否 预热
    $scope.isEnd = false; // 是否 结束
    $scope.isMore = false; // 限额是否已满
    $scope.isFind = false; // 无限额 文字不显示
    $scope.isGo = true; //
    $scope.notGo = false; // num为0  按钮置灰
        $scope.settingsList = ''; //是否显示佣金本地存储
        $scope.isBuyer = LoginService.getRole(); //判断用户角色信息；0为买家；1为卖家
        //判断本地是否显示佣金;
        function GetSwitchChecked() {
            $scope.memberId = UserService.getUser().mid;
            var setSwitch = JSON.parse(localStorage.getItem('setSwitch'));
            var isExist = false;
            for (var i = setSwitch.length - 1; i >= 0; i--) {
                if (setSwitch[i].id == $scope.memberId) {
                    $scope.settingsList = setSwitch[i].list;
                    isExist = true;

                }
            }
            console.log($scope.settingsList);
        }

    $scope.init = function (zActivityId) {
      CrowdFundingServer_hot.redoundList(zActivityId).success(function (response) {
        console.log(response)
        if (response.success == true) {
          $scope.isHotPopup = false; // 关闭弹框
          //  档位页数据
          $scope.hotRedoundList = response.data;
          // 接收状态值
          $scope.redound_status = response.data.activityStatus;
          if ($scope.redound_status == 1) { // 众筹中 点击去支持
            $scope.isStatus = true;
            $scope.isStars = false;
            $scope.isEnd = false;
            $scope.isFull = false;
          }
          if ($scope.redound_status == 0) { // 预热中  敬请期待
            $scope.isStars = true;
            $scope.isFull = true;
            $scope.isStatus = false;
            $scope.isEnd = false;
          }
          if ($scope.redound_status == 100 || $scope.redound_status == 2 || $scope.redound_status == 3) { // 结束   已经结束
            $scope.isEnd = true;
            $scope.isFull = true;
            $scope.isStatus = false;
            $scope.isStars = false;
          }
        } else {
          console.log(response.message)
        }
      })
    }

    //周期函数 每次点击都去请求数据
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.isHotPopup = false; // 关闭弹框
      $scope.hotPopupNum=1;
      $scope.init($scope.redoundId);
            GetSwitchChecked();//是否显示佣金本地存储
            $scope.isBuyer = LoginService.getRole(); //判断用户角色信息；0为买家；1为卖家
    })

    // 点击 增加数量
    $scope.plus = function () {
      if ($scope.moreNum == 0) {
        $scope.hotPopupNum = 1;
        $scope.isExcess = true;
      } else if ($scope.hotPopupNum >= $scope.moreNum) {
        $scope.isExcess = true;
        $scope.hotPopupNum = $scope.moreNum;
      } else {
        $scope.hotPopupNum++;
        $scope.isExcess = false;
      }
      if ($scope.moreNum == $scope.hotPopupNum) {
        $scope.isExcess = true;
      }
    };
    // 点击 减少数量
    $scope.nus = function () {

      if ($scope.moreNum == 1) {
        $scope.isExcess = true;
      } else if ($scope.moreNum == 0) {
        $scope.hotPopupNum = 1;
        $scope.isExcess = true;
      } else {
        $scope.isExcess = false;
      }
      if ($scope.hotPopupNum <= 1) {
        $scope.hotPopupNum = 1;
      } else {
        $scope.hotPopupNum--;
      }
    }
    // 点击关闭按钮
    $scope.hot_close = function () {
      $scope.isHotPopup = false;
      $scope.hotPopupNum = 1;
      $scope.isExcess = false;
    }
    // 点击 去支持  跳转到 提交订单页
    $scope.goPostData = function () {
      HomePageService.isWdHost()
        .success(function (res) {
          $rootScope.isWdHost = res.data.isHost;
          if ($rootScope.isWdHost == -1) { //如果没有登录 跳转到登录页面
            $state.go('login');
          } else {
            $state.go('orderWrite', {
              zStallsId: $scope.goPostId,
              number: $scope.hotPopupNum
            });
          }
        })


    }
    //点击 去支持按钮 判断数量
    $scope.goSupport = function (zStallsId, amount, hotPic, returnTime, freight, remainingNum, commissionRate, isLottery) {
      // HomePageService.isWdHost()
      //   .success(function (res) {
      //     $rootScope.isWdHost = res.data.isHost;
      //     if ($rootScope.isWdHost == -1) { //如果没有登录 跳转到登录页面
      //         $scope.isLogin=false;
      //     } else{
      //         $scope.isLogin=true;
      //     }
      //   });
      $scope.isHotPopup = false; // 关闭弹框
      $scope.hotImg = hotPic; // 点击获取当前的图片
      $scope.hotAmounts = amount; // 获取参数的数量
      $scope.goPostId = zStallsId; //获取参数id
      $scope.returnTime = returnTime; //获取 时间
      $scope.freight = freight; //获取货运费用
      $scope.commissionRate = commissionRate; // 是否显示赚钱金额
      $scope.remainingNum = remainingNum == -1 ? '无限额' : remainingNum;
      $scope.isLottery = isLottery;
      $scope.commonFn(zStallsId, amount, hotPic, returnTime, freight, remainingNum, commissionRate, isLottery);

    }

    $scope.commonFn = function (zStallsId, amount, hotPic, returnTime, freight, remainingNum, commissionRate, isLottery) {
      if ($scope.remainingNum == '无限额' || $scope.remainingNum >= 1) { //无限额和大于 说明数量都足够
        $scope.isGo = true;
        // 显示数量模板
        $scope.isHotPopup = true;

        // 请求数据 做校验
        CrowdFundingServer_hot.redoundNum(zStallsId).success(function (response) {
          console.log(response)
          if (response.success == true) {
            $scope.hotNumber = response.data;
            $scope.moreNum = response.data.num; // 限购显示的剩余的份数
            $scope.hotPopupNum = 1;
            $scope.isExcess = false;
            $scope.limintNum = response.data.limit; // 限购显示的数量
            if ($scope.limintNum == '无限额') { // 是无限额不显示份数
              $scope.isFind = true;
            } else {
              $scope.isFind = false;
            }
            if ($scope.moreNum == 0) {
              $scope.hotPopupNum = 1;
              $scope.isExcess = true;
              $scope.isGo = false; // 原先的按钮
              $scope.notGo = true; // 置灰按钮
            } else { // 不为0 让它恢复正常
              $scope.isExcess = false;
              $scope.isGo = true;
              $scope.notGo = false;
            }
            if ($scope.moreNum == $scope.hotPopupNum) {
              //$scope.isExcess = true;
            }
          }else{
            $scope.isFind = true;
          }
        })
      }
      /*  else if($scope.remainingNum==1){  // 只能购买一份
          CrowdFundingServer_hot.postProduct($scope.goPostId,amount).success(function (response) {
            if(response.success==true){
              console.log(response)
               $state.go('orderWrite',{zStallsId:$scope.goPostId,number:$scope.hotPopupNum})
            }else{
              console.log(response.message)
            }
          })
        }*/
    }

  }
]);


APP.service('CrowdFundingServer_hot', ['$http', 'UrlService', function ($http, UrlService) {
  //  选择更多档位
  this.redoundList = function (zActivityId) {
    var params = {
      'zActivityId': zActivityId
    }
    // return $http.get('http://mobiletest.ehaier.com:38080/activity/zhongchou/getZStallsSinglePage?zActivityId='+params.zActivityId+'')
    return $http.get(UrlService.getZCUrl('ZC_ZSTALLS_SINGLE_PAGE'), params);
  }

  this.redoundNum = function (zStallsId) {
    var params = {
      'zStallsId': zStallsId
    }
    // return $http.get('http://mobiletest.ehaier.com:38080/activity/zhongchou/check?zStallsId='+params.zStallsId+'')
    return $http.get(UrlService.getZCUrl('ZC_CHECK'), params);
  }

  this.postProduct = function (zStallsId, num) {
    var params = {
      'zStallsId': zStallsId,
      'num': num
    }
    return $http.post(UrlService.getZCUrl('ZC_ORDER_COMMIT') + '?zStallsId=' + params.zStallsId + '&number=' + params.num)
    // return $http.post(UrlService.getZCUrl('ZC_ORDER_COMMIT'),params);
  }


}])
