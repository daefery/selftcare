CSRContent.controller('InventoryManagementController', function ($scope, $filter, $route, $window, $modal, CacheInventoryOrderSearch, OrderGetInventoryProductDetailService, UpdateProductSpecification, GetPhoneImage, PostPhoneImage, Notification, CSRCache) {

    var pagenumber = 1,
        rowperpage = 10,
        nodatafound = false,
        totalPage = 1;
    $scope.pagingServerSide = 0;
    //$scope.currentPage = 1;
    $scope.selectedRow = null;

    $scope.searchpagenumber = 1;
    $scope.search = {
        productid: null, productname: null, sku: null, modelnumber: null,
        beginquantityfrom: null, beginquantityto: null, availablequantityfrom: null, availablequantityto: null
    }
    $scope.searchDefault = angular.copy($scope.search);

    CacheInventoryOrderSearch.getInventoryAll().then(function (result) {
        $scope.ProductsData = result;
        $scope.productsoriginal = angular.copy(result.ProductInventory);

        var totalCount = parseInt(result.Total);
        var mathVal = totalCount / rowperpage;
        var checkValue = mathVal.toString();
        if (checkValue.indexOf(".") > -1) {
            totalPage = parseInt(checkValue.substring(0, checkValue.indexOf('.'))) + 1;
        }
        else {
            totalPage = mathVal;
        };
        $scope.pagingServerSide = totalPage;
    });

    $scope.SearchByPageNumber = function (pageNumber) {
        $scope.searchpagenumber = pageNumber;
        $scope.getProductsInventory($scope.searchDefault);
    };

    $scope.SearchBtnClick = function () {
        $scope.searchpagenumber = 1;
        $scope.pagingServerSide = 0;
        $scope.searchDefault = angular.copy($scope.search);
        $scope.getProductsInventory($scope.search);
    };

    $scope.fileinput == false;
    $scope.ProductsData = null;
    $scope.getProductsInventory = function (searchform) {
        OrderGetInventoryProductDetailService.query({
            PageNumber: $scope.searchpagenumber, RowPerPage: 10,
            ProductId: searchform.productid, ProductName: searchform.productname, SKU: searchform.sku, ModelNumber: searchform.modelnumber,
            BeginQuantityFrom: searchform.beginquantityfrom, BeginQuantityTo: searchform.beginquantityto, AvailableQuantityFrom: searchform.availablequantityfrom, AvailableQuantityTo: searchform.availablequantityto
        }, function (result) {
            $scope.ProductsData = result;
            $scope.productsoriginal = angular.copy(result.ProductInventory);

            var totalCount = parseInt(result.Total);
            var mathVal = totalCount / rowperpage;
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

    $scope.getInventoryById = function (index) {
        var temp = angular.copy($scope.ProductsData.ProductInventory)
        $scope.productselected = $filter('getProductById')(temp, index, true);
        $scope.selectedRow = index;
    };

    $scope.chooseImage = function (element) {

        $scope.fileinput = true;
        var file = element.files;

        $scope.imagefile = file[0];

        temp = $scope.imagefile;
        var r = new FileReader();
        r.file = temp;

        r.onload = function (e) {
            var base64file = e.target.result;
            base64file = base64file.substring(base64file.indexOf(",") + 1, base64file.length);
            $scope.phoneimagebase64 = base64file;
            $scope.$apply();
        }
        r.readAsDataURL(temp);
    };

    $scope.phoneimagebase64 = "";

    $scope.clickModifyButton = function () {
        if ($scope.selectedRow != null) {
            $scope.phoneimagebase64 = null;
            GetPhoneImage.query({ url: $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.ImageUrl }, function (result) {
                $scope.phoneimagebase64 = result.Base64File;
                $scope.openmodifymodal('lg');
                $scope.confirmmodify();
                $scope.unchangeabledata = angular.copy($scope.productselected);
            });
        }
    };

    $scope.confirmmodify = function () {
        var message = "";
        var products = '';
        var j = 0;
        $scope.confirmmessage = '';
        for (i = 0; i < $scope.productsoriginal.length; i++) {
            if ($scope.productsoriginal[i].PhysicalProduct.PhysicalResourceSpecification.SKU == $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.SKU) {
                if (products != '') {
                    products = products + ', ';
                }
                products += $scope.productsoriginal[i].PhysicalProduct.ProductId;
                j++;
            }
        };
        if (j > 1) {
            $scope.confirmmessage = "Updating this product will also modify product with ID: " + products + ".";
        }
    };

    $scope.openmodifymodal = function (size) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'modifyproduct.html',
            controller: 'modifymodalctrl',
            scope:$scope,
            size: size
        });
    };
    
    $scope.UpdateSubmit = function () {
        var message = "Product specs with product ID: ";
        var products = '';
        for (i = 0; i < $scope.productsoriginal.length; i++) {
            if ($scope.productsoriginal[i].PhysicalProduct.PhysicalResourceSpecification.SKU == $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.SKU) {
                if (products != '') {
                    products = products+', ';
                }
                products += $scope.productsoriginal[i].PhysicalProduct.ProductId;
            }
        };
        //Notification.success({
        //    message: '<strong>' + message + products + '</span>',
        //    positionY: 'top',
        //    positionX: 'center'
        //});

        if ($scope.fileinput == true) {
            //-- upload image --
            var file = $scope.imagefile;

            var r = new FileReader();
            r.file = file;

            r.onloadend = function (e) {
                var base64file = e.target.result;

                var file_name = this.file.name;
                var file_extension = file_name.substring(file_name.lastIndexOf('.'), file_name.length);
                file_name = $scope.productselected.PhysicalProduct.ProductId + '_' + $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.Name + '_' + Date.now() + file_extension;

                //data contain first letters : 'data:image/jpeg;base64,', this must be remove:
                base64file = base64file.substring(base64file.indexOf(",") + 1, base64file.length);

                //generate date format for filelocation
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd
                }

                if (mm < 10) {
                    mm = '0' + mm
                }
                var filelocation = yyyy + '/' + mm + '/';

                PostPhoneImage.upload({
                    FileLocation: filelocation,
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
                        //Notification.success({
                        //    message: '<strong>Success!</strong> <span>Attachment ' + file_name + ' Is Successfully Uploaded.</span>',
                        //    positionY: 'top',
                        //    positionX: 'center'
                        //});
                        $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.ImageUrl = response.FileLocation;
                    }
                    var updateExtendedObject = {
                        ProductId: $scope.unchangeabledata.PhysicalProduct.ProductId,
                        Specification: {
                            SKU: $scope.unchangeabledata.PhysicalProduct.PhysicalResourceSpecification.SKU,
                            Name: $scope.unchangeabledata.PhysicalProduct.PhysicalResourceSpecification.Name,
                            Description: $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.Description,
                            ModelNumber: $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.ModelNumber,
                            Brand: $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.Brand,
                            Color: $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.Color,
                            FrontCamera: $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.FrontCamera,
                            BackCamera: $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.BackCamera,
                            OperationSystem: $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.OperationSystem,
                            Storage: $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.Storage,
                            ImageUrl: $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.ImageUrl
                        },
                        Language: 139 //hardcoded in eng
                    };
                    UpdateProductSpecification.update(updateExtendedObject, function (result) {
                        Notification.success({
                            message: '<strong>Products updated!</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                        $window.location.reload();

                    })
                })
            }
            r.readAsDataURL(file);
        }
        else {
            var updateExtendedObject = {
                ProductId: $scope.unchangeabledata.PhysicalProduct.ProductId,
                Specification: {
                    SKU: $scope.unchangeabledata.PhysicalProduct.PhysicalResourceSpecification.SKU,
                    Name: $scope.unchangeabledata.PhysicalProduct.PhysicalResourceSpecification.Name,
                    Description: $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.Description,
                    ModelNumber: $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.ModelNumber,
                    Brand: $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.Brand,
                    Color: $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.Color,
                    FrontCamera: $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.FrontCamera,
                    BackCamera: $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.BackCamera,
                    OperationSystem: $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.OperationSystem,
                    Storage: $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.Storage,
                    ImageUrl: $scope.productselected.PhysicalProduct.PhysicalResourceSpecification.ImageUrl
                },
                Language: 139 //hardcoded in eng
            };
            UpdateProductSpecification.update(updateExtendedObject, function (result) {
                Notification.success({
                    message: '<strong>Products updated!</span>',
                    positionY: 'top',
                    positionX: 'center'
                });

                $window.location.reload();

            })
        }
        
    };

    $scope.ResetInventory = function () {
        $scope.ProductsData.ProductInventory = $scope.productsoriginal;
        $scope.search = {
            productid: null, productname: null, sku: null, modelnumber: null,
            beginquantityfrom: null, beginquantityto: null, availablequantityfrom: null, availablequantityto: null
        }
        $scope.searchpagenumber = 1;
        $scope.pagingServerSide = 0;
        $scope.searchDefault = angular.copy($scope.search);
        $scope.getProductsInventory($scope.search);
        //$scope.SearchInventoryForm.$setPristine;
    }
});


