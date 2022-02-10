/**
 * Created by DHC on 2017/3/3.
 */
APP.controller('QuestionDetailsController', ['$scope', '$rootScope', '$state', '$stateParams', 'QuestionDetailsService','PopupService', '$timeout',
  '$ionicScrollDelegate',
  function ($scope, $rootScope, $state, $stateParams, QuestionDetailsService,PopupService, $timeout, $ionicScrollDelegate) {

    /** 变量定义 **/
    $scope.getListDate = {//获取回答详情
      wordsId: '',
      pageSize: '',
      pageIndex: ''
    };
    $scope.answerDate = {//回答问题
      wordsContent: '',
      courseId: '',
      parentId: ''
    };

    /** 方法定义 **/
    //初始化
    $scope.init = function () {
      $scope.wordId = $stateParams.wordsId;
      $scope.getQuestionList();
    };
    //获取回答详情
    $scope.getQuestionList = function () {

      var params = {
        wordsId: $scope.wordId,
        pageSize: 10,
        pageIndex: 1
      };

      QuestionDetailsService.getQuestionDetail(params)
        .success(function (response) {

        }).error(function () {

      })
    };

    //提交回答
    $scope.commitAnswer = function () {

      $scope.answerDate = {
        wordsContent: '',
        courseId: '',
        parentId: ''
      };

      QuestionDetailsService.answerQuestion($scope.answerDate)
        .success(function (response) {

        }).error(function () {

      })
    };

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });

  }]);

APP.service('QuestionDetailsService', ['$http', 'UrlService', function ($http, UrlService) {
  //提交回答
  this.answerQuestion = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('QUESTION_ANSWER'),
      data: param
    });
  };
  //获取回答详情
  this.getQuestionDetail = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('GET_QUESTION_DETAILS'),
      data: param
    });
  };
}]);
