APP.controller('teamSuperviseController', ['$ionicPopup','$state','UserService','$scope','CLASSIFYMESSAGECRNTERService', '$localstorage', '$rootScope','teamSuperviseService','$stateParams','$ionicScrollDelegate','UrlService','CreditService','PopupService','HomePageService',
  function ($ionicPopup,$state,UserService,$scope,CLASSIFYMESSAGECRNTERService,$localstorage,$rootScope,teamSuperviseService,$stateParams,$ionicScrollDelegate,UrlService,CreditService,PopupService,HomePageService) {
    var heightTHis = '';//头部高度
    $scope.productList = [];
    $scope.childrenList=[];
    $scope.rowsList=[];
    $scope.isFindTab = true; // tab切换
    $scope.selectedIndex = 0; //切换样式
    $scope.isUserShow = false; //内容显示 隐藏
    $scope.isTeamInfo = false; //合伙人 内容显示 隐藏
    $scope.isUser = false; //用户2级导航
    $scope.page = 1; //默认页数
    $scope.cascade = false; //false 合伙人 true 团队
    $scope.isTeam = true; //合伙人导航
    $scope.sortIndex = 0; //默认排序 开店时间
    $scope.sortInd = 0; //默认排序 团队 合伙人
    $scope.sortNum = 2; //默认排序 用户
    $scope.pageSize = 10; //默认几条数据 团队合伙人
    $scope.userpageSize = 10; //默认几条数据 用户
    $scope.orderOrTeams = false; //合伙人  团队
    $scope.sortsIndex = 1; //排序 图
    $scope.messageImgFlag=true;//消息图片判断
    $scope.flagNum = false;
    $scope.messageImgUrl = "http://cdn09.ehaier.com/shunguang/H5/www/img/messageLogo@2x.png";
 //   $scope.active=true;
  //  $scope.store=true;
    $scope.arrowState = [$rootScope.imgBaseURL+'img/sortT.png',$rootScope.imgBaseURL+'img/sortF.png']; //'img/sort2.png'
    $scope.Math=window.Math;
    var typeList=['startTime','isAuthenticated','teamLevelOrder','isActive']; //团队合伙人 排序
    var userList=['shopKeepers','purchasedNum','recentBuyingTime']; // 用户 排序
 //   $scope.orderIndex='asc';
    $scope.memberId = UserService.getUser().mid; //id
    $scope.substring=window.substring;

    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
      $scope.paddingtopClass = {
        "padding-top": "20px"
      };
      $scope.paddingContentClass = {
        "top": "0px"
      };

    }else{
      $scope.paddingtopClass = {
        "padding-top": "0"
      };
      $scope.paddingContentClass = {
        "top": "0px"
      };
    }
    $scope.init = function(){
      HomePageService.getUnReadMsg()
        .success(function (res) {
          if (res.data > 0) {
            $scope.flagNum = true;
          } else {
            $scope.flagNum = false;
          }
        })
    }
    //分享
    $scope.share = function () {

      /*********************分享标签－whiteBird start*********************/
      if (window.device && window.device.hasNewShare) {

        //新分享样式
        $scope.showShare = !$scope.showShare;
        /*********************分享标签－whiteBird end*********************/
      } else {

        //旧分享样式  darcywang
        var title = '顺逛店主邀请你一起瓜分5亿佣金',
          content = '海尔社群交互平台，零成本创业APP，一起来赚钱吧',
          pic = UserService.getUser().avatarImageFileId,
          url = UrlService.getShareLinkHeader() + 'register/' + '0/' + $scope.productList.owner.promotionCode;

        if (window.umeng) {
          window.umeng.share(title, content, pic, url, 0);
        } else {
          alert('只能在app分享,请下载app！');
        }

      }
    };
    $scope.copyText = function (text) {
     if(window.cordova)
     {
       cordova.plugins.clipboard.copy(text);
       PopupService.showToastWithTime('复制成功',2000);
     }
     else
     {
       PopupService.showToast('请下载APP执行此操作');
     }
    };
    /*********************分享标签－whiteBird start*********************/

    $scope.hideblackCover = function () {
      $scope.showShare = false;
    };
    $scope.shareToPlatform = function (index) {

      var title = '我正在使用顺逛APP，推荐给你哦',
        content = '时下最流行的赚钱APP，海尔集团官方平台，一起来玩吧',
        pic = UserService.getUser().avatarImageFileId,
        url = UrlService.getShareLinkHeader() + 'register/' + '0/' + $scope.productList.owner.promotionCode;

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
          $scope.copyText(url);
        }else {
          CreditService.successShare();
        }
      } else {
        alert('umeng undefined 只能在app分享');
      }

      $scope.showShare = false;
    };
    /*********************分享标签－whiteBird end*********************/
    //查看推荐人信息弹出层
    $scope.lookreferee=function(){
      var myPopup = $ionicPopup.show({
        template:
        '<div style="color: black;font-size: 16px;border-bottom:1px solid #f2f2f2;height:30px;lineHeight:30px;margin-bottom:8px;margin-top:-12px">推荐人信息</div>'+'<div style="text-align:start;text-indent:32px;color: black;margin-bottom:5px;">我的推荐人 : <b>{{myheader.realName}}</b></div>'+'<div style="text-align:start;text-indent:32px;color: black;margin-bottom:5px;">ID : <b>{{myheader.memberId}}</b></div>'+'<div style="text-align:start;text-indent:32px;color: black;margin-bottom:-5px;position:relative;">手机号 : <b>{{myheader.mobile}}</b>&nbsp;&nbsp;<img ng-src="{{imgBaseURL}}img/headerphone.png" width="20" heihgt="20" style="position:absolute;top:-2px;" ng-click="cellphone()"/></div>',
        scope: $scope,
        buttons:[{
          text: '<b>确定</b>',
          type: 'button-positive',
          onTap: function (e){
            e.preventDefault();
            myPopup.close();
          }   
        }]
      })
    };
    //拨打推荐人电话
    $scope.cellphone=function(){
      if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
            window.open('tel:' + $scope.myheader.mobile, '_system');
          } else {
            window.open('tel:' + $scope.myheader.mobile);
          }
    }
    //用户数量
    $scope.userM=function () {
      teamSuperviseService.userData($scope.memberId,$scope.page,$scope.pageSize,userList[2],$scope.orderIndex)
        .success(function(response) {
          if(response.success){
            $scope.usersNumber= response.data.total; //用户数量
          }else{
            console.log('没拿到数据')
          }
        });
    };
    //$scope.userM();
    //会员中心
    $scope.goMemberCenter = function(){
      CreditService.getGameId(function(gameId){
        $state.go('vip',{gameId:gameId});
      });
    };

    // 团队 合伙人
    $scope.commontFun=function (ind) {
      $ionicScrollDelegate.scrollTop();
      if($scope.selectedIndex==0){
        $scope.orderOrTeams=false;
        $scope.info=0;
      }else if($scope.selectedIndex==1){
        $scope.orderOrTeams=true;
        $scope.info=1;
      }
      teamSuperviseService.doInit($scope.memberId,$scope.orderOrTeams,$scope.page,$scope.pageSize,typeList[ind],$scope.orderIndex,$scope.active,$scope.store)
        .success(function(response) {
          console.log(response)
          if(response.success){
            $scope.productList = response.data;
            $scope.childrenList = response.data.children; //列表
           // $scope.unauthenticatedNum=response.data.total-response.data.authenticatedNum;
           // $scope.unactiveNum=response.data.total - response.data.unActiveNum;
            $scope.hasmore = $scope.childrenList.length < response.data.total;
          }else{
            console.log('没拿到数据')
          }

        });
    };

    //用户
    $scope.usercomFun=function (ind) {
      teamSuperviseService.userData($scope.memberId,$scope.page,$scope.userpageSize,userList[ind],$scope.orderIndex)
        .success(function(response) {
          console.log(response)
          if(response.success){
            $scope.rowsList = response.data.rows; //列表
            $scope.hasmore = $scope.rowsList.length < response.data.total;
          }else{
            console.log('没拿到数据')
          }

        });
    };

    /*********排序 start *************/
     // 开店时间
    $scope.teamClickFun=function (index) {
      $ionicScrollDelegate.scrollTop();
       $scope.sortInd=index;
       $scope.page = 1;
       if($scope.sortsIndex==0){       // 降序
         $scope.sortsIndex=1;
         $scope.orderIndex='desc';
         $scope.commontFun($scope.sortInd,$scope.orderIndex);
       }
       else if($scope.sortsIndex==1){   //升序
         $scope.sortsIndex=0;
         $scope.orderIndex='asc';
         $scope.commontFun($scope.sortInd,$scope.orderIndex);
       }
     };

     //实名认证
    $scope.teamTrueAttestation=function (index) {
      $ionicScrollDelegate.scrollTop();
      $scope.sortInd=index;
      $scope.isAuthenticated =2;
      $scope.orderIndex='desc';
      $scope.page = 1;
      $scope.childrenList=[];
      $scope.commontFun($scope.sortInd);
    //  $scope.storeFun($scope.store,$scope.page);
    };

    //盟主舵主
    $scope.teamLevel=function (index) {
      $scope.childrenList=[];
      $scope.sortInd=index;
      $scope.orderIndex='desc';
      $scope.page = 1;
      $scope.commontFun($scope.sortInd);
    };

    //本月活跃
    $scope.teamActive=function (index) {
      $scope.sortInd=index;
      $scope.isActiveNum=2;
      $scope.isAuthenticated=2;
      $scope.orderIndex='desc';
      $scope.page = 1;
      $scope.childrenList=[];
      $scope.commontFun($scope.sortInd);
    //  $scope.activeFun($scope.active)
    };

    //微店主
    $scope.userClickFun=function (index) {
      $scope.sortNum=index;
      $scope.orderIndex='desc';
      $scope.page = 1;
      $scope.usercomFun($scope.sortNum);
    };

    //商品数量
    $scope.userNumber=function (index) {
      $scope.sortNum=index;
      $scope.orderIndex='desc';
      $scope.page = 1;
      $scope.usercomFun($scope.sortNum);
    };

    //最近一次购买时间
    $scope.userTime=function (index) {
      $scope.sortNum=index;
      $scope.page = 1;
        if($scope.sortsIndex==0){ // 降序
        $scope.sortsIndex=1;
        $scope.orderIndex='desc';
        $scope.usercomFun($scope.sortNum,$scope.orderIndex);
      } else if($scope.sortsIndex==1){ //升序
        $scope.sortsIndex=0;
        $scope.orderIndex='asc';
        $scope.usercomFun($scope.sortNum,$scope.orderIndex);
      }

    };

    /*********排序 end *************/


    // 回退
    $scope.goBack = function () {
      $scope.$ionicGoBack();
    };
    //获取列表
    $scope.getShopData = function() {
      teamSuperviseService.doInit($scope.memberId,$scope.orderOrTeams,$scope.page,$scope.pageSize,typeList[$scope.sortIndex],$scope.orderIndex)
        .success(function(response) {
          if(response.success){
            if(response.data.parent){
              $scope.hasparent = true;
              $scope.myheader = response.data.parent;
            }else{
              $scope.hasparent= false;
            }
            $scope.productList = response.data;
            $scope.childrenList = response.data.children; //列表
            $scope.unauthenticatedNum=Math.floor(response.data.total-response.data.authenticatedNum);
            $scope.unactiveNum=Math.floor(response.data.total-response.data.unActiveNum);
            $scope.hasmore = $scope.childrenList.length < response.data.total;
          }else{
            console.log('没拿到数据');
          }
        });
    };

    //时间戳转时间
    $scope.timeFun=function(nS) {
      return new Date(parseInt(nS) * 1000).toLocaleString().replace(/\//g, "-").replace(/日/g, " ");
    };

    $scope.Reps=function (str) {
      if(str){
        return str.substring(0,1);
      }
    };

    //修改头像
    /*$scope.changeIcon = function () {
      if (!!window.cordova) {
        var options = {
          title: '照片选取方式：',
          buttonLabels: ['拍照', '从相册选取'],
          addCancelButtonWithLabel: '取消',
          androidEnableCancelButton: true
        };
        var callback = function (buttonIndex) {
          if (buttonIndex == 1) {
            navigator.camera.getPicture(getSuccess, getFail, {
              quality: 100,
              destinationType: Camera.DestinationType.FILE_URI,
              allowEdit: true,
              targetWidth: 720,
              targetHeight: 720,
              saveToPhotoAlbum: true
            });
            function getSuccess(imageData) {
              $scope.avatarImage = imageData;
              $timeout(function () {
                  $scope.avatarImage = imageData;
                }, 200
              );
              //调用图片上传接口
              var win = function (r) {
                $ionicLoading.hide();
                PopupService.showToast('上传成功');
                var resp = JSON.parse(r.response);
                $scope.avatarImage = resp.data.avatarImageFileId;
                $scope.user.avatarImageFileId = $scope.avatarImage;
                UserService.setUser($scope.user);
              };
              var fail = function (error) {
                $ionicLoading.hide();
                PopupService.showToast('上传失败');
              };
              var options = new FileUploadOptions();
              options.fileKey = 'imageFile';
              options.fileName = $scope.avatarImage.substr($scope.avatarImage.lastIndexOf('/') + 1);
              options.mimeType = 'image/jpeg';
              var params = {};
              //params.userName = UserService.getUser().userName;
              options.params = params;
              var ft = new FileTransfer();
              ft.upload($scope.avatarImage, encodeURI(AccountMessageService.uploadImage()), win, fail, options);
              var par = {
                template: '<div style="background:#fff;border-radius:4px;"><img ng-src="{{imgBaseURL}}img/ic_refresh_01.gif" style="width: 65px;"/></div>'
              };
              $ionicLoading.show(par);
            }
            function getFail(message) {

            }
          } else if (buttonIndex == 2) {
            console.log('从相册中获取');
            navigator.camera.getPicture(getSuccessTwo, getFailTwo, {
              quality: 100,
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
              allowEdit: true,
              targetWidth: 720,
              targetHeight: 720
            });
            function getSuccessTwo(imageURI) {
              $scope.avatarImage = imageURI;
              $timeout(function () {
                  $scope.avatarImage = imageURI;
                }, 200
              );
              //调用图片上传接口
              var win = function (r) {
                PopupService.showToast('上传成功');
                $ionicLoading.hide();
                var resp = JSON.parse(r.response);
                $scope.avatarImage = resp.data.avatarImageFileId;
                $scope.user.avatarImageFileId = $scope.avatarImage;
                UserService.setUser($scope.user);
              };
              var fail = function (error) {
                PopupService.showToast('上传失败');
                $ionicLoading.hide();
              };
              var options = new FileUploadOptions();
              options.fileKey = 'imageFile';
              options.fileName = $scope.avatarImage.substr($scope.avatarImage.lastIndexOf('/') + 1);
              options.mimeType = 'image/jpeg';
              var params = {};
              // params.userName = UserService.getUser().userName;
              options.params = params;
              var ft = new FileTransfer();
              ft.upload($scope.avatarImage, encodeURI(AccountMessageService.uploadImage()), win, fail, options);
              var par = {
                template: '<div style="background:#fff;border-radius:4px;"><img src="{{imgBaseURL}}img/ic_refresh_01.gif" style="width: 65px;"/></div>'
              };
              $ionicLoading.show(par);
            }

            function getFailTwo(message) {

            }
          }
        };
        window.plugins.actionsheet.show(options, callback);
        $timeout(function () {
          window.plugins.actionsheet.hide();
        }, 5000);
      } else {
        $ionicPopup.alert({
          template: '请下载客户端实现更换头像功能',
          okText: '知道了'
        });
      }
    };*/

    //点击切换
    $scope.teamTab=function (index) {
      $scope.selectedIndex=index;
      $scope.sortInd=0;
      $scope.page=1;
      $scope.orderIndex='desc';
      $scope.childrenList=[];
      $scope.rowsList=[];
      $ionicScrollDelegate.scrollTop();
      if($scope.selectedIndex==0){
        console.log($scope.selectedIndex)
        $scope.sortsIndex=1;
        $scope.orderIndex='desc';
        $scope.isTeam=true;
        $scope.isTeamInfo=false;
        $scope.isUserShow=false;
        $scope.isUser=false;
        $scope.isAuthenticated=2;
        $scope.isActiveNum=2;
        $scope.commontFun($scope.sortInd,$scope.orderIndex);
      }
      else if($scope.selectedIndex==1){
        console.log($scope.selectedIndex)
        $scope.isTeam=true;
        $scope.isUserShow=false;
        $scope.isTeamInfo=false;
        $scope.isUser=false;
        $scope.sortsIndex=1;
        $scope.orderIndex='desc';
        $scope.isAuthenticated=2;
        $scope.isActiveNum=2;
        $scope.commontFun($scope.sortInd,$scope.orderIndex);
      }
      else if($scope.selectedIndex==2){
        console.log($scope.selectedIndex)
        $scope.isTeam=false;
        $scope.isTeamInfo=true;
        $scope.isUserShow=true;
        $scope.isUser=true;
        $scope.sortNum = 2;
        $scope.orderIndex='desc';
        $scope.sortsIndex = 1;
        console.log($scope.sortNum)
        $scope.usercomFun($scope.sortNum,$scope.orderIndex);
      }
    };

    //实名认证函数
    $scope.storeFun=function (store) {
      teamSuperviseService.newStore($scope.memberId,$scope.orderOrTeams,$scope.page,$scope.pageSize,typeList[1],$scope.orderIndex,store)
        .success(function (response) {
          if(response.success){
            $scope.productList = response.data;
            $scope.childrenList = response.data.children; //列表
            $scope.hasmore = $scope.childrenList.length < response.data.total;
          }else{
            console.log('没拿到数据')
          }
        });
    };
   // 实名认证加载更多
    $scope.storeMoreFn=function (page,Authenticate) {
      teamSuperviseService.storeMore($scope.memberId,$scope.orderOrTeams,page,$scope.pageSize,typeList[$scope.sortInd],$scope.orderIndex,Authenticate)
        .success(function (response) {
          if(response.success){
            if($scope.childrenList.length < response.data.total){
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.hasmore = true;
              $scope.childrenList = $scope.childrenList.concat(response.data.children);
            }
            else{
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.hasmore = false;
            }
          }
        });
    };

    //实名认证
    $scope.Authenticated=function (index) {
      $scope.isAuthenticated=index;
        if(index==0){ // 未认证
          $scope.page=1;
          $scope.store=false;
          $scope.storeFun($scope.store);
        }else if(index==1){ //认证
          $scope.page=1;
          $scope.store=true;
          $scope.storeFun($scope.store);
        }
    };

    //本月活跃函数
    $scope.activeFun=function (active) {
      teamSuperviseService.newActive($scope.memberId,$scope.orderOrTeams,$scope.page,$scope.pageSize,typeList[3],$scope.orderIndex,active)
        .success(function (response) {
            if(response.success){
              $scope.productList = response.data;
              $scope.childrenList = response.data.children; //列表
              $scope.hasmore = $scope.childrenList.length < response.data.total;
            }else{
              console.log('没拿到数据')
            }
        });
    };
      // 本月活跃加载更多
      $scope.activeMoreFn=function (page,isactive) {
        teamSuperviseService.activeMore($scope.memberId,$scope.orderOrTeams,page,$scope.pageSize,typeList[$scope.sortInd],$scope.orderIndex,isactive)
          .success(function (response) {
            if(response.success){
              if($scope.childrenList.length < response.data.total){
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.hasmore = true;
                $scope.childrenList = $scope.childrenList.concat(response.data.children);
              }
              else{
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.hasmore = false;
              }
            }
          });
      };
    //本月活跃
    $scope.isActive=function (index) {
      $ionicScrollDelegate.scrollTop();
      $scope.isActiveNum=index;
      if(index==0){ // 没有活跃
        $scope.page=1;
        $scope.active=false;
        $scope.activeFun($scope.active);
      }else if(index==1){ //活跃
        $scope.page=1;
        $scope.active=true;
        $scope.activeFun($scope.active);
      }
    };


    // 用户加载更多
    $scope.userLoadMore=function (page) {
      teamSuperviseService.userData($scope.memberId,page,$scope.userpageSize,userList[$scope.sortNum],$scope.orderIndex)
        .success(function (response) {
          if(response.success){
            if($scope.rowsList.length < response.data.total){
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.hasmore = true;
              $scope.rowsList = $scope.rowsList.concat(response.data.rows);
            }
            else{
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.hasmore = false;
            }
          }
        });
    };
    // 团队 合伙人 加载更多
    $scope.teamLoadMore=function (page) {
      teamSuperviseService.doInit($scope.memberId,$scope.orderOrTeams,page,$scope.pageSize,typeList[$scope.sortInd],$scope.orderIndex)
        .success(function (response) {
          if(response.success){
            if($scope.childrenList.length < response.data.total){
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.hasmore = true;
              $scope.childrenList = $scope.childrenList.concat(response.data.children);
            }
            else{
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.hasmore = false;
            }
          }
        });
    };

    //数据上拉加载
    $scope.loadMore = function(){

      //$scope.orderIndex='desc';
      if(($scope.sortInd==0 && ($scope.selectedIndex==0 || $scope.selectedIndex==1)) || ($scope.sortNum==2 && $scope.selectedIndex==2) ){
        console.log('zou 1')
        if($scope.sortsIndex==0){
          $scope.orderIndex='asc';
          console.log('zou 1 asc')
        }else if($scope.sortsIndex==1){
          $scope.orderIndex='desc';
          console.log('zou 1 desc')
        }
      }else{
        console.log('zou 2')
        $scope.orderIndex='desc';
      }

      console.log($scope.sortsIndex);
      if(($scope.selectedIndex==0 && ( $scope.sortInd==0 ||  $scope.sortInd==2) ) || ($scope.selectedIndex==1 && ( $scope.sortInd==0 ||  $scope.sortInd==2))){
        $scope.page++;
        $scope.teamLoadMore($scope.page);
      }else if(($scope.selectedIndex==0 && ( $scope.sortInd==1 ||  $scope.sortInd==3) ) || ($scope.selectedIndex==1 && ( $scope.sortInd==1 ||  $scope.sortInd==3))){
        console.log('bububu'+$scope.isActiveNum)
        if($scope.isActiveNum==0){ //本月活跃
          console.log('走活跃 0 ')
          console.log($scope.page)
          $scope.active=false;
          $scope.page++;
          $scope.activeMoreFn($scope.page,$scope.active)
        }
       else if($scope.isActiveNum==1){
          console.log('走活跃 1 ')
          console.log($scope.page)
          $scope.active=true;
          $scope.page++;
          $scope.activeMoreFn($scope.page,$scope.active);
        }
       else if($scope.isAuthenticated==0){  //是否实名
          console.log('走实名 0 ')
          $scope.store=false;
          $scope.page++;
          $scope.storeMoreFn($scope.page,$scope.store);
        }
       else if($scope.isAuthenticated==1){
          console.log('走实名 1 ')
          console.log($scope.page)
          $scope.store=true;
          $scope.page++;
          $scope.storeMoreFn($scope.page,$scope.store);
        }else{
         console.log('最后一步')
          $scope.page++;
          $scope.teamLoadMore($scope.page);
        }
      }
       if($scope.selectedIndex==2){
        $scope.page++;
        $scope.userLoadMore($scope.page);
      }

    };

    $scope.commonFn=function () {
      $ionicScrollDelegate.scrollTop();
      $scope.rowsList=[];
      $scope.productList = [];
      $scope.childrenList=[];
      $scope.selectedIndex = 0;
      $scope.sortInd = 0;
      $scope.sortNum=2;
      $scope.page=1;
      $scope.memberId = UserService.getUser().mid;
      $scope.store=true;
      $scope.active=true;
      $scope.isTeam=true;
      $scope.isUser=false;
      $scope.isUserShow = false;
      $scope.isTeamInfo = false;
      $scope.orderIndex='desc';
      $scope.hasmore = true;
      $scope.sortIndex = 0;
      $scope.getShopData();
    } ;

    $scope.$on('$ionicView.beforeEnter', function(event,data) {
      if(data.direction == 'back'){
        HomePageService.getUnReadMsg()
        .success(function (res) {
          if (res.data > 0) {
            $scope.flagNum = true;
          } else {
            $scope.flagNum = false;
          }
        })
        return;
      }
      $scope.commonFn();
      $scope.userM();
      $scope.init();
    });
  }]);

