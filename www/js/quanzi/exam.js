/**
 * 考试
 * Created by shantao.wang on Mon 2016/10/17.
 */
APP.controller('examCtrl', ['$scope','$state', 'examService', 'NoteDetailsService',
    function ($scope,$state, examService, NoteDetailsService) {
        /**
         * 变量声明
         */
        $scope.messageNum = undefined;
        $scope.ifRed=undefined;
        $scope.isDisplay = undefined;
        $scope.optionLetter = ['A.', 'B.', 'C.', 'D.'];//选项对应的字母
        $scope.answer = ['a', 'b', 'c', 'd'];//提交的答案
        $scope.showWhich = [];//布尔型数组，决定显示哪个类别的题目
        /**
         * 消息弹窗
         */
        $scope.show = function () {
            $scope.isDisplay = !$scope.isDisplay;
        };
        /**
         * 点击空白消息弹窗消失
         */
        $scope.disappear = function () {
            $scope.isDisplay = false;
        };
        /**
         * 页面跳转方法
         */
        $scope.jumpMsg=function () {
            $state.go('qzMessageCenter');
        };
        /**
         * 页面初始化方法
         */
        $scope.init = function () {
            $scope.isDisplay = false;
            $scope.Qs = examService.getQs();//拿到绑定到视图的数据
            $scope.showWhich[0] = true;//默认显示类别一的题目
            //获取未读消息消息数量
            NoteDetailsService.getxiaoxi()
                .success(function (response, status, headers, config) {
                    $scope.messageNum = response.data.count;
                    $scope.ifRed=parseInt(response.data.count);
                })
                .error(function (response, status, headers, config) {
                    alert("网络失败！");
                });
        };
        /**
         * 选择题目类别方法
         * @param index
         */
        $scope.chooseWhich = function (index) {
            $scope.showWhich = [];
            $scope.showWhich[index] = true;//选哪类显示哪类
        };
        /**
         * 广播
         */
        $scope.$on('myIndex', function (event, data) {
            $scope.$broadcast('yourIndex', data)
        });
        /**
         * 加载该页面前调用页面初始化方法
         */
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
        });

    }]);
/**
 * Service
 */
APP.service('examService', [function () {
    var questionLibrary = [
        {
            family: '一',
            questions: [
                {
                    description: '题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项B'},
                        {selected: false, text: '选项C'},
                        {selected: false, text: '选项D'}
                    ]
                },
                {
                    description: '题目二题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项B'},
                        {selected: false, text: '选项C'},
                        {selected: false, text: '选项D'}
                    ]
                },
                {
                    description: '题目三题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项B'},
                        {selected: false, text: '选项C'},
                        {selected: false, text: '选项D'}
                    ]
                },
                {
                    description: '题目四题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项B'},
                        {selected: false, text: '选项C'},
                        {selected: false, text: '选项D'}
                    ]
                },
                {
                    description: '题目五题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项B'},
                        {selected: false, text: '选项C'},
                        {selected: false, text: '选项D'}
                    ]
                },
                {
                    description: '题目六题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项B'},
                        {selected: false, text: '选项C'},
                        {selected: false, text: '选项D'}
                    ]
                },
                {
                    description: '题目七题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项B'},
                        {selected: false, text: '选项C'},
                        {selected: false, text: '选项D'}
                    ]
                }
            ]
        },
        {
            family: '二',
            questions: [
                {
                    description: '题目一123456789',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一123456789',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一123456789',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一123456789',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一123456789',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一123456789',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一123456789',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一123456789',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一123456789',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                }
            ]
        },
        {
            family: '三',
            questions: [
                {
                    description: '题目一agadgdfsdhsdfadfgadfasdfasdfads',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一agadgdfsdhsdfadfgadfasdfasdfads',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一agadgdfsdhsdfadfgadfasdfasdfads',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一agadgdfsdhsdfadfgadfasdfasdfads',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一agadgdfsdhsdfadfgadfasdfasdfads',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一agadgdfsdhsdfadfgadfasdfasdfads',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一agadgdfsdhsdfadfgadfasdfasdfads',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一agadgdfsdhsdfadfgadfasdfasdfads',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一agadgdfsdhsdfadfgadfasdfasdfads',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一agadgdfsdhsdfadfgadfasdfasdfads',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                }
            ]
        },
        {
            family: '四',
            questions: [
                {
                    description: '题目一123456789adgdsfhsrtthrthdsfsdfgsdf',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一123456789adgdsfhsrtthrthdsfsdfgsdf',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一123456789adgdsfhsrtthrthdsfsdfgsdf',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一123456789adgdsfhsrtthrthdsfsdfgsdf',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一123456789adgdsfhsrtthrthdsfsdfgsdf',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一123456789adgdsfhsrtthrthdsfsdfgsdf',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一123456789adgdsfhsrtthrthdsfsdfgsdf',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一123456789adgdsfhsrtthrthdsfsdfgsdf',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一123456789adgdsfhsrtthrthdsfsdfgsdf',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                },
                {
                    description: '题目一123456789adgdsfhsrtthrthdsfsdfgsdf',
                    answer: [
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'},
                        {selected: false, text: '选项A'}
                    ]
                }
            ]
        }
    ];//3级嵌套数组对应3级嵌套ng-repeat
    var questionLibrary1 = [
        {
            family: '一',
            questions: [
                {
                    description: '题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目二题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目三题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目四题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目五题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目六题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目七题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                }
            ]
        },
        {
            family: '二',
            questions: [
                {
                    description: '题目一123456789',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目二123456789',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目三123456789',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目四题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目五题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目六题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目七题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                }
            ]
        },
        {
            family: '三',
            questions: [
                {
                    description: '题目一sdfsadfasdf',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目二asdfasfasdfasdfasdfdas',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目三题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目四题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目五题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目六题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目七题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                }
            ]
        },
        {
            family: '四',
            questions: [
                {
                    description: '题目一123456789sagdasdgasdgadg',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目二123456789sagdasdgasdgadg',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目三123456789sagdasdgasdgadg',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目四题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目五题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目六题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                },
                {
                    description: '题目七题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一题目一',
                    answer: ['选项A', '选项B', '选项C', '选项D']
                }
            ]
        }
    ];//3级嵌套数组对应3级嵌套ng-repeat
    this.getQs = function () {
        return questionLibrary;
    }

}]);
/**
 *遍历相关指令
 */
APP.directive('eachRepeat', function () {
    return {
        link: function (scope, element, attr) {
            console.log(scope.$index + 1);
            scope.$emit('myIndex', scope.$index + 1);
        }
    }
});
APP.directive('receiveIndex', function () {
    return {
        link: function (scope, element, attr) {
            scope.$on('yourIndex', function (event, data) {
                /* scope.name=data;*/
                console.log(data);
            });
        }
    }
});