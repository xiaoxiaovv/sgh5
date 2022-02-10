/**
 * Created by DHC on 17/1/12.
 */
APP.controller('TestDetailsController', ['$scope', '$rootScope', '$state', '$stateParams', 'TestDetailsService', 'PopupService', '$timeout',
  '$ionicModal',
  function ($scope, $rootScope, $state, $stateParams, TestDetailsService, PopupService, $timeout, $ionicModal) {

    /** 变量定义 **/
    $scope.examQuestionList = {};//考试题列表
    $scope.selectedOptions = [];//选中的答案
    $scope.summitOptions = [];//提交的答案
    $scope.testResult = '';//提交的答案
    /** 方法定义 **/

    $scope.init = function () {
      $ionicModal.fromTemplateUrl('templates/quanzi/CommitTestPaperModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.commitPaperModal = modal;
      });

      $scope.showTestDetails();
      $scope.getTestResult();

    };
    //题目内容
    $scope.showTestDetails = function () {
      var param = {
        courseId: 1
      };
      TestDetailsService.getTestList(param)
        .success(function (response) {
          $scope.index = 0;
          $scope.examQuestionList = response.data.list;
        })
    };
    //考试结果
    $scope.getTestResult = function () {
      var param = {
        courseId: 1
      };
      TestDetailsService.getTestResult(param)
        .success(function (response) {
          $scope.testResult = response.data.list;
        })
    };
    //进入某一题目
    $scope.jumpQuestionDetail = function (num) {
      $scope.index = num - 1;
    };
    //上一题
    $scope.beforeQuestion = function () {
      $scope.index -= 1;
    };
    //下一题
    $scope.nextQuestion = function () {
      $scope.index += 1;

      $scope.selectedOptions.toString();
      var param = {
        courseId: $scope.summitCourseId,
        id: $scope.examId,
        respondentsAnswer: $scope.summitCourseId ? $scope.summitOptions : ''
        // noLoading:true      //App.run 添加noloading判断
      };
      TestDetailsService.getTestList(param)
        .success(function (response) {
          $scope.selectedOptions = [];
          var a = $scope.examQuestionList[$scope.index].respondentsAnswer.split(',');
          for (var i = 0; i < a.length; i++) {
              console.log(a[i]);
              $scope.selectedOptions.push(a[i]);
            // $scope.selectedOptions.push($scope.examQuestionList[$scope.index].respondentsAnswer);
            console.log('选择前答案', $scope.selectedOptions);
          }
        })
    };
    //提交试卷
    $scope.submitPaper = function () {
      $scope.selectedOptions.toString();
      var param = {
        courseId: $scope.summitCourseId,
        id: $scope.examId,
        submitPaperFlag: 1,
        respondentsAnswer: $scope.summitCourseId ? $scope.summitOptions : ''
        // noLoading:true      //App.run 添加noloading判断
      };
      TestDetailsService.getTestList(param)
        .success(function (response) {
          $scope.selectedOptions = [];
        }).error(function (response) {
          PopupService.showToast(response.message);
      })
    };
    //选择选项
    $scope.selectAnswer = function (a, b) {
      $scope.examId = $scope.examQuestionList[a].id;
      $scope.summitCourseId = $scope.examQuestionList[a].courseId;
      if ($scope.examQuestionList[a].subjectType == '单选') {
        for (var i = 0; i < $scope.examQuestionList[a].optionsList.length; i++) {
          // if ($scope.examQuestionList[a].optionsList[i].isSelect) {
          $scope.examQuestionList[a].optionsList[i].isSelect = false;
          console.log('判断是否选中状态+' + i);
          $scope.examQuestionList[a].optionsList[b].isSelect = true;
        }
        $scope.selectedOptions.push($scope.examQuestionList[a].optionsList[b].optionsName);
        $scope.summitOptions = $scope.selectedOptions.toString();
        $scope.selectedOptions = [];
        console.log($scope.summitOptions);

      } else if ($scope.examQuestionList[a].subjectType == '多选') {
        console.log('选择前答案', $scope.selectedOptions);
        if ($scope.examQuestionList[a].optionsList[b].isSelect == true) {//若是选中状态的话取消选中
          for (var i = 0; i < $scope.selectedOptions.length; i++) {
            if ($scope.selectedOptions[i] == $scope.examQuestionList[a].optionsList[b].optionsName) {
              $scope.examQuestionList[a].optionsList[b].isSelect = false;
              $scope.selectedOptions.splice(i, 1);
              $scope.selectedOptions.sort();//答案排序
              $scope.summitOptions = $scope.selectedOptions.toString();
              console.log($scope.summitOptions);
            }
          }

        } else {
          $scope.examQuestionList[a].optionsList[b].isSelect = !$scope.examQuestionList[a].optionsList[b].isSelect;
          $scope.selectedOptions.push($scope.examQuestionList[a].optionsList[b].optionsName);
          $scope.selectedOptions.sort();//答案排序
          $scope.summitOptions = $scope.selectedOptions.toString();
          console.log($scope.summitOptions);
        }
      } else if ($scope.examQuestionList[a].subjectType == '判断') {
        for (var i = 0; i < $scope.examQuestionList[a].optionsList.length; i++) {
          // if ($scope.examQuestionList[a].optionsList[i].isSelect) {
          $scope.examQuestionList[a].optionsList[i].isSelect = false;
          console.log('判断是否选中状态+' + i);
          $scope.examQuestionList[a].optionsList[b].isSelect = true;
        }
        $scope.selectedOptions.push($scope.examQuestionList[a].optionsList[b].optionsName);
        $scope.summitOptions = $scope.selectedOptions.toString();
        $scope.selectedOptions = [];
        console.log($scope.summitOptions);
      }
    };
    //提交试卷
    $scope.showCommitPaper = function () {
      $scope.commitPaperModal.show();
    };
    //隐藏提交弹框
    $scope.hideCommitPaper = function () {
      console.log('关闭');
      $scope.commitPaperModal.hide();
    };
    //返回
    $scope.goBack = function () {
      $scope.$ionicGoBack();
    };

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });

  }]);

APP.service('TestDetailsService', ['$http', 'UrlService', function ($http, UrlService) {
  //获取考试考题列表
  this.getTestList = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('TEST_LIST'),
      data: param
    });
  };
  //获取考试结果
  this.getTestResult = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('TEST_CONSULT'),
      data: param
    });
  };
}]);
