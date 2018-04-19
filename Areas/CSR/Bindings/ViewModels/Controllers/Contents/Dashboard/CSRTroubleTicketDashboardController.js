'use strict'

CSRContent.controller('BrowseTTPaginationController', function ($scope, CSRCache, DetailCustomer, TicketDetail) {
    $scope.sort = function (keyname) {
        if (keyname != $scope.sortKey) {
            $scope.sortKey = keyname;
            $scope.reverse = false;
        } else if (keyname == $scope.sortKey) {
            $scope.sortKey = keyname;
            $scope.reverse = !$scope.reverse;
        }
        $scope.keySearch.OrderBy = keyname;
        $scope.keySearch.OrderType = $scope.reverse == false ? "Asc" : "Desc";
        $scope.search();
    }

    $scope.selectedRow = null;
    $scope.Link_Details_and_Update = '#';

    $scope.setClickedRow = function (selectedRow) {
        if (selectedRow != undefined) {
            $scope.selectedRow = selectedRow.TicketNumber;
            CSRCache.put('TTDetailSearch', selectedRow.TicketNumber);

            DetailCustomer.setDetail({
                MVNOName: selectedRow.DealerNode,
                MVNOId: selectedRow.Fuid,
                MSISDN: selectedRow.MSISDN,
                CustomerId: selectedRow.CustomerInfo.CustomerId,
            });

            TicketDetail.setDetail({
                TicketNumber: selectedRow.TicketNumber,
            });

            $scope.Link_Details_and_Update = '/CSR/Customer/App/SearchPage/TroubleTicketInfo?dashboard';
        }
    }

});

CSRContent.controller('SupportRequestTTPaginationController', function ($scope, CSRCache, Notification, CacheTroubleTicketService) {
    $scope.sort = function (keyname) {
        if (keyname != $scope.sortKey) {
            $scope.sortKey = keyname;
            $scope.reverse = false;
        } else if (keyname == $scope.sortKey) {
            $scope.sortKey = keyname;
            $scope.reverse = !$scope.reverse;
        }
        $scope.keySearch.OrderBy = keyname;
        $scope.keySearch.OrderType = $scope.reverse == false ? "Asc" : "Desc";
        $scope.search();
    }

    $scope.data = null;

    $scope.doing = function (param) {

        if ($scope.data != undefined) {
            if (param == 'Escalate' && $scope.isEscalateAllowed == true) {
                $scope.openEscalateModal($scope.data);
            } else if (param == 'Update') {
                $scope.openUpdateModal($scope.data);
            }
        }
    }

    $scope.selectedRow = null;
    $scope.Link_Detail_Support_Request = '#';

    $scope.setClickedRow = function (selectedRow) {

        if (selectedRow != undefined) {
            $scope.selectedRow = selectedRow.TicketNumber;
            CSRCache.put('TTDetailSearch', selectedRow.TicketNumber);

            $scope.data = selectedRow;
            $scope.isAllowEscalate($scope.data);

            $scope.Link_Detail_Support_Request = "/CSR/Customer/App/TroubleTickets/SupportRequestDetail";
        }
    }

    $scope.update = {};
    $scope.escalate = {};

    $scope.openUpdateModal = function (data) {

        if (data.TicketNumber != undefined) {
            $scope.update.showUpdateInterface(data);
        } else {

            Notification.error({
                message: '<strong>Please select a Ticket!</strong> <span>Please select a Ticket!</span>',
                positionY: 'top',
                positionX: 'center'
            });
        }
    }

    $scope.isEscalateAllowed = false;
    $scope.isAllowEscalate = function (data) {
        $scope.isEscalateAllowed = false;
        if (data != undefined) {
            if (data.Status.Id.toString() != "105") { //Not Closed
                $scope.isEscalateAllowed = true;
            }
        }
        return $scope.isEscalateAllowed;
    }

    $scope.openEscalateModal = function (data) {

        if (data.TicketNumber != undefined) {
            if ($scope.isEscalateAllowed == true) {

                $scope.escalate.showEscalateInterface(data);
            } else {

                Notification.error({
                    message: '<strong>Denied</strong> <span>Closed Ticket not Allowed to be Escalated!</span>',
                    positionY: 'top',
                    positionX: 'center'
                });

            }
        } else {

            Notification.error({
                message: '<strong>Please select a Ticket!</strong> <span>Please select a Ticket!</span>',
                positionY: 'top',
                positionX: 'center'
            });

        }
    }
});

