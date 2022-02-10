/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/16
 * describe：MessageCenterController 测试控制器
 **/

APP.controller('MessageCenterController', ['$ionicScrollDelegate','$timeout','$scope','$rootScope','$stateParams', 'MESSAGECENTERService','$state','UserService','InAppBrowserService','UrlService','$http',
  function ($ionicScrollDelegate,$timeout,$scope, $rootScope, $stateParams, MESSAGECENTERService, $state,UserService,InAppBrowserService,UrlService,$http) {
    /** 变量声明 **/
    $scope.messageMap = [];
    $scope.breakLine = [];
    $scope.mesType=$stateParams.messageType;
    $scope.messageList = '';
    // 上拉加载标志
    $scope.hasmore = false;
    $scope.page = 1;
    $scope.size = 10;
    var startIndex = 1;
    var pageN='';

    var user;
    /** 方法 **/
    //返回
    $scope.goBack = function () {
      $scope.$ionicGoBack();
    };
    $scope.init = function () {
      user = UserService.getUser();
      $ionicScrollDelegate.scrollTop();
      MESSAGECENTERService.getMessageList($scope.mesType,$scope.page,$scope.size)
        .success(function(response){
            if($scope.mesType==1){
          	    $scope.messageList=response.data.orderMesagesList;//订单消息
          	    $scope.count=response.data.orderCount;//订单消息总数
            }else if($scope.mesType==2){
            	$scope.messageList=response.data.memberMesagesList;// 会员动态
            	$scope.count=response.data.memberCount;//会员动态总数
            }else if($scope.mesType==3){
            	$scope.messageList=response.data.platformMesagesList;//平台消息
            	$scope.count=response.data.platformCount;//平台消息总数
            } else if ($scope.mesType==4) {
              $scope.messageList=response.data.communityMesagesList;//社区消息
              $scope.count=response.data.communityCount;//社区消息总数
            }
          pageN = Math.ceil($scope.count / $scope.size);//1
          $scope.hasmore = !($scope.page >= pageN );

       })
    };
    $scope.loadMore = function(){
    	var old = $scope.messageList;
    	startIndex += 1;
    	var params = {
	      'messageType': $scope.mesType,
	      'page': startIndex,
	      'size': $scope.size
	    };
    	$http.get(UrlService.getUrl('MESSAGE_CLASSIFY'), params).success(function(response) {
   		    if($scope.mesType==1){
          	    $scope.messageList=old.concat(response.data.orderMesagesList);//订单消息
          	    $scope.count=response.data.orderCount;//订单消息总数
            }else if($scope.mesType==2){
            	$scope.messageList=old.concat(response.data.memberMesagesList);// 会员动态
            	$scope.count=response.data.memberCount;//会员动态总数
            }else if ($scope.mesType==3){
            	$scope.messageList=old.concat(response.data.platformMesagesList);//平台消息
            	$scope.count=response.data.platformCount;//平台消息总数
            } else if ($scope.mesType==4) {
              $scope.messageList=old.concat(response.data.communityMesagesList);//社区消息
              $scope.count=response.data.communityCount;//社区消息总数
            }
        $scope.hasmore = !($scope.count < $scope.messageList.length);
        $scope.$broadcast('scroll.infiniteScrollComplete');
	    });
    }

    $scope.goDetail = function(obj){
      //将该消息制成已读
      var params = {
        id:obj.id
      };
      MESSAGECENTERService.checkRead(params).success(function(response){
        MESSAGECENTERService.unreadMessage();//查看 未读信息
      });
      var u = navigator.userAgent;

      if(obj.type ==1){//帮助
        if (u.indexOf('iPhone') != -1) {
          var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=' + obj.relationId,obj.title);
          ref.addEventListener('exit', function (event) {
          });
        } else {
          $state.go('helpDetail', {'helpId': obj.relationId,'content':obj.title});
        }

      }else if(obj.type == 2){//佣金
        $state.go('shopRevenue');

      }else if(obj.type == 3 || obj.type == 51){//退款
        $state.go('orderDetail', {'orderSn':'','cOrderSn':'','cOrderId': obj.relationId});
      }else if(obj.type == 4){//微信学堂
        if (u.indexOf('iPhone') != -1) {
          var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=' + obj.relationId,obj.title);
          ref.addEventListener('exit', function (event) {
          });
        } else {
          $state.go('helpDetail', {'helpId': obj.relationId,'content':obj.title});
        }
      }else if(obj.type == 5){//订单完成
        $state.go('orderManage',{orderStatus:4});
      }else if(obj.type == 7){//后台测试使用
        if (u.indexOf('iPhone') != -1) {
          var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=' + obj.relationId,obj.title);
          ref.addEventListener('exit', function (event) {
          });
        } else {
          $state.go('helpDetail', {'helpId': obj.relationId,'content':obj.title});
        }
      }
      else if(obj.type == 601){//社群消息
        if (obj.relationId) {
          $state.go('noteDetails',{noteId: obj.relationId, isShortStory: 1});//普通帖话题详情，评论赞
        } else {
          $state.go('goldRecord');
        }
      } else if(obj.type == 602) {
        $state.go('noteDetails',{noteId: obj.relationId, isShortStory: 0});//普通帖话题详情，评论赞
      } else if(obj.type == 603) {
        if (obj.relationId) {
          $state.go('classNoteDetails',{noteId: obj.relationId});//微学堂话题详情，评论赞
        } else {
          $state.go('goldRecord');
        }

      } else if(obj.type == 604) {
        $state.go('myFans');//我的粉丝
      } else if(obj.type == 0){
        var memberId=UserService.getUser().mid;
        $state.go('goldRecord');
        // -1 积分变动消息
        // -2 O2O店铺等级变动消息
      }else if(obj.type == -3){//订单评价消息 productId
        $state.go('productRated', {'productId': obj.relationId});
      }else if(obj.type == -4){//物流配送消息 orderId
        //将orderId转为orderSn
        var url = UrlService.getUrl('ORDER_INFO');

        var serializedData = $.param({'orderId':obj.relationId});

        $http({
          method: 'POST',
          url: url,
          data: serializedData,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }}).then(function(response){
            if(response.data.success) {
              var orderSn = response.data.data.ordersn;
              console.log('orderSn='+orderSn);
              $state.go('orderTracking', {'orderSn': orderSn});
            }
        }, function(error) {
          console.log(error);
        });
      }else if(obj.type == -5){//订单退货消息 orderProductId
        var memberId=UserService.getUser().userId;
        $state.go('refundDetail', {'orderProductId': obj.relationId,'memberId':memberId});
      }else if(obj.type == -6){//订单金额累计消息
        $state.go('orderManage');
      }else if (obj.type == -12||obj.type == -11) {
        $state.go('myCouponsList');
      }else if (obj.type == -13||obj.type == -15||obj.type == -21) {
        $state.go('shopRevenue');
      }else if (obj.type == -14) {
        $state.go('walletDiamonds');
      }else{
        $scope.init();
      }
    };

    $scope.readAll = function(){
      var user = UserService.getUser();
      if(!user.mid){
        alert('用户id不存在');
        return;
      }
      var params = {
       // memberId:user.mid 去掉参数memberId

      };
      MESSAGECENTERService.readAllMessage(params).success(function(response){
        MESSAGECENTERService.unreadMessage();//查看 未读信息
        $ionicScrollDelegate.scrollTop();
        startIndex = 1;
        $scope.init();
      }).error(function(){
        alert('全部已读操作失败');
      });
    };
    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      if(v.direction == 'back')return;
      startIndex = 1;
      $scope.init();
      $ionicScrollDelegate.scrollTop();
    })
  }]);
/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016-3-28
 * describe：消息中心
 **/
APP.service('MESSAGECENTERService', ['$http', 'UrlService','$rootScope', function ($http, UrlService,$rootScope) {
  //this.doInit = function () {
  //  return $http.get(UrlService.getUrl('MESSAGECENTER_INIT'));
  //};

  //获得所有消息
  this.msgCenter = function(params){
    return $http.get(UrlService.getUrl('MSG_CENTER'),params);
  };
  //得到未读消息数
  this.unreadMessage = function (){
    return $http.get(UrlService.getUrl('UNRED_MESSAGE')).success(function(response){
      $rootScope.unreadMessage =response.data;
      console.log('未读消息数'+$rootScope.unreadMessage);
    });
  };
  this.readAllMessage = function (params){
    return $http.get(UrlService.getUrl('READALL'),params)
  };
  this.checkRead= function (params){
    return $http.get(UrlService.getUrl('CHECKREAD'),params);
  }
  this.getMessageList = function(mesType,page,size){
    var params = {
      messageType: mesType,
      page:page,
      size:size
    };
    return $http.get(UrlService.getUrl('MESSAGE_CLASSIFY'), params);
  }
}]);
