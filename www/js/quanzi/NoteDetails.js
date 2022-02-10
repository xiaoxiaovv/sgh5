/**
 * 回复文本框 多行输入 ,todo 解决 输入字数的限制
 */


APP.directive('comImageBox', ['$rootScope','$ionicActionSheet','PopupService','CreditService','$timeout',function($rootScope,$ionicActionSheet,PopupService,CreditService,$timeout) {
  var comImageBox = {
    restrict: 'E',
    template: '<div class="LightBox" style="display:none;" ><div class="ImgViewer" on-tap="hideBigImage($event)"><img src="{{Url}}"></div></div>',
    transclude: false,
    templateNamespace: 'html',
    scope: false,
    link: {
      pre: function preLink(scope, element, attrs, controller) {
        //图片大小
        var elWidth, elHeight;
        //元素大小
        var outWidth, outHeight;
        // 当前操作模式 pinch:缩放 swipe:滑动
        var mode = '';

        // 双指触摸点的距离 (缩放模式)
        var distance = 0;
        var initialDistance = 0;
        var isIOS = !!window.cordova && (ionic.Platform.platform().indexOf('ios') != -1);
        // 图片缩放参数
        var scale = 1;
        var relativeScale = 1;
        var initialScale = 1;
        var maxScale = parseInt(attrs.maxScale, 10);
        if (isNaN(maxScale) || maxScale <= 1) {
          maxScale = 20;
        }

        // position of the upper left corner of the element
        var positionX = 0;
        var positionY = 0;

        var initialPositionX = 0;
        var initialPositionY = 0;

        // central origin (缩放模式)
        var originX = 0;
        var originY = 0;

        // start coordinate and amount of movement （滑动模式）
        var startX = 0;
        var startY = 0;
        var moveX = 0;
        var moveY = 0;

        outWidth = $(".LightBox").width();
        outHeight = $(".LightBox").height();


        scope.Url = "";
        scope.bigImage = false;
        scope.noreload = false;

        //显示图片
        scope.showBigImage = function(_this,imageName) {
          // alert(imageName.getAttribute('src'))
          // scope.Url = imageName;//imageName;
          // console.log(_this.target.currentSrc)
          // console.log(_this)
          //没有图片地址不允许继续执行
          if(_this.target.tagName=='VIDEO') return;
          if(_this.target.currentSrc==undefined) return;
          //阻止冒泡事件
          _this.stopPropagation();
          console.log(_this.target.currentSrc)
          scope.Url =_this.target.currentSrc;
          console.log(scope.Url)
          $rootScope.picBigUrl = scope.Url;
          scope.bigImage = true;

          $(".LightBox").show(150, function() {
            $("ion-header-bar").hide();
            $(".Main .tab-nav").hide();
            $(".LightBox .ImgViewer img").each(function() {

              $(this).css({
                width: "90%"
              });

              elWidth = $(this).width();
              elHeight = $(this).height();
              //居中
              $(this).css({

                marginLeft: elWidth / 2 * (-1),
                marginTop: elHeight / 2 * (-1)
              })
            });
          });

          //console.info(element.find("img"));
          //每次点击放大图片之后需要绑定事件
          element.find("img").on('touchstart', touchstartHandler);
          element.find("img").on('touchmove', touchmoveHandler);
          element.find("img").on('touchend', touchendHandler);
        };
        //隐藏图片
        scope.hideBigImage = function() {
          scope.bigImage = false;
          scope.noreload = true;
          $timeout(function(){
            scope.noreload = false;
          },500)
          $("ion-header-bar").show();
          $(".Main .tab-nav").show();
          $(".LightBox").hide(200);
          // 当前操作模式 pinch:缩放 swipe:滑动
          mode = '';

          // 双指触摸点的距离 (缩放模式)
          distance = 0;
          initialDistance = 0;

          // 图片缩放参数
          scale = 1;
          relativeScale = 1;
          initialScale = 1;
          maxScale = parseInt(attrs.maxScale, 10);
          if (isNaN(maxScale) || maxScale <= 1) {
            maxScale = 20;
          }

          // position of the upper left corner of the element
          positionX = 0;
          positionY = 0;

          initialPositionX = 0;
          initialPositionY = 0;

          // central origin (缩放模式)
          originX = 0;
          originY = 0;

          // start coordinate and amount of movement （滑动模式）
          startX = 0;
          startY = 0;
          moveX = 0;
          moveY = 0;

          transformElement();
        };


        /****************************************** 图片缩放功能开始 20161104 qinxiankang 添加 ***************************/



        /**
         * @param {object} 点击开始，初始化
         */
        function touchstartHandler(evt) {
          //console.info("touchstart");
          var touches = evt.originalEvent ? evt.originalEvent.touches : evt.touches;

          startX = touches[0].clientX;
          startY = touches[0].clientY;
          initialPositionX = positionX;
          initialPositionY = positionY;
          moveX = 0;
          moveY = 0;
        }

        /**
         * @param {object} 手指移动
         */
        function touchmoveHandler(evt) {
          //console.info("touch move");
          var touches = evt.originalEvent ? evt.originalEvent.touches : evt.touches;
          var leftX = positionX - elWidth * scale / 2 + outWidth / 2;
          var rightX = outWidth - (leftX + elWidth * scale);
          var topY = positionY - elHeight * scale / 2 + outHeight / 2;
          var bottomY = outHeight - (topY + elHeight * scale);



          if (mode === '') {
            if (touches.length === 1) {

              mode = 'swipe';

            } else if (touches.length === 2) {

              mode = 'pinch';

              initialScale = scale;
              initialDistance = getDistance(touches);
              originX = touches[0].clientX -
                parseInt((touches[0].clientX - touches[1].clientX) / 2, 10) -
                element.find("img")[0].offsetLeft - initialPositionX;
              originY = touches[0].clientY -
                parseInt((touches[0].clientY - touches[1].clientY) / 2, 10) -
                element.find("img")[0].offsetTop - initialPositionY;

            }
          }

          if (mode === 'swipe') {
            //移动
            evt.preventDefault();
            moveX = touches[0].clientX - startX;
            moveY = touches[0].clientY - startY;

            positionX = initialPositionX + moveX;
            positionY = initialPositionY + moveY;

            transformElement();

            //左右有空余，左右间距相同，禁止上下滑动
            if (leftX > 0 && rightX > 0) {
              positionX = 0;
              transformElement();
            }
            //上下都有空余，禁止左右滑动
            if (topY > 0 && bottomY > 0) {
              positionY = 0;
              transformElement();
            }



          } else if (mode === 'pinch') {
            //缩放
            evt.preventDefault();
            distance = getDistance(touches);
            relativeScale = distance / initialDistance;

            //


            scale = relativeScale * initialScale;

            positionX = originX * (1 - relativeScale) + initialPositionX + moveX;
            positionY = originY * (1 - relativeScale) + initialPositionY + moveY;

            transformElement();
            positionX = 0;
            positionY = 0;
            transformElement();
          }



          //console.info(leftX, topY, rightX, bottomY);
        }

        /**
         * @param {object} 点击结束
         */
        function touchendHandler(evt) {
          //console.info("图片大小", elWidth, elHeight);
          //console.info("容器大小", outWidth, outHeight);

          //console.info("touch end");
          var touches = evt.originalEvent ? evt.originalEvent.touches : evt.touches;

          if (mode === '' || touches.length > 0) {
            return;
          }
          //缩放比例小于原比例
          if (scale < 1) {

            scale = 1;
            positionX = 0;
            positionY = 0;

          } else if (scale > maxScale) {
            //缩放比例过大
            scale = maxScale;
            relativeScale = scale / initialScale;
            positionX = originX * (1 - relativeScale) + initialPositionX + moveX;
            positionY = originY * (1 - relativeScale) + initialPositionY + moveY;

          }

          var leftX = positionX - elWidth * scale / 2 + outWidth / 2;
          var rightX = outWidth - (leftX + elWidth * scale);
          var topY = positionY - elHeight * scale / 2 + outHeight / 2;
          var bottomY = outHeight - (topY + elHeight * scale);

          if (leftX > 0 && rightX < 0) {
            //leftX=0;
            positionX = elWidth * scale / 2 - outWidth / 2;
            transformElement();
          } else if (leftX < 0 && rightX > 0) {
            //rightX=0;
            positionX = outWidth / 2 - elWidth * scale / 2;
            transformElement();
          }
          if (topY < 0 && bottomY > 0) {
            positionY = outHeight / 2 - elHeight * scale / 2;

            transformElement();
          } else if (topY > 0 && bottomY < 0) {
            positionY = elHeight * scale / 2 - outHeight / 2;
            transformElement();
          }


          leftX = positionX - elWidth * scale / 2 + outWidth / 2;
          rightX = outWidth - (leftX + elWidth * scale);
          topY = positionY - elHeight * scale / 2 + outHeight / 2;
          bottomY = outHeight - (topY + elHeight * scale);
          //console.info(leftX, rightX, topY, bottomY);
          if (topY > 0 && bottomY > 0) {
            //让上下边距相同，只允许左右滑动
            //console.info(1);
            positionY = 0;
            transformElement();
          }
          if (leftX > 0 && rightX > 0) {
            //console.info(2);
            positionX = 0;
            transformElement();
          }
          leftX = positionX - elWidth * scale / 2 + outWidth / 2;
          rightX = outWidth - (leftX + elWidth * scale);
          topY = positionY - elHeight * scale / 2 + outHeight / 2;
          bottomY = outHeight - (topY + elHeight * scale);
          //console.info(leftX, rightX,topY, bottomY);
          transformElement(0.1);
          mode = '';

        }

        /**
         * @param {Array} 双指touch位置
         * @return {number}
         */
        function getDistance(touches) {
          var d = Math.sqrt(Math.pow(touches[0].clientX - touches[1].clientX, 2) +
            Math.pow(touches[0].clientY - touches[1].clientY, 2));
          return parseInt(d, 10);
        }

        /**
         * @param {number} 动画时间
         */
        function transformElement(duration) {
          //console.info("transform");
          var transition = duration ? 'all cubic-bezier(0,0,.5,1) ' + duration + 's' : '';
          var matrixArray = [scale, 0, 0, scale, positionX, positionY];
          var matrix = 'matrix(' + matrixArray.join(',') + ')';

          element.find("img").css({
            '-webkit-transition': transition,
            transition: transition,
            '-webkit-transform': matrix + ' translate3d(0,0,0)',
            transform: matrix
          });
        }
        /****************************************** 图片缩放功能结束****************************/

      },

      post: function postLink(scope, element, attrs, controller) {}
    }
  };
  return comImageBox;
}]);
//自定义指令
APP.directive('myfocus', function ($timeout, $parse) {
  return {
    link: function (scope, element, attrs) {
      var model = $parse(attrs.myfocus);
      scope.$watch(model, function (value) {
        if (value === true) {
          $timeout(function () {
            element[0].focus();
          });
        } else if (value === false) {
          $timeout(function () {
            element[0].blur();
          });
        }
      });
    }
  };
});
//富文本过滤
APP.filter("trusted", ["$sce", function ($sce) {
  return function (html) {
    if (typeof html == 'string')   //判断类型为字符串
      return $sce.trustAsHtml(html);
    return html;
  }
}]);


