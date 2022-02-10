/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/3/17
 * describe：二级管理控制器
 **/
APP.controller('SecondManageController', ['$scope', 'SecondManageService', 'UserService', 'UrlService','PopupService','CreditService',
  function ($scope, SecondManageService, UserService, UrlService, PopupService, CreditService) {

    /** 变量声明 **/
      //二级管理搜索
    $scope.search = {
      keyWords: ''
    };
    $scope.pageIndex = 0;//分页页数
    $scope.pageSize = 10;//每页显示条数
    $scope.hasMoreData = false;//默认不加载下拉刷新
    $scope.secondMemberDate = [];
    $scope.secondMemberList = [];//二三级管理列表
    $scope.rank = 2;// 二级or三级
    /*********************分享标签－whiteBird start*********************/
    $scope.showShare = false;
    /*********************分享标签－whiteBird end*********************/

    /** 方法 **/
    $scope.init = function () {

      /*********************分享标签－whiteBird start*********************/
      $scope.showQQ = false;
      $scope.showWeChat = false;
      if(window.cordova)
      {
        window.umeng.checkAppInstalled('qq',function (data) {

          if(data == false){
            $scope.showQQ = false;
          }else{
            $scope.showQQ = true;
          }
        });
        window.umeng.checkAppInstalled('wechat',function (data) {

          if(data == false){
            $scope.showWeChat = false;
          }else{
            $scope.showWeChat = true;
          }
        });

      }
      /*********************分享标签－whiteBird end*********************/

      var tempMassage = UserService.getUser();
      $scope.rank = 2;
      $scope.getCode();
      $scope.loadData(false, '', 0, $scope.pageSize, $scope.rank);
    };

    $scope.getSecAndThi = function (rank) {
      $scope.rank = rank;
      $scope.search.keyWords = '';
      $scope.loadData(false, $scope.search.keyWords, 0, $scope.pageSize, $scope.rank);
    };
    $scope.getCode = function () {
      SecondManageService.doGetCode().success(function (response) {
        $scope.mid = response.data.promotionCode;
      });
    };

    //数据加载
    $scope.loadData = function (upDataFlag, keyword, pageIndex, pageSize, rank) {
      SecondManageService.getSecAndThi(keyword, pageIndex, pageSize, rank)
        .success(function (response) {
          if (response.success) {
            $scope.secondMemberDate = response.data;
            if (upDataFlag) {
              $scope.secondMemberList = $scope.secondMemberList.concat(response.data.memberInfo);
            } else {
              $scope.pageIndex = 0;
              $scope.secondMemberList = response.data.memberInfo;
            }
            $scope.hasMoreData = response.data.memberExist;
            if (response.data.memberInfo && response.data.memberInfo.length < 10 || !response.data.memberInfo) {
              $scope.hasMoreData = false;
            }
            $scope.isHaveDate = response.data.memberExist;
          }
          if (upDataFlag) {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        });
    };
    //加载更多
    $scope.loadMore = function () {
      $scope.pageIndex++;
      $scope.loadData(true, $scope.search.keyWords, $scope.pageIndex, $scope.pageSize, $scope.rank);
    };
    //二级成员搜索
    $scope.searchSecondMember = function () {
      $scope.pageIndex = 0;
      $scope.loadData(false, $scope.search.keyWords, $scope.pageIndex, $scope.pageSize, $scope.rank);
    };
    //分享
    $scope.share = function () {

      /*********************分享标签－whiteBird start*********************/
      if (window.device && window.device.hasNewShare) {

        //新分享样式
        $scope.showShare = !$scope.showShare;
        /*********************分享标签－whiteBird end*********************/
      } else {

        //旧分享样式
        var title = '成为我的合伙人，一起赚丰厚佣金！',
          content = '有梦就有店，高收入0投资，挣钱真简单～',
          pic = UserService.getUser().avatarImageFileId,
          url = UrlService.getShareLinkHeader() + 'register/' + '0/' + $scope.mid;

        if (window.umeng) {
          window.umeng.share(title, content, pic, url, 0);
        } else {
          alert('只能在app分享,请下载app！');
        }

      }
    };

    /*********************分享标签－whiteBird start*********************/
      //复制
    $scope.copeText = function (text) {
      if (window.cordova) {
        cordova.plugins.clipboard.copy(text);
        PopupService.showToastShort('复制成功');
      }
      else {
        PopupService.showToast('请下载APP执行此操作');
      }
    };
    $scope.hideblackCover = function () {
      $scope.showShare = false;
    };
    $scope.shareToPlatform = function (index) {

      var title = '成为我的合伙人，一起赚丰厚佣金！',
        content = '有梦就有店，高收入0投资，挣钱真简单～',
        pic = UserService.getUser().avatarImageFileId,
        url = UrlService.getShareLinkHeader() + 'register/' + '0/' + $scope.mid;

      if (window.umeng) {
        if (index == 0) {
          window.umeng.shareToSina(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
        } else if (index == 1) {
          window.umeng.shareToWechatSession(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
        } else if (index == 2) {
          window.umeng.shareToWechatTimeline(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
        } else if (index == 3) {
          window.umeng.shareToQQ(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
          CreditService.qqShare();
        } else if (index == 4) {
          window.umeng.shareToQzone(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
          CreditService.qqShare();
        } else if (index == 5) {
          $scope.copeText(url);
        }
        CreditService.successShare();
      } else {
        alert('umeng undefined 只能在app分享');
      }

      $scope.showShare = false;
    };
    /*********************分享标签－whiteBird end*********************/


    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    })
  }]);


/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016-03-21
 * describe：二级管理Service
 **/
APP.service('SecondManageService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getSecAndThi = function (keyword, pageIndex, pageSize, rank) {
    var params = {
      keyword: keyword,
      pageIndex: pageIndex,
      pageSize: pageSize
    };
    if (rank == 2) {
      return $http.get(UrlService.getUrl('SECOND_MANAGE'), params);
    } else {
      return $http.get(UrlService.getUrl('THIRD_MANAGE'), params);
    }

  };

  this.doGetCode = function () {
    return $http.get(UrlService.getUrl('GETTUIGUANGMA'));
  };
}]);
