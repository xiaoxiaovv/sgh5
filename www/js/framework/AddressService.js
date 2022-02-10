/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/05/23
 * describe：将定位到的地址缓存到服务端
 **/
APP.service('CommonAddressService', ['AreaService', 'GoodsService', 'CacheService', '$rootScope','$localstorage',
  function (AreaService, GoodsService, CacheService, $rootScope,$localstorage) {

    var addressMessage = {};
    return {
      addAddressInfo: function () {
        AreaService.getLocalArea().
          then(function (response) {
            var position = response.regeocode.addressComponent;
            GoodsService.getAddressId(position.province, position.city, position.district, position.township,position.adcode).
              success(function (response) {
                if (response.data != null && response.data != undefined && response.data.length != 0) {
                  var addressIds = response.data;
                  var detailAddress = position.district + '/' + position.township;
                  // 如果是RN端的顺逛打开的H5 不需要在这调这个接口 因为地址信息已经从RN传递过来了
                  if (window.location.href.indexOf('sg_rn_app') == -1) {
                    GoodsService.addAddress(addressIds.provinceId, addressIds.cityId, addressIds.regionId, detailAddress, addressIds.streetId).
                      success(function (response) {
                        //var storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);//获取用户信息;
                        //loadSelectionData(addressIds.provinceId, addressIds.cityId, addressIds.regionId, addressIds.streetId, storeId);
                        $rootScope.dingWeiSuccess = true;
                        if($rootScope.globalConstant.positionStatus){
                          $rootScope.globalConstant.autoPosition = detailAddress;
                        }else{
                          $rootScope.globalConstant.autoPosition = '定位失败：崂山区/中韩街道';
                        }
                        addressMessage = {
                          provinceId: addressIds.provinceId,
                          cityId: addressIds.cityId,
                          areaId: addressIds.regionId,
                          streetId: addressIds.streetId,
                          provinceName: position.province,
                          cityName: position.city,
                          regionName: position.district,
                          streetName: position.township
                        };
                        console.log("******************************************************");
                        console.log(addressMessage);
                        setTimeout(function () {
                          $rootScope.$broadcast('CACHE_SUCCESS', addressMessage);
                        }, 2000);
                        CacheService.set('addressInfo', addressMessage);
                      }, function (err) {
                        console.log('地址缓存到服务端失败！');
                      });
                  } else {
                    $rootScope.dingWeiSuccess = true;
                        if($rootScope.globalConstant.positionStatus){
                          $rootScope.globalConstant.autoPosition = detailAddress;
                        }else{
                          $rootScope.globalConstant.autoPosition = '定位失败：崂山区/中韩街道';
                        }
                        addressMessage = {
                          provinceId: addressIds.provinceId,
                          cityId: addressIds.cityId,
                          areaId: addressIds.regionId,
                          streetId: addressIds.streetId,
                          provinceName: position.province,
                          cityName: position.city,
                          regionName: position.district,
                          streetName: position.township
                        };
                        console.log("******************************************************");
                        console.log(addressMessage);
                        setTimeout(function () {
                          $rootScope.$broadcast('CACHE_SUCCESS', addressMessage);
                        }, 2000);
                        CacheService.set('addressInfo', addressMessage);
                  }
                }
              }, function (err) {
                console.log('获取省市区Id失败！');
              });
          }, function (err) {
            addressMessage = {
              provinceId: 16,
              cityId: 173,
              areaId: 2450,
              streetId: 12036596,
              provinceName: '山东',
              cityName: '青岛',
              regionName: '崂山区',
              streetName: '中韩街道'
            };
            var detailAddress = addressMessage.regionName + '/' + addressMessage.streetName;
            GoodsService.addAddress(addressMessage.provinceId, addressMessage.cityId, addressMessage.areaId, detailAddress, addressMessage.streetId).
              success(function (response) {
                CacheService.set('addressInfo', addressMessage);
              }, function (err) {
                console.log('地址缓存到服务端失败！');
              });
          });
      },
      getAddressInfo: function () {
        if (CacheService.get('addressInfo')) {
          return CacheService.get('addressInfo');
        } else {
          addressMessage = {
            provinceId: 16,
            cityId: 173,
            areaId: 2450,
            streetId: 12036596,
            provinceName: '山东',
            cityName: '青岛',
            regionName: '崂山区',
            streetName: '中韩街道'
          };
          return addressMessage;
        }
      }
    };
    //function loadSelectionData(provinceId, cityId, districtId, streetId, storeId){//预加载选品页发现数据
    //  GoodsService.doInitFaxian(1,provinceId, cityId, districtId, streetId, storeId,districtId,true)
    //    .success(function(res){
    //      window.localStorage.setItem('SeData',JSON.stringify(res));
    //    });
    //}
  }]);