APP.controller('NoteDetailsController', ['ionicDatePicker','$localstorage','CirclePageService','HomePageService','$scope','$ionicHistory','$rootScope', '$compile', '$state', '$ionicModal', '$stateParams',
  '$http', 'NoteDetailsService', '$ionicLoading','$ionicPopup', '$ionicScrollDelegate', 'ApplyCircleService', '$timeout', '$ionicActionSheet', 'PopupService', 'UrlService', 'UserService','CreditService','PlatformService','$location',
  function (ionicDatePicker,$localstorage,CirclePageService,HomePageService,$scope,$ionicHistory,$rootScope,$compile, $state, $ionicModal, $stateParams, $http, NoteDetailsService, $ionicLoading,$ionicPopup,
            $ionicScrollDelegate, ApplyCircleService, $timeout, $ionicActionSheet, PopupService, UrlService, UserService, CreditService,PlatformService,$location) {

    stop_browser_behavior: false

    self.touchStart = function(e) {
      self.startCoordinates = getPointerCoordinates(e);

      if ( ionic.tap.ignoreScrollStart(e) ) {
        return;
      }

      if( ionic.tap.containsOrIsTextInput(e.target) ) {
        // do not start if the target is a text input
        // if there is a touchmove on this input, then we can start the scroll
        self.__hasStarted = false;
        return;
      }

      self.__isSelectable = true;
      self.__enableScrollY = true;
      self.__hasStarted = true;
      self.doTouchStart(e.touches, e.timeStamp);
      // e.preventDefault();
    };


    /** 变量定义 **/
    $scope.isDisplay = false;
    $scope.inputShow = true;
    $scope.praiseNum = {};//点赞数收藏数
    $scope.commentId = '';//被回复人的id
    $scope.circleId;//接收上个页面的id
    $scope.circleDetail;//用来存储返回的贴子详情数据
    $scope.commentList;//评论
    $scope.products = '';//关联产品
    $scope.iconImageData = [];//存储本地图片path
    $scope.imgUrlList = [];//存储返回的url地址
    $scope.isImage=false;
    $scope.showBigImg =false;
    $scope.showBac=false;
    $scope.imgString='';
    $scope.isPublishImage=false;
    $scope.imgA=[];
    $scope.showBigBac=false;
    $scope.shanList='';//打赏列表
    $scope.commentIndex=1;
    $scope.commentWords = {//弹框回复评论
      words: ''
    };
    $scope.shanNum=[
      {
        num:1,
        isChecked:false
      },
      {
        num:5,
        isChecked:false
      },
      {
        num:10,
        isChecked:false
      },
      {
        num:20,
        isChecked:false
      },
      {
        num:50,
        isChecked:false
      },
      {
        num:100,
        isChecked:false
      },
    ]
    // 回复框
    $scope.pinglunis = false;
    $scope.topicheight = 0;
    $scope.comment = {text: '', rows: 1};//输入的评论内容

    $scope.noteDetail = {
      reply: "说点什么"
    };

    $scope.$watch('noteDetail.reply', function (newValue, oldValue, context) {
      console.log('原来字符的长度---->' + oldValue.length);
      console.log('新的字符的长度---->' + newValue.length);

    });




    /** 方法 **/
    //返回
    $scope.goBack = function () {
      // if($rootScope.backgo=='publish'){
        // $scope.$ionicGoBack(-2);
        // $state.go('circlePage',{circleId: $scope.circleDetail.topicId});
      //   $rootScope.backgo='';
      // }else{
        if($scope.circleDetail.topicId == 662){
          $state.go('circlePage',{circleId:662})
        }else if($scope.circleDetail.topicId == 665){
          $state.go('circlePage',{circleId:665})
        }else{
          $scope.$ionicGoBack();
          $rootScope.nextPageBefore = 'noteDetails';
        }
      // }
      // $ionicHistory.goBack();
    };
    //分享
    $scope.goshare = function () {
      if (!UserService.getUser().mid) {
        $state.go('login');
        return;
      }
      $scope.showShare = !$scope.showShare;
      $scope.isDisplay = false;
      NoteDetailsService.getShop().success(function(response){
        if(response.success&&response.data){
          $scope.shareUserId=$scope.userId;
        }else{
          $scope.shareUserId=null;
        }
      })
    };
    //进入到所在圈子页
    $scope.inCirclePage = function (id) {
      $state.go('circlePage', {circleId: id});
    };
    //进入个人主页
    $scope.inPersonalPage = function (code) {
      if (code != 000000000) {
        if(code == UserService.getUser().mid){
          $state.go('personalHomepageMe');
        } else {
          $state.go('personalHomepageHe', {othersId: code});
        }
      }
    };
    //进入小店
    $scope.goShop = function () {
      $state.go('myStore', {storeId: $scope.userId, shareStoreId: ''});
    };
    // 跳信息页
    $scope.jumpMsg = function () {
      $state.go('ClassifyMessageCenter');
    };

    $scope.isClick = function () {
      $scope.isDisplay = !$scope.isDisplay;
    };


    /*点击放大照片*/
    // $scope.showLarge2 = function (img,index) {
    //   console.log('index',index);
    //   var imgHeight = document.getElementById(img).height;
    //   console.log('imgHeight',imgHeight);
    //   if (imgHeight < window.screen.height) {
    //     $scope.shortImgHeight = {
    //       "height":100 + '%'
    //     };
    //   } else {
    //     $scope.shortImgHeight = '';
    //   }
    //   $scope.biggerImgUrl = img;
    //   $scope.biggerPictureModal.show();
    //   console.log('window.screen.height',window.screen.height);
    //   console.log('shortImgHeight',$scope.shortImgHeight);
    // };
    // $scope.hideLarge = function () {
    //   $scope.biggerPictureModal.hide();
    // };
    //
    // document.showLarge = function (img) {
    //   var imgHeight = document.getElementById(img).height;
    //   console.log('imgHeight',imgHeight);
    //   if (imgHeight < window.screen.height) {
    //     $scope.shortImgHeight = {
    //       "height":100 + '%'
    //     };
    //   } else {
    //     $scope.shortImgHeight = '';
    //   }
    //   $scope.biggerImgUrl = img;
    //   $scope.biggerPictureModal.show();
    //   console.log('window.screen.height',window.screen.height);
    //   console.log('shortImgHeight',$scope.shortImgHeight);
    // };
    //保存图片
    $scope.downLoadPhoto = function (url) {
      console.log('进去了没');
      console.log(url);
      // console.log('scope.Url',scope.Url);
      // $scope.photoUrl = scope.Url;
      $scope.photoUrl = $rootScope.picBigUrl;
      console.log($rootScope.picBigUrl);
      if(!$rootScope.isApp) {
        console.log('此功能在APP使用');
        return;
      }
      if ($rootScope.isIOS) {//iOS 系统
        console.log('开始保存');

        $ionicActionSheet.show({
          buttons: [
            {text: '保存图片到本地'}
          ],
          cancelText: '取消',
          cancel: function () {
            // 这里添加取消代码
          },
          buttonClicked: function () {
            $rootScope.$broadcast('LOADING:SHOW');
            cordova.plugins.saveToPhotoAlbum.save($rootScope.picBigUrl, function (nativeURL) {
              console.log(nativeURL);
              PopupService.showToast('保存成功');
            }, function (err) {
              console.error(err);
              PopupService.showToast('保存失败');
            });
          }
        });

      } else {
        console.log('scope.Url',$rootScope.picBigUrl);
        $ionicActionSheet.show({
          buttons: [
            {text: '保存图片到本地'}
          ],
          cancelText: '取消',
          cancel: function () {
            // 这里添加取消代码
          },
          buttonClicked: function () {
            $rootScope.$broadcast('LOADING:SHOW');

            var fileTransfer = new FileTransfer();
            var uri = encodeURI($scope.photoUrl);
            fileTransfer.download(
              uri,
              cordova.file.externalRootDirectory + 'DCIM/Camera/' + new Date().getTime() + ".jpg",
              function (entry) {
                $rootScope.$broadcast('LOADING:HIDE');
                console.log(entry);
                console.log('保存成功');
                PopupService.showToast('保存成功');
              },
              function (error) {
                $rootScope.$broadcast('LOADING:HIDE');
                PopupService.showToast('保存失败，请稍后再试');

                console.log("download error source ", error.source);
                console.log("download error target ", error.target);
                console.log("download error code", error.code);
                console.log("error", error);
              },
              false,
              {
                headers: {
                  "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                }
              }
            );
            console.log('1222334');
            return true;
          }
        });
      }
    };
    $scope.bigvideo=function($event){
      $rootScope.globalConstant.showvideo=true;
      $timeout(function(){
        $('.video-src1').attr('src',$scope.video);
      },100)
      
      
    }
    $scope.hideVideo=function($event){
      console.log($event);
      $event.target.previousElementSibling.pause();
      $rootScope.globalConstant.showvideo=false;
    }
    $scope.playing=function($event){
       console.log($event);
       $event.target.style.display='none';
       $event.target.nextElementSibling.play();
       $scope.targetv=$event.target.nextElementSibling;
       $scope.targetv.addEventListener("ended",function(){
          // console.log("结束");
          $event.target.style.display='block';
      })
     }



    //修改话题
    $scope.editTopic = function () {
      if($scope.circleDetail.isReward==1){
        if($scope.circleDetail.rewardStatus==1){
          PopupService.showToast('该悬赏贴已关闭，不能修改');
        }else if($scope.commentList.length>0){
          PopupService.showToast('该悬赏贴已有评论，不能修改');
        }else{
          $state.go('publishEdit', {topicId: $scope.circleDetail.topicId, noteId: $scope.circleId, isShortStory: $scope.ifShort,topicStyle:2});
        }
      }else if($scope.video){
        $state.go('publishEdit', {topicId: $scope.circleDetail.topicId, noteId: $scope.circleId, isShortStory: $scope.ifShort,topicStyle:3})
      }else{
        $state.go('publishEdit', {topicId: $scope.circleDetail.topicId, noteId: $scope.circleId, isShortStory: $scope.ifShort,topicStyle:1});
      }
      
    };
    //评论弹框
    $scope.showCommentView = function (id) {
      // 一个精心制作的自定义弹窗
      $scope.commentId = id;
      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="commentWords.words" class="bg-background">',
        title: 'Enter Wi-Fi Password',
        subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [
          {text: '取消'},
          {
            text: '<b>提交</b>',
            type: 'button-positive',
            onTap: function () {
              // myPopup.close();
              if ($scope.isOne) {
                $scope.isOne = false;
                $scope.insertComments();
              }
              // $scope.insertComments();
              // alert($scope.commentWords.words);
            }
          }
        ]
      });
      $timeout(function () {
        // myPopup.close();
      }, 3000);
    };
    //评论
    $scope.isInputShow = function () {
      $scope.inputShow = !$scope.inputShow;
    };
    //评论的显示隐藏
    $scope.pinglunshow = function () {
      var scroll = $ionicScrollDelegate.$getByHandle('pinglun');
      var height = scroll.getScrollPosition();
      var top = height.top;
      //console.log(top);
      var totop = window.innerHeight - 118;
      //获取高度值
      $scope.topicheight = document.getElementById('topicxiang').clientHeight - totop;
      // console.log($scope.topicheight);
      $timeout(function () {
        $scope.pinglunis = top > $scope.topicheight;
      }, 200);

    };

    /*评论添加图片*/
    $scope.addImage = function () {
      $ionicActionSheet.show({
        buttons: [
          {text: '<b>拍照</b>'},
          {text: '<b>从相册选取</b>'}
        ],
        // destructiveText: 'Delete',
        titleText: '照片选取方式',
        cancelText: '取消',
        buttonClicked: function (index) {
          if (index == 0) {
            navigator.camera.getPicture(getSuccess, getFail, {
              quality: 50,
              destinationType: Camera.DestinationType.FILE_URI,
              saveToPhotoAlbum: false,
              allowEdit: true
            });
            function getSuccess(imageData) {
              console.log('success');
            }

            function getFail() {
              console.log('failure');
            }

            return true;
          } else if (index == 1) {
            navigator.camera.getPicture(getSuccessTwo, getFail, {
              quality: 50,
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
              allowEdit: true
              //targetWidth: 720,
              //targetHeight: 720
            });
            function getSuccessTwo(imageData) {
              console.log('successTwo');
            }

            return true;
          }
        }
      })
    };

    //消息显示隐藏
    $scope.xiaoxishow = function () {
      $scope.xxshow = ($scope.count.count != 0);
      $scope.isshow = !$scope.isshow;
      $scope.xiaoxis = !$scope.xiaoxis;
      $scope.shuxiaoxi = !$scope.shuxiaoxi;


    };
    //点赞方法
    $scope.favorite = function () {
      var pushId = {
        id: $scope.circleId
      };
      NoteDetailsService.pushPraise(pushId)
        .success(function (response) {

        });
    };
    //获取贴子详情
    $scope.getCircleDetails = function () {
      var acceptId = {
        id: $scope.circleId
      };
      NoteDetailsService.getCircleDetails(acceptId)
        .success(function (response) {
          $scope.circleDetail = response.data;
          if($scope.circleDetail.topicId == 662||$scope.circleDetail.topicId == 665){
            $scope.circleIDIF=true;
            if($scope.circleDetail.topicId == 662){
              CirclePageService.getCircleLink('','','1')
                .success(function(res){
                  if(res.success){
                    $scope.circleUrl=res.data;
                  }
    
                })
            }else if($scope.circleDetail.topicId == 665){
              CirclePageService.getCircleLink('','','3')
                .success(function(res){
                  if(res.success){
                    $scope.circleUrl=res.data;
                  }
    
                })
            }
          }
          console.log($scope.circleDetail.storyContent)
          if($scope.circleDetail.mediaInfo){
            $scope.video=$scope.circleDetail.mediaInfo[0].url;
            $timeout(function(){
              $('.video-src').attr('src',$scope.video);
              $('.video-src').attr('poster',$scope.circleDetail.mainImg);
            },200)
            
          }
          if($scope.circleDetail.rewardEndTime){
            $scope.circleDetail.rewardEndTime=$scope.circleDetail.rewardEndTime.substring(0,10);
          }
          if($scope.circleDetail.rewardComment){
            $scope.circleDetail.rewardComment[0].imgaa=$scope.circleDetail.rewardComment[0].commentImgs.split(",");
            // }

          }
          if($scope.circleDetail.dataTypeNew==1){
            if($scope.circleDetail.storyImgs){
              $scope.storyCommityImgs=$scope.circleDetail.storyImgs.split(',');
              console.log($scope.storyCommityImgs);
            }
          }
          
          $scope.imgArr = [];
          for (var i = 1;i <= $scope.circleDetail.mainImgArray.length;i ++) {
            $scope.imgArr.push(i);
            console.log($scope.imgArr);
          }
          console.log('circleDetail', $scope.circleDetail);
          $scope.whichPersonType();//获取用户身份
          if (($scope.ifShort == 1) && $scope.circleDetail.productId) {
            $scope.productConnect();//获取关联产品
          }

          // var uploadInfo = $scope.circleDetail.storyContent;
          // $scope.ele = $compile(uploadInfo)($scope);
          // angular.element('.full-text').append($scope.ele);
          $scope.getA();


        });
    };
    //关注圈主
    $scope.follow = function (param) {
      if (param == 0) {
        var isFollow = {
          id: $scope.circleDetail.userCode,
          isFollow: 1
        };
        NoteDetailsService.followNote(isFollow)
          .success(function (response) {
            if (response.success == true) {
              $scope.circleDetail.isFolled = 1;
              $scope.alreadyFollow = true;
              $timeout(function () {
                $scope.alreadyFollow = false;
              }, 1000);
            }else if (response.errorCode==-2000){
              PopupService.showToast(response.message);
              $rootScope.loginIsAccord2 = true;
            }
          });
      } else if (param == 1) {
        var isFollow = {
          id: $scope.circleDetail.userCode,
          isFollow: 0
        };
        NoteDetailsService.followNote(isFollow)
          .success(function (response) {
            if (response.success == true) {
              $scope.circleDetail.isFolled = 0;
            }else if (response.errorCode==-2000) {
              PopupService.showToast(response.message);
              $rootScope.loginIsAccord2 = true;
            }
          });
      }
    };
    //获取评论
    $scope.getComment = function () {
      $scope.commentIndex=1;
      //获取 uuid
      var uuid = getCookie('loginId');
      console.log(uuid);
      var userCommentAgent = window.navigator.userAgent.toLowerCase();
      //微信浏览器
      var isCommentWeChat = userCommentAgent.match(/MicroMessenger/i) == 'micromessenger';
      var params = {
        pageIndex: 1,
        pageSize: 10,
        id: $scope.circleId,
        userCode: isCommentWeChat ? $scope.weChatOpenId : uuid
      };
      NoteDetailsService.getComments(params)
        .success(function (response) {
          console.log(response);
          $scope.commentNumbers = response.totalCount;//评论总条数
          $scope.commentList = response.data.list;
          if($scope.commentNumbers>10){
            $scope.hasmore=true;
          }
          $scope.imgString='';
          $scope.imgA=[];
          for(var i=0;i<$scope.commentList.length;i++){
            $scope.commentList[i].ischecked=false;
            if($scope.commentList[i].commentImgs){
              $scope.imgString=$scope.commentList[i].commentImgs;
              console.log($scope.imgString);
              $scope.imgA=$scope.imgString.split(",");
              console.log($scope.imgA)
              $scope.commentList[i].imgaa=$scope.imgA;
            }

          }
          // $scope.commentList[0].commentImgs.split(',')
          console.log($scope.commentList)
          $ionicScrollDelegate.resize();
        });
    };
    //评论分页获取
    $scope.loadMore = function () {
      $scope.commentIndex=$scope.commentIndex+1;
      //获取 uuid
      var uuid = getCookie('loginId');
      console.log(uuid);
      var userComMoreAgent = window.navigator.userAgent.toLowerCase();
      //微信浏览器
      var isComMoreWeChat = userComMoreAgent.match(/MicroMessenger/i) == 'micromessenger';
      var paramLoad = { //上拉获取消息传参
        pageIndex: $scope.commentIndex,
        pageSize: 10,
        id: $scope.circleId,
        userCode: isComMoreWeChat ? $scope.weChatOpenId : uuid
      };
      NoteDetailsService.getComments(paramLoad)
        .success(function (response) {
          console.log(response);
          $scope.commentNumbers = response.totalCount;//评论总条数
          $scope.commentList = $scope.commentList.concat(response.data.list);
          console.log($scope.commentList.length);
          if($scope.commentNumbers>$scope.commentList.length){
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }else{
            $scope.hasmore=false;
            PopupService.showToast('没有更多评论了');
          }
          $scope.imgString='';
          $scope.imgA=[];
          for(var i=0;i<$scope.commentList.length;i++){
            $scope.commentList[i].ischecked=false;
            if($scope.commentList[i].commentImgs){
              $scope.imgString=$scope.commentList[i].commentImgs;
              console.log($scope.imgString);
              $scope.imgA=$scope.imgString.split(",");
              console.log($scope.imgA)
              $scope.commentList[i].imgaa=$scope.imgA;
            }

          }
        });
    };

    //获取焦点
    $scope.getFocus = function (id, name,$event) {
      event.stopPropagation()
      for(var i=0;i<$scope.commentList.length;i++){
          $scope.commentList[i].ischecked=false;
        }
      // $scope.isFocus = true; //获取焦点
      // document.getElementById('inputId').blur();
      // setTimeout(function () {
      //     $scope.commontId = id;
      //     $scope.toSomeone = '回复给：' + name;
      // }, 200);
      $scope.commentWords.words='';
      $scope.iconImageData=[];
      $scope.isPublishImage=true;
      $scope.showBac=true;
      $scope.commontId = id;
      $scope.toSomeone = '回复给：' + name;
      console.log('获取焦点');
      console.log($scope.toSomeone);
      console.log('回复给谁' + name);
      setTimeout(function () {
        document.getElementById('inputId').focus();
      }, 200);
    };
    // var productsss=document.getElementById('inputId');
    // productsss.addEventListener('touchend',function(){
    //   console.log('dhcdhyusvgdsy');
    $scope.focuss=function(){
      HomePageService.isWdHost()
      .success(function (res) {
        $rootScope.isWdHost = res.data.isHost;
        if($rootScope.isWdHost==-1){//如果没有登录 跳转到登录页面
          $state.go('login');
        }else{
          // $scope.images=false;
          // $scope.haierImg=false;
          // $scope.shunguangImg=false;
          // console.log(333);
          // $scope.isPublishImage=true;
          // $scope.showBac=true;
          // if($scope.iconImageData.length>0){
          //   $scope.isImage=true;
          // }
        }
      })
    }
    $scope.deleteImg = function (index) {
      $scope.iconImageData.splice(index, 1);
      // $scope.imgUrlList.splice(index, 1);
    };
    /*点击放大照片*/
    $scope.showLarge = function (img) {
      $scope.showBigBac=true;
      $scope.showBigImg = true;
      $scope.Url = img;
    };
    $scope.closeBigImg=function(){
      $scope.showBigImg = false;
      $scope.showBigBac=false;
    }
    $scope.closeImg = function () {
      $scope.images=false;
      $scope.isImage=false;
      $scope.isPublishImage=false;
      $scope.showBac=false;
    };

    /*添加相片方法*/
    $scope.imgPush = function (index) {
      console.log(index);
      $scope.isImage=true;
      //相片最多添加9张，超出提示
      if ($scope.iconImageData.length >= 9) {
        PopupService.showToast('最多添加9张');

        return;
      }
      //选图方法
      $ionicActionSheet.show({
        buttons: [
          {text: '<b>拍照</b>'},
          {text: '<b>从相册选取</b>'}
        ],
        // destructiveText: 'Delete',
        titleText: '照片选取方式',
        cancelText: '取消',
        buttonClicked: function (index) {
          if (index == 0) {
            navigator.camera.getPicture(getSuccess, getFail, {//拍照
              quality: 50,
              destinationType: Camera.DestinationType.FILE_URI,
              saveToPhotoAlbum: true,
              allowEdit: true
            });
            function getSuccess(imageData) {
              var a = {imgUrl: imageData};
              //   $scope.iconImageData.push(a);
              $timeout(function () {
                $scope.iconImageData.push(a);
                $scope.existPhoto = true;
              }, 200);

            }

            function getFail() {
              console.log('get fail ---');
            }

            return true;
          } else if (index == 1) {

            console.log('从相册中获取');

            var pictureCounts = 9 - $scope.iconImageData.length;
            console.log(pictureCounts);
            window.imagePicker.getPictures(
              function (results) {
                console.log(results);
                for (var i = 0; i < results.length; i++) {

                  var img = {
                    imgUrl: results[i]
                  };
                  // $timeout(function () {
                  $scope.iconImageData.push(img);
                  console.log($scope.iconImageData);


                }
                $scope.$apply();
              }, function (error) {
                // console.log('Error: ' + error);
              }, {
                maximumImagesCount: pictureCounts,
                width: 800,
                quality: 50
              }
            );

            return true;
          }
        }

      })
    };
    $scope.insertCom=function($event){
      HomePageService.isWdHost()
        .success(function (res) {
          $rootScope.isWdHost = res.data.isHost;
          if($rootScope.isWdHost==-1){//如果没有登录 跳转到登录页面
            $state.go('login');
          }else{
            if(window.cordova){
              $rootScope.gio.track('comment', {circleID:$scope.circleDetail.topicId});
              $rootScope.gio.track('active', {circleID:$scope.circleDetail.topicId});
            }
            console.log($event)
            if($event.target.nodeName=="IMG"){
              if ($scope.commontId) {
                var params = {
                  commentId: $scope.commontId,
                  commentImgs:$event.target.src,
                  id: $scope.circleId
                };
                $scope.insertCommentOK(params);
              } else {
                var params = {
                  commentImgs:$event.target.src,
                  id: $scope.circleId
                };
                $scope.insertCommentOK(params);
              }
            }
          }
        })
    }
    //插入评论
    $scope.insertComments = function () {
      HomePageService.isWdHost()
        .success(function (res) {
          $rootScope.isWdHost = res.data.isHost;
          if($rootScope.isWdHost==-1){//如果没有登录 跳转到登录页面
            $state.go('login');
          }else{
            if(window.cordova){
              $rootScope.gio.track('comment', {circleID:$scope.circleDetail.topicId});
              $rootScope.gio.track('active', {circleID:$scope.circleDetail.topicId});
            }
            var a=0;

            if ($scope.commentWords.words) {
              var keywords = {
                keywords: $scope.commentWords.words
              };
              ApplyCircleService.judgeWords(keywords)
                .success(function (response) {
                  if (response.message == '没有敏感词') {
                    if($scope.iconImageData.length == 0) {
                      $scope.iconImageData = [];
                      $scope.imgUrlList = [];
                      $scope.publishTopic();
                    } else {
                      angular.forEach($scope.iconImageData,function (data,index) {
                        var win = function (r) {
                          $ionicLoading.hide();
                          console.log('上传成功');
                          a++;
                          var jsonResp = JSON.parse(r.response);//图片接口返回的图片地址
                          var iconImageR = jsonResp.urls;
                          // $scope.imgUrlList.push(iconImageR);//存储返回的图片地址
                          $scope.imgUrlList[index] = iconImageR;
                          // $scope.publishInfo.mainImg = $scope.imgUrlList.toString();//转化成string类型传给接口
                          if (a == $scope.iconImageData.length) {
                            console.log('最后一张图');
                            $scope.publishTopic();
                          }
                        };
                        var fail = function (error) {
                          console.log('上传失败');
                          $ionicLoading.hide();
                        };
                        //调用上传图片接口
                        var options = {};
                        var uploadPhoto = new FileTransfer();
                        console.log(uploadPhoto);
                        uploadPhoto.upload(data.imgUrl, encodeURI(NoteDetailsService.uploadImage()), win, fail, options);
                      });
                    }

                  } else {
                    PopupService.showToast('存在敏感词', response.data);//提示接口返回的提示
                    $scope.commentWords.words = '';
                  }
                })
            } else {
              // $scope.isOne = true;
              PopupService.showToast('内容不能为空');
            }
          }
        })
    };
    $scope.nocommontId=function(){
      $scope.isDisplay=false;
      for(var i=0;i<$scope.commentList.length;i++){
          $scope.commentList[i].ischecked=false;
        }

      console.log($scope.commontId);
      // var a=$scope.commontId;
      if($scope.commontId){
        $scope.commontId = '';
        $scope.toSomeone = '';
        $scope.commentWords.words='';
        $scope.iconImageData=[];
      }

    }
    $scope.publishTopic=function(params){
      console.log($scope.imgUrlList);
      if ($scope.commontId) {
        var params = {
          comment: $scope.commentWords.words,
          commentId: $scope.commontId,
          commentImgs:$scope.imgUrlList.toString(),
          id: $scope.circleId
        };
        $scope.insertCommentOK(params);
      } else {
        var params = {
          comment: $scope.commentWords.words,
          commentImgs:$scope.imgUrlList.toString(),
          id: $scope.circleId
        };
        $scope.insertCommentOK(params);
      }

    }
    $scope.insertCommentOK=function(params){
      NoteDetailsService.insertComment(params)
                .success(function (response) {
                  $scope.getComment();
                  if (response.success == true) {
                    PopupService.showToast('回复成功');
                    $scope.commentWords.words = '';
                    $scope.commontId = '';
                    $scope.toSomeone = '';
                    $scope.iconImageData = [];
                    $scope.imgUrlList = [];
                    $scope.isImage=false;
                    $scope.isPublishImage=false;
                    $scope.showBac=false;
                    $scope.images=false;
                    $scope.haierImg=false;
                    $scope.shunguangImg=false;
                    // $scope.goldNum();
                  } else {
                    $timeout(function () {
                      PopupService.showToast(response.message);//因为没登录的时候去往登录页会弹这个框,所以注释掉了
                    }, 200);
                    $scope.commentWords.words = '';
                  }
                }).error(function (e) {
                PopupService.showToast('网络异常');
                $scope.commentWords.words = '';
              });
    }
    //获取 cookie
    function getCookie(name)
    {
      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg)) return unescape(arr[2]);
      else return null;
    }
    //贴子点赞
    $scope.topicPraise = function (id) {
      if(window.cordova){
        $rootScope.gio.track('like', {circleID:$scope.circleDetail.topicId});
        $rootScope.gio.track('active', {circleID:$scope.circleDetail.topicId});
      }
      var userLookAgent = window.navigator.userAgent.toLowerCase();
      //微信浏览器
      var isWeChat = userLookAgent.match(/MicroMessenger/i) == 'micromessenger';
      //获取 uuid
      var uuid = getCookie('loginId');
      console.log(uuid);
      var param = {
        id: id,
        noLoading: true,
        userCode: isWeChat ? $scope.weChatOpenId : uuid
      };
      console.log(param);
      NoteDetailsService.pushPraise(param)
        .success(function (response) {
          if (response.success == true) {
            $scope.isPraise = !$scope.isPraise;
            $scope.getStoryPraiseNum();
            // PopupService.showToast('点赞成功');
            console.log('点赞成功');
          }else{
            PopupService.showToast(response.message);
          }
        });
    };
    //贴子收藏
    $scope.topicFavorite = function (id) {
      var param = {
        id: id,
        noLoading: true
      };
      NoteDetailsService.topicFavorite(param)
        .success(function (response) {
          if (response.success == true) {
            $scope.isFavorite = !$scope.isFavorite;
            // PopupService.showToast('收藏成功');
            $scope.getStoryPraiseNum();

            console.log('收藏成功');
          } else if (response.errorCode==-2000){
            PopupService.showToast(response.message);
            $rootScope.loginIsAccord2 = true;
          }else{
            PopupService.showToast(response.message);
          }
        });
    };
    //跳转链接
      $scope.goToScore=function ($event) {
        if($event.target.tagName=='IMG'){
          if(!$scope.noreload){
            $scope.showBigImage($event);
          }
        }
        console.log($event);
        $('.longtopic a').addClass('atopic');
        $('.longtopic a').removeAttr('href');
        $('.noteContent a').removeAttr('href');
        // $('.longtopic a').attr('href','');
        
        if($event.target.className=='linklink dot-block'){
          if($event.target.parentNode.parentNode.attributes['data-a']){
            var url=$event.target.parentNode.parentNode.attributes['data-a'].value;
            // $scope.tolink(url);
            console.log(url)
            // if(url.indexOf('#')>0){
            //   var urlk=url.indexOf('#');
            //   var urlOk=url.substring(urlk);
            //   console.log($event.target.parentNode.parentNode.setAttribute('href',urlOk))
            // }else{
              $scope.tolink(url);
            // }
          }else{
            console.log(url)
            var url=$event.target.outerText;
            // if(url.indexOf('#')>0){
            //   var urlk=url.indexOf('#');
            //   var urlOk=url.substring(urlk);
            //   console.log($event.target.parentNode.parentNode.setAttribute('href',urlOk))
            // }else{
              $scope.tolink(url);
            // }
          }


        }else if($event.target.className=='all-to'){
          if($event.target.parentNode.attributes['data-a']){
            var url=$event.target.parentNode.attributes['data-a'].value;
            // if(url.indexOf('#')>0){
            //   var urlk=url.indexOf('#');
            //   var urlOk=url.substring(urlk);
            //   console.log($event.target.parentNode.setAttribute('href',urlOk))
            // }else{
              $scope.tolink(url);
            // }
            // $scope.tolink(url);
          }else{
            var url=$event.target.outerText;
            // if(url.indexOf('#')>0){
            //   var urlk=url.indexOf('#');
            //   var urlOk=url.substring(urlk);
            //   console.log($event.target.parentNode.setAttribute('href',urlOk))
            // }else{
              $scope.tolink(url);
            // }
            // $scope.tolink(url);
          }

        }else if($event.target.className=='atopic'){
          if($event.target.attributes['data-a']){
            var url=$event.target.attributes['data-a'].value;
            // $scope.tolink(url);
            // if(url.indexOf('#')>0){
            //   var urlk=url.indexOf('#');
            //   var urlOk=url.substring(urlk);
            //   console.log($event.target.setAttribute('href',urlOk))
            // }else{
              $scope.tolink(url);
            // }
          }else if($event.target.attributes['dataa']){
            var url=$event.target.attributes['dataa'].value;
            console.log(url)
            console.log(url.indexOf('#'))
            // if(url.indexOf('#')>0){
            //   var urlk=url.indexOf('#');
            //   var urlOk=url.substring(urlk);
            //   console.log($event.target.setAttribute('href',urlOk))
            // }else{
              $scope.tolink(url);
            // }
          }

        }else if($event.target.parentNode.className=='atopic'){
          if($event.target.parentNode.attributes['data-a']){
            var url=$event.target.parentNode.attributes['data-a'].value;
            $scope.tolink(url);
          }else if($event.target.parentNode.attributes['dataa']){
            var url=$event.target.parentNode.attributes['dataa'].value;
            console.log(url)
            console.log(url.indexOf('#'))
            // if(url.indexOf('#')>0){
            //   var urlk=url.indexOf('#');
            //   var urlOk=url.substring(urlk);
            //   console.log($event.target.parentNode.setAttribute('href',urlOk))
            // }else{
              $scope.tolink(url);
            // }
          }
        }else if($event.target.parentNode.parentNode.className=='atopic'){
          if($event.target.parentNode.parentNode.attributes['data-a']){
            var url=$event.target.parentNode.parentNode.attributes['data-a'].value;
            $scope.tolink(url);
          }else if($event.target.parentNode.parentNode.attributes['dataa']){
            var url=$event.target.parentNode.parentNode.attributes['dataa'].value;
            console.log(url)
            console.log(url.indexOf('#'))
            // if(url.indexOf('#')>0){
            //   var urlk=url.indexOf('#');
            //   var urlOk=url.substring(urlk);
            //   console.log($event.target.parentNode.parentNode.setAttribute('href',urlOk))
            // }else{
              $scope.tolink(url);
            // }
          }
        }else if($event.target.parentNode.parentNode.parentNode.className=='atopic'){
          if($event.target.parentNode.parentNode.parentNode.attributes['data-a']){
            var url=$event.target.parentNode.parentNode.parentNode.attributes['data-a'].value;
            $scope.tolink(url);
          }else if($event.target.parentNode.parentNode.parentNode.attributes['dataa']){
            var url=$event.target.parentNode.parentNode.parentNode.attributes['dataa'].value;
            console.log(url)
            console.log(url.indexOf('#'))
            // if(url.indexOf('#')>0){
            //   var urlk=url.indexOf('#');
            //   var urlOk=url.substring(urlk);
            //   console.log($event.target.parentNode.parentNode.parentNode.setAttribute('href',urlOk))
            // }else{
              $scope.tolink(url);
            // }
          }
        }else if($event.target.parentNode.parentNode.parentNode.parentNode.className=='atopic'){
          if($event.target.parentNode.parentNode.parentNode.parentNode.attributes['data-a']){
            var url=$event.target.parentNode.parentNode.parentNode.parentNode.attributes['data-a'].value;
            $scope.tolink(url);
          }else if($event.target.parentNode.parentNode.parentNode.parentNode.attributes['dataa']){
            var url=$event.target.parentNode.parentNode.parentNode.parentNode.attributes['dataa'].value;
            console.log(url)
            console.log(url.indexOf('#'))
            // if(url.indexOf('#')>0){
            //   var urlk=url.indexOf('#');
            //   var urlOk=url.substring(urlk);
            //   console.log($event.target.parentNode.parentNode.parentNode.parentNode.setAttribute('href',urlOk))
            // }else{
              $scope.tolink(url);
            // }
          }
        }else if($event.target.parentNode.parentNode.parentNode.parentNode.parentNode.className=='atopic'){
          if($event.target.parentNode.parentNode.parentNode.parentNode.parentNode.attributes['data-a']){
            var url=$event.target.parentNode.parentNode.parentNode.parentNode.parentNode.attributes['data-a'].value;
            $scope.tolink(url);
          }else if($event.target.parentNode.parentNode.parentNode.parentNode.parentNode.attributes['dataa']){
            var url=$event.target.parentNode.parentNode.parentNode.parentNode.parentNode.attributes['dataa'].value;
            console.log(url)
            console.log(url.indexOf('#'))
            // if(url.indexOf('#')>0){
            //   var urlk=url.indexOf('#');
            //   var urlOk=url.substring(urlk);
            //   console.log($event.target.parentNode.parentNode.parentNode.parentNode.parentNode.setAttribute('href',urlOk))
            // }else{
              $scope.tolink(url);
            // }
          }
        }else if($event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.className=='atopic'){
          if($event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.attributes['data-a']){
            var url=$event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.attributes['data-a'].value;
            $scope.tolink(url);
          }else if($event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.attributes['dataa']){
            var url=$event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.attributes['dataa'].value;
            console.log(url)
            console.log(url.indexOf('#'))
            // if(url.indexOf('#')>0){
            //   var urlk=url.indexOf('#');
            //   var urlOk=url.substring(urlk);
            //   console.log($event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.setAttribute('href',urlOk))
            // }else{
              $scope.tolink(url);
            // }
          }
        }
    };
    $scope.tolink=function(url){
      console.log(url)
      var u = navigator.userAgent;
          if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
            if (PlatformService.getPlatform() == 'APP') {
              cordova.InAppBrowser.open(url, '_system', 'location=yes');
            } else {
              window.open(url);
            }
          } else if (u.indexOf('iPhone') > -1) {
            if (PlatformService.getPlatform() == 'APP') {
              cordova.InAppBrowser.open(url, '_system', 'location=yes');
            } else {
              window.open(url);
            }
          } else {
            if (PlatformService.getPlatform() == 'APP') {
              cordova.InAppBrowser.open(url, '_system', 'location=yes');
            } else {
              window.open(url);
            }
          }
    }
    // $('.all-to').on('click',function(){
    //   console.log(345);
    //   $scope.goToScore();
    // })
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
       $scope.paddingtopClass = {
         "margin-top": "16px"
       };
       $scope.paddingtopClasscontent = {
         "top": "60px"
       }
     }else{
       $scope.paddingtopClass = {
         "margin-top": "0px"
       };
       $scope.paddingtopClasscontent = {
         "top": "44px"
       }
     }

    $scope.getA=function(){
      $timeout(function(){
        console.log(33)
      $(".detailEditor .editor a").html(function(index,html){
        if(this.attributes['data-a']){
          if(this.attributes['data-a'].value){
            this.setAttribute('href',this.attributes['data-a'].value)
          console.log(this.attributes['data-a'].value);
          var a=this.attributes['data-a'].value;
            var htt='<div class="all-to"><img class="imgimg" src="'+$scope.imgBaseURL+'/img/link.png"/><span class="linklink dot-block">'+a+'</span></div>'
            // this.href='';
            return htt;
          }
        }else{
          console.log(html)
          return html;
        }
        

      })
      
    },20);
    
      $timeout(function(){
        console.log('2233')
      $('.detailEditor .editor div').removeAttr('contenteditable');
      // $('.detailEditor .editor .imgHeight').css('height','auto');
      $('.detailEditor .editor div').addClass('copy');
      // $('.linklink').html(function(index,html){
      //         if(html.length>50){
      //           return html.substring(0,50)+'...';
      //         }
      // })
    },30);
    $timeout(function(){
      console.log($('.longtopic').html());
      $('.longtopic a').each(function(i){
        console.log($(this).attr('dataa'));
        if($(this).attr('dataa')){

        }else{
          $(this).attr('dataa',this.href);
        }
      })
    },100)
    $timeout(function(){
      $('.detailEditor .editor .imgHeight').css({'height':'auto',"width":"auto","background-image":"none"});
      $('.detailEditor .editor .imgHeight img').css({"width":"100%","display":"block"});
      $('.detailEditor .editor .imgHeight span').css({"display":"none"});
      $('.detailEditor .editor span').css('font-size','12px');
      
    },60)

    }

    $scope.topicShan=function(id){
      $scope.images=false;
      $scope.haierImg=false;
      $scope.shunguangImg=false;
      if($scope.circleDetail.isReward==1){
        PopupService.showToast('该话题是悬赏话题，不能被打赏');
      }else{
        $scope.showShan=true;
        $scope.goldNum();
        if(id){
          $scope.shanCommentId=id;
        }else{
          $scope.shanCommentId='';
          $scope.shanTopicId=$scope.circleId;
        }
      }


    }
    $scope.selectImg=function(){
      $scope.images=true;
      $scope.haierImg=true;
      $scope.shunguangImg=false;
      $scope.yearImg=false;
    }
    $scope.selectHaier=function(){
      $scope.haierImg=true;
      $scope.shunguangImg=false;
      $scope.yearImg=false;
    }
    $scope.selectshun=function(){
      $scope.haierImg=false;
      $scope.shunguangImg=true;
      $scope.yearImg=false;
    }
    $scope.selectYear=function(){
      $scope.haierImg=false;
      $scope.shunguangImg=false;
      $scope.yearImg=true;
    }
    $scope.deleteShan=function(){
      $scope.reward.num='';
      for(var i=0;i<$scope.shanNum.length;i++){
          $scope.shanNum[i].isChecked=false;
        }
        $scope.shanGoldNum='';
      $scope.showShan=false;
    }
    //评论操作
    $scope.clickMore=function(index){
      $scope.isDisplay=false;
      if($scope.commentList[index].ischecked){
        for(var i=0;i<$scope.commentList.length;i++){
          $scope.commentList[i].ischecked=false;
        }
      }else{
        for(var i=0;i<$scope.commentList.length;i++){
          $scope.commentList[i].ischecked=false;
        }
        $scope.commentList[index].ischecked=true;
      }

    }
    //跳转到打赏列表页
    $scope.toRewardList=function(){
      console.log($scope.circleId)
      $state.go('topicRewardList',{tipId:$scope.circleId})
    }
    //选择金币数
    $scope.selectGod=function(index){
      $scope.reward.num='';
      if($scope.shanNum[index].isChecked){
        for(var i=0;i<$scope.shanNum.length;i++){
          $scope.shanNum[i].isChecked=false;
        }
        $scope.shanGoldNum='';
      }else{
        for(var i=0;i<$scope.shanNum.length;i++){
          $scope.shanNum[i].isChecked=false;
        }
        $scope.shanNum[index].isChecked=true;
        $scope.shanGoldNum=$scope.shanNum[index].num;
      }
    }
    $scope.otherGoldNum=function(){
      for(var i=0;i<$scope.shanNum.length;i++){
          $scope.shanNum[i].isChecked=false;
      }
      $scope.shanGoldNum=$scope.reward.num;
    }
    //判断下载平台
    $scope.noticeDownload = function () {
      console.log('111', $rootScope.downAppUrl);
      if (!$rootScope.downAppUrl) {
        PopupService.showToast('不支持该手机');
      }
    };
    //评论点赞
    $scope.commentPraise = function (item, index) {
      console.log('点赞了');
      var userCommentAgent = window.navigator.userAgent.toLowerCase();
      //微信浏览器
      var isComWeChat = userCommentAgent.match(/MicroMessenger/i) == 'micromessenger';

      //获取 uuid
      var uuid = getCookie('loginId');
      console.log(uuid);
      var param = {
        commentId: item.id,
        noLoading: true,
        userCode: isComWeChat ? $scope.weChatOpenId : uuid
      };
      NoteDetailsService.commentPraise(param)
        .success(function (response) {
          if (response.success == true) {
            if($scope.circleDetail.rewardComment){
              if(item.id==$scope.circleDetail.rewardComment[0].id){
                $scope.circleDetail.rewardComment[0].commentPraiseNumberFlag = !$scope.circleDetail.rewardComment[0].commentPraiseNumberFlag;
                for(var i=0;i<$scope.commentList.length;i++){
                  if(item.id==$scope.commentList[i].id){
                    $scope.commentList[i].commentPraiseNumberFlag = !$scope.commentList[i].commentPraiseNumberFlag;
                  }
                }
              }
            }else{
              for(var i=0;i<$scope.commentList.length;i++){
                  if(item.id==$scope.commentList[i].id){
                    $scope.commentList[i].commentPraiseNumberFlag = !$scope.commentList[i].commentPraiseNumberFlag;
                  }
                }
            }
            
            $scope.getCommentPraiseNum(item, index);
            console.log('点赞成功');
          }else{
            PopupService.showToast(response.message);
          }
        });
    };
    //贴子详情点赞、收藏统计
    $scope.getStoryPraiseNum = function () {
      var userStoryPraiseAgent = window.navigator.userAgent.toLowerCase();
      //微信浏览器
      var isStoryPraiseChat = userStoryPraiseAgent.match(/MicroMessenger/i) == 'micromessenger';

      //获取 uuid
      var uuid = getCookie('loginId');
      console.log(uuid);
      var param = {
        id: $scope.circleId,
        noLoading: true,
        userCode: isStoryPraiseChat ? $scope.weChatOpenId : uuid
      };
      NoteDetailsService.getStoryPraise(param)
        .success(function (response) {
          $scope.praiseNum = response.data;
        });
    };
    //贴子详情评论点赞统计
    $scope.getCommentPraiseNum = function (item, index) {
      console.log('获取数量');
      var userCommentPraiseAgent = window.navigator.userAgent.toLowerCase();
      //微信浏览器
      var isCommentPraiseWeChat = userCommentPraiseAgent.match(/MicroMessenger/i) == 'micromessenger';
      //获取 uuid
      var uuid = getCookie('loginId');
      console.log(uuid);
      var param = {
        commentId: item.id,
        noLoading: true,
        userCode: isCommentPraiseWeChat ? $scope.weChatOpenId : uuid
      };
      NoteDetailsService.commentPraiseNum(param)
        .success(function (response) {
          if($scope.circleDetail.rewardComment){
            if(item.id==$scope.circleDetail.rewardComment[0].id){
                $scope.circleDetail.rewardComment[0].commentPraiseNumber = response.totalCount;
                for(var i=0;i<$scope.commentList.length;i++){
                  if(item.id==$scope.commentList[i].id){
                    $scope.commentList[i].commentPraiseNumber = response.totalCount;
                  }
                }
            }
          }else{
            for(var i=0;i<$scope.commentList.length;i++){
                  if(item.id==$scope.commentList[i].id){
                    $scope.commentList[i].commentPraiseNumber = response.totalCount;
                  }
                }
          }
          

        });
    };

    //startTime
    $scope.startTime=function(){
      if (PlatformService.getPlatform() == 'APP') {
        var options = {
          date: new Date(),
          mode: 'date',
          cancelButton: false,
          locale: "zh-Hans" // ios 时间控件已经中国化 todo  android
        };
        datePicker.show(options, function(date) {
          $timeout(function() {
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();

            var endTime=new Date(date);
            endTime.setDate(date.getDate()+7);
            var monthEnd=endTime.getMonth() + 1
            console.log(endTime)
            if(monthEnd<10){
              monthEnd='0'+monthEnd;
            }
            if (month < 10) {
              month = '0' + month;
            }
            if (day < 10) {
              day = '0' + day;
            }
            var startTime=year+ '-' + month + '-' + day;
            console.log(startTime)
            $scope.start=startTime;
            $scope.end=endTime.getFullYear() + '-' +monthEnd+'-'+endTime.getDate();
            
            
          }, 200);
        });
      } else {
        var ipObj1 = {
          inputDate: new Date(),
          weeksList: ['日', '一', '二', '三', '四', '五', '六'],
          monthsList: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          from: new Date(1900, 1, 1), //Optional
          // to: new Date(), //Optional
          mondayFirst: true, //Optional
          closeOnSelect: false, //Optional
          templateType: 'popup',
          setLabel: '设置',
          closeLabel: '关闭',
          dateFormat: 'yyyy-MM-dd',
          callback: function(val) { //Mandatory
              console.log('Return value from the datepicker popup is : ', new Date(val).getMonth() + 1);
              // console.log(val);
              var date1=new Date(val);
              $scope.startOk=new Date(val);
              var endTime=new Date(val);
              $scope.endOk=endTime;
              endTime.setDate(date1.getDate()+7);
              // console.log(endTime);
              var monthWeb = new Date(val).getMonth() + 1;
              var dayWeb = new Date(val).getDate();
              if (monthWeb < 10) {
                monthWeb = '0' + monthWeb;
              }
              if (dayWeb < 10) {
                dayWeb = '0' + dayWeb;
              }
              var starTime = new Date(val).getFullYear() + '-' + monthWeb + '-' + dayWeb;
              $scope.start=starTime;
              $scope.end=endTime.getFullYear() + '-' +(endTime.getMonth() + 1)+'-'+endTime.getDate();
              

            } //Optional
        };
        ionicDatePicker.openDatePicker(ipObj1);
      }
    }
     //startTime
    $scope.endTime=function(){
      if (PlatformService.getPlatform() == 'APP') {
        var options = {
          date: new Date(),
          mode: 'date',
          cancelButton: false,
          locale: "zh-Hans" // ios 时间控件已经中国化 todo  android
        };
        datePicker.show(options, function(date) {
          $timeout(function() {
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            if (month < 10) {
              month = '0' + month;
            }
            if (day < 10) {
              day = '0' + day;
            }
            var startTime=year+ '-' + month + '-' + day;
            $scope.end=startTime;
            
            
          }, 200);
        });
      } else {
        var ipObj1 = {
          inputDate: new Date(),
          weeksList: ['日', '一', '二', '三', '四', '五', '六'],
          monthsList: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          from: $scope.startOk, //Optional
          to: $scope.endOk, //Optional
          // mondayFirst: true, //Optional
          // closeOnSelect: false, //Optional
          templateType: 'popup',
          setLabel: '设置',
          closeLabel: '关闭',
          dateFormat: 'yyyy-MM-dd',
          callback: function(val) { //Mandatory
              console.log('Return value from the datepicker popup is : ', new Date(val).getMonth() + 1);
              var monthWeb = new Date(val).getMonth() + 1;
              var dayWeb = new Date(val).getDate();
              if (monthWeb < 10) {
                monthWeb = '0' + monthWeb;
              }
              if (dayWeb < 10) {
                dayWeb = '0' + dayWeb;
              }
              var starTime = new Date(val).getFullYear() + '-' + monthWeb + '-' + dayWeb;
              $scope.end=starTime;
              

            } //Optional
        };
        ionicDatePicker.openDatePicker(ipObj1);
      }
    }
    $scope.selectStartEnd=function(){
      $scope.topStyle=1;
      $scope.startend="img/ic_select.png";
      $scope.day="img/ic_check.png";
      
    }
    $scope.selectDay=function(){
      console.log('sdddd')
      $scope.topStyle=0;
      $scope.day="img/ic_select.png";
      $scope.startend="img/ic_check.png";
    }
    //取消置顶帖子
    $scope.deleteTop=function(){
      $scope.showTop=false;
      $scope.topStyle=3;
      $scope.topicTop=true;
      $scope.isFirstTop=false;
      $scope.startend="img/ic_check.png";
      $scope.day="img/ic_check.png";
    }
    $scope.deleteJing=function(){
      $scope.showJing=false;
      $scope.topStyle=3;
      $scope.topicJing=true;
      $scope.isFirstJing=false;
      $scope.startend="img/ic_check.png";
      $scope.day="img/ic_check.png";
    }
    $scope.selectTop=function(){
      $scope.showTop=true;
    }
    $scope.selectJing=function(){
      $scope.showJing=true;
    }
    $scope.topicTopOK=function(){
      if($scope.personType.isSuperManager){
        if($scope.topicTop){
          $scope.topicTop=false;
        }else{
          $scope.topicTop=true;
        }
      }
    }
    $scope.topicJingOK=function(){
      if($scope.personType.isSuperManager){
        if($scope.topicJing){
          $scope.topicJing=false;
        }else{
          $scope.topicJing=true;
        }
      }
    }
    $scope.firstTop=function(){
      if($scope.isFirstTop){
        $scope.isFirstTop=false;
      }else{
        $scope.isFirstTop=true;
      }
    }
    $scope.firstJing=function(){
      if($scope.isFirstJing){
        $scope.isFirstJing=false;
      }else{
        $scope.isFirstJing=true;
      }
    }

    //置顶贴子
    $scope.topPosts = function () {
      
      console.log($scope.topStyle);
      if($scope.isFirstTop||$scope.topicTop){
        if($scope.topStyle==0||$scope.topStyle==1){
          if($scope.topStyle==1){
            if($scope.isFirstTop&&$scope.topicTop){
              var params = {
                storyId: $scope.circleId,
                topStatus:1,
                topStartDate:$scope.start,
                topEndDate:$scope.end,
                topicTop:3

              };
              $scope.okTop(params);
            }else if($scope.isFirstTop&&!$scope.topicTop){
              var params = {
                storyId: $scope.circleId,
                topStatus:1,
                topStartDate:$scope.start,
                topEndDate:$scope.end,
                topicTop:2

              };
              $scope.okTop(params);
            }else if(!$scope.isFirstTop&&$scope.topicTop){
              var params = {
                storyId: $scope.circleId,
                topStatus:1,
                topStartDate:$scope.start,
                topEndDate:$scope.end,
                topicTop:1

              };
              $scope.okTop(params);
            }
          }else if($scope.topStyle==0){

            if($scope.topTopic.day){
              var a=parseInt($scope.topTopic.day);
              console.log(a);
              if(a>0){
                if(a<30){
                  if($scope.isFirstTop&&$scope.topicTop){
                    var params = {
                      storyId: $scope.circleId,
                      topStatus:0,
                      topNum:a,
                      topicTop:3

                    };
                    $scope.okTop(params);
                  }else if($scope.isFirstTop&&(!$scope.topicTop)){
                    var params = {
                      storyId: $scope.circleId,
                      topStatus:0,
                      topNum:a,
                      topicTop:2

                    };
                    $scope.okTop(params);
                  }else if(!$scope.isFirstTop&&$scope.topicTop){
                    var params = {
                      storyId: $scope.circleId,
                      topStatus:0,
                      topNum:a,
                      topicTop:1

                    };
                    $scope.okTop(params);
                  }
                  
                }else{
                  PopupService.showToast('置顶天数不能超过30天，请重新输入');
                }
              }else{
                PopupService.showToast('置顶天数需大于0天，请重新输入');
              }
            }else{
              PopupService.showToast('请输入置顶天数');
            }
            
          }
        }else{
          PopupService.showToast('请选择置顶时间');
        }
      }else{
        PopupService.showToast('请选择置顶位置');
      }
      
    };
    $scope.okTop=function(params){
      NoteDetailsService.topStory(params)
          .success(function (response) {
            console.log(response);
            if (response.success) {
              PopupService.showToast('置顶成功');
              $scope.circleDetail.isTopicTop = true;
              $scope.showTop=false;
              $scope.topStyle=3;
              $scope.topicTop=true;
              $scope.isFirstTop=false;
              $scope.startend="img/ic_check.png";
              $scope.day="img/ic_check.png";
            }else{
              PopupService.showToast(response.message);
            }
          });
    }
    //精华方式
    $scope.JingPosts=function(){
      console.log($scope.topStyle);
      if($scope.isFirstJing||$scope.topicJing){
        if($scope.topStyle==0||$scope.topStyle==1){
          if($scope.topStyle==1){
            if($scope.isFirstJing&&$scope.topicJing){
              var params = {
                storyId: $scope.circleId,
                choiceStatus:1,
                choiceStartDate:$scope.start,
                choiceEndDate:$scope.end,
                topicChoice:3

              };
              $scope.okJing(params);
            }else if($scope.isFirstJing&&!$scope.topicJing){
              var params = {
                storyId: $scope.circleId,
                choiceStatus:1,
                choiceStartDate:$scope.start,
                choiceEndDate:$scope.end,
                topicChoice:2

              };
              $scope.okJing(params);
            }else if(!$scope.isFirstJing&&$scope.topicJing){
              var params = {
                storyId: $scope.circleId,
                choiceStatus:1,
                choiceStartDate:$scope.start,
                choiceEndDate:$scope.end,
                topicChoice:1

              };
              $scope.okJing(params);
            }
          }else if($scope.topStyle==0){

            if($scope.topTopic.day){
              var a=parseInt($scope.topTopic.day);
              console.log(a);
              if(a>0){
                if(a<30){
                  if($scope.isFirstJing&&$scope.topicJing){
                    var params = {
                      storyId: $scope.circleId,
                      choiceStatus:0,
                      choiceNum:a,
                      topicChoice:3

                    };
                    $scope.okJing(params);
                  }else if($scope.isFirstJing&&(!$scope.topicJing)){
                    var params = {
                      storyId: $scope.circleId,
                      choiceStatus:0,
                      choiceNum:a,
                      topicChoice:2

                    };
                    $scope.okJing(params);
                  }else if(!$scope.isFirstJing&&$scope.topicJing){
                    var params = {
                      storyId: $scope.circleId,
                      choiceStatus:0,
                      choiceNum:a,
                      topicChoice:1

                    };
                    $scope.okJing(params);
                  }
                  
                }else{
                  PopupService.showToast('设置精华天数不能超过30天，请重新输入');
                }
              }else{
                PopupService.showToast('置顶天数需大于0天，请重新输入');
              }
            }else{
              PopupService.showToast('请输入天数');
            }
            
          }
        }else{
          PopupService.showToast('请选择精华时间');
        }
      }else{
        PopupService.showToast('请选择精华位置');
      }
    }
    $scope.okJing=function(params){
      NoteDetailsService.JingStory(params)
          .success(function (response) {
            console.log(response);
            if (response.success) {
              PopupService.showToast('设置精华成功');
              $scope.circleDetail.isChoice = params.topicChoice;
              $scope.showJing=false;
              $scope.topStyle=3;
              $scope.topicJing=true;
              $scope.isFirstJing=false;
              $scope.startend="img/ic_check.png";
              $scope.day="img/ic_check.png";
            }else{
              PopupService.showToast(response.message);
            }
            // $scope.commentList = response.data.list;
          });
    }
    //取消置顶贴子
    $scope.cancelTop = function () {
      var params = {
        storyId: $scope.circleId
      };
      NoteDetailsService.cancelTop(params)
        .success(function (response) {
          if (response.success) {
            $scope.circleDetail.isTopicTop = false;
            $scope.circleDetail.isTop=false;
            PopupService.showToast(response.message);
          } else {
            PopupService.showToast(response.message);
          }
        });
    };
    //取消置顶贴子
    $scope.cancelJing = function () {
      var params = {
        storyId: $scope.circleId
      };
      NoteDetailsService.cancelJing(params)
        .success(function (response) {
          if (response.success) {
            $scope.circleDetail.isChoice = 0;
            PopupService.showToast(response.message);
          } else {
            PopupService.showToast(response.message);
          }
        });
    };
    //删除贴子
    $scope.deleteStory = function () {
      var storyId = {
        storyId: $scope.circleDetail.id
      };
      NoteDetailsService.deleteTopic(storyId)
        .success(function (response) {
          if (response.success == true) {
            PopupService.showToast('话题删除成功');
            $rootScope.ifDeleteNoteList = true;
            $state.go('circlePage', {circleId: $scope.circleDetail.topicId})
          }else{
            PopupService.showToast(response.message);
          }
        })
    };
    //删除贴子给提示
    $scope.warnDelete = function (id) {
      $scope.isDisplay = false;
      // 一个精心制作的自定义弹窗
      $scope.commentId = id;
      // An elaborate, custom popup
      if($scope.circleDetail.isReward==1&&$scope.circleDetail.rewardStatus==0){
        var myPopup = $ionicPopup.show({
          template: '<img src="img/circleIcon/pinkDelete.png" style="width: 30px" alt=""><div>该话题是悬赏话题，删除金币不退回，确认删除吗？</div>',
          title: '删除话题',
          subTitle: 'Please use normal things',
          scope: $scope,
          buttons: [
            {
              text: '<span>确认</span>',
              type: '',
              onTap: function () {
                $scope.deleteStory();
              }
            },
            {text: '放弃'}
          ]
        });
      }else{
        var myPopup = $ionicPopup.show({
          template: '<img src="img/circleIcon/pinkDelete.png" style="width: 30px" alt=""><div>确认删除话题吗？</div>',
          title: '删除话题',
          subTitle: 'Please use normal things',
          scope: $scope,
          buttons: [
            {
              text: '<span>确认</span>',
              type: '',
              onTap: function () {
                $scope.deleteStory();
              }
            },
            {text: '放弃'}
          ]
        });
      }
      // myPopup.then(function(res) {
      //     console.log('Tapped!', res);
      // });
      $timeout(function () {
        // myPopup.close();
      }, 3000);
    };
    //删除评论给提示
    $scope.warnDeleteComments = function (id) {
      console.log(id)
      $scope.isDisplay = false;
      // 一个精心制作的自定义弹窗
      $scope.deleteId = id;
      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<img src="{{imgBaseURL}}img/circleIcon/pinkDelete.png" style="width: 30px" alt=""><div>确认删除评论吗？</div>',
        title: '删除评论',
        subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [
          {text: '放弃'},
          {
            text: '<span>确认</span>',
            type: '',
            onTap: function () {
              $scope.deleteComment();
            }
          }
        ]
      });
      $timeout(function () {
        // myPopup.close();
      }, 3000);
    };
    //删除评论
    $scope.deleteComment = function (item) {
      var id = {
        id: $scope.deleteId
      };
      NoteDetailsService.deleteStory(id)
        .success(function (response) {
          if (response.success == true) {
            // $scope.goldNum();
            PopupService.showToast('删除成功');
            $scope.getComment();
          }else{
            PopupService.showToast(response.message);
          }
        })
    };
    //关联产品
    $scope.productConnect = function () {
      console.log($scope.userShareId)
      var productId = {
        productId: $scope.circleDetail.productId,
        userCode:$scope.userShareId?$scope.userShareId:$scope.circleDetail.userCode
      };
      NoteDetailsService.connectProduct(productId)
        .success(function (response) {
          if (response.success) {
            $scope.products = response.data.list;
          }
        })
    };
    //跳到产品详情
    $scope.toProductDetail = function (item) {
      $state.go('productDetail', {
          productId: item.productId,
          o2oType: item.o2oType,
          fromType: item.fromType,
          storeId: item.storeId
        }
      );
    };
    /**
     *判断身份
     */
    $scope.whichPersonType = function () {
      console.log('11111111111');
      var params = {
        storyId: $scope.circleDetail.id,
        topicId: $scope.circleDetail.topicId
      };
      NoteDetailsService.getPersonType(params)
        .success(function (response) {
          console.log(response);
          if (response.success == true) {
            $scope.personType = {
              isAdmin: response.data.isAdmin,
              isCreateStory: response.data.isCreateStory,
              isSuperManager:response.data.isSuperManager,
              isCircleManager:response.data.isCircleManager

            }
          }
        })
    };
    //分享贴子保存
    $scope.shareToStore = function () {
      var param = {
        flag: 1,
        storyId: $scope.circleDetail.id
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
      // NoteDetailsService.getShop(param).success(function(response){
      //   if(response.success){
      //     $scope.shareUserId=$scope.userId;
      //   }
      // })
      if($location.absUrl().indexOf('token')!=-1){
        $location.search('token','null');
      }
      var title = $scope.circleDetail.storyName ? $scope.circleDetail.storyName + '-顺逛微社区' : $scope.circleDetail.userName + '的话题-顺逛微社区'; //分享标题
      var content = $scope.circleDetail.storyContentText.substr(0, 30)||'马上进入，参与话题讨论吧...';  //分享内容
      var pic = $scope.circleDetail.mainImgArray[0] ? $scope.circleDetail.mainImgArray[0] : 'http://www.ehaier.com/mstatic/wd/v2/img/sg.png';//分享图片，写绝对路径  是否后台获取
      console.log(UrlService.getShareLinkHeader());
      if($scope.shareUserId){
        var url = UrlService.getShareLinkHeader() + 'noteDetails/' + $scope.circleId + '/' + $scope.ifShort + '/'+$scope.shareUserId;//分享链接，绝对路径
        console.log(url);
    }else{
        var url = UrlService.getShareLinkHeader() + 'noteDetails/' + $scope.circleId + '/' + $scope.ifShort + '/';
        console.log(url);
    }
      // var url = UrlService.getShareLinkHeader() + 'noteDetails/' + $scope.circleId + '/' + $scope.ifShort + '/'+$scope.shareUserId?$scope.shareUserId:''+'/';//分享链接，绝对路径
      console.log(url);
      if (window.umeng) {
        var param={topicId:$scope.circleId};
        var callbackWarpper=function(platform){
          CreditService.shareSuccessCallback(platform,param);
        };
        if (index == 0) {
          window.umeng.shareToSina(title, content, pic, url,0,null, callbackWarpper);
        } else if (index == 1) {
          window.umeng.shareToWechatSession(title, content, pic, url,0,null, callbackWarpper);
        } else if (index == 2) {
          console.log('title',title);
          console.log('content',content);
          console.log('pic',pic);
          console.log('url',url);
          window.umeng.shareToWechatTimeline(title, content, pic, url,0,null, callbackWarpper);
        } else if (index == 3) {
          window.umeng.shareToQQ(title, content, pic, url,0,null, callbackWarpper);
          CreditService.qqShare();
        } else if (index == 4) {
          window.umeng.shareToQzone(title, content, pic, url,0,null, callbackWarpper);
          CreditService.qqShare();
        }
        if (index == 5) {
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
    //关闭下载弹框
    $scope.closeDownload = function () {
      $scope.ifDownload = false;
    };
    //
    $scope.goldNum=function(){
      NoteDetailsService.getGold().success(function(response){
        if(response.success){
          if(response.data>9999){
            $scope.canShanGold=9999;
          }else if(response.data<0){
            $scope.canShanGold=0;
          }else{
            $scope.canShanGold=response.data;
          }
          console.log($scope.canShanGold)
        }else if(response.errorCode==-2000){
          console.log(response.message)
          PopupService.showToast(response.message);

          $scope.showShan=false;
          $rootScope.loginIsAccord2 = true;

        }else{
          $scope.showShan=false;
        }

      });
    };
    //获得打赏列表
    $scope.getShanList=function(){
      var param={
        tipId:parseInt($scope.circleId),
        pageIndex:1,
        pageSize:10,
        type:1
      }
      NoteDetailsService.getList(param).success(function(response){
        $scope.shanList=response.data;
        console.log(response);
      })
    }
    //确定打赏
    $scope.shanTopic=function(){
      console.log($scope.shanCommentId)
      $scope.shanCommentId=$scope.shanCommentId+'';
      if($scope.shanGoldNum){
        $scope.shanOK();
      }else{
        if($scope.reward.num){
          $scope.shanGoldNum=parseInt($scope.reward.num);
          $scope.shanOK();
        }else{
          PopupService.showToast('请选择打赏金币');
        }
      }

      console.log($scope.shanGoldNum);




    }
    $scope.shanOK=function(){
      if($scope.shanGoldNum<=9999){
        if($scope.shanGoldNum<=$scope.canShanGold){
          if($scope.shanCommentId.length>0){
            var topic={
              'commentId':$scope.shanCommentId,
              'amount':$scope.shanGoldNum
            }
            NoteDetailsService.shanComment(topic)
            .success(function(response){
              console.log(response);
              if(response.success){
                $scope.showShan=false;
                PopupService.showToast('打赏成功');
                $timeout(function(){
                  $scope.getShanList();
                },1000)

                for(var j=0;j<$scope.commentList.length;j++){
                  $scope.commentList[j].ischecked=false;
                }
                for(var i=0;i<$scope.shanNum.length;i++){
                  $scope.shanNum[i].isChecked=false;
                }
                $scope.reward.num='';
                $scope.shanGoldNum='';
                $scope.shanCommentId='';

              }else{
                PopupService.showToast(response.message);
              }


            })
          }else{
            var param={
              storyId:parseInt($scope.shanTopicId),
              amount:$scope.shanGoldNum
            }
            NoteDetailsService.shanTopic(param).success(function(response){
              console.log(response);
              if(response.success){
                $scope.showShan=false;
                PopupService.showToast('打赏成功');
                $timeout(function(){
                  $scope.getShanList();
                },1000)

                // $scope.goldNum();
                for(var i=0;i<$scope.shanNum.length;i++){
                  $scope.shanNum[i].isChecked=false;
                }
                $scope.reward.num='';
                $scope.shanGoldNum='';
                $scope.shanTopicId='';

              }else{
                $scope.showShan=false;

                for(var i=0;i<$scope.shanNum.length;i++){
                  $scope.shanNum[i].isChecked=false;
                }
                $scope.reward.num='';
                $scope.shanGoldNum='';
                $scope.shanTopicId='';
                PopupService.showToast(response.message);
              }

            })
          }

        }else{
          PopupService.showToast('您的金币数不足，请修改打赏金额');
        }
      }else{
        PopupService.showToast('最多可打赏9999金币，请修改打赏金额');
      }
    }
    $scope.gotoothers = function (item) {
      $state.go('personalHomepageHe', {othersId: item.userId});
    }
    $scope.cangComment=function(item){
      console.log(item)
      var param={
        id:item.id,
        isDisplay:item.isDisplay
      };
      NoteDetailsService.cangComment(param).success(function(response){
        if(response.success){
          PopupService.showToast(response.message);
          $timeout(function(){
            $scope.getComment();
          },1000)
          
        }else{
          PopupService.showToast(response.message);
        }
      })

    }
    $scope.cangTopic=function(){
      var param={
        storyId:$scope.circleId
      };
      NoteDetailsService.cangTopic(param).success(function(response){
        console.log(response);
        if(response.success){
          $scope.getCircleDetails();//获取贴子详情
        }else{
          PopupService.showToast(response.message);
        }
      })
    }
    $scope.delCangTopic=function(){
      var param={
        storyId:$scope.circleId
      };
      NoteDetailsService.delCangTopic(param).success(function(response){
        console.log(response);
        if(response.success){
          $scope.getCircleDetails();//获取贴子详情
        }else{
          PopupService.showToast(response.message);
        }
      })
    }
    $scope.topicAgree=function(id){
      var myPopup = $ionicPopup.show({
            template: '<div>您是否确认采纳该回复？</div>',
            title: 'Enter Wi-Fi Password',
            subTitle: 'Please use normal things',
            scope: $scope,
            buttons: [
              { text: '取消' },
              {
                text: '<b>确定</b>',
                type: 'button-positive',
                onTap: function(e) {
                  var params={
                    storyId:$scope.circleId,
                    commentId:id
                  }
                  NoteDetailsService.topicAgree(params).success(function(response){
                    console.log(response);
                    if(response.success){
                      PopupService.showToast('已经被采纳');
                      $scope.getCircleDetails();//获取贴子详情
                      $scope.getStoryPraiseNum();//贴子详情点赞统计
                      $scope.getComment();//获取评论
                    }else{
                      PopupService.showToast(response.message);
                    }
                  })
                }
              },
            ]
          });
      
    }
    function GetQueryString(name){
      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if(r!=null)return  unescape(r[2]); return '';
    }
    function loginOK(){
      var a=$location.absUrl();
      secritIdIndex = a.indexOf('secritId');
      tokenIndex = a.indexOf('&token');
      _urlToken = decodeURI(a.substring(secritIdIndex+9,tokenIndex));
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

    $scope.init = function () {
      $scope.images=false;
      $scope.haierImg=false;
      $scope.shunguangImg=false;
      $rootScope.globalConstant.showvideo=false;
      $scope.commentIndex=1;
      $scope.topStyle=3;
      $scope.topicTop=true;
      $scope.isFirstTop=false;
      $scope.topicJing=true;
      $scope.isFirstJing=false;
      $scope.showJing=false;
      // var mid = UserService.getUser().mid;//userId
      $scope.topTopic={
        day:5
      }
      $scope.startend='img/ic_check.png';
      $scope.day='img/ic_check.png';
      var datedate=new Date();
      var months=parseInt(datedate.getMonth())+1;
      var endend=new Date(datedate);
      endend.setDate(datedate.getDate()+7);
      var endMonthss=parseInt(endend.getMonth())+1;
      console.log(months);
      $scope.start=datedate.getFullYear()+'-'+months+'-'+datedate.getDate();
      $scope.end=endend.getFullYear()+'-'+endMonthss+'-'+endend.getDate();
      $scope.shareUserId=null;
      $scope.userShareId=$stateParams.shareStoreId;//分享userid
      $scope.circleId = $stateParams.noteId;//接收传参
      $scope.circleIDIF=false;
      
      $scope.shanList='';
      $rootScope.ifDeleteNoteList = false;//是否删除圈子页该话题
      $scope.reward={
        num:''
      }
      $scope.shanNum=[
      {
        num:1,
        isChecked:false
      },
      {
        num:5,
        isChecked:false
      },
      {
        num:10,
        isChecked:false
      },
      {
        num:20,
        isChecked:false
      },
      {
        num:50,
        isChecked:false
      },
      {
        num:100,
        isChecked:false
      },
    ]


      $scope.getShanList();


      $scope.userId = UserService.getUser().mid;//获取进小店的id
      if (window.cordova) {
        $scope.ifInApp = false;
      } else {
        $scope.ifInApp = true;
      }

      $scope.ifDownload = true;
      $scope.toSomeone = '';//输入框placeholder
      /*********************分享标签－whiteBird start*********************/
      $scope.showQQ = false;
      $scope.showWeChat = false;
      $scope.showShare = false;//分享菜单显示
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
      /*********************分享标签－whiteBird end*********************/
      $scope.commentWords = {//弹框回复评论
        words: ''
      };
      $scope.showShare = false;//分享界面显示隐藏
      $scope.isFavorite = true;
      $scope.isPraise = true;
      $scope.isDisplay = false;

      $scope.ifShort = $stateParams.isShortStory;//判断长文短文
      $scope.personType = {
        isAdmin: false,
        isCreateStory: false
      };
      $scope.getCircleDetails();//获取贴子详情
      $scope.getStoryPraiseNum();//贴子详情点赞统计
      $scope.getComment();//获取评论
      //时间及申请理由填写modal页面
      $ionicModal.fromTemplateUrl('templates/quanzi/TopDaysModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.selectModal = modal;
        // $scope.selectModal.show();
      });
      // $timeout(function(){
      //       $scope.getA();
      //     },100)
    };

    //默认请求 微信 openId
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
      NoteDetailsService.getWeChatUrlOpenId(aid).success(function(res) {
        if (res.success) {
          // $http.get(res.data);
          // window.open(res.data);
          document.location.href = res.data;
        }
      });
    }

    $scope.$on('$ionicView.beforeEnter', function () {
    	
      loginOK();
       //获取 token后 修改URL
      window.location.hash=$location.path()
      
      $scope.isIOS = ionic.Platform.isIOS()?true:false;
      //解决物理返回按钮继续播放问题xyz添加
      $rootScope.$on('$stateChangeStart',
              function(event, toState, toParams, fromState, fromParams){
                if('noteDetails' == fromState.name){
                  var video=document.getElementsByTagName("video");
                  for(var i=0;i<video.length;i++){
                    video[i].pause();
                  }
                }
              });

      if(ionic.Platform.isAndroid()){
        $scope.hideBigImage();
        $(".LightBox").hide(0);
      }
      console.log('init')
      // $scope.init();
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
        $scope.init();
      }
    });
    $scope.$on('$ionicView.beforeLeave',function(){
      $("ion-header-bar").show();
      $(".Main .tab-nav").show();

    })
    $scope.gotoCompare=function(){

    }
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





  }]);

