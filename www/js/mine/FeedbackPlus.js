/**
 * Created by 11150421050187 on 2017/4/10.
 */
APP.controller('FeedbackPlusController', ['$scope', '$state', 'FeedbackPlusService', 'PopupService', '$ionicActionSheet', 'AssessService', 'UserService',
  function ($scope, $state, FeedbackPlusService, PopupService, $ionicActionSheet, AssessService, UserService) {
    /*变量定义*/
    $scope.feedback = {//反馈内容
      content: '',
      phoneNumber: ''
    };
    $scope.feedbackType = 6;//反馈类型 5:其他,6: 购物体验,7:功能异常,8:新功能建议
    $scope.imageCount = 0;//已上传照片数量
    $scope.imageList = ['', '', ''];//选择的照片列表
    var imageParams = ['', '', ''];//传到后台的图片参数列表
    $scope.canCommit = false;//提交按钮是否可点击


    /*方法*/
    function init() {
      $scope.feedbackType = 6;
      $scope.canCommit = false;
      $scope.feedback = {
        content: '',
        phoneNumber: ''
      };
      $scope.imageCount = 0;
      for (var i = 0; i < 3; i++) {
        $scope.imageList[i] = '';
        imageParams[i] = '';
      }
    }

    $scope.checkLength = function () {
      setTimeout(function () {
        $scope.$apply(function () {
          if ($scope.feedback.content.length >= 500) {
            $scope.feedback.content = $scope.feedback.content.substr(0, 500);
          }
          $scope.canCommit = $scope.feedback.content.length > 0;
        });
      }, 0);
    };
    $scope.changeType = function (feedbackType) {
      $scope.feedbackType = feedbackType;
    };
    $scope.addImage = function () {
      if (!window.cordova) {
        return;
      }
      $ionicActionSheet.show({
        buttons: [
          {text: '拍照'},
          {text: '从相册选取'}
        ],
        titleText: '照片选取方式',
        cancelText: '取消',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          if (index == 0) {
            navigator.camera.getPicture(getSuccess, getFail, {
              quality: 50,
              destinationType: Camera.DestinationType.FILE_URI,
              allowEdit: false,
              targetWidth: 720,
              targetHeight: 720,
              saveToPhotoAlbum: false,
              correctOrientation:true
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
    function getSuccess(imageData) {//添加图片成功回调

      $scope.$apply(function () {
        for (var i = 0; i < 3; i++) {
          if (!$scope.imageList[i]) {
            $scope.imageList[i] = imageData;
            break;
          }
        }
        $scope.imageCount++;
      });
      //调用图片上传接口
      var win = function (r) {
        var resp = JSON.parse(r.response);
        for (var i = 0; i < 3; i++) {
          if (!imageParams[i]) {
            imageParams[i] = resp.urls;
            break;
          }
        }
      };
      var fail = function (error) {
        //上传失败
      };
      var options = new FileUploadOptions();
      var date = new Date();
      var currentTime = date.getTime();
      options.fileKey = 'imageFile';
      options.fileName = UserService.getUser.userName + currentTime;
      options.mimeType = 'image/jpeg';
      var ft = new FileTransfer();
      ft.upload(imageData, encodeURI(AssessService.uploadImage()), win, fail, options);
    }

    function getFail(message) {//添加图片失败回调

    }

    $scope.removeImage = function (index) {
      $scope.imageList.splice(index, 1);
      imageParams.splice(index,1);
      $scope.imageCount--;
    };
    $scope.phoneCheck = function () {

    };
    $scope.submitFeedback = function () {
      if ($scope.feedback.phoneNumber && !($scope.globalConstant.mobileNumberRegExp.test($scope.feedback.phoneNumber))) {
        PopupService.showToast('请输入正确的手机号码！');
        return;
      }
      var params = {
        site: 'mstore',
        type: $scope.feedbackType,
        content: $scope.feedback.content,
        contact: $scope.feedback.phoneNumber,
        file: imageParams[0] ? imageParams[0] : '',
        file1: imageParams[1] ? imageParams[1] : '',
        file2: imageParams[2] ? imageParams[2] : ''
      };
      FeedbackPlusService.commitFeedback(params)
        .success(function (response) {
          if (response.success) {
            PopupService.showToast('提交成功！');
            setTimeout(function () {
              $state.go('Setup')
            }, 2017);
          }
        })
    };

    $scope.$watch('feedback.content',function(newValue,oldValue){
      setTimeout(function () {
        $scope.$apply(function () {
          if (newValue.length >= 500) {
            $scope.feedback.content = newValue.toString().substr(0, 500);
          }
          $scope.canCommit = $scope.feedback.content.length > 0;
        });
      }, 0);
    });
    $scope.$on('$ionicView.beforeEnter', function () {
      init();
    })
  }]);

APP.service('FeedbackPlusService', ['$http', 'UrlService', function ($http, UrlService) {
  this.commitFeedback = function (params) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('FEEDBACK_PLUS'),
      params: params
    })
  }
}]);