CSRContent.controller("BrowseTTFormController", function ($scope, LocalStorageProvider, $timeout, CommonEnum, CSRCache, CacheSearch, CacheEnumService
    , paginationService) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    var template = "/templates/CSR/Customer/TroubleTicket/Content/DashboardTTResult.html"
    $scope.includeBrowseTTResultHtml = "<div ng-include=\"'" + template + "'\"></div>"

    var pagenumber = 1,
        rowsperpage = 10,
        nodatafound = false,
        totalPage = 1;
    $scope.pagingServerSide = 0;
    $scope.currentPage = 1;

    $scope.isdataexist = function () {
        return nodatafound;
    };

    $scope.form = {}; //to set default name on UI Form
    $scope.keySearch = {
        keyMVNO: '',
        keyTT_Code: '',
        keyID_Number: '',
        keyClass: '',
        keyPriority: '',
        keyCategory: '',
        keyMSISDN: '',
        keyFrom: null,
        keyTo: null,
        keyStatus: '',
        PageNumber: pagenumber,
        PageSize: rowsperpage,
        OrderBy: '',
        OrderType: '',
    };
    var keySearchDefault = angular.copy($scope.keySearch);

    $scope.updateselected = function (data) {
        $scope.keySearch = data;
    }
    $scope.updateOnChangeMVNO = function (data) {
        $scope.keySearch = data;

        var objectTTClassandPriority = {
            dealerId: $scope.keySearch.keyMVNO
        };

        $scope.TTClass = [];
        $scope.TTPriority = [];
        CacheEnumService.getTTClassandPriority(objectTTClassandPriority).then(function (result) {
            $scope.TTClass = result.ClassList;
            $scope.TTPriority = result.PriorityList;
        });
    }

    $scope.resetSearch = function () {
        $scope.keySearch = angular.copy(keySearchDefault);
        $scope.form.BrowseTTUIForm.$setPristine(); //to set form to default
    };

    $scope.TTStatus = [];
    CacheEnumService.getTTStatus().then(function (result) {
        $scope.TTStatus = result.TTStatusInfo;
    });

    $scope.TTMVNO = [];
    CacheEnumService.getTTMVNO().then(function (result) {

        $scope.DatePlaceholder = LocalStorageProvider.getDateFormatMoment();
        result.forEach(function (e) {
            e.value = e.dealerid;
            e.name = e.mvnoname;
        })

        $scope.TTMVNO = result;

        //$scope.keySearch.keyMVNO = $scope.TTMVNO[0].value; // selected first index
        result.forEach(function (e) {
            // selected index
            if (LocalStorageProvider.getMvnoid() == e.orgid) {
                $scope.keySearch.keyMVNO = e.value;
                keySearchDefault.keyMVNO = e.value;
            }
        })

        $scope.updateOnChangeMVNO($scope.keySearch);

    });

    var cacheKey = 'BrowseTTData';
    $scope.CstData = [];
    $scope.CstData_TotalCount = 0;
    $scope.getSearch = function (object) {
        CacheSearch.getBrowseTTService(object).then(function (result) {

            var data = result.TTInfo;
            $scope.CstData = data.TroubleTicketList;
            $scope.CstData_TotalCount = data.TotalCount;
            CSRCache.put(cacheKey, $scope.CstData);

            if (data.TroubleTicketList.length < 1) {
                nodatafound = true;
            }
            else {
                nodatafound = false;
            };

            var totalCount = parseInt(data.TotalCount);
            var mathVal = totalCount / rowsperpage;
            var checkValue = mathVal.toString();
            if (checkValue.indexOf(".") > -1) {
                totalPage = parseInt(checkValue.substring(0, checkValue.indexOf('.'))) + 1;
            }
            else {
                totalPage = mathVal;
            };
            $scope.pagingServerSide = totalPage;

        });

    };

    $scope.getSearchByPageNumber = function (pageNumber) {
        $scope.keySearch.PageNumber = pageNumber;
        $scope.currentPage = pageNumber;
        paginationService.setCurrentPage('tt-dashboard', pageNumber);
        $scope.getSearch($scope.keySearch);
    }

    $scope.search = function () {
        $scope.CstData = [];
        $scope.getSearchByPageNumber(1);
    };

    if (CSRCache.get('ParamBrowseTT') != undefined) {
        $scope.keySearch = angular.copy(CSRCache.get('ParamBrowseTT'));
        $scope.getSearchByPageNumber($scope.keySearch.PageNumber);// auto search
    }

    $scope.$watch('keySearch.keyFrom', validateDates);
    $scope.$watch('keySearch.keyTo', validateDates);

    function validateDates() {
        var validateName = 'dateRange_FromTo';
        if ($scope.form.BrowseTTUIForm == undefined) {
            return;
        }
        if ($scope.keySearch.keyFrom == null || $scope.keySearch.keyTo == null ||
            $scope.keySearch.keyFrom == undefined || $scope.keySearch.keyTo == undefined ||
            $scope.keySearch.keyFrom == '' || $scope.keySearch.keyTo == ''
            ) {
            $scope.form.BrowseTTUIForm.$setValidity(validateName, true);
        } else {
            //depending on whether the user used the date picker or typed it, this will be different (text or date type).  
            //creating a new date object takes care of that.  
            var startDate = new Date($scope.keySearch.keyFrom);
            var endDate = new Date($scope.keySearch.keyTo);
            $scope.form.BrowseTTUIForm.$setValidity(validateName, endDate >= startDate);
        }
    }

    setTimeout(function () {
        datepicker();
    }, 1000);
});

