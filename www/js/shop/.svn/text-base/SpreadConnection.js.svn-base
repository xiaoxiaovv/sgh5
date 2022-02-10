APP.service('SpreadConnectionService', ['$http', 'UrlService','CalculateStrLength', function ($http, UrlService,CalculateStrLength) {
 this.getConnectionMessage = function(partnerId,pageIndex,pageSize){
   var param = {
     partnerId:partnerId,
     pageIndex:pageIndex,
     pageSize:pageSize
   }
  return $http.get(UrlService.getUrl('SPREAD_CONNECTION'),param);
 }
 this.limitStrLength = function(str,limitLength){
  return CalculateStrLength.limitStrLength(str,limitLength);
 }
}]);
