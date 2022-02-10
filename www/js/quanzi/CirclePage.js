/**
 * Created by Andy on 2016/10/14.
 */
APP.controller('CirclePageController', ['HomePageService','$http','$localstorage','$location', '$scope', '$rootScope', '$state', '$stateParams', 'CirclePageService', '$ionicScrollDelegate', 'NoteDetailsService', 'UrlService',
  'PopupService', '$ionicModal', 'ionicDatePicker2', 'ionicTimePicker', '$timeout', 'UserService', '$ionicPopup', 'CreditService',
  function (HomePageService,$http,$localstorage,$location, $scope, $rootScope, $state, $stateParams, CirclePageService, $ionicScrollDelegate, NoteDetailsService, UrlService, PopupService, $ionicModal, ionicDatePicker2, ionicTimePicker, $timeout, UserService, $ionicPopup, CreditService) {

    /** 变量定义 **/
    $scope.isDisplay = false;
    $scope.showList = false;
    $scope.moreTag = false;
    $scope.hasmore = true;
    $scope.showTopBtn = false;//回到顶部按钮
    $scope.circleIDIF=false;
    $scope.contentNum = {
      contentNum: ''
    };
    $scope.topicId;//接收到的Id
    $scope.topData;
    $scope.listData = [];//存储圈子列表
    $scope.circleId;
    $scope.tagsName;//标签名字
    $scope.showShare = false;//分享界面显示隐藏
    $scope.topicid = '';//分享界面显示隐藏
    $scope.allowPub = true;

  $scope.topicSummary;
  /*签到日历按钮*/
  $scope.signSuccess = false;
  function loginOK(){  
    var a=$location.absUrl();
    secritIdIndex = a.indexOf('secritId');
    tokenIndex = a.indexOf('&token');
    _urlToken = decodeURI(a.substring(secritIdIndex+9,tokenIndex));
    // var urls=a.subString(a.indexOf('?'))
    // var tokens = GetQueryString('secritId');
    // alert(tokens)
    // var _urlToken = decodeURI(tokens);// 截取secritId,用于获取用户信息
    // alert(_urlToken)  
    if (_urlToken != "") {//如果传递的token 不等于空
      $http({
        method: 'POST',
        url: UrlService.getUrl('OTHER_LOGIN'),
        params: {token: _urlToken},
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).success(function (response) {        
        UserService.setUser(response.data); //存储用户登录后的信息到本地缓存      
        $localstorage.set('sg_login_token_secret', 'Bearer' + response.data.sessionValue);//替换token存到本地        
      });
    }
  }
    /** 方法 **/
    $scope.init = function () {
      if($scope.circleId == 662 || $scope.circleId == 665){
        $scope.circleIDIF=true;
        if($scope.circleId == 662){
          CirclePageService.getCircleLink('','','1')
            .success(function(res){
              if(res.success){
                $scope.circleUrl=res.data;
              }

            })
        }else if($scope.circleId == 665){
          CirclePageService.getCircleLink('','','3')
            .success(function(res){
              if(res.success){
                $scope.circleUrl=res.data;
              }

            })
        }
      }
      $rootScope.mediaurl='';
      $rootScope.mediaImg='';
      $scope.userId = UserService.getUser().mid;//获取进小店的id
      $scope.phoneHeight = document.documentElement.clientHeight / 2;//获取手机屏幕高度

      /*********************分享标签－whiteBird start*********************/
      $scope.showQQ = false;
      $scope.isDisplay = false;
      $scope.showList = false;
      $scope.showWeChat = false;
      $scope.showShare = false;//分享菜单显示
      $scope.timeWidget = {//开始时间
        hour: '',
        minute: ''
      };
      $scope.timeWidget2 = {//结束时间
        hour: '',
        minute: ''
      };
      if (window.cordova) {
        $scope.ifInApp = false;
      } else {
        $scope.ifInApp = true;
      }

      if (window.cordova) {
        window.umeng.checkAppInstalled('qq', function (data) {

          if (data == false) {
            $scope.showQQ = false;
          } else {
            $scope.showQQ = true;
          }
        });
        window.umeng.checkAppInstalled('wechat', function (data) {
          if (data == false) {
            $scope.showWeChat = false;
          } else {
            $scope.showWeChat = true;
          }
        });
      }
      $scope.$broadcast('scroll.refreshComplete');
      /*********************分享标签－whiteBird end*********************/

      $scope.moreTag = false;
      $scope.ifDownload = true;
      $scope.pageIndex = 1;
      $scope.hasmore = true;
      $scope.listData = [];//存储圈子列表
      $scope.getTags();
      $scope.getListMsg();
      $scope.getTopicSummary();
      $scope.getCircleMembers();
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();//返回到此页回滚到顶部
      $scope.stateIfOpen = {};//讨论组是否开启状态
      $scope.applyDiscussionData = {//申请讨论组时间选择
        topicId: '',
        entryReason: '',
        startDate: '',
        startHour: '',
        startMin: '',
        endDate: '',
        endHour: '',
        endMin: ''
      };

      $scope.personType = {//判断是否为圈主
        isAdmin: false
      };

      //判断是否显示下载弹框
      if (window.cordova) {
        $scope.openFromBrowser = true;
      } else {
        $scope.openFromBrowser = false;
      }

    };

    $scope.NumberCheck = function (t) {
      console.log(t);
      var re = /^\d*$/;
      if (!re.test(t)) {
        isNaN(parseInt(t)) ? $scope.contentNum.contentNum = 0 : $scope.contentNum.contentNum = parseInt(t);
      }
    };
    //返回
    $scope.goBack = function () {
      if($scope.circleIDIF){
        window.open($scope.circleUrl+'&openType=h5')
      }else{
        $scope.$ionicGoBack();
      }
      // $ionicHistory.clearCache();
      // $ionicHistory.clearHistory();
    };
    //item弹框
    $scope.isClick = function () {
      $scope.isDisplay = !$scope.isDisplay;
    };
    //分享
    $scope.goshare = function () {
      if (!UserService.getUser().mid) {
        $state.go('login');
        return;
      }
      $scope.showShare = !$scope.showShare;
    };
    $scope.isClick = function () {
      $scope.isDisplay = !$scope.isDisplay;
      console.log('123');
    };
    // 是否显示发表列
    $scope.showCameraList = function () {
      if (window.cordova) {
        $rootScope.gio.track('createTopic', { circleID: $scope.circleId });
        $rootScope.gio.track('active', { circleID: $scope.circleId });
      }
      if (!$scope.topicSummary.isJoin) {
        // 一个精心制作的自定义弹窗
        var myPopup = $ionicPopup.show({
          template: '<p>亲，先加入我们再秀话题吧。</p>',
          title: '退出圈子',
          subTitle: 'Please use normal things',
          scope: $scope,
          buttons: [

            {
              text: '<span>加入</span>',
              type: '',
              onTap: function () {
                $scope.joinCircle();
              }
            },
            { text: '再想想' }
          ]
        });
        $timeout(function () {
          // myPopup.close();
        }, 3000);
      } else {
        var ids = {
          topicId: $scope.circleId
        };
        CirclePageService.circleSpeak(ids)
          .success(function (response) {
            console.log(response);
            if(response.success){
              if (response.data.isGap == 0) {
                $scope.showList = !$scope.showList;
              }
            }else{
              if (response.errorCode == -2000) {
                console.log('aa')
                PopupService.showToast(response.message);
                $rootScope.loginIsAccord2 = true;
              } else {
                PopupService.showToast('您已被禁言，不能发话题');
              }
            }
          })

      }
    };
    $scope.jumpPublishCircle = function () {
      $state.go('publishCircle');
    };
    //进入小店
    $scope.goShop = function () {
      $state.go('myStore', { storeId: $scope.userId, shareStoreId: '' });
    };
    //关闭下载弹框
    $scope.closeDownload = function () {
      $scope.ifDownload = false;
    };

    $scope.jumpMsg = function () {
      $state.go('ClassifyMessageCenter');
    };
    //进入个人主页
    $scope.inPersonalPage = function (code) {
      $state.go('personalHomepageHe', { othersId: code });
    };
    //跳转到贴子详情页
    $scope.toNoteDetails = function (id, isShort, index) {
      $scope.noteIndex = index;
      console.log('$scope.noteIndex', $scope.noteIndex);
      $state.go('noteDetails', { noteId: id, isShortStory: isShort });
    };
    $scope.hideList = function () {
      $scope.showList = false;
    };
    //回到顶部
    $scope.scrollToTop = function () {
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
      $scope.showTopBtn = false;
    };
    //获取滑动高度
    $scope.getScrollHeight = function () {
      console.log('进方法了么');
      $scope.scrollHeight = Math.abs(document.getElementById($scope.topicSummary.topicName).getBoundingClientRect().top);//获取滚动高度
      console.log(document.getElementById("abc"));
      if ($scope.scrollHeight > $scope.phoneHeight * 3) {
        $scope.showTopBtn = true;
      } else {
        $scope.showTopBtn = false;
      }
      console.log('$scope.scrollHeight', $scope.scrollHeight);
      console.log('$scope.phoneHeight', $scope.phoneHeight);
      console.log('$scope.showTopBtn', $scope.showTopBtn);
    };
    //跳到发表页拍照、相册
    $scope.jumpPhoto = function (item) {
      $scope.showList = false;
      if (item != 3) {
        $state.go('publishCircle', { identifierCode: '', topicId: $scope.circleId, topicStyle: item });
      } else {
        if (window.medias) {
          window.medias.StartMedias('5s', '30s', '5', '50', function (success) {
            $state.go('publishCircle', { identifierCode: '', topicId: $scope.circleId, topicStyle: item });
            console.log(success);
            var jsonVideo=JSON.parse(success);
            var videoString=jsonVideo.videoFile;
            var videoimg=jsonVideo.imageFile;
            console.log(typeof videoString);
            var vv=videoString.replace('\\','');
            var vi=videoimg.replace('\\','');
            // $scope.mediaurl=success.videoFile.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
            $rootScope.mediaurla=vv;
            $rootScope.mediaImga=vi;
          }, function (error) {
            console.log(error)
          })
        }
      }
      
      console.log('item', item);
    };
    // 获取标签
    $scope.getTags = function () {
      var id = {
        id: $scope.circleId,
        flag:0
      };
      CirclePageService.getTags(id)
        .success(function (response) {
          $scope.tagsName = response.data.list;
        })

    };
    //start by@zyr
    $scope.tagsNameList = function(index,id) {
      $scope.tagsIndex = index;
      $scope.tagId = id;
      $scope.listData = [];
      $scope.pageIndex = 1;
      $scope.hasmore = true;
      $scope.getListMsg();
    }
    //end by@zyr
    //加入圈子
    $scope.joinCircle = function () {
      HomePageService.isWdHost()
        .success(function (res) {
          $rootScope.isWdHost = res.data.isHost;
          if ($rootScope.isWdHost == -1) {//如果没有登录 跳转到登录页面
            $state.go('login');
          } else {
            if (window.cordova) {
              $rootScope.gio.track('follow', { circleID: $stateParams.circleId });
              $rootScope.gio.track('active', { circleID: $stateParams.circleId });
            }
            var ids = {
              ids: $scope.circleId
            };
            CirclePageService.joinTopic(ids)
              .success(function (response) {
                if (response.success == true) {
                  // PopupService.showToast(response.message);
                  $scope.inCircle = true;
                  $timeout(function () {
                    $scope.inCircle = false;
                  }, 1000);
                  console.log('加入成功');
                  $scope.topicSummary.isJoin = true;
                  $scope.getCircleMembers();
                  $scope.getTopicSummary();
                } else {
                  PopupService.showToast(response.message);
                }
              });

          }
        });
      if (window.cordova) {
        $rootScope.gio.track('follow', { circleID: $stateParams.circleId });
        $rootScope.gio.track('active', { circleID: $stateParams.circleId });
      }
      var ids = {
        ids: $scope.circleId
      };
      CirclePageService.joinTopic(ids)
        .success(function (response) {
          if (response.success == true) {
            // PopupService.showToast(response.message);
            $scope.inCircle = true;
            $timeout(function () {
              $scope.inCircle = false;
            }, 1000);
            console.log('加入成功');
            $scope.topicSummary.isJoin = true;
            $scope.getCircleMembers();
            $scope.getTopicSummary();
          } else if (response.errorCode == -2000) {
            PopupService.showToast(response.message);
            $rootScope.loginIsAccord2 = true;
          }
    });
  };
  /*start @zyr*/ //签到
  $scope.signIn = function () {
    //用户是否登陆
    HomePageService.isWdHost().success(function (res) {
      $rootScope.isWdHost = res.data.isHost;
      if ($rootScope.isWdHost == -1) {
        //如果没有登录 跳转到登录页面
        $state.go('login');
      } else {
        if (!$scope.topicSummary.isJoin) {
          PopupService.showToast('请先加入圈子');
        } else {
          var signs = {
            topicId: $scope.circleId,
            userId: $scope.userId,
            //圈子签到为 2,平台签到为1
            signType: 2
          };
          CirclePageService.circleSignIn(signs).success(function (res) {
            console.log(res);
            if (res.success) {
              $scope.signInfoData = res.data;
              var signPopup = $ionicPopup.show({
                template: '<div class=\'sign-box\' flex=\'main:center\'>\n                              <div ng-click="closeSign()" class=\'sign-close\' flex=\'main:right\'><img ng-src="{{imgBaseURL}}img/signIn/sign_close.png" alt="\u5173\u95ED" /></div>\n                              <div class=\'sign-bg\'><img ng-src="{{imgBaseURL}}img/signIn/sign_background.png" style=\'width:100%;\' alt="" /></div>\n                              <div class=\'sign-content\'>\n                                <div class=\'sign-title\' flex=\'main:center cross:center\'>\n                                  <div class=\'sign-icon\' flex=\'cross:center\'><img ng-src="{{imgBaseURL}}img/signIn/sign_icon.png" alt="" /></div>\n                                  <div class=\'title-text\'>\u7B7E\u5230\u6392\u540D<span>{{signInfoData.rank}}</span></div>\n                                </div>\n                                <p ng-if=\'signInfoData.golds>0\'>\u83B7\u5F97<span class=\'sign-num\'>{{signInfoData.golds}}</span>金币</p>\n                                <p ng-if=\'signInfoData.signRules\'>\u8FDE\u7EED\u7B7E\u5230<span class=\'sign-num\'>{{signInfoData.signRules.continuitySign}}</span>\u5929\u5373\u53EF\u83B7\u53D6<span class=\'sign-num\'>{{signInfoData.signRules.golds}}</span>金币</p>\n                              </div>\n                              <div class=\'sign-foot\' ng-click=\'goSignInChart(circleId)\'>\u7B7E\u5230\u6392\u884C\u699C</div>\n                            </div>',
                cssClass: 'signPopup',
                scope: $scope
              });

              $scope.closeSign = function () {
                signPopup.close();
                // $scope.signSuccess = true;
                $scope.getTopicSummary();
              };
              $scope.goSignInChart = function (topicId) {
                signPopup.close();
                $state.go('signInChart', { topicId: topicId });
              };
            } else {
              PopupService.showToast(res.message);
            }
          });
        }
      }
    });
  };
  /*签到日历*/
  $scope.signDate = function (userId, topicId, monthFlag) {

    $state.go('signDate', { userId: userId, topicId: topicId, monthFlag: monthFlag });
  };
  /*end @zyr*/ //签到
    //跳到全部成员页
    $scope.jumpAllMembers = function (id) {
      $state.go('allMembers', { topicId: id })
    };
    //收缩标签栏
    $scope.isMoreTag = function () {
      $scope.moreTag = !$scope.moreTag;
      if ($scope.moreTag == false) {
        $ionicScrollDelegate.scrollTop();
      }
      console.log($scope.moreTag);
      $ionicScrollDelegate.resize();
    };
    //获取圈子成员
    $scope.getCircleMembers = function () {
      var topicId = {
        topicId: $scope.circleId
      };
      CirclePageService.circleMembers(topicId)
        .success(function (response) {
          if (response.success) {
            $scope.members = response.data.list;
            $scope.membersHead = response.data.list1[0];
          }
        })
    };
    //获取圈子简介信息
    $scope.getTopicSummary = function () {
      var imm = {
        topicId: $scope.circleId
      };
      CirclePageService.getCircleInfo(imm)
        .success(function (response) {
          $scope.topicSummary = response.data.list[0];
      CirclePageService.topicName = $scope.topicSummary.topicName;
          if ($scope.topicSummary.allowPubStory == 0) {
            $scope.allowPub = false;
          } else if ($scope.topicSummary.allowPubStory == 1) {
            $scope.allowPub = true;
          }
          $scope.topicid = response.data.list.id;

      $scope.minNum = $scope.topicSummary.capacity; //申请扩容前最小值
      var signSuccDate = $scope.topicSummary.dateNow.split('-');
      var signYear = Number(signSuccDate[0]);
      var signMonth = Number(signSuccDate[1]);
      var signDay = Number(signSuccDate[2]);
      $scope.signSucDate = {
        signYear: signYear,
        signMonth: signMonth,
        signDay: signDay
      };
      CirclePageService.signSuccessDate = $scope.signSucDate;
      console.log(CirclePageService.signSuccessDate);
    });
  };
  //申请扩容
  $scope.extendContent = function () {

      if ($scope.contentNum.contentNum <= $scope.minNum) {
        $scope.biggerThanFive = true;
        $timeout(function () {
          $scope.biggerThanFive = false;
        }, 3000);
      } else if ($scope.contentNum.contentNum > 2000) {
        $scope.biggerThanTwoThousand = true;
        $timeout(function () {
          $scope.biggerThanTwoThousand = false;
        }, 3000);
      } else {
        var param = {
          topicId: $scope.circleId,
          entryCapacity: $scope.contentNum.contentNum
        };
        CirclePageService.extendContent(param)
          .success(function (response) {
            if (response.success) {
              $scope.hideBigerModal();
              $scope.contentNum.contentNum = '';
              $rootScope.applyBottomNotice = true;
              $scope.isDisplay = false;
              $timeout(function () {
                $rootScope.applyBottomNotice = false;
              }, 3000);
            } else {
              PopupService.showToast(response.message);
            }
          })
      }
    };
    //判断下载平台
    $scope.noticeDownload = function () {
      console.log('111', $rootScope.downAppUrl);
      if (!$rootScope.downAppUrl) {
        PopupService.showToast('不支持该手机');
      }
    };
    /**
     *申请讨论组
     */
    $scope.applyDiscussion = function () {
      var params = $scope.applyDiscussionData;
      params.topicId = $scope.circleId;
      CirclePageService.applyDiscuss(params)
        .success(function (response) {
          console.log(response);
          if (response.success == true) {
            PopupService.showToast(response.message);
            $scope.hideModal();
            $scope.applyDiscussionData.endHour = '';
            $scope.applyDiscussionData.endMin = '';
            $scope.applyDiscussionData.startHour = '';
            $scope.applyDiscussionData.startMin = '';
          } else {
            PopupService.showToast(response.message);
          }
        }).error(function () {

        });
    };
    /**
     *讨论组状态
     */
    $scope.stateDiscussion = function () {
      var param = {
        topicId: $scope.circleId
      };
      CirclePageService.discussionState(param)
        .success(function (response) {
          if (response.success == true) {
            $scope.stateIfOpen = response.data;
            $scope.stateIfOpen.isAdmin = true; //todo 为了出现 申请开启讨论组 的按钮
          } else {
            PopupService.showToast('获取讨论组 服务器异常');
          }
        }).error(function () {
          PopupService.showToast('获取讨论组 相关信息失败');
        });
    };
    $scope.toChat = function () {
      var circleId = $scope.circleId;
      var groupId = $scope.stateIfOpen.groupId;
      if (!circleId || !groupId) {
        PopupService.showToast('缺少讨论组参数，错误');
        return;
      }
      $state.go('circleGroupDiscuss', { circleId: circleId, groupId: groupId });
    };
    //加载更多消息列表
    $scope.loadMoreMsg = function () {
      console.log('执行加载');
      $scope.pageIndex += 1;
      //获取 uuid
      var uuid = getCookie('loginId');
      console.log(uuid);
      var userMoreMsgAgent = window.navigator.userAgent.toLowerCase();
      //微信浏览器
      var isMoreMsgWeChat = userMoreMsgAgent.match(/MicroMessenger/i) == 'micromessenger';
      var loadParam = {
        pageIndex: $scope.pageIndex,
        pageSize: 5,
        topicId: $scope.circleId,
        tagId: $scope.tagId,
        noLoading:true,
        userCode: isMoreMsgWeChat ? $scope.weChatOpenId : uuid
      };

      CirclePageService.getCircleList(loadParam)
        .success(function (response) {
          if (response.data.list && response.data.list.length != 0) {
            $scope.listData = $scope.listData.concat(response.data.list);
            console.log($scope.listData);
            $scope.$broadcast('scroll.infiniteScrollComplete');
            var len = $scope.listData.length;
            $scope.hasmore = !(len === response.data.storeItemsCounts);
          } else {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hasmore = false;
            PopupService.showToast('没有更多消息了');
          }
        })
        .error(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
    };

    //把消息置顶的方法
    $scope.loadTopicStory = function () {
      CirclePageService.getTopStory(topData)
        .success(function (response) {

        })
    };
    //显示选择时间modal
    $scope.showModal = function () {
      //时间及申请理由填写modal页面
      $ionicModal.fromTemplateUrl('templates/quanzi/selectModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.selectModal = modal;
        $scope.selectModal.show();
      });
    };
    //关闭选择时间modal
    $scope.hideModal = function () {
      $scope.selectModal.hide();
    };
    //显示扩容modal
    $scope.showBigerModal = function () {
      //扩容model页面
      $ionicModal.fromTemplateUrl('templates/quanzi/biggerModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.biggerModal = modal;
        $scope.biggerModal.show();
      });
      $scope.isDisplay = false;
      // $scope.biggerModal.show();
    };
    //关闭扩容modal
    $scope.hideBigerModal = function () {
      $scope.biggerModal.hide();
    };
    //获取 cookie
    function getCookie(name)
    {
      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg)) return unescape(arr[2]);
      else return null;
    }
    //初始化加载列表信息
    $scope.getListMsg = function () {
      //获取 uuid
      var uuid = getCookie('loginId');
      console.log(uuid);
      var userListMsgAgent = window.navigator.userAgent.toLowerCase();
      //微信浏览器
      var isListMsgWeChat = userListMsgAgent.match(/MicroMessenger/i) == 'micromessenger';
      $scope.listMsg = {
        pageIndex: 1,
        pageSize: 5,
        topicId: $scope.circleId,
        tagId: $scope.tagId,
        userCode: isListMsgWeChat ? $scope.weChatOpenId : uuid
      };
      CirclePageService.getCircleList($scope.listMsg)
        .success(function (response) {
          $scope.listData = response.data.list;
          console.log($scope.listData);
          $scope.whichPersonType();//获取用户身份
          $scope.stateDiscussion();
        })
        .error(function () {

        })
    };
    /**
     *判断身份
     */
    $scope.whichPersonType = function () {
      console.log('判断身份');
      var params = {
        topicId: $scope.circleId,
        noLoading: true
      };
      NoteDetailsService.getPersonType(params)
        .success(function (response) {
          console.log(response);
          if (response.success == true) {
            $scope.personType = {
              isAdmin: response.data.isAdmin
            }
          }
        })
    };
    //贴子点赞
    $scope.topicPraise = function (id, index) {
      if (window.cordova) {
        $rootScope.gio.track('like', { circleID: $stateParams.circleId });
        $rootScope.gio.track('active', { circleID: $stateParams.circleId });
      }
      //获取 uuid
      var uuid = getCookie('loginId');
      console.log(uuid);
      var userLookAgent = window.navigator.userAgent.toLowerCase();
      //微信浏览器
      var isWeChat = userLookAgent.match(/MicroMessenger/i) == 'micromessenger';
      var param = {
        id: id,
        noLoading: true,
        userCode: isWeChat ? $scope.weChatOpenId : uuid
      };
      CirclePageService.pushPraise(param)
        .success(function (response) {
          if (response.success == true) {
            if ($scope.listData[index].praiseFlag == 1) {
              $scope.listData[index].praiseNumber = $scope.listData[index].praiseNumber - 1;
              $scope.listData[index].praiseFlag = !$scope.listData[index].praiseFlag;
              console.log('取消点赞成功');
            } else {
              $scope.listData[index].praiseNumber = $scope.listData[index].praiseNumber + 1;
              $scope.listData[index].praiseFlag = !$scope.listData[index].praiseFlag;
              console.log('点赞成功');
            }
          } else {
            $timeout(function () {
              PopupService.showToast(response.message);
            }, 200);
          }
        });
    };
    //贴子收藏
    $scope.topicFavorite = function (id, index) {
      HomePageService.isWdHost()
        .success(function (res) {
          $rootScope.isWdHost = res.data.isHost;
          if ($rootScope.isWdHost == -1) {//如果没有登录 跳转到登录页面
            $state.go('login');
          } else {
            var param = {
              id: id
            };
            CirclePageService.topicFavorite(param)
              .success(function (response) {
                if (response.success == true) {
                  if ($scope.listData[index].collectionFlag == 1) {
                    console.log('取消收藏前', $scope.listData[index].collectionFlag);
                    $scope.listData[index].collectionNumber = $scope.listData[index].collectionNumber - 1;
                    $scope.listData[index].collectionFlag = !$scope.listData[index].collectionFlag;
                    console.log('取消收藏成功', $scope.listData[index].collectionFlag);
                  } else {
                    console.log('收藏成功前', $scope.listData[index].collectionFlag);
                    $scope.listData[index].collectionNumber = $scope.listData[index].collectionNumber + 1;
                    $scope.listData[index].collectionFlag = !$scope.listData[index].collectionFlag;
                    console.log('收藏成功', $scope.listData[index].collectionFlag);
                  }
                } else {
                  $timeout(function () {
                    PopupService.showToast(response.message);
                  }, 200);
                }
              });

          }
        })

      var param = {
        id: id
      };
      CirclePageService.topicFavorite(param)
        .success(function (response) {
          if (response.success == true) {
            if ($scope.listData[index].collectionFlag == 1) {
              console.log('取消收藏前', $scope.listData[index].collectionFlag);
              $scope.listData[index].collectionNumber = $scope.listData[index].collectionNumber - 1;
              $scope.listData[index].collectionFlag = !$scope.listData[index].collectionFlag;
              console.log('取消收藏成功', $scope.listData[index].collectionFlag);
            } else {
              console.log('收藏成功前', $scope.listData[index].collectionFlag);
              $scope.listData[index].collectionNumber = $scope.listData[index].collectionNumber + 1;
              $scope.listData[index].collectionFlag = !$scope.listData[index].collectionFlag;
              console.log('收藏成功', $scope.listData[index].collectionFlag);
            }
          } else if (response.errorCode == -2000) {
            // $timeout(function () {
            PopupService.showToast(response.message);
            $rootScope.loginIsAccord2 = true;
            // }, 200);
          }
        });

    };
    //分享圈子保存
    $scope.shareToStore = function () {
      var param = {
        flag: 0,
        topicId: $scope.circleId
      };
      NoteDetailsService.shareStore(param)
        .success(function (response) {
          if (response.success) {
            console.log('分享成功');
          }
        });
    };
    //复制
    $scope.copeText = function (text) {
      if (window.cordova) {
        cordova.plugins.clipboard.copy(text);
        $timeout(function () {
          PopupService.showToastShort('复制成功');
        }, 200);
      }
      else {
        PopupService.showToast('请下载APP执行此操作');
      }
    };
    //关闭分享
    $scope.hideblackCover = function () {
      $scope.showShare = false;
    };
    //分享方法
    $scope.shareToPlatform = function (index) {
      if($location.absUrl().indexOf('token')!=-1){
        window.location.hash=$location.path()
      }
      var title = '邀请您关注' + $scope.topicSummary.topicName + '圈子'; //分享标题
      var content = '欢迎关注' + $scope.topicSummary.topicName + '圈子，与' + $scope.topicSummary.topicName + '微店主同城交流互动。';  //分享内容
      var pic = 'http://www.ehaier.com/mstatic/wd/v2/img/sg.png';//分享图片，写绝对路径  是否后台获取
      var url = UrlService.getShareLinkHeader() + 'circlePage/' + $scope.circleId;//分享链接，绝对路径
      var param = { circleId: $scope.circleId };
      var callbackWarpper = function (platform) {
        CreditService.shareSuccessCallback(platform, param);
      };
      console.log('分享地址', url);
      if (window.umeng) {
        if (index == 0) {
          window.umeng.shareToSina(title, content, pic, url, 0,null, CreditService.shareSuccessCallback);
        } else if (index == 1) {
          window.umeng.shareToWechatSession(title, content, pic, url, 0, null,CreditService.shareSuccessCallback);
        } else if (index == 2) {
          window.umeng.shareToWechatTimeline(title, content, pic, url, 0, null,CreditService.shareSuccessCallback);
        } else if (index == 3) {
          window.umeng.shareToQQ(title, content, pic, url, 0, null,CreditService.shareSuccessCallback);
          CreditService.qqShare();
        } else if (index == 4) {
          window.umeng.shareToQzone(title, content, pic, url, 0, null,CreditService.shareSuccessCallback);
          CreditService.qqShare();
        
        } else if (index == 5) {
          $scope.copeText(url);
        }else {
          CreditService.successShare();
        }
      } else {
        alert('umeng undefined 只能在app分享');
      }
      $scope.showShare = false;
      //后台保存结果
      $scope.shareToStore();
    };

    //datePicker日期选择限制
    $scope.dateOne = '开始时间';
    $scope.dateTwo = '结束时间';
    $scope.a = 1;
    $scope.b = 1;
    $scope.firstDatePicker = function () {
      var dateWidgetInit = {
        callback: function (val) {
          $scope.dateOne = val;
          // $scope.dateOne = val.toLocaleString();
          console.log('您选择了日期控件的时间戳为' + val);
          $scope.applyDiscussionData.startDate = val;
          $scope.a = 2;
        },
        to: new Date($scope.dateTwo)
      };
      ionicDatePicker2.openDatePicker(dateWidgetInit);
    };

    $scope.secondDatePicker = function () {
      var dateWidgetInit = {
        callback: function (val) {
          $scope.dateTwo = val;
          console.log('您选择了日期控件的时间戳为' + val);
          $scope.applyDiscussionData.endDate = val;
          $scope.b = 2;
        },
        from: new Date($scope.dateOne)
      };
      ionicDatePicker2.openDatePicker(dateWidgetInit);
    };
    /**
     * 点击调用时间控件
     */
    $scope.oneTimePicker = function () {
      var timeWidgetInit = {
        callback: function (val) {
          var selectedOneTime = new Date(val * 1000);
          $scope.applyDiscussionData.startHour = ('00' + selectedOneTime.getUTCHours()).substr(selectedOneTime.getUTCHours().toString().length);
          $scope.applyDiscussionData.startMin = ('00' + selectedOneTime.getUTCMinutes()).substr(selectedOneTime.getUTCMinutes().toString().length);
          console.log('您选择了时间控件时间戳为' + val);
        }
      };
      ionicTimePicker.openTimePicker(timeWidgetInit);
    };
    $scope.twoTimePicker = function () {
      var timeWidgetInit = {
        callback: function (val) {
          var selectedTwoTime = new Date(val * 1000);
          $scope.applyDiscussionData.endHour = ('00' + selectedTwoTime.getUTCHours()).substr(selectedTwoTime.getUTCHours().toString().length);
          $scope.applyDiscussionData.endMin = ('00' + selectedTwoTime.getUTCMinutes()).substr(selectedTwoTime.getUTCMinutes().toString().length);
          console.log('您选择了时间控件时间戳为' + val);
        }
      };
      ionicTimePicker.openTimePicker(timeWidgetInit);
    };

    //退出圈子提示
    $scope.exitTopicNotice = function () {
      // 一个精心制作的自定义弹窗
      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<p>亲，忍心离开我们圈子了吗？</p>',
        title: '退出圈子',
        subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [

          {
            text: '<span>退出</span>',
            type: '',
            onTap: function () {
              $scope.exitTopic();
            }
          },
          { text: '再想想' }
        ]
      });
      // myPopup.then(function(res) {
      //     console.log('Tapped!', res);
      // });
      $timeout(function () {
        // myPopup.close();
      }, 3000);
    };
    //退出圈子
    $scope.exitTopic = function () {
      var topicId = {
        topicId: $scope.circleId
      };
      CirclePageService.exitTopic(topicId)
        .success(function (response) {
          if (response.success) {
            // PopupService.showToast('成功退出圈子');
            $scope.isDisplay = false;
            $scope.isDisplay = false;
            $scope.outawayCircle = true;
            $scope.showList = false;
            $timeout(function () {
              $scope.outawayCircle = false;
            }, 1000);

            $scope.topicSummary.isJoin = false;
            $scope.getCircleMembers();
            $scope.getTopicSummary();
          } else {
            $scope.isDisplay = false;
            PopupService.showToast(response.message);
          }
        })
        .error(function () {
          PopupService.showToast(response.message);
        })
    };

    //默认请求 微信 openId @zyr
    $scope.wechatOpenId = function() {
      NoteDetailsService.getWeChatOpenId().success(function(res) {
        if (res.success) {

          if (!res.data) {
            $scope.wechatUrlOpenId();
          } else {
            $scope.weChatOpenId = res.data;
            NoteDetailsService.weChatOpenId = res.data;
            $scope.init();
          }
        }
      });
    }
    //请求 微信 url 获取openId
    $scope.wechatUrlOpenId = function() {
      var aid=$location.absUrl();
      console.log(aid);
      NoteDetailsService.getWeChatUrlOpenId(aid).success(function(res) {
        if (res.success) {
          // $http.get(res.data);
          // window.open(res.data);
          document.location.href = res.data;
        }
      });
    }

    $scope.$on('$ionicView.beforeEnter', function (event, v) {
      $scope.circleId = $stateParams.circleId;//接收上个页面的传参,圈子id
      $scope.tagId = null;
      //console.log($scope.circleId)
      loginOK()      
      //获取 token后 修改URL
      window.location.hash=$location.path()
       
      //默认选中的标签为 0;
      $scope.tagsIndex = 0;
      if ($rootScope.ifDeleteNoteList){
        console.log($scope.noteIndex);
        $scope.listData.splice($scope.noteIndex, 1);
        $rootScope.ifDeleteNoteList = false;//是否删除圈子页该话题
      }
      if (v.direction == 'back') {
        console.log('前页返回');
        console.log('v', v.direction);
      //默认获取圈子信息
      $scope.getTopicSummary();
      } else {
        if (window.cordova) {
          $rootScope.gio.track("circleEntry", { circleID: $scope.circleId });
        }
        console.log('v', v.direction);
        $('ion-header-bar').show();
        //$scope.init();
      }
      //初始化@zyr
      //获取微信openId By@zyr
      //判断是否为 微信浏览器
      var userAgent = window.navigator.userAgent.toLowerCase();
      //微信浏览器
      if (userAgent.match(/MicroMessenger/i) == 'micromessenger') {
        // todo
        HomePageService.isWdHost()
        .success(function (res) {
          $rootScope.isWdHost = res.data.isHost;
          if($rootScope.isWdHost==-1){//如果没有登录 跳转到登录页面
            $scope.wechatOpenId();
          }else{
            $scope.init();
          }
        })
        // $scope.wechatOpenId();
      } else {
        if (v.direction == 'back') {
        }else{
          $scope.init();
        }
      }
      //end @zyr
    });

    //路由切换成功时
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      console.log(fromState.name);
      console.log(toState.name);
      $rootScope.fromState = fromState.name;
      $rootScope.toState = toState.name;
      if ($rootScope.fromState == 'publishCircle') {
        $scope.init();
      }
    });
  }]);

