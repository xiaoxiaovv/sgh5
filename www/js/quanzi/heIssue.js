'use strict';

/**
 *  start @ zyr 2017.10.10
 */
APP.controller('heIssueController', ['$http', '$scope','$location', '$anchorScroll','$cacheFactory', 'heIssueService', '$stateParams', '$ionicSlideBoxDelegate', '$state', '$ionicSideMenuDelegate', '$cookieStore', 'UserService', '$ionicPopup', '$timeout', 'LoginService', '$rootScope', '$ionicScrollDelegate', '$ionicModal', 'BannerThemeService', '$localstorage', 'VersionService', 'PopupService', 'PersonalCenterService', 'personalHomepageHeService',function ($http, $scope, $location, $anchorScroll,$cacheFactory, heIssueService, $stateParams, $ionicSlideBoxDelegate, $state, $ionicSideMenuDelegate, $cookieStore, UserService, $ionicPopup, $timeout, LoginService, $rootScope, $ionicScrollDelegate, $ionicModal, BannerThemeService, $localstorage, VersionService, PopupService, PersonalCenterService, personalHomepageHeService) {
  $scope.titles = [{ 'title': 'TA的发布' }, { 'title': 'TA的评论' }, { 'title': 'TA的原创' }];

  if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
    //只有ios app 特有的样式
    $scope.paddingtopClass = {
      "margin-top": "16px"
    };
    $scope.paddingtopClasscontent = {
      "top": "60px"
    };
  } else {
    $scope.paddingtopClass = {
      "margin-top": "0px"
    };
    $scope.paddingtopClasscontent = {
      "top": "44px"
    };
  }
  //返回
  $scope.goBack = function () {
    $scope.$ionicGoBack();
    console.log(11111);
  };
  //定义变量
  $scope.hasmore = false;
  //初始化
  $scope.init = function(title,id,type) {
    $scope.cuurentUserId = id;
    $scope.pageIndex = 1;
    $scope.pageSize = 5;
    $scope.pageSize10 = 10;
    if (title == 'original') {
      //我(TA)的原创
      getMyStoryList($scope.pageIndex, $scope.pageSize, $scope.cuurentUserId)
    } else if (title == 'issue') {
      //我(TA)的发布
      getMyIssueList($scope.pageIndex, $scope.pageSize, $scope.cuurentUserId,$scope.issueType);
    } else if (title == 'comment') {
      //我(TA)的评论
      getMyCommentList($scope.pageIndex, $scope.pageSize, $scope.cuurentUserId,$scope.commentType);
    } else if (title == 'dashang') {
      //我(TA)的打赏
      getDaShangList($scope.pageIndex, $scope.pageSize, $scope.cuurentUserId);
    } else if (title == 'shoucang') {
      //我(TA)的收藏
      getCollectionList($scope.pageIndex, $scope.pageSize, $scope.cuurentUserId);
    } else if (title == 'quanzi') {
      //我(TA)加入的圈子
      if (type == 1) {
        getMyCreatTopicList($scope.cuurentUserId);
      } else if (type ==0) {
        getMyJoinedTopicsList($scope.cuurentUserId);
      }
    } else if (title == 'zan') {
      //我(TA)的赞
      getUserPraiseList($scope.pageIndex, $scope.pageSize10, $scope.cuurentUserId);
    }
  }
  //我(TA)的发布getMyIssueList
  function getMyIssueList(pageIndex, pageSize ,userId,issueType) {
    heIssueService.getMyIssue(pageIndex,pageSize,userId,issueType).success(function(response) {
      if (response.success == true) {
        console.log(response.data);
          $scope.issueData = response.data;
        if (response.data.list != null && response.data.list != undefined && response.data.list.length != 0) {
          console.log($scope.MyStoryList);
          $scope.MyStoryList = $scope.MyStoryList.concat(response.data.list);
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.pageIndex += 1;
          $scope.hasmore = true;
        } else {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.hasmore = false;
        }
      }
    })
  }
  //我(TA)的评论
  function getMyCommentList(pageIndex, pageSize ,userId,commentType) {
    heIssueService.getMyComment(pageIndex,pageSize,userId,commentType).success(function(response) {
      if (response.success == true) {
        console.log(response.data);
        $scope.commentData = response.data;
        if (response.data.list != null && response.data.list != undefined && response.data.list.length != 0) {
          $scope.commentList = $scope.commentList.concat(response.data.list);
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.pageIndex += 1;
          $scope.hasmore = true;
        } else {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.hasmore = false;
        }
      }
    })
  }
  //我(TA)的原创
  function getMyStoryList(pageIndex, pageSize ,userId) {
    heIssueService.getMyStory($scope.pageIndex,$scope.pageSize,$scope.cuurentUserId).success(function(response) {
      if (response.success == true) {
        console.log(response.data);
        if (response.data.list != null && response.data.list != undefined && response.data.list.length != 0) {
          $scope.MyStoryList = $scope.MyStoryList.concat(response.data.list);
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.pageIndex += 1;
          $scope.hasmore = true;
        } else {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.hasmore = false;
        }
      }
    })
  }
  //我(TA)的打赏
  function getDaShangList(pageIndex, pageSize ,userId) {
    heIssueService.getDaShang($scope.pageIndex,$scope.pageSize,$scope.cuurentUserId).success(function(response) {
      if (response.success == true) {
        console.log(response.data);
          $scope.DaShangData = response.data;
        if (response.data.list != null && response.data.list != undefined && response.data.list.length != 0) {
          $scope.DaShangList = $scope.DaShangList.concat(response.data.list);
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.pageIndex += 1;
          $scope.hasmore = true;
          console.log($scope.DaShangList)
        } else {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.hasmore = false;
        }
      }
    })
  }
  //我(TA)的收藏
  function getCollectionList(pageIndex, pageSize ,userId) {
    heIssueService.getCollection($scope.pageIndex,$scope.pageSize,$scope.cuurentUserId).success(function(response) {
      if (response.success == true) {
        console.log(response.data);
          $scope.CollectionData = response.data;
        if (response.data.list != null && response.data.list != undefined && response.data.list.length != 0) {
          $scope.CollectionList = $scope.CollectionList.concat(response.data.list);
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.pageIndex += 1;
          $scope.hasmore = true;
          console.log($scope.CollectionList)
        } else {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.hasmore = false;
        }
      }
    })
  }
  //我(TA)加入的圈子
  function getMyJoinedTopicsList(userId) {
    heIssueService.getMyJoinedTopics(userId).success(function(response) {
      if (response.success == true) {
        console.log(response.data);
        $scope.myTopicData = response.data;
        $scope.myTopicList = response.data.list;
        console.log($scope.myTopicList)
      }
    })
  }
  //我(TA)创建的圈子
  function getMyCreatTopicList(userId) {
    heIssueService.getMyCreatTopics(userId).success(function(response) {
      if (response.success == true) {
        console.log(response.data);
        $scope.myTopicData = response.data;
        $scope.myTopicList = response.data.list;
        console.log($scope.myTopicList)
      }
    })
  }
  //我(TA)的赞
  function getUserPraiseList(pageIndex, pageSize ,userId) {
    heIssueService.getUserPraise(pageIndex,pageSize,userId).success(function(response) {
      if (response.success == true) {
        console.log(response.data);
          $scope.CollectionData = response.data;
        if (response.data.list != null && response.data.list != undefined && response.data.list.length != 0) {
          $scope.UserPraiseList = $scope.UserPraiseList.concat(response.data.list);
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.pageIndex += 1;
          $scope.hasmore = true;
          console.log($scope.UserPraiseList)
        } else {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.hasmore = false;
        }
      }
    })
  }
  $scope.loadMore = function () {
    //加载更多评论
    if ($stateParams.title == 'comment') {
      getMyCommentList($scope.pageIndex, $scope.pageSize, $scope.cuurentUserId,$scope.commentType);
    } 
    //加载更多发布列表
    else if ($stateParams.title == 'issue') {
      getMyIssueList($scope.pageIndex, $scope.pageSize, $scope.cuurentUserId,$scope.issueType);
    }
    //加载更多原创列表
    else if ($stateParams.title == 'original') {
      getMyStoryList($scope.pageIndex, $scope.pageSize, $scope.cuurentUserId);
    }
    //加载更多打赏列表
    else if ($stateParams.title == 'dashang') {
      getDaShangList($scope.pageIndex, $scope.pageSize, $scope.cuurentUserId);
    }
    //加载更多收藏列表
    else if ($stateParams.title == 'shoucang') {
      getCollectionList($scope.pageIndex, $scope.pageSize, $scope.cuurentUserId);
    }
    //加载更多圈子列表
    else if ($stateParams.title == 'quanzi') {
      if ($scope.chooseQuanIndex == 0) {
        getMyCreatTopicList($scope.cuurentUserId);
      } else if ($scope.chooseQuanIndex == 1) {
        getMyJoinedTopicsList($scope.cuurentUserId);
      }
    }
    //加载更多赞 列表
    else if ($stateParams.title == 'zan') {
      getUserPraiseList($scope.pageIndex, $scope.pageSize10, $scope.cuurentUserId);
    }
  };
  $scope.$on('$ionicView.beforeEnter', function (e,v) {
      if (v.direction == 'back') {
        return;
      }
      $ionicScrollDelegate.scrollTop();
      //我(TA)的发布 默认的tab选中
      $scope.chooseIndex = 0;
      //我(TA)的发布列表
      $scope.issueList = [];
      $scope.issueType = 0;
      //我(TA)的评论 默认的tab选中
      $scope.chooseComIndex = 0;
      //我(TA)的 圈子 默认的tab选中
      $scope.chooseQuanIndex = 0;
      // 圈子列表的 title
      $scope.quanziTitle = '加入';
      //圈子中  状态  0 是草稿, 1 是审批中, 2 是未通过, 3 是已通过
      $scope.chooseResuIndex = 0;
      //我(TA)的评论列表
      $scope.commentList = [];
       //评论默认选项
      $scope.commentType = 0;
      //我(TA)的原创列表
      $scope.MyStoryList = [];
      $scope.DaShangList = [];
      //我(TA)的收藏列表
      $scope.CollectionList = [];
      //我(TA)的圈子列表
      $scope.myTopicList = [];
      //我(TA)的赞列表
      $scope.UserPraiseList = [];
      $scope.openStoreTime_index = 1;
      $scope.authenIndex = 0;
      $scope.memberId = $stateParams.memberId;
     // $scope.init();
      // $scope.authInit();
      //导航 title
      if ($stateParams.who == 'his') {
        $scope.titleStart = 'TA';
      } else if($stateParams.who == 'mine') {
        $scope.titleStart = '我';
      }
      switch ($stateParams.title) {
        case 'issue':
          $scope.titleEnd = '的发布';
          break;
        case 'comment':
          $scope.titleEnd = '的评论';
          break;
        case 'original':
          $scope.titleEnd = '的原创';
          break;
        case 'dashang':
          $scope.titleEnd = '的打赏';
          break;
        case 'quanzi':
          $scope.titleEnd = '的圈子';
          break;
        case 'zan':
          $scope.titleEnd = '的赞';
          break;
        case 'shoucang':
          $scope.titleEnd = '的收藏';
          break;
        default :
          $scope.titleEnd = '的发布';
      }
      //执行 初始化
      $scope.init($stateParams.title,$stateParams.id,0);
    });
  $scope.chooseTab = function (index) {
    
    //切换时 先把页面滚动到顶部
    $ionicScrollDelegate.scrollTop();
     $scope.page = 2;
    // $scope.chooseIndex = index;
    if(index == 0){  
      //全部;
      console.log(index);
      $scope.chooseIndex = index;
      $scope.issueType = index;
      $scope.MyStoryList = [];
      $scope.init('issue',$stateParams.id,$scope.issueType);
    }else if(index == 1){//如果是 实名认证
      console.log(index);
      $scope.chooseIndex = index;
      // 视频
      $scope.issueType = index;
      $scope.MyStoryList = [];
      $scope.init('issue',$stateParams.id,$scope.issueType);
    }else if(index == 2){//如果是 盟主舵主
      console.log(index);
      $scope.chooseIndex = index;
      // 悬赏
      $scope.issueType = index;
      $scope.MyStoryList = [];
      $scope.init('issue',$stateParams.id,$scope.issueType);
    } else if(index == 3) {
      console.log(index);
      $scope.chooseIndex = index;
      // 收赏
      $scope.issueType = index;
      $scope.MyStoryList = [];
      $scope.init('issue',$stateParams.id,$scope.issueType);
    }
  }

  /*TA的评论*/
  $scope.chooseComTab = function (index) {
    //切换时 先把页面滚动到顶部
    $ionicScrollDelegate.scrollTop();
    if (index == 0) {
      //全部
      $scope.commentList = [];
      console.log(index);
      $scope.chooseComIndex = index;
      $scope.commentType = index;
      $scope.init('comment',$stateParams.id,$scope.commentType);
    } else if (index == 1) {
      //被采纳
      console.log(index);
      $scope.commentList = [];
      $scope.chooseComIndex = index;
      $scope.commentType = index;
      $scope.init('comment',$stateParams.id,$scope.commentType);
    } else if (index == 2) {
      //被打赏
      console.log(index);
      $scope.commentList = [];
      $scope.chooseComIndex = index;
      $scope.commentType = index;
      $scope.init('comment',$stateParams.id,$scope.commentType);
    }
  }
  /*TA的圈子*/
  $scope.chooseQuanTab = function(index) {
    if (index == 0) {
      console.log(index);
      $scope.myTopicList = [];
      $scope.chooseQuanIndex = 0;
      $scope.quanziTitle = '加入';
      $scope.init('quanzi',$stateParams.id,0);
    } else if (index ==1) {
      console.log(index);
      $scope.myTopicList = [];
      $scope.chooseQuanIndex = 1;
      $scope.quanziTitle = '创建';
      $scope.init('quanzi',$stateParams.id,1);
    }
  }
 
  
  /*跳转到 帖子详情*/
  $scope.toNoteDetails = function (id, isShort) {
    $state.go('noteDetails', {noteId: id, isShortStory: isShort});
  };
  /*跳转到我的评论详情页面*/
  $scope.CommentDetails = function(comment) {
    if (comment.flag == 2) {
      $state.go('classNoteDetails', {
        noteId: comment.storyId
      });
      
    } else  {
      $state.go('noteDetails', {
        noteId: comment.storyId,
        isShortStory: comment.isShortStory
      });
    }
  }
  /*我的收藏 跳转详情页*/
  $scope.viewStory = function (story) {
    if (story.flag !== 2) {
      $state.go('noteDetails', {
        noteId: story.id,
        isShortStory: story.isShortStory
      });
    } else {
      $state.go('classNoteDetails', {
        noteId: story.id
      });

    }
  };
  // 发布点赞
  $scope.topicPraise = function (id, index) {
      if(window.cordova){
        $rootScope.gio.track('like', {circleID:$stateParams.circleId});
        $rootScope.gio.track('active', {circleID:$stateParams.circleId});
      }
      var param = {
        id: id,
        noLoading:true
      };
      heIssueService.pushPraise(param)
        .success(function (response) {
          if (response.success == true) {
            if ($scope.MyStoryList[index].praiseFlag == 1) {
              $scope.MyStoryList[index].praiseNumber = $scope.MyStoryList[index].praiseNumber - 1;
              $scope.MyStoryList[index].praiseFlag = !$scope.MyStoryList[index].praiseFlag;
              console.log('取消点赞成功');
            } else {
              $scope.MyStoryList[index].praiseNumber = parseInt($scope.MyStoryList[index].praiseNumber) + 1;
              $scope.MyStoryList[index].praiseFlag = !$scope.MyStoryList[index].praiseFlag;
              console.log('点赞成功');
            }
          } else {
            $timeout(function () {
              PopupService.showToast(response.message);
            }, 200);
          }
        });
    };
  // 收藏点赞
  $scope.CollectionPraise = function (item, index) {
      if(window.cordova){
        $rootScope.gio.track('like', {circleID:$stateParams.circleId});
        $rootScope.gio.track('active', {circleID:$stateParams.circleId});
      }
      var param = {
        id: item.id,
        noLoading:true
      };
      if (item.flag == 1) {
        heIssueService.pushPraise(param)
          .success(function (response) {
          if (response.success == true) {
            if ($scope.CollectionList[index].praiseFlag == 1) {
              $scope.CollectionList[index].praiseNumber = $scope.CollectionList[index].praiseNumber - 1;
              $scope.CollectionList[index].praiseFlag = !$scope.CollectionList[index].praiseFlag;
              console.log('取消点赞成功');
            } else {
              $scope.CollectionList[index].praiseNumber = parseInt($scope.CollectionList[index].praiseNumber) + 1;
              $scope.CollectionList[index].praiseFlag = !$scope.CollectionList[index].praiseFlag;
              console.log('点赞成功');
            }
          } else {
            $timeout(function () {
              PopupService.showToast(response.message);
            }, 200);
          }
        });
      }
      if (item.flag == 2) {
        heIssueService.SchoolPraise(param)
         .success(function (response) {
          if (response.success == true) {
            if ($scope.CollectionList[index].praiseFlag !=0 ) {
              $scope.CollectionList[index].praiseNumber = $scope.CollectionList[index].praiseNumber - 1;
              console.log($scope.CollectionList[index].praiseFlag);
              console.log(!$scope.CollectionList[index].praiseFlag);
              $scope.CollectionList[index].praiseFlag = !$scope.CollectionList[index].praiseFlag;
              console.log('取消点赞成功');
            } else {
              $scope.CollectionList[index].praiseNumber = parseInt($scope.CollectionList[index].praiseNumber) + 1;
              $scope.CollectionList[index].praiseFlag = !$scope.CollectionList[index].praiseFlag;
              console.log('点赞成功');
            }
          } else {
            $timeout(function () {
              PopupService.showToast(response.message);
            }, 200);
          }
        });
      }
    };
  // 收藏或者取消收藏
  $scope.dealStory = function (item, type) {
    var Type;
    if (item.flag !== 2) {
      Type = type;
    } else {
      Type = (type == 1) ? 3 : 4;
    }
    var id = item.storyTopicId ? item.storyTopicId : item.id;
    personalHomepageHeService.dealStory(id, Type).then(function (res) {
      if (res.data.success == true) {
        var num;
        switch (Type) {
          case 1:
            num = parseInt(item.praiseNumber);
            item.praiseNumber = item.praiseFlag ? num - 1 : num + 1;
            item.praiseFlag = !item.praiseFlag;
            //PopupService.showToast(item.praiseFlag ? "已点赞！" : "已取消点赞");
            break;
          case 2:
            num = parseInt(item.collectionNumber);
            item.collectionNumber = item.collectionFlag ? num - 1 : num + 1;
            item.collectionFlag = !item.collectionFlag;
            console.log(3333);
              for (var i = 0; i < $scope.CollectionList.length; i++) {
                if (id == $scope.CollectionList[i].id) {
                  $scope.CollectionList.splice(i, 1);
                  //$scope.myCollectionStory.nums--;
                  console.log(2222);
                }
              }
            //PopupService.showToast(item.collectionFlag ? "已收藏！" : "已取消收藏");
            break;
          case 3:
            num = parseInt(item.praiseNumber);
            item.praiseNumber = item.praiseFlag ? num - 1 : num + 1;
            item.praiseFlag = !item.praiseFlag;
            //PopupService.showToast(item.praiseFlag ? "已点赞！" : "已取消点赞");
            break;
          case 4:
            num = parseInt(item.collectionNumber);
            item.collectionNumber = item.collectionFlag ? num - 1 : num + 1;
            item.collectionFlag = !item.collectionFlag;
            
              for (i = 0; i < $scope.CollectionList.length; i++) {
                if (id == $scope.CollectionList[i].id) {
                  $scope.CollectionList.splice(i, 1);
                  //$scope.myCollectionStory.nums--;
                }
              }
            //PopupService.showToast(item.collectionFlag ? "已收藏！" : "已取消收藏");
            break;
        }
      } else {
        //PopupService.showToast('操作失败！', res.data.message);
        console.log(res.data.message);
      }
    }, function () {
      PopupService.showToast('网络错误！');
    });
  };
  //进入某个圈子
  $scope.viewTopic = function (id) {
    $state.go('circlePage', {circleId: id});
  };
  //跳转到搜索
  $scope.gotoqSearch = function () {
    $state.go('qSearch');
  };
}]);

