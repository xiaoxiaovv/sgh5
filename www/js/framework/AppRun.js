/**
 * creater:chuanpeng.zhu@dhc.com.cn
 * create time:2016/1/20
 * describe：todo
 **/
APP.run(['GoodsService','AccountMessageService', 'trueAuthenticationService', 'HomePageService', '$ionicPlatform', '$rootScope', 'UserService', '$state', 'CacheService', '$ionicHistory', '$timeout',
  '$ionicLoading', 'PopupService', '$location', '$ionicPopup', 'AreaService', 'CommonAddressService', 'LoginService', 'AdvertisementService', '$localstorage', '$http', 'UrlService', 'CreditService', 'IMService', 'ShareService', '$interval', 'GetStatisticInfoService',
  function (GoodsService,AccountMessageService, trueAuthenticationService, HomePageService, $ionicPlatform, $rootScope, UserService, $state, CacheService, $ionicHistory, $timeout,
    $ionicLoading, PopupService, $location, $ionicPopup, AreaService, CommonAddressService, LoginService, AdvertisementService, $localstorage, $http, UrlService, CreditService, IMService, ShareService, $interval, GetStatisticInfoService) {
    // window.postMessage('from-sg-h5');
    window.runRnCode = function(){
      $("[ng-click='goBack()']").not("[hasClick]").on("click", function () {
        if ($ionicHistory.viewHistory().histories.root.cursor == 0) {
          window.postMessage("goback");
        }
      }).attr('hasClick','1');
    };
    // $rootScope.isRnOpen = false;
    if (window.location.href.indexOf('sg_rn_app') != -1) {
      // $rootScope.isRnOpen = true;
      var rn_msg_index = window.location.href.indexOf('sg_rn_app');
      var rn_msg_str = window.location.href.slice(rn_msg_index + 9);
      var unescapeStr = unescape(rn_msg_str);
      // 注意！！！！！！！
      // 下面的2行代码是从RN传递过来的信息里取地址信息 如：崂山区/中韩街道。 
      // 如果RN传递的数据对象 的格式有变化 这个地方取地址信息的代码也需要变化
      var regionNameTemp = rn_msg_str.slice(rn_msg_str.indexOf('regionName') + 17);
      var finalRegionName = regionNameTemp.slice(0,regionNameTemp.length-9);
      var rn_msg = JSON.parse(unescapeStr);
      // window.location.href = window.location.href.slice(0,rn_msg_index-1);
      window.RNmsg = rn_msg;
      $rootScope.RNmsg = window.RNmsg;
      UserService.setUser(window.RNmsg.userMsg);

      $localstorage.set('sg_login_token_secret', window.RNmsg.userMsg.userToken); //把token存到本地
      // 把RN传递过来的地址信息通过接口存储起来
      GoodsService.addAddress(window.RNmsg.addressInfo.provinceId, window.RNmsg.addressInfo.cityId, window.RNmsg.addressInfo.areaId,  decodeURIComponent(finalRegionName), window.RNmsg.addressInfo.streetId)
        .success(function (response, status, headers, config) {
          
        });
    }
    $rootScope.firstLocationPage = window.history.length; // 第一次打开页面时浏览器记录的url的长度
    // document.addEventListener('message', function (e) {
    //   window.RNmsg = JSON.parse(e.data);
    //   // alert(window.RNmsg.userMsg.userToken);
    //     $rootScope.RNmsg = window.RNmsg;
    //     UserService.setUser(window.RNmsg.userMsg);
    //     $localstorage.set('sg_login_token_secret', window.RNmsg.userMsg.userToken);//把token存到本地
    //     // $http.get(UrlService.getUrl('TOKEN_LOGIN_GET'))
    //     //   .success(function (res) {
    //     //     if (res.data) {
    //     //       $localstorage.set('sg_login_token_secret', 'Bearer' + res.data);//把token存到本地
    //     //     } else {
    //     //       $localstorage.set('sg_login_token_secret', 'Bearer' + GetStatisticInfoService.generateUUID());
    //     //     }
    //     //   })
    //     //   .error(function (errorMessage) {
    //     //     $localstorage.set('sg_login_token_secret', 'Bearer' + GetStatisticInfoService.generateUUID());
    //     //   });
    //     $http.get(iocnTabs, {
    //       iconType: 2
    //     })
    //       .success(function (response) {
    //         if (response.success && response.data !== null) {
    //           if (response.data.iconImageConfig !== null) {
    //             $rootScope.tabsImg = response.data.iconImageConfig;
    //           }
    //           if (response.data.iconFontConfig !== null) {
    //             $rootScope.tabsTextColor = response.data.iconFontConfig;
    //           }
    //         } else {
    //         }
    //       });
    //   // window.RNmsg = JSON.parse(e.data);
    //   // var userMsgStr = JSON.stringify(window.RNmsg.userMsg);
    //   // localStorage.setItem('USER_CACHE_KEY',userMsgStr);
    //   // localStorage.setItem('sg_login_token_secret', window.RNmsg.userMsg.userToken);
    //   // alert('接收到rn消息');
    //   // $(document).trigger('reactNativeMsg');
    // });


    $rootScope.countTime = 10;
    $rootScope.tooCrowdToastFlag = false;
    var closeTooCrowd;
    window.closeTooCrowdToast = function () {
      if ($('.popup-body .countToast').html() == '确定') {
        $rootScope.countTime = 10;
        $rootScope.tooCrowdToastFlag = false;
        closeTooCrowd.close();
      }
    }
    $rootScope.$on('tooCrowd', function (event, data) {
      if (!$rootScope.tooCrowdToastFlag) {
        $rootScope.tooCrowdToastFlag = true;
        var countFlag = $interval(function () {
          if ($rootScope.countTime - 1 <= 0) {
            $('.popup-body .countToast').html('确定');
            $interval.cancel(countFlag);
          } else {
            $rootScope.countTime--;
            $('.popup-body .countToast').html($rootScope.countTime + 's');
          }
        }, 1000);
        closeTooCrowd = $ionicPopup.show({
          template: '<div style="color: black;text-align: left;font-size: 12px;text-align:center;padding-bottom:20px;">' + data + '<div class="countToast" style="position: absolute;bottom: 0;left: 0;width: 100%;height: 34px;line-height:34px;border-top: 1px solid #3333" onClick="closeTooCrowdToast();">10s</div></div>',
          buttons: [

          ]
        });
        var colorSetTimer = $interval(function () {
          if ($rootScope.tooCrowdToastFlag) {
            if ($('.popup-body .countToast').html() != '确定') {
              $('.popup-body .countToast').css("color", "#666666");
            } else {
              $('.popup-body .countToast').css("color", "#32BEFF");
            }
          } else {
            $interval.cancel(colorSetTimer);
          }
        }, 200);
      }
    });
    $rootScope.couponXyzType = false; //优惠券状态值状态记录，勿动！！
    /**********社群争霸赛临时处理 start **********/
    var currentUrl = unescape(window.location.href);
    var token = null;
    if (currentUrl.indexOf('circlePage/662') != -1){
      token = currentUrl.substr(currentUrl.indexOf('&token=') + 7);
    }
    if(token) {
      $localstorage.set('sg_login_token_secret','Bearer'+ token);
    }
    /**********社群争霸赛临时处理 end **********/
    //打开APP的时候调用TOKEN借口(token跟登录有关)
      $http.get(UrlService.getUrl('TOKEN_LOGIN_GET'))
      .success(function (res) {
        if (res.data) {
          $localstorage.set('sg_login_token_secret', 'Bearer' + res.data); //把token存到本地
        } else {
          $localstorage.set('sg_login_token_secret', 'Bearer' + GetStatisticInfoService.generateUUID());
        }
      })
      .error(function (errorMessage) {
        $localstorage.set('sg_login_token_secret', 'Bearer' + GetStatisticInfoService.generateUUID());
      });


    $rootScope.globalConstant = {};
    $rootScope.globalConstant.lon = 120.457091; //青岛崂山中韩街道
    $rootScope.globalConstant.lat = 36.108883; //青岛崂山中韩街道
    $rootScope.globalConstant.autoPosition = '定位中···';
    $rootScope.globalConstant.positionStatus = true; //定位结果状态
    //window.localStorage.setItem('isLogin', UserService.isUserLogin());
    //window.localStorage.setItem('isBuyer', LoginService.getRole());
    $rootScope.globalConstant.storeId = '20219251'; //官方storeId

    $rootScope.globalConstant.versionIOS = '4.2.5';
    $rootScope.globalConstant.versionANDROID = '4.2.5';

    $rootScope.globalConstant.androidDownLoadUrl = 'http://www.baidu.com';
    $rootScope.globalConstant.iosDownLoadUrl = 'http://www.baidu.com';
    $rootScope.globalConstant.mobileNumberRegExp = /^1([35789][0-9]|4[01356789]|66|9[89])\d{8}$/; // 全局手机号码校验正则
    $rootScope.globalConstant.passwordRegExp = /^((?=.*?\d)(?=.*?[A-Za-z])|(?=.*?\d)(?=.*?[\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\]\^\_\`\{\|\}\~])|(?=.*?[A-Za-z])(?=.*?[\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\]\^\_\`\{\|\}\~]))[\dA-Za-z\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\]\^\_\`\{\|\}\~]{6,20}$/;
    $rootScope.imgBaseURL = '//cdn09.ehaier.com/shunguang/H5/www/';
    $rootScope.tabsImg = {
      "background": "",
      "wdHover": $rootScope.imgBaseURL + "img/newvision/Mine.png",
      "fl": $rootScope.imgBaseURL + "img/newvision/guang@2x.png",
      "flHover": $rootScope.imgBaseURL + "img/newvision/guang x@2x.png",
      "sgHover": $rootScope.imgBaseURL + "img/newvision/home.png",
      "gwcHover": $rootScope.imgBaseURL + "img/newvision/car.png",
      "sq": $rootScope.imgBaseURL + "img/newvision/sqs.png",
      "sqHover": $rootScope.imgBaseURL + "img/newvision/sq.png",
      "wd": $rootScope.imgBaseURL + "img/newvision/Mines.png",
      "sg": $rootScope.imgBaseURL + "img/newvision/homes.png",
      "gwc": $rootScope.imgBaseURL + "img/newvision/cars.png"
    };
    $rootScope.tabsTextColor = {
      "wdHoverFontColor": "#2577e3",
      "flFontColor": "gray",
      "flHoverFontColor": "#2577e3",
      "sgHoverFontColor": "#2577e3",
      "gwcHoverFontColor": "#2577e3",
      "sqFontColor": "gray",
      "sqHoverFontColor": "#2577e3",
      "wdFontColor": "gray",
      "sgFontColor": "gray",
      "gwcFontColor": "gray"
    };
    var iocnTabs = UrlService.getNewUrl('ACTIVITY_ICON_TABS_NEW');
    $http.get(iocnTabs, {
        iconType: 2
      })
      .success(function (response) {
        if (response.success && response.data !== null) {
          if (response.data.iconImageConfig !== null) {
            $rootScope.tabsImg = response.data.iconImageConfig;
          }
          if (response.data.iconFontConfig !== null) {
            $rootScope.tabsTextColor = response.data.iconFontConfig;
          }
        } else {}
      });
    $rootScope.appIsPaused = false;
    $rootScope.invoiceType = 2;

    /*获取唯一 cookie id*/ //@zyr
    // if (getCookie)
    function generateUUID() {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
      });
      return uuid;
    };
    //获取 cookie
    function getCookie(name) {
      var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if (arr = document.cookie.match(reg)) return unescape(arr[2]);
      else return null;
    }
    // 设置cookie
    function setCookie(name, value) {
      var Days = 3650;
      var exp = new Date();
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
      document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }
    var cookieVisi = getCookie('loginId');
    var cookieId;
    if (getCookie('loginId')) {
      cookieId = getCookie('loginId');
    } else {
      cookieId = generateUUID();
      setCookie('loginId', cookieId);
    }

    /*弹窗中的方法*/
    $rootScope.loginIsAccord = false;
    $rootScope.loginIsAuthentication = false;
    $rootScope.goUpgrade = function () {
      $rootScope.loginIsAccord = false;
      $state.go('newAuthenticationHome');
    };
    $rootScope.goAuthentication = function () {
      if (UserService.isUserLogin()) { // 登陆状态
        if ($rootScope.isCloseBtn) {
          $rootScope.loginIsAuthentication = true;
        } else {
          $rootScope.loginIsAuthentication = false;
        }

        $state.go('trueAuthenticationList');
      } else {
        $state.go('login');
      }

    };
    $rootScope.goMechanismDescription = function () {
      if ($rootScope.isCloseBtn) {
        $rootScope.loginIsAuthentication = true;
      } else {
        $rootScope.loginIsAuthentication = false;
      }
      $state.go('MechanismDescription');
    };
    $rootScope.closePopup = function () {
      $rootScope.loginIsAccord = false;
      $rootScope.loginIsAuthentication = false;
      $rootScope.loginIsAccord2 = false;
    };
    $rootScope.signOut = function () { //退出登陆 跳转至登录页
      //注销登录的时候 把全局的账号密码置为空字符串（洗衣机插件需要传 账号 密码）
      if (UserService.isUserLogin()) {
        $rootScope.userCount = "";
        $rootScope.password = "";
        var nowUser = UserService.getUser();
        if (nowUser.sessionValue == undefined) {
          UserService.clearUser();
          $state.go('login');
          LoginService.setRole(undefined);
          window.localStorage.setItem('isLogin', UserService.isUserLogin());
          $localstorage.set('storeId', '');
        } else {
          AccountMessageService.unloadAccount(UserService.getUser().token, UserService.getUser().sessionValue, '2e8352919709910328ec6b6b682a74f3')
            .success(function (response, status, headers, config) {
              if (response.success) {
                UserService.clearUser();
                $state.go('login');
                LoginService.setRole(undefined);
                // const Bearer = `Bearer${response.data}`;
                var Bearer = 'Bearer' + response.data;
                window.localStorage.setItem('sg_login_token_secret', Bearer);
                window.localStorage.setItem('isLogin', UserService.isUserLogin());
                $localstorage.set('storeId', '');
              }
            });
        }
      } else {
        $state.go('login');
      }

    };
    $rootScope.goChangePhoneNum = function () {
      if (UserService.isUserLogin()) {
        if ($rootScope.isCloseBtn) {
          $rootScope.loginIsAuthentication = true;
        } else {
          $rootScope.loginIsAuthentication = false;
        }
        $state.go('myPhoneManage');
      } else {
        $state.go('login');
      }

    };
    /*弹框 end  */


    // imgBaseURL 用于储存，当图片服务器地址变化是只需要更改这个地址
    $ionicPlatform.on('resume', function () {
      $rootScope.appIsPaused = false;
      //检查后台返回前台websocket是否断开
      IMService.validateWebSocket();
      //调用记录微店主金币接口
      if (UserService.getUser().mid) {
        getAppLoginRecord();
      }
    });
    $ionicPlatform.on('pause', function () {
      $rootScope.appIsPaused = true;
    });
    //调用记录微店主金币接口
    function getAppLoginRecord() {
      var jinbiUrl = UrlService.getUrl('JINBI_JILU');
      $http.get(jinbiUrl)
        .success(function (response) {
          if (response.success) {

          } else {

          }
        });
    }

    var showFunc = $ionicLoading.show;
    var hideFunc = $ionicLoading.hide;
    $rootScope.curOrder = 0;
    $rootScope.totalOrder = 0;
    $ionicLoading.show = function (options) {
      $rootScope.loadingStart = new Date().getTime();
      showFunc(options);
      if (options.duration) {
        $timeout(function () {
          $rootScope.loadingStart = 0;
          $rootScope.curMsg = null;
        }, options.duration);
      }
    };

    $ionicLoading.hide = function () {
      hideFunc();
      $rootScope.loadingStart = 0;
      $rootScope.curMsg = null;
    };


    window.closeLevelUpPop = function () {
      $ionicLoading.hide();
      $rootScope.isLevelUp = false;
      processLightMessageQueue();
    };
    window.closeGoodCoupon = function (lightMssageBoxCoupon) {
      lightMssageBoxCoupon.parentNode.parentNode.remove();
    };
    window.gomyCouponsList = function (lightMssageBoxCoupon) {
      lightMssageBoxCoupon.parentNode.parentNode.parentNode.remove();
      $state.go('myCouponsList');
    };
    setSwitchFun(UserService.getUser().mid); //每次打开app 设置 币雨下落、佣金、提现通知的标志
    //设置金币雨下落、佣金、提现通知的标志
    function setSwitchFun(memberId) {
      var myId = memberId;
      if (localStorage.getItem('setSwitch')) {
        var switchArr = JSON.parse(localStorage.getItem('setSwitch'));
        var isExist = false;
        for (var i = switchArr.length - 1; i >= 0; i--) {
          if (switchArr[i].id == myId) {
            $rootScope.isCommission = switchArr[i].list[0].checked;
            $rootScope.cashSwitch = switchArr[i].list[1].checked;
            $rootScope.goldRainSwitch = switchArr[i].list[2].checked;
            isExist = true;
            return;
          }
        }
        if (!isExist) {
          $rootScope.isCommission = true;
          $rootScope.cashSwitch = true;
          $rootScope.goldRainSwitch = true;
          var nowMemberSwitch = {
            id: myId,
            list: [{
                name: '佣金',
                checked: true
              },
              {
                name: '提现通知',
                checked: true
              },
              {
                name: '金币雨',
                checked: true
              }
            ]
          };
          switchArr.push(nowMemberSwitch);
          localStorage.setItem('setSwitch', JSON.stringify(switchArr));
        }
      } else {
        var arr = [{
          id: myId,
          list: [{
              name: '佣金',
              checked: true
            },
            {
              name: '提现通知',
              checked: true
            },
            {
              name: '金币雨',
              checked: true
            }
          ]
        }];
        localStorage.setItem('setSwitch', JSON.stringify(arr));
        $rootScope.isCommission = true;
        $rootScope.cashSwitch = true;
        $rootScope.goldRainSwitch = true;
      }
    }

    //如果服务端返回告知当前会话失效，则要求重新登录
    $rootScope.$on('sessionTimeout', function () {
      UserService.clearUser();
      $state.go('login');
    });

    function missionCallback() {
      var startIndex = 0;
      var pageSize = 100;

      if ($rootScope.missionLists) {
        $rootScope.missionLists();
        $rootScope.missionLists = null;
      }

    }

    var orderSuccessCallback = null;
    var orderSuccessCallbackId = null;
    var hasRun = false;
    $rootScope.registOrderSuccessCallback = function (id, timeout, cb) {
      hasRun = false;
      orderSuccessCallbackId = id;
      if (timeout) {
        $timeout(function () {
          if (hasRun === false && cb) {
            cb(id, true, null);
          }
        }, timeout);
      }
      orderSuccessCallback = cb;
    };
    //消息处理逻辑
    window.processMessage = function (messageVO) {
      //TODO 处理消息
      if ($rootScope.toState == 'advertisement' || $rootScope.toState == 'shopApplySuccess' || $rootScope.toState == 'trueAuthentication') {
        goldRainArray.unshift(messageVO);
        return;
      }
      // if ($rootScope.toState == 'trueAuthentication' || $rootScope.toState == 'shopApplySuccess') {
      //   goldRainArraycoupon.unshift(messageVO);
      //   return;
      // }
      var messageType = messageVO.messageType;
      var extendData = messageVO.extendData;
      if (messageType === "ORDER_COMMIT_RESULT") { //如果消息类型为订单提交结果，则通知订单结算页面跳转
        if (orderSuccessCallback) {
          hasRun = true;
          orderSuccessCallback(orderSuccessCallbackId, false, messageVO);
        }
      } else {
        //是否是升级消息 或 已经弹出升级消息
        $rootScope.isLevelUp = ($rootScope.isLevelUp || (extendData.popupMessage && extendData.popupMessage != null));
        if (extendData != null && !$.isEmptyObject(extendData)) {
          if ($rootScope.freshMission) {
            missionCallback();
            $rootScope.freshMission = false;
          }
          //金币雨肯定伴有轻消息
          if (extendData.goldRain == "1") {
            fallGoldRain(messageVO.msg);
          }
          //优惠券弹窗
          if (extendData.openStoreReward == "1") {
            PopupService.showGoodCoupon(extendData.amount);
          }
          if (extendData.voiceMessage != null) {
            //TODO 语音提醒
            if ($rootScope.cashSwitch) {
              myCashObj._playAudio();
            }
          }
          if (extendData.popupMessage) {
            //TODO 弹出消息
            levelUpAnimation(extendData);
            //PopupService.levelUp(extendData.levelName, extendData.levelOrder, extendData.needCreditNum);
          }
          if (extendData.lightMessage) {
            //TODO 轻消息
            processLightMessage(messageVO.msg);
            // console.log("轻消息:"+extendData.lightMessage);
          }
          if (extendData.dynamicMessage) {
            //TODO 订单动态消息
            if ($rootScope.toState == 'productDetail' || $rootScope.toState == 'homePage') { //订单详情页显示金币雨
              $('.mess-tip').html(messageVO.msg);
              $('.mess-tip').css('display', 'block');
              setTimeout(function () {
                $('.mess-tip').css('display', 'none');
              }, 3000);
            }
          }
        }
      }
    };
    window.processMessageQueue = function () {
      //TODO 处理消息队列逻辑
      setSwitchFun(UserService.getUser().mid);
      while (true) {
        var messageVO = goldRainArray.pop();
        if (!messageVO) {
          break;
        }
        processMessage(messageVO);
      }
    };
    // window.processMessageQueueCoupon = function () {
    //   var messageVOcoupons = goldRainArraycoupon.pop();
    //     if (!messageVOcoupons) {
    //     return;
    //     }
    //     processMessage(messageVOcoupons);
    // };
    //轻消息处理
    window.processLightMessage = function (msg) {
      if ($rootScope.isLevelUp) {
        lightMssageArray.unshift(msg);
      } else {
        PopupService.goldIncrease(msg);
      }
    };

    function fallGoldRain(msg) {
      //TODO 金币雨
      // 金币雨开关状态为 开 并且现在没有在下 金币雨
      if ($rootScope.goldRainSwitch) {
        //如果没有在下金币雨
        if (!$rootScope.isRaining) {
          $rootScope.isRaining = true;
          goldFall(function () {
            $rootScope.isRaining = false;
            // processLightMessage(msg);
          });
          processLightMessage(msg);
        } else {}
      } else { //金币雨开关状态为 关
        processLightMessage(msg);
      }
    };

    function levelUpAnimation(extendData) {
      if (extendData.levelOrder && extendData.levelName) {
        PopupService.levelUp(extendData.levelName, extendData.levelOrder, extendData.needCreditNum);
      }
    };
    var goldRainArray = [];
    // var goldRainArraycoupon = [];
    var lightMssageArray = [];
    //var levelUpArr = [];
    //var dynamicArr=[];
    //var dynamicTimeArr=[];
    // var before=[];
    //路由切换成功时
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      // $timeout(function () {
      //   $("[ng-click='goBack()']").on("click", function () {
      //     if ($rootScope.isRnOpen && $ionicHistory.viewHistory().histories.root.cursor == 0) {
      //       window.postMessage("goback");
      //     }
      //   });
      // }, 3000);
      $rootScope.fromState = fromState.name; //上一页面
      $rootScope.toState = toState.name; //当前页面
      /*小能客服start*/
      $rootScope.xnFromState = fromState;
      $rootScope.xnToState = toState;
      $rootScope.xnFromParams = fromParams;
      $rootScope.xnToParams = toParams;
      GetStatisticInfoService.GetUserInfo(toState.name, fromState.name, toParams); //获取用户基本信息-大数据
      if ($rootScope.fromState == 'advertisement' || $rootScope.fromState == 'shopApplySuccess') {
        /*if(goldRainArray.length>0){
         setSwitchFun(UserService.getUser().mid);
         fallGoldRain(goldRainArray[0]);
         goldRainArray.length=0;
         }*/
        processMessageQueue();
        // processMessageQueueCoupon();
      }
      /*growing统计用户属性*/
      if (UserService.getUser().mid) {
        gio_userId = UserService.getUser().mid;
        gio_userRole = LoginService.getRole() == '1' ? 1 : 0;
        if (window.gio) {
          gio('setUserId', gio_userId);
          gio('people.set', {
            'userRole': gio_userRole + ''
          });
        }
      }
      //当用户在绑定手机号页面 没有绑定手机号 直接点击返回按钮 返回到登录页时的处理 （直接手动注销账户）
      if (($rootScope.fromState == 'RegisterForStoreLogin' || $rootScope.fromState == 'registerForStore') && $rootScope.toState == 'login') { // $rootScope.fromState == 'RegisterForStoreLogin' && $rootScope.toState == 'login'
        //注销登录的时候 把全局的账号密码置为空字符串（洗衣机插件需要传 账号 密码）
        $rootScope.userCount = "";
        $rootScope.password = "";
        var nowUser = UserService.getUser();
        if (nowUser.sessionValue == undefined) {
          UserService.clearUser();
          LoginService.setRole(undefined);
          window.localStorage.setItem('isLogin', UserService.isUserLogin());
          $localstorage.set('storeId', '');
        } else {
          AccountMessageService.unloadAccount(UserService.getUser().token, UserService.getUser().sessionValue, '2e8352919709910328ec6b6b682a74f3')
            .success(function (response, status, headers, config) {
              if (response.success) {
                UserService.clearUser();
                LoginService.setRole(undefined);
                // const Bearer = `Bearer${response.data}`;
                var Bearer = 'Bearer' + response.data;
                window.localStorage.setItem('sg_login_token_secret', Bearer);
                window.localStorage.setItem('isLogin', UserService.isUserLogin());
                $localstorage.set('storeId', '');
              }
            });
        }
      }
      /*if($rootScope.toState!='advertisement'){
       if(levelUpArr.length>0){
       levelUpAnimation(levelUpArr[0]);
       levelUpArr.length=0;
       }
       }*/
      if (($rootScope.fromState == 'login' || $rootScope.fromState == 'RegisterForStoreLogin' || $rootScope.fromState == 'register') && ($rootScope.toState == 'homePage' || $rootScope.toState == 'personnalCenter' || $rootScope.toState == 'cart' || $rootScope.toState == 'productDetail' || $rootScope.toState == 'messageCenter' || $rootScope.toState == 'topic' || $rootScope.toState == 'circlePage' || $rootScope.toState == 'noteDetails' || $rootScope.toState == 'allcircle' || $rootScope.toState == 'personalHomePageHe ' || $rootScope.toState == 'newres' || $rootScope.toState == 'crowd_funding_details' || $rootScope.toState == 'getCouponsList')) {
        var loginDateTime1, LoginMemberId;
        loginDateTime1 = $localstorage.get('OLDTIMEONE');
        LoginMemberId = $localstorage.get('loginMemberId');
        $rootScope.nowTime = new Date().getDate();
        //判断是否微店主
        LoginService.checkOpenStore($rootScope.loginMemberId) //发请求查询 用户是否开过店
          .success(function (response, status, headers, config) {
            if (window.UmengPush) {
              window.UmengPush.getDeviceToken([], function (deviceToken) {
                $http.get(UrlService.getUrl("DEVICE_INFO") + "?device_token=" + deviceToken + "&device_type=" + deviceInfo);
                //console.log("注册token:device_token=" + deviceToken + "&device_type=" + deviceInfo);
              });
            }
            if (!response.data) {
              $rootScope.isBuyer = 0; //不是微店主
              LoginService.setRole($rootScope.isBuyer);
              if (loginDateTime1 == $rootScope.nowTime && $rootScope.loginMemberId == LoginMemberId) {
                $rootScope.loginIsAccord = false;
                $rootScope.loginIsAuthentication = false;
              } else {
                $localstorage.set('OLDTIMEONE', $rootScope.nowTime);
                $localstorage.set('loginMemberId', $rootScope.loginMemberId);
                if (UserService.isUserLogin()) {
                  $rootScope.loginIsAuthentication = false;
                  if (window.cordova) { //app
                    $rootScope.loginIsAccord = true;
                  }
                  $rootScope.loginIsAccord = false;
                }

              }

            } else {
              $rootScope.isBuyer = 1; //微店主
              LoginService.setRole($rootScope.isBuyer);
              $rootScope.loginIsAccord = false;
              $rootScope.loginIsAuthentication = false;
              // 是否是o2o
              HomePageService.isWdHost()
                .success(function (response) {
                  if (response.success) {
                    $rootScope.o2oMessage = response.message;
                    if (response.data.isHost == 1) { //微店主
                      if (response.data.o2o == true) {

                        $rootScope.myPopups = $ionicPopup.show({
                          template: $rootScope.o2oMessage,
                          buttons: [{
                            text: '退出',
                            onTap: function () {
                              $rootScope.userCount = "";
                              $rootScope.password = "";
                              var nowUser = UserService.getUser();
                              if (nowUser.sessionValue == undefined) {
                                UserService.clearUser();
                                $state.go('login');
                                LoginService.setRole(undefined);
                                window.localStorage.setItem('isLogin', UserService.isUserLogin());
                                $localstorage.set('storeId', '');
                              } else {
                                AccountMessageService.unloadAccount(UserService.getUser().token, UserService.getUser().sessionValue, '2e8352919709910328ec6b6b682a74f3')
                                  .success(function (response, status, headers, config) {
                                    if (response.success) {
                                      UserService.clearUser();
                                      $state.go('login');
                                      LoginService.setRole(undefined);
                                      // const Bearer = `Bearer${response.data}`;
                                      var Bearer = 'Bearer' + response.data;
                                      window.localStorage.setItem('sg_login_token_secret', Bearer);
                                      window.localStorage.setItem('isLogin', UserService.isUserLogin());
                                      $localstorage.set('storeId', '');
                                    }
                                  });
                              }
                            }
                          }]
                        });

                      } else if (response.data.o2o == null) { // 已经实名
                        //   $rootScope.myPopups.close();
                        $rootScope.loginIsAuthentication = false;
                      } else {
                        //  $rootScope.myPopups.close();
                        // 实名认证
                        trueAuthenticationService.doInit()
                          .success(function (response) {
                            if (response.success) {
                              if (response.data.isAuth) { // 实名认证过
                                $rootScope.loginIsAccord = false;
                                $rootScope.loginIsAuthentication = false;
                                if (UserService.isUserLogin()) {
                                  $timeout(function () {
                                    PopupService.showToast('登录成功，请继续您的旅程...');
                                  }, 800);
                                }

                              } else { //未认证
                                $rootScope.isCloseBtn = response.data.forceAuthFlag;
                                if ($rootScope.isCloseBtn) {
                                  $rootScope.loginIsAuthentication = true;
                                } else {
                                  if (loginDateTime1 == $rootScope.nowTime && $rootScope.loginMemberId == LoginMemberId) {
                                    $rootScope.loginIsAccord = false;
                                    $rootScope.loginIsAuthentication = false;
                                  } else {
                                    $localstorage.set('OLDTIMEONE', $rootScope.nowTime);
                                    $localstorage.set('loginMemberId', $rootScope.loginMemberId);
                                    if (UserService.isUserLogin()) {
                                      $rootScope.loginIsAccord = false;
                                      $rootScope.loginIsAuthentication = true;
                                    }
                                  }
                                }
                              }
                            } else {
                              console.log('请求实名认证接口出错')
                            }
                          });

                      }
                    }

                  } else {
                    PopupService.showToast('获取数据信息失败！');
                  }
                });


            }
          }).error(function (res) {
            PopupService.showToast('网络连接失败！');
          });

      }
    });


    var myCashObj = new Cash(); // 金币提现 构造函数 初始化
    (function () {
      /*var unreads = [];
       var typeActive = [null,null,null,null,null];
       $interval(function(){
       while(true){
       var messageVO=unreads.shift();
       if(!messageVO){
       break;
       }
       var extendData=messageVO.extendData;
       if(!extendData){
       break;
       }
       try{
       //金币雨
       if (extendData.goldRain == "1") {
       typeActive[0] = JSON.parse(msgStr);
       typeActive[0].extendData.voiceMessage = null;
       typeActive[0].extendData.lightMessage = null;
       typeActive[0].extendData.popupMessage = null;
       typeActive[0].extendData.dynamicMessage = null;
       }
       //语音提醒
       if (extendData.voiceMessage) {
       typeActive[1] = JSON.parse(msgStr);
       typeActive[1].extendData.goldRain = null;
       typeActive[1].extendData.lightMessage = null;
       typeActive[1].extendData.popupMessage = null;
       typeActive[1].extendData.dynamicMessage = null;
       }
       //轻消息
       if (extendData.lightMessage){
       typeActive[2] = JSON.parse(msgStr);
       typeActive[2].extendData.goldRain = null;
       typeActive[2].extendData.voiceMessage = null;
       typeActive[2].extendData.popupMessage = null;
       typeActive[2].extendData.dynamicMessage = null;
       }
       if(extendData.popupMessage){
       typeActive[3] = JSON.parse(msgStr);
       typeActive[3].extendData.goldRain = null;
       typeActive[3].extendData.voiceMessage = null;
       typeActive[3].extendData.lightMessage = null;
       typeActive[3].extendData.dynamicMessage = null;
       }
       if(extendData.dynamicMessage){
       typeActive[4] = JSON.parse(msgStr);
       typeActive[4].extendData.goldRain = null;
       typeActive[4].extendData.voiceMessage = null;
       typeActive[4].extendData.lightMessage = null;
       typeActive[4].extendData.popupMessage = null;
       }
       }catch(e){}
       }

       // console.log("typeActive:"+JSON.stringify(typeActive));
       for(var i = 0;i <typeActive.length;i++){
       if(typeActive[i] != null){
       if(($rootScope.curMsg == i && $rootScope.curMsg!=3)|| mqCallback(typeActive[i], true)) {
       typeActive[i] = null;
       }
       }
       }
       },2000);*/
      //消息处理方法
      var mqCallback = function (body, isInterval) {
        //var p = JSON.parse(d.body);
        processMessage(body);
        return true;
        /*if(isInterval){
         if($rootScope.appIsPaused){
         console.log("后台运行，不展示消息");
         return false;
         }
         }else {
         body["runOrder"] = $rootScope.totalOrder;
         $rootScope.totalOrder++;
         unreads.push(body);
         return false;
         }*/
        //var nowTime = new Date().getTime();
        /* if($rootScope.loadingStart > 0) {
         console.log("loadingStart="+$rootScope.loadingStart+" event="+JSON.stringify($rootScope.curMsg));
         return false;
         }else{
         processMessage(body);
         return true;
         }*/
      };

      $rootScope.token = null;

      //初始化webSocket连接
      IMService.initWebSocket(mqCallback);
    })();


    /** loading 拦截器 **/
    $rootScope.$on('REQUIRE_LOGIN', function () {
      if (!CacheService.get('REQUIRE_LOGIN_SHOW')) {
        CacheService.set('REQUIRE_LOGIN_SHOW', true);
        PopupService.showConfirm('提示', '尚未登录，是否去登录？', function (res) {
          if (res) {
            $state.go('login');
          } else {
            UserService.clearUser();
          }
          CacheService.set('REQUIRE_LOGIN_SHOW', false);
        }, '去登录');
      }
    });
    var requestCount = 0;
    /** loading 拦截器 **/
    $rootScope.$on('LOADING:SHOW', function () {
      requestCount++;
      if (!$rootScope.isLoadShowing) {
        var params = {
          template: '<div style="width:35px;height:35px;background:#666666;border-radius:5px;"><img src="{{imgBaseURL}}img/ic_refresh_02.gif" style="width: 35px;height:35px;"/></div>',
          duration: 7000
        };
        $ionicLoading.show(params)
      }
      $rootScope.isLoadShowing = true;
    });

    $rootScope.$on('LOADING:HIDE', function () {
      requestCount--;
      if (requestCount <= 0) {
        $rootScope.isLoadShowing = false;
        $ionicLoading.hide()
      }
    });

    HomePageService.isWdHost()
      .success(function (res) {
        $rootScope.isWdHost = res.data.isHost;
      })

    //获取广告页
    AdvertisementService.getAdImage()
      .success(function (response) {
        if (response.data[0] && response.data[0].image) {
          var bannerId = $localstorage.get('bannerId');
          if (bannerId != response.data[0].bannerId) {
            $localstorage.set('openCount', 0);
            $localstorage.set('hasAD', 'noAD');
          }
          var imgUrl = response.data[0].image;
          $localstorage.set('hasAD', imgUrl);
          $localstorage.set('bannerId', response.data[0].bannerId);
        } else {
          $localstorage.set('hasAD', 'noAD');
        }
      })
      .error(function (err) {
        $localstorage.set('hasAD', 'noAD');
      });


    //umeng统计 web 版代码
    if (window._czc) {
      _czc.push(["_setAccount", "1259430011"]);
    }
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      var targetUrl = $location.$$absUrl.substring(location.origin.length);
      if (window._czc) {
        //  console.log('umeng--tongji---****---'+targetUrl);
        _czc.push(["_trackPageview", targetUrl]);

      }
      //海尔统计
      if (window.doGetData) {
        doGetData();
      }

    });

    //window.onerror = function (msg, url, line) {
    //  var idx = url.lastIndexOf("/");
    //  if (idx > -1) {
    //    url = url.substring(idx + 1);
    //  }
    //  alert("ERROR in " + url + " (line #" + line + "): " + msg);
    //  return false;
    //};
    window.sgOnNotificationReceived = function (p) {
      console.log('收到了 来自 umeng 推送的 的消息'); //注意 ＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊ android 发消息时 要选自定义 行为 才可触发 该方法 ＊＊＊＊＊＊＊＊＊＊＊

    };
    //每次启动app时判断是不是微店主，是否实名认证
    if (UserService.isUserLogin()) {
      var isSuccessLoginID = UserService.getUser().mid;
      //判断是否微店主
      LoginService.checkOpenStore(isSuccessLoginID) //发请求查询 用户是否开过店
        .success(function (response, status, headers, config) {
          if (!response.data) {
            $rootScope.isBuyer = 0; //不是微店主
            LoginService.setRole($rootScope.isBuyer);
          } else {
            $rootScope.isBuyer = 1; //微店主
            LoginService.setRole($rootScope.isBuyer);
            HomePageService.isWdHost()
              .success(function (response) {
                if (response.success) {
                  $rootScope.o2oMessage = response.message;
                  if (response.data.isHost == 1) { //微店主
                    if (response.data.o2o == true) { // 没有实名 弹窗出现
                      $rootScope.myPopup = $ionicPopup.show({
                        template: $rootScope.o2oMessage,
                        buttons: [{
                          text: '退出',
                          onTap: function () {
                            $rootScope.userCount = "";
                            $rootScope.password = "";
                            var nowUser = UserService.getUser();
                            if (nowUser.sessionValue == undefined) {
                              UserService.clearUser();
                              $state.go('login');
                              LoginService.setRole(undefined);
                              window.localStorage.setItem('isLogin', UserService.isUserLogin());
                              $localstorage.set('storeId', '');
                            } else {
                              AccountMessageService.unloadAccount(UserService.getUser().token, UserService.getUser().sessionValue, '2e8352919709910328ec6b6b682a74f3')
                                .success(function (response, status, headers, config) {
                                  if (response.success) {
                                    UserService.clearUser();
                                    $state.go('login');
                                    LoginService.setRole(undefined);
                                    // const Bearer = `Bearer${response.data}`;
                                    var Bearer = 'Bearer' + response.data;
                                    window.localStorage.setItem('sg_login_token_secret', Bearer);
                                    window.localStorage.setItem('isLogin', UserService.isUserLogin());
                                    $localstorage.set('storeId', '');
                                  }
                                });
                            }
                          }
                        }]
                      });
                    } else if (response.data.o2o == null) { // 已经实名
                      // myPopup.close();
                      $rootScope.loginIsAuthentication = false;
                    } else { // false 不是o2o 用户
                      //$rootScope.myPopup.close();
                      // 实名认证
                      trueAuthenticationService.doInit()
                        .success(function (response) {
                          if (response.success) {
                            if (response.data.isAuth) { // 实名认证过
                              $rootScope.loginIsAccord = false;
                              $rootScope.loginIsAuthentication = false;
                            } else { //未认证
                              $rootScope.isCloseBtn = response.data.forceAuthFlag;
                              $rootScope.loginIsAccord = false;
                              if ($rootScope.isCloseBtn) {
                                $rootScope.loginIsAuthentication = true;
                              }

                            }
                          } else {
                            console.log('请求实名认证接口出错')
                          }
                        });
                    }
                  }
                } else {
                  PopupService.showToast('获取数据信息失败！');
                }
              });

          }
        }).error(function (res) {
          PopupService.showToast('网络连接失败！');
        });
    }
    $ionicPlatform.ready(function () {



      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (navigator.splashscreen) {
        navigator.splashscreen.hide();
      }

      //每次打开app 调用记录微店主金币接口
      getAppLoginRecord();

      var deviceInfoUrl = UrlService.getUrl('DEVICE_INFO');
      var deviceInfo = ionic.Platform.isAndroid() ? "android" : (ionic.Platform.isIOS() ? "ios" : "unknown");
      if (window.UmengPush) {
        if (window.UmengPush.getDeviceToken) {
          window.UmengPush.getDeviceToken([], function (deviceToken) {
            $http.get(deviceInfoUrl + "?device_token=" + deviceToken + "&device_type=" + deviceInfo);
            console.log("注册token:device_token=" + deviceToken + "&device_type=" + deviceInfo);
          });
        }

        if (window.UmengPush.onReceiveMessage) {
          try {
            window.UmengPush.onReceiveMessage(function (alertMessage) {
              console.log("收到消息:" + alertMessage);
              window.UmengPush.onReceiveMessage(arguments.callee, null);
              if (alertMessage) {
                CreditService.getGameId(function (gameId) {
                  $state.go("vip", {
                    gameId: gameId,
                    msg: alertMessage
                  });
                });
              }
            }, null);
          } catch (e) {
            console.log(e);
          }
        }
      } else {
        console.log("无法注册deviceToken，因为无法找到Umeng插件");
      }

      $rootScope.hasWechat = false; //根据 是否安装了微信 添加微信登录按钮
      if (window.wechatPay && window.wechatPay.checkAppInstalled) {
        window.wechatPay.checkAppInstalled(function (data) {
          if (!data) {
            $rootScope.hasWechat = false;
          } else {
            // 调用微信客户端 支付
            $rootScope.hasWechat = true;

          }
        });
      }
      $rootScope.hasQQ = true;
      //if(window.umeng){
      //  window.umeng.checkAppInstalled('qq', function (data) {
      //    if (data == false) {
      //      $rootScope.hasQQ = false;
      //    } else {
      //      $rootScope.hasQQ = true;
      //    }
      //  });
      //}


      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      //通过判断当前是否有cordova决定是否替换window.open
      if (window.cordova && window.cordova.InAppBrowser) {
        window.open = window.cordova.InAppBrowser.open;
      }
      $rootScope.isIOS = !!window.cordova && (ionic.Platform.platform().indexOf('ios') != -1);
      $rootScope.isApp = window.cordova ? true : undefined;

      //发布话题获取屏幕的三等分宽度，用来图片展示
      $rootScope.screenThreeWidth = {
        height: (window.screen.width - 50) / 3 + 10 + 'px'
      };
      //列表显示时获取屏幕的三等分宽度，用来图片展示
      $rootScope.screenListThreeWidth = {
        height: (window.screen.width - 20) / 3 + 'px'
      };
      console.log('$scope.height', $rootScope.screenThreeWidth);

      //键盘上推底部样式
      if (ionic.Platform.platform().indexOf('ios') != -1) {
        window.addEventListener('native.keyboardshow', keyboardShowHandler);

        function keyboardShowHandler(e) {
          console.log('Keyboard height is: ' + e.keyboardHeight);

          $timeout(function () {
            $rootScope.keyboardHeight = {
              "bottom": e.keyboardHeight + 'px'
            };
            var tempH = e.keyboardHeight + 25;
            $rootScope.contentMarginBottom = {
              "margin-bottom": tempH + 'px'
            };
          }, 100);
        }

        window.addEventListener('native.keyboardhide', keyboardHideHandler);

        function keyboardHideHandler(e) {
          $timeout(function () {
            $rootScope.keyboardHeight = {
              "bottom": 0
            };
            $rootScope.contentMarginBottom = {
              "margin-bottom": 0
            };
          }, 100);
        }
      } else {
        $timeout(function () {
          $rootScope.keyboardHeight = {
            "bottom": 0
          };
        }, 100);
      }
      //下载app地址
      if (!window.cordova) {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isiOS) {
          $rootScope.downAppUrl = 'https://itunes.apple.com/cn/app/shun-guang-wei-dian/id1035160364?mt=8';
        } else if (isAndroid) {
          $rootScope.downAppUrl = 'http://app.qq.com/#id=detail&appid=1104761357';
        } else {
          $rootScope.downAppUrl = '';
        }
      }

      //强制更新 打开下载更新页面
      $rootScope.toDownLoad = function () { //todo  分平台 写下载地址
        var dl = $rootScope.isIOS ? $rootScope.globalConstant.iosDownLoadUrl : $rootScope.globalConstant.androidDownLoadUrl;
        if (window.cordova)
          cordova.InAppBrowser.open(dl, '_system');
        else {
          window.open(dl, '_system');
        }
      };
      // yl  rn 不需要定位
      if(window.navigator.userAgent.indexOf('ShunGuangRN') <= -1){ // 不是rn app
        //定位相关
        if (ionic.Platform.isAndroid() && window.cordova) {
          if (cordova.plugins.amap4location) {
            cordova.plugins.amap4location.location(
              function (response) {
                $rootScope.globalConstant.lat = response.latitude;
                $rootScope.globalConstant.lon = response.longitude;
                CommonAddressService.addAddressInfo();
              },
              function (error) {
                if (error['errorCode'] == '12') {
                  $ionicPopup.alert({
                    title: '',
                    cssClass: 'location-popup',
                    okText: '知道了',
                    template: '<div style="color: #000;font-size: 14px;font-weight: bold;">打开“定位服务”来允许“顺逛”确定您的位置</div><div style="color: #000;font-size: 12px;">顺逛将获取您的位置，为您提供更精准的服务</div>'
                  });
                }
                CommonAddressService.addAddressInfo();
              }
            );
          }
        } else {
          /*定位服务--采用浏览器定位*/
          //AreaService.init().then(function(res) {
          //  $rootScope.globalConstant.lat = res.coords.latitude;
          //  $rootScope.globalConstant.lon = res.coords.longitude;
          //  $rootScope.globalConstant.positionStatus = true;
          //  CommonAddressService.addAddressInfo();
          //}, function(error) {
          //  if(error.code=='1'){
          //    $rootScope.globalConstant.positionStatus = false;
          //  }
          //  CommonAddressService.addAddressInfo();
          //});
  
          /*定位服务--高德地图定位
           * 此处为H5定位使用的方法，解决ios10.0以上系统网页端无法使用原生浏览器定位问题
           * merge时请留意*/
          mapObj = new AMap.Map('');
          mapObj.plugin('AMap.Geolocation', function () {
            var geolocation = new AMap.Geolocation();
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
            AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
          });
  
          //高德地图回调函数--解析定位结果
          function onComplete(data) {
            $rootScope.globalConstant.lon = data.position.getLng();
            $rootScope.globalConstant.lat = data.position.getLat();
            $rootScope.globalConstant.positionStatus = true;
            CommonAddressService.addAddressInfo();
          }
  
  
          function onError(data) {
            $rootScope.globalConstant.positionStatus = false;
            CommonAddressService.addAddressInfo();
          }
  
        }
      }

    });


    //拦截android设备物理back键
    // $ionicPlatform.registerBackButtonAction(function (e) {
    //   e.preventDefault();
    //   showConfirm();
    //   return false;
    // }, 101);
    $ionicPlatform.registerBackButtonAction(function (e) {
      if ($rootScope.fromState == 'advertisement') {
        $state.go('homePage');
      } else if ($location.path().substring(0, 11) == '/paymentxyz') {
        var bv = $ionicHistory.viewHistory().backView;
        if (bv.stateName == 'orderManage') {
          $ionicHistory.goBack(-1);
        } else {
          $ionicHistory.goBack(-2);
        }
      } else if ($ionicHistory.currentStateName() == 'orderManage') {
        if (!$ionicHistory.backView()) {
          $state.go('homePage');
          $ionicHistory.clearCache(); //回到首页 清除 cacheView
        } else if ($ionicHistory.viewHistory().backView.stateName == 'batchDeleteOrder') {
          $ionicHistory.goBack(-2);
        } else if ($ionicHistory.backView().stateName == 'afterOrderSubmit') {
          //  $state.go('homePage');console.log('after order submit --- 特殊处理 返回');

          $ionicHistory.goBack(-3); //回到详情页
          //  $ionicHistory.clearCache();//回到首页 清除 cacheView
        }
        //如果是从 建行分期支付页面 进入的
        else if ($ionicHistory.backView().stateName == 'ccbPay' || $ionicHistory.backView().stateName == 'paymentxyz' || $ionicHistory.viewHistory().backView.stateName == 'payResultSuccess' || $ionicHistory.viewHistory().backView.stateName == 'payResultFailure') {
          if (LoginService.getRole() == 1) {
            //如果是卖家去小店
            $state.go('homePage');
            $ionicHistory.clearCache();
          } else {
            //如果是买家 ，去选品市场
            $state.go('homePage');
            $ionicHistory.clearCache();
          }
        } else {
          $ionicHistory.goBack(-1);
        }
      } else if ($ionicHistory.currentStateName() == 'ccbPay') {
        $state.go('orderManage');
      } else if ($ionicHistory.currentStateName() == 'homePage' || $ionicHistory.currentStateName() == 'guidePage' || $ionicHistory.currentStateName() == 'directPurchase') {
        showConfirm();
      } else if ($ionicHistory.currentStateName() == 'homePage' || $ionicHistory.currentStateName() == 'cart' || $ionicHistory.currentStateName() == 'personalCenter' || $ionicHistory.currentStateName() == 'topic.qhot' || $ionicHistory.currentStateName() == 'branchType') {
        $state.go('homePage');
        $ionicHistory.clearCache();
      } else if ($ionicHistory.currentStateName() == 'payResultSuccess' || $ionicHistory.currentStateName() == 'payResultFailure') {
        $state.go('orderManage');
      } else if ($ionicHistory.currentStateName() == 'shopRevenue') {
        if (!$ionicHistory.backView() || $ionicHistory.viewHistory().backView.stateName == 'mentionCenter') {
          $state.go('homePage');
          return;
        }
        ($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('login') > 0) ? $ionicHistory.goBack(-2): $ionicHistory.goBack();
      } else if ($ionicHistory.currentStateName() == 'bankCard') {
        if ($ionicHistory.viewHistory().backView == null) {
          $state.go('personnalCenter');
        } else if ($ionicHistory.viewHistory().backView.stateName == 'shopRevenue' || $ionicHistory.viewHistory().backView.stateName == 'paymentxyz') {
          $ionicHistory.goBack();
        } else {
          $state.go('personnalCenter');
        }
      } else if ($ionicHistory.currentStateName() == 'criticalSuccess') {
        $ionicHistory.goBack(-2);
      } else if ($ionicHistory.currentStateName() == 'bankCardDetail') {
        $state.go('bankCard');
      } else if ($ionicHistory.currentStateName() == 'noteDetails') {
        if ($rootScope.globalConstant.showvideo) {
          $rootScope.$apply(function () {
            $rootScope.globalConstant.showvideo = false;
          })
          var video = document.getElementsByTagName("video");
          for (var i = 0; i < video.length; i++) {
            video[i].pause();
          }
          $('.bof').css('display', 'block');
        } else {
          $rootScope.nextPageBefore = 'noteDetails';
          $ionicHistory.goBack();
        }
      } else if ($ionicHistory.currentStateName() == 'classNoteDetails') {
        $rootScope.nextPageBefore = 'classNoteDetails';
        $ionicHistory.goBack();
      } else if ($ionicHistory.currentStateName() == 'publishCircle' || $ionicHistory.currentStateName() == 'publishEdit') {
        $rootScope.backgo = 'publish';
        if ($rootScope.globalConstant.showvideo) {
          $rootScope.$apply(function () {
            $rootScope.globalConstant.showvideo = false;
          })

          var video = document.getElementsByTagName("video");
          for (var i = 0; i < video.length; i++) {
            video[i].pause();
          }
          $('.pcbf').css('display', 'block');
          $('.pebf').css('display', 'block');
        } else {
          $ionicHistory.goBack();
        }
      } else if ($ionicHistory.currentStateName() == 'letterGroupFriend') {
        $rootScope.nextPageBefore = 'letterGroupFriend'
        $ionicHistory.goBack();
      } else if ($ionicHistory.currentStateName() == 'letterSend') {
        $rootScope.nextPageBefore = 'letterSend'
        $ionicHistory.goBack();
      } else if ($ionicHistory.currentStateName() == 'privateLetter') {
        $rootScope.nextPageBefore = 'privateLetter';
        $ionicHistory.goBack();
      } else {
        $ionicHistory.goBack();
      }
    }, 101);

    function showConfirm() {
      var confirmPopup = $ionicPopup.confirm({
        title: '<strong>退出应用</strong>',
        template: '确定要退出应用吗?',
        okText: '退出',
        okType: 'button-assertive',
        cancelText: '取消'
      });
      confirmPopup.then(function (res) {
        if (res) {
          //退出应用
          ionic.Platform.exitApp();
        } else {
          // Don't close
        }
      });
    }

    /** 登录 拦截器 **/
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      // 如果是RN端的顺逛打开的H5，返回到上一个页面时，看是否还有上一级页面 没有就发送一条消息给RN的wenview 让RN关闭wenview
      // if(window.location.href.indexOf('sg_rn_app')!=-1&&$ionicHistory.viewHistory().histories.root.cursor == 0) {
      //   window.postMessage('goback');
      // }
      /*
       ** 第三方免登处理
       **   _aPlatform=2 优家  _aPlatform=3单品页
       ** 访问规则：http://域名/#/homePage?_aToken=123&_aPlatform=2
       ** 参数说明：_aToken= 用户token【类型等于2时候需要通过接口获取mId】||【类型等于3时候 直接传的是mId】
       **          _aPlatform=平台类型  【2=优佳】|| 【3=单品也-详情页】
       ** 注   意：【传参先后顺序严格按照定义的顺序】
       */

      /*设置参数*/
      if ((toState.name == 'homePage' || toState.name == 'productDetail') && window.location.href.indexOf('_aPlatform') != -1 && window.location.href.indexOf('_aToken') != -1) {
        //alert('你是第三方平台过来的');
        var hrefParams = window.location.href.split('?')[1];
        var _aToken = hrefParams.split('&')[0].split('=')[1];
        var _aPlatform = hrefParams.split('&')[1].split('=')[1];
        window.localStorage._aToken = _aToken;
        window.localStorage._aPlatform = _aPlatform;

        if (_aPlatform == 3) {
          //单品页- 通过_aToken(mId)获取用户信息
          HomePageService.isAuthoMid(_aToken);
        }
      }
      /*第三方跳转处理*/

      var state = $state.get(toState.name);
      // 如果不是从顺逛的RN app跳转来的
      if (state.requiredLogin && !UserService.isUserLogin()) {
        event.preventDefault();
        // 跳转到登录前，清空个人信息
        UserService.clearUser();
        CacheService.set('toState', toState);
        CacheService.set('toParams', toParams);
        $state.go('login');
      }
      //如果是从login跳出(如果login页面采用回退guidePage逻辑，进行跳出判断会产生循环bug，解决方法为回退按钮均自定义返回指定位置)
      //if (state.requiredLogin && fromState.name == 'login') {
      //  var newToState = CacheService.get('toState');
      //  var newToParams = CacheService.get('toParams');
      //  if (newToParams && newToParams) {
      //    if(toParams.back == 'yes')
      //    {
      //      event.preventDefault();
      //      $state.go(newToState, newToParams);
      //    }
      //  }
      //}

      //登录失效拦截器 所广播 的session 失效广播 清除本地缓存 的user
      $rootScope.$on('userIntercepted', function (errorType) {
        UserService.clearUser();
        $state.go("login");

      })
      //开门红入口逻辑处理
      if ((fromState.name == "" && toState.name == 'homePage') || (fromState.name == "login" && toState.name == 'homePage') || (fromState.name == "advertisement" && toState.name == 'homePage') || (fromState.name == "guidePage" && toState.name == 'homePage')) {
        $http.get(UrlService.getGameUrl('IS_KAIMENHONG_AVAILABLE'))
          .success(function (response) {
            if (response === true) {
              $state.go('bannerTheme', {
                bannerId: UrlService.getCPUrl('KMH_ID')
              });
            }
          });
      }
    })

  }
]);