APP.service('CirclePageService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getCircleLink=function(productId,o2oStoreId,type){
    var params={
      productId:productId,
      storeId:o2oStoreId,
      type:type
    }
    return $http.get(UrlService.getTopUrl('IF_CIRCLEPAGE'),params);
  }
  //获取圈子简介
  this.getCircleInfo = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('TOPIC_INFO'),
      data: param
    });
  };
  //储存圈子名称
  this.topicName = '';
  //分享保存
  this.shareinfor = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('SHARE'),
      data: param
    });
  };
  //获取全部成员
  this.circleMembers = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('GETLISTBYCODE'),
      data: param
    });
  };
  //获取标签
  this.getTags = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('SELECT_TAGS_BY_TOPICID'),
      data: param
    });
  };
  //把消息置顶
  this.getTopStory = function (param) {
    // param = storyId;
    // return $http.post(UrlService.getUrl('TOP_STORY'), param);
    return $http({
      method: 'POST',
      url: UrlService.getUrl('TOP_STORY'),
      data: param
    })
  };
  //判断用户是否被禁言
  this.circleSpeak = function (param) {
    // param = storyId;
    // return $http.post(UrlService.getUrl('TOP_STORY'), param);
    return $http({
      method: 'POST',
      url: UrlService.getUrl('CIRCLE_SPEAK'),
      data: param
    })
  };
  //获取身份接口
  this.getPersonType = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('NOTE_PERSON_TYPE'),
      data: param
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
  //申请扩容
  this.extendContent = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('ENLARGE_CONTENT'),
      data: param
    })
  };
  //讨论组申请
  this.applyDiscuss = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('ENTRYFORUM'),
      data: param
    })
  };
  //讨论组开启状态
  this.discussionState = function (param) {
    // var url = 'http://172.24.1.200:8085/v3/sgcommunity/Circle/getDiscussionState.ajax'; 解力 地址
    return $http({
      method: 'POST',
      url: UrlService.getUrl('DISCUSSION_STATE'),
      data: param
    })
  };
  //贴子点赞
  this.pushPraise = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('COMMENT_PRAISE'),
      data: param
    });
  };
  //贴子收藏
  this.topicFavorite = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('COLLECTION_TOPIC'),
      data: param
    });
  };
  //获取列表信息
  this.getCircleList = function (pass) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('LIST'),
      data: pass
    });
    // return $http.post(UrlService.getUrl('LIST'), params);
  };
  //圈子退出
  this.exitTopic = function (pass) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('EXIT_TOPIC'),
      data: pass
    });
  };
  //签到 @zyr
  this.circleSignIn = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('CIRCLE_SIGNIN'),
      data: param
    });
  };
  //签到成功返回的日期 @zyr
  this.signSuccessDate = '';
}]);
