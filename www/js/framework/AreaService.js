/**
 * creater:chuanpeng.zhu@dhc.com.cn
 * create time:2015/12/30
 * describe：定位并根据经纬度反编码出详细地址。
 **/

APP.factory('AreaService', ['$rootScope', 'UrlService', '$q', '$http', function ($rootScope, UrlService, $q, $http) {

  return {
    init: function () {
      var deferred = $q.defer();
      navigator.geolocation.getCurrentPosition(function (position) {
        deferred.resolve(position);
      }, function (error) {
        deferred.reject(error);
      },{
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout : 10000
      });
      return deferred.promise;
    },

    getLocalArea: function () {
      var deferred = $q.defer();//声明承诺

      AMap.plugin('AMap.Geocoder',function(){//回调函数
        geocoder = new AMap.Geocoder({
          city: "010"//城市，默认：“全国”
        });
        var lnglatXY=[$rootScope.globalConstant.lon, $rootScope.globalConstant.lat];
        geocoder.getAddress(lnglatXY, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            deferred.resolve(result);//请求成功
          }else{
            deferred.reject(result)
          }
        });
      });
      //var params = {
      //  key:'7c964766c309377bc93c3d88470cd995',
      //  location:$rootScope.globalConstant.lon + ',' + $rootScope.globalConstant.lat,
      //  noLoading:true
      //};
      //$http.get(UrlService.getAMAPUrl(),params)
      //  .success(function(response){
      //    deferred.resolve(response);//请求成功
      //  })
      //  .error(function(err){
      //    deferred.reject(err)
      //  });
      return deferred.promise;   // 返回承诺，这里返回的<strong><span style="color: #ff0000;">不是数据</span></strong>，而是API
    }
  }
}
]);
