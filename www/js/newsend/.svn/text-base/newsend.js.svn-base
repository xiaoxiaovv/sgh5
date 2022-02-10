APP.controller('newsendCtrl',['$stateParams','$scope','GoodsService','flashService','$state','$ionicHistory','$interval','$timeout','newsendService','$rootScope','$localstorage','$ionicSlideBoxDelegate','UserService','$ionicScrollDelegate','BannerThemeService','HomePageService',function($stateParams,$scope,GoodsService,flashService,$state,$ionicHistory,$interval,$timeout,newsendService,$rootScope,$localstorage,$ionicSlideBoxDelegate,UserService,$ionicScrollDelegate,BannerThemeService,HomePageService){
		/*声明变量*/
  $scope.typeNumber = $stateParams.type;
  $scope.typeNumber = $scope.typeNumber==2 ? 2:1;
    $scope.isWd=false;
		$scope.newprod=[];
		$scope.showtime='';
		$scope.presell=[];
		$scope.zcnow=[];
		$scope.zcpre=[];
		$scope.zcold=[];
    $scope.flagNum = false;
    $scope.messageImgUrl = "http://cdn09.ehaier.com/shunguang/H5/www/img/message_gray@2x.png";
		/*方法*/
    $scope.init=function(){
      $scope.storeId = $localstorage.get('storeId',$rootScope.globalConstant.storeId);
      /*轮播*/
      newsendService.slidedata().success(function(res){
        console.log(res)
          $scope.bannerList=[];
          $scope.others=[];
          $scope.bannerList = res.data.topBanner;
          $scope.others = res.data.others.slice(0,2);
          $ionicSlideBoxDelegate.update();
          $ionicSlideBoxDelegate.$getByHandle("newsend_slide").loop(true);
        //swper轮播
        // $timeout(function(){
        //   $scope.swpnewsend1 = new Swiper('#swpc-newsend-1', {   //轮播图绑定样式名
        //     pagination: '#swpp-newsend-1',
        //     paginationClickable: true,
        //     autoplay: 4000,
        //     loop: false,
        //     observer:true,
        //     observeParents:true,
        //     autoplayDisableOnInteraction:false,
        //   });
        //   $scope.swpnewsend1.update();
        // },100)
        HomePageService.getUnReadMsg()
        .success(function (res) {
          if (res.data > 0) {
            $scope.flagNum = true;
          } else {
            $scope.flagNum = false;
          }
        })
      })
      /*获取店铺id*/
    /*请求预约数据*/
    GoodsService.getAddress().success(function(response){
         var obj = eval(response.data);
         console.log(obj);
         newsendService.getnewProd(obj[0].provinceId,obj[0].cityId,obj[0].areaId,obj[0].streetId,1).success(function(response){
        console.log(response);
        if (response.data.isWd == true) {
            $scope.isWd = true;
          } else {
            $scope.isWd = false;
          }
        $scope.newprod=response.data.acReserveList[0];//取的第一页第一个
        if($scope.newprod){
          add(response.data.acReserveList[0].reserveStartTime,response.data.acReserveList[0].reserveEndTime);
        }
    })
    })
    /*请求预售数据*/
    newsendService.getpres().success(function(response){
        $scope.presell=response.data.slice(0,3);//取的第一页前三个
        console.log(response)
      })
      /*请求众筹数据*/

      newsendService.getcrowold($scope.typeNumber).success(function(response){
        $scope.zcold=response.data.zActivitySuccessList;
        $scope.zcnow=response.data.zActivityBeginningList;
        $scope.zcpre=response.data.zActivityToBeginList;
      })
    }
    //点击轮播图执行方法
		$scope.bannerClick = function (linkType, link, relationId) {
      var tempArr = link.split('&');
      switch (linkType) {
         case '-1':
          BannerThemeService.getBannerTheme(relationId)
            .success(function (response) {
              console.log(response);
              $state.go('bannerDaily', {
                bannerId: relationId,
                layout: response.data.layout
              });
            });
          break;
        case '0':
          $state.go('bannerTheme', {
            bannerId: relationId
          });
          break;
        case '1': //单品页
        var fromType=link.slice(link.lastIndexOf('=')+1);
        var reg=/\=(.*?)\&/g;
        var arr=link.match(reg);
        var arr1=[];
        for(var x=0;x<arr.length;x++){
            arr1.push(arr[x].substring(1,arr[x].length-1));
        }
          //var productId = link.slice(link.indexOf('=' + 1));
          $state.go('productDetail', {
            fromType: fromType,
            fromUrl: arr1[3],
            o2oType: arr1[2],
            productId: arr1[0],
            storeId:arr1[1]
          });
          break;
        case '2': //领券中心/优惠券详情页
          if (!link) {
            $state.go('getCouponsList');
          } else {
            var couponsId = link.slice(link.indexOf('=' + 1));
            $state.go('couponsDetail', {
              cId: couponsId,
              userID: $scope.storeId,
              type: 2
            });
          }
          break;
        case '3': //游戏页
          var gameId = link.slice(link.indexOf('=' + 1));
          $state.go('game', {
            gameId: gameId
          });
          break;
        case '4': //活动页
          if (tempArr[0].slice(tempArr[0].indexOf('=') + 1) == '日常活动') {
            BannerThemeService.getBannerTheme(tempArr[1].slice(tempArr[1].indexOf('=') + 1))
              .success(function (response) {
                console.log(response);
                $state.go('bannerDaily', {
                  bannerId: tempArr[1].slice(tempArr[1].indexOf('=') + 1),
                  layout: response.data.layout
                });
              });
          } else if (tempArr[0].slice(tempArr[0].indexOf('=') + 1) == '主题活动') {
            $state.go('bannerTheme', {
              bannerId: tempArr[1].slice(tempArr[1].indexOf('=') + 1)
            });
          }
          break;
        case '5': //自定义类型页
          if (window.cordova) {
            /**
             * H5跳转原生webView页面
             * @param resultUrl {String} 链接url
             * @param title {String} 标题
             *
             */
            if(link.indexOf('m.ehaier.com/www/index.html')!=-1){
              var url = link.slice(link.indexOf('#/'));
              window.location.hash=url;
            }else{
              window.emc.presentH5View(link, "");
            }
          } else {
            window.open(link, '_blank', 'location=yes');
          }
          break;
        case '6': //众筹
          $state.go('crowdFunding');
          break;
        case '7': //新品
          if (!link) {
            $state.go('newSend');
          } else {
            $state.go('productDetail', {
              fromType: '',
              fromUrl: '',
              o2oType: 0,
              productId: link,
              storeId: $scope.storeId
            });
          }
          break;
        case '8': //社群
          if (!link) {
            $state.go('topic.qhot');
          } else {
            $state.go('noteDetails', {
              noteId: tempArr[0].slice(tempArr[0].indexOf('=') + 1),
              isShortStory: tempArr[1].slice(tempArr[1].indexOf('=') + 1)
            })
          }
          break;
      }
    }
		/*距离结束时间封装函数*/
    function add(startTime,endTime){
		var nowdate = new Date();
		/*一堆计算*/
		var s1 = startTime,s2 = endTime,s3=nowdate.getTime();
		var timer=$interval(function(){
				s3=s3+1000;
				var toendtime=parseInt((s2-s3)/1000);
				var day = parseInt(toendtime / (24*60*60));//计算整数天数
				var afterDay = toendtime - day*24*60*60;//取得算出天数后剩余的秒数
				var hour = parseInt(afterDay/(60*60));//计算整数小时数
				var afterHour = toendtime - day*24*60*60 - hour*60*60;//取得算出小时数后剩余的秒数
				var min = parseInt(afterHour/60);//计算整数分
				var afterMin = toendtime - day*24*60*60 - hour*60*60 - min*60;//取得算出分后剩余的秒数
				$scope.showtime=day+'天'+flashService.PrefixInteger(hour)+":"+flashService.PrefixInteger(min)+":"+flashService.PrefixInteger(parseInt(afterMin));
			  if (toendtime== -1) {
        $state.reload();
        $interval.cancel(timer);
      }

      },1000)
    }
    $scope.$on('$ionicView.beforeEnter', function() {
      $scope.init();
      //更新轮播
      $timeout(function(){
        $ionicSlideBoxDelegate.loop(true);
        $ionicSlideBoxDelegate.start();
        $ionicSlideBoxDelegate.update();
      },200);
    });
		/*返回页面*/
		$scope.goBack = function(){
        $ionicScrollDelegate.scrollTop();
        $ionicHistory.goBack();
      };
	}]);
APP.service('newsendService', ['$http','UrlService',function($http,UrlService){
  this.getnewProd=function(provinceId,cityId,districtId,streetId,pageIndex){
  	var params={
  		'provinceId':provinceId,
      	'cityId':cityId,
      	'districtId':districtId,
      	'streetId':streetId,
  		'pageIndex':pageIndex
  	}
  	return $http.get(UrlService.getNewUrl('NEW_SEND'), params);
  }
  this.getpres=function(){
      //return $http.get(UrlService.getUrl('FLASH_TWO'));
      var params = {
      	'pageIndex':1,
      	'pageSize':3
      }
      return $http.get(UrlService.getNewUrl('NEW_RES'), params);
  }

  this.getcrowold = function (from) {

    var params = {
      from:from
    }
    //  return $http.get('http://mobiletest.ehaier.com:38080/activity/zhongchou/indexZActivitys?type='+params.type+'&page='+params.page+'')
    return $http.get(UrlService.getZCUrl('SUC_ZHONGCHOU'),params);
  }
  this.slidedata = function () {
    var params = {
      "type":1
    };
    return $http.get(UrlService.getNewUrl('NEW_SLIDE'), params);
  }
}])
