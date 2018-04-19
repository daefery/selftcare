CSRContent.controller('UploadFilesCtrl', function ($scope, TTCommonService, Notification) {
    $scope.allowedUploadExt = '.jpg,.jpeg,.png,.xls,.xlsx,.doc,.docx,.txt,.pdf';
    $scope.allowedUploadSize = 5 * 1024 * 1024; //5MB

    var filenames = [];
    $scope.uploadFiles = function (element) {
        var files = element.files;

        for (i = 0; i < files.length; i++) {

            var file_name = files[i].name;
            var file_extension = file_name.substring(file_name.lastIndexOf('.'), file_name.length);
            if ($scope.allowedUploadExt.split(',').indexOf(file_extension) == -1) {
                Notification.error({
                    message: '<strong>File ' + file_name + ' not allowed!</strong> <span>Allowed File Extension : ' + $scope.allowedUploadExt + '</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                console.log('EXT', 'File ' + file_name + ' not allowed!');
            }
            else if ( files[i].size > $scope.allowedUploadSize){
                Notification.error({
                    message: '<strong>File ' + file_name + ' not allowed!</strong> <span>Allowed File Size : ' + $scope.allowedUploadSize + '</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                console.log('Size', 'File ' + file_name + ' not allowed!');
            }
            else{
                filenames.push(files[i]);
            }
        }

        $scope.files = files;
        $scope.filenames = filenames;

        $scope.$parent.upload.files = filenames; // object : '$scope.upload.files = {};' should be created in Parent Controller

        $scope.$apply();
    };

    $scope.removeAttachment = function (filename) {
        for (var i = 0; i < filenames.length; i++) {
            if (filenames[i].name && filenames[i].name === filename.name) {
                filenames.splice(i, 1);
                break;
            }
        }
        $scope.filenames = filenames;
        $scope.$apply();
    }

    $scope.upload.deleteFileAttachment = function (param) {
        TTCommonService.TTDeleteFileAttachment.delete({
            TicketNumber: param.TicketNo,
            FileLocation: param.FileLocation,
            FileName: param.FileName,
        }, function (response) {
            if (response.ResultType != 0 || response.ResultCode != 0) {
                Notification.error({
                    message: '<strong>Failed Delete File ' + param.FileName + '!</strong> <span>' + response.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            } else {
                TTCommonService.TTDeleteAttachment.delete({
                    AttachmentId: param.Id,
                }, function (response) {
                    if (response.ResultType != 0 || response.ResultCode != 0) {
                        Notification.error({
                            message: '<strong>Failed Delete Data ' + param.FileName + '!</strong> <span>' + response.Messages + '.</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                    } else {
                        Notification.success({
                            message: '<strong>Success!</strong> <span>Attachment ' + param.FileName + ' Is Successfully Deleted.</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                        $scope.upload.loadpage();
                    }
                });
            }
        })
    }

    $scope.upload.downloadFileAttachment = function (param) {
        TTCommonService.TTDownloadFileAttachment.download({
            TicketNumber: param.TicketNo,
            FileLocation: param.FileLocation,
            FileName: param.FileName,
        }, function (response) {
            if (response.ResultType != 0 || response.ResultCode != 0) {
                Notification.error({
                    message: '<strong>Failed Download File ' + param.FileName + '!</strong> <span>' + response.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            } else {
                var Base64File = response.Base64File;
                var MimeType = "application/octet-stream"; // for download

                var downloadatt = angular.element('#downloadatt_' + param.Id);
                downloadatt.attr({
                    style: 'display:none',  //to hide display
                })[0];

                var att = angular.element('#att_' + param.Id);
                att.attr({
                    //target: '_blank',
                    download: param.FileName,
                    href: 'data:' + MimeType + ';base64,' + Base64File,
                    style: '',  //to display
                })[0];
                att[0].click();

            }
        })
    }

    $scope.upload.DoneUploadItem = [];
    $scope.upload.LoadPageWhenUploadDone = function () {
        var numberOfUploadList = $scope.upload.files.length;
        var numberOfItemUploaded = $scope.upload.DoneUploadItem.length;
        if (numberOfItemUploaded == numberOfUploadList) {

            $scope.filenames = [];
            $scope.upload.loadpage();
            angular.element('#AddAttachmentModal').modal('hide');

        } else {
            //console.log('Inprogress ... numberOfItemUploaded ' + numberOfItemUploaded + ' of ' + numberOfUploadList);
        }
    }

    $scope.upload.uploadFileAttachments = function (TicketNumberParam) {

        var files = $scope.upload.files;
        if (files != undefined) {
            var TicketNumber = TicketNumberParam;
            console.log('upload.files for Ticket ' + TicketNumber, files);

            for (var i = 0; i < files.length; i++) {

                var file = files[i];

                var r = new FileReader();
                r.file = file;
                r.onloadend = function (e) {
                    var base64file = e.target.result;

                    var file_name = this.file.name;
                    var file_extension = file_name.substring(file_name.lastIndexOf('.'), file_name.length);
                    var maxname = file_name.substring(0, 99 - TicketNumber.toString().length);
                    file_name = TicketNumber + '_' + Date.now() + '_' + maxname;

                    //data contain first letters : 'data:image/jpeg;base64,', this must be remove:
                    base64file = base64file.substring(base64file.indexOf(",") + 1, base64file.length);

                    TTCommonService.TTUploadFileAttachment.upload({
                        TicketNo: TicketNumber,
                        FileLocation: TicketNumber.toString(),
                        FileName: file_name,
                        Base64File: base64file,
                    }, function (response) {
                        if (response.ResultType != 0 || response.ResultCode != 0) {
                            Notification.error({
                                message: '<strong>Failed Upload File ' + file_name + '!</strong> <span>' + response.Messages + '.</span>',
                                positionY: 'top',
                                positionX: 'center'
                            });
                        } else {
                            Notification.success({
                                message: '<strong>Success!</strong> <span>Attachment ' + file_name + ' Is Successfully Uploaded.</span>',
                                positionY: 'top',
                                positionX: 'center'
                            });

                            TTCommonService.TTPostAttachment.add({
                                TicketNo: TicketNumber,
                                FileLocation: TicketNumber,
                                FileName: file_name
                            }, function (response) {
                                if (response.ResultType != 0 || response.ResultCode != 0) {
                                    Notification.error({
                                        message: '<strong>Failed Recording Data ' + file_name + '!</strong> <span>' + response.Messages + '.</span>',
                                        positionY: 'top',
                                        positionX: 'center'
                                    });
                                } else {
                                    Notification.success({
                                        message: '<strong>Success!</strong> <span>Attachment ' + file_name + ' Is Successfully Recorded.</span>',
                                        positionY: 'top',
                                        positionX: 'center'
                                    });

                                    $scope.upload.DoneUploadItem.push(file);
                                    $scope.upload.LoadPageWhenUploadDone();
                                }
                            });
                        }
                    })

                }
                r.readAsDataURL(file);
            }
        }
    }

    $scope.$on('startquery-creatett', function (event, args) {
        $scope.filenames = [];
    });
})