CSRContent.controller("SupportRequestTTFormController", function ($scope, LocalStorageProvider, CommonEnum, CSRCache, CacheSearch, CacheEnumService, CacheTroubleTicketService
    , paginationService) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    var pagenumber = 1,
        rowsperpage = 10,
        nodatafound = false,
        totalPage = 1;
    $scope.pagingServerSide = 0;
    $scope.currentPage = 1;

    $scope.isdataexist = function () {
        return nodatafound;
    };

    $scope.form = {}; //to set default name on UI Form
    $scope.keySearch = {
        keyMVNO: '',
        keyCategory: '',
        keyMSISDN: '',
        keyFrom: null,
        keyTo: null,
        keyStatus: '',
        PageNumber: pagenumber,
        PageSize: rowsperpage,
        OrderBy: '',
        OrderType: '',
    };
    var keySearchDefault = angular.copy($scope.keySearch);

    $scope.updateselected = function (data) {
        $scope.keySearch = data;
    }
    $scope.updateOnChangeMVNO = function (data) {
        $scope.keySearch = data;


        $scope.TTCategory = [];
        CacheTroubleTicketService.getTicketType($scope.keySearch.keyMVNO).then(function (result) {
            result.TroubleTicketTypeLists.forEach(function (e) {
                e.value = e.TypeId;
                e.name = e.NameId.DefaultMessage;
            });
            $scope.TTCategory = result.TroubleTicketTypeLists;
        });

        //$scope.getSearch($scope.keySearch);// auto search
    }

    $scope.resetSearch = function () {
        $scope.keySearch = angular.copy(keySearchDefault);
        $scope.form.SupportRequestTTUIForm.$setPristine(); //to set form to default
    };

    $scope.TTStatus = [];
    var AvailableSupportStatus = function () {
        return [
            { name: 'Open', value: 100, StatusId: 100, Names: { DefaultMessage: 'Open' } },
            { name: 'Closed', value: 105, StatusId: 105, Names: { DefaultMessage: 'Closed' } },
        ];
    }
    $scope.TTStatus = AvailableSupportStatus();
    /*
    CacheEnumService.getTTStatus().then(function (result) {
        result.TTStatusInfo.forEach(function (e) {
            e.value = e.StatusId;
            e.name = e.Names.DefaultMessage;
        })
        $scope.TTStatus = result.TTStatusInfo;
    });
    */

    $scope.TTMVNO = [];
    CacheEnumService.getTTMVNO().then(function (result) {

        $scope.DatePlaceholder = LocalStorageProvider.getDateFormatMoment();
        result.forEach(function (e) {
            e.value = e.dealerid;
            e.name = e.mvnoname;
        })

        $scope.TTMVNO = result;

        //$scope.keySearch.keyMVNO = $scope.TTMVNO[0].value; // selected first index
        result.forEach(function (e) {
            // selected index
            if (LocalStorageProvider.getMvnoid() == e.orgid) {
                $scope.keySearch.keyMVNO = e.value;
                keySearchDefault.keyMVNO = e.value;
            }
        })

        $scope.updateOnChangeMVNO($scope.keySearch);

    });

    var cacheKey = 'SupportRequestTTData';
    $scope.CstData = [];
    $scope.CstData_TotalCount = 0;
    $scope.getSearch = function (object) {

        CacheSearch.getSupportRequestTTDataService(object).then(function (result) {

            var data = result.TTInfo;
            $scope.CstData = data.TroubleTicketList;
            $scope.CstData_TotalCount = data.TotalCount;
            CSRCache.put(cacheKey, $scope.CstData);

            if (data.TroubleTicketList.length < 1) {
                nodatafound = true;
            }
            else {
                nodatafound = false;
            };

            var totalCount = parseInt(data.TotalCount);
            var mathVal = totalCount / rowsperpage;
            var checkValue = mathVal.toString();
            if (checkValue.indexOf(".") > -1) {
                totalPage = parseInt(checkValue.substring(0, checkValue.indexOf('.'))) + 1;
            }
            else {
                totalPage = mathVal;
            };
            $scope.pagingServerSide = totalPage;

        });
    };

    $scope.getSearchByPageNumber = function (pageNumber) {
        $scope.keySearch.PageNumber = pageNumber;
        $scope.currentPage = pageNumber;
        paginationService.setCurrentPage('tt-support', pageNumber);
        $scope.getSearch($scope.keySearch);
    }

    $scope.search = function () {
        $scope.CstData = [];
        $scope.getSearchByPageNumber(1);
    };

    $scope.loadpage = function () {
        CSRCache.remove('SearchSupportRequest');
        $scope.getSearch($scope.keySearch);
    }

    $scope.upload = {};
    $scope.upload.loadpage = function () {
        $scope.loadpage();
    }

    if (CSRCache.get('ParamSupportRequest') != undefined) {
        $scope.keySearch = angular.copy(CSRCache.get('ParamSupportRequest'));
        if (CSRCache.get('EscalatedSupport') != undefined) {
            $scope.loadpage();
            CSRCache.remove('EscalatedSupport');
        } else {
            $scope.getSearchByPageNumber($scope.keySearch.PageNumber);// auto search
        }
    }

    $scope.$watch('keySearch.keyFrom', validateDates);
    $scope.$watch('keySearch.keyTo', validateDates);

    function validateDates() {
        var validateName = 'dateRange_FromTo';
        if ($scope.form.SupportRequestTTUIForm == undefined) {
            return;
        }
        if ($scope.keySearch.keyFrom == null || $scope.keySearch.keyTo == null ||
            $scope.keySearch.keyFrom == undefined || $scope.keySearch.keyTo == undefined ||
            $scope.keySearch.keyFrom == '' || $scope.keySearch.keyTo == ''
            ) {
            $scope.form.SupportRequestTTUIForm.$setValidity(validateName, true);
        } else {
            //depending on whether the user used the date picker or typed it, this will be different (text or date type).  
            //creating a new date object takes care of that.  
            var startDate = new Date($scope.keySearch.keyFrom);
            var endDate = new Date($scope.keySearch.keyTo);
            $scope.form.SupportRequestTTUIForm.$setValidity(validateName, endDate >= startDate);
        }
    }

    setTimeout(function () {
        datepicker();
    }, 1000);
});

