/*
 * 日期选择指令
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
}(document, ".padding_zero {\n" +
  "  padding: 0;\n" +
  "}\n" +
  "\n" +
  ".ionic_datepicker_popup .font_bold {\n" +
  "  font-weight: bold;\n" +
  "}\n" +
  ".ionic_datepicker_popup .padding_top_zero {\n" +
  "  padding-top: 0;\n" +
  "}\n" +
  ".ionic_datepicker_popup .padding_left_5px {\n" +
  "  padding-left: 5px;\n" +
  "}\n" +
  ".ionic_datepicker_popup .padding_right_5px {\n" +
  "  padding-right: 5px;\n" +
  "}\n" +
  ".ionic_datepicker_popup .calendar_grid {\n" +
  "  height: 215px;\n" +
  "}\n" +
  ".ionic_datepicker_popup .today {\n" +
  "  border: 1px solid #009688;\n" +
  "  border-radius: 50%;\n" +
  "}\n" +
  ".ionic_datepicker_popup .selected_date {\n" +
  "  background-color: #009688;\n" +
  "  border-radius: 50%;\n" +
  "  color: #fff;\n" +
  "  font-weight: bold;\n" +
  "}\n" +
  ".ionic_datepicker_popup .popup-head {\n" +
  "  background-color: #009688;\n" +
  "  display: none;\n" +
  "}\n" +
  ".ionic_datepicker_popup .popup-head .popup-title {\n" +
  "  color: #ffffff;\n" +
  "}\n" +
  ".ionic_datepicker_popup .popup-head .popup-sub-title {\n" +
  "  color: #ffffff;\n" +
  "}\n" +
  ".ionic_datepicker_popup .popup-body {\n" +
  "  background-color: #ffffff;\n" +
  "}\n" +
  ".ionic_datepicker_popup .popup-body .selected_date_full {\n" +
  "  background-color: #019688;\n" +
  "  margin: -10px -10px 0 -10px;\n" +
  "  height: 45px;\n" +
  "  text-align: center;\n" +
  "  font-weight: bold;\n" +
  "  color: #fff;\n" +
  "  line-height: 45px;\n" +
  "  font-size: 18px;\n" +
  "}\n" +
  ".ionic_datepicker_popup .popup-body .select_section {\n" +
  "  padding: 1px 5px;\n" +
  "}\n" +
  ".ionic_datepicker_popup .popup-body .pointer_events_none {\n" +
  "  pointer-events: none;\n" +
  "  color: #aaaaaa !important;\n" +
  "}\n" +
  ".ionic_datepicker_popup .popup-body .month_select, .ionic_datepicker_popup .popup-body .year_select {\n" +
  "  border: none;\n" +
  "  border-bottom: 1px solid #009688;\n" +
  "  padding: 0;\n" +
  "}\n" +
  ".ionic_datepicker_popup .popup-body .month_select .input-label, .ionic_datepicker_popup .popup-body .year_select .input-label {\n" +
  "  padding: 2px 0;\n" +
  "  width: 0;\n" +
  "}\n" +
  ".ionic_datepicker_popup .popup-body .month_select select, .ionic_datepicker_popup .popup-body .year_select select {\n" +
  "  left: 10px;\n" +
  "  border: none;\n" +
  "  padding: 0;\n" +
  "}\n" +
  ".ionic_datepicker_popup .popup-body .month_select:after, .ionic_datepicker_popup .popup-body .year_select:after {\n" +
  "  right: 5px;\n" +
  "  color: #009688;\n" +
  "}\n" +
  ".ionic_datepicker_popup .popup-body .show_nav {\n" +
  "  padding: 10px 0 0 0;\n" +
  "}\n" +
  ".ionic_datepicker_popup .popup-body .show_nav .prev_btn_section {\n" +
  "  padding: 5px 0;\n" +
  "  text-align: left;\n" +
  "}\n" +
  ".ionic_datepicker_popup .popup-body .show_nav .prev_btn_section button {\n" +
  "  padding: 0;\n" +
  "}\n" +
  ".ionic_datepicker_popup .popup-body .show_nav .next_btn_section {\n" +
  "  padding: 5px 0;\n" +
  "  text-align: right;\n" +
  "}\n" +
  ".ionic_datepicker_popup .popup-body .show_nav .next_btn_section button {\n" +
  "  padding: 0;\n" +
  "}\n" +
  ".ionic_datepicker_popup .popup-body .button-clear {\n" +
  "  color: #009688;\n" +
  "}\n" +
  ".ionic_datepicker_popup .popup-buttons {\n" +
  "  padding: 0;\n" +
  "  min-height: 45px;\n" +
  "}\n" +
  ".ionic_datepicker_popup .popup-buttons button {\n" +
  "  background-color: #009688;\n" +
  "  border-radius: 0;\n" +
  "  margin-right: 1px;\n" +
  "  color: #ffffff;\n" +
  "}\n" +
  "\n" +
  ".ionic_datepicker_modal .header, .ionic_datepicker_modal .footer {\n" +
  "  background-color: #009688;\n" +
  "}\n" +
  ".ionic_datepicker_modal .header .title, .ionic_datepicker_modal .header .button, .ionic_datepicker_modal .footer .title, .ionic_datepicker_modal .footer .button {\n" +
  "  color: #ffffff;\n" +
  "}\n" +
  ".ionic_datepicker_modal .footer .button-block {\n" +
  "  margin: 0;\n" +
  "}\n" +
  ".ionic_datepicker_modal .today {\n" +
  "  border: 1px solid #009688;\n" +
  "}\n" +
  ".ionic_datepicker_modal .selected_date {\n" +
  "  background-color: #009688;\n" +
  "  color: #fff;\n" +
  "  font-weight: bold;\n" +
  "}\n" +
  ".ionic_datepicker_modal .pointer_events_none {\n" +
  "  pointer-events: none;\n" +
  "  color: #aaaaaa !important;\n" +
  "}\n" +
  ".ionic_datepicker_modal .select_section {\n" +
  "  padding: 1px 5px;\n" +
  "}\n" +
  ".ionic_datepicker_modal .button-clear {\n" +
  "  color: #009688;\n" +
  "}\n" +
  ".ionic_datepicker_modal .month_select, .ionic_datepicker_modal .year_select {\n" +
  "  border: none;\n" +
  "  border-bottom: 1px solid #009688;\n" +
  "  padding: 0;\n" +
  "}\n" +
  ".ionic_datepicker_modal .month_select .input-label, .ionic_datepicker_modal .year_select .input-label {\n" +
  "  padding: 2px 0;\n" +
  "  width: 0;\n" +
  "}\n" +
  ".ionic_datepicker_modal .month_select select, .ionic_datepicker_modal .year_select select {\n" +
  "  left: 10px;\n" +
  "  border: none;\n" +
  "  padding: 0 10px;\n" +
  "}\n" +
  ".ionic_datepicker_modal .month_select:after, .ionic_datepicker_modal .year_select:after {\n" +
  "  right: 5px;\n" +
  "  color: #009688;\n" +
  "}\n" +
  ".ionic_datepicker_modal .padding_left_5px {\n" +
  "  padding-left: 5px;\n" +
  "}\n" +
  ".ionic_datepicker_modal .padding_right_5px {\n" +
  "  padding-right: 5px;\n" +
  "}\n" +
  ".ionic_datepicker_modal .date_col {\n" +
  "  height: 50px;\n" +
  "  line-height: 50px;\n" +
  "}\n" +
  ".ionic_datepicker_modal .font_bold {\n" +
  "  font-weight: bold;\n" +
  "}\n" +
  ".ionic_datepicker_modal .font_22px {\n" +
  "  font-size: 22px;\n" +
  "}\n" +
  ".platform-android .ionic_datepicker_modal .bar .title.title-left {\n" +
  "  text-align: center;\n" +
  "}\n" +
  ".platform-android .ionic_datepicker_modal select {\n" +
  "  left: 25%;\n" +
  "}\n" +
  ".platform-ios .ionic_datepicker_modal select {\n" +
  "  left: 5%;\n" +
  "}"));
/*
 (function(module) {
 try {
 module = angular.module('ionic-datepicker.templates');
 } catch (e) {
 module = angular.module('ionic-datepicker.templates', []);
 }*/
