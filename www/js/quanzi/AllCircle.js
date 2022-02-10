/**
 * Created by Sunbin on 2016/10/11.
 */
APP.controller('AllCircleController', ['HomePageService','$scope', '$rootScope', '$state', '$ionicScrollDelegate', '$ionicPopup', 'PopupService', 'AllCircleService', '$ionicSlideBoxDelegate',
  '$timeout','UserService','$ionicModal',
  function (HomePageService,$scope, $rootScope, $state, $ionicScrollDelegate, $ionicPopup, PopupService, AllCircleService, $ionicSlideBoxDelegate, $timeout,UserService,$ionicModal) {
    /**
     * 变量声明
     */
    $scope.isDisplay = false;
    $scope.moreTag = false;
    $scope.hasmore = true;
    $rootScope.toFilterCode = '';

    // 是否回到顶部
    $scope.scrollMainTop = function () {
      $ionicScrollDelegate.$getByHandle('allMainScroll').scrollTop([true]);
    };
    //搜索标签
    $scope.searchTag = {
      searchKey: '',
      tagSearch: '',
      pageIndex: 1,
      pageSize: 10
    };

    $scope.tagsName = [];
    $scope.circleList = '';//消息数组

    /** 方法 **/
    // 键盘搜索键方法
    $scope.search = function (param) {
      console.log(param.srcElement.value);
    };
    //返回
    $scope.goBack = function () {
      $scope.$ionicGoBack();
    };
    //进入个人主页
    $scope.inPersonalPage = function (code) {
      $state.go('personalHomepageHe', {othersId: code});
    };
    //进入小店
    $scope.goShop = function () {
      $state.go('myStore', {storeId:$scope.userId,shareStoreId: ''});
    };
    //标签模糊查询
    $scope.toFilterTagSearch = function () {
      $rootScope.toFilterCode = 1;
      $state.go('qSearchBiao');
    };

    $scope.isClick = function () {
      $scope.isDisplay = !$scope.isDisplay;
    };

    $scope.isMoreTag = function () {
      $scope.moreTag = !$scope.moreTag;
      if ($scope.moreTag == false) {
        $ionicScrollDelegate.scrollTop();
      }
      console.log($scope.moreTag);
      $ionicScrollDelegate.resize();
    };

    // 跳转到消息中心
    $scope.jumpMsgCenter = function () {
      $state.go('ClassifyMessageCenter');
    };
    //初始化获取圈子列表
    $scope.getCircleLists = function () {
      $scope.pageNum = 1;
      var params = {
        pageIndex: $scope.pageNum,
        pageSize: 10,
        tagIds: ''
      };
      AllCircleService.filterCircle(params)
        .success(function (response) {
          $scope.totalCount = response.totalCount;
          $scope.circleList = response.data.list.topicList;
          // $ionicScrollDelegate.$getByHandle('allMainScroll').scrollTop();//返回到此页回滚到顶部
        }).error(function () {

      })
    };
    // 标签筛选
    $scope.tagsFilter = function (id,index,clicked) {
      $scope.moreTag = false;
      $scope.pageNum = 1;
      $scope.searchId = id;
      if (clicked == true) {
        $scope.tagsName[index].isChecked = false;
        $scope.init();
        // $scope.pageNum = 0;
        // $scope.circleList = [];
        // $scope.searchId = '';
        // $scope.hasmore = true;
        // $scope.searchId = '';
        $ionicScrollDelegate.$getByHandle('allMainScroll').scrollTop();//返回到此页回滚到顶部
      } else {
        angular.forEach($scope.tagsName,function (data) {
          data.isChecked = false;
        });

        $scope.tagsName[index].isChecked = true;

        var params = {
          pageIndex: 1,
          pageSize: 5,
          tagIds: id
        };
        AllCircleService.filterCircle(params)
          .success(function (response) {
            console.log(response)
            $scope.totalCount = response.totalCount;
            $scope.circleList = response.data.list.topicList;
            $ionicScrollDelegate.$getByHandle('allMainScroll').scrollTop();//返回到此页回滚到顶部
          }).error(function () {

        })
      }
    };

    // 跳转到圈子详情页
    $scope.toCirclePage = function (topicId) {
      $state.go('circlePage', {circleId: topicId});
      console.log(topicId);
    };
    // 跳转到圈子详情页
    $scope.toApplyCircle = function (num) {
      $scope.showNum = num;
      AllCircleService.existApplyingCircle()
        .success(function (response) {
          if(response.success) {
            $state.go('applyCircle');
            delete $rootScope.reviewCircleId;
          } else {
            $scope.applyCircleModal.show();
          }
        }).error(function () {

      });
    };

    //获得所有标签
    $scope.getTags = function () {
      var param = {
        topicId: '',
        noLoading:true
      };
      AllCircleService.getTags(param)
        .success(function (response) {
          console.log(response);
          $scope.tagsName = response.data.list;
        })
    };
    //加入圈子
    $scope.joinCircle = function (item) {
      HomePageService.isWdHost()
        .success(function (res) {
          $rootScope.isWdHost = res.data.isHost;
          if($rootScope.isWdHost==-1){//如果没有登录 跳转到登录页面
            $state.go('login');
          }else{
            if(window.cordova){
              $rootScope.gio.track('follow', {circleID:item.id});
              $rootScope.gio.track('active', {circleID:item.id});
            }
            console.log(item);
            $scope.itemTopicName = item.topicName;
            var ids = {
              ids: item.id,
              noLoading:true
            };
            AllCircleService.joinTopic(ids)
              .success(function (response) {
                if (response.success == true) {
                  item.isJoin = 1;
                  if (response.success == true) {
                    // PopupService.showToast(response.message);
                    $scope.inCircle = true;
                    $timeout(function () {
                      $scope.inCircle = false;
                    }, 1000);
                    console.log('加入成功');
                  } else {
                    PopupService.showToast(response.message);
                  }
                } else if(response.errorCode==-2000){
                  PopupService.showToast(response.message);
                  $rootScope.loginIsAccord2 = true;
                }
              })
          }
        })
      
    };

    //消息上拉刷新
    $scope.loadMore = function () {
      $scope.pageNum += 1;
      var searchTag = {
        tagIds:$scope.searchId?$scope.searchId:'',
        pageIndex: $scope.pageNum,
        pageSize: 5
      };

      AllCircleService.getTopicList(searchTag)
        .success(function (response) {
          if (response.data.list.topicList && response.data.list.topicList.length != 0) {
            $timeout(function () {
              $scope.totalCount = response.totalCount;
              $scope.circleList = $scope.circleList.concat(response.data.list.topicList);
              $scope.$broadcast('scroll.infiniteScrollComplete');
              var len = $scope.circleList.length;
              $scope.hasmore = !(len == response.totalCount);
              $scope.$broadcast('scroll.refreshComplete');
              $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 1000);

          } else {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hasmore = false;
            // $scope.circleList = [];
            // PopupService.showToast('没有更多消息了');
          }
        })
        .error(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    //隐藏modal
    $scope.hideApplyCircleModal = function () {
      $scope.applyCircleModal.hide();
    };
    //获得圈子的一级标题
    $scope.getTitleList=function(){
      AllCircleService.getTopicTitleList()
        .success(function (response) {
          console.log(response);
          if(response.success){
            $scope.titleList=response.data.list;
            $scope.itemTopicList($scope.titleList[0].id,0)
            for(var i=0;i<$scope.titleList.length;i++){
              $scope.titleList[i].className='';
            }
          }
        })
    }
    //获得圈子二级列表
    $scope.itemTopicList=function(id,index){
      var param={
        categoryId:id
      }
      AllCircleService.getTopicSecondList(param)
        .success(function (response) {
          console.log(response);
          if(response.success){
            for(var i=0;i<$scope.titleList.length;i++){
              $scope.titleList[i].className='';
            }
            $scope.titleList[index].className='bac';
            $scope.secondList=response.data.list;
          }
        })
    }
    $scope.init = function () {
      $scope.titleList=[];//圈子的一级标题
      $scope.secondList=[];//圈子的二级标题
      $scope.userId = UserService.getUser().mid;
      //申请消息弹框
      $ionicModal.fromTemplateUrl('templates/quanzi/applyCircleModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.applyCircleModal = modal;
      });
      $scope.pageNum = 0;
      $scope.getTitleList();
      $scope.getCircleLists();//获取圈子列表
      $scope.getTags();//获取标签
      $scope.searchId = '';
      $scope.moreTag = false;
      $scope.isDisplay = false;
      $scope.hasmore = true;
      $scope.circleList = [];
      $ionicScrollDelegate.$getByHandle('allMainScroll').scrollTop();//返回到此页回滚到顶部
    };
    

    $scope.$on('$ionicView.beforeEnter', function (event,v) {
      if (v.direction == 'back') {
        console.log('前页返回');
        console.log('v',v.direction);
      } else {
        console.log('v',v.direction);
        $('ion-header-bar').show();
        $scope.init();
      }
    });

  }
]);

APP.service('AllCircleService', ['$http', 'UrlService', function ($http, UrlService) {
  //获得未读消息数量
  this.getUserMessageCount = function () {
    return $http.post(UrlService.getUrl('GETUSERMESSAGECOUNT'));
  };
  //圈子所有标签
  this.getTags = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('TOPIC_TAGS'),
      data: param
    });
  };
  //圈子一级分类列表
  this.getTopicTitleList=function(){
    return $http.get(UrlService.getUrl('CIRCLE_GET_CIRCLE_LIST'));
  }
  //圈子二级分类列表
  this.getTopicSecondList=function(param){
    return $http.get(UrlService.getUrl('CIRCLE_GET_SECONDLIST'),param);
  }

  //圈子列表
  this.getTopicList = function (params) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('GETLISTBYCONDITION'),
      data: params
    });
  };
  //加入圈子方法
  this.joinTopic = function (param) {
    // return $http.post(UrlService.getUrl('JOIN_TOPIC'));
    return $http({
      method: 'POST',
      url: UrlService.getUrl('JOIN_TOPIC'),
      data: param
    });
  };
  //标签筛选圈子
  this.filterCircle = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('GETLISTBYCONDITION'),
      data: param
    });
  };
  //是否存在已申请中的圈子
  this.existApplyingCircle = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('EXIST_APPLY_TOPIC'),
      data: param
    });
  };

}]);
