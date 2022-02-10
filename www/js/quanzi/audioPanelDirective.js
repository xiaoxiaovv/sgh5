//封装 录音ui的指令
// 依赖外部的scope
APP.directive('audioPanel', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl:'templates/quanzi/AudioPanel.html',
        scope: true,//继承父作用愈
        link:function (scope, element, attr){

        }
    };
});