APP.service('teamSuperviseService', ['$http', 'UrlService', function ($http, UrlService) {
  //初始化
  this.doInit = function (memberId,cascade,page,pageSize,sort,order,isActive,isAuthenticated) {
    var params = {
      withParent:true,
      memberId: memberId,
      cascade: cascade,
      pageNumber: page,
      pageSize: pageSize,
      sort:sort,
      order:order
    };
    var response=$http.get(UrlService.getUrl('TEAM_SUPERVISE'), params);
    return response;
  };
  //实名认证加载更多
  this.storeMore = function (memberId,cascade,page,pageSize,sort,order,isAuthenticated) {
    var params = {
      memberId: memberId,
      cascade: cascade,
      pageNumber: page,
      pageSize: pageSize,
      sort:sort,
      order:order,
      isAuthenticated:isAuthenticated,
      noLoading: true
    };
    var response=$http.get(UrlService.getUrl('TEAM_SUPERVISE'), params);
    return response;
  };
  //本月活跃加载更多
  this.activeMore = function (memberId,cascade,page,pageSize,sort,order,isActive) {
    var params = {
      memberId: memberId,
      cascade: cascade,
      pageNumber: page,
      pageSize: pageSize,
      sort:sort,
      order:order,
      isActive:isActive,
      noLoading: true
    };
    var response=$http.get(UrlService.getUrl('TEAM_SUPERVISE'), params);
    return response;
  };
  // 未认证
  this.newStore = function (memberId,cascade,page,pageSize,sort,order,isAuthenticated) {
    var params = {
      memberId: memberId,
      cascade: cascade,
      pageNumber: page,
      pageSize: pageSize,
      sort:sort,
      order:order,
      isAuthenticated:isAuthenticated,
      noLoading: true
    };
    return $http.get(UrlService.getUrl('TEAM_SUPERVISE'), params);
  };
  //本月活跃
  this.newActive = function (memberId,cascade,page,pageSize,sort,order,isActive) {
    var params = {
      memberId: memberId,
      cascade: cascade,
      pageNumber: page,
      pageSize: pageSize,
      sort:sort,
      order:order,
      isActive:isActive,
      noLoading: true
    };
    return $http.get(UrlService.getUrl('TEAM_SUPERVISE'), params);
  };
  // 用户
  this.userData=function (memberId,page,pageSize,sort,order) {
    var params = {
      memberId: memberId,
      pageNumber: page,
      pageSize: pageSize,
      sort:sort,
      order:order
    };
    return $http.get(UrlService.getUrl('TEAM_USERS'), params);
  }


}]);