APP.service('heIssueService', ['$http', 'UrlService', function ($http, UrlService) {
  // 我(TA) 的发布 列表
  this.getMyIssue = function(pageIndex, pageSize, userId,issueType) {
    return $http({
      method: 'post',
      url: UrlService.getUrl('GET_USER_ISSUE_LIST'),
      data: {
        pageIndex: pageIndex,
        pageSize: pageSize,
        userId: userId,
        storyType:issueType
      }
    });
  }
  // 我(TA) 的原创 列表
  this.getMyStory = function(pageIndex, pageSize, userId) {
    return $http({
      method: 'post',
      url: UrlService.getUrl('GET_MY_STORY_LIST'),
      data: {
        pageIndex: pageIndex,
        pageSize: pageSize,
        userId: userId
      }
    });
  }
  //我(TA)的评论 列表
  this.getMyComment = function(pageIndex, pageSize, userId,commentType) {
    return $http({
      method: 'post',
      url: UrlService.getUrl('GET_MY_COMMENT_LIST'),
      data: {
        pageIndex: pageIndex,
        pageSize: pageSize,
        userId: userId,
        commentType:commentType
      }
    });
  }
  //我(TA)的评论内容 id
  this.myCommentId = '';
  //我(TA)的打赏 列表
  this.getDaShang = function(pageIndex, pageSize, userId) {
    return $http({
      method: 'post',
      url: UrlService.getUrl('GET_UCTIP_LIST'),
      data: {
        pageIndex: pageIndex,
        pageSize: pageSize,
        userId: userId
      }
    });
  }
  //我(TA)的收藏 列表
  this.getCollection = function (pageNumber, pageSize, userId) {
    return $http({
      method: 'post',
      url: UrlService.getUrl('GET_USER_COLLECTION_LIST'),
      data: {
        pageIndex: pageNumber,
        pageSize: pageSize,
        userId: userId
      }
    });
  };
  //我(TA)的圈子 列表 加入
  this.getMyJoinedTopics = function (userId) {
        return $http({
            method: 'post',
            url: UrlService.getUrl('GET_USER_JOINTOPIC_LIST'),
            data: {
              userCode: userId
            }
        });
    };
  //我(TA)的圈子 列表 创建
  this.getMyCreatTopics = function (userId) {
        return $http({
            method: 'post',
            url: UrlService.getUrl('GET_USER_CREATETOPIC_LIST'),
            data:  {
              userCode: userId
            }
        });
    };
  //贴子点赞
  this.pushPraise = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('COMMENT_PRAISE'),
      data: param
    });
  };
  //商学院 帖子点赞
  this.SchoolPraise = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('SCHOOLPRAISESTORY'),
      data: param
    });
  };
  //我(TA)的赞 列表
  this.getUserPraise = function (pageNumber, pageSize, userId) {
    return $http({
      method: 'post',
      url: UrlService.getUrl('GET_USER_PRAISE_LIST'),
      data: {
        pageIndex: pageNumber,
        pageSize: pageSize,
        userId: userId
      }
    });
  };
}]);
 /*图片字符转换成 数组*/
APP.filter('commentArrImg',function() {
  return function(str) {
    return str.split(',');
  }
});