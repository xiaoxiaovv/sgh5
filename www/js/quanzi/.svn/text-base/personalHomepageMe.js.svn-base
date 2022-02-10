/**
 * 个人页面
 * 业务逻辑
 * Created by shantao.wang on 2016/10/11 0011.
 */
APP.controller('personalHomepageMeCtrl', ['$scope','heIssueService', 'myFollowService','myFansService','$rootScope', '$state', '$timeout', '$interval', '$ionicScrollDelegate', 'PopupService', 'UserService',
  'personalHomepageMeService', 'UrlService', 'personalHomepageHeService', '$ionicModal','CreditService',
  function ($scope, heIssueService, myFollowService, myFansService, $rootScope, $state, $timeout, $interval, $ionicScrollDelegate, PopupService, UserService, personalHomepageMeService, UrlService, personalHomepageHeService, $ionicModal,CreditService) {
    /*顶部距离判断*/
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
      //只有ios app 特有的样式
      $scope.paddingtopClass = {
        "margin-top": "16px"
      };
      $scope.contentHeight = {
        "height": "296px"
      };
    } else {
      $scope.paddingtopClass = {
        "margin-top": "0px"
      };
      $scope.contentHeight = {
        "height": "280px"
      };
    }
    //返回
    $scope.goBackTo = function () {
        $scope.$ionicGoBack();
        console.log(2);
     };
    /**
     * 变量声明
     */
    $scope.messageNum = undefined;
    $scope.ifRed = undefined;
    $scope.isDisplay = undefined;
    $scope.userId = "";
    $scope.user = undefined;//UserService
    $scope.userData = {};
    $scope.data = [];//绑定到视图的数据
    $scope.story = undefined;
    $scope.selectedIndex = undefined;
    $scope.notApply = undefined;//默认没申请讲师
    $scope.teachedList = '';//讲授的课程
    $scope.joinedList = '';//参加的课程
    /*********************分享标签－whiteBird start*********************/
    $scope.showShare = false;
    /*********************分享标签－whiteBird end*********************/
    $scope.myTopics = undefined;//我的圈子
    $scope.noTopic = false;//我的圈子空背景

    $scope.myStory = {
      nums: -1,
      pageIndex: 0,
      pageSize: 6,
      storyList: undefined,//原创帖子列表，要显示就赋给$scope.data
      hasMore: true,
      api: function (pageIndex, pageSize) {
        return personalHomepageMeService.getMyStory(pageIndex, pageSize);
      }
    };
    $scope.myCollectionStory = {
      nums: -1,
      pageIndex: 0,
      pageSize: 6,
      storyList: undefined,//喜欢帖子列表，要显示就赋给$scope.data
      hasMore: true,
      api: function (pageIndex, pageSize) {
        return personalHomepageMeService.getMyCollection(pageIndex, pageSize);
      }
    };

    /**
     * 页面初始化方法
     */
    $scope.init = function (tab) {
      /*********************************** p2 *****************************/

      /*start @zyr*/
        $scope.tabNav = 'personalHomepageMe';
        $scope.hisLists = [
            {title:"dashang",icon:$rootScope.imgBaseURL+"img/homepage/dashang@2x.png",text:"我的打赏",nums:"0",goIcon:$rootScope.imgBaseURL+"img/homepage/go2@2x.png"},
            {title:"zan",icon:$rootScope.imgBaseURL+"img/homepage/zan@2x.png",text:"我的赞",nums:"0",goIcon:$rootScope.imgBaseURL+"img/homepage/go2@2x.png"},
            {title:"shoucang",icon:$rootScope.imgBaseURL+"img/homepage/Shape@2x.png",text:"我的收藏",nums:"0",goIcon:$rootScope.imgBaseURL+"img/homepage/go2@2x.png"},
        ]
      /*end @zyr*/

      $ionicModal.fromTemplateUrl('templates/quanzi/ApplyTeacherModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.applyTeacherModal = modal;
      });

      /*$scope.getTeachedList();//获取讲授的课程列表
      $scope.getJoinededList();//获取参加的课程列表*/
      /*********************************** p2 *****************************/

      $scope.myTopics = undefined;

      $scope.myStory.nums = -1;
      $scope.myStory.pageIndex = 0;
      $scope.myStory.storyList = undefined;
      $scope.myStory.hasMore = true;

      $scope.myCollectionStory.nums = -1;
      $scope.myCollectionStory.pageIndex = 0;
      $scope.myCollectionStory.storyList = undefined;
      $scope.myCollectionStory.hasMore = true;

      $scope.notApply = true;//默认没申请讲师
      $scope.isDisplay = false;
      $scope.data = [];
      $scope.selectedIndex = undefined;
      //用户id获取
      $scope.user = UserService.getUser();
      //console.log($scope.user);
      $scope.userId = UserService.getUser().mid;

      //获取用户信息接口数据
      console.log('个人信息入参：', 2, $scope.userId);
      personalHomepageMeService.getUserData1('2', $scope.userId)
        .success(function (response) {
          console.log(response.data);
          $scope.userData1 = response.data;
          if (response.data.storeGride) {
            $scope.levelArray = [];
            if (response.data.storeGride <= 3) {
              // $scope.imgCount = response.data.storeGride;
              for (var i = 0; i < response.data.storeGride; i++) {
                $scope.levelArray.push($rootScope.imgBaseURL+'img/StarLevel@2x.png');
              }
            } else {
              for (var i = 0; i < response.data.storeGride - 3; i++) {
                $scope.levelArray.push($rootScope.imgBaseURL+'img/DiamondLevel@2x.png');
              }
            }
          }
          //$scope.loadData($scope.myStory);//加载一页原创帖子数据
          console.log('个人信息出参：', response);
        })
        .error(function () {
          alert("网络失败！");
      });
      personalHomepageMeService.getUserData2('2', $scope.userId)
        .success(function (response) {
          console.log(response.data);
          $scope.userData2 = response.data;
        })
        .error(function () {
          alert("网络失败！");
      });
      personalHomepageMeService.getUserData3('2', $scope.userId)
        .success(function (response) {
          console.log(response.data);
          $scope.userData3 = response.data;
        })
        .error(function () {
          alert("网络失败！");
      });
      /* start by @zyr */
      // new 获取用户信息接口数据
        //按照原来的获取 信息
      //为了获取帖子数量……
      personalHomepageMeService.getMyCollection(1, 0).then(function (res) {
        if (res.data.success == true) $scope.myCollectionStory.nums = res.data.totalCount;
      });
     /* personalHomepageMeService.getMyTopics().then(function (res) {
        $scope.myTopics = res.data.data.list;
        $scope.noTopic = !$scope.myTopics.length;
      }, function (error) {

      });*/

      //$scope.selectTab(tab);//默认选中第一个（原创）标签
      $scope.$broadcast('scroll.refreshComplete');

    };

    /*********************************** p2 *****************************/

    //显示申请讲师结果页面
    $scope.showApplyModal = function () {

      personalHomepageMeService.startApply()
        .success(function (response) {
          if (response.success) {
            if (response.data.applyStatus == 0) {//第一次申请
              $scope.data.isApply = true;
            } else if (response.data.applyStatus == 1) {//正在申请中
              $scope.message = response.message;
              $scope.applyStatus = 1;
              $scope.applyTeacherModal.show();
            } else {//申请被驳回
              $scope.introduce = response.data.introduce;
              $scope.message = response.message;
              $scope.applyStatus = 2;
              $scope.applyTeacherModal.show();
            }
          } else {
            $scope.data.isApply = false;
          }
        }, function (error) {

        });
    };
    //隐藏申请讲师结果页面
    $scope.hideApplyModal = function () {
      delete $scope.applyStatus;
      $scope.applyTeacherModal.hide();
    };
    $scope.jumpMyCircle = function () {
      $state.go('myCirclePages');
    };
    $scope.applyStatus3 = function () {
      $scope.hideApplyModal();
      $timeout(function () {
        $scope.applyStatus = 3;
        $scope.applyTeacherModal.show();
      }, 500);
    };
    //修改申请
    $scope.editApply = function () {
      $scope.hideApplyModal();
      $scope.data.isApply = true;
    };
    //获取讲授的课程列表
    $scope.getTeachedList = function () {
      var params = {
        pageSize: 10,
        pageIndex: 1
      };
      personalHomepageMeService.teachedLessones(params)
        .success(function (response) {
          $scope.teachedList = response.data.list;
        }).error(function () {

      })
    };
    //获取参加的课程列表
    $scope.getJoinededList = function () {
      var params = {
        pageSize: 10,
        pageIndex: 1
      };
      personalHomepageMeService.joinedLessones(params)
        .success(function (response) {
          $scope.joinedList = response.data.list;
          $scope.classesCount = response.data;
        }).error(function () {

      })
    };

    /*********************************** p2 *****************************/


    /**
     * 切换标签方法
     */
    $scope.selectTab = function (index) {
      $scope.selectedIndex = index;//结合ng-class决定标签的不同样式
      switch (index) {
        case 0:
          if (!$scope.myCollectionStory.storyList) {
            $scope.loadData($scope.myCollectionStory, 0);
          }
          $timeout(function () {
            $scope.story = $scope.myCollectionStory;
          }, 0);
          break;
        case 1:
          if (!$scope.myStory.storyList) {
            $scope.loadData($scope.myStory, 0);
          }
          $scope.story = $scope.myStory;
          break;
        case 2:
          if (!$scope.myTopics) {
            personalHomepageMeService.getMyTopics().then(function (res) {
              $scope.myTopics = res.data.data.list;
              $scope.noTopic = !$scope.myTopics.length;
            }, function (error) {

            });
          }
          break;
      }
      //$scope.story = index ? $scope.myStory : $scope.myCollectionStory;//index决定加载方法的参数即决定加载哪组数据
      $timeout(function () {
        $ionicScrollDelegate.resize();
      }, 200)
    };
    /**
     * 上拉刷新加载更多数据方法（将数组变长并赋给data）
     */
    $scope.loadData = function (story, time) {
      if (time == null || time == undefined) time = 1000;//第二个参数决定刷新时间，没有默认1S
      story.pageIndex = story.pageIndex + 1;
      if (story.pageIndex == 1) {
        story.storyList = [];
      }
      console.log('帖子入参：', story.pageIndex, story.pageSize);//入参
      story.api(story.pageIndex, story.pageSize)
        .success(function (response) {
          $timeout(function () {
            if (response.success == true) {
              console.log('帖子出参：', response.data.list);
              story.nums = response.totalCount;
              story.hasMore = story.pageIndex * story.pageSize < response.totalCount;//还有没有数据
              story.storyList = story.storyList.concat(response.data.list);//核心语句：实现要遍历的数组的加长，即实现了加载更多
              console.log($scope.myCollectionStory);
              $scope.$broadcast('scroll.infiniteScrollComplete');
              //$scope.$broadcast('scroll.refreshComplete');
            } else {
              console.log(response.message);
            }
          }, time);
        })
        .error(function () {
          alert("网络失败！");
        });
    };
    /**
     * 加载该页面前调用页面初始化方法
     */
    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      //console.log('e:', e);
      //console.log('v:', v);
      if (v.direction == 'forward' || v.direction == 'exit' || v.direction == 'none') {
        $scope.init(1);
      } else if (v.direction == 'back') {
        $scope.isDisplay = false;
        $scope.downRefresh($scope.selectedIndex);
      }
    });
    /**
     *下拉刷新
     */
    $scope.downRefresh = function (tab) {
      personalHomepageMeService.getUserData1('2', $scope.userId)
        .success(function (response) {
          console.log(response.data);
          $scope.userData = response.data;
          if (response.data.storeGride) {
            $scope.levelArray = [];
            if (response.data.storeGride <= 3) {
              // $scope.imgCount = response.data.storeGride;
              for (var i = 0; i < response.data.storeGride; i++) {
                $scope.levelArray.push($rootScope.imgBaseURL+'img/StarLevel@2x.png');
              }
            } else {
              for (var i = 0; i < response.data.storeGride - 3; i++) {
                $scope.levelArray.push($rootScope.imgBaseURL+'img/DiamondLevel@2x.png');
              }
            }
          }
          //$scope.loadData($scope.myStory);//加载一页原创帖子数据
          console.log('个人信息出参：', response);
        })
        .error(function () {
          alert("网络失败！");
      });
      personalHomepageMeService.getUserData2('2', $scope.userId)
        .success(function (response) {
          console.log(response.data);
          $scope.userData2 = response.data;
        })
        .error(function () {
          alert("网络失败！");
      });
      personalHomepageMeService.getUserData3('2', $scope.userId)
        .success(function (response) {
          console.log(response.data);
          $scope.userData3 = response.data;
        })
        .error(function () {
          alert("网络失败！");
        });
      switch (tab) {
        case 0:
          $scope.selectedIndex = 0;
          $scope.myCollectionStory.nums = -1;
          $scope.myCollectionStory.pageIndex = 0;
          $scope.myCollectionStory.storyList = undefined;
          $scope.myCollectionStory.hasMore = true;
          $scope.loadData($scope.myCollectionStory, 0);
          break;
        case 1:
          $scope.selectedIndex = 1;
          $scope.myStory.nums = -1;
          $scope.myStory.pageIndex = 0;
          $scope.myStory.storyList = undefined;
          $scope.myStory.hasMore = true;
          $scope.loadData($scope.myStory, 0);
          break;
        case 2:
          $scope.selectedIndex = 2;
          $scope.myTopics = undefined;
          personalHomepageMeService.getMyTopics().then(function (res) {
            $scope.myTopics = res.data.data.list;
            $scope.noTopic = !$scope.myTopics.length;
          }, function (error) {

          });
          break;
      }
      //$scope.selectTab(tab);//默认选中第一个（原创）标签
      $scope.$broadcast('scroll.refreshComplete');
    };
    //图片处理方法
    $scope.noFind = function () {
      $scope.userData.img = 'http://cdn09.ehaier.com/shunguang/H5/www/img/quanzi/user.jpg';
    };
    //申请讲师
    $scope.apply = function (introduce) {
      var postData = {
        introduce: introduce,
        status: $scope.applyStatus == 2 ? 1 : 0
      };
      if (introduce) {
        personalHomepageMeService.apply(postData).then(function (res) {
          if (res.data.success == true) {
            $scope.notApply = false;
            PopupService.showToast("申请已提交，等待审核……");
            $scope.data.isApply = false;
            $scope.userData.UserAuth = 2;
          } else {
            $scope.data.isApply = false;
          }
        }, function (error) {

        });
      } else {
        if ($scope.applyStatus == 3) {
          var postData = {
            introduce: introduce,
            status: 2
          };
          personalHomepageMeService.apply(postData).then(function (res) {
            if (res.data.success == true) {
              $scope.hideApplyModal();
              $scope.introduce = '';
              $scope.notApply = false;
              PopupService.showToast("申请已放弃");
              $scope.data.isApply = false;
              $scope.userData.UserAuth = 2;
            } else {
              $scope.data.isApply = false;
            }
          }, function (error) {

          });
        } else {
          PopupService.showToast("申请描述不能为空，请填写……");
        }
      }
    };
    /**
     * 消息弹窗
     */
    $scope.show = function () {
      $scope.isDisplay = !$scope.isDisplay;
    };
    /**
     * 点击空白消息弹窗消失
     */
    $scope.disappear = function () {
      $scope.isDisplay = false;
    };
    /**
     * 帖子操作（收藏、点赞）方法
     */
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
              if ($scope.selectedIndex == 0) {
                for (var i = 0; i < $scope.myCollectionStory.storyList.length; i++) {
                  if (id == $scope.myCollectionStory.storyList[i].id) {
                    $scope.myCollectionStory.storyList.splice(i, 1);
                    $scope.myCollectionStory.nums--;
                  }
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
              if ($scope.selectedIndex == 0) {
                for (i = 0; i < $scope.myCollectionStory.storyList.length; i++) {
                  if (id == $scope.myCollectionStory.storyList[i].id) {
                    $scope.myCollectionStory.storyList.splice(i, 1);
                    $scope.myCollectionStory.nums--;
                  }
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
    /**
     * 页面跳转方法
     */
     //跳转发布详情
     $scope.ToMyIssue = function(what,who,id) {
         var pageIndex =1;
         var pageSize = 5;
         var issueType = 0;
         var commentType = 0;
         if (what == 'issue') {
             heIssueService.getMyIssue(pageIndex,pageSize,id,issueType).success(function(response){
                 if (response.errorCode == -2000) {
                     PopupService.showToast(response.message);
                     $rootScope.loginIsAccord2 = true;
                 } else if (response.success == true) {
                     $state.go('heIssue',{title:what,who:who,id:id});
                 }
             })
         }
         if (what == 'comment') {
             heIssueService.getMyComment(pageIndex,pageSize,id,commentType).success(function(response){
                 if (response.errorCode == -2000) {
                     PopupService.showToast(response.message);
                     $rootScope.loginIsAccord2 = true;
                 } else if (response.success == true) {
                     $state.go('heIssue',{title:what,who:who,id:id});
                 }
             })
         }
         if (what == 'quanzi') {
             heIssueService.getMyJoinedTopics(id).success(function(response){
                 if (response.errorCode == -2000) {
                     PopupService.showToast(response.message);
                     $rootScope.loginIsAccord2 = true;
                 } else if (response.success == true) {
                     $state.go('heIssue',{title:what,who:who,id:id});
                 }
             })
         }
         if (what == 'dashang') {
             heIssueService.getDaShang(pageIndex, pageSize ,id).success(function(response){
                 if (response.errorCode == -2000) {
                     PopupService.showToast(response.message);
                     $rootScope.loginIsAccord2 = true;
                 } else if (response.success == true) {
                     $state.go('heIssue',{title:what,who:who,id:id});
                 }
             })
         }
         if (what == 'zan') {
             heIssueService.getUserPraise(pageIndex, pageSize ,id).success(function(response){
                 if (response.errorCode == -2000) {
                     PopupService.showToast(response.message);
                     $rootScope.loginIsAccord2 = true;
                 } else if (response.success == true) {
                     $state.go('heIssue',{title:what,who:who,id:id});
                 }
             })
         }
         if (what == 'shoucang') {
             heIssueService.getCollection(pageIndex, pageSize ,id).success(function(response){
                 if (response.errorCode == -2000) {
                     PopupService.showToast(response.message);
                     $rootScope.loginIsAccord2 = true;
                 } else if (response.success == true) {
                     $state.go('heIssue',{title:what,who:who,id:id});
                 }
             })
         }
     }

    $scope.settings = function () {
      $state.go('mySettings');
    };
    $scope.fans = function () {
      var pageIndex = 1;
      var pageSize = 6;
      // $state.go('myFans');
      myFansService.getMyFans(pageIndex, pageSize).success(function(response){
        if (response.success == true) {
          $state.go('myFans');
        } else if (response.errorCode == -2000) {
          PopupService.showToast(response.message);
          $rootScope.loginIsAccord2 = true;
        }
      })
    };
    $scope.follows = function () {
      var pageIndex = 1;
      var pageSize = 6;
      myFollowService.getMyFollows(pageIndex, pageSize).success(function(response) {
              if (response.success == true) {
                $state.go('myFollow');
              } else if (response.errorCode == -2000) {
                PopupService.showToast(response.message);
                $rootScope.loginIsAccord2 = true;
              }
            })
      // $state.go('myFollow');
    };
    $scope.jumpMsg = function () {
      $state.go('messageCenter');
    };
    $scope.viewTopic = function (id) {
      $state.go('circlePage', {circleId: id});
    };
    $scope.viewMyTopic = function () {
      $rootScope.xinxianshow = false;
      $rootScope.myquanshow = true;
      $rootScope.buttonshowl = false;
      $rootScope.buttonshowr = true;
      $state.go('topic.qmine');
    };
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
    $scope.viewShop = function () {
      $state.go('myStore', {
        storeId: $scope.userData.memberId,
        shareStoreId: ''
      });
    };
    $scope.viewHim = function (story) {
      if (story.flag == 1) {
        $state.go('personalHomepageHe', {othersId: story.userCode});
      }
    };
    /*********************分享标签－whiteBird start*********************/
    //打开分享
    $scope.share = function () {
      if (!UserService.getUser().mid) {
        $state.go('login');
        return;
      }
      //$scope.showShare = !$scope.showShare;
      /*********************分享标签－whiteBird start*********************/
      if (window.umeng) {
        //新分享样式
        $scope.showShare = !$scope.showShare;
        /*********************分享标签－whiteBird end*********************/
      } else {
        alert('只能在app分享,请下载app！');
      }
    };
    //复制方法
    $scope.copeText = function (text) {
      if (window.cordova) {
        cordova.plugins.clipboard.copy(text);
        PopupService.showToastShort('复制成功');
      }
      else {
        PopupService.showToast('请下载APP执行此操作');
      }
    };
    //关闭分享
    $scope.hideblackCover = function () {
      $scope.showShare = false;
    };
    //选择分享平台，调用复制方法
    $scope.shareToPlatform = function (index) {
      var title = ($scope.userData.userName ? $scope.userData.userName : '他') + '的空间'; //分享标题
      var content = "欢迎关注" + ($scope.userData.userName ? $scope.userData.userName : "他") + "的个人主页，关注他（她）的动态，一起来顺逛微社区互动吧……";
      var pic = 'http://www.ehaier.com/mstatic/wd/v2/img/sg.png';
      //var pic = $scope.userData.img ? $scope.userData.img : "./img/quanzi/user.jpg";//分享图片，写绝对路径
      var url = UrlService.getShareLinkHeader() + 'personalHomePageHe/' + $scope.userData.memberId;//分享链接，绝对路径
      console.log(title, content, pic, url);
      if (window.umeng) {
        if (index == 0) {
          window.umeng.shareToSina(title, content, pic, url, 0, null,CreditService.shareSuccessCallback);
        } else if (index == 1) {
          window.umeng.shareToWechatSession(title, content, pic, url, 0, null,CreditService.shareSuccessCallback);
        } else if (index == 2) {
          window.umeng.shareToWechatTimeline(title, content, pic, url, 0, null,CreditService.shareSuccessCallback);
        } else if (index == 3) {
          window.umeng.shareToQQ(title, content, pic, url, 0,null,CreditService.shareSuccessCallback);
        } else if (index == 4) {
          window.umeng.shareToQzone(title, content, pic, url, 0,null, CreditService.shareSuccessCallback);
        } else if (index == 5) {
          $scope.copeText(url);
        }
      } else {
        alert('umeng undefined 只能在app分享');
      }

      $scope.showShare = false;
    };
    /*********************分享标签－whiteBird end*********************/
  }]);
/**
 * 个人主页服务
 * 获取数据
 */
APP.service('personalHomepageMeService', ['$http', 'UrlService', function ($http, UrlService) {
  //获取用户信息方法
  this.getUserData1 = function (type, userId) {
    var postData = {
      type: type,
      id: userId
    };
    return $http({
      method: 'post',
      url: UrlService.getUrl('USER_SIMPLE_INFO_ONE'),
      data: postData
    });
    //return $http.get("data/userInfo.json", {});
  };
  this.getUserData2 = function (type, userId) {
    var postData = {
      type: type,
      id: userId
    };
    return $http({
      method: 'post',
      url: UrlService.getUrl('USER_SIMPLE_INFO_TWO'),
      data: postData
    });
    //return $http.get("data/userInfo.json", {});
  };
  this.getUserData3 = function (type, userId) {
    var postData = {
      type: type,
      id: userId
    };
    return $http({
      method: 'post',
      url: UrlService.getUrl('USER_SIMPLE_INFO_THREE'),
      data: postData
    });
    //return $http.get("data/userInfo.json", {});
  };
  //我的圈子接口
  this.getMyTopics = function (pageNumber, pageSize, userId) {
    return $http({
      method: 'post',
      url: UrlService.getUrl('GETMYTOPICLIST'),
      data: {
        pageIndex: pageNumber,
        pageSize: pageSize,
        userId: userId
      }
    });
  };
  //我的原创接口
  this.getMyStory = function (pageNumber, pageSize, userId) {
    return $http({
      method: 'post',
      url: UrlService.getUrl('GET_MY_STORY_LIST'),
      data: {
        pageIndex: pageNumber,
        pageSize: pageSize,
        userId: userId
      }
    });
  };
  //我的收藏接口（话题收藏）
  this.getMyCollection = function (pageNumber, pageSize, userId) {
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
  //开始申请讲师接口
  this.startApply = function () {
    return $http({
        method: 'post',
        url: UrlService.getUrl('START_APPLY_LECTURER'),
        data: {}
      }
    );
  };
  //申请讲师接口
  this.apply = function (params) {
    return $http({
        method: 'post',
        url: UrlService.getUrl('APPLY_LECTURER'),
        data: params
      }
    );
  };
  //讲授的课程
  this.teachedLessones = function (params) {
    return $http({
        method: 'post',
        url: UrlService.getUrl('TEACHED_COURSE'),
        data: params
      }
    );
  };
  //参加的课程
  this.joinedLessones = function (params) {
    return $http({
        method: 'post',
        url: UrlService.getUrl('JOINED_COURSE'),
        data: params
      }
    );
  };

}]);