CSRContent.controller("SupportRequestTTDetailController", function ($scope, $location, CommonEnum, CSRCache, CacheSearch, CacheEnumService, ErrorHandlerUtility, Notification, AddCommentParamService, TTCommonService, CacheTroubleTicketService, UpdateTroubleTicket) {

    if ($location.path() == '/CSR/Customer/App/TroubleTickets/SupportRequestDetail' && $location.$$search.searchpage != undefined) {
        $scope.Link_Back_To_List = 'CSR/Customer/App/SearchPage';
    } else {
        $scope.Link_Back_To_List = 'CSR/Customer/App/TroubleTickets/SupportRequest';
    }
    $scope.IsClosed = false;

    //Check sessionStorage
    if (CSRCache.get('TTDetailSearch') == undefined) {
        if (sessionStorage.TTDetailSearch != undefined) {
            CSRCache.put('TTDetailSearch', sessionStorage.TTDetailSearch);
        }
    }

    if (CSRCache.get('TTDetailSearch')) {
        $scope.Id = CSRCache.get('TTDetailSearch');

        //Store to sessionStorage
        sessionStorage.TTDetailSearch = $scope.Id;

        $scope.keySearch = {
            Id: $scope.Id
        };

        $scope.form = {}; //to set default name on UI Form
        $scope.addcomment = {};
        $scope.addcomment.Title = 'Add_Comment';

        var cacheKey = 'SupportRequestTTDataDetail';
        $scope.CstData = '';
        $scope.getSearch = function (object) {
            CacheSearch.getSupportRequestTTDetailService(object).then(function (result) {

                if (result.TroubleTicketDetail == undefined) {

                    var msg = 'Ticket cannot be found';
                    Notification.error({
                        message: '<span>' + msg + '</span>',
                        positionY: 'top',
                        positionX: 'center',
                        title: "<span ><h5 style='color: white;'>" + msg + "</h5></span>",
                        delay: 10000
                    });

                    $location.path($scope.Link_Back_To_List);
                }

                CSRCache.put('TTDetailData', result);
                $scope.data = result.TroubleTicketDetail;

                $scope.IsClosed = result.TroubleTicketDetail.Status.Id.toString() == "105" ? true : false;

                $scope.Creation_Time = moment($scope.data.ReportTime).format(config.DateFormatMoment + ' HH:m');

                $scope.Updates = result.Comments;

                $scope.Attachment = result.Attachment;

                $scope.deleteId = undefined;

                AddCommentParamService.setObject($scope.data);
                AddCommentParamService.setCommentType(3);
            });

        };

        $scope.loadpage = function () {
            CSRCache.remove('SearchSupportRequest');
            $scope.getSearch($scope.keySearch);
        }
        $scope.getSearch($scope.keySearch);

        $scope.upload = {};
        $scope.upload.loadpage = function () {
            $scope.loadpage();
        }

        $scope.openDeleteCommentModal = function (id) {

            angular.element('#DeleteCommentModal').modal('show');
            $scope.deleteId = id;
        }
        $scope.deleteComment = function () {

            if ($scope.deleteId != undefined) {
                TTCommonService.TTDeleteComment.delete({
                    Id: $scope.deleteId
                }, function (result) {
                    if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                        Notification.success({
                            message: '<strong>Success!</strong> <span>Comment Is Successfully Deleted.</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });

                        angular.element('#DeleteCommentModal').modal('hide');
                        $scope.loadpage();
                    } else {

                        Notification.error({
                            message: '<span>' + ErrorHandlerUtility.GetErrorMessage(result) + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            title: "<span ><h5 style='color: white;'>" + ErrorHandlerUtility.GetErrorMessage(result) + "</h5></span>"
                        });
                        angular.element('#DeleteCommentModal').modal('hide');
                    }
                });
            } else {
                Notification.error({
                    message: '<span>No Comment to delete</span>',
                    positionY: 'top',
                    positionX: 'center',
                    title: "<span ><h5 style='color: white;'>No Comment to delete</h5></span>"
                });
            }
        };

        $scope.update = {};
        $scope.escalate = {};
        $scope.upload = {};
        $scope.upload.loadpage = function () {
            $scope.loadpage();
        };

        $scope.openAddCommentModal = function (data) {
            $scope.addcomment.showAddCommentInterface(data);
        }

        $scope.openUpdateModal = function (data) {
            $scope.update.showUpdateInterface(data);
        }

        $scope.openEscalateModal = function (data) {
            $scope.escalate.showEscalateInterface(data);
        }

        $scope.openCloseSupportRequestModal = function () {
            angular.element('#CloseSupportRequestModal').modal('show');
        }

        $scope.CloseSupportRequest = function (data) {

            var updateparam = {
                Id: data.TicketNumber,
                TicketCode: data.TicketCode,
                Fuid: data.Fuid,
                ClassId: data.Class.Id,
                PriorityId: data.Priority.Id,
                DepartmentId: data.Department.Id,
                StatusId: 105, // close
                TypeId: data.Type.Id,
                SubTypeId: data.SubType.Id,
                Description: data.Description
            };

            UpdateTroubleTicket.update(updateparam, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>Support Request Is Successfully Closed.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    CSRCache.remove('SearchSupportRequest');
                    $scope.loadpage();
                }
            });

            angular.element('#CloseSupportRequestModal').modal('hide'); //to close modal
        }

    } else {
        var msg = 'Ticket cannot be found';
        Notification.error({
            message: '<span>' + msg + '</span>',
            positionY: 'top',
            positionX: 'center',
            title: "<span ><h5 style='color: white;'>" + msg + "</h5></span>",
            delay: 10000
        });

        $location.path($scope.Link_Back_To_List);
    }
});

