/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/3/17
 * describe：订单评价控制器
 **/
APP.controller('AssessController', ['$scope', 'AssessService', '$stateParams', '$timeout', 'PlatformService', '$ionicLoading', 'PopupService', '$state', '$ionicHistory', '$rootScope',
  function ($scope, AssessService, $stateParams, $timeout, PlatformService, $ionicLoading, PopupService, $state, $ionicHistory, $rootScope) {

    /** 变量声明 **/
    $scope.orderId = $stateParams.orderId;//订单唯一性标识
    $scope.cOrderSn = $stateParams.cOrderSn;//网单号
    $scope.assessData = [];//评价商品的数据
    $scope.parameter = [];//参数数组
    $scope.isAssessed = false;
    $scope.cOrderSnData = [];
    $scope.value = [];
    $scope.click = [];
    $scope.fileIds=[];
    $scope.click[0] = {
      isClickGood: false,
      isClickMiddle: false,
      isClickBad: false
    };

    //星级
    $scope.iconImageData = [];
    $scope.iconImageData[0] = {
      imgUrl1: '',
      imgUrl2: '',
      imgUrl3: '',
      imgUrl4: '',
      imgUrl5: ''
    };
    $scope.value[0] = {
      value1: 0,
      value2: 0,
      value3: 0,
      comment: '',
      evalution: 0
    };

    /** 方法 **/
    $scope.init = function (orderId, cOrderSn) {
      $scope.show = false;
      AssessService.getAssess(orderId, cOrderSn)
        .success(function (response, status, headers, config) {
          if (response.success) { //assessDataLength 该订单 商品数
            $scope.isAssessed = !response.data.products||response.data.products.length==0;
            $scope.assessDataLength = response.data.products.length;
            $scope.assessData = response.data.products;
            for (var i = 0; i < $scope.assessDataLength; i++) {
              $scope.cOrderSnData.push({
                cOrderSn: response.data.products[i].cOrderSn
              });
              $scope.click[i] = {
                isClickGood: false,
                isClickMiddle: false,
                isClickBad: false
              };
              //星级
              $scope.value[i] = {
                value1: 0,
                value2: 0,
                value3: 0,
                comment: '',
                evalution: 0
              };
              $scope.iconImageData[i] = {
                imgUrl1: '',
                imgUrl2: '',
                imgUrl3: '',
                imgUrl4: '',
                imgUrl5: ''
              };
            }
            $scope.addTime = response.data.addTime;
            $scope.ckCode = response.data.ckCode;
            $scope.consignee = response.data.consignee;
            $scope.memberId = response.data.memberId;
            $scope.memberName = response.data.memberName;
            $scope.mobile = response.data.mobile;
          } else {
            $scope.isAssessed = true;
          }
        })
        .error(function () {
          $scope.isAssessed = true;
        });
    };

    //好评、中评、差评
    $scope.assessType = function (obj, index) {
      if (obj == 0) {
        $scope.click[index].isClickGood = !$scope.click[index].isClickGood;
        $scope.click[index].isClickMiddle = false;
        $scope.click[index].isClickBad = false;
      } else if (obj == 1) {
        $scope.click[index].isClickMiddle = !$scope.click[index].isClickMiddle;
        $scope.click[index].isClickGood = false;
        $scope.click[index].isClickBad = false;
      } else if (obj == 2) {
        $scope.click[index].isClickBad = !$scope.click[index].isClickBad;
        $scope.click[index].isClickMiddle = false;
        $scope.click[index].isClickGood = false;
      }
      angular.forEach($scope.click, function (data, index, array) {
        if (data.isClickGood) {
          $scope.value[index].evalution = 1;
        } else if (data.isClickMiddle) {
          $scope.value[index].evalution = 2;
        } else if (data.isClickBad) {
          $scope.value[index].evalution = 3;
        }
      });
    };
    //参数存储
    $scope.setParams = function () {
      $scope.parameter = [];//参数数组
      for (var i = 0; i < $scope.assessDataLength; i++) {
        $scope.parameter.push({
          addTime: $scope.addTime,
          assString: $scope.value[i].comment,
          cOrderSn: $scope.cOrderSnData[i].cOrderSn,
          ckCode: $scope.ckCode,
          consignee: $scope.consignee,
          evalution: $scope.value[i].evalution,
          memberId: $scope.memberId,
          memberName: $scope.memberName,
          mobile: $scope.mobile,
          productScore: $scope.value[i].value1,
          serviceScore: $scope.value[i].value3,
          shippingScore: $scope.value[i].value2,
          fileUrl1: $scope.iconImageData[i].imgUrl1,
          fileUrl2: $scope.iconImageData[i].imgUrl2,
          fileUrl3: $scope.iconImageData[i].imgUrl3,
          fileUrl4: $scope.iconImageData[i].imgUrl4,
          fileUrl5: $scope.iconImageData[i].imgUrl5
        })
      }
    };

    //提交评论
    $scope.submitAssess = function () {
      for (var j = 0; j < $scope.assessDataLength; j++) {
        if (!(/^.{5,300}$/.test($scope.value[j].comment))) {
          if ($scope.assessDataLength == 1) {
            PopupService.showToast('请输入5～300字的评价！');
          }
          else {
            PopupService.showToast('请于第' + (j + 1) + '件商品输入5～300字的评价！');
          }
          return;
        } else if ($scope.value[j].evalution == 0) {
          if ($scope.assessDataLength == 1) {
            PopupService.showToast('请选择评价！');
          }
          else {
            PopupService.showToast('请于第' + (j + 1) + '件商品选择评价！');
          }
          return;
        } else if ($scope.value[j].value1 == 0) {
          if ($scope.assessDataLength == 1) {
            PopupService.showToast('请选择商品评分！');
          }
          else {
            PopupService.showToast('请于第' + (j + 1) + '件商品选择商品评分！');
          }
          return;
        } else if ($scope.value[j].value2 == 0) {
          if ($scope.assessDataLength == 1) {
            PopupService.showToast('请选择物流评分！');
          }
          else {
            PopupService.showToast('请于第' + (j + 1) + '件商品选择物流评分！');
          }
          return;
        } else if ($scope.value[j].value3 == 0) {
          if ($scope.assessDataLength == 1) {
            PopupService.showToast('请选择服务评分！');
          }
          else {
            PopupService.showToast('请于第' + (j + 1) + '件商品选择服务评分！');
          }
          return;
        }
      }
      var str = '';
      for (var k = 0; k < $scope.assessDataLength; k++) {
        str = str + $scope.value[k].comment;
      }

      AssessService.checkAssessText(str)
        .success(function (response) {
          if (response) {
            PopupService.showToast('成功');
            $scope.setParams();
            AssessService.submitAssessInfo($scope.parameter,$scope.fileIds)
              .success(function (response) {
                if (response.success) {
                  PopupService.showToastShort('商品评价成功！');
                  $timeout(function () {
                    $rootScope.$broadcast('AFTER_COMMIT');
                    $ionicHistory.goBack();
                  }, 1000);
                }
                else if (response.message) {
                  PopupService.showToast(response.message);
                }
                else {
                  PopupService.showToast('提交失败！');
                }
              });
          } else {
            PopupService.showToast('您的评论里面包含敏感词！');
          }
        });

    };

    //上传图片  index 为一个订单的 第几个 商品的索引
    $scope.uploadImg = function (index) {

      if (PlatformService.getPlatform() == 'APP') {
        //Show the action sheet
        var options = {
          title: '照片选取方式：',
          buttonLabels: ['拍照', '从相册选取'],
          addCancelButtonWithLabel: '取消',
          androidEnableCancelButton: true
        };
        var callback = function (buttonIndex) {
          if (buttonIndex == 1) {
            navigator.camera.getPicture(getSuccess, getFail, {
              quality: 50,
              destinationType: Camera.DestinationType.FILE_URI,
              saveToPhotoAlbum: true,
              allowEdit: true
            });
            function getSuccess(imageData) {
              $scope.iconImage = imageData;
              $timeout(function () {
                  $scope.iconImage = imageData;
                }, 200
              );
              //调用图片上传接口
              var win = function (r) {
                $ionicLoading.hide();
                PopupService.showToast('上传成功');
                var jsonResp = JSON.parse(r.response);
                var fileIdsR = jsonResp.fileIds;
                for (var i=0;i<fileIdsR.length;i++) {
                  $scope.fileIds.push(fileIdsR[i]);
                }
                var iconImageR = jsonResp.urls;
                if ($scope.iconImageData[index].imgUrl1 == '') {
                  $scope.iconImageData[index].imgUrl1 = iconImageR[0];
                } else if ($scope.iconImageData[index].imgUrl2 == '') {
                  $scope.iconImageData[index].imgUrl2 = iconImageR[0];
                } else if ($scope.iconImageData[index].imgUrl3 == '') {
                  $scope.iconImageData[index].imgUrl3 = iconImageR[0];
                } else if ($scope.iconImageData[index].imgUrl4 == '') {
                  $scope.iconImageData[index].imgUrl4 = iconImageR[0];
                } else if ($scope.iconImageData[index].imgUrl5 == '') {
                  $scope.iconImageData[index].imgUrl5 = iconImageR[0];
                } else {
                  PopupService.showToast('最多只能输入5张照片！');
                }
              };
              var fail = function (error) {
                $ionicLoading.hide();
                PopupService.showToast('上传失败');
              };
              var options = new FileUploadOptions();
              options.fileKey = 'imageFile';
              options.fileName = $scope.iconImage.substr($scope.iconImage.lastIndexOf('/') + 1);
              options.mimeType = 'image/jpeg';
              var params = {};
              // params.userName = $scope.accountMessage;
              options.params = params;
              var ft = new FileTransfer();
              ft.upload($scope.iconImage, encodeURI(AssessService.uploadImage()), win, fail, options);
              var par = {
                template: '<div><img ng-src="{{imgBaseURL}}img/ic_refresh_01.gif" style="width: 65px;"/></div>'
              };
              $ionicLoading.show(par);
            }

            function getFail(message) {

            }
          } else if (buttonIndex == 2) {
            console.log('从相册中获取');
            navigator.camera.getPicture(getSuccessTwo, getFailTwo, {
              quality: 50,
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
              allowEdit: true
            });
            function getSuccessTwo(imageURI) {
              $scope.iconImage = imageURI;
              $timeout(function () {
                  $scope.iconImage = imageURI;
                }, 200
              );
              //调用图片上传接口
              var win = function (r) {
                $ionicLoading.hide();
                PopupService.showToast('上传成功');
                var jsonResp = JSON.parse(r.response);
                var fileIdsR2 = jsonResp.fileIds;
                for (var i=0;i<fileIdsR2.length;i++) {
                  $scope.fileIds.push(fileIdsR2[i]);
                }
                var iconImageR = jsonResp.urls;
                if ($scope.iconImageData[index].imgUrl1 == '') {
                  $scope.iconImageData[index].imgUrl1 = iconImageR[0];
                } else if ($scope.iconImageData[index].imgUrl2 == '') {
                  $scope.iconImageData[index].imgUrl2 = iconImageR[0];
                } else if ($scope.iconImageData[index].imgUrl3 == '') {
                  $scope.iconImageData[index].imgUrl3 = iconImageR[0];
                } else if ($scope.iconImageData[index].imgUrl4 == '') {
                  $scope.iconImageData[index].imgUrl4 = iconImageR[0];
                } else if ($scope.iconImageData[index].imgUrl5 == '') {
                  $scope.iconImageData[index].imgUrl5 = iconImageR[0];
                } else {
                  PopupService.showToast('最多只能输入5张照片！');
                }
              };
              var fail = function (error) {
                PopupService.showToast('上传失败');
                $ionicLoading.hide();
              };
              var options = new FileUploadOptions();
              options.fileKey = 'imageFile';
              options.fileName = $scope.iconImage.substr($scope.iconImage.lastIndexOf('/') + 1);
              options.mimeType = 'image/jpeg';
              var params = {};
              // params.userName = $scope.accountMessage;
              options.params = params;
              var ft = new FileTransfer();
              ft.upload($scope.iconImage, encodeURI(AssessService.uploadImage()), win, fail, options);
              var par = {
                template: '<div><img ng-src="{{imgBaseURL}}img/ic_refresh_01.gif" style="width: 65px;"/></div>'
              };
              $ionicLoading.show(par);
            }

            function getFailTwo(message) {

            }
          }
        };
        window.plugins.actionsheet.show(options, callback);
        //$timeout(function () {
        //  window.plugins.actionsheet.hide();
        //}, 5000);
      } else {
        PopupService.showToast('请下载客户端实现上传图片功能');
      }
    };

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.orderId = $stateParams.orderId;//订单唯一性标识
      $scope.cOrderSn = $stateParams.cOrderSn;//网单号
      $scope.init($scope.orderId, $scope.cOrderSn);
    });
    $scope.showLarge = function (img) {
      $scope.show = true;
      $scope.largeImg = img;
    };
    $scope.closeImg = function () {
      $scope.show = false;
    };

    $scope.deleteImg = function () {
      $scope.show = false;
      var indexImg = 0;
      for (var x = 0; x < $scope.assessDataLength; x++) {
        if ($scope.largeImg == $scope.iconImageData[x].imgUrl1) {
          indexImg = x;
          break;
        }
        if ($scope.largeImg == $scope.iconImageData[x].imgUrl2) {
          indexImg = x;
          break;
        }
        if ($scope.largeImg == $scope.iconImageData[x].imgUrl3) {
          indexImg = x;
          break;
        }
        if ($scope.largeImg == $scope.iconImageData[x].imgUrl4) {
          indexImg = x;
          break;
        }
        if ($scope.largeImg == $scope.iconImageData[x].imgUrl5) {
          indexImg = x;
          break;
        }
      }

      if ($scope.largeImg == $scope.iconImageData[indexImg].imgUrl1) {
        $scope.iconImageData[indexImg].imgUrl1 = $scope.iconImageData[indexImg].imgUrl2;
        $scope.iconImageData[indexImg].imgUrl2 = $scope.iconImageData[indexImg].imgUrl3;
        $scope.iconImageData[indexImg].imgUrl3 = $scope.iconImageData[indexImg].imgUrl4;
        $scope.iconImageData[indexImg].imgUrl4 = $scope.iconImageData[indexImg].imgUrl5;
        $scope.iconImageData[indexImg].imgUrl5 = '';
      } else if ($scope.largeImg == $scope.iconImageData[indexImg].imgUrl2) {
        $scope.iconImageData[indexImg].imgUrl2 = $scope.iconImageData[indexImg].imgUrl3;
        $scope.iconImageData[indexImg].imgUrl3 = $scope.iconImageData[indexImg].imgUrl4;
        $scope.iconImageData[indexImg].imgUrl4 = $scope.iconImageData[indexImg].imgUrl5;
        $scope.iconImageData[indexImg].imgUrl5 = '';
      } else if ($scope.largeImg == $scope.iconImageData[indexImg].imgUrl3) {
        $scope.iconImageData[indexImg].imgUrl3 = $scope.iconImageData[indexImg].imgUrl4;
        $scope.iconImageData[indexImg].imgUrl4 = $scope.iconImageData[indexImg].imgUrl5;
        $scope.iconImageData[indexImg].imgUrl5 = '';
      } else if ($scope.largeImg == $scope.iconImageData[indexImg].imgUrl4) {
        $scope.iconImageData[indexImg].imgUrl4 = $scope.iconImageData[indexImg].imgUrl5;
        $scope.iconImageData[indexImg].imgUrl5 = '';
      } else if ($scope.largeImg == $scope.iconImageData[indexImg].imgUrl5) {
        $scope.iconImageData[indexImg].imgUrl5 = '';
      }
    };

    $scope.goBack = function () {
      var showBackAlert = false;
      for (var y = 0; y < $scope.assessDataLength; y++) {
        if ($scope.iconImageData[y].imgUrl1 != '' || $scope.value[y].value1 != 0 || $scope.value[y].value2 != 0 || $scope.value[y].value3 != 0
          || $scope.value[y].comment != '' || $scope.value[y].evalution != 0) {
          var showBackAlert = true;
          break;
        }
      }

      if (showBackAlert) {
        var message = '您的评价未完成，您确定离开吗？';
        PopupService.showConfirm('', message, function (res) {
          if (res) {
            console.log('离开评价');
            $ionicHistory.goBack();
          } else {
            console.log('取消');
          }
        })
      }
      else {
        $ionicHistory.goBack();
      }
    }
  }]);