APP.service('NoteDetailsService', ['$http', 'UrlService', function ($http, UrlService) {
  //获取贴子详情
  this.getCircleDetails = function (topicId) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('CIRCLE_STORY_INFO'),
      data: topicId
    });
  };
  //删除帖子
  this.deleteTopic = function (stotyId) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('DELETESTORY'),
      data: stotyId
    });
  };
  //删除评论接口
  this.deleteStory = function (id) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('DELETE_COMMON_COMMENT'),
      data: id
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
  //贴子收藏
  this.topicFavorite = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('COLLECTION_TOPIC'),
      data: param
    });
  };
  //评论点赞
  this.commentPraise = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('TOPIC_PRAISE'),
      data: param
    });
  };
  //获取评论
  this.getComments = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('COMMON_COMMENT'),
      data: param
    });
  };
  //置顶方法
  this.topStory = function (param) {
    return $http.get(UrlService.getUrl('CIRCLE_TOP_TOPIC'),param);
  };
   //精华方法
  this.JingStory = function (param) {
    return $http.get(UrlService.getUrl('CIRCLE_JING_TOPIC'),param);
  };
  this.cancelJing=function (param) {
    return $http.get(UrlService.getUrl('CIRCLE_JING_CANCLE'),param);
  };
  //关注圈主接口
  this.followNote = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('FOLLOW'),
      data: param
    });
  };
  //插入评论接口
  this.insertComment = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('INSERT_COMMON_COMMENT'),
      data: param
    });
  };
  //获取身份接口
  this.getPersonType = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('NOTE_PERSON_TYPE'),
      data: param
    });
  };
  //贴子详情点赞、收藏统计
  this.getStoryPraise = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('GET_STORY_PRAISE'),
      data: param
    });
  };
  //评论点赞统计
  this.commentPraiseNum = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('COMMENT_STORY_PRAISE'),
      data: param
    });
  };
  //分享保存
  this.shareStore = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('SHARE'),
      data: param
    });
  };
  //关联产品
  this.connectProduct = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('CONNECT_PROUCT'),
      data: param
    });
  };
  //取消置顶
  this.cancelTop = function (param) {
    return $http.get(UrlService.getUrl('CANCEL_TOP'),param);
  };
  //隐藏 取消隐藏评论
  this.cangComment = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('CIRCLE_CANG_COMMENT'),
      data: param
    });
  };
  //隐藏话题
  this.cangTopic=function(param){
    return $http.get(UrlService.getUrl('CIRCLE_CANG_TOPIC'),param);
  }
  //取消隐藏话题
  this.delCangTopic=function(param){
    return $http.get(UrlService.getUrl('CIECLE_DEL_CANG_TOPIC'),param);
  }
  //上传图片接口
  this.uploadImage = function () {
    return UrlService.getUrl('UPLOAD_ASSESS_IMG');
  };
  //获得金币总数
  this.getGold=function(){
    return $http.get(UrlService.getUrl('CIRCLE_GET_GOLD'));
  }
  //获得打赏列表
  this.getList = function (topicId) {
    // return $http({
    //   method: 'get',
    //   url: UrlService.getUrl('CIRCLE_SHAN_LIST'),
    //   data: topicId
    // });
    return $http.get(UrlService.getUrl('CIRCLE_SHAN_LIST'),topicId);
  };
  //判断是否微店主CIRCLE_SELECT_SHOP
  this.getShop = function (topicId) {
    return $http.get(UrlService.getUrl('CIRCLE_SELECT_SHOP'));
  };
  //采纳评论
  this.topicAgree = function (params) {
    return $http.get(UrlService.getUrl('CIRCLE_AGREE'),params);
  };
  //打赏话题
  this.shanTopic=function(topic){
    // return $http({
    //   method:'POST',
    //   url:UrlService.getUrl('CIRCLE_SHAN_TOPIC'),
    //   data:topic
    // })
    return $http.get(UrlService.getUrl('CIRCLE_SHAN_TOPIC'),topic);
  };
  //打赏话题
  this.shanComment=function(topic){
    console.log(topic)
    return $http.get(UrlService.getUrl('CIRCLE_SHAN_COMMENT'),topic);
    // return $http({
    //   method:'post',
    //   url:UrlService.getUrl('CIRCLE_SHAN_COMMENT'),
    //   data:{'commentId':16617,'amount':50}
    // })
    // return $http.post(UrlService.getUrl('CIRCLE_SHAN_COMMENT'), topic);

  };
  //获取openId @zyr start
  this.getWeChatOpenId = function() {
    // return $http.get(UrlService.getUrl('GET_WECHAT_OPENID'));
    return $http({
      method: 'POST',
      url: UrlService.getUrl('GET_WECHAT_OPENID')
      // data: data
    });
  };
  //获取openId (url) @zyr start
  this.getWeChatUrlOpenId = function(aid) {
    var param = {
        url: aid
      }
    return $http.post(UrlService.getUrl('GET_WECHAT_URL') + '?url=' + encodeURIComponent(param.url));
    // return $http.get(UrlService.getUrl('CIRCLE_SHAN_LIST'),topicId);
  };
  this.weChatOpenId = '';
}]);
