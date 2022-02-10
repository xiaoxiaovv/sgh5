APP.controller('fullHouseSolutionController', ['$stateParams', '$scope', '$rootScope', 'UrlService', 'CreditService', 'UserService', '$state', 'fullHouseSolutionService', '$timeout', '$localstorage', '$ionicSlideBoxDelegate', 'GetCouponsService', 'PopupService', 'BannerThemeService', 'GoodsService','$ionicScrollDelegate', function($stateParams, $scope, $rootScope, UrlService, CreditService, UserService, $state, fullHouseSolutionService, $timeout, $localstorage, $ionicSlideBoxDelegate, GetCouponsService, PopupService, BannerThemeService, GoodsService,$ionicScrollDelegate) {
	//分享
	$scope.shareimg = $rootScope.smartNav?$rootScope.smartNav:'http://cdn09.ehaier.com/shunguang/H5/www/img/share_default.png'; //分享图片路径
	$scope.showShare = false; //分享界面显示隐藏
	$scope.sharedesp = ''; //分享描述
	$scope.soluteId = $stateParams.soluteId;//从路由获取方案类目
  $scope.hasmore = true;//分页加载标示
  $scope.pageIndex = 1;
  $scope.title='';
	$scope.init = function() {
		/*********************分享标签－whiteBird start*********************/
    $scope.showQQ = false;
    $scope.showWeChat = false;
    $scope.showShare = false; //分享菜单显示
    //页面数据
    $scope.exportDate = [];//专家团队数据
    $scope.recommend = [];//推荐方案数据
    $scope.housetopic = [];//下方案例
    $scope.housetopictitle = '';//案例标题
    $scope.title='';
    if($scope.videotag){
      $scope.videotag.pause();
    }
    $scope.pageIndex = 1;
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
    fullHouseSolutionService.getPageDate($scope.soluteId).success(function(res){
    	console.log(res);
      $scope.banners = res.data.banners;
    	$scope.exportDate = res.data.expert.experts;
    	$scope.recommend = res.data.recommend.recommends;
      $scope.title = res.data.name;
      $scope.sharedesp = res.data.name;
      $ionicSlideBoxDelegate.update();
      $ionicSlideBoxDelegate.$getByHandle("fullHouseSolution_slide").loop(true);
    })
    //获取topic数据
    $scope.loadmore = function(){
      fullHouseSolutionService.gettopicDate($scope.pageIndex,6,$scope.soluteId).success(function(response){
      $scope.housetopictitle = response.data.title;
      console.log(response);
      if (response.data.storys.length == 0) {
          $scope.hasmore = false;
          $scope.housetopic = $scope.housetopic.concat(response.data.storys);
          $scope.$broadcast('scroll.infiniteScrollComplete');
        } else {
          $scope.hasmore = true;
          $scope.housetopic = $scope.housetopic.concat(response.data.storys);

          //
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
    })
      $scope.pageIndex++;
    }
	}
  $scope.playing=function($event){
      $scope.clickimg = true;
       $event.target.style.display='none';
       $scope.imgtag = $event.target;
       $scope.videotag = $event.target.nextElementSibling;
       $event.target.nextElementSibling.play();
       $scope.targetv=$event.target.nextElementSibling;
       $scope.targetv.addEventListener("ended",function(){
           console.log("结束");
          $event.target.style.display='block';
      });
     }
     $scope.divclick = function(){
        if($scope.clickimg){
          $scope.clickimg = false;
        }else{
        if($scope.videotag){
          $scope.videotag.pause();
          $scope.imgtag.style.display='block';
        }   
        }   
     }
     $scope.onScroll = function(){
       var scrollTop = $ionicScrollDelegate.getScrollPosition().top;
       $scope.$apply(function(){
          if(scrollTop>=150){
            if($scope.imgtag&&$scope.imgtag.style.display=='none'){
                $scope.videotag.pause();
            $scope.imgtag.style.display='block';
            }  
          }
       })
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
    var title = $scope.sharedesp; //分享标题
    var content = $scope.sharedesp; //分享内容
    var pic = $scope.shareimg ? $scope.shareimg : 'http://cdn09.ehaier.com/shunguang/H5/www/img/share_default.png'; //分享图片，写绝对路径
    var url = UrlService.getShareLinkHeader() + 'fullHouseSolution/' + $scope.soluteId;

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
  $scope.$on('$ionicView.beforeEnter', function(event, v) {
    if (v.direction == 'back'){
      
    }else{
      $scope.init();
    }  
  });
  $scope.$on('$ionicView.beforeLeave', function() {
    if($scope.videotag){
      $scope.videotag.pause();
    }    
       });
  $scope.$on('$ionicView.enter', function (e, v) {
       ionic.on('scroll', $scope.onScroll, $scope.$$childHead.scrollCtrl.element)

    })
  $scope.$on('$stateChangeSuccess', function() {
    $scope.loadmore();
  });
}]);


APP.service('fullHouseSolutionService', ['$http', 'UrlService', function($http, UrlService) {
  this.getPageDate = function (id) {
  	var params = {
  		id:id
  	}
  	return $http.get(UrlService.getNewUrl('FULL_SOLUTION'), params);
  }
  this.gettopicDate = function(pageIndex,pageSize,programsId){
  	var params = {
  		group:2,//0:视频体验 1:智慧生活 2:全屋案例 3:晒家美图 4:装修攻略 5:猜你喜欢
  		itemsId:1,//1:成套家电 2:居家定制
  		pageIndex:pageIndex,
  		pageSize:pageSize,
  		programsId:programsId,//当group=2时必填 填写相应类目id
  	}
  	return $http.get(UrlService.getNewUrl('NEW_HOME_TOPIC'),params)
  }
}]);







