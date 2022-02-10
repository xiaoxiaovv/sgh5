/**
 * 此指令试用时候必须紧挨着input标签。中间不能有间隔。并且不能被包裹在label标签中（会获取不到焦点）。
 * <input class="padding-left-right-10  inline" ng-model="data.value" type="tel" maxlength="11"/>
 * <input-clear ng-model="data.value"></input-clear>
 * created by ZCP
 */
APP.directive('inputClear', ['$rootScope', '$state', '$ionicScrollDelegate', '$timeout',
  function ($rootScope, $state, $ionicScrollDelegate, $timeout) {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      require: 'ngModel',
      template: '<i class="icon ion-close-circled" ng-show="isShow" style="font-size: 20px ;vertical-align: middle;color: #9b9b99;position: relative;right: 25px;margin-left: -4px;display: inline-block;width: 0"></i>',
      link: function (scope, element, attr, controller) {
        scope.isShow = false;//控制显示X的标志位
        var input = element[0].previousElementSibling;

        input.onblur = function () {

          $timeout(function () {
            //scope.$apply(function () {
            scope.isShow = false;
          });
        };
        //输入框内有值,显示清空按钮
        input.onfocus = function () {

          $timeout(function () {
            if (input.value) {
              scope.isShow = true;
            }
          })
        };

        scope.$watch(function () {
          return input.value;
        }, function (newVal, oldVal, sop) {
          if (!angular.equals(newVal, oldVal)) {
            scope.isShow = !!input.value;
          }
        });

        //如果清空按钮被点击了,就清空输入内容,并隐藏清空按钮
        element.on('click', function (event) {
          element[0].focus();
          controller.$setViewValue('');
          scope.isShow = false;

          var temp = input.blur;
          input.blur = function () {
          };

          $timeout(function () {
            input.blur = temp;
          }, 100);
        });

      }
    }
  }]);
/**
 * 返回顶部
 * 上拉超过一定距离会出现返回顶部按钮,点击返回顶部,按钮消失
 * 回到顶部指令。放在ion-content
 * 实例：
 * <go-top delegate-handle="scrollExample"></go-top>
 * <ion-content delegate-handle="scrollExample">
 */
APP.directive('goTop', ['$rootScope', '$state', '$ionicScrollDelegate', '$timeout',
  function ($rootScope, $state, $ionicScrollDelegate, $timeout) {
    return {
      restrict: 'AE',
      replace: true,
      template: '<img ng-src="{{imgBaseURL}}img/icon_toTop.png" style="width: 44px;"  ng-show="showGoTop"/>',
      link: function (scope, element, attr) {

        var SCROLL_HEIGHT = 500;//滚动多少距离后出现GOtop按钮。
        var control = undefined;//滚动控制器。通过scroll获取。
        var scrollElement = undefined;//滚动的dom元素
        var operated = false;
        scope.showGoTop = false;
        //初始化。获得dom元素
        $timeout(function () {
          var styleLocal = 'z-index:10;width:44px;position:fixed;right:10px;bottom:' + (attr.offset || 20) + 'px!important';
          control = scope.$$childHead.scrollCtrl;
          scrollElement = control.element;
          element[0].setAttribute('style', styleLocal)
        }, 100);

        //监听器
        var listener = function () {
          if (!!control && !!control.getScrollPosition() && !operated) {
            var top = control.getScrollPosition().top;
            scope.showGoTop = top > SCROLL_HEIGHT;
            operated = true;
            scope.$apply(function () {
              operated = false;
            }, 500)
          }
        };

        $timeout(function () {
          ionic.on('scroll', listener, scrollElement);
        }, 1000);

        element.on('click', function () {
          control.scrollTop(true);//滚动到顶部
          $timeout(function () {
            scope.showGoTop = false;
          }, 200);
        });
      }
    }
  }]);