/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016-03-21
 * describe：订单评价Service
 **/
APP.service('AssessService', ['$http', 'UrlService', function ($http, UrlService) {
  //获取评论商品信息
  this.getAssess = function (orderId, cOrderSn) {
    var params = {
      orderId: orderId,
      cOrderSn: cOrderSn
    };
    return $http.get(UrlService.getUrl('GET_ASSESS'), params);
  };
  //敏感词校验
  this.checkAssessText = function (checkWord) {
    var params = {
      checkword: checkWord,
      noLoading: true
    };
    return $http.get(UrlService.getUrl('CHECK_ASSESS_TEXT'), params);
  };
  //提交评论
  this.submitAssessInfo = function (parameter,fileIds) {
    fileIds = fileIds.join();
    var params = {
      assessList:JSON.stringify(parameter),
      fileIds:fileIds
    };
    return $http({
      method:'POST',
      url:UrlService.getUrl('SUBMIT_ASSESS'),
      params: params
    });
//  return $http({
//    method: 'POST',
//    url: UrlService.getUrl('SUBMIT_ASSESS'),
//    data: JSON.stringify(parameter)
//  });
  };
  //上传图片评论
  this.uploadImage = function () {
    return UrlService.getUrl('UPLOAD_ASSESS_IMG');
  };
}])
;


