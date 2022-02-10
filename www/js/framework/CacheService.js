/**
 * creater:chuanpeng.zhu@dhc.com.cn
 * create time:2015/12/31
 * describe：缓存服务
 **/
APP.service('CacheService', [function () {

  var cache = {};

  this.get = function (key) {
    return cache[key];
  };
  this.set = function (key, value) {
    return cache[key] = value;
  };
  this.pop = function(key){
    var result = cache[key];
    cache[key] = '';
    return result;
  }
}])
;
