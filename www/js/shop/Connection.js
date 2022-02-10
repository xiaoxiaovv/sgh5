APP.service('ConnectionService', ['$http', 'UrlService', 'CalculateStrLength', function($http, UrlService, CalculateStrLength) {
  this.getConnectionMsg = function(relationshipType, pageIndex, pageSize) {
    var param = {
      relationshipType: relationshipType,
      pageIndex: pageIndex,
      pageSize: pageSize
    }
    return $http.get(UrlService.getUrl('CONNECTION_INDEX'), param);
  }
  this.limitStrLength = function(str, limitLength) {
    return CalculateStrLength.limitStrLength(str, limitLength);
  }
}]);