/**
 * 评星指令。实现五星评分
 */
APP.directive('commentBar', [function () {
  return {
    restrict: 'E',
    template: '<div class="col padding-top-bottom-0">' +
    '<img class="padding-left-10" width="20%" ng-click="comment(0)" ng-src="{{commentValue>=1?\'http://cdn09.ehaier.com/shunguang/H5/www/img/ic_eva_unselected.png\':\'http://cdn09.ehaier.com/shunguang/H5/www/img/ic_eva_selected.png\'}}">' +
    '<img class="padding-left-10" width="20%" ng-click="comment(1)" ng-src="{{commentValue>=2?\'http://cdn09.ehaier.com/shunguang/H5/www/img/ic_eva_unselected.png\':\'http://cdn09.ehaier.com/shunguang/H5/www/img/ic_eva_selected.png\'}}">' +
    '<img class="padding-left-10" width="20%" ng-click="comment(2)" ng-src="{{commentValue>=3?\'http://cdn09.ehaier.com/shunguang/H5/www/img/ic_eva_unselected.png\':\'http://cdn09.ehaier.com/shunguang/H5/www/img/ic_eva_selected.png\'}}">' +
    '<img class="padding-left-10" width="20%" ng-click="comment(3)" ng-src="{{commentValue>=4?\'http://cdn09.ehaier.com/shunguang/H5/www/img/ic_eva_unselected.png\':\'http://cdn09.ehaier.com/shunguang/H5/www/img/ic_eva_selected.png\'}}">' +
    '<img class="padding-left-10" width="20%" ng-click="comment(4)" ng-src="{{commentValue>=5?\'http://cdn09.ehaier.com/shunguang/H5/www/img/ic_eva_unselected.png\':\'http://cdn09.ehaier.com/shunguang/H5/www/img/ic_eva_selected.png\'}}">' +
    '</div>',
    replace: true,
    scope: {
      commentValue: '=commentValue',//绑定到value属性上
      commentChange: '&commentChange'//外部方法
    },
    link: function (scope, element, attr) {
      /*星标点击事件*/
      scope.comment = function (index) {
        scope.commentValue = index + 1;//全颗星算法
        scope.commentChange();
      };
    }
  }
}]);
