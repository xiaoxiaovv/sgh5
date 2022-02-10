'use strict';

/**
 * creater:chuanpeng.zhu@dhc.com.cn
 * create time:2015/01/03
 * describe：弹窗服务
 **/

APP.service('PopupService', ['$rootScope', '$ionicPopup', '$timeout', '$ionicLoading', 'UrlService', function ($rootScope, $ionicPopup, $timeout, $ionicLoading, UrlService) {

  // A confirm dialog
  this.showConfirm = function (title, message, callback, okText) {
    var defaultTitle = '提示';
    var defaultMessage = '默认提示信息';
    var defaultOkText = '确定';
    var defaultCancelText = '取消';

    var confirmPopup = $ionicPopup.confirm({
      title: title ? title : defaultTitle,
      okText: okText ? okText : defaultOkText,
      cancelText: defaultCancelText,
      template: message ? message : defaultMessage
    });
    confirmPopup.then(callback);
  };

  // An alert dialog
  this.showAlert = function (title, message, callback) {
    var defaultTitle = '提示';
    var defaultMessage = '默认提示信息';
    var defaultOkText = '确定';
    var alertPopup = $ionicPopup.alert({
      title: title ? title : defaultTitle,
      okText: defaultOkText,
      template: message ? message : defaultMessage
    });
    alertPopup.then(callback);
  };

  //Toast message
  this.showToast = function (message) {
    var defaultMessage = '默认提示消息';
    var msg = message ? message : defaultMessage;
    $ionicLoading.show({
      // template: message?message:defaultMessage,
      template: '<div style="background:rgba(0,0,0,0.4);border-radius:4px;padding:8px;">' + msg + '</div>',
      duration: 2000 //持续时间3000ms后调用hide()
    });
  };
  this.goldIncrease = function (message) {
    $rootScope.curMsg = 0;
    $ionicLoading.show({
      // template: message?message:defaultMessage,
      template: '<div style="width:240px;position:absolute;left:50%;margin-left:-120px;bottom:100px;background:rgba(0,0,0,0.4);border-radius:18px;padding:8px;">' + message + '</div>',
      duration: 2000,
      animation: 'fade-in',
      showBackdrop: false
    });
  }
    //新用户自动领取优惠券弹窗
  this.showGoodCoupon = function (couponPrice) {
    var lightMssageBoxCoupon = $("<div/>").html('<div style="width:100%;height:100%;position:fixed;background: rgba(0,0,0,0.70);z-index:100;top:0;left:0;" flex="cross:center main:center">\n    <div style="width:250px;height:264px;background: #fff url(http://cdn09.ehaier.com/shunguang/H5/www/img/im-quant@2x.png) no-repeat;background-size:100% 185px;border-radius: 8px;position:relative;">\n      <div style="position:absolute;width:24px;height:24px;top:0;right:0;" onclick="closeGoodCoupon(this)">\n        <img style="width:100%;height:100%;padding:5px;" src="http://cdn09.ehaier.com/shunguang/H5/www/img/ic-close@2x.png">\n      </div>\n      <div style="height:185px;padding:32px 24px 0;">\n        <div style="font-size: 12px;color: #fff;text-shadow: 0 1px 1px rgba(111,0,0,0.75);text-align:center;">\u8D35\u5E97\u5F00\u5F20\uFF0C\u4EF7\u503C<span style="font-size:20px;color:#FFE447;">'+couponPrice+'</span>\u4F18\u60E0\u5238\u5927\u793C\u5305\u653E\u5165\u4F60\u7684\u94B1\u5305\uFF0C\u4F9B\u4F60\u4EFB\u6027\u6D88\u8D39\uFF01</div>\n      </div>\n      <div style="height:79px;padding-top:17px">\n        <div onclick="gomyCouponsList(this)" style="background: #f40;box-shadow: 0 1px 2px 0 rgba(255,68,0,0.50);border-radius: 78px;height:44px;margin:0 21px;font-size: 16px;color: #fff;text-align:center;line-height:44px;">\u6211\u7684\u4F18\u60E0\u5238</div>\n    </div>\n    </div>\n  </div>').appendTo($("body"));
  };
  //等级升级以后的弹窗提示
  this.levelUp = function (levelName, levelOrder, nextLevelExp) {
    $ionicLoading.show({
      // templateUrl:'templates/common/levelUpTemplate.html',
      template: '<div style="width:335px;position:absolute;top:-2px;left:0;bottom:0;right:0;margin: auto;z-index:10;">\n                    <img src="http://cdn09.ehaier.com/shunguang/H5/www/img/levelUp.png" style="width:100%;position:absolute;top:0;left:0;bottom:0;right:0;margin: auto;">\n                    <img ng-if="' + levelOrder + '<11" src="http://cdn09.ehaier.com/shunguang/H5/www/img/HeadImage' + levelOrder + '.png" style="width:140px;height:133px;position:absolute;top:-100px;left:13px;bottom:0;right:0;margin: auto;">\n                    <img ng-if="' + levelOrder + '==11" src="http://cdn09.ehaier.com/shunguang/H5/www/img/HeadImage mengzhu.png" style="width:140px;height:133px;position:absolute;top:-100px;left:13px;bottom:0;right:0;margin: auto;">\n                    <p style="width:82px;height:28px;line-height:28px;font-size:20px;color:#ff3232;letter-spacing:-0.49px;text-align:center;\n                    position: absolute;top:72px;left:10px;bottom:0;right:0;margin: auto;"\n                    >' + levelName + '</p>\n                    <p ng-if="' + nextLevelExp + '" style="height:20px;position: absolute;top:253px;left:10px;bottom:0;right:0;margin: auto;font-size:14px;color:#4a4a4a;letter-spacing:-0.34px;text-align:center;">\u8DDD\u79BB\u4E0B\u4E00\u4E2A\u7EA7\u522B\u8FD8\u6709' + nextLevelExp + '\u6210\u957F\u503C</p>\n                    <div style="width:24px;height:24px;position: absolute;top:-210px;left:0;bottom:0;right:-220px;margin: auto;"\n                    onclick="closeLevelUpPop()" ></div>\n                </div>\n                <div class="myBackDrop" style="width:100%;height:100%;position:fixed;top:0;left:0;background:rgba(0,0,0,0.3);visibility: visible;"></div>',
      animation: 'fade-in'
    });
  };

  //show dynamicMessage
  this.dynamic = function (message) {
    // console.log(1);
    $ionicLoading.show({
      // templateUrl:'templates/common/levelUpTemplate.html',
      template: '<div style="width:70%;height:35px;line-height:35px;background:#000;opacity:0.5;position:absolute;top:5px;left:8px;z-index:99;border-radius:5px;font-size:12px;">' + message + '</div>',

      duration: 3000,
      showBackdrop: false
    });
  };
  //Toast message
  this.showToastShort = function (message) {
    var defaultMessage = '默认提示消息';
    $ionicLoading.show({
      template: message ? message : defaultMessage,
      duration: 1000 //持续时间1000ms后调用hide()
    });
  };

  this.showToastWithTime = function (message, time) {
    var defaultMessage = '默认提示消息';
    $ionicLoading.show({
      template: message ? message : defaultMessage,
      duration: time //持续时间1000ms后调用hide()
    });
  };

  //图片查看popup
  this.showImgViewer = function (imgSrc, hasImageFilter) {
    //默认图片过滤true
    var imageSrc = '';
    var hasImgFilter = arguments[1] ? arguments[1] : true;
    if (hasImgFilter) {
      var nsrc = 'default.png';
      if (imgSrc != null && imgSrc != '') {
        nsrc = imgSrc;
      }
      imageSrc = UrlService.getImageUrlData() + nsrc;
    } else {
      imageSrc = imgSrc;
    }
    var imgViewerPopup = $ionicPopup.show({
      template: '<img ng-src="' + imageSrc + '">',
      title: '',
      subTitle: '',
      cssClass: 'jsh-img-viewer',
      buttons: [{
        text: '&#xe642;',
        type: 'jsh-img-viewer-close dhcfont',
        onTap: function onTap(e) {
          imgViewerPopup.close();
        }
      }]
    });
  };

  /****
   *
   *  @author fanjunjie
   *
   * options 说明
   *  onOpen:打开窗体回调
   *  content:弹框内容
   *  buttons:按钮
   *    selector:jquery选择器
   *    handler:点击回调
   *
   * demo
   *  {
   *    content:'<h1>Hello World!</h1>',
   *    onOpen:function(){
   *      console.log('dialog is open!');
   *    },
   *    buttons:[
   *      {selector:'#btn',handler:function(){
   *        alert('You are welcome!');
   *      }}
   *    ]
   *  }
   *
   * 弹框
   * @param options
   * @returns {*|jQuery}
   */
  this.dialog = function(options){
    var dialog=$("<div style='background-color:rgba(0,0,0,0.5);width:100%;position:absolute;top:-2px;left:0;bottom:0;right:0;margin: auto;z-Index:10;display:flex;flex-direction: column;align-content:center;justify-content:center;align-items:center'/>")
      .append(options.content).appendTo($("body"));
    if(options.onOpen){
      options.onOpen.call(dialog);
    }
    if(options.buttons){
      $(options.buttons).each(function(){
        if(this["handler"]){
          $(this["selector"]).click(this["handler"]);
        }
      });
    }
    return dialog;
  };
}]);
