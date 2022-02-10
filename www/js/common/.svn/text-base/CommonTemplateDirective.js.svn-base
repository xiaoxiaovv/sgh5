/**
 * 头部模版
 */
APP.directive('titleType', ['$http', 'UrlService', function ($http, UrlService) {
  return {
    restrict: 'A',
    template: '<ng:include src="tType"/>',
    link: function (scope, element, attr) {

      var type = attr.titleType;

      scope.tType = 'templates/common/TitleTemplate' + type + '.html';
    }
  }
}]);

/**
 * 列表展示模版
 */
APP.directive('listType', ['$http', 'UrlService', function ($http, UrlService) {
  return {
    restrict: 'A',
    template: '<ng:include src="lType"/>',
    link: function (scope, element, attr) {
      var type = attr.listType;
      console.log(type+'generate template------111');
      scope.lType = 'templates/common/ListTemplate' + type + '.html';
    }
  }
}]);
