/*
 * 时间选择指令
 */

(function (doc, cssText) {
  var styleEl = doc.createElement("style");
  doc.getElementsByTagName("head")[0].appendChild(styleEl);
  if (styleEl.styleSheet) {
    if (!styleEl.styleSheet.disabled) {
      styleEl.styleSheet.cssText = cssText;
    }
  } else {
    try {
      styleEl.innerHTML = cssText;
    } catch (ignore) {
      styleEl.innerText = cssText;
    }
  }
}(document, ".ionic_timepicker_popup .font_28px {\n  font-size: 28px;\n}\n.ionic_timepicker_popup .margin_zero {\n  margin: 0;\n}\n.ionic_timepicker_popup .padding_zero {\n  padding: 0;\n}\n.ionic_timepicker_popup .popup {\n  background-color: #ffffff;\n}\n.ionic_timepicker_popup .popup-head {\n  display: none;\n}\n.ionic_timepicker_popup .popup-body {\n  padding: 0;\n}\n.ionic_timepicker_popup .popup-buttons {\n  padding: 0;\n  min-height: 44px;\n  height: 44px;\n}\n.ionic_timepicker_popup .popup-buttons .button:not(:last-child) {\n  margin-right: 1px;\n}\n.ionic_timepicker_popup .padding_left_15px {\n  padding-left: 15px;\n}\n.ionic_timepicker_popup .heading {\n  height: 44px;\n  background-color: #009688;\n  color: #ffffff;\n  text-align: center;\n  line-height: 44px;\n  font-size: 18px;\n  font-weight: bold;\n}\n.ionic_timepicker_popup .time_picker_colon {\n  padding-top: 45px;\n  text-align: center;\n  font-weight: bold;\n}\n.ionic_timepicker_popup .time_picker_arrows {\n  width: 100%;\n}\n.ionic_timepicker_popup .time_picker_box_text {\n  height: 40px;\n  text-align: center;\n  border: 1px solid #dddddd;\n  font-size: 16px;\n  line-height: 38px;\n}\n.ionic_timepicker_popup .overflowShow {\n  white-space: normal !important;\n}\n.ionic_timepicker_popup .button_set, .ionic_timepicker_popup .button_close {\n  background-color: #009688;\n  color: #ffffff;\n}"));
APP.run(['$templateCache', function ($templateCache) {
  $templateCache.put("ionic-timepicker.html", '<div><div class=heading>{{time.hours}} : {{time.minutes}} <span ng-show="time.format == 12">{{time.meridian}}</span></div><div class=row ng-class="{\'padding_left_15px\':time.format == 12}"><div class="col col-25" ng-class="{\'col-offset-20 col-25\':time.format == 24}"><button type=button class="button button-clear button-small button-dark time_picker_arrows" ng-click=increaseHours()><i class="icon ion-chevron-up"></i></button><div ng-bind=time.hours class=time_picker_box_text></div><button type=button class="button button-clear button-small button-dark time_picker_arrows" ng-click=decreaseHours()><i class="icon ion-chevron-down"></i></button></div><label class="col col-10 time_picker_colon">:</label><div class="col col-25" ng-class="{\'col-25\':time.format == 24}"><button type=button class="button button-clear button-small button-dark time_picker_arrows" ng-click=increaseMinutes()><i class="icon ion-chevron-up"></i></button><div ng-bind=time.minutes class=time_picker_box_text></div><button type=button class="button button-clear button-small button-dark time_picker_arrows" ng-click=decreaseMinutes()><i class="icon ion-chevron-down"></i></button></div><label class="col col-10 time_picker_colon" ng-if="time.format == 12">:</label><div class="col col-25" ng-if="time.format == 12"><button type=button class="button button-clear button-small button-dark time_picker_arrows" ng-click=changeMeridian()><i class="icon ion-chevron-up"></i></button><div ng-bind=time.meridian class=time_picker_box_text></div><button type=button class="button button-clear button-small button-dark time_picker_arrows" ng-click=changeMeridian()><i class="icon ion-chevron-down"></i></button></div></div></div>');
}]);
APP.provider('ionicTimePicker', function () {
  var config = {
    setLabel: '确定',
    closeLabel: '关闭',
    inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),//默认显示当前时间
    format: 24,//12或24小时制
    step: 1//分钟加减偏移量
  };

  this.configTimePicker = function (inputObj) {
    angular.extend(config, inputObj);
  };

  this.$get = ['$rootScope', '$ionicPopup', function ($rootScope, $ionicPopup) {

    var provider = {};
    var $scope = $rootScope.$new();
    $scope.today = resetHMSM(new Date()).getTime();
    $scope.time = {};

    //Reset the hours, minutes, seconds and milli seconds
    function resetHMSM(currentDate) {
      currentDate.setHours(0);
      currentDate.setMinutes(0);
      currentDate.setSeconds(0);
      currentDate.setMilliseconds(0);
      return currentDate;
    }


    //Increasing the hours
    $scope.increaseHours = function () {
      $scope.time.hours = Number($scope.time.hours);
      if ($scope.mainObj.format == 12) {
        if ($scope.time.hours != 12) {
          $scope.time.hours += 1;
        } else {
          $scope.time.hours = 1;
        }
      }
      if ($scope.mainObj.format == 24) {
        $scope.time.hours = ($scope.time.hours + 1) % 24;
      }
      $scope.time.hours = ($scope.time.hours < 10) ? ('0' + $scope.time.hours) : $scope.time.hours;
    };

    //Decreasing the hours
    $scope.decreaseHours = function () {
      $scope.time.hours = Number($scope.time.hours);
      if ($scope.mainObj.format == 12) {
        if ($scope.time.hours > 1) {
          $scope.time.hours -= 1;
        } else {
          $scope.time.hours = 12;
        }
      }
      if ($scope.mainObj.format == 24) {
        $scope.time.hours = ($scope.time.hours + 23) % 24;
      }
      $scope.time.hours = ($scope.time.hours < 10) ? ('0' + $scope.time.hours) : $scope.time.hours;
    };

    //Increasing the minutes
    $scope.increaseMinutes = function () {
      $scope.time.minutes = Number($scope.time.minutes);
      $scope.time.minutes = ($scope.time.minutes + $scope.mainObj.step) % 60;
      $scope.time.minutes = ($scope.time.minutes < 10) ? ('0' + $scope.time.minutes) : $scope.time.minutes;
    };

    //Decreasing the minutes
    $scope.decreaseMinutes = function () {
      $scope.time.minutes = Number($scope.time.minutes);
      $scope.time.minutes = ($scope.time.minutes + (60 - $scope.mainObj.step)) % 60;
      $scope.time.minutes = ($scope.time.minutes < 10) ? ('0' + $scope.time.minutes) : $scope.time.minutes;
    };

    //Changing the meridian
    $scope.changeMeridian = function () {
      $scope.time.meridian = ($scope.time.meridian === "AM") ? "PM" : "AM";
    };

    function setMinSecs(ipTime, format) {
      $scope.time.hours = Math.floor(ipTime / (60 * 60));

      var rem = ipTime % (60 * 60);
      if (format == 12) {
        if ($scope.time.hours > 12) {
          $scope.time.hours -= 12;
          $scope.time.meridian = 'PM';
        } else {
          $scope.time.meridian = 'AM';
        }
      }
      $scope.time.minutes = rem / 60;

      $scope.time.hours = $scope.time.hours.toFixed(0);
      $scope.time.minutes = $scope.time.minutes.toFixed(0);

      if ($scope.time.hours.toString().length == 1) {
        $scope.time.hours = '0' + $scope.time.hours;
      }
      if ($scope.time.minutes.toString().length == 1) {
        $scope.time.minutes = '0' + $scope.time.minutes;
      }
      $scope.time.format = $scope.mainObj.format;
    }

    provider.openTimePicker = function (ipObj) {
      var buttons = [];
      $scope.mainObj = angular.extend({}, config, ipObj);
      setMinSecs($scope.mainObj.inputTime, $scope.mainObj.format);

      buttons.push({
        text: $scope.mainObj.setLabel,
        type: 'button_set',
        onTap: function (e) {
          var totalSec = 0;

          if ($scope.time.format == 12) {
            $scope.time.hours = Number($scope.time.hours);
            if ($scope.time.meridian == 'PM' && $scope.time.hours != 12) {
              $scope.time.hours += 12;
            } else if ($scope.time.meridian == 'AM' && $scope.time.hours == 12) {
              $scope.time.hours -= 12;
            }
            totalSec = ($scope.time.hours * 60 * 60) + ($scope.time.minutes * 60);
          } else {
            totalSec = ($scope.time.hours * 60 * 60) + ($scope.time.minutes * 60);
          }
          $scope.mainObj.callback(totalSec);
        }
      });

      buttons.push({
        text: $scope.mainObj.closeLabel,
        type: 'button_close'
      });

      $scope.popup = $ionicPopup.show({
        templateUrl: 'ionic-timepicker.html',
        scope: $scope,
        cssClass: 'ionic_timepicker_popup',
        buttons: buttons
      });

    };

    return provider;

  }];
});