CSRContent.controller("UpdateSupportRequestController", function ($scope, $sanitize, CommonEnum, ErrorHandlerUtility, Notification, CSRCache, CacheSearch, TTCommonService, UpdateTroubleTicket, CacheTroubleTicketService, CacheEnumService, TroubleTicketFunctionService
    , LocalStorageProvider) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    $scope.update.showUpdateInterface = function (data) {
        angular.element('#UpdateSupportRequestModal').modal('show');

        $scope.update.TTCategory = [];
        CacheTroubleTicketService.getTicketType(data.Fuid).then(function (result) {
            result.TroubleTicketTypeLists.forEach(function (e) {
                e.value = e.TypeId;
                e.name = e.NameId.DefaultMessage;
            });
            $scope.update.TTCategory = result.TroubleTicketTypeLists;
            $scope.update.CategoryId = data.Type.Id;
        });

        $scope.update.data = data;
        $scope.update.DealerId = data.DealerNode;
        $scope.update.Mobile = data.MSISDN;
        $scope.update.CustomerId = data.CustomerInfo.CustomerId;
        $scope.update.Support_ID = data.TicketNumber;
        $scope.update.Creation_Time = moment(data.ReportTime).format(config.DateFormatMoment + ' HH:m');
        $scope.update.Description = data.Description == null ? '' : data.Description;

        commentEditor.value = '';

        $scope.update.CommentMaxLength = parseInt(TroubleTicketFunctionService.getLengthValidation('COMMENT'));
        $scope.update.DescriptionMaxLength = parseInt(TroubleTicketFunctionService.getLengthValidation('DESCRIPTION'));

    }

    $scope.upload.files = [];

    $scope.modifyUpdateSupportRequest = function () {

        var commentText = commentEditor.value;
        var plain = $sanitize(commentText);
        commentText = plain;
        $scope.update.Comment = '';
        $scope.update.Comment = commentText;

        var data = $scope.update.data;
        var UpdateDescription = $scope.update.Description;

        var updateparam = {
            Id: data.TicketNumber,
            TicketCode: data.TicketCode,
            Fuid: data.Fuid,
            ClassId: data.Class.Id,
            PriorityId: data.Priority.Id,
            DepartmentId: data.Department.Id,
            StatusId: data.Status.Id,
            TypeId: $scope.update.CategoryId,   //change via UI
            SubTypeId: data.SubType.Id,
            Description: UpdateDescription //change via UI
        };

        var valid = false;
        if ($scope.update.Comment.length > $scope.update.CommentMaxLength) {

            Notification.error({
                message: 'Comment Length is too long.',
                positionY: 'top',
                positionX: 'center'
            });
            valid = false;
        }
        else if (UpdateDescription == '' && UpdateDescription.trim().length == 0) {

            Notification.error({
                message: 'Description Should not be empty',
                positionY: 'top',
                positionX: 'center',
                title: "<span ><h5 style='color: white;'>Required</h5></span>"
            });
            valid = false;
        }
        else if (data.Type.Id == updateparam.TypeId && data.Description == updateparam.Description && $scope.upload.files.length < 1) {
            Notification.error({
                message: '<strong>Failed!</strong> <span>You havent changed anything yet</span>',
                positionY: 'top',
                positionX: 'center'
            });
            valid = false;
        } else {
            valid = true;
        }

        if (valid) {
            UpdateTroubleTicket.update(updateparam, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>Support Request Is Successfully Updated.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    if ($scope.update.Comment != '') {
                        TTCommonService.TTPostComment.save({
                            TicketNumber: data.TicketNumber,
                            CommentType: 3,
                            Comment: $scope.update.Comment,
                        }, function (result) {
                            if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                                Notification.success({
                                    message: '<strong>Success!</strong> <span>Comment Is Successfully Added.</span>',
                                    positionY: 'top',
                                    positionX: 'center'
                                });

                                if ($scope.upload.files.length < 1) {
                                    $scope.loadpage();
                                } else {
                                    //upload attachment
                                    $scope.upload.uploadFileAttachments(data.TicketNumber);
                                }

                            } else {
                                Notification.error({
                                    message: '<span>' + ErrorHandlerUtility.GetErrorMessage(result) + '</span>',
                                    positionY: 'top',
                                    positionX: 'center',
                                    title: "<span ><h5 style='color: white;'>" + ErrorHandlerUtility.GetErrorMessage(result) + "</h5></span>"
                                });
                            }

                        });
                    } else {

                        if ($scope.upload.files.length < 1) {
                            $scope.loadpage();
                        } else {
                            //upload attachment
                            $scope.upload.uploadFileAttachments(data.TicketNumber);
                        }

                    }
                }
            });

            angular.element('#UpdateSupportRequestModal').modal('hide'); //to close modal
        }
    }
});