APP.run(['$templateCache', function ($templateCache) {
  $templateCache.put('ionic-datepicker-modal.html',
    '<ion-modal-view class="ionic_datepicker_modal">\n' +
    '  <ion-header-bar class="header">\n' +
    '    <h1 class="title">{{selctedDateEpoch | date : mainObj.dateFormat}}</h1>\n' +
    '  </ion-header-bar>\n' +
    '  <ion-content class="ionic_datepicker_modal_content">\n' +
    '    <div class="">\n' +
    '      <div class="row text-center">\n' +
    '        <div class="col col-10 left_arrow">\n' +
    '          <button class="button-clear font_22px" ng-click="prevMonth()"\n' +
    '                  ng-class="{\'pointer_events_none\':((firstDayEpoch - 86400000) < fromDate)}">\n' +
    '            <i class="icon ion-chevron-left"></i>\n' +
    '          </button>\n' +
    '        </div>\n' +
    '        <div class="col col-80 text-center">\n' +
    '          <div class="row select_section">\n' +
    '            <div class="col-50 padding_right_5px">\n' +
    '              <label class="item item-input item-select month_select">\n' +
    '                <span class="input-label">&nbsp;</span>\n' +
    '                <select ng-model="currentMonth" ng-change="monthChanged(currentMonth)">\n' +
    '                  <option ng-repeat="month in monthsList" ng-selected="month == currentMonthSelected" value="{{month}}">\n' +
    '                    {{month}}\n' +
    '                  </option>\n' +
    '                </select>\n' +
    '              </label>\n' +
    '            </div>\n' +
    '            <div class="col-50 padding_left_5px">\n' +
    '              <label class="item item-input item-select year_select">\n' +
    '                <span class="input-label">&nbsp;</span>\n' +
    '                <select ng-model="currentYear" ng-change="yearChanged(currentYear)" ng-options="year for year in yearsList"></select>\n' +
    '              </label>\n' +
    '            </div>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '        <div class="col col-10 right_arrow">\n' +
    '          <button class=" button-clear font_22px" ng-click="nextMonth()"\n' +
    '                  ng-class="{\'pointer_events_none\':((lastDayEpoch + 86400000)> toDate)}">\n' +
    '            <i class="icon ion-chevron-right"></i>\n' +
    '          </button>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      <div class="calendar_grid">\n' +
    '        <div class="row padding-top weeks_row">\n' +
    '          <div class="col text-center font_bold"\n' +
    '               ng-repeat="weekName in weeksList track by $index" ng-bind="weekName"></div>\n' +
    '        </div>\n' +
    '        <div>\n' +
    '          <div class="row text-center padding_top_zero" ng-repeat="row in rows track by $index">\n' +
    '            <div class="col padding_zero date_col" ng-repeat="col in cols track by $index"\n' +
    '                 ng-class="{\'selected_date\': (dayList[row + $index].epoch === selctedDateEpoch),\n' +
    '                      \'today\' : (dayList[row + $index].epoch == today),\n' +
    '                      \'pointer_events_none\':((disabledDates.indexOf(dayList[row + $index].epoch) >= 0) || (dayList[row + $index].disabled))}"\n' +
    '                 ng-click="dateSelected(dayList[row + $index])">\n' +
    '              <div class="date_cell">\n' +
    '                {{dayList[row + col].date}}\n' +
    '              </div>\n' +
    '            </div>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </ion-content>\n' +
    '  <ion-footer-bar class="footer">\n' +
    '    <div class="row padding_zero">\n' +
    '      <button class="button button-clear button-block button_set" ng-if="!mainObj.closeOnSelect"\n' +
    '              ng-click="setIonicDatePickerDate()">{{mainObj.setLabel}}\n' +
    '      </button>\n' +
    '      <button class="button button-clear button-block button_today"  ng-if="mainObj.showTodayButton"\n' +
    '              ng-click="setIonicDatePickerTodayDate()">{{mainObj.todayLabel}}\n' +
    '      </button>\n' +
    '      <button class="button button-clear button-block button_close"\n' +
    '              ng-click="closeIonicDatePickerModal()">{{mainObj.closeLabel}}\n' +
    '      </button>\n' +
    '    </div>\n' +
    '  </ion-footer-bar>\n' +
    '</ion-modal-view>\n' +
    '');
}]);

