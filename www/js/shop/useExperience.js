APP.controller('useExperienceController', ['$scope', '$stateParams', '$timeout', '$ionicLoading', 'PopupService', '$state', '$ionicHistory', '$rootScope', '$localstorage', '$interval', 'useExperienceService', 'publicationEvaluationService','$ionicPopup',
  function($scope, $stateParams, $timeout, $ionicLoading, PopupService, $state, $ionicHistory, $rootScope, $localstorage, $interval, useExperienceService, publicationEvaluationService,$ionicPopup) {
    window.onerror = function(errMsg, scriptURI, lineNumber, columnNumber, errorObj) {
      setTimeout(function() {
        var rst = {
          "错误信息：": errMsg,
          "出错文件：": scriptURI,
          "出错行号：": lineNumber,
          "出错列号：": columnNumber,
          "错误详情：": errorObj
        };

        // alert('出错了，下一步将显示错误信息');
        // alert(JSON.stringify(rst, null, 10));
      });
    };
    document.querySelector('#file').addEventListener('change', function() {
      var that = this;
      lrz(that.files[0], {
          width: 800
        })
        .then(function(rst) {
          $scope.$apply(function() {
            if ($scope.imageCount >= 5) {
              PopupService.showToast('最多上传5张图片');
            } else {
              $scope.imageList.push(rst.base64);
              fileIds.push(rst.base64.replace("base64,", "base64-"));
              $scope.imageCount++;
            }
          });
        });
    });

    var impressions = [];
    var fileIds;
    var isCanSubit = true;
    //已上传照片数量
    $scope.imageCount = 0;
    //选择的照片列表
    $scope.imageList = [];
    $scope.isCanComment = true; //是否可以评论
    $scope.VCodeTips = '获取验证码'; //是否可以点击获取验证码
    $scope.canGetVcode = true; //是否可以点击获取验证码
    //用户评价所需信息
    $scope.userInfo = {
      mobile: '', //手机号
      captcha: '', //图形验证码
      verificationCode: '' //短信验证码
    };
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
    // 删除图片提示
    $scope.removeImage = function(index) {
      var confirmPopup = $ionicPopup.confirm({
        template: '您确认要删除吗?',
        cancelText: '否',
        cssClass: 'confirmDelete',
        okText: '是'
      });
      confirmPopup.then(function(res) {
        if (res) {
          $scope.imageList.splice(index, 1);
          fileIds.splice(index, 1);
          $scope.imageCount--;
        } else {}
      });
    };

    $scope.isChecked = function(index) {
      if ($scope.impressionArr.indexOf(index) != -1) {
        return true;
      } else {
        return false;
      }
    }

    //提交评论
    $scope.submitEvaluation = function() {
      if ($scope.commentObj.commentTt.length < 2) {
        PopupService.showToast('请输入2～500字的评价！');
      } else if ($scope.userInfo.mobile.length == 0) {
        PopupService.showToast('请输入手机号');
      } else if (!(/^1[34578]\d{9}$/.test($scope.userInfo.mobile))) {
        PopupService.showToast('请输入正确的手机号格式');
      } else if ($scope.userInfo.verificationCode.length == 0) {
        PopupService.showToast('请输入短信验证码');
      } else {
        publicationEvaluationService.checkAssessText($scope.commentObj.commentTt)
          .success(function(response) {
            if (response) {
              if (isCanSubit) {
                isCanSubit = false;
                useExperienceService.submitBuyerComment($scope.wdOrderSn, $scope.userInfo.mobile, $scope.userInfo.verificationCode, $scope.commentObj.commentTt, fileIds, impressions.join(","), $scope.valueAll.value1, $scope.valueAll.value3, $scope.valueAll.value2)
                  .success(function(response) {
                    isCanSubit = true;
                    if (response.success) {
                      if (response.data) {
                        PopupService.showToastShort('商品评价成功！');
                        $timeout(function() {
                          $rootScope.$broadcast('AFTER_COMMIT');
                          $state.go('evaluationSuccess');
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

    $scope.setImgCaptchaForPhone = function() {
      $scope.identifyCodeImg = useExperienceService.getImgCaptchaNew() + "?rnd=" + Math.random() + "&flag=" + $localstorage.get('sg_login_token_secret').substring(6);
    };

    $scope.getVCode = function() {
      if ($scope.canGetVcode) { //可以获取验证码
        if ($scope.userInfo.mobile.length <= 0) {
          PopupService.showToast('请输入手机号');
        } else if (!(/^1[34578]\d{9}$/.test($scope.userInfo.mobile))) {
          PopupService.showToast('请输入正确的手机号格式');
        } else if ($scope.userInfo.captcha.length <= 0) {
          PopupService.showToast('请输入图形验证码');
        } else {
          useExperienceService.fastLoginCaptchaNew($scope.wdOrderSn, $scope.userInfo.mobile, $scope.userInfo.captcha)
            .success(function(res) {
              if (!res.data) {
                PopupService.showToast(res.message);
              } else {
                $scope.canGetVcode = !$scope.canGetVcode;
                var timeCount = 60;
                $scope.timer = $interval(function() {
                  if ((timeCount - 1) < 0) {
                    $scope.VCodeTips = '获取验证码';
                    $interval.cancel($scope.timer);
                    $scope.canGetVcode = true;
                  } else {
                    timeCount--;
                    $scope.VCodeTips = timeCount + 's' + '后可重发 ';
                  }
                }, 1000);
              }
            });
        }
      }
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

    $scope.useExperienceInit = function(cOrderSn) {
      useExperienceService.userCommentPage(cOrderSn)
        .success(function(response) {
          if (response.success) {
            $scope.productObj = response.data.productInfo;
            $scope.impressionStr = response.data.impression;
            $scope.isCanComment = response.data.status;
          } else {
            PopupService.showToast(response.message);
          }
        });
    };

    $scope.$on('$ionicView.beforeEnter', function() {
      fileIds = [];
      isCanSubit = true;
      $interval.cancel($scope.timer);
      $scope.productObj = [];
      $scope.impressionStr = [];
      $interval.cancel($scope.timer);
      //网单号
      $scope.wdOrderSn = $stateParams.cOrderSn;
      $scope.useExperienceInit($scope.wdOrderSn);
      $scope.setImgCaptchaForPhone();
      //买家印象id
      impressions = [];
      //文本
      $scope.commentObj = {
          commentTt: ""
        }
        //星级
      $scope.valueAll = {
        value1: 5,
        value2: 5,
        value3: 5
      };
      //买家印象
      $scope.impressionArr = [];
      $scope.impressionStr = [];
      //提交按钮是否可点击
      $scope.canCommit = false;
    });
    $scope.$on('$ionicView.beforeLeave', function() {
      $interval.cancel($scope.timer);
    });
  }
]);

APP.service('useExperienceService', ['$http', 'UrlService', function($http, UrlService) {
  //获取图片验证码
  this.getImgCaptchaNew = function() {
    return UrlService.getUrl('GET_IMG_CAPTCHA_NEW');
  };
  //获取短信验证码
  this.fastLoginCaptchaNew = function(cOrderSn, mobile, captcha) {
    var params = {
      cOrderSn: cOrderSn,
      mobile: mobile,
      imgCaptcha: captcha
    };
    return $http({
      method: 'GET',
      url: UrlService.getUrl('FAST_LOGIN_CAPTCHA_COMMENT'),
      params: params
    })
  };
  //获取短信验证码
  this.userCommentPage = function(cOrderSn) {
    var params = {
      cOrderSn: cOrderSn
    };
    return $http.get(UrlService.getUrl('USER_COMMENT_PAGE'), params);
  };
  //提交评价接口
  this.submitBuyerComment = function (cOrderSn, mobile, mobileCode, userCommentContent, imageFile, impressions, productStar, serviceStar, shippingStar) {
    var params = {
      cOrderSn: cOrderSn,
      mobile: mobile,
      mobileCode: mobileCode,
      userCommentContent: userCommentContent,
      imageFile: imageFile,
      impressions: impressions,
      productStar: productStar,
      serviceStar: serviceStar,
      shippingStar: shippingStar
    };
    return $http({
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      url: UrlService.getUrl('SUBMIT_BUYER_COMMENT'),
      transformRequest: function(obj) {
        var str = [];
        for (var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
      },
      data: params
    });
  };
}]);
