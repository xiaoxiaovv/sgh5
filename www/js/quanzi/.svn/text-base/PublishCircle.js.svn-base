/**
 * Created by Andy on 2016/10/17.
 */
APP.controller('PublishCircleController', ['$scope', '$rootScope', '$state', '$stateParams', '$ionicPopup', '$ionicLoading', '$ionicActionSheet', 'PublishCircleService', 'ApplyCircleService', '$timeout', 'PopupService', '$ionicScrollDelegate',

  function ($scope, $rootScope, $state, $stateParams, $ionicPopup, $ionicLoading, $ionicActionSheet, PublishCircleService, ApplyCircleService, $timeout, PopupService, $ionicScrollDelegate) {
    /** 定义变量 **/
    $scope.identifyCode = '';//接收圈子页传参，判断拍照还是相册

    // 发布所提交的信息
    $scope.publishInfo = {
      topicId: '',
      mainImg: '',
      storyContent: ''
    };
    $scope.iconImageData = [];//存储本地图片path


    /** 方法 **/

    /* 返回前一页*/
    $scope.goBack = function () {
      $scope.$ionicGoBack();
    };
    $scope.goSelectGoods = function () {
      $state.go('selectGoods');
    };
    //判断敏感字
    $scope.judgeWords = function () {
      var keywords = {
        keywords: $scope.publishInfo.storyContent
      };
      ApplyCircleService.judgeWords(keywords)
        .success(function (response) {
          if (response.message == '没有敏感词') {

          } else {
            PopupService.showToast(response.message);//提示接口返回的提示
          }
        })
    };
    /*话题字数超过500提示*/
    // $scope.wordsLength = function () {
    //     console.log('执行方法了没');
    //     $scope.wordsNum = 500 - $scope.publishInfo.storyContent.length;
    //     if ($scope.publishInfo.storyContent.length == 500) {
    //         PopupService.showToast('话题内容不得超过500字');
    //     }
    // };
    $scope.$watch('publishInfo.storyContent', function () {
      console.log('字数变动');
      $ionicScrollDelegate.scrollBottom();
      $scope.wordsNum = 500 - $scope.publishInfo.storyContent.length;
      if ($scope.publishInfo.storyContent.length == 500) {
        PopupService.showToast('话题内容不得超过500字');
      }
    });

    // 删除相片
    $scope.deleteImg = function (index) {
      $scope.iconImageData.splice(index, 1);
      $scope.imgUrlList.splice(index, 1);
    };

    /*提交方法*/
    $scope.publishClick = function (arrayData) {
      arrayData.mainImg = $scope.imgUrlList.toString();
      $scope.publishInfo.topicId = $scope.topicId;
      if ($scope.publishInfo.storyContent.length == 0 && !$scope.iconImageData.length) {
        $scope.publishNotice = true;
        $timeout(function () {
          $scope.publishNotice = false;
        }, 1000);
      } else if ($scope.publishInfo.storyContent.length > 500) {
        PopupService.showToast('话题内容不得超过500字');
      } else if ($scope.iconImageData.length != $scope.imgUrlList.length) {
        PopupService.showToast('图片正在上传，请稍后再试');
      } else {
        var keywords = {
          keywords: $scope.publishInfo.storyContent
        };
        ApplyCircleService.judgeWords(keywords)
          .success(function (response) {
            if (response.message == '没有敏感词') {
              PublishCircleService.publish(arrayData)
                .success(function (response) {
                  if (response.success == true) {
                    PopupService.showToast('发布成功');
                    $rootScope.publishSuccess = true;
                    $timeout(function () {
                      $rootScope.publishSuccess = false;
                    }, 1000);
                    $scope.publishInfo = {
                      topicId: '',
                      mainImg: '',
                      storyContent: ''
                    };
                    $scope.iconImageData = '';
                    $scope.imgUrlList = [];
                    $state.go('circlePage', {circleId: $scope.topicId});
                  } else {
                    PopupService.showToast(response.message);
                  }
                })
                .error(function () {

                })
            } else {
              PopupService.showToast('存在敏感词', response.data);//提示接口返回的提示
            }
          });
      }
    };

    $scope.imgUrlList = [];//存储返回的url地址
    /** 拍照 **/
    $scope.addPicture = function () {
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

        var win = function (r) {
          $ionicLoading.hide();
          console.log('上传成功');
          var jsonResp = JSON.parse(r.response);//图片接口返回的图片地址
          var iconImageR = jsonResp.urls;
          $scope.imgUrlList.push(iconImageR);//存储返回的图片地址
          $scope.publishInfo.mainImg = $scope.imgUrlList.toString();//转化成string类型传给接口
          console.log('jsonResp:', jsonResp);
          console.log(iconImageR);
        };
        var fail = function (error) {
          console.log('上传失败');
          $ionicLoading.hide();
        };
        //调用上传图片接口
        var options = {};
        var uploadPhoto = new FileTransfer();
        uploadPhoto.upload(a.imgUrl, encodeURI(PublishCircleService.uploadImage()), win, fail, options);

      }

      function getFail() {
        console.log('get fail ---');
      }

      return true;
    };
    /** 相册 **/
    $scope.photoAlbum = function () {
      console.log('从相册中获取');
      /*
       navigator.camera.getPicture(getSuccessTwo, getFailTwo, {//相册
       quality: 50,
       destinationType: Camera.DestinationType.FILE_URI,
       sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM
       });
       function getFailTwo() {
       // alert('get fail ---');
       }

       function getSuccessTwo(imageData) {
       var a = {imgUrl: imageData};
       $scope.iconImageData.push(a);
       $scope.existPhoto = true;
       $timeout(function () {
       // $scope.iconImageData.push(a);

       for (var i = 0; i < $scope.iconImageData.length; i++) {
       console.log($scope.iconImageData[i]);
       }
       }, 200);

       var win = function (r) {
       $ionicLoading.hide();
       console.log('上传成功');
       var jsonResp = JSON.parse(r.response);//图片接口返回的图片地址
       var iconImageR = jsonResp.urls;
       $scope.imgUrlList.push(iconImageR);//存储返回的图片地址
       $scope.publishInfo.mainImg = $scope.imgUrlList.toString();//转化成string类型传给接口
       console.log('jsonResp:', jsonResp);
       console.log(iconImageR);
       };
       var fail = function (error) {
       console.log('上传失败');
       $ionicLoading.hide();
       };
       //调用上传图片接口
       var options = {};
       var uploadPhoto = new FileTransfer();
       uploadPhoto.upload(a.imgUrl, encodeURI(PublishCircleService.uploadImage()), win, fail, options);
       }*/

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
            // }, 10);


            var win = function (r) {
              $ionicLoading.hide();
              console.log('上传成功');
              var jsonResp = JSON.parse(r.response);//图片接口返回的图片地址
              var iconImageR = jsonResp.urls;
              $scope.imgUrlList.push(iconImageR);//存储返回的图片地址
              $scope.publishInfo.mainImg = $scope.imgUrlList.toString();//转化成string类型传给接口
              console.log('jsonResp:', jsonResp);
              console.log(iconImageR);
            };
            var fail = function (error) {
              console.log('上传失败');
              $ionicLoading.hide();
            };
            //调用上传图片接口
            var options = {};
            var uploadPhoto = new FileTransfer();
            uploadPhoto.upload(img.imgUrl, encodeURI(PublishCircleService.uploadImage()), win, fail, options);

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
    };
    /*添加相片方法*/
    $scope.imgPush = function (index) {
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

              var win = function (r) {
                $ionicLoading.hide();
                console.log('上传成功');
                var jsonResp = JSON.parse(r.response);//图片接口返回的图片地址
                var iconImageR = jsonResp.urls;
                $scope.imgUrlList.push(iconImageR);//存储返回的图片地址
                $scope.publishInfo.mainImg = $scope.imgUrlList.toString();//转化成string类型传给接口
                console.log('jsonResp:', jsonResp);
                console.log(iconImageR);
              };
              var fail = function (error) {
                console.log('上传失败');
                $ionicLoading.hide();
              };
              //调用上传图片接口
              var options = {};
              var uploadPhoto = new FileTransfer();
              uploadPhoto.upload(a.imgUrl, encodeURI(PublishCircleService.uploadImage()), win, fail, options);

            }

            function getFail() {
              console.log('get fail ---');
            }

            return true;
          } else if (index == 1) {
            console.log('从相册中获取');
            /*navigator.camera.getPicture(getSuccessTwo, getFailTwo, {//相册
              quality: 50,
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
              allowEdit: true
            });
            function getFailTwo() {
              console.log('get fail ---');
            }

            function getSuccessTwo(imageData) {
              var a = {imgUrl: imageData};
              $scope.iconImageData.push(a);
              $scope.existPhoto = true;
              $timeout(function () {
                // $scope.iconImageData.push(a);

                for (var i = 0; i < $scope.iconImageData.length; i++) {
                  console.log($scope.iconImageData[i]);
                }
              }, 200);

              var win = function (r) {
                $ionicLoading.hide();
                console.log('上传成功');
                var jsonResp = JSON.parse(r.response);//图片接口返回的图片地址
                var iconImageR = jsonResp.urls;
                $scope.imgUrlList.push(iconImageR);//存储返回的图片地址
                $scope.publishInfo.mainImg = $scope.imgUrlList.toString();//转化成string类型传给接口
                console.log('jsonResp:', jsonResp);
                console.log(iconImageR);
              };
              var fail = function (error) {
                console.log('上传失败');
                $ionicLoading.hide();
              };
              //调用上传图片接口
              var options = {};
              var uploadPhoto = new FileTransfer();
              uploadPhoto.upload(a.imgUrl, encodeURI(PublishCircleService.uploadImage()), win, fail, options);

            }

            return true;*/

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
                  // }, 10);


                  var win = function (r) {
                    $ionicLoading.hide();
                    console.log('上传成功');
                    var jsonResp = JSON.parse(r.response);//图片接口返回的图片地址
                    var iconImageR = jsonResp.urls;
                    $scope.imgUrlList.push(iconImageR);//存储返回的图片地址
                    $scope.publishInfo.mainImg = $scope.imgUrlList.toString();//转化成string类型传给接口
                    console.log('jsonResp:', jsonResp);
                    console.log(iconImageR);
                  };
                  var fail = function (error) {
                    console.log('上传失败');
                    $ionicLoading.hide();
                  };
                  //调用上传图片接口
                  var options = {};
                  var uploadPhoto = new FileTransfer();
                  uploadPhoto.upload(img.imgUrl, encodeURI(PublishCircleService.uploadImage()), win, fail, options);

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
    /*点击放大照片*/
    $scope.showLarge = function (img) {
      $scope.showBigImage = true;
      $scope.Url = img;
    };
    $scope.closeImg = function () {
      $scope.showBigImage = false;
    };

    $scope.init = function () {

      $scope.trendHeight = {
        height: document.getElementById('getWidth').offsetWidth + 'px'
      };
      console.log('$scope.height', $scope.trendHeight);

      $scope.wordsNum = 500;
      $scope.showBigImage = false;
      $scope.iconImageData = [];
      $scope.publishInfo.storyContent = '';
      $scope.topicId = $stateParams.topicId;//接收圈子id
      $scope.identifyCode = $stateParams.identifierCode;//用来判断是拍照还是相册
      if ($scope.identifyCode == 1) {
        $scope.addPicture();
      } else if ($scope.identifyCode == 2) {
        $scope.photoAlbum();
      }
    };

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });

  }]);

APP.service('PublishCircleService', ['$http', 'UrlService', function ($http, UrlService) {
  //提交发表内容
  this.publish = function (params) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('SUBMIT_STORY'),
      data: params
    });
  };
  //上传图片接口
  this.uploadImage = function () {
    return UrlService.getUrl('UPLOAD_ASSESS_IMG');
  };
}]);
