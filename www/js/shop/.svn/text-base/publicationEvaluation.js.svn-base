APP.controller('publicationEvaluationController', ['$scope', 'publicationEvaluationService', '$stateParams', '$timeout', 'PlatformService', '$ionicLoading', 'PopupService', '$state', '$ionicHistory', '$rootScope', '$ionicActionSheet', 'UserService','$localstorage',
  function($scope, publicationEvaluationService, $stateParams, $timeout, PlatformService, $ionicLoading, PopupService, $state, $ionicHistory, $rootScope, $ionicActionSheet, UserService,$localstorage) {
    var impressions = [];
    var imageParams = [];
    var isCanSubit = true;
    $scope.goBack = function() {
      $ionicHistory.goBack();
    }
    $scope.isCheckedCss = {
      "background": "rgba(255,68,0,0.05)",
      "color": "#FF4400"
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

    $scope.buyerIms = function(index) {
      if ($scope.impressionArr.indexOf(index) == -1) {
        $scope.impressionArr.push(index);
      } else {
        for (var i = 0; i < $scope.impressionArr.length; i++) {
          if ($scope.impressionArr[i] == index) {
            $scope.impressionArr.splice(i, 1);
            break;
          }
        }
      }
      impressions = [];
      $scope.impressionArr.forEach(function(currentValue) {
        impressions.push($scope.impressionStr[currentValue].impressionsProdTypeId);
      });
    }

    $scope.isChecked = function(index) {
      if ($scope.impressionArr.indexOf(index) != -1) {
        return true;
      } else {
        return false;
      }
    }

    $scope.evaluateMethod = function(elu) {
      $scope.evaluateList = elu;
    }

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
                publicationEvaluationService.submitEvaluationNew($scope.wdOrderSn, $scope.commentObj.commentTt, $scope.evaluateList, $scope.valueAll.value1, $scope.valueAll.value3, $scope.valueAll.value2, imageParams.join(","), impressions.join(","), $scope.isMeOrder, $scope.isStore)
                  .success(function(response) {
                    isCanSubit = true;
                    if (response.success) {
                      if (response.data) {
                        PopupService.showToastShort('商品评价成功！');
                        $timeout(function() {
                          $rootScope.$broadcast('AFTER_COMMIT');
                          $state.go('criticalSuccess',{cOrderSn:$scope.wdOrderSn});
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

    $scope.init = function() {
      publicationEvaluationService.evaluationInit($scope.wdOrderSn)
        .success(function(response) {
          if (response.success) {
            $scope.isMeOrder = (response.data.isMyOrder == 1);
            $scope.isStore = (response.data.isStoreMember == 0);
            if (!$scope.isMeOrder && !$scope.isStore) {
              //不是自己的订单并且是微店主
              $scope.placeholderText = '您写下购物体验后，收货人会自动收到邀评短信，可进行详细的图文评价！';
            } else {
              $scope.placeholderText = '您可以写下您的购物体验，供其他小伙伴参考哦！';
            }
            $scope.impressionStr = response.data.impression;
            $scope.productPic = response.data.productInfo.productImg;
          } else {
            PopupService.showToast(response.message);
          }
        });
    }

    $scope.$on('$ionicView.beforeEnter', function() {
      //买家印象id
      impressions = [];
      //阻止表单重复提交字段
      isCanSubit = true;
      //判断是否是自己的订单
      $scope.isMeOrder = false;
      //placeholderText提示文本
      $scope.placeholderText = '您写下购物体验后，收货人会自动收到邀评短信，可进行详细的图文评价！';
      //路由获取网单号
      $scope.wdOrderSn = $stateParams.cOrderSn;
      //商品图片
      $scope.productPic = '';
      //文本
      $scope.commentObj = {
          commentTt: ""
        }
        //星级
      $scope.valueAll = {
        value1: "5",
        value2: "5",
        value3: "5"
      };
      //买家印象
      $scope.impressionArr = [];
      $scope.impressionStr = [];
      //好评差评中评等
      $scope.evaluateList = 5;
      //已上传照片数量
      $scope.imageCount = 0;
      //选择的照片列表
      $scope.imageList = [];
      //传到后台的图片参数列表
      imageParams = [];
      //提交按钮是否可点击
      $scope.canCommit = false;
      $scope.init();
    });
  }
]);

APP.service('publicationEvaluationService', ['$http', 'UrlService', function($http, UrlService) {
  //上传图片评论
  this.uploadImage = function() {
    return UrlService.getUrl('UPLOAD_ASSESS_IMG_NEW');
  };
  //敏感词校验
  this.checkAssessText = function(checkWord) {
    var params = {
      checkword: checkWord,
      noLoading: true
    };
    return $http.get(UrlService.getUrl('CHECK_ASSESS_TEXT'), params);
  };
  //初始化接口
  this.evaluationInit = function(cOrderSn) {
    var params = {
      cOrderSn: cOrderSn
    };
    return $http.get(UrlService.getUrl('EVALUCTION_NEW'), params);
  };
  //提交评价接口
  this.submitEvaluationNew = function(cOrderSn, commentContent, star, productStar, serviceStar, shippingStar, fileIds, impressions, isMeOnly, isStoreByuer) {
    if (isMeOnly||isStoreByuer) {
      var params = {
        cOrderSn: cOrderSn,
        commentContent: commentContent,
        star: star,
        productStar: productStar,
        serviceStar: serviceStar,
        shippingStar: shippingStar,
        fileIds: fileIds,
        impressions: impressions
      };
    } else {
      params = {
        cOrderSn: cOrderSn,
        commentContent: commentContent,
        star: star
      };
    }
    return $http({
      method: 'POST',
      url: UrlService.getUrl('SUBMIT_EVALUCTION_NEW'),
      params: params
    });
  };
}]);

/**
 * 评星指令。实现五星评分
 */
APP.directive('commentBarNew', [function() {
  return {
    restrict: 'E',
    template: '<div>\n        <img ng-click = "comment(0)" ng-src=\'{{commentValue>=1?"http://cdn09.ehaier.com/shunguang/H5/www/img/ic_eva_unselected.png":"http://cdn09.ehaier.com/shunguang/H5/www/img/ic_eva_selected.png"}}\' >\n        <img ng-click = "comment(1)" ng-src=\'{{commentValue>=2?"http://cdn09.ehaier.com/shunguang/H5/www/img/ic_eva_unselected.png":"http://cdn09.ehaier.com/shunguang/H5/www/img/ic_eva_selected.png"}}\' >\n        <img ng-click = "comment(2)" ng-src=\'{{commentValue>=3?"http://cdn09.ehaier.com/shunguang/H5/www/img/ic_eva_unselected.png":"http://cdn09.ehaier.com/shunguang/H5/www/img/ic_eva_selected.png"}}\' >\n        <img ng-click = "comment(3)" ng-src=\'{{commentValue>=4?"http://cdn09.ehaier.com/shunguang/H5/www/img/ic_eva_unselected.png":"http://cdn09.ehaier.com/shunguang/H5/www/img/ic_eva_selected.png"}}\' >\n        <img ng-click = "comment(4)" ng-src=\'{{commentValue>=5?"http://cdn09.ehaier.com/shunguang/H5/www/img/ic_eva_unselected.png":"http://cdn09.ehaier.com/shunguang/H5/www/img/ic_eva_selected.png"}}\' >\n      </div>',
    replace: true,
    scope: {
      commentValue: '=commentValue', //绑定到value属性上
      commentChange: '&commentChange' //外部方法
    },
    link: function(scope, element, attr) {
      /*星标点击事件*/
      scope.comment = function(index) {
        scope.commentValue = index + 1; //全颗星算法
        scope.commentChange();
      };
    }
  }
}]);
