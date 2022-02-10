/**
 * creater:chuanpeng.zhu@dhc.com.cn
 * create time:2015/12/30
 * describe：URL管理服务
 **/
/*接口地址管理 */
APP.service('H5LocationService', [function () {
  this.getLocation = function (callback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(callback);
    }
    else {
      alert("Geolocation is not supported by this browser.");
    }
  }
}]);
