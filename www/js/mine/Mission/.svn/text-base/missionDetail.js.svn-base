/**
 * creator:daba
 * create time:2017/3/22
 * describe：missionDetailController 任务详情控制器
 **/
APP.controller('MissionDetailController', ['$q', '$scope', 'UrlService', 'MissionDetailService', 'PopupService', '$rootScope', '$stateParams', 'CreditService', 'UserService',
  function ($q, $scope, UrlService, MissionDetailService, PopupService, $rootScope, $stateParams, CreditService, UserService) {
    $scope.hasQQ = false;
    $scope.isIOS = ionic.Platform.isIOS();
    $scope.UserTaskStatus = null;
    $scope.needTake = '';
    //  $scope.checkImage = function(index){
    //    console.log(index,$scope.checkImgIndex);
    //    if($scope.checkImgIndex[index]==0){
    //      $scope.checkImgIndex[index]=1;
    //      $scope.checkImg.push($scope.checkImgIndex[index]);//选中图片 压入 选中图片数组
    //    }else{
    //      $scope.checkImgIndex[index]=0;
    //      $scope.checkImg.splice($scope.checkImgIndex[index],1);//把 该图片从 选中图片数组删除
    //    }
    //  };
    $scope.hideblackCover = function () {
      $scope.showShare = false;
    };
    $scope.savaEditContent = function (text) {
      $scope.editableContent = text;
    }

    function getQrCode(reqUrl) {
      var deferred = $q.defer();
      MissionDetailService.getQrCodeUrl(reqUrl)
        .success(function (response) {
          deferred.resolve(response.data);
        })
      return deferred.promise;
    }

    function shareToPlatform(index, sharePlatform,qrUrl) {
      //目前任务目标不存在多个的情况，因此只取得第一个任务目标回传
      var taskDestId = $scope.missionContent.taskDestWithStatusVOs[0].id;
      var memberId = UserService.getUser().mid;
      var name = $scope.name,
        editContent = $scope.editableContent || $scope.editContent,
        checkImg = $scope.checkImg, //选中图片数组
        checkImgUrl = ($scope.imgArr && $scope.imgArr.length > 0) ? $scope.imgArr[0] : null;
      if (window.umeng) {
        if (window.cordova) {
          cordova.plugins.clipboard.copy(editContent); //把 可编辑内容粘贴至 剪贴板
        }

        //此处预留给多图分享使用
        if (index == -1) {
          window.umeng.iosPlatformShared(name, editContent, checkImgUrl, [checkImgUrl], 0, qrUrl, function () {

          });
        }
        if ($scope.taskType == 4) { //链接分享
          var url = $scope.configData.linkUrl;
          if (checkImgUrl == null) {
            checkImgUrl = "http://www.ehaier.com/mstatic/wd/v2/img/icons/ic_default_avatar.png";
          }
          if (index == 0) {
            // window.umeng.shareToSina(name, editContent, urls, null, 1);
            window.umeng.shareToSina(name, editContent, checkImgUrl, url, 0, null, function () {
              //只有分享奖励金币数大于0 并且还没有分享成功

              MissionDetailService.missionShare($scope.taskType, taskDestId, '微博')
                .success(function () {
                  $rootScope.shareSucBack = true;
                  $scope.$ionicGoBack();
                  // $scope.$emit('missionShareSuc',{taskId:$scope.taskId,isFinished:$scope.isFinished,taskAwards:$scope.taskAwards.awardNum});
                })

            });

          } else if (index == 1) {
            //window.umeng.shareToWechatSession(name, editContent, checkImg[0]s, url, 1);
            window.umeng.shareToWechatSession(name, editContent, checkImgUrl, url, 0, null, function () {
              //只有分享奖励金币数大于0 并且还没有分享成功

              MissionDetailService.missionShare($scope.taskType, taskDestId, '微信')
                .success(function () {
                  $rootScope.shareSucBack = true;
                  $scope.$ionicGoBack();
                  //  $scope.$emit('missionShareSuc',{taskId:$scope.taskId,isFinished:$scope.isFinished,taskAwards:$scope.taskAwards.awardNum});
                })

            });

          } else if (index == 2) {
            //window.umeng.shareToWechatTimeline(name, editContent, checkImg[0]s, url, 1);
            window.umeng.shareToWechatTimeline(name, editContent, checkImgUrl, url, 0, null, function () {
              //只有分享奖励金币数大于0 并且还没有分享成功

              MissionDetailService.missionShare($scope.taskType, taskDestId, '朋友圈')
                .success(function () {
                  $rootScope.shareSucBack = true;
                  $scope.$ionicGoBack();
                  //  $scope.$emit('missionShareSuc',{taskId:$scope.taskId,isFinished:$scope.isFinished,taskAwards:$scope.taskAwards.awardNum});
                })

            });
          } else if (index == 3) {
            window.umeng.shareToQQ(name, editContent, checkImgUrl, url, 0, null, function () {
              //只有分享奖励金币数大于0 并且还没有分享成功
              MissionDetailService.missionShare($scope.taskType, 'QQ')
                .success(function () {
                  $scope.init();
                });
            });


          } else if (index == 4) {
            window.umeng.shareToQzone(name, editContent, checkImgUrl, url, 0, null, function () {
              //只有分享奖励金币数大于0 并且还没有分享成功
              MissionDetailService.missionShare($scope.taskType, 'QQ空间')
                .success(function () {
                  $scope.init();
                })
            });
          }
        } else if ($scope.taskType == 3) { //分享商品
          var shareContent = $scope.configData.productTitle || $scope.configData.productName;
          var shareUrl = UrlService.getShareLinkHeader() + 'productDetail/' + $scope.configData.productId + '/' + $scope.configData.o2oType +
            '/' + $scope.configData.fromType + '/' + memberId + '/' + memberId;
          if (index == 0) {
            // window.umeng.shareToSina(name, shareContent, urls, null, 1);
            window.umeng.shareToSina($scope.configData.productName, shareContent, checkImgUrl, shareUrl, 0, qrUrl, function () {
              //只有分享奖励金币数大于0 并且还没有分享成功

              MissionDetailService.missionShare($scope.taskType, taskDestId, '微博')
                .success(function () {
                  $rootScope.shareSucBack = true;
                  $scope.$ionicGoBack();
                  //  $scope.$emit('missionShareSuc',{taskId:$scope.taskId,isFinished:$scope.isFinished,taskAwards:$scope.taskAwards.awardNum});
                })

            });
          } else if (index == 1) {
            //window.umeng.shareToWechatSession(name, shareContent, urls, url, 1);
            window.umeng.shareToWechatSession($scope.configData.productName, shareContent, checkImgUrl, shareUrl, 0, qrUrl, function () {
              //只有分享奖励金币数大于0 并且还没有分享成功

              MissionDetailService.missionShare($scope.taskType, taskDestId, '微信')
                .success(function () {
                  $rootScope.shareSucBack = true;
                  $scope.$ionicGoBack();
                  //  $scope.$emit('missionShareSuc',{taskId:$scope.taskId,isFinished:$scope.isFinished,taskAwards:$scope.taskAwards.awardNum});
                })

            });
          } else if (index == 2) {
            //window.umeng.shareToWechatTimeline(name, shareContent, urls, url, 1);
            window.umeng.shareToWechatTimeline($scope.configData.productName, shareContent, checkImgUrl, shareUrl, 0, qrUrl, function () {
              //只有分享奖励金币数大于0 并且还没有分享成功

              MissionDetailService.missionShare($scope.taskType, taskDestId, '朋友圈')
                .success(function () {
                  $rootScope.shareSucBack = true;
                  $scope.$ionicGoBack();
                  //  $scope.$emit('missionShareSuc',{taskId:$scope.taskId,isFinished:$scope.isFinished,taskAwards:$scope.taskAwards.awardNum});
                })

            });
          } else if (index == 3) {
            window.umeng.shareToQQ($scope.configData.productName, shareContent, checkImgUrl, shareUrl, 0, qrUrl, function () {
              //只有分享奖励金币数大于0 并且还没有分享成功

              MissionDetailService.missionShare($scope.taskType, taskDestId, 'QQ')
                .success(function () {
                  $rootScope.shareSucBack = true;
                  $scope.$ionicGoBack();
                  //  $scope.$emit('missionShareSuc',{taskId:$scope.taskId,isFinished:$scope.isFinished,taskAwards:$scope.taskAwards.awardNum});
                })
            });
          } else if (index == 4) {
            window.umeng.shareToQzone($scope.configData.productName, shareContent, checkImgUrl, shareUrl, 0, qrUrl, function () {
              //只有分享奖励金币数大于0 并且还没有分享成功

              MissionDetailService.missionShare($scope.taskType, taskDestId, 'QQ空间')
                .success(function () {
                  $rootScope.shareSucBack = true;
                  $scope.$ionicGoBack();
                  //  $scope.$emit('missionShareSuc',{taskId:$scope.taskId,isFinished:$scope.isFinished,taskAwards:$scope.taskAwards.awardNum});
                })
            });
          }
        } else { //单图分享
          if (index == 0) {
            // window.umeng.shareToSina(name, editContent, urls, null, 1);
            window.umeng.shareToSina(name, editContent, checkImgUrl, null, 2, qrUrl, function () {
              //只有分享奖励金币数大于0 并且还没有分享成功

              MissionDetailService.missionShare($scope.taskType, taskDestId, '微博')
                .success(function () {
                  $rootScope.shareSucBack = true;
                  $scope.$ionicGoBack();
                  //  $scope.$emit('missionShareSuc',{taskId:$scope.taskId,isFinished:$scope.isFinished,taskAwards:$scope.taskAwards.awardNum});
                })

            });
          } else if (index == 1) {
            //window.umeng.shareToWechatSession(name, editContent, urls, url, 1);
            window.umeng.shareToWechatSession(name, editContent, checkImgUrl, null, 2, qrUrl, function () {
              //只有分享奖励金币数大于0 并且还没有分享成功

              MissionDetailService.missionShare($scope.taskType, taskDestId, '微信')
                .success(function () {
                  $rootScope.shareSucBack = true;
                  $scope.$ionicGoBack();
                  //  $scope.$emit('missionShareSuc',{taskId:$scope.taskId,isFinished:$scope.isFinished,taskAwards:$scope.taskAwards.awardNum});
                })

            });
          } else if (index == 2) {
            //window.umeng.shareToWechatTimeline(name, editContent, urls, url, 1);
            window.umeng.shareToWechatTimeline(name, editContent, checkImgUrl, null, 2, qrUrl, function () {
              //只有分享奖励金币数大于0 并且还没有分享成功

              MissionDetailService.missionShare($scope.taskType, taskDestId, '朋友圈')
                .success(function () {
                  $rootScope.shareSucBack = true;
                  $scope.$ionicGoBack();
                  //  $scope.$emit('missionShareSuc',{taskId:$scope.taskId,isFinished:$scope.isFinished,taskAwards:$scope.taskAwards.awardNum});
                })

            });
          } else if (index == 3) {
            window.umeng.shareToQQ(name, editContent, checkImgUrl, null, 2, qrUrl, function () {
              //只有分享奖励金币数大于0 并且还没有分享成功

              MissionDetailService.missionShare($scope.taskType, taskDestId, 'QQ')
                .success(function () {
                  $rootScope.shareSucBack = true;
                  $scope.$ionicGoBack();
                  //  $scope.$emit('missionShareSuc',{taskId:$scope.taskId,isFinished:$scope.isFinished,taskAwards:$scope.taskAwards.awardNum});
                })

            });
          } else if (index == 4) {
            window.umeng.shareToQzone(name, editContent, checkImgUrl, null, 2);
            // MissionDetailService.missionShare($scope.taskType, 'QQ空间');
          }
        }
        $scope.showShare = false;
      } else {
        alert('umeng undefined 只能在app分享');
      }
    }
    $scope.goBack = function () {
      $scope.$ionicGoBack();
    }
    $scope.output = function (text) {
      console.log(text);
    }
    $scope.copyLinkUrl = function () {
      if (window.cordova) {
        cordova.plugins.clipboard.copy($scope.linkUrl);
        PopupService.showToastShort('复制成功');
      } else {
        PopupService.showToast('请下载APP执行此操作');
      }
    }
    $scope.copyText = function (text) {
      if (window.cordova) {
        cordova.plugins.clipboard.copy(text);
        PopupService.showToastWithTime('复制成功', 2000);
      } else {
        PopupService.showToast('请下载APP执行此操作');
      }
    }
    $scope.share = function () {
      if (window.umeng) {
        if (window.cordova) {
          cordova.plugins.clipboard.copy($scope.editContent); //把 可编辑内容粘贴至 剪贴板
          if ($rootScope.hasShowPasteHint) {

          } else {
            PopupService.showToastWithTime('请直接粘贴分享文字内容', 2000);
            $rootScope.hasShowPasteHint = true;
          }
        }
        if (window.device && window.device.hasNewShare) {

          // if (!$scope.productModel) {
          //   $scope.showPopup('网络连接失败，请稍后分享');
          //   return;
          // }

          //新分享样式
          $scope.showShare = !$scope.showShare;
          /*********************分享标签－whiteBird end*********************/
        } else {

          //旧分享样式
          if (window.umeng) {
            if (!$scope.missionContent) {
              $scope.showPopup('网络连接失败，请稍后分享');
              return;
            }
            var name = $scope.name,
              editContent = $scope.editContent,
              checkImg = $scope.checkImg, //任务图片数组
              checkImgUrl = $scope.imgArr[0],
              url = UrlService.getShareLinkHeader() + 'missionDetail/' + $scope.taskId;

            if (window.cordova) {
              cordova.plugins.clipboard.copy(editContent); //把 可编辑内容粘贴至 剪贴板
            }
            window.umeng.share(name, editContent, checkImgUrl, url, 2);
          }
        }
      } else {
        PopupService.showAlert('只能在app分享', '抱歉，只能在app分享');
      }

    }
    $scope.shareToPlatform = function (index, sharePlatform) {
      var qrUrl = null;
      var requestUrl = '';
      var memberId = UserService.getUser().mid;
      if ($scope.configData.qrcodeType == 1||$scope.configData.qrcodeType == undefined) { //店铺二维码
        qrUrl = $scope.missionContent.resultMap.qrCode;
        shareToPlatform(index,sharePlatform,qrUrl);
      } else if ($scope.configData.qrcodeType == 2) { //商品二维码
        requestUrl = UrlService.getShareLinkHeader() + 'productDetail/' + $scope.configData.productId + '/' + $scope.configData.o2oType +'/' + $scope.configData.fromType + '/' + memberId + '/' + memberId;
        getQrCode(escape(requestUrl))
          .then(function (res) {
            qrUrl = res;
            shareToPlatform(index,sharePlatform,qrUrl);
          })
      } else if ($scope.configData.qrcodeType == 3) { //招募合伙人二维码
        requestUrl = UrlService.getShareLinkHeader() + 'register/' + '0/' + $scope.missionContent.resultMap.promotionCode;
        getQrCode(escape(requestUrl))
          .then(function (res) {
            qrUrl = res;
            shareToPlatform(index,sharePlatform,qrUrl);
          })
      }else if($scope.configData.qrcodeType == 0){//不需要合成二维码到图片上
        shareToPlatform(index,sharePlatform,null);
      }else{
        shareToPlatform(index,sharePlatform);
      }
    };
    $scope.init = function () {
      MissionDetailService.getMissionDetail($scope.taskId)
        .success(function (response) {
          // debugger;
          if (response.success) {
            console.log(response);
            $scope.UserTaskStatus = response.data.taskInfoWithStatusVO.userTaskStatus;
            $scope.needTake = response.data.taskInfoWithStatusVO.needTake;

            $scope.missionContent = response.data;
            $scope.xyzTaskDestId = $scope.missionContent.taskDestWithStatusVOs[0].id; //添加xyzTaskDestId
            $scope.name = $scope.missionContent.taskInfoWithStatusVO.name; //任务名称
            $scope.taskType = $scope.missionContent.taskInfoWithStatusVO.taskType; //任务类型
            console.log('人物类型--------' + $scope.taskType);
            $scope.isFinished = $scope.missionContent.taskInfoWithStatusVO.isFinished; //任务是否完成
            $scope.configDataStr = $scope.missionContent.taskInfoWithStatusVO.configData; //config数据 字符串
            $scope.configData = JSON.parse($scope.configDataStr); //config数据 对象
            console.log($scope.configData);
            $scope.missionTitleArr = ['', '早安', '晚安', '分享商品', '分享链接', '士兵突击', '图片分享', '晒战绩'];
            $scope.missionTitle = $scope.missionTitleArr[$scope.taskType]; //任务标题
            $scope.time = new Date();
            $scope.editContent = $scope.missionContent.taskInfoWithStatusVO.content; //可编辑内容
            $scope.taskAwards = $scope.missionContent.taskInfoWithStatusVO.taskAwards[0]; //任务奖励
            if ($scope.taskAwards.awardType == 0) {
              $scope.taskAwardsContent = $scope.taskAwards.awardNum + "金币";
            } else if ($scope.taskAwards.awardType == 1) {
              $scope.taskAwardsContent = $scope.taskAwards.awardNum + "积分";
            }
            if ($scope.configData.imageUrls) {
              $scope.imgArr = $scope.configData.imageUrls; //分享的图片
              //初始化所有图片都没有被选中
              // for(var i=0,imgArrLength=$scope.imgArr.length;i<imgArrLength;i++){
              //   $scope.checkImgIndex[i]=0;
              // }
            }
            if ($scope.configData.productName) { //如果是分享商品
              $scope.productName = $scope.configData.productName; //分享商品的名称
            }
            if ($scope.configData.linkUrl) { //如是分享链接
              $scope.linkUrl = $scope.configData.linkUrl; //分享链接的名称
            }
            //根据后台返回的内容设置textarea的高度

          } else {
            console.log('发生未知错误');
          }
        })
        .error(function (error) {
          console.log(error);
        })
    }
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.taskId = $stateParams.taskId;
      //选中的图片下标数组
      $scope.checkImgIndex = [];
      //选中的图片 数组
      $scope.checkImh = [];
      $scope.init();
    })
  }
]);
APP.service('MissionDetailService', ['$http', 'UrlService', 'IMService', function ($http, UrlService, IMService) {
  this.getMissionDetail = function (taskId) {
    var params = {
      taskId: taskId
    }
    return $http.get(UrlService.getUrl('MISSION_DETAIL'), params);
  };
  this.missionShare = function (taskType, taskDestId, sharePlatform) {
    var params = {
      taskType: taskType,
      taskDestId: taskDestId,
      sharePlatform: sharePlatform
    };
    console.log("分享完成");
    IMService.validateWebSocket();
    return $http.get(UrlService.getUrl('MISSION_SHARE'), params);
  }
  this.getQrCodeUrl = function (reqUrl) {
    var params = {
      requestUrl: reqUrl
    };
    return $http.get(UrlService.getUrl('GET_QRCODE'), params);
  }
}])
