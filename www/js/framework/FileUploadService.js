/*
   封装上传文件 代码 的服务
 */
APP.service('FileUploadService',['$http', 'UrlService', function ($http,UrlService) {

    //sourceType 0 代表拍照，1 代表从相册  getSuccess  默认传一个imageData getFail


    if(!window.FileTransfer){
        console.error("FileUploadService fatal ERROR !!! NO  FileTransfer");
        return
    }
    var ft = new FileTransfer();

    this.upload  = function (imgUrl,uploadUrl,fileKey,fileName,mimeType,opParams,uploadSucc,uploadFail) {
        var options = new FileUploadOptions();
        options.fileKey = fileKey?fileKey:'imageFile';
        options.fileName = fileName?fileName:imgUrl.substr(imgUrl.lastIndexOf('/') + 1);
        if(mimeType){
            options.mimeType = 'image/jpeg';
        }// 上传音频 不需要类型

        var params = {};
        params.userName = "18560683520";
        options.params = params;
        ft.upload(imgUrl,encodeURI(uploadUrl), uploadSucc, uploadFail,options);
    };
}
]);