/**
 * Created by cjk on 16/3/3.
 */
APP.factory('InAppBrowserService', ['PopupService','$rootScope', function (PopupService,$rootScope) {
 // alert(window.device.hasNewBrowser);
  var isAndroid = ionic.Platform.isAndroid();
  if(window.device &&  window.device.hasNewBrowser) { //new

    return {
      open: function (url, title) {
        var isAndroid = ionic.Platform.isAndroid();
        var ref = null;
        if (isAndroid) {
          ref = window.open(url, '_blank', 'location=no');
        } else {
          ref = window.open(url, '_blank', 'location=no,toolbar=no');
        }
        ref.addEventListener('loadstart', function (event) {
//      alert(event.url);
          if (event.url && (event.url.indexOf("mstore") > -1 || event.url.indexOf("order") > -1) && event.url.indexOf("helpDetail") <= -1) {
            ref.close();
          }
          if (!isAndroid) {
            if (event.url && (event.url.indexOf("https://m.kjtpay.com/bindmember/cancelBind") > -1
              || event.url.indexOf("https://m.kjtpay.com/bindmember/registerandbind") > -1
              || event.url.indexOf("https://m.kjtpay.com/bindmember/activate") > -1
              || event.url.indexOf("https://m.kjtpay.com/bindmember/nameauth") > -1
              || event.url.indexOf("https://m.kjtpay.com/bindmember/bind") > -1
              || event.url.indexOf("https://m.kjtpay.com/bindmember/success") > -1
              || event.url.indexOf("helpDetail") > -1)) {
              ref.showMyButton();
              //ref.showHelloWorld();
              if (event.url.indexOf("helpDetail") > -1) {
                if (title.length > 12) {
                  title = title.substr(0, 11) + '...';
                }
                ref.addMyTitle(title);
              }
            }
            else {
              ref.hideMyButton();
            }
          }
          else {
            if (event.url && (event.url.indexOf("https://m.kjtpay.com/bindmember/cancelBind") > -1
              || event.url.indexOf("https://m.kjtpay.com/bindmember/registerandbind") > -1
              || event.url.indexOf("https://m.kjtpay.com/bindmember/activate") > -1
              || event.url.indexOf("https://m.kjtpay.com/bindmember/nameauth") > -1)
              || event.url.indexOf("https://m.kjtpay.com/bindmember/bind") > -1
              || event.url.indexOf("https://m.kjtpay.com/bindmember/success") > -1) {
              ref.showMyButton();
            }
            else {
              ref.hideMyButton();
            }
          }

        });
        ref.addEventListener('loaderror', function (event) {
          setTimeout(function () {
            ref.close();
            PopupService.showToast("网络错误,请稍后重试.");
          }, 1000);
        });
        return ref;
      }

    }
  }
  else {
    return {
      open: function (url, title) {
        var isAndroid = ionic.Platform.isAndroid();
        var ref = null;
        if (isAndroid) {
          ref = window.open(url, '_blank', 'location=no');
        } else {
          ref = window.open(url, '_blank', 'location=no,toolbar=no');
        }
        ref.addEventListener('loadstart', function (event) {
          if (event.url && (event.url.indexOf("mstore") > -1 || event.url.indexOf("order") > -1)&& event.url.indexOf("helpDetail") <= -1) {
            ref.close();
          }
          if (!isAndroid) {

            if (event.url && (event.url.indexOf("https://m.kjtpay.com/bindmember/cancelBind") > -1
              || event.url.indexOf("https://m.kjtpay.com/bindmember/registerandbind") > -1
              || event.url.indexOf("https://m.kjtpay.com/bindmember/activate") > -1
              || event.url.indexOf("https://m.kjtpay.com/bindmember/nameauth") > -1
              || event.url.indexOf("helpDetail") > -1)) {
              ref.showMyButton();
              if(event.url.indexOf("helpDetail") > -1)
              {
                if(title.length>12)
                {
                  title=title.substr(0,11)+'...';
                }
                ref.addMyTitle(title);
              }
            }
            else {
              ref.hideMyButton();
            }

          }

        });
        ref.addEventListener('loaderror', function (event) {
          setTimeout(function () {
            ref.close();
            PopupService.showToast("网络错误,请稍后重试.");
          }, 1000);
        });
        return ref;
      }

    }

  }



}]);
