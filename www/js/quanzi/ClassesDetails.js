/**
 * Created by dhc on 2017/1/10.
 */
APP.controller('ClassesDetailsController', ['$scope', '$rootScope', '$state', '$stateParams', 'ClassesDetailsService', 'PopupService', '$timeout',
  '$ionicScrollDelegate',
  function ($scope, $rootScope, $state, $stateParams, ClassesDetailsService, PopupService, $timeout,$ionicScrollDelegate) {

    /** 变量定义 **/
    $scope.isClick = 0;
    $scope.input = {
      input:''
    };
    $scope.classInfo = {
      courseCategory:'',//课程分类
      courseName:'',
      courseStartTime:'',
      teacher:'',
      teacherIntroduce:'',
      forumStartTime:'',
      forumEndTime:'',
      courseDescription:'',//课程描述
      timeOrder:''//课程状态
    };
    $scope.membersJoin = {
      courseId: 2,
      createTime: "2017-01-17 11:24:00.0",
      id: 3,
      type: "2",
      userCode: '',
      userImg:'',
      userName:''
    };
    $scope.teacherList = {
      userName: 2,
      teacherIntroduce: "2017-01-17 11:24:00.0",
      userImg: 3,
      children: "2",//存储自己讲过的课的集合
      courseName: '',
      courseId:''
    };
    $scope.messageBoardList = {//留言板消息
      questionId:'',
      questionContent:'',
      questionTime:'',//提问时间
      questionUserName:'',
      questionUserCode:'',
      questionUserImg:'',
      firstAnswerId:'',
      firstAnswerContent:'',
      firstAnswerTime:'',//回答时间
      firstAnswerUserName:'',
      firstAnswerUserCode:'',
      firstAnswerUserImg:'',
      firstAnswerIsTeacher:'',//回答人是否是讲师，1是老师的回复，0是普通用户的回复
      answersTotal:'',//这条提问一共有几条回答
      totalCount:''//这个课程一共有几个提问
    };
    $scope.classesList = {};
    $scope.topicList = {};//相关话题
    $scope.shareList = {};//学员分享

    /** 方法定义 **/
    //初始化
    $scope.init = function () {
      $scope.ifShowInput = true;
      // $scope.isClick = 0;

      $scope.getClassInfo();
      $scope.getClassesList();
      $scope.getMessageBoardList();
      $scope.getClassTopicList();
      $scope.studentShare();
    };
    //选择tab
    $scope.click0 = function () {
      $scope.isClick = 0;
    };
    $scope.click1 = function () {
      $scope.isClick = 1;
    };
    $scope.click2 = function () {
      $scope.isClick = 2;
    };
    //返回
    $scope.goBack = function () {
      $scope.$ionicGoBack();
    };
    //获取课程信息
    $scope.getClassInfo = function () {
      var param = {
        courseId:2
      };
      ClassesDetailsService.getClassInfo(param)
        .success(function (response) {
          $scope.classInfo = response.data.list[0];
          $scope.classJoinMember();
          $scope.getTeacherList();
        })
    };
    //获取课程全部人员
    $scope.classJoinMember = function () {
      var param = {
        courseId:2
      };
      ClassesDetailsService.classJoinMember(param)
        .success(function (response) {
          $scope.membersJoin = response.data.list;
        })
    };
    //获取课程讲师列表
    $scope.getTeacherList = function () {
      var param = {
        courseId:2
      };
      ClassesDetailsService.getTeacherList(param)
        .success(function (response) {
          $scope.teacherList = response.data.list;
        })
    };
    //获取课堂资料
    $scope.getClassesList = function () {
      var param = {
        courseId:2
      };
      ClassesDetailsService.getClassesList(param)
        .success(function (response) {
          $scope.classesList = response.data.list;
        })
    };
    //课堂关联话题列表
    $scope.getClassTopicList = function () {
      var param = {
        courseId:2
      };
      ClassesDetailsService.getClassTopicList(param)
        .success(function (response) {
          $scope.topicList = response.data.list;
        })
    };
    //课堂学员分享
    $scope.studentShare = function () {
      var param = {
        courseId:1
      };
      ClassesDetailsService.studentShare(param)
        .success(function (response) {
          $scope.shareList = response.data.list;
          // $ionicScrollDelegate.resize();
          $ionicScrollDelegate.$getByHandle('mainScroll').resize();
        })
    };
    //获取课程留言板列表
    $scope.getMessageBoardList = function () {
      var param = {
        courseId:1,
        pageSize:5,
        pageIndex:1
      };
      ClassesDetailsService.getMessageBoardList(param)
        .success(function (response) {
          $scope.messageBoardList = response.data.list;
        })
    };
    //获取某问题详情
    $scope.toQuestionDetail = function (questionId) {
      $state.go('questionDetails',{wordsId:questionId})
    };
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });
    //是不显示提问input
    $scope.showInput = function () {
      $scope.ifShowInput = !$scope.ifShowInput;
    };
    //提问
    $scope.commitAnswer = function () {

      var params = {
        wordsContent: $scope.input.input,
        courseId: '',
        parentId: ''
      };

      ClassesDetailsService.askQuestion(params)
        .success(function (response) {

        }).error(function () {

      })
    };

  }]);

APP.service('ClassesDetailsService', ['$http', 'UrlService', function ($http, UrlService) {
  //获取课程信息
  this.getClassInfo = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('COURSE_INFO'),
      data: param
    });
  };
  //获取课程全部人员
  this.classJoinMember = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('COURSE_ALL_MEMBER'),
      data: param
    });
  };
  //获取课程讲师列表
  this.getTeacherList = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('COURSE_TEACH_LIST'),
      data: param
    });
  };
  //获取课堂列表
  this.getClassesList = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('CLASSES_LIST'),
      data: param
    });
  };
  //课堂相关话题列表
  this.getClassTopicList = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('CLASSES_TOPIC_LIST'),
      data: param
    });
  };
  //课堂学员分享
  this.studentShare = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('STUDENT_SHARE'),
      data: param
    });
  };
  //获取留言板消息
  this.getMessageBoardList = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('MESSAGE_BOARD_LIST'),
      data: param
    });
  };
  //提问
  this.askQuestion = function (param) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('QUESTION_ANSWER'),
      data: param
    });
  };
}]);
