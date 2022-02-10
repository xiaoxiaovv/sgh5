/**
 * 个人页面-Ta
 * Created by shantao.wang on Mon 2016/10/17.
 */
APP.controller('personalHomepageHeCtrl', ['HomePageService','heIssueService','$scope', '$http', '$rootScope', 'NoteDetailsService','$state', '$timeout', '$interval', '$stateParams', '$window', '$location', '$ionicScrollDelegate', 'UserService', 'PopupService', 'personalHomepageHeService', 'personalHomepageMeService', 'myFansService', 'communityRecommendService', 'UrlService','CreditService',
    function (HomePageService,heIssueService,$scope, $http, $rootScope,NoteDetailsService, $state, $timeout, $interval, $stateParams, $window, $location, $ionicScrollDelegate, UserService, PopupService, personalHomepageHeService, personalHomepageMeService, myFansService, communityRecommendService, UrlService, CreditService) {
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
        $scope.gotoPriLetter=function(){
            $state.go('privateLetter',{userCode:$scope.othersId})
        }

        /**
         * 变量声明
         */
        //console.log($scope);
        $scope.user = undefined;//"我"
        $scope.messageNum = undefined;
        $scope.ifRed = undefined;
        $scope.isDisplay = undefined;
        $scope.othersId = '';
        $scope.hisInfo = undefined;
        $scope.shop = undefined;//小店信息
        $scope.shopMessage = undefined;//获取小店时返回的message
        $scope.shopList = [];//小店列表信息
        $scope.shareType = undefined;//分享小店还是个人主页
        $scope.byShareLink = undefined;
        $scope.provinceId = '';
        $scope.cityId = '';
        $scope.regionId = '';
        $scope.streetId = '';
        //$scope.pic = undefined;
        //$interval(function(){alert($scope.pic);},2000);
        //$scope.isFollowed = undefined;
        /*********************分享标签－whiteBird start*********************/
        $scope.showShare = false;
        /*********************分享标签－whiteBird end*********************/
        $scope.hisStory = {
            nums: -1,
            pageIndex: 0,
            pageSize: 6,
            storyList: [],
            hasMore: true,
            api: function (pageIndex, pageSize, userId) {
                return personalHomepageMeService.getMyStory(pageIndex, pageSize, userId);
            }
        };
        /*$scope.hisGoods = {
            nums: -1,
            pageIndex: 0,
            pageSize: 6,
            goodsList: [],
            hasMore: true,
            api: function (provinceId,cityId,regionId,streetId,pageIndex, pageSize, memberId) {
                return personalHomepageHeService.getShopListInfo(provinceId,cityId,regionId,streetId,pageIndex, pageSize, memberId);
            }
        };*/
        $scope.hisShare = {
            nums: -1,
            pageIndex: 0,
            pageSize: 6,
            shareList: [],
            hasMore: true,
            api: function (pageIndex, pageSize, memberId) {
                return personalHomepageHeService.hisShare(pageIndex, pageSize, memberId);
            }
        };
        /* var headImg = document.getElementById('headImg');
         var shopImg = document.getElementById('shopImg');
         $scope.headPic="http://localhost:8100/img/quanzi/user.jpg";
         $scope.shopPic="http://localhost:8100/img/ic_haier_2.png";
         $interval(function () {
         $scope.headPic = headImg.src ? headImg.src: $scope.hisInfo.img;//分享图片，写绝对路径
         $scope.shopPic = shopImg.src ? shopImg.src: $scope.shop.avatarImageFileId;//分享图片，写绝对路径
         },3000);*/
        /**
         * 页面初始化方法
         */
         // start @zyr
         $scope.goBack = function () {
            $scope.$ionicGoBack();
          };
          // end @zyr
        $scope.init = function (tab) {
            personalHomepageHeService.getAddress()
                .success(function (response) {
                var obj = eval(response.data);
                console.log(obj[0]);
                $scope.provinceId = obj[0].provinceId;
                $scope.cityId = obj[0].cityId;
                $scope.regionId = obj[0].areaId;
                $scope.streetId = obj[0].streetId;
                // console.log($scope.streetId);
            });
            //$scope.isFollowed = false;
            $scope.user = UserService.getUser();
            $scope.othersId = $stateParams.othersId;
            /*$scope.othersId = 2;*/
            $scope.isDisplay = false;
            $scope.byShareLink = !$rootScope.isApp;
            //if(location.host=='mobiletest.ehaier.com') $scope.byShareLink=true;
            //alert($location.host());
            //if($location.host()=="mobiletest.ehaier.com") $scope.byShareLink=true;

            $scope.hisInfo = undefined;
            $scope.shop = undefined;
            $scope.shopMessage = undefined;
            /*$scope.hisGoods.nums = -1;
            $scope.hisGoods.hasMore = true;
            $scope.hisGoods.pageIndex = 0;
            $scope.hisGoods.goodsList = undefined;*/

            $scope.hisStory.nums = -1;
            $scope.hisStory.hasMore = true;
            $scope.hisStory.pageIndex = 0;
            $scope.hisStory.storyList = undefined;

            $scope.hisShare.nums = -1;
            $scope.hisShare.hasMore = true;
            $scope.hisShare.pageIndex = 0;
            $scope.hisShare.shareList = undefined;

            // zyr start
            $scope.tabNav = 'personalHomePageHe';
            $scope.hisLists = [
                {title:"dashang",icon:$rootScope.imgBaseURL+"img/homepage/dashang@2x.png",text:"TA的打赏",nums:"0",goIcon:$rootScope.imgBaseURL+"img/homepage/go2@2x.png"},
                {title:"zan",icon:$rootScope.imgBaseURL+"img/homepage/zan@2x.png",text:"TA的赞",nums:"0",goIcon:$rootScope.imgBaseURL+"img/homepage/go2@2x.png"},
                {title:"shoucang",icon:$rootScope.imgBaseURL+"img/homepage/Shape@2x.png",text:"TA的收藏",nums:"0",goIcon:$rootScope.imgBaseURL+"img/homepage/go2@2x.png"},
            ]
            //end
            console.log($scope.othersId);

            switch (tab) {
                case 0:
                    $scope.getShopList();
                    break;
                case 1:
                    $scope.getHisStory();
                    break;
                case 2:
                    $scope.getHisShare();
                    break;
            }
            //为了获取帖子数量……
            personalHomepageHeService.hisShare(1, 0, $stateParams.othersId).then(function (res) {
                if (res.data.success == true) {
                    $scope.hisShare.nums = res.data.totalCount;
                }
            });
            personalHomepageMeService.getMyStory(1, 0, $stateParams.othersId).then(function (res) {
                if (res.data.success == true) {
                    $scope.hisStory.nums = res.data.totalCount;
                }
            });


        };
        /**
         * 视图事件
         */
        $scope.$on('$ionicView.beforeEnter', function (e, v) {
            if (v.direction == 'forward' || v.direction == "exit" || v.direction == "none") {
                $scope.init(0);
            } else if (v.direction == 'back') {
                $scope.isDisplay = false;
                $scope.downRefresh($scope.selectedIndex);
            }
        });
        /**
         * 下拉刷新
         */
        $scope.downRefresh = function (tab) {
            switch (tab) {
                case 0:
                    $scope.hisInfo = undefined;
                    $scope.shop = undefined;
                    $scope.shopMessage = undefined;
                    // $scope.hisGoods.nums = -1;
                    // $scope.hisGoods.hasMore = true;
                    // $scope.hisGoods.pageIndex = 0;
                    // $scope.hisGoods.goodsList = undefined;
                    $scope.getShopList();
                    break;
                case 1:
                    $scope.hisStory.nums = -1;
                    $scope.hisStory.hasMore = true;
                    $scope.hisStory.pageIndex = 0;
                    $scope.hisStory.storyList = undefined;
                    personalHomepageMeService.getUserData1('2', $scope.othersId)
                        .success(function (response) {
                        console.log(response.data);
                        if (response.success == true) {
                            $scope.hisInfo = response.data;
                            } else {
                                console.log(response.message);
                            }
                        })
                        .error(function () {
                        alert("网络失败！");
                    });
                    personalHomepageMeService.getUserData2('2', $scope.othersId)
                        .success(function (response) {
                        console.log(response.data);
                        $scope.userData2 = response.data;
                        })
                        .error(function () {
                        alert("网络失败！");
                    });
                    personalHomepageMeService.getUserData3('2', $scope.othersId)
                        .success(function (response) {
                        console.log(response.data);
                        $scope.userData3 = response.data;
                        })
                        .error(function () {
                        alert("网络失败！");
                    });
                    $scope.getHisStory();
                    break;
                case 2:
                    $scope.hisShare.nums = -1;
                    $scope.hisShare.hasMore = true;
                    $scope.hisShare.pageIndex = 0;
                    $scope.hisShare.shareList = undefined;
                    personalHomepageMeService.getUserData1('2', $scope.othersId)
                        .success(function (response) {
                        console.log(response.data);
                        if (response.success == true) {
                            $scope.hisInfo = response.data;
                            } else {
                                console.log(response.message);
                            }
                        })
                        .error(function () {
                        alert("网络失败！");
                    });
                    personalHomepageMeService.getUserData2('2', $scope.othersId)
                        .success(function (response) {
                        console.log(response.data);
                        $scope.userData2 = response.data;
                        })
                        .error(function () {
                        alert("网络失败！");
                    });
                    personalHomepageMeService.getUserData3('2', $scope.othersId)
                        .success(function (response) {
                        console.log(response.data);
                        $scope.userData3 = response.data;
                        })
                        .error(function () {
                        alert("网络失败！");
                    });
                    $scope.getHisShare();
                    break;
            }
            $scope.$broadcast('scroll.refreshComplete');
        };
        /**
         * 数据
         */
        //TA的小店
        $scope.getShopList = function () {
            $scope.selectedIndex = 0;
            if (!$scope.hisInfo) {
                personalHomepageMeService.getUserData1('2', $scope.othersId)
                .success(function (response) {
                  console.log(response.data);
                //   $scope.userData = response.data;
                  if (response.success == true) {
                    $scope.hisInfo = response.data;
                    if (response.data.storeGride) {
                        $scope.levelArray = [];
                        if (response.data.storeGride <= 3) {
                        // $scope.imgCount = response.data.storeGride;
                        for (var i = 0; i < response.data.storeGride; i++) {
                            $scope.levelArray.push('img/StarLevel@2x.png');
                        }
                        } else {
                        for (var i = 0; i < response.data.storeGride - 3; i++) {
                            $scope.levelArray.push('img/DiamondLevel@2x.png');
                        }
                        }
                    }
                    if ($scope.hisInfo.isStore) {
                        //$scope.hisGoods.nums=1;//不展示空背景
                        //获取小店信息
                        if (!$scope.shop) {
                            // personalHomepageHeService.getShopInfo($stateParams.othersId).then(function (res) {
                            //     if (res.data.success == true) {
                            //         //获取商品列表
                            //         /*if (!$scope.hisGoods.goodsList) $scope.loadGoods($scope.hisGoods, 0);
                            //         $scope.shop = res.data.data;*/
                            //     } else {
                            //         PopupService.showToast(res.data.message);
                            //         $scope.shopMessage = res.data.message;//获取小店信息异常，错误信息展示出来
                            //         console.log(res.data.message);
                            //     }
                            // }, function (error) {
                            //     PopupService.showToast(error);
                            // });
                        }
                    } else {
                        // $scope.hisGoods.nums = 0;//没有小店，展示空背景
                    }
                    console.log('用户信息出参:', $scope.hisInfo);
                    } else {
                        // $scope.hisGoods.nums = 0;//获取信息失败，展示空背景
                        console.log(response.message);
                    }
                })
                .error(function () {
                  alert("网络失败！");
              });
              personalHomepageMeService.getUserData2('2', $scope.othersId)
                .success(function (response) {
                  console.log(response.data);
                  $scope.userData2 = response.data;
                })
                .error(function () {
                  alert("网络失败！");
              });
              personalHomepageMeService.getUserData3('2', $scope.othersId)
                .success(function (response) {
                  console.log(response.data);
                  $scope.userData3 = response.data;
                })
                .error(function () {
                  alert("网络失败！");
              });
            }
            /* $timeout(function () {
             $ionicScrollDelegate.resize();
             }, 200);*/
        };
        //加载更多小店商品列表
        $scope.loadGoods = function (story, time) {
            if (time == undefined) time = 1000;
            console.log(story.pageIndex);
            story.pageIndex = story.pageIndex + 1;
            if (story.pageIndex == 1) $scope.hisGoods.goodsList = [];
            //使用他的原创接口数据

            console.log('他的原创入参：', story.pageIndex, story.pageSize, $stateParams.othersId);
            story.api($scope.provinceId,$scope.cityId,$scope.regionId,$scope.streetId,story.pageIndex, story.pageSize, $stateParams.othersId)
                .success(function (response) {
                    $timeout(function () {
                        if (response.success == true) {
                            console.log('他的原创出参：', response.data);
                            story.nums = response.data.storeItemsCounts;
                            story.hasMore = story.pageIndex * story.pageSize < response.data.storeItemsCounts;
                            console.log('goods:', response.data.storeItemsCounts);
                            console.log(response.data.productsList);
                            story.goodsList = story.goodsList.concat(response.data.productsList);//核心语句：实现要遍历的数组的加长，即实现了加载更多
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $scope.$broadcast('scroll.refreshComplete');
                        } else {
                            console.log(response.message);
                        }
                    }, time);
                })
                .error(function () {
                    alert("网络失败！");
                });

        };
        //获取它的原创
        $scope.getHisStory = function () {
            $scope.selectedIndex = 1;
            if (!$scope.hisStory.storyList) {
                $scope.loadHisStory($scope.hisStory, 0);
            }
            /*  $timeout(function () {
             $ionicScrollDelegate.resize();
             }, 200);*/
            /*if (!$scope.hisStory.storyList) {
             $scope.loadHisStory($scope.hisStory);
             }*/
        };
        //加载更多他的原创
        $scope.loadHisStory = function (story, time) {
            if (time == undefined) time = 1000;
            story.pageIndex = story.pageIndex + 1;
            if (story.pageIndex == 1) $scope.hisStory.storyList = [];
            //使用他的原创接口数据
            console.log('他的原创入参：', story.pageIndex, story.pageSize, $stateParams.othersId);
            story.api(story.pageIndex, story.pageSize, $stateParams.othersId)
                .success(function (response) {
                    $timeout(function () {
                        if (response.success == true) {
                            console.log('他的原创出参：', response.data);
                            story.nums = response.totalCount;
                            story.hasMore = story.pageIndex * story.pageSize < response.totalCount;
                            console.log('story:', response.totalCount);
                            story.storyList = story.storyList.concat(response.data.list);//核心语句：实现要遍历的数组的加长，即实现了加载更多
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $scope.$broadcast('scroll.refreshComplete');
                        } else {
                            console.log(response.message);
                        }
                    }, time);
                })
                .error(function () {
                    alert("网络失败！");
                });
        };
        //获取他的分享
        $scope.getHisShare = function () {
            $scope.selectedIndex = 2;
            if (!$scope.hisShare.shareList) $scope.loadShare($scope.hisShare, 0);
            /*$timeout(function () {
             $ionicScrollDelegate.resize();
             }, 200);*/
            //$scope.loadShare($scope.hisShare);
        };
        //加载更多TA的分享
        $scope.loadShare = function (story, time) {
            if (time == undefined) time = 1000;
            story.pageIndex = story.pageIndex + 1;
            if (story.pageIndex == 1) $scope.hisShare.shareList = [];
            //使用他的原创接口数据
            console.log('他的原创入参：', story.pageIndex, story.pageSize, $stateParams.othersId);
            story.api(story.pageIndex, story.pageSize, $stateParams.othersId)
                .success(function (response) {
                    $timeout(function () {
                        if (response.success == true) {
                            console.log('他的原创出参：', response.data);
                            story.nums = response.totalCount;
                            story.hasMore = story.pageIndex * story.pageSize < response.totalCount;
                            console.log('share:', response.totalCount);
                            story.shareList = story.shareList.concat(response.data.list);//核心语句：实现要遍历的数组的加长，即实现了加载更多
                            //alert(response.data.list[1].isShortStory1);
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $scope.$broadcast('scroll.refreshComplete');
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
         * 跳转及小功能
         */
        $scope.downloadSg = function () {
            console.log($location);
            console.log($window.location);
            var url = $rootScope.isIOS ? "https://itunes.apple.com/cn/app/shun-guang-wei-dian/id1035160364?mt=8" : "http://app.qq.com/#id=detail&appid=1104761357";
            $window.location.assign(url);

        };
        $scope.hideDownload = function () {
            $scope.byShareLink = false;
        };
        //打开消息弹窗
        $scope.show = function () {
            $scope.isDisplay = !$scope.isDisplay;
        };
        //关闭消息弹窗
        $scope.disappear = function () {
            $scope.isDisplay = false;
        };
        //帖子操作（收藏、点赞）方法
        $scope.dealStory = function (item, type) {
            var id = item.storyTopicId ? item.storyTopicId : item.id;

            personalHomepageHeService.dealStory(id, type).then(function (res) {
                if (res.data.success == true) {
                    /*var Num=parseInt(num);
                     num=flag?Num-1:Num+1;
                     flag=!flag;*/
                    var num;
                    switch (type) {
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
                            //PopupService.showToast(item.collectionFlag ? "已收藏！" : "已取消收藏");
                            break;
                        case 3:
                            num = parseInt(item.praiseNumber1);
                            item.praiseNumber1 = item.praiseFlag1 ? num - 1 : num + 1;
                            item.praiseFlag1 = !item.praiseFlag1;
                            //PopupService.showToast(item.praiseFlag1 ? "已点赞！" : "已取消点赞");
                            break;
                        case 4:
                            num = parseInt(item.collectionNumber1);
                            item.collectionNumber1 = item.collectionFlag1 ? num - 1 : num + 1;
                            item.collectionFlag1 = !item.collectionFlag1;
                            //PopupService.showToast(item.collectionFlag1 ? "已收藏！" : "已取消收藏");
                            break;
                    }
                } else {
                    PopupService.showToast(res.data.message);
                    console.log(res.data.message);
                }
            }, function () {
                PopupService.showToast('网络错误！');
            });
        };

        //关注圈主
        $scope.follow = function (param) {
            HomePageService.isWdHost()
            .success(function (res) {
                $rootScope.isWdHost = res.data.isHost;
                if ($rootScope.isWdHost == -1) { //如果没有登录 跳转到登录页面
                    $state.go('login');
                }else{
                    if (param == 0) {
                        var isFollow = {
                            id: $stateParams.othersId,
                            isFollow: 1
                        };
                        NoteDetailsService.followNote(isFollow)
                            .success(function (response) {
                                if (response.success == true) {
                                    $scope.hisInfo.isFollow = 1;
                                    $scope.hisInfo.praise += 1;
                                    $scope.alreadyFollow = true;
                                    $timeout(function () {
                                        $scope.alreadyFollow = false;
                                    }, 1000);
                                }else if(response.errorCode==-2000){
                                    PopupService.showToast(response.message);
                                    $rootScope.loginIsAccord2 = true;
                                }
                            });
                    } else if (param == 1) {
                        var isFollow = {
                            id: $stateParams.othersId,
                            isFollow: 0
                        };
                        NoteDetailsService.followNote(isFollow)
                            .success(function (response) {
                                if (response.success == true) {
                                    $scope.hisInfo.praise -= 1;
                                    $scope.hisInfo.isFollow = 0;
                                }else if(response.errorCode==-2000){
                                    PopupService.showToast(response.message);
                                    $rootScope.loginIsAccord2 = true;
                                }
                            });
                    }
                }
            })

        };
        //跳转发布详情
        $scope.ToIssue = function(what,who,id) {
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
        //加入单个圈子
        $scope.joinTopic = function (item) {
            var id = item.storyTopicId;
            communityRecommendService.joinTopic(id).then(function (response) {
                if (response.data.success == true) {
                    console.log(id + "操作成功！");
                    //PopupService.showToast("已加入！");
                    item.topicFocusFlag = true;
                } else if(response.errorCode==-2000){
                    //console.log('操作失败！，错误信息：', response.message);
                    PopupService.showToast(response.data.message);
                    $rootScope.loginIsAccord2 = true;
                }
            }, function () {
                console.log('网络失败！');
                PopupService.showToast("网络错误");
            });
        };
        //加入购物车
        $scope.addToCart = function (productId) {
            var params = {
                'productId': productId,
                'number': 1,
                'o2oStoreName': '',
                'o2omap': productId + ','
            };
            personalHomepageHeService.toCart(params).then(function (res) {
                if (res.data.success == true) {
                    PopupService.showToast("加入购物车成功");
                } else {
                    PopupService.showToast(res.data.message);
                }
            }, function (error) {
                PopupService.showToast(error);
            });
        };
        //进入他的个人主页
        $scope.viewHim = function (id) {
            $state.go('personalHomepageHe', {othersId: id});
        };
        //进入商品详情页
        $scope.toProductDetails = function (good) {
            $state.go('productDetail', ({
                productId: good.productId,
                o2oType: good.o2oType,
                fromType: good.fromType,
                storeId: $scope.shop ? $scope.shop.storeId : $stateParams.othersId
                //shareStoreId: $scope.hisInfo.memberId
            }));
        };
        $scope.viewShop = function () {
          if(window.cordova){
            $rootScope.gio.evar.set({
              source:	'Community',
              value:	$scope.shop ? $scope.shop.storeId : $stateParams.othersId
            });
          }
            $state.go('myStore', {
                storeId: $scope.shop ? $scope.shop.storeId : $stateParams.othersId,
                shareStoreId: ''
            });
        };
        $scope.jumpMsg = function () {
            $state.go('messageCenter');
        };
        $scope.viewStory = function (story) {
            var id = story.storyTopicId ? story.storyTopicId : story.id;
            if (story.flag !== 2) {
                $state.go('noteDetails', {
                    noteId: id,
                    isShortStory: story.isShortStory
                });
            } else {
                $state.go('classNoteDetails', {
                    noteId: id
                });
            }
        };
        $scope.viewTopic = function (id) {
            $state.go('circlePage', {circleId: id});
        };
        /**
         * 关注方法
         */
        /* $scope.follow = function (id, isFollow) {
         var bin = isFollow ? 1 : 0;
         console.log('关注入参', id, bin);
         myFansService.follow(id, bin)
         .success(function (response, status, headers, config) {
         if (response.success == true) {
         if (bin) {
         $scope.hisInfo.praise += 1;
         } else {
         $scope.hisInfo.praise -= 1;
         }
         console.log('出参：', id, "操作成功！");
         } else {
         console.log(response.message);
         }
         })
         .error(function (response, status, headers, config) {
         alert("网络失败！");
         });
         };*/
        /* $scope.$on('$ionicView.beforeLeave', function (e, v) {
         //$scope.loadGoods=null;
         //$scope.$broadcast('scroll.infiniteScrollComplete');
         //$scope.$broadcast('scroll.refreshComplete');
         });*/
        /*
         * 分享相关
         */
        /*********************分享标签－whiteBird start*********************/
        //打开分享
        $scope.share = function (type) {//0:个人主页分享；1：小店分享
            //$scope.showShare = !$scope.showShare;
            //$scope.shareType=type;
            /*********************分享标签－whiteBird start*********************/
            if (window.umeng) {
                if (!UserService.getUser().mid) {
                    $state.go('login');
                    return;
                  }
                //新分享样式
                $scope.showShare = !$scope.showShare;
                $scope.shareType = type;
                /* $http.get($scope.shop.avatarImageFileId).then(function (res) {
                 if(res) $scope.pic = $scope.shop.avatarImageFileId;
                 else $scope.pic="./img/ic_haier_2.png";
                 },function (err) {
                 $scope.pic = "./img/ic_haier_2.png";
                 });*/
                /*********************分享标签－whiteBird end*********************/
            } else {
                alert('只能在app分享,请下载app！');
            }
        };
        //关闭分享
        $scope.hideblackCover = function () {
            $scope.showShare = false;
        };
        //分享
        $scope.shareToPlatform = function (index, type) {
            var title, content, pic, url;
            if (type) {
                if ($scope.shop) {
                    title = ($scope.shop.storeName ? $scope.shop.storeName : '他') + '的顺逛小店'; //分享标题
                    /* if ($scope.shareInfo.content.length == 0) {
                     $scope.shareInfo.content = title
                     }*/
                    //var content = $scope.shareInfo.content;  //分享内容
                    content = '买家电，到顺逛。品质无忧，更享精致服务。货到付款，送装一体。多种品类，不同系列，爆款家电，明星机型，更多精彩尽在我的顺逛小店!';  //分享内容
                    //var shopImg = document.getElementById('shopImg');
                    //pic = shopImg.src.search('localhost') != -1 ? (UrlService.getSharePicHeader() + '/img/ic_haier_2.png') : $scope.shop.avatarImageFileId;
                    pic = 'http://www.ehaier.com/mstatic/wd/v2/img/sg.png';
                    //var pic = $scope.shop.avatarImageFileId ? $scope.shop.avatarImageFileId : "./img/ic_haier_2.png";//分享图片，写绝对路径
                    url = UrlService.getShareLinkHeader() + 'myStore/' + $scope.shop.storeId + '/' + $scope.shop.storeId + '/';//分享链接，绝对路径
                    console.log(title, content, pic, url);
                }
            } else {
                title = ( $scope.hisInfo.userName ? $scope.hisInfo.userName : '他') + '的空间'; //分享标题
                /*if ($scope.shareInfo.content.length == 0) {
                 $scope.shareInfo.content = title
                 }*/
                //var content = $scope.shareInfo.content;  //分享内容
                //var content = '买家电，到顺逛。品质无忧，更享精致服务。货到付款，送装一体。多种品类，不同系列，爆款家电，明星机型，更多精彩尽在我的顺逛小店!';  //分享内容
                content = "欢迎关注" + ( $scope.hisInfo.userName ? $scope.hisInfo.userName : "他") + "的个人主页，关注他（她）的动态，一起来顺逛微社区互动吧……";
                //var headImg = document.getElementById('headImg');
                //var headImg=angular.element('#headImg');
                //pic = headImg.src.search('localhost' || './') != -1 ? (UrlService.getSharePicHeader() + '/img/quanzi/user.jpg' ) : $scope.hisInfo.img;
                pic = 'http://www.ehaier.com/mstatic/wd/v2/img/sg.png';
                //var pic = $scope.hisInfo.img ? $scope.hisInfo.img : "./img/quanzi/user.jpg";//分享图片，写绝对路径
                url = UrlService.getShareLinkHeader() + 'personalHomePageHe/' + $scope.hisInfo.memberId;//分享链接，绝对路径
                console.log(title, content, pic, url);
            }
            if (window.umeng) {
                if (index == 0) {
                    window.umeng.shareToSina(title, content, pic, url, 0,null, CreditService.shareSuccessCallback);
                } else if (index == 1) {
                    window.umeng.shareToWechatSession(title, content, pic, url, 0, null,CreditService.shareSuccessCallback);
                } else if (index == 2) {
                    window.umeng.shareToWechatTimeline(title, content, pic, url, 0, null,CreditService.shareSuccessCallback);
                } else if (index == 3) {
                    window.umeng.shareToQQ(title, content, pic, url, 0,null, CreditService.shareSuccessCallback);
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
        /*********************分享标签－whiteBird end*********************/

    }]);
/*APP.directive('reUrl', function ($interval) {
 return {
 restrict:'E',
 scope:{

 },
 link:function (scope, element, attrs) {
 $interval(function () {
 if (attrs['src']) scope.pic = attrs['src'];
 //alert(scope.pic);
 }, 3000
 )
 }
 }
 });*/
/**
 * 他的主页服务
 */
APP.service('personalHomepageHeService', ['$http', 'UrlService', function ($http, UrlService) {
    //Ta的分享
    this.hisShare = function (pageIndex, pageSize, memberId) {
        var postData = {
            pageIndex: pageIndex,
            pageSize: pageSize,
            userCode: memberId
        };
        return $http({
            method: 'post',
            url: UrlService.getUrl('HIS_SHARE'),
            data: postData
        });
    };
    //加入购物车接口api
    this.toCart = function (params) {
        var postData = {
            'productId': params.productId,
            'number': params.number,
            'o2oStoreName': params.o2oStoreName,
            'o2omap': params.o2omap
        };
        return $http({
            method: 'get',
            url: UrlService.getUrl('SHOP_ADD_CART'),
            params: postData
        });
    };
    //小店信息接口
    /*this.getShopInfo = function (params) {
        var parameters = {
            storeId: params
        };
        return $http({
            method: 'get',
            url: UrlService.getUrl('SHOP_INFO'),
            params: parameters
        });
    };*/
    //小店列表信息接口
    // $scope.provinceId = obj[0].provinceId;
            //     $scope.cityId = obj[0].cityId;
            //     $scope.regionId = obj[0].areaId;
            //     $scope.streetId = obj[0].streetId;
    /*this.getShopListInfo = function (provinceId,cityId,regionId,streetId,pageIndex, pageSize, memberId) {
        var parameters = {
            'pholder':1,
            'provinceId':2,
            'cityId':716,
            'districtId':944,
            'streetId':12024730,
            'pageIndex': pageIndex,
            'pageSize': pageSize,
            'memberId': memberId
        };
        return $http({
            method: 'get',
            url: UrlService.getUrl('SHOP_INFO_LIST'),
            'pholder':1,
            'provinceId':provinceId,
            'cityId':cityId,
            'districtId':regionId,
            'streetId':streetId,
            'pageIndex': pageIndex,
            'pageSize': pageSize,
            'memberId': memberId,
            'filterData':'saleDesc',
            'fromType':2,
            'noLoading':false,
            'productCateId':0,


        });
    };*/
    //获取地址信息
  this.getAddress = function () {
    return $http.get(UrlService.getUrl('GET_POSITION_FROM_COOLIE'));
  };
    this.dealStory = function (storyId, type) {
        var postData = {
            id: storyId,
            noLoading:true
        };
        var api;
        switch (type) {
            case 1:
                api = 'COMMENT_PRAISE';//普通帖子点赞
                break;
            case 2:
                api = 'COLLECTION_TOPIC';//普通帖子收藏
                break;
            case 3:
                api = 'SCHOOLPRAISESTORY';//微学堂帖子点赞
                break;
            case 4:
                api = 'SCHOOLCOLLECTION';//微学堂帖子收藏
                break;
        }
        return $http({
            method: 'post',
            url: UrlService.getUrl(api),
            data: postData
        });
    };
    /*  this.getIsFollowed = function (id) {
     var postData = {id:id};
     /!* var config = {
     params: {
     id: id
     }
     };
     return $http.post(UrlService.getUrl('IS_FOLLOWED'),postData.config);*!/
     /!*return $http.get("data/isFollowed.json", config);*!/
     return $http({
     method:'post',
     url:UrlService.getUrl('IS_FOLLOWED'),
     data:postData
     });
     };*/
    /*  /!**
     * 伪造数据方法
     * @param pageNumber
     * @param pageSize
     * @returns {{data: Array}}
     *!/
     this.getData = function (pageNumber, pageSize) {
     //单页数据
     var singlePage = [];
     //加长单页数据的循环
     for (var i = 1; i <= pageSize; i++) {
     //新建一个对象
     var post = {
     title: '第' + pageNumber + '页的第' + i + '个帖子的标题',
     comments: pageNumber,
     likes: i,
     quanziName: '第' + pageNumber + '页的第' + i + '个帖子所属的community',
     quanziLogoUrl: 'img/ass_good.png'
     };
     //push到单页数据
     singlePage.push(post);
     }
     //返回单页数据
     return {
     data: singlePage
     };
     };
     /!**
     * 伪造数据方法
     * @param pageNumber
     * @param pageSize
     * @returns {{data: Array}}
     *!/
     this.get1Data = function (pageNumber, pageSize) {
     //单页数据
     var singlePage = [];
     //加长单页数据的循环
     for (var i = 1; i <= pageSize; i++) {s
     //新建一个对象
     var post = {
     title: '第' + i + '个帖子的标题' + '(第' + pageNumber + '页)',
     comments: i,
     likes: pageNumber,
     quanziName: 'community' + '(第' + pageNumber + '页第' + i + '个帖子)',
     quanziLogoUrl: 'img/ass_good.png'
     };
     //push到单页数据
     singlePage.push(post);
     }
     //返回单页数据
     return {
     data: singlePage
     };
     }*/
}]);
