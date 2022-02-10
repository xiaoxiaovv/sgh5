APP.controller('designDetailController', ['$stateParams', '$scope', '$rootScope', 'UrlService', 'CreditService', 'UserService', '$state', 'designDetailService', '$ionicSlideBoxDelegate', 'PopupService', 'GoodsService','$ionicHistory', function($stateParams, $scope, $rootScope, UrlService, CreditService, UserService, $state, designDetailService, $ionicSlideBoxDelegate, PopupService, GoodsService,$ionicHistory) {
	//分享
	$scope.shareimg = '';//设计师头像
	$scope.showShare = false; //分享界面显示隐藏
  $scope.title = '';//设计师名字
	$scope.sharedesp = ''; //设计师简介
	$scope.soluteId = $stateParams.soluteId;//从路由获取设计师id
  $scope.hasmore = true;//分页加载标示
  $scope.pageIndex = 1;
  if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
      $scope.isIosApp = true;
    } else {
      $scope.isIosApp = false;
    }
	$scope.init = function() {
		/*********************分享标签－whiteBird start*********************/
    $scope.showQQ = false;
    $scope.showWeChat = false;
    $scope.showShare = false; //分享菜单显示
    //页面数据
    $scope.designerData = {};
    $scope.pageIndex = 1;
    $scope.listdata = [];
    if (window.cordova) {
      $scope.isApp = true;
    } else {
      $scope.isApp = false;
    }
    if (window.cordova) {
      window.umeng.checkAppInstalled('qq', function(data) {

        if (data == false) {
          $scope.showQQ = false;
        } else {
          $scope.showQQ = true;
        }
      });
      window.umeng.checkAppInstalled('wechat', function(data) {
        if (data == false) {
          $scope.showWeChat = false;
        } else {
          $scope.showWeChat = true;
        }
      });
    }
    $scope.$broadcast('scroll.refreshComplete');
    /*********************分享标签－whiteBird end*********************/
    //获取页面数据
    designDetailService.getPageDate($scope.soluteId).success(function(res){
    	console.log(res);
      $scope.designerData = res.data;
      $scope.shareimg = $scope.designerData.avatar;
      $scope.title = $scope.designerData.name;
      $scope.sharedesp = $scope.designerData.introduction;
    })
    //获取topic数据
    $scope.loadmore = function(){
      designDetailService.gettopicDate($scope.pageIndex,4,$scope.soluteId).success(function(response){
        console.log(response);
        if (response.data.length == 0) {
          $scope.hasmore = false;
          $scope.listdata = $scope.listdata.concat(response.data);
          $scope.$broadcast('scroll.infiniteScrollComplete');
        } else {
          $scope.hasmore = true;
          $scope.listdata = $scope.listdata.concat(response.data);

          //
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
    })
      $scope.pageIndex++;
    }
	}
	//分享
  $scope.goshare = function() {
    if (!UserService.getUser().mid) {
      $state.go('login');
      return;
    }
    $scope.showShare = !$scope.showShare;
  };
  //复制
  $scope.copeText = function(text) {
    if (window.cordova) {
      cordova.plugins.clipboard.copy(text);
      PopupService.showToastShort('复制成功');
    } else {
      PopupService.showToast('请下载APP执行此操作');
    }
  };
  //关闭分享
  $scope.hideblackCover = function() {
    $scope.showShare = false;
  };
  //分享方法
  $scope.shareToPlatform = function(index) {
    var title = $scope.title; //分享标题
    var content = $scope.sharedesp; //分享内容
    var pic = $scope.shareimg ? $scope.shareimg : 'http://cdn09.ehaier.com/shunguang/H5/www/img/share_default.png'; //分享图片，写绝对路径
    var url = UrlService.getShareLinkHeader() + 'designDetail/' + $scope.soluteId;

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
      }
      if (index == 5) {
        $scope.copeText(url);
      } else {
        CreditService.successShare();
      }
    } else {
      alert('umeng undefined 只能在app分享');
    }
    $scope.showShare = false;
  };
  //
  $scope.goback = function(){
    $ionicHistory.goBack();
  }
  $scope.$on('$ionicView.beforeEnter', function(event, v) {
    if (v.direction == 'back'){
      
    }else{
      $scope.init();
    }  
  });
  $scope.$on('$stateChangeSuccess', function() {
    $scope.loadmore();
  });
}]);


APP.service('designDetailService', ['$http', 'UrlService', function($http, UrlService) {
  this.getPageDate = function (id) {
  	var params = {
  		id:id
  	}
  	return $http.get(UrlService.getNewUrl('DESIGN_DETAIL'), params);
  }
  this.gettopicDate = function(pageIndex,pageSize,programsId){
  	var params = {
  		pageIndex:pageIndex,
  		pageSize:pageSize,
  		id:programsId,
  	}
  	return $http.get(UrlService.getNewUrl('DESIGN_SOLULIST'),params)
  }
}]);







