/**
 * 回复文本框 多行输入 ,todo 解决 输入字数的限制
 */
APP.directive('contenteditable', function () {
  return {
    restrict: 'A', // 只用于属性
    require: '?ngModel', // get a hold of NgModelController
    link: function (scope, element, attrs, ngModel) {
      if (!ngModel) {
        return;
      }
      // Specify how UI should be updated
      ngModel.$render = function () {
        element.html(ngModel.$viewValue || '');
      };
      // Listen for change events to enable binding
      element.on('blur keyup change', function () {
        scope.$apply(readViewText);
      });
      // No need to initialize, AngularJS will initialize the text based on ng-model attribute
      // Write data to the model
      function readViewText() {
        var html = element.html();
        // When we clear the content editable the browser leaves a <br> behind
        // If strip-br attribute is provided then we strip this out
        if (attrs.stripBr && html === '<br>') {
          html = '';
        }
        ngModel.$setViewValue(html);
      }
    }
  }
});


APP.controller('ClassNoteDetailsController', ['$scope', '$rootScope', '$ionicModal', '$state', '$stateParams','$ionicLoading', '$http','PlatformService', 'ClassNoteDetailsService', '$ionicPopup', '$ionicScrollDelegate', 'ApplyCircleService',
  'TopicdetailsService', '$timeout', '$ionicActionSheet', 'PopupService', '$timeout', 'UrlService', 'NoteDetailsService', 'UserService', 'CreditService',
  function ($scope, $rootScope, $ionicModal, $state, $stateParams,$ionicLoading, $http,PlatformService, ClassNoteDetailsService, $ionicPopup, $ionicScrollDelegate, ApplyCircleService, TopicdetailsService, $timeout, $ionicActionSheet, PopupService, $timeout, UrlService, NoteDetailsService, UserService, CreditService) {
    /** 变量定义 **/
    $scope.isDisplay = false;
    $scope.inputShow = true;
    $scope.praiseNum = {};//点赞数收藏数
    $scope.commentId = '';//被回复人的id
    $scope.circleId;//接收上个页面的id
    $scope.circleDetail;//用来存储返回的贴子详情数据
    $scope.commentList;//评论
    $scope.commentWords = {//弹框回复评论
      words: ''
    };
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
    $scope.iconImageData = [];
    $scope.imgUrlList=[];
    $scope.showBac=false;
    $scope.isImage=false;
    $scope.showBigImg =false;
    $scope.imgString='';
    $scope.isPublishImage=false;
    $scope.imgA=[];
    $scope.showBigBac=false;


    /** 方法 **/
    //返回
    $scope.goBack = function () {
      $scope.$ionicGoBack();
      $rootScope.nextPageBefore = 'classNoteDetails';
    };
    //分享
    $scope.goshare = function () {
      if (!UserService.getUser().mid) {
        $state.go('login');
        return;
      }
      $scope.showShare = !$scope.showShare;
      $scope.isDisplay = false;
    };
    //跳转链接
      $scope.goToScore=function ($event) {
        console.log($event);
        $('.longtopic a').addClass('atopic');
        $('.longtopic a').removeAttr('href');
        // $('.longtopic a').attr('href','');
        
        if($event.target.className=='linklink'){
          if($event.target.parentNode.parentNode.attributes['data-a']){
            var url=$event.target.parentNode.parentNode.attributes['data-a'].value;
            $scope.tolink(url);
          }else{
            var url=$event.target.outerText;
            $scope.tolink(url);
          }


        }else if($event.target.className=='all-to'){
          if($event.target.parentNode.attributes['data-a']){
            var url=$event.target.parentNode.attributes['data-a'].value;
            $scope.tolink(url);
          }else{
            var url=$event.target.outerText;
            $scope.tolink(url);
          }

        }else if($event.target.className=='atopic'){
          if($event.target.attributes['data-a']){
            var url=$event.target.attributes['data-a'].value;
            $scope.tolink(url);
          }else if($event.target.attributes['dataa']){
            var url=$event.target.attributes['dataa'].value;
            console.log(url)
            console.log(url.indexOf('#'))
            if(url.indexOf('#')>0){
              var urlk=url.indexOf('#');
              var urlOk=url.substring(urlk);
              console.log($event.target.setAttribute('href',urlOk))
            }else{
              $scope.tolink(url);
            }
          }

        }else if($event.target.parentNode.className=='atopic'){
          if($event.target.parentNode.attributes['data-a']){
            var url=$event.target.parentNode.attributes['data-a'].value;
            $scope.tolink(url);
          }else if($event.target.parentNode.attributes['dataa']){
            var url=$event.target.parentNode.attributes['dataa'].value;
            console.log(url)
            console.log(url.indexOf('#'))
            if(url.indexOf('#')>0){
              var urlk=url.indexOf('#');
              var urlOk=url.substring(urlk);
              console.log($event.target.parentNode.setAttribute('href',urlOk))
            }else{
              $scope.tolink(url);
            }
          }
        }else if($event.target.parentNode.parentNode.className=='atopic'){
          if($event.target.parentNode.parentNode.attributes['data-a']){
            var url=$event.target.parentNode.parentNode.attributes['data-a'].value;
            $scope.tolink(url);
          }else if($event.target.parentNode.parentNode.attributes['dataa']){
            var url=$event.target.parentNode.parentNode.attributes['dataa'].value;
            console.log(url)
            console.log(url.indexOf('#'))
            if(url.indexOf('#')>0){
              var urlk=url.indexOf('#');
              var urlOk=url.substring(urlk);
              console.log($event.target.parentNode.parentNode.setAttribute('href',urlOk))
            }else{
              $scope.tolink(url);
            }
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
    //进入小店
    $scope.goShop = function () {
      $state.go('myStore', {storeId: $scope.userId, shareStoreId: ''});
    };
    //判断下载平台
    $scope.noticeDownload = function () {
      console.log('111', $rootScope.downAppUrl);
      if (!$rootScope.downAppUrl) {
        PopupService.showToast('不支持该手机');
      }
    };
    // 跳信息页
    $scope.jumpMsg = function () {
      $state.go('ClassifyMessageCenter');
    };
    //进入个人主页
    $scope.inPersonalPage = function (code) {
      if (code != 000000000) {
        $state.go('personalHomepageHe', {othersId: code});
      }
    };

    $scope.isClick = function () {
      $scope.isDisplay = !$scope.isDisplay;
    };
    /*点击放大照片*/
    // $scope.showLarge2 = function (img) {
    //   $scope.biggerPictureModal.show();
    //   $scope.biggerImgUrl = img;
      // setTimeout(function () {
      //   var a = document.getElementById('biggerPic');
      //   console.log('biggerPic');
      //   console.log('a',a);
      //   new RTP.PinchZoom($('#biggerPic'), {});
      // }, 500);
    // };
    // $scope.hideLarge = function () {
    //   $scope.biggerPictureModal.hide();
    // };

    // document.showLarge = function (img) {
    //   $scope.biggerPictureModal.show();
    //   $scope.biggerImgUrl = img;
      // setTimeout(function () {
      //   var a = document.getElementById('biggerPic');
      //   console.log('biggerPic');
      //   console.log('a',a);
      //   new RTP.PinchZoom($('#biggerPic'), {});
      // }, 500);
    // };
    //保存图片
    $scope.downLoadPhoto = function (url) {
      $scope.photoUrl = url;

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
            cordova.plugins.saveToPhotoAlbum.save(url, function (nativeURL) {
              console.log(nativeURL);
              PopupService.showToast('保存成功');
            }, function (err) {
              console.error(err);
              PopupService.showToast('保存失败');
            });
          }
        });

      } else {
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
    //关联产品
    $scope.productConnect = function () {
      var productId = {
        productId: $scope.circleDetail.productId,
        userCode:$scope.circleDetail.userCode
      };
      NoteDetailsService.connectProduct(productId)
        .success(function (response) {
          $scope.products = response.data.list;
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
    //修改话题
    $scope.editTopic = function () {
      $state.go('publishEdit', {topicId: $scope.circleId});
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
              $scope.insertComments();
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

    $scope.nocommontId=function(){
      console.log($scope.commontId);
      // var a=$scope.commontId;
      if($scope.commontId){
        $scope.commontId = '';
        $scope.toSomeone = '';
        $scope.commentWords.words='';
        $scope.iconImageData=[];
      }
      
    }
    $scope.focuss=function(){
        console.log(333);
        $scope.isPublishImage=true;
        $scope.showBac=true;
        if($scope.iconImageData.length>0){
          $scope.isImage=true;
        }
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
        id: $scope.circleId,
        noLoading: true
      };
      ClassNoteDetailsService.pushPraise(pushId)
        .success(function (response) {

        });
    };
    //关注圈主
    $scope.follow = function (param) {
      if (param == 0) {
        var isFollow = {
          id: $scope.circleDetail.userCode,
          isFollow: 1
        };
        ClassNoteDetailsService.followNote(isFollow)
          .success(function (response) {
            if (response.success == true) {
              $scope.circleDetail.isFolled = 1;
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
        ClassNoteDetailsService.followNote(isFollow)
          .success(function (response) {
            if (response.success == true) {
              $scope.circleDetail.isFolled = 0;
            }else if (response.errorCode==-2000){
              PopupService.showToast(response.message);
              $rootScope.loginIsAccord2 = true;
            }
          });
      }
    };
    $scope.getA=function(){
      $timeout(function(){
        console.log($('.longtopic').html());
        $('.longtopic a').each(function(i){
          // console.log($(this).attr('dataa'));
          if($(this).attr('dataa')){

          }else{
            $(this).attr('dataa',this.href);
          }
        })
      },1000)
    }

    //获取贴子详情
    $scope.getCircleDetails = function () {
      var acceptId = {
        id: $scope.circleId
      };
      ClassNoteDetailsService.getCircleDetails(acceptId)
        .success(function (response) {
          $scope.circleDetail = response.data;
          console.log('circleDetail', $scope.circleDetail);
          if ($scope.circleDetail.productId) {
            $scope.productConnect();//获取关联产品
          }
        });
        $scope.getA();
    };
    //获取评论
    $scope.getComment = function () {
      var params = {
        pageIndex: 1,
        pageSize: 10000,
        id: $scope.circleId
      };
      ClassNoteDetailsService.getComments(params)
        .success(function (response) {
          $scope.commentNumbers = response.totalCount;//评论总条数
          $scope.commentList = response.data.list;
          $scope.imgString='';
          $scope.imgA=[];
          for(var i=0;i<$scope.commentList.length;i++){
            if($scope.commentList[i].commentImgs){
              $scope.imgString=$scope.commentList[i].commentImgs;
              console.log($scope.imgString);
              $scope.imgA=$scope.imgString.split(",");
              console.log($scope.imgA)
              $scope.commentList[i].imgaa=$scope.imgA;
            }
            
          }
          $ionicScrollDelegate.resize();
        });
    };
    //获取焦点
    $scope.getFocus = function (id, name) {
      event.stopPropagation()
      // $scope.isFocus = true; //获取焦点
      $scope.commentWords.words='';
      $scope.iconImageData=[];
      $scope.isPublishImage=true;
      $scope.showBac=true;
      $scope.commontId = id;
      $scope.toSomeone = '回复给：' + name;
      console.log('获取焦点');
      console.log('回复给谁' + name);
      setTimeout(function () {
        document.getElementById('inputId').focus();
      }, 200);
    };
    //失去焦点
    $scope.leaveFocus = function () {
      $scope.commontId = '';
      $scope.toSomeone = '';
    };

    //插入评论
    $scope.insertComments = function () {
      var a=0;

      if ($scope.commentWords.words) {
        var keywords = {
          keywords: $scope.commentWords.words
        };
        ApplyCircleService.judgeWords(keywords)
          .success(function (response) {
            if (response.message == '没有敏感词') {
              if($scope.iconImageData.length == 0) {
                $scope.publishTopic();
              } else {
                console.log($scope.iconImageData.length);
                angular.forEach($scope.iconImageData,function (data,index) {
                  console.log($scope.iconImageData.length);
                  console.log(index);
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
    };
    $scope.publishTopic=function(params){
      console.log($scope.commontId);
      if ($scope.commontId) {
        var params = {
          comment: $scope.commentWords.words,
          commentTo: $scope.commontId,
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
      // $scope.commentWords.words = '';
      // $scope.commontId = '';
      // $scope.toSomeone = '';
      // $scope.iconImageData = [];
      // $scope.imgUrlList = [];
    }
    $scope.insertCommentOK=function(params){
      ClassNoteDetailsService.insertComment(params)
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
                  } else {
                    $timeout(function () {
                      PopupService.showToast(response.message);
                    }, 200);
                    $scope.commentWords.words = '';
                  }
                }).error(function (e) {
                PopupService.showToast('网络异常');
                $scope.commentWords.words = '';
              });
    }
    //贴子点赞
    $scope.topicPraise = function (id) {
      var param = {
        id: id,
        noLoading: true
      };
      ClassNoteDetailsService.pushPraise(param)
        .success(function (response) {
          if (response.success == true) {
            $scope.isPraise = !$scope.isPraise;
            $scope.getStoryPraiseNum();
            PopupService.showToast('点赞成功');
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
      ClassNoteDetailsService.topicFavorite(param)
        .success(function (response) {
          if (response.success == true) {
            $scope.isFavorite = !$scope.isFavorite;
            $scope.getStoryPraiseNum();
            PopupService.showToast('收藏成功');
            console.log('收藏成功');
          }else if (response.errorCode==-2000){
            PopupService.showToast(response.message);
            $rootScope.loginIsAccord2 = true;
          }else{
            PopupService.showToast(response.message);
          }
        });
    };
    //评论点赞
    $scope.commentPraise = function (item, index) {
      console.log('点赞了');
      var param = {
        commentId: item.id
      };
      ClassNoteDetailsService.commentPraise(param)
        .success(function (response) {
          if (response.success == true) {
            // console.log(item.id);
            item.commentPraiseNumberFlag = !item.commentPraiseNumberFlag;
            // item.commentPraiseNum`ber = $scope.getCommentPraiseNum(item);
            $scope.commentPraiseNum(item, index);
            console.log('点赞成功');
          }
        });
    };
    //贴子详情点赞、收藏统计
    $scope.getStoryPraiseNum = function () {
      var param = {
        id: $scope.circleId
      };
      ClassNoteDetailsService.getStoryPraise(param)
        .success(function (response) {
          $scope.praiseNum = response.data;
        });
    };
    //贴子详情评论点赞统计
    $scope.commentPraiseNum = function (item, index) {
      console.log('获取数量');
      var param = {
        commentId: item.id
      };
      ClassNoteDetailsService.commentPraiseNum(param)
        .success(function (response) {
          $scope.commentList[index].commentPraiseNumber = response.totalCount;
        });
    };
    //删除贴子
    $scope.deleteStory = function () {
      var storyId = {
        storyId: $scope.circleDetail.id
      };
      ClassNoteDetailsService.deleteStory(storyId)
        .success(function (response) {
          if (response.success == true) {
            PopupService.showToast('话题删除成功');
            $state.go('circlePage', {circleId: $scope.circleDetail.topicId})
          }
        })
    };
    //删除评论给提示
    $scope.warnDeleteComments = function (id) {
      $scope.isDisplay = false;
      // 一个精心制作的自定义弹窗
      $scope.deleteId = id;
      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<img src="'+$rootScope.imgBaseURL+'img/circleIcon/pinkDelete.png" style="width: 30px" alt=""><div>确认删除评论吗？</div>',
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
    $scope.deleteComment = function () {
      var id = {
        id: $scope.deleteId
      };
      ClassNoteDetailsService.deleteStory(id)
        .success(function (response) {
          if (response.success == true) {
            PopupService.showToast('删除成功');
            $scope.getComment();
          }
        })
    };

    //分享贴子保存
    $scope.shareToStore = function () {
      var param = {
        flag: 2,
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
      var title = $scope.circleDetail.storyName + '-顺逛微社区'; //分享标题
      // var title = $scope.circleDetail.storyName ? $scope.circleDetail.storyName + '顺逛微社区' : $scope.circleDetail.userName + '顺逛微社区'; //分享标题
      var content = $scope.circleDetail.storyContentText.substr(0, 30);  //分享内容
      var pic = 'http://www.ehaier.com/mstatic/wd/v2/img/sg.png';//分享图片，写绝对路径  是否后台获取
      var url = UrlService.getShareLinkHeader() + 'classNoteDetails/' + $scope.circleId;//分享链接，绝对路径
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
      //后台保存结果
      $scope.shareToStore();
    };

    //关闭下载弹框
    $scope.closeDownload = function () {
      $scope.ifDownload = false;
    };
    $scope.init = function () {
      $scope.iconImageData = [];
      $scope.imgUrlList=[];
      $scope.showBac=false;
      //图片放大modal
      $ionicModal.fromTemplateUrl('templates/quanzi/biggerPictureModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.biggerPictureModal = modal;
      });

      $scope.userId = UserService.getUser().mid;//获取进小店的id
      if (window.cordova) {
        $scope.ifInApp = false;
      } else {
        $scope.ifInApp = true;
      }
      $scope.toSomeone = '';//输入框placeholder
      /*********************分享标签－whiteBird start*********************/
      $scope.showQQ = false;
      $scope.ifDownload = true;
      $scope.showWeChat = false;
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
      $scope.circleId = $stateParams.noteId;//接收传参
      $scope.ifShort = $stateParams.isShortStory;//判断长文短文
      $scope.personType = {
        isAdmin: false,
        isCreateStory: false
      };
      $scope.getCircleDetails();//获取贴子详情
      $scope.getComment();//获取评论
      $scope.getStoryPraiseNum();//贴子详情点赞统计

    };

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });


  }]);

APP.service('ClassNoteDetailsService', ['$http', 'UrlService', function ($http, UrlService) {
  //获取贴子详情
  this.getCircleDetails = function (topicId) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('GETSTORYINFO'),
      data: topicId
    });
  };
  //关注圈主接口
  this.followNote = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('FOLLOW'),
      data: param
    });
  };
  //删除帖子
  this.deleteStory = function (stotyId) {
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
      url: UrlService.getUrl('CLASS_DELETE_COMMENT'),
      data: id
    });
  };
  //贴子点赞
  this.pushPraise = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('SCHOOLPRAISESTORY'),
      data: param
    });
  };
  //贴子收藏
  this.topicFavorite = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('SCHOOLCOLLECTION'),
      data: param
    });
  };
  //评论点赞
  this.commentPraise = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('SCHOOLCOMMENTPARISE'),
      data: param
    });
  };
  //获取评论
  this.getComments = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('GETSTORYCOMMENT'),
      data: param
    });
  };
  //插入评论接口
  this.insertComment = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('SUBMITCOMMENT'),
      data: param
    });
  };
  //贴子详情点赞、收藏统计
  this.getStoryPraise = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('GETSTORYPRAISEANDUNREAD'),
      data: param
    });
  };
  //评论点赞统计
  this.commentPraiseNum = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('SCHOOLCOMMENTPARISENUM'),
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

}]);
