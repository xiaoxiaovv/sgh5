APP.controller('accsettingCtrl', ['AccountMessageService','$scope','$location', 'accsettingService', '$rootScope', '$state', '$ionicActionSheet', '$timeout', 'UserService', '$ionicLoading', 'PlatformService', 'ionicDatePicker', '$ionicPopup', 'LoginService','$localstorage',
  function (AccountMessageService,$scope, $location,accsettingService, $rootScope, $state, $ionicActionSheet, $timeout, UserService, $ionicLoading, PlatformService, ionicDatePicker, $ionicPopup, LoginService,$localstorage) {
	//判断是否是ios设备
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
        $scope.isIosApp = true;
    } else {
        $scope.isIosApp = false;
    };

    /** 变量声明 **/
    $scope.isPhone = !!window.cordova;
    $scope.userInfo = {
      picTempFile: ''
    };
    $scope.user = {};
    $scope.sexMap = ['保密', '男', '女'];
    $scope.accountMessage = '';
    $scope.accountName = '';
    $scope.accountSexValue = '0';
    $scope.accountSex = $scope.sexMap[$scope.accountSexValue];
    $scope.accountBirthday = '';
    $scope.iconImage = $rootScope.imgBaseURL+'img/ic_login_user.png';
    $scope.accountToken = '';
    $scope.accountSessionId = '';
    $scope.accountHeaderKey = '2e8352919709910328ec6b6b682a74f3';
    $scope.updateResult = true;
    $scope.updateContent = '';




    /** 方法 **/
      //页面初始化
    $scope.init = function () {
      $scope.user = UserService.getUser();
      $scope.sexMap = ['保密', '男', '女'];
      if ($scope.user.avatarImageFileId != undefined) {
        $scope.iconImage = $scope.user.avatarImageFileId;
      }
      $scope.accountMessage = $scope.user.userName;
      $scope.accountName = $scope.user.nickName;
      $scope.accountSexValue = $scope.user.gender;
      $scope.accountSex = $scope.sexMap[$scope.accountSexValue];

      $scope.accountBirthday = $scope.user.birthday;
      $scope.accountToken = $scope.user.token;
      $scope.accountSessionId = $scope.user.sessionValue;
      $scope.accountHeaderKey = '2e8352919709910328ec6b6b682a74f3';
      $scope.showMobile = true;

      var patternMobile = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/;
      if (!patternMobile.exec($scope.accountNumber)) {
        $scope.showMobile = false;
      }

    };

    //viewWillAppear
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });

    //退出后跳转引导页
    $scope.goGuidePage = function () {
      var u = navigator.userAgent;


      if(u.toLowerCase().match(/MicroMessenger/i) == "micromessenger"){
        $scope.urlbase=$location.absUrl();
        // console.log($scope.urlbase.substring(0,$scope.urlbase.indexOf('#')))
          window.location.href=$scope.urlbase.substring(0,$scope.urlbase.indexOf('?'))+"#/guidePage"

        }else{
          $localstorage.set('ROLE_INFO', 'undefined');
          $state.go('guidePage');
        }

    };

    //修改头像
    $scope.changeIcon = function () {
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
              quality: 100,
              destinationType: Camera.DestinationType.FILE_URI,
              allowEdit: true,
              targetWidth: 720,
              targetHeight: 720,
              saveToPhotoAlbum: true
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
                $scope.showResult('上传成功');
                var resp = JSON.parse(r.response);
                $scope.iconImage = resp.data.avatarImageFileId;
                $scope.user.avatarImageFileId = $scope.iconImage;
                UserService.setUser($scope.user);
              };
              var fail = function (error) {
                $ionicLoading.hide();
                $scope.showResult('上传失败');
              };
              var options = new FileUploadOptions();
              options.fileKey = 'imageFile';
              options.fileName = $scope.iconImage.substr($scope.iconImage.lastIndexOf('/') + 1);
              options.mimeType = 'image/jpeg';
              var params = {};
              //params.userName = $scope.accountMessage;
              options.params = params;
              var ft = new FileTransfer();
              ft.upload($scope.iconImage, encodeURI(AccountMessageService.uploadImage()), win, fail, options);
              var par = {
                template: '<div><img src="img/ic_refresh_01.gif" style="width: 65px;"/></div>'
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
              $scope.iconImage = imageURI;
              $timeout(function () {
                  $scope.iconImage = imageURI;
                }, 200
              );
              //调用图片上传接口
              var win = function (r) {
                $scope.showResult('上传成功');
                $ionicLoading.hide();
                var resp = JSON.parse(r.response);
                $scope.iconImage = resp.data.avatarImageFileId;
                $scope.user.avatarImageFileId = $scope.iconImage;
                UserService.setUser($scope.user);
              };
              var fail = function (error) {
                $scope.showResult('上传失败');
                $ionicLoading.hide();
              };
              var options = new FileUploadOptions();
              options.fileKey = 'imageFile';
              options.fileName = $scope.iconImage.substr($scope.iconImage.lastIndexOf('/') + 1);
              options.mimeType = 'image/jpeg';
              var params = {};
              //params.userName = $scope.accountMessage;
              options.params = params;
              var ft = new FileTransfer();
              //ft.upload($scope.iconImage, encodeURI(AccountMessageService.uploadImage()), win, fail, options);
              ft.upload($scope.iconImage, encodeURI(AccountMessageService.uploadImage()), win, fail, options);
              var par = {
                template: '<div><img src="img/ic_refresh_01.gif" style="width: 65px;"/></div>'
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
        var myAlertNull = $ionicPopup.alert({
          template: '请下载客户端实现更换头像功能',
          okText: '知道了'
        });
      }
    };

    //上传头像module的监视，每次改变都会执行
    $scope.$watch('userInfo.picTempFile', function () {
      if ($scope.userInfo && $scope.userInfo.picTempFile) {
        if ($scope.userInfo.picTempFile.length > 0) {
          h5Upload($scope.userInfo.picTempFile);
        }
      }
    }, false);

    function h5Upload(source) {
      var file = source[0];
      if (window.FileReader) {
        var fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onloadend = function (e) {
          $scope.$apply($scope.iconImage = e.target.result);
        };
      }
    }

    //注销登录
    $scope.unload = function () {
      if ($scope.user.sessionValue == undefined) {
        UserService.clearUser();
        $scope.goGuidePage();
        LoginService.setRole(undefined);
        window.localStorage.setItem('isLogin', UserService.isUserLogin());
        $localstorage.set('storeId','');
      }
      else {
        AccountMessageService.unloadAccount($scope.accountToken, $scope.accountSessionId, $scope.accountHeaderKey)
          .success(function (response, status, headers, config) {
            console.log(response);
            if (response.success) {
              UserService.clearUser();
              $scope.goGuidePage();
              LoginService.setRole(undefined);
              // const Bearer = `Bearer${response.data}`;
              var Bearer = 'Bearer'+response.data;
              window.localStorage.setItem('sg_login_token_secret', Bearer);
              window.localStorage.setItem('isLogin', UserService.isUserLogin());
              $localstorage.set('storeId','');
            }
          });
      }

    };

    $scope.goToDelete = function () {
      var confirmPopup = $ionicPopup.confirm({
        template: '确认退出登录?',
        cancelText: '取消',
        okText: '确定'
      });
      confirmPopup.then(function(res) {
      if(res) {
        $scope.unload();
      } else {
        console.log('You are not sure');
      }
    });
    };

    //选择日期
    $scope.selectDate = function () {
      if (PlatformService.getPlatform() == 'APP') {
        var options = {
          date: new Date(),
          mode: 'date',
          cancelButton: false,
          locale: "zh-Hans" // ios 时间控件已经中国化 todo  android
        };
        datePicker.show(options, function (date) {
          $timeout(function () {
              var day = date.getDate();
              var month = date.getMonth() + 1;
              var year = date.getFullYear();
              if (month < 10) {
                month = '0' + month;
              }
              if (day < 10) {
                day = '0' + day;
              }
              //$scope.accountBirthday = year + '-' + month + '-' + day;
              AccountMessageService.changeMessage($scope.accountMessage, year + '-' + month + '-' + day, $scope.accountSexValue, $scope.accountName)
                .success(function (response, status, headers, config) {
                  if (response.success) {
                    $scope.accountBirthday = year + '-' + month + '-' + day;
                    $scope.user.birthday = year + '-' + month + '-' + day;
                    UserService.setUser($scope.user);
                    $scope.showResult('修改成功');
                  }
                  else {
                    $scope.showResult('修改失败');
                  }
                });
            }, 200
          );
        });
      }
      else {
        var ipObj1 = {
          inputDate: new Date(),
          weeksList: ['日', '一', '二', '三', '四', '五', '六'],
          monthsList: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          from: new Date(1900, 1, 1), //Optional
          to: new Date(), //Optional
          mondayFirst: true,          //Optional
          closeOnSelect: false,       //Optional
          templateType: 'popup',
          setLabel: '设置',
          closeLabel: '关闭',
          dateFormat: 'yyyy-MM-dd',
          callback: function (val) {  //Mandatory
            console.log('Return value from the datepicker popup is : ', new Date(val).getMonth() + 1);
            var monthWeb = new Date(val).getMonth() + 1;
            var dayWeb = new Date(val).getDate();
            if (monthWeb < 10) {
              monthWeb = '0' + monthWeb;
            }
            if (dayWeb < 10) {
              dayWeb = '0' + dayWeb;
            }
            var birthday = new Date(val).getFullYear() + '-' + monthWeb + '-' + dayWeb;
            AccountMessageService.changeMessage($scope.accountMessage, birthday, $scope.accountSexValue, $scope.accountName)
              .success(function (response, status, headers, config) {
                if (response.success) {
                  $scope.accountBirthday = birthday;
                  $scope.user.birthday = birthday;
                  UserService.setUser($scope.user);
                  $scope.showResult('修改成功');
                }
                else {
                  $scope.showResult('修改失败');
                }
              });

          }//Optional
        };
        ionicDatePicker.openDatePicker(ipObj1);
      }
    };

    //选择性别回调
    $rootScope.$on('SELECT_SEX', function (event, data) {
      $scope.accountSexValue = data;
      $scope.accountSex = $scope.sexMap[$scope.accountSexValue];
      $scope.user.gender = data;
      UserService.setUser($scope.user);
      $scope.showResult('修改成功');
    });

    //修改名字回调
    $rootScope.$on('CHANGE_NAME', function (event, data) {
      $scope.accountName = data;
      $scope.user.nickName = data;
      UserService.setUser($scope.user);
      $scope.showResult('修改成功');
    });



    //回退
    $scope.goBack = function () {
      $state.go('personnalCenter');
    };

    //显示修改结果提示
    $scope.showResult = function (result) {
      $scope.updateContent = result;
      $scope.updateResult = false;
      $timeout(function () {
        $scope.updateResult = true;
      }, 1000);
    };

  }]);

/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016-4-29
 * describe：AccountMessageService网络服务
 **/
APP.service('accsettingService', ['$http', 'UrlService',
  function ($http, UrlService) {

    //退出登录
    this.unloadAccount = function (tokenKey, sessionIdKey, headerKey) {
      var token = tokenKey;
      var headerStr = 'Bearer ' + headerKey + ' ' + token;
      var header = {
        'Authorization': headerStr
      };
      var params = {
        'sessionId': sessionIdKey
      };
      return $http.get(UrlService.getUrl('UNLOAD_INIT'), {headers: header, params: params});
    };

    //修改信息
    this.changeMessage = function (userName, birthday, gender, nickName) {
      var params = {
        'userName': userName,
        'birthday': birthday,
        'gender': gender,
        'nickName': nickName
      };
      return $http({
        method: 'POST',
        url: UrlService.getUrl('UPDATEMEMBER_INIT'),
        params: params
      });
    };
    //头像上传地址
    this.uploadImage = function () {
      return UrlService.getUrl('UPLOAD_IMAGE');
    };
  }]);
