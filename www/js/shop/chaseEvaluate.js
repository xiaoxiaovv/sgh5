APP.controller('chaseEvaluateController', ['$scope', 'publicationEvaluationService', '$stateParams', '$timeout', 'PlatformService', '$ionicLoading', 'PopupService', '$state', '$ionicHistory', '$rootScope', '$ionicActionSheet', 'UserService', 'chaseEvaluateService','$localstorage',
  function($scope, publicationEvaluationService, $stateParams, $timeout, PlatformService, $ionicLoading, PopupService, $state, $ionicHistory, $rootScope, $ionicActionSheet, UserService, chaseEvaluateService,$localstorage) {
    var imageParams = [];
    var isCanSubit = true;
    $scope.goBack = function() {
      $ionicHistory.goBack();
    }
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) { //只有ios app 特有的样式
      $scope.paddingtopClass = {
        "margin-top": "16px"
      };
      $scope.paddingtopClasscontent = {
        "top": "60px"
      }
    } else {
      $scope.paddingtopClass = {
        "margin-top": "0px"
      };
      $scope.paddingtopClasscontent = {
        "top": "44px"
      }
    }

    $scope.addImage = function() {
      if (!window.cordova) {
        alert("请下载客户端")
        return;
      }
      $ionicActionSheet.show({
        buttons: [{
          text: '拍照'
        }, {
          text: '从相册选取'
        }],
        titleText: '照片选取方式',
        cancelText: '取消',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          if (index == 0) {
            navigator.camera.getPicture(getSuccess, getFail, {
              quality: 50,
              destinationType: Camera.DestinationType.FILE_URI,
              allowEdit: false,
              targetWidth: 720,
              targetHeight: 720,
              saveToPhotoAlbum: false,
              correctOrientation: true
            });
          } else if (index == 1) {
            navigator.camera.getPicture(getSuccess, getFail, {
              quality: 50,
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
              allowEdit: true,
              targetWidth: 720,
              targetHeight: 720
            });
          }
          return true;
        }
      });
    };
    //添加图片成功回调
    function getSuccess(imageData) {
      //调用图片上传接口
      var win = function(r) {
        var jsonResp = JSON.parse(r.response);
        if (jsonResp.success) {
          $scope.$apply(function() {
            for (var i = 0; i < 9; i++) {
              if (!imageParams[i]) {
                imageParams[i] = jsonResp.data.fileId;
                $scope.imageList[i] = jsonResp.data.imgUrl;
                $scope.imageCount++;
                break;
              }
            }
          });
        } else {
          PopupService.showToast(jsonResp.message);
        }
      };
      var fail = function(error) {
        alert(error);
        //上传失败
      };
      var options = new FileUploadOptions();
      var date = new Date();
      var currentTime = date.getTime();
      options.fileKey = 'imageFile';
      options.fileName = UserService.getUser.userName + currentTime;
      options.headers = {"TokenAuthorization":$localstorage.get('sg_login_token_secret')};
      options.mimeType = 'image/jpeg';
      var ft = new FileTransfer();
      ft.upload(imageData, encodeURI(publicationEvaluationService.uploadImage()), win, fail, options);
    }
    //添加图片失败回调
    function getFail(message) {}

    $scope.removeImage = function(index) {
      $scope.imageList.splice(index, 1);
      imageParams.splice(index, 1);
      $scope.imageCount--;
    };
    //提交评论
    $scope.submitEvaluation = function() {
      if ($scope.commentObj.commentTt.length < 2) {
        PopupService.showToast('请输入2～500字的评价！');
      } else {
        publicationEvaluationService.checkAssessText($scope.commentObj.commentTt)
          .success(function(response) {
            if (response) {
              if (isCanSubit) {
                isCanSubit = false;
                chaseEvaluateService.submitEvaluateNew($scope.wdOrderSn,$scope.commentObj.commentTt,imageParams.join(","))
                  .success(function(response) {
                    isCanSubit = true;
                    if (response.success) {
                      if (response.data) {
                        PopupService.showToastShort('商品评价成功！');
                        $timeout(function() {
                          $rootScope.$broadcast('AFTER_COMMIT');
                          $state.go('criticalSuccess', {
                            cOrderSn: $scope.wdOrderSn
                          });
                        }, 1000);
                      }
                    } else if (response.message) {
                      PopupService.showToast(response.message);
                    } else {
                      PopupService.showToast('提交失败！');
                    }
                  });
              }
            } else {
              PopupService.showToast('您的评论里面包含敏感词！');
            }
          });
      }
    };

    $scope.$on('$ionicView.beforeEnter', function() {
      //阻止表单重复提交字段
      isCanSubit = true;
      //路由获取网单号
      $scope.wdOrderSn = $stateParams.cOrderSn;
      //路由获取网单号
      $scope.isMyOrder = ($stateParams.isMeorder == 1);
      //文本
      $scope.commentObj = {
          commentTt: ""
        }
        //已上传照片数量
      $scope.imageCount = 0;
      //选择的照片列表
      $scope.imageList = [];
      //传到后台的图片参数列表
      imageParams = [];
    });
  }
]);

APP.service('chaseEvaluateService', ['$http', 'UrlService', function($http, UrlService) {
  //提交评价接口
  this.submitEvaluateNew = function(cOrderSn, experienceContent, fileIds) {
    var params = {
      cOrderSn: cOrderSn,
      experienceContent: experienceContent,
      fileIds: fileIds
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('ADD_ASSESS_SUBMIT'),
      params: params
    });
  };
}]);