CSRContent.controller("EscalateSupportRequestController", function ($scope, $route, $location, $sanitize, CommonEnum, ErrorHandlerUtility, Notification, CSRCache, CacheSearch, TTCommonService, UpdateTroubleTicket, CacheTroubleTicketService, CacheEnumService, TroubleTicketFunctionService
    , LocalStorageProvider) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    $scope.escalate.form = {};
    $scope.questionAndAnswer = [];
    $scope.snippet = {};

    $scope.escalate.showEscalateInterface = function (data) {

        if (data.Status.Id.toString() == "105") {

            Notification.error({
                message: '<strong>Denied</strong> <span>Closed Ticket not Allowed to be Escalated!</span>',
                positionY: 'top',
                positionX: 'center'
            });
        } else {
            angular.element('#EscalateSupportRequestModal').modal('show');

            $scope.escalate.data = data;
            $scope.escalate.DealerId = data.DealerNode;
            $scope.escalate.Mobile = data.MSISDN;
            $scope.escalate.CustomerId = data.CustomerInfo.CustomerId;
            $scope.escalate.TicketCode = data.TicketCode;
            $scope.escalate.TicketNumber = data.TicketNumber;
            $scope.escalate.Creation_Time = moment(data.ReportTime).format(config.DateFormatMoment + ' HH:m');

            $scope.escalate.SubTypeId = data.SubType.Id;
            $scope.escalate.Description = data.Description;
            $scope.escalate.DescriptionMaxLength = parseInt(TroubleTicketFunctionService.getLengthValidation('DESCRIPTION'));
            $scope.escalate.AnswerMaxLength = parseInt(TroubleTicketFunctionService.getLengthValidation('ANSWER'));

            $scope.escalate.updateOnChangeTicketType = function (param) {
                $scope.escalate.TTSubType = [];
                $scope.questionAndAnswer = [];
                $scope.escalate.SubTypeId = null;
                CacheTroubleTicketService.getTicketSubtype(data.Fuid, param).then(function (result) {

                    result.TTSubTypeLists.forEach(function (e) {
                        e.value = e.SubTypeId;
                        e.name = e.NameId.DefaultMessage;
                    });
                    $scope.escalate.TTSubType = result.TTSubTypeLists;
                });
            }

            CacheTroubleTicketService.getTicketType(data.Fuid).then(function (result) {
                result.TroubleTicketTypeLists.forEach(function (e) {
                    e.value = e.TypeId;
                    e.name = e.NameId.DefaultMessage;
                });
                $scope.escalate.TTType = result.TroubleTicketTypeLists;

                $scope.escalate.TypeId = data.Type.Id;
                $scope.escalate.updateOnChangeTicketType($scope.escalate.TypeId);
            });

            $scope.escalate.updateOnChangeSubTypeId = function (SubTypeId) {
                $scope.questionAndAnswer = [];

                if (SubTypeId != null) {
                    CacheTroubleTicketService.getTicketQuestion(data.Fuid, $scope.escalate.TypeId, SubTypeId).then(function (result) {
                        var data = angular.copy(result);
                        var index = 1;
                        data.TTQuestions.forEach(function (e) {
                            e.question = e.QuestionCode.NameId.DefaultMessage;
                            e.answer = "";
                            e.Name = "QA_" + index.toString();
                            index++;
                        });
                        $scope.questionAndAnswer = data.TTQuestions;
                        $scope.snippet = {};
                    });
                }
            }
        }
    }

    $scope.upload.files = [];

    $scope.escalateSupportRequest = function () {

        var EscalateDescription = $scope.escalate.Description;

        var data = $scope.escalate.data;

        if ($scope.escalate.form.EscalateUIForm.EscalateSubTypeId.$valid != true || $scope.escalate.form.EscalateUIForm.EscalateSubTypeId.$pristine == true || $scope.escalate.SubTypeId == null) {
            var msg = "You must choose any <b>SubType</b>";
            Notification.error({
                message: '<span>' + msg + '</span>',
                positionY: 'top',
                positionX: 'center'
            });
        } else {
            var updateparam = {
                Id: data.TicketNumber,
                TicketCode: data.TicketCode,
                Fuid: data.Fuid,
                ClassId: data.Class.Id,
                PriorityId: data.Priority.Id,
                DepartmentId: data.Department.Id,
                StatusId: data.Status.Id,
                TypeId: $scope.escalate.TypeId,   //change via UI
                SubTypeId: $scope.escalate.SubTypeId,   //change via UI
                Description: EscalateDescription    //change via UI
            };

            if (EscalateDescription != '' && EscalateDescription.trim().length > 0) {
                UpdateTroubleTicket.update(updateparam, function (response) {
                    if (response.ResultType != 0 || response.ResultCode != 0) {
                        Notification.error({
                            message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                    } else {

                        Notification.success({
                            message: '<strong>Success!</strong> <span>Support Request Is Successfully Escalated.</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });

                        angular.element('#EscalateSupportRequestModal').modal('hide'); //to close modal

                        //question and answer
                        $scope.refreshQandAFlag = 0;
                        for (var i = 0; i < $scope.questionAndAnswer.length; i++) {
                            var submitQuestion = {};
                            submitQuestion.QuestionId = $scope.questionAndAnswer[i].QuestionId;
                            submitQuestion.TicketNumber = data.TicketNumber;
                            submitQuestion.Answer = $scope.questionAndAnswer[i].answer;
                            var AddAnswer = new TTCommonService.TTAddAnswer(submitQuestion);
                            AddAnswer.$save(function (result) {
                                if (result.ResultCode !== 0) {
                                    Notification.error({
                                        message: '<strong>Answer Failed!</strong> <span>' + result.Messages + '.</span>',
                                        positionY: 'top',
                                        positionX: 'center'
                                    });
                                }
                                $scope.refreshQandAFlag += 1;
                            })
                        }
                        $scope.$watch('refreshQandAFlag', function () {
                            if ($scope.refreshQandAFlag === $scope.questionAndAnswer.length) {

                                if ($scope.upload.files.length < 1) {
                                    $scope.loadpage();
                                } else {
                                    //upload attachment
                                    $scope.upload.uploadFileAttachments(data.TicketNumber);
                                }

                                $scope.EscalatetoTTSupportDashboard();

                            }
                        });

                    }
                    //UpdateTroubleTicket.update end
                });
            } else {

                Notification.error({
                    message: 'Description Should not be empty',
                    positionY: 'top',
                    positionX: 'center',
                    title: "<span ><h5 style='color: white;'>Required</h5></span>"
                });
            }
        }
    }

    $scope.EscalatetoTTSupportDashboard = function () {
        var supportLocation = '/CSR/Customer/App/TroubleTickets/SupportRequest';
        if ($location.path() != supportLocation) {
            CSRCache.put('EscalatedSupport', 'EscalatedSupport');

            $location.path(supportLocation);
        };
    };

});

CSRContent.controller("AddCommentController", function ($scope, $sanitize, $filter, CommonEnum, CSRCache, CacheSearch, CacheEnumService, ErrorHandlerUtility, Notification, AddCommentParamService, TTCommonService, TroubleTicketFunctionService
    , LocalStorageProvider) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    $scope.addcomment.showAddCommentInterface = function (ttDetails) {
        angular.element('#AddCommentModal').modal('show');

        $scope.addcomment.DealerId = ttDetails.DealerNode;
        $scope.addcomment.Mobile = ttDetails.MSISDN;
        $scope.addcomment.CustomerId = ttDetails.CustomerInfo.CustomerId;
        $scope.addcomment.TicketCode = ttDetails.TicketCode;
        $scope.addcomment.TicketNumber = ttDetails.TicketNumber;
        $scope.addcomment.Comment = ''; //initialize
        $scope.addcomment.TitleLabel = ($scope.addcomment.Title == 'Add_Comment') ? 'Comments' : 'INFORMATIVE_UPDATES';
        $scope.addcomment.TitleLabel = ($filter('translate')($scope.addcomment.TitleLabel));

        $scope.addcomment.CommentMaxLength = parseInt(TroubleTicketFunctionService.getLengthValidation('COMMENT'));

    }

    $scope.postComment = function () {

        var Title = $scope.addcomment.TitleLabel;

        var data = AddCommentParamService.getObject();
        var commentText = $scope.addcomment.Comment;
        if (commentText != '' && commentText.trim().length > 0) {
            var CommentType = AddCommentParamService.getCommentType();

            var x = TTCommonService.TTPostComment.save({
                TicketNumber: data.TicketNumber,
                CommentType: CommentType,
                Comment: commentText,
            }, function (result) {
                if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                    if ($scope.SendEmailCommentCheckbox == true) {
                        var sendemail = {
                            TicketNumber: data.TicketNumber,
                            Comment: commentText
                        }
                        var Connectionsendemail = new TTCommonService.TTSendEmailNotification(sendemail);
                        Connectionsendemail.$save(function (resultEmail) {
                            Notification.success({
                                message: '<strong>Success!</strong> <span>' + Title + ' Is Successfully Added.</span>',
                                positionY: 'top',
                                positionX: 'center'
                            });
                            if (resultEmail.success == true) {
                                Notification.success({
                                    message: '<strong>Success!</strong> <span>Your E-mail has been Sent Successfully!</span>',
                                    positionY: 'top',
                                    positionX: 'center'
                                });
                                angular.element('#AddCommentModal').modal('hide');

                                $scope.loadpage();
                            } else {
                                Notification.error({
                                    message: '<strong>Failed!</strong> <span>Failed to send email, error message: ' + resultEmail.message + '</span>',
                                    positionY: 'top',
                                    positionX: 'center',
                                    title: "<span ><h5 style='color: white;'>" + resultEmail.message + "</h5></span>"
                                });
                                angular.element('#AddCommentModal').modal('hide');

                                $scope.loadpage();
                            }
                        });
                    }
                    else {
                        Notification.success({
                            message: '<strong>Success!</strong> <span>' + Title + ' Is Successfully Added.</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                        angular.element('#AddCommentModal').modal('hide');

                        $scope.loadpage();
                    }

                } else {

                    Notification.error({
                        message: '<span>' + ErrorHandlerUtility.GetErrorMessage(result) + '</span>',
                        positionY: 'top',
                        positionX: 'center',
                        title: "<span ><h5 style='color: white;'>" + ErrorHandlerUtility.GetErrorMessage(result) + "</h5></span>"
                    });
                }

            });
        } else {

            Notification.error({
                message: '' + Title + ' Should not be empty',
                positionY: 'top',
                positionX: 'center',
                title: "<span ><h5 style='color: white;'>Required</h5></span>"
            });
        }

    }
});