APP.run(['$templateCache', function ($templateCache) {
  $templateCache.put('ionic-datepicker-popup.html',
    '<div class="selected_date_full">{{selctedDateEpoch | date : mainObj.dateFormat}}</div>\n' +
    '<div class="date_selection">\n' +
    '  <div class="row show_nav">\n' +
    '    <div class="col-10 prev_btn_section">\n' +
    '      <button class="button-clear" ng-click="prevMonth()"\n' +
    '              ng-class="{\'pointer_events_none\':((firstDayEpoch - 86400000) < fromDate)}">\n' +
    '        <i class="icon ion-chevron-left"></i>\n' +
    '      </button>\n' +
    '    </div>\n' +
    '    <div class="col-80 text-center">\n' +
    '      <div class="row select_section">\n' +
    '        <div class="col-50 padding_right_5px">\n' +
    '          <label class="item item-input item-select month_select">\n' +
    '            <span class="input-label">&nbsp;</span>\n' +
    '            <select ng-model="currentMonth" ng-change="monthChanged(currentMonth)">\n' +
    '              <option ng-repeat="month in monthsList" ng-selected="month==currentMonthSelected" value="{{month}}">\n' +
    '                {{month}}\n' +
    '              </option>\n' +
    '            </select>\n' +
    '          </label>\n' +
    '        </div>\n' +
    '        <div class="col-50 padding_left_5px">\n' +
    '          <label class="item item-input item-select year_select">\n' +
    '            <span class="input-label">&nbsp;</span>\n' +
    '            <select ng-model="currentYear" ng-change="yearChanged(currentYear)" ng-options="year for year in yearsList"></select>\n' +
    '          </label>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="col-10 next_btn_section">\n' +
    '      <button class="button-clear" ng-click="nextMonth()"\n' +
    '              ng-class="{\'pointer_events_none\':((lastDayEpoch + 86400000)> toDate)}">\n' +
    '        <i class="icon ion-chevron-right"></i>\n' +
    '      </button>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '  <div class="calendar_grid">\n' +
    '    <div class="row weeks_row">\n' +
    '      <div class="col text-center font_bold"\n' +
    '           ng-repeat="weekName in weeksList track by $index" ng-bind="weekName"></div>\n' +
    '    </div>\n' +
    '    <div>\n' +
    '      <div class="row text-center padding_top_zero" ng-repeat="row in rows track by $index">\n' +
    '        <div class="col no_padding date_col" ng-repeat="col in cols track by $index"\n' +
    '             ng-class="{\'selected_date\': (dayList[row + $index].epoch === selctedDateEpoch),\n' +
    '                      \'today\' : (dayList[row + $index].epoch == today),\n' +
    '                      \'pointer_events_none\':((disabledDates.indexOf(dayList[row + $index].epoch) >= 0) || dayList[row + $index].disabled)}"\n' +
    '             ng-click="dateSelected(dayList[row + $index])">\n' +
    '          <div class="date_cell">\n' +
    '            {{dayList[row + col].date}}\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

//angular.module('ionic-datepicker.provider', [])
APP.provider('ionicDatePicker2', function () {

    var config = {
      inputDate: new Date(),
      from: new Date(2012, 8, 1),
      to: new Date(2018, 8, 1),
      setLabel: '确定',
      todayLabel: '今天',
      closeLabel: '关闭',
      mondayFirst: true,
      weeksList: ["日", "一", "二", "三", "四", "五", "六"],
      monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      templateType: 'popup',
      dateFormat: 'yyyy-MM-dd',
      showTodayButton: false,
      closeOnSelect: false,
      disableWeekdays: []
    };

    this.configDatePicker = function (inputObj) {
      angular.extend(config, inputObj);
    };

    this.$get = ['$rootScope', '$ionicPopup', '$ionicModal', 'IonicDatepickerService2', function ($rootScope, $ionicPopup, $ionicModal, IonicDatepickerService2) {

      var provider = {};

      var $scope = $rootScope.$new();
      $scope.today = resetHMSM(new Date()).getTime();
      $scope.disabledDates = [];

      //Reset the hours, minutes, seconds and milli seconds
      function resetHMSM(currentDate) {
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);
        return currentDate;
      }

      //Previous month
      $scope.prevMonth = function () {
        if ($scope.currentDate.getMonth() === 1) {
          $scope.currentDate.setFullYear($scope.currentDate.getFullYear());
        }
        $scope.currentDate.setMonth($scope.currentDate.getMonth() - 1);
        $scope.currentMonth = $scope.mainObj.monthsList[$scope.currentDate.getMonth()];
        $scope.currentYear = $scope.currentDate.getFullYear();
        refreshDateList($scope.currentDate);
      };

      //Next month
      $scope.nextMonth = function () {
        if ($scope.currentDate.getMonth() === 11) {
          $scope.currentDate.setFullYear($scope.currentDate.getFullYear());
        }
        $scope.currentDate.setDate(1);
        $scope.currentDate.setMonth($scope.currentDate.getMonth() + 1);
        $scope.currentMonth = $scope.mainObj.monthsList[$scope.currentDate.getMonth()];
        $scope.currentYear = $scope.currentDate.getFullYear();
        refreshDateList($scope.currentDate);
      };

      //Date selected
      $scope.dateSelected = function (selectedDate) {
        if (!selectedDate || Object.keys(selectedDate).length === 0) return;
        $scope.selctedDateEpoch = selectedDate.epoch;

        if ($scope.mainObj.closeOnSelect) {
          $scope.mainObj.callback($scope.selctedDateEpoch);
          if ($scope.mainObj.templateType.toLowerCase() == 'popup') {
            $scope.popup.close();
          } else {
            closeModal();
          }
        }
      };

      //Set today as date for the modal
      $scope.setIonicDatePickerTodayDate = function () {
        var today = new Date();
        refreshDateList(new Date());
        $scope.selctedDateEpoch = resetHMSM(today).getTime();
        if ($scope.mainObj.closeOnSelect) {
          $scope.mainObj.callback($scope.selctedDateEpoch);
          closeModal();
        }
      };

      //Set date for the modal
      $scope.setIonicDatePickerDate = function () {
        $scope.mainObj.callback($scope.selctedDateEpoch);
        closeModal();
      };

      //Setting the disabled dates list.
      function setDisabledDates(mainObj) {
        if (!mainObj.disabledDates || mainObj.disabledDates.length === 0) {
          $scope.disabledDates = [];
        } else {
          $scope.disabledDates = [];
          angular.forEach(mainObj.disabledDates, function (val, key) {
            val = resetHMSM(new Date(val));
            $scope.disabledDates.push(val.getTime());
          });
        }
      }

      //Refresh the list of the dates of a month
      function refreshDateList(currentDate) {
        currentDate = resetHMSM(currentDate);
        $scope.currentDate = angular.copy(currentDate);

        var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDate();
        var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

        $scope.monthsList = [];
        if ($scope.mainObj.monthsList && $scope.mainObj.monthsList.length === 12) {
          $scope.monthsList = $scope.mainObj.monthsList;
        } else {
          $scope.monthsList = IonicDatepickerService2.monthsList;
        }

        $scope.yearsList = IonicDatepickerService2.getYearsList($scope.mainObj.from, $scope.mainObj.to);

        $scope.dayList = [];

        var tempDate, disabled;
        $scope.firstDayEpoch = resetHMSM(new Date(currentDate.getFullYear(), currentDate.getMonth(), firstDay)).getTime();
        $scope.lastDayEpoch = resetHMSM(new Date(currentDate.getFullYear(), currentDate.getMonth(), lastDay)).getTime();

        for (var i = firstDay; i <= lastDay; i++) {
          tempDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
          disabled = (tempDate.getTime() < $scope.fromDate) || (tempDate.getTime() > $scope.toDate) || $scope.mainObj.disableWeekdays.indexOf(tempDate.getDay()) >= 0;

          $scope.dayList.push({
            date: tempDate.getDate(),
            month: tempDate.getMonth(),
            year: tempDate.getFullYear(),
            day: tempDate.getDay(),
            epoch: tempDate.getTime(),
            disabled: disabled
          });
        }

        //To set Monday as the first day of the week.
        var firstDayMonday = $scope.dayList[0].day - $scope.mainObj.mondayFirst;
        firstDayMonday = (firstDayMonday < 0) ? 6 : firstDayMonday;

        for (var j = 0; j < firstDayMonday; j++) {
          $scope.dayList.unshift({});
        }

        $scope.rows = [0, 7, 14, 21, 28, 35];
        $scope.cols = [0, 1, 2, 3, 4, 5, 6];

        $scope.currentMonth = $scope.mainObj.monthsList[currentDate.getMonth()];
        $scope.currentYear = currentDate.getFullYear();
        $scope.currentMonthSelected = angular.copy($scope.currentMonth);
        $scope.currentYearSelected = angular.copy($scope.currentYear);
        $scope.numColumns = 7;
      }

      //Month changed
      $scope.monthChanged = function (month) {
        var monthNumber = $scope.monthsList.indexOf(month);
        $scope.currentDate.setMonth(monthNumber);
        refreshDateList($scope.currentDate);
      };

      //Year changed
      $scope.yearChanged = function (year) {
        $scope.currentDate.setFullYear(year);
        refreshDateList($scope.currentDate);
      };

      //Setting up the initial object
      function setInitialObj(ipObj) {
        $scope.mainObj = angular.copy(ipObj);
        $scope.selctedDateEpoch = resetHMSM($scope.mainObj.inputDate).getTime();

        if ($scope.mainObj.weeksList && $scope.mainObj.weeksList.length === 7) {
          $scope.weeksList = $scope.mainObj.weeksList;
        } else {
          $scope.weeksList = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        }
        if ($scope.mainObj.mondayFirst) {
          $scope.weeksList.push($scope.mainObj.weeksList.shift());
        }
        $scope.disableWeekdays = $scope.mainObj.disableWeekdays;

        refreshDateList($scope.mainObj.inputDate);
        setDisabledDates($scope.mainObj);
      }

      $ionicModal.fromTemplateUrl('ionic-datepicker-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
      });

      $scope.$on('$destroy', function () {
        $scope.modal.remove();
      });

      function openModal() {
        $scope.modal.show();
      }

      function closeModal() {
        $scope.modal.hide();
      }

      $scope.closeIonicDatePickerModal = function () {
        closeModal();
      };

      //Open datepicker popup
      provider.openDatePicker = function (ipObj) {
        var buttons = [];
        delete $scope.fromDate;
        delete $scope.toDate;

        $scope.mainObj = angular.extend({}, config, ipObj);
        if ($scope.mainObj.from) {
          $scope.fromDate = resetHMSM(new Date($scope.mainObj.from)).getTime();
        }
        if ($scope.mainObj.to) {
          $scope.toDate = resetHMSM(new Date($scope.mainObj.to)).getTime();
        }

        if (ipObj.disableWeekdays && config.disableWeekdays) {
          $scope.mainObj.disableWeekdays = ipObj.disableWeekdays.concat(config.disableWeekdays);
        }
        setInitialObj($scope.mainObj);

        if (!$scope.mainObj.closeOnSelect) {
          buttons = [{
            text: $scope.mainObj.setLabel,
            type: 'button_set',
            onTap: function (e) {
              $scope.mainObj.callback($scope.selctedDateEpoch);
            }
          }];
        }

        if ($scope.mainObj.showTodayButton) {
          buttons.push({
            text: $scope.mainObj.todayLabel,
            type: 'button_today',
            onTap: function (e) {
              var today = new Date();
              refreshDateList(new Date());
              $scope.selctedDateEpoch = resetHMSM(today).getTime();
              if (!$scope.mainObj.closeOnSelect) {
                e.preventDefault();
              }
            }
          });
        }

        buttons.push({
          text: $scope.mainObj.closeLabel,
          type: 'button_close',
          onTap: function (e) {
            console.log('ionic-datepicker popup closed.');
          }
        });

        if ($scope.mainObj.templateType.toLowerCase() == 'popup') {
          $scope.currentYear = new Date().getFullYear();
          $scope.popup = $ionicPopup.show({
            templateUrl: 'ionic-datepicker-popup.html',
            scope: $scope,
            cssClass: 'ionic_datepicker_popup',
            buttons: buttons
          });
        } else {
          openModal();
        }
      };

      return provider;

    }];

  });

//angular.module('ionic-datepicker.service', [])
APP
  .service('IonicDatepickerService2', function () {

    this.monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    this.getYearsList = function (from, to) {
      var yearsList = [];
      var minYear = 1900;
      var maxYear = 2100;

      minYear = from ? new Date(from).getFullYear() : minYear;
      maxYear = to ? new Date(to).getFullYear() : maxYear;

      for (var i = minYear; i <= maxYear; i++) {
        yearsList.push(i);
      }

      return yearsList;
    };
  });
