/**
 * creater:chuanpeng.zhu@dhc.com.cn
 * create time:2015/12/30
 * describe：用户操作服务。用于用户信息的存储。调用等。
 **/

APP.factory('UserService', ['$rootScope', '$localstorage', function ($rootScope, $localstorage) {
  // User类
  var User = function () {
    this.mobile = undefined;//手机号码
    this.rankName = undefined;
    this.cartNumber = undefined;
    this.sessionKey = undefined;//sessionKey
    this.userId = undefined;//用户id
    this.token = undefined;//令牌
    this.userName = undefined;//用户名
    this.mid = undefined;//推广码
    this.avatarImageFileId = undefined;//用户头像
    this.nickName = undefined;//用户昵称
    this.gender = undefined;//用户性别
    this.email = undefined;//用户邮箱
    this.birthday = undefined;//用户生日
    this.sessionValue = undefined;//sessionValue
    this.loginName = undefined;//登录名
    this.accessToken = undefined;//accessToken
    this.ucId = undefined;
  };

  var user;
  var USER_CACHE_KEY = 'USER_CACHE_KEY';

  return {
    /**
     * 获取用户对象
     */
    getUser: function () {
      // 如果没有初始化，则尝试从本地缓存中读取
      if (!user) {
        user = new User();
        var temp = $localstorage.getObject(USER_CACHE_KEY);
        if (temp) {
          user.mobile = temp.mobile;
          user.rankName = temp.rankName;
          user.cartNumber = temp.cartNumber;
          user.sessionKey = temp.sessionKey;
          user.userId = temp.userId;
          user.token = temp.token;
          user.userName = temp.userName;
          user.mid = temp.mid;
          user.avatarImageFileId = temp.avatarImageFileId;
          user.nickName = temp.nickName;
          user.gender = temp.gender;
          user.email = temp.email;
          user.birthday = temp.birthday;
          user.sessionValue = temp.sessionValue;
          user.loginName = temp.loginName;
          user.accessToken = temp.accessToken;
          user.ucId = temp.ucId;
        }
      }
      return user;
    },
    /**
     * 更新用户
     */
    setUser: function (userObj) {
      if (!user) {
        user = new User();
      }
      if(userObj){
        user.mobile = userObj.mobile;
        user.rankName = userObj.rankName;
        user.cartNumber = userObj.cartNumber;
        user.sessionKey = userObj.sessionKey;
        user.userId = userObj.userId;
        user.ucId = userObj.ucId;
        user.token = userObj.token;
        user.userName = userObj.userName;
        user.mid = userObj.mid;
        user.avatarImageFileId = userObj.avatarImageFileId;
        user.nickName = userObj.nickName;
        user.gender = userObj.gender;
        user.email = userObj.email;
        user.birthday = userObj.birthday;
        user.sessionValue = userObj.sessionValue;
        user.loginName = userObj.loginName;
        user.accessToken = userObj.accessToken;
        $localstorage.setObject(USER_CACHE_KEY, user);
        $rootScope.$broadcast('USER:REFLASH', user);
      }
    },
    /**
     * 用户退出清理存储
     */
    clearUser: function () {
      if (user) {
        user.mobile = undefined;
        user.rankName = undefined;
        user.cartNumber = undefined;
        user.sessionKey = undefined;
        user.userId = undefined;
        user.token = undefined;
        user.userName = undefined;
        user.mid = undefined;
        user.avatarImageFileId = undefined;
        user.nickName = undefined;
        user.gender = undefined;
        user.email = undefined;
        user.birthday = undefined;
        user.sessionValue = undefined;
        user.accessToken = undefined;
        // user.loginName = undefined;
      }
      //$localstorage.remove(USER_CACHE_KEY);
      $localstorage.setObject(USER_CACHE_KEY, null);
      $rootScope.$broadcast('USER:CLEAR');
    },
    /**
     * 判断用户是否登录
     */
    isUserLogin: function () {
      if (!user) {
        user = this.getUser();
      }
      return (!!user.token);

    }
  }
}
])
;
