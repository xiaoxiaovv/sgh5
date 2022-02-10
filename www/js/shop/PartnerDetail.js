APP.service('PartnerDetailService', ['$http', 'UrlService','CalculateStrLength', function ($http, UrlService,CalculateStrLength) {
 this.getPartnerMessage = function(ownerId,relationshipType){
   var param = {
     ownerId:ownerId,
     relationshipType:relationshipType
   }
  return $http.get(UrlService.getUrl('PARTNER_DETAIL'),param);
 }
 this.limitStrLength = function(str,limitLength){
  return CalculateStrLength.limitStrLength(str,limitLength);
 }
}]);