CSRContent.controller('modifymodalctrl', function ($scope, $modalInstance, CSRCache) {

    $scope.save = function () {
        $modalInstance.close();
        $scope.UpdateSubmit();
    };

    $scope.cancel = function () {
        $scope.getInventoryById($scope.productselected.PhysicalProduct.ProductId);
        $scope.fileinput = false;
        $modalInstance.dismiss('cancel');
    };
});

CSRContent.controller('productspaginationController', function ($scope, ApiConnection, $filter) {
    $scope.sort = function (keyname) {
        //$scope.sortKey = keyname;   //set the sortKey to the param passed
        //$scope.reverse = !$scope.reverse; //if true make it false and vice versa

        //$scope.ProductsData.ProductInventory = $filter('orderBy')($scope.ProductsData.ProductInventory, keyname, $scope.reverse);
    }
});

CSRContent.filter('getProductById', function () {
    return function (input, id) {
        var i = 0, len = input.length;
        for (; i < len; i++) {
            if (+input[i].PhysicalProduct.ProductId == +id) {
                return input[i];
            }
        }
        return null;
    }
});

CSRContent.controller('SearchInventoryForm', function ($scope, $parse) {
    $scope.datas = {
        field: [
            {
                type: "text",
                name: "productid",
                size: 6,
                text: "Product_Id",
                model: "search.productid",
                //required: true,
                validation: [{ value: "text" }]
            },
            {
                type: "text",
                name: "productname",
                size: 6,
                text: "Product_Name",
                model: "search.productname",
                //required: true,
                validation: [ { value: "text" }]
            },
            {
                type: "text",
                name: "SKU",
                size: 6,
                text: "SKU",
                model: "search.sku",
                //required: true,
                validation: [{ value: "text" }]
            },
            {
                type: "text",
                name: "modelnumber",
                size: 6,
                text: "Model_Number",
                model: "search.modelnumber",
                //required: true,
                validation: [{ value: "text" }]
            },
            {
                type: "text",
                name: "beginquantityfrom",
                size: 6,
                text: "beginQuantity_From",
                model: "search.beginquantityfrom",
                //required: true,
                validation: [{ value: "text" }]
            },
            {
                type: "text",
                name: "beginquantityto",
                size: 6,
                text: "beginQuantity_To",
                model: "search.beginquantityto",
                //required: true,
                validation: [ { value: "text" }]
            },
            {
                type: "text",
                name: "availablequantityfrom",
                size: 6,
                text: "AvailableQuantity_From",
                model: "search.availablequantityfrom",
                //required: true,
                validation: [{ value: "text" }]
            },
            {
                type: "text",
                name: "availablequantityto",
                size: 6,
                text: "AvailableQuantity_To",
                model: "search.availablequantityto",
                //required: true,
                validation: [ { value: "text" }]
            }

        ],
        button: [
            {
                name: "Search",
                type: "submit",
                text: "Search",
                click: "SearchBtnClick()"
            },
            {
                name: "Reset_Form",
                type: "submit",
                text: "Reset_Form",
                click: "ResetInventory()"
            },
            //{
            //    name: "Reset",
            //    type: "reset",
            //    text: "Reset_Form",
            //    model: "search"
            //}
        ]
    };
});

