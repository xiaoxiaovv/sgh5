APP.directive('errSrc',[function(){

  return {
    link:function(scope,element,attrs){
      element.bind('error',function(){

          attrs.$set('src',attrs.errSrc?attrs.errSrc:'http://cdn09.ehaier.com/shunguang/H5/www/img/errPlaceholder.png');
      })
    }
  }

}]);
