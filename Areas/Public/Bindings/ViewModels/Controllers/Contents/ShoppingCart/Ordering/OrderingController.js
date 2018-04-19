/// <reference path="../../../../../../../../Templates/CSR/Customer/CustomerRegistration/Content/Ordering/Ordering.html" />
publicContent.controller('OrderingController', function ($scope, $rootScope, $http,$parse,$filter, SelfPublicCache, RegistrationCache, DeviceValidationService,
                                                        ErrorHandlerUtility, Notification, ShoppingCartService, CreateShoppingCartService,portInValidationService,
                                                        CommonEnum) {
    $scope.TotalAmount = 0;
    $scope.plans = {};
    $scope.device = {};
    $scope.otherProd = [];
    $scope.displaDevice = false;
    $scope.isByod = false;
    $scope.canContinue = false;
    $scope.transferNumber = null;

    $scope.Order.PortIn = {};
    $scope.Order.BYOD = {};

    $scope.maxCashCard = 0;
    $scope.selectedBuckets = [];
    $scope.selectedAllowanceCashCard = [];
    // 
    // NEW PUBLIC SHOPPINGCART AREA
    // 
    $scope.CarrierList = [];
    RegistrationCache.getCarrierList().then(function (carrierData) {
        var temp2 = angular.copy(carrierData);
        var temp = {};
        for (var i = 0; i < temp2.ListOfCarriers.length; i++) {
            temp = {
                name: temp2.ListOfCarriers[i].Name,
                value: temp2.ListOfCarriers[i].Id
            }
            $scope.CarrierList.push(temp);
        }
    });


    $scope.otherProductsInit = function (id) {
        var i;
        var isMatched = false;
        for (i = 0; i < $scope.otherProd.length ; i++) {
            if (id == $scope.otherProd[i].id) {
                isMatched = true;
                break;
            }
        }
        return isMatched;
    };

    $scope.groupFeatureInit = function (id) {
        var i;
        var isMatched = false;
        if ($scope.HasOptFeatures !== undefined && $scope.HasOptFeatures) {
            for (i = 0; i < $scope.plans.optFeatures.length ; i++) {
                if (id == $scope.plans.optFeatures[i].id) {
                    isMatched = true;
                    break;
                }
            }
        }

        return isMatched;
    };

    $scope.specifiedFeatureInit = function (id) {
        var i;
        var isMatched = false;
        if ($scope.HasOptFeatures !== undefined && $scope.HasOptFeatures) {
            for (i = 0; i < $scope.plans.optFeatures.length ; i++) {
                if (id == $scope.plans.optFeatures[i].id) {
                    isMatched = true;
                    break;
                }
            }
        }

        return isMatched;
    };

    $scope.bucketInit = function(id) {
        var i;
        var isMatched = false;
        if ($scope.HasBuckets !== undefined && $scope.HasBuckets &&$scope.selectedBuckets.length>0) {
            for (i = 0; i < $scope.selectedBuckets.length ; i++) {
                if (id == $scope.selectedBuckets[i].id) {
                    isMatched = true;
                    break;
                }
            }
        }
        return isMatched;
    }

    $scope.checkByod = function (val) {
        if (val == 1) {
            $("#publicPlan").hide(300);
            $("#publicPlanDesc").hide(300);
            $("button[name=publicPlanBtn]").prop('disabled', false);
            $scope.isByod = true;
        } else {
            $scope.isByod = false;
            $("#publicPlan").show(300);
            $(".more-devices").resize();
            $('html, body').animate({
                scrollTop: $("#publicPlan").offset().top
            }, 1000, function () {
                $("#more-devices").resize();
            });
        }
    };

    $scope.checkPortIn=function(val) {
        if (val == 0) {
            $("#portInRequestForm").show(300);
            $scope.isPortIn = true;
        } else {
            $("#portInRequestForm").hide(300);
            $scope.isPortIn = false;
            $scope.validPortIn = false;
        }
    }

    $(document).on('change', 'input[name=publicOtherProdCb]', function () {
        var value = $(this).val();
        var valArr = value.split("|");
        var id = valArr[0];
        var name = valArr[1];
        var purchaseOptionId = valArr[2];
        var price = valArr[3];
        if ($(this).is(':checked')) {
            if (!$scope.otherProd.filter(function (e) { return e.Id == id; }).length > 0) {
                $scope.otherProd.push({
                    "id": id,
                    "names": name,
                    "purchaseOptionId": purchaseOptionId,
                    "price": price
                });
            }

        } else {
            var removeItem = id;
            $scope.otherProd = jQuery.grep($scope.otherProd, function (value) {
                return value.id != removeItem;
            });
        }
    });

    $(document).on('change', 'input[name="publicGroupFeatureCb"]', function () {
        var value = $(this).val();
        var valArr = value.split("|");
        var id = valArr[0];
        var name = valArr[1];
        var purchaseOptionId = valArr[2];
        var price = valArr[3];
        if ($(this).is(':checked')) {
            if (!$scope.plans.optFeatures.filter(function (e) { return e.id == id; }).length > 0) {
                $scope.plans.optFeatures.push(
                {
                    "id": id,
                    "names": name,
                    "purchaseOptionId": purchaseOptionId,
                    "price": price
                });
            }

        } else {
            var removeItem = id;
            $scope.plans.optFeatures = jQuery.grep($scope.plans.optFeatures, function (value) {
                return value.id != removeItem;
            });

        }
    });

    $(document).on('change', 'input[name="publicSpecFeatureCb"]', function () {
        var value = $(this).val();
        var valArr = value.split("|");
        var id = valArr[0];
        var name = valArr[1];
        var purchaseOptionId = valArr[2];
        var price = valArr[3];
        if ($(this).is(':checked')) {
            if (!$scope.plans.optFeatures.filter(function (e) { return e.id == id; }).length > 0) {
                $scope.plans.optFeatures.push(
                {
                    "id": id,
                    "names": name,
                    "purchaseOptionId": purchaseOptionId,
                    "price": price
                });
            }

        } else {
            var removeItem = id;
            $scope.plans.optFeatures = jQuery.grep($scope.plans.optFeatures, function (value) {
                return value.id != removeItem;
            });

        }
    });

    $(document).on('change', 'input[name="bucketsCb"]', function () {
        var value = $(this).val();
        var valArr = value.split("|");
        var id = valArr[0];
        var name = valArr[1];
        var purchaseOptionId = valArr[2];
        var price = valArr[3];
        if ($(this).is(':checked')) {
            if (!$scope.otherProd.filter(function (e) { return e.id == id; }).length > 0) {
                $scope.otherProd.push(
                {
                    "id": id,
                    "names": name,
                    "purchaseOptionId": purchaseOptionId,
                    "price": price,
                    "type":"bucket"
                });
            }

        } else {
            var removeItem = id;
            $scope.otherProd = jQuery.grep($scope.otherProd, function (value) {
                return value.id != removeItem;
            });

        }
    });

    $scope.displayPlanDesc = function (item) {
        $scope.canContinue = false;
        $scope.HasCashCards = false;
        $scope.HasBuckets = false;

        $scope.device = {};
        $scope.otherProd = [];
        $scope.TotalAmount = 0;
        $scope.mandatoryFeatures = [];
        $scope.mandatoryGroupFeatures = [];
        $scope.mandatorySpecifiedFeatures = [];
        $scope.SelectedPlan = item;

        $scope.plans = {
            id: item.Id,
            names: item.Names,
            purchaseOptionId: item.PurchaseOptionId,
            price: item.Price,
            desc: item.Descriptions,
            //specifiedMandatoryFeatures: [],
            //mandatoryGroupFeatures:[],
            mandatoryFeatures: [],//$scope.mandatoryFeatures,
            optFeatures: []
        };

        if (item.HasMandatorySpecifiedFeatures) {
            $scope.ContainsMandatorySpecifiedFeatures = true;
            for (var m = 0; m < item.MandatorySpecifiedFeatures.length; m++) {
                $scope.mandatorySpecifiedFeatures.push({
                    id: item.MandatorySpecifiedFeatures[m].Product.Id,
                    names: item.MandatorySpecifiedFeatures[m].Product.Names,
                    purchaseOptionId: item.MandatorySpecifiedFeatures[m].Product.PurchaseOption.Id,
                    price: parseFloat(item.MandatorySpecifiedFeatures[m].Product.PurchaseOption.Amount) + parseFloat(item.MandatorySpecifiedFeatures[m].Product.PurchaseOption.SetupFee),
                    isGroup: false
                });
            }
            $scope.plans.mandatoryFeatures.push($scope.mandatorySpecifiedFeatures);
            $scope.Order.SelectedMandatorySpecifiedFeature = $scope.plans.mandatoryFeatures;
        }

        if (item.HasMandatoryGroupFeatures) {
            $scope.ContainsMandatoryGroupFeatures = true;
            for (var n = 0; n < item.MandatoryGroupFeatures.length; n++) {
                if (item.MandatoryGroupFeatures[n].MaxValue < item.MandatoryGroupFeatures[n].Products.length) {
                    $scope.HasChoosableMandatoryGroupFeature = true;
                }
                $scope.mandatoryGroupFeatures.push({
                    groupId: item.MandatoryGroupFeatures[n].Id,
                    groupName: item.MandatoryGroupFeatures[n].Names,
                    choosable: $scope.HasChoosableMandatoryGroupFeature,
                    Products: item.MandatoryGroupFeatures[n].Products
                });
            }
        }

        $scope.Order.AllowanceCashCard = item.AllowanceCashCards;
        $scope.Order.OptionalGroupFeatures = item.OptionalGroupFeatures;
        $scope.Order.OptionalSpecifiedFeatures = item.OptionalSpecifiedFeatures;

        $scope.Order.Devices = item.Devices;
        $scope.Order.OtherProduct = item.OtherProducts;
        $scope.Order.Buckets = [];
        $scope.Order.CashCards = item.CashCards;

        $scope.HasGroupFeatures = (item.OptionalGroupFeatures.length > 0 ? true : false);
        $scope.HasSpecifiedFeatures = (item.OptionalSpecifiedFeatures.length > 0 ? true : false);
        $scope.HasDevice = (item.Devices.Products.length > 0 ? true : false);
        $scope.HasOtherProd = !!(item.OtherProducts.length > 0 || item.HasBuckets || item.HasCashCards);
        $scope.HasAllowanceCashCards = (item.AllowanceCashCards.length > 0 ? true : false);
        if ($scope.HasDevice) {
            for (var k = 0; k < item.Devices.Products.length; k++) {
                if (item.Devices.Products[k].ProductSpecification !== null || item.Devices.Products[k].ProductSpecification !== undefined && item.Devices.Products[k].ProductSpecification.ImageUrl!==null) {
                    $scope.Order.Devices.Products[k].Image = "../../../../../Images/empty-image.png";
                    for (var l = 0; l < $scope.DeviceImages.length; l++) {
                        if (item.Devices.Products[k].Id == $scope.DeviceImages[l].DeviceId && $scope.DeviceImages[l].base64File!==null) {
                            $scope.Order.Devices.Products[k].Image = "data:image/jpeg;base64, " + $scope.DeviceImages[l].base64File;
                        }
                    }
                } 
            }
            if ($('.device-list').children().length > 0) {
                $("#device-list").attr("class", "device-list");
            }

            $('#publicChooseDeviceBtn').show();
            $('#publicChooseDevice').attr('class', 'plan-device collapse');
            $(".device-slide").resize();

        } else {
            $('#publicChooseDeviceBtn').hide();
            $('#publicChooseDevice').attr('class', 'plan-device collapse');
        }
        if (item.HasBuckets) {
            $scope.HasBuckets = true;
            $scope.Order.Buckets = item.Buckets;
            //var bucketNotZeroPrice = 0;
            //var tempBucket = [];
            //for (var i = 0; i < item.Buckets.length; i++) {
            //    if (item.Buckets[i].Product.PurchaseOption.Amount != 0) {
            //        tempBucket.push(item.Buckets[i]);
            //        bucketNotZeroPrice++;
            //    }
            //}
            //$scope.Order.Buckets = tempBucket;
        }


        if ($scope.HasOtherProd) {
            if (item.HasCashCards) {
                $scope.maxQtyCashCard = [];
                $scope.HasCashCards = true;
                for (var o = 0; o < item.CashCards.length; o++) {
                    var groupIdName = item.CashCards[o].GroupId.toString();
                    $scope[groupIdName] = item.CashCards[o].MaxValue;
                    for (var p = 0; p < item.CashCards[o].Products.length; p++) {
                        var cashcardId = item.CashCards[o].Products[p].Id;
                        $scope[cashcardId] = 0;
                    }
                };
            }
        }
        $("#publicPlanDesc").show(300);
        $('#publicDeviceDesc').hide();

        if ($scope.HasOtherProd) {
            $('#publicDispOtherProd').show();
            setTimeout(function () {
                $("#publicMoreProducts").attr("class", "moreProducts");
                $(".moreProducts").slick({
                    arrows: true,
                    infinite: false,
                    speed: 300,
                    slidesToShow: 3,
                    autoplay: false,
                    autoplaySpeed: 3000
                });
                $(".moreProducts").resize();
                $('#cashcardList').attr('class', 'extended-wrap collapse');

            }, 0);
        } else {
            $('#publicDispOtherProd').hide();
        }
        if ($scope.HasAllowanceCashCards) {
            setTimeout(function() {
                $('#allowanceCashcardList').attr('class', 'extended-wrap collapse');
            }, 0);
        }
        $('html, body').animate({
            scrollTop: $("#publicPlanDesc").offset().top
        }, 1000, function () {
            $(".moreProducts").resize();
        });
        $("button[name=publicPlanBtn]").prop('disabled', false);
        $("#publicPlanBtn_" + item.Id).prop('disabled', true);
        $("#publicChooseDeviceBtn").hide();
        if ($scope.isByod === true) {
            $("#publicChooseDeviceBtn").hide();
            $("#numberOption").show(200);
            $scope.canContinue = true;
        }
    };

    $scope.selectMandatoryGroup = function (mandatoryFeatureId, groupFeatureId) {
        $scope.Order.SelectedPlan = $scope.SelectedPlan;
        $scope.Order.SelectedMandatoryGroupFeature = {};
        var choosableMandatoryFeatures = [];
        var parentMandatoryFeatures = {};
        var childMandatoryFeatures = [];
        var singleMandatoryFeature = {
            parentFeature: {},
            childFeatures: []
        };
        if ($scope.Order.SelectedPlan.MandatoryGroupFeatures.length > 0) {
            for (var k = 0; k < $scope.Order.SelectedPlan.MandatoryGroupFeatures.length; k++) {
                if (groupFeatureId == $scope.Order.SelectedPlan.MandatoryGroupFeatures[k].Id) {
                    var selectedGroup = $scope.Order.SelectedPlan.MandatoryGroupFeatures[k];
                    for (var l = 0; l < selectedGroup.Products.length; l++) {
                        if (mandatoryFeatureId == selectedGroup.Products[l].Id) {
                            var item = {
                                groupId: groupFeatureId,
                                id: mandatoryFeatureId,
                                names: selectedGroup.Products[l].Names,
                                purchaseOptionId: selectedGroup.Products[l].PurchaseOption.Id,
                                price: parseFloat(selectedGroup.Products[l].PurchaseOption.Amount) + parseFloat(selectedGroup.Products[l].PurchaseOption.SetupFee),
                                isGroup: true 
                            };
                            parentMandatoryFeatures = item;
                            $scope.selectedGroupFeature = parentMandatoryFeatures;
                            if (selectedGroup.Products[l].MandatoryProducts.length > 0) {
                                for (var m = 0; m < selectedGroup.Products[l].MandatoryProducts.length; m++) {
                                    //specific mandatory feature will not be assigned in the client but in the backend
                                    if (selectedGroup.Products[l].MandatoryProducts[m].MaxValue === 1) {
                                        var item = {
                                            groupId: groupFeatureId,
                                            id: selectedGroup.Products[l].MandatoryProducts[m].Product.Id,
                                            names: selectedGroup.Products[l].MandatoryProducts[m].Product.Names,
                                            purchaseOptionId: selectedGroup.Products[l].MandatoryProducts[m].Product.PurchaseOption.Id,
                                            price: parseFloat(selectedGroup.Products[l].MandatoryProducts[m].Product.PurchaseOption.Amount) + parseFloat(selectedGroup.Products[l].MandatoryProducts[m].Product.PurchaseOption.SetupFee),
                                            isGroup: true
                                        };
                                        childMandatoryFeatures.push(item);
                                    } 
                                }
                            }
                            singleMandatoryFeature.parentFeature = parentMandatoryFeatures;
                            singleMandatoryFeature.childFeatures = childMandatoryFeatures;
                            choosableMandatoryFeatures.push(singleMandatoryFeature);
                        }
                    }
                }
            }
        }
        $scope.plans.mandatoryFeatures=choosableMandatoryFeatures;
        $scope.Order.SelectedMandatoryGroupFeature = choosableMandatoryFeatures;
        if ($('#publicChooseDevice').hasClass('plan-device collapse')) {
            $("#publicChooseDeviceBtn").trigger("click");
        }

    };

    $scope.displayDeviceDesc = function (itemDevice) {
        $scope.phoneimagebase64 = "";
        if (itemDevice.ProductSpecification != null) {
            for (var k = 0; k < $scope.DeviceImages.length; k++) {
                if (itemDevice.Id == $scope.DeviceImages[k].DeviceId) {
                    $scope.phoneimagebase64 = "data:image/jpeg;base64, " + $scope.DeviceImages[k].base64File;
                } else {
                    $scope.phoneimagebase64 = "../../../../../Images/empty-image.png";
                }
            }
        } else {
            $scope.phoneimagebase64 = "../../../../../Images/empty-image.png";
        }

        if (itemDevice.Quantity > 0) {
            $scope.isNotOutOfStock = true;
        } else {
            $scope.isNotOutOfStock = false;
        }
        $scope.device = {
            "id": itemDevice.Id,
            "names": itemDevice.Names,
            "PurchaseOptionId": itemDevice.PurchaseOption.Id,
            "price": parseFloat(itemDevice.PurchaseOption.Amount) + parseFloat(itemDevice.PurchaseOption.SetupFee),
            "image": $scope.phoneimagebase64,
            "shippingCost": itemDevice.PurchaseOption.ShippingCost
        };
        $scope.deviceDetail = itemDevice;
        if ($scope.deviceDetail.ProductSpecification != null) {
            $scope.deviceSeries = $scope.deviceDetail.ProductSpecification.Brand+" "+$scope.deviceDetail.ProductSpecification.ModelNumber;
            $scope.deviceColor = $scope.deviceDetail.ProductSpecification.Color;
            $scope.deviceDescription = $scope.deviceDetail.ProductSpecification.Description;
            $scope.deviceOS = $scope.deviceDetail.ProductSpecification.OperationSystem;
            $scope.deviceStorage = $scope.deviceDetail.ProductSpecification.Storage;
            $scope.deviceSKU = $scope.deviceDetail.ProductSpecification.SKU;
            $scope.deviceFrontCamera = $scope.deviceDetail.ProductSpecification.FrontCamera != null ? ($scope.deviceDetail.ProductSpecification.FrontCamera): "-";
            $scope.deviceBackCamera = $scope.deviceDetail.ProductSpecification.BackCamera != null ? ($scope.deviceDetail.ProductSpecification.BackCamera) : "-";
        }
        $('#publicDeviceDesc').show(200);
        $('#numberOption').show(200);
        $(".device-slide").slick({
            arrows: true,
            arrows: true,
            arrows: false,
            infinite: false,
            speed: 300,
            slidesToShow: 1,
            autoplay: true
        });

        $('html, body').animate({
            scrollTop: $("#publicDeviceDesc").offset().top
        }, 1000, function () {
            $(".device-slide").resize();
        });
        $scope.canContinue = true;
    };

    $(document).off('click', '#publicChooseDeviceBtn').on('click', '#publicChooseDeviceBtn', function (event) {
        if ($(".device-list").children().hasClass("col-md-3")) {
            if ($(".device-list").children().hasClass("slick-list")) {
                $(".device-list").children().remove(".slick-list");
                $(".device-list").children().remove("button");
            }
        }


        $(".device-list").slick({
            dots: false,
            slidesToShow: 4,
            slidesToScroll: 1,
            infinite: false,
            arrows: false,
            slide: '.device-item',

            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 800,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 640,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 390,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }

            ]

        });

        $('html, body').animate({
            scrollTop: $("#publicChooseDevice").offset().top
        }, 1000, function () {
            $(".device-list").resize();
        });


    });


    $(document).on('click', 'button[name=publicPlanBtn]', function () {

        if ($(".moreProducts").children().hasClass("slick-list")) {
            $("#publicMoreProducts").attr("class", "moreProducts");
            $(".moreProducts").children().remove(".slick-list");
            $(".moreProducts").children().remove("button");
            $(".moreProducts").slick({
                arrows: true,
                infinite: false,
                speed: 300,
                slidesToShow: 3,
                autoplay: false,
                autoplaySpeed: 3000
            });
            $(".moreProducts").slick({
                arrows: true,
                infinite: false,
                speed: 300,
                slidesToShow: 3,
                autoplay: false,
                autoplaySpeed: 3000
            });

            setTimeout(function () {
                $(".moreProducts").slick({
                    dots: false,
                    arrows: false,
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: false,
                    responsive: [
                        {
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 800,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 640,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 390,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1
                            }
                        }

                    ]

                });
            }, 0);
        }
        $(".moreProducts").resize();


    });

    $scope.reduceQty = function(event) {
        var btnId = event.target.id;
        var temp = btnId.split("_");
        var textfield = $("#qty_" + temp[2] + "_" + temp[3]);
        if (textfield.val() > 0) {
            textfield.val(parseFloat(textfield.val()) - 1);
        }
    };

    $scope.addQty = function (event) {
        var btnId = event.target.id;
        var temp = btnId.split("_");
        var textfield = $("#qty_" +temp[2]+"_"+ temp[3]);
        $scope.checkMaxQtyCashCard(temp[2],textfield);
        
    };

    $scope.checkMaxQtyCashCard = function(groupId, valueLabel) {
        var currentQty = 0;
        var checkQty = {};
        var maxQty = 0;
        for (var k = 0; k < $scope.Order.CashCards.length; k++) {
            if (groupId == $scope.Order.CashCards[k].GroupId) {
                maxQty = $scope.Order.CashCards[k].MaxValue;
                for (var l = 0; l < $scope.Order.CashCards[k].Products.length; l++) {
                    var cashId = $scope.Order.CashCards[k].Products[l].Id;
                    var htmlId = $("#qty_" + groupId + "_" + cashId);
                    currentQty += parseFloat(htmlId.val());
                }
            }
        }
        checkQty = {
            currentQty: currentQty,
            maxQty: maxQty
        };
        if (parseFloat(checkQty.maxQty) - parseFloat(checkQty.currentQty) > 0) {
            valueLabel.val(parseFloat(valueLabel.val()) + 1);
        } else {
            alert("You reach the maximum value of the selected group");
        }
    };

    $scope.reduceQtyAllowanceCashCard = function(event) {
        var btnId = event.target.id;
        var temp = btnId.split("_");
        var textfield = $("#qtyallowancecash_" + temp[2]);
        if (textfield.val() > 0) {
            textfield.val(parseFloat(textfield.val()) - 1);
        }
    };
    $scope.addQtyAllowanceCashCard = function (event) {
        var btnId = event.target.id;
        var temp = btnId.split("_");
        var textfield = $("#qtyallowancecash_" + temp[2]);
        textfield.val(parseFloat(textfield.val()) + 1);
    };
    // 
    // END OF NEW PUBLIC SHOPPINGCART AREA
    //
    $scope.$watch("Cart.EditItem", function (item) {
        $scope.mandatoryGroupFeatures = [];
        $scope.mandatorySpecifiedFeatures = [];
        // this condition is temporary
        // delete the checking csr url when use different UI for ordering screen
        if (location.href.indexOf("public") > -1 || location.href.indexOf("CSR") > -1) {
            if (item !== undefined && Object.keys(item).length > 0) {

                $scope.isParent = item.isParent;
                if (item.isByod === true) {
                    $scope.HasDevice = true;
                    $("#radioYes").prop("checked", true);
                } else {
                    $("#radioNo").prop("checked", true);
                    if (Object.keys(item.device).length > 0) {
                        $scope.device = item.device;
                        $scope.HasDevice = true;
                    } else {
                        $scope.HasDevice = false;
                    }
                }
                $scope.updateId = item.id;
                $scope.plans = item.plans;
                $scope.SelectedPlan = $scope.Order.ItemPlan;
                if (item.plans.mandatoryFeatures.length > 0) {
                    for (var i = 0; i < item.plans.mandatoryFeatures.length; i++) {
                        if (item.plans.mandatoryFeatures[i].parentFeature.isGroup) {
                            $scope.ContainsMandatoryGroupFeatures = true;
                            for (var n = 0; n < $scope.Order.ItemPlan.MandatoryGroupFeatures.length; n++) {
                                if ($scope.Order.ItemPlan.MandatoryGroupFeatures[n].MaxValue < $scope.Order.ItemPlan.MandatoryGroupFeatures[n].Products.length) {
                                    $scope.HasChoosableMandatoryGroupFeature = true;
                                }
                                $scope.mandatoryGroupFeatures.push({
                                    groupId: $scope.Order.ItemPlan.MandatoryGroupFeatures[n].Id,
                                    groupName: $scope.Order.ItemPlan.MandatoryGroupFeatures[n].Names,
                                    choosable: $scope.HasChoosableMandatoryGroupFeature,
                                    Products: $scope.Order.ItemPlan.MandatoryGroupFeatures[n].Products
                                });
                            }
                            for (var k = 0; k < $scope.mandatoryGroupFeatures.length; k++) {
                                var singleGroup = $scope.mandatoryGroupFeatures[k];
                                for (var l = 0; l < singleGroup.Products.length; l++) {
                                    if (singleGroup.Products[l].Id == item.plans.mandatoryFeatures[i].parentFeature.id) {
                                        $scope.selectedGroupFeature = {
                                            groupId: $scope.mandatoryGroupFeatures[k].groupId,
                                            id: $scope.mandatoryGroupFeatures[k].Products[l].Id,
                                            names: $scope.mandatoryGroupFeatures[k].Products[l].Names,
                                            purchaseOptionId: $scope.mandatoryGroupFeatures[k].Products[l].PurchaseOption.Id,
                                            price: $scope.mandatoryGroupFeatures[k].Products[l].PurchaseOption.Amount,
                                            isGroup: true
                                        };
                                        break;
                                    }
                                }
                            }
                        } else {
                            $scope.ContainsMandatorySpecifiedFeatures = true;
                            for (var m = 0; m < $scope.Order.ItemPlan.MandatorySpecifiedFeatures.length; m++) {
                                $scope.mandatorySpecifiedFeatures.push({
                                    id: $scope.Order.ItemPlan.MandatorySpecifiedFeatures[m].Product.Id,
                                    names: $scope.Order.ItemPlan.MandatorySpecifiedFeatures[m].Product.Names,
                                    purchaseOptionId: $scope.Order.ItemPlan.MandatorySpecifiedFeatures[m].Product.PurchaseOption.Id,
                                    price: $scope.Order.ItemPlan.MandatorySpecifiedFeatures[m].Product.PurchaseOption.Amount,
                                    isGroup: false
                                });
                            }

                        }

                    }
                }
                if ($scope.HasDevice) {
                    var selectedDeviceId = item.device.id;
                    //get device quantity
                    $scope.phoneimagebase64 = item.device.image;
                    for (var o = 0; o < $scope.DeviceSpecs.length; o++) {
                        if (selectedDeviceId == $scope.DeviceSpecs[o].DeviceId) {
                            var qty = $scope.DeviceSpecs[o].DeviceStock;
                            if (qty > 0) {
                                $scope.isNotOutOfStock = true;
                            } else {
                                $scope.isNotOutOfStock = false;
                            }

                            var deviceSpecs = $scope.DeviceSpecs[o].DeviceSpecification;
                            var image = deviceSpecs.ImageUrl
                            if (image != null) {
                                for (var p = 0; p < $scope.DeviceImages.length; p++) {
                                    if (selectedDeviceId == $scope.DeviceImages[p].DeviceId) {
                                        $scope.phoneimagebase64 = "data:image/jpeg;base64, " + $scope.DeviceImages[p].base64File;
                                    } else {
                                        $scope.phoneimagebase64 = "../../../../../Images/empty-image.png";
                                    }
                                }
                            } else {
                                $scope.phoneimagebase64 = "../../../../../Images/empty-image.png";
                            }

                            $scope.deviceSeries = deviceSpecs.Brand + " " + deviceSpecs.ModelNumber;
                            $scope.deviceColor = deviceSpecs.Color;
                            $scope.deviceDescription = deviceSpecs.Description;
                            $scope.deviceOS = deviceSpecs.OperationSystem;
                            $scope.deviceStorage = deviceSpecs.Storage;
                            $scope.deviceSKU = deviceSpecs.SKU;
                            $scope.deviceFrontCamera = deviceSpecs.FrontCamera != null ? (deviceSpecs.FrontCamera) : "-";
                            $scope.deviceBackCamera = deviceSpecs.BackCamera != null ? (deviceSpecs.BackCamera) : "-";

                        }
                    }
                }
                if (Object.keys(item.otherProd).length > 0) {
                    $scope.otherProd = item.otherProd;
                    $scope.HasOtherProd = true;
                    for (var r = 0; r < item.otherProd.length; r++) {
                        if (item.otherProd[r].type === "bucket") {
                            $scope.selectedBuckets.push(item.otherProd[r]);
                        }
                    }
                } else {
                    $scope.HasOtherProd = false;
                }

                if (item.plans.optFeatures.length > 0) {
                    $scope.HasOptFeatures = true;
                } else {
                    $scope.HasOptFeatures = false;
                }

                //if ($rootScope.AllowanceCashCard !== undefined && $rootScope.AllowanceCashCard !== null) {
                //    $scope.HasAllowanceCashCards = true;
                //    $scope.Order.AllowanceCashCard = $rootScope.AllowanceCashCard.Products;
                //} else {
                //    $scope.HasAllowanceCashCards = false;

                //}

                var i;
                for (i = 0; i < $scope.Order.Plan.length; i++) {
                    if ($scope.Order.Plan[i].Id == item.plans.id) {
                        $scope.Order.Devices = $scope.Order.Plan[i].Devices;
                        $scope.Order.OtherProducts = $scope.Order.Plan[i].OtherProducts;
                        $scope.Order.OptionalGroupFeatures = $scope.Order.Plan[i].OptionalGroupFeatures;
                        $scope.Order.OptionalSpecifiedFeatures = $scope.Order.Plan[i].OptionalSpecifiedFeatures;
                        $scope.Order.CashCards = $scope.Order.Plan[i].CashCards;
                        $scope.Order.Buckets = $scope.Order.Plan[i].Buckets;
                        $scope.Order.AllowanceCashCard = $scope.Order.Plan[i].AllowanceCashCards;
                        $scope.HasGroupFeatures = ($scope.Order.Plan[i].OptionalGroupFeatures.length > 0 ? true : false);
                        $scope.HasSpecifiedFeatures = ($scope.Order.Plan[i].OptionalSpecifiedFeatures.length > 0 ? true : false);
                        break;
                    }
                }

                for (var s = 0; s < $scope.Order.Devices.Products.length; s++) {
                    for (var t = 0; t < $scope.DeviceImages.length; t++) {
                        if ($scope.Order.Devices.Products[s].Id == $scope.DeviceImages[t].DeviceId) {
                            if ($scope.DeviceImages[t].base64File !== null) {
                                $scope.Order.Devices.Products[s].Image = "data:image/jpeg;base64, " + $scope.DeviceImages[t].base64File;
                            } else {
                                $scope.Order.Devices.Products[s].Image = "../../../../../Images/empty-image.png";
                            }
                        }
                    }
                }

                if ($scope.Order.Buckets.length > 0) {
                    $scope.HasBuckets = true;
                } else {
                    $scope.HasBuckets = false;
                }

                if ($scope.Order.CashCards.length > 0) {
                    $scope.HasCashCards = true;
                } else {
                    $scope.HasCashCards = false;
                }
                if ($scope.Order.AllowanceCashCard.length > 0) {
                    $scope.HasAllowanceCashCards = true;
                } else {
                    $scope.HasAllowanceCashCards = false;
                }
                $scope.IsUpdatingCart = true;
                $("#publicPlan").show(200);
                if (item.isByod === true) {
                    $scope.isByod = true;
                    $("form[name=byodForm]").ready(function () {
                        $scope.Order.BYOD.Mvno = item.ByodInfo.Carrier;
                        $scope.Order.BYOD.IMEI = item.ByodInfo.DeviceSerialNumber;
                    });
                    $("#byodForm_btn_submit_1").prop("disabled",true);
                } else {
                    $scope.isByod = false;
                }
                $('html, body').animate({
                    scrollTop: $("#publicPlan").offset().top
                }, 1500).promise().done(function () {
                    $(".more-devices").slick({
                        slidesToShow: 4,
                        slidesToScroll: 1,
                        infinite: false,
                        arrows: false,
                        slide: '.related-item',
                        responsive: [
                            {
                                breakpoint: 1024,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 800,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 640,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 390,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }

                        ]

                    });

                    $(".more-devices").resize();
                    $("#publicPlanBtn_" + item.plans.id).prop('disabled', true);
                    $("#publicPlanDesc").show(300);
                    if (item.isByod !== true) {
                        $("#publicChooseDeviceBtn").hide();
                        $("#publicChooseDeviceBtn").trigger("click");
                        $(".device-list").resize();
                        $('#publicDeviceDesc').show(200);
                        $(".device-slide").slick({
                            arrows: false,
                            infinite: false,
                            speed: 300,
                            slidesToShow: 1,
                            autoplay: true
                        });
                        $(".device-slide").resize();
                    }
                    if ($scope.HasOtherProd||$scope.HasCashCards) {
                        $('#publicDispOtherProd').show();
                        setTimeout(function () {
                            $(".moreProducts").slick({
                                arrows: true,
                                infinite: true,
                                speed: 300,
                                slidesToShow: 3,
                                autoplay: false,
                                autoplaySpeed: 3000
                            });
                        }, 0);
                        $(".moreProducts").resize();

                        for (var q = 0; q < item.cashCards.length; q++) {
                            var groupId = item.cashCards[q].groupId;
                            var cashId = item.cashCards[q].id;
                            var textfield = $("#qty_" + groupId + "_" + cashId);

                            var currentQty = textfield.val();
                            var updatedQty = parseFloat(currentQty) + parseFloat(item.cashCards[q].qty);
                            textfield.val(updatedQty);
                        }

                    }
                    if ($scope.HasAllowanceCashCards) {
                        for (var q = 0; q < item.AllowanceCashCard.length; q++) {
                            var id = item.AllowanceCashCard[q].id;
                            var textfield = $("#qtyallowancecash_" + id);

                            var currentQty = textfield.val();
                            var updatedQty = parseFloat(currentQty) + parseFloat(item.cashCards[q].qty);
                            textfield.val(updatedQty);
                        }
                    }
                    $("#numberOption").show();
                    if (item.isPortIn === true) {
                        $("#radioTransferNumberYes").prop("checked", true);
                        $("#portInRequestForm").show(300);
                        $scope.Order.PortIn.Mdn = item.PortInRequest.MobileNumber;
                        $scope.Order.PortIn.Pin = item.PortInRequest.PIN;
                        $scope.Order.PortIn.ZipCode = item.PortInRequest.ZipCode;
                        $scope.transferNumber = true;
                        $scope.isPortIn = true;
                        $scope.$apply();
                    } else {
                        $("#radioTransferNumberNo").prop("checked", true);
                        $scope.transferNumber = false;
                        $scope.isPortIn = false;
                    }
                    if (item.isByod === true) {
                        $("#byodForm_btn_submit_1").prop("disabled", true);
                    }
                });

            }
        } else {
            if (item !== undefined && Object.keys(item).length > 0) {
                $scope.isParent = item.isParent;
                if (Object.keys(item.device).length > 0) {
                    $scope.device = item.device;
                    $scope.HasDevice = true;
                } else {
                    $scope.HasDevice = false;
                }
                $scope.updateId = item.id;
                $scope.plans = item.plans;
                if (Object.keys(item.otherProd).length > 0) {
                    $scope.otherProd = item.otherProd;
                    $scope.HasOtherProd = true;
                } else {
                    $scope.HasOtherProd = false;
                }
                // get devices & other products
                var i;
                for (i = 0; i < $scope.Order.Plan.length; i++) {
                    if ($scope.Order.Plan[i].Id == item.plans.id) {
                        $scope.Order.Devices = $scope.Order.Plan[i].Devices;
                        $scope.Order.OtherProducts = $scope.Order.Plan[i].OtherProducts;
                        break;
                    }
                }
                $scope.IsUpdatingCart = true;
            }
        }
    });



    $scope.hideAccordion = function () {
        $("tr[name=planAccordion]").hide();
    };

    $scope.hideChildAccordion = function () {
        $("tr[name=childGroupAccordion]").hide();
    };

    if ($scope.Order.SelectedOtherProducts == undefined) {
        $scope.Order.SelectedOtherProducts = [];
    }

    if ($scope.optFeatures == undefined) {
        $scope.optFeatures = [];
    }

    if ($scope.Order.SelectedOptionalSpecifiedFeature == undefined) {
        $scope.Order.SelectedOptionalSpecifiedFeature = [];
    }

    if ($scope.Order.SelectedMandatorySpecifiedFeature == undefined) {
        $scope.Order.SelectedMandatorySpecifiedFeature = [];
    }

    $scope.$watch("plan", function (obj) {
        if (obj !== undefined) {
            if (obj.Products.length > 0) {
                $scope.DisplayNullProductMessage = false;
                $scope.DisplayProductsCatalog = true;
                $scope.Order.Plan = [];


                var productType = CommonEnum.getProductTypeEnum();
                // get plan and optional feature
                for (var i = 0; i < $rootScope.plan.Products.length; i++) {
                    var mandatorySpecifiedFeatures = [];
                    var mandatoryGroupFeatures = [];
                    var mandatoryGroupObj= {
                        Id: "",
                        Names: "",
                        Descriptions: "",
                        Products: [],
                        MaxValue:""
                    }
                    var optionalSpecifiedFeatures = [];
                    var optionalGroupFeatures = [];
                    var optionalGroupObj = {
                        Id: "",
                        Names: "",
                        Descriptions: "",
                        Products: []
                    };
                    var devices = {};
                    var optionalProducts = [];
                    var buckets = [];
                    var cashcards = [];
                    var allowanceCashCards = [];
                    //checking mandatory group features
                    if ($rootScope.plan.Products[i].MandatoryProducts !== undefined && $rootScope.plan.Products[i].MandatoryProducts.length > 0) {
                        for (var k = 0; k < $rootScope.plan.Products[i].MandatoryProducts.length; k++) {
                            if ($rootScope.plan.Products[i].MandatoryProducts[k].GroupId !== undefined) {
                                mandatoryGroupObj.Id = $rootScope.plan.Products[i].MandatoryProducts[k].Id;
                                mandatoryGroupObj.Names = $rootScope.plan.Products[i].MandatoryProducts[k].Names;
                                mandatoryGroupObj.Descriptions = $rootScope.plan.Products[i].MandatoryProducts[k].Descriptions;
                                mandatoryGroupObj.MaxValue = $rootScope.plan.Products[i].MandatoryProducts[k].MaxValue;
                                mandatoryGroupObj.Products = $rootScope.plan.Products[i].MandatoryProducts[k].Products;
                                mandatoryGroupFeatures.push(mandatoryGroupObj);
                            } else { //specified features
                                mandatorySpecifiedFeatures.push($rootScope.plan.Products[i].MandatoryProducts[k]);
                            }
                        }
                    }

                    //checking optional feature
                    if ($rootScope.plan.Products[i].OptionalProducts !== undefined && $rootScope.plan.Products[i].OptionalProducts.length > 0) {
                        for (j = 0; j < $rootScope.plan.Products[i].OptionalProducts.length; j++) {
                            //checking group product offering
                            if ($rootScope.plan.Products[i].OptionalProducts[j].GroupId !== undefined) {
                                optionalGroupObj.Id = $rootScope.plan.Products[i].OptionalProducts[j].Id;
                                optionalGroupObj.Names = $rootScope.plan.Products[i].OptionalProducts[j].Names;
                                optionalGroupObj.Descriptions = $rootScope.plan.Products[i].OptionalProducts[j].Descriptions;
                                for (k = 0; k < $rootScope.plan.Products[i].OptionalProducts[j].Products.length; k++) {
                                     //whether feature?
                                    if ($rootScope.plan.Products[i].OptionalProducts[j].Products[k].Detail.ProductType == productType.Feature) {
                                        optionalGroupObj.Products = $rootScope.plan.Products[i].OptionalProducts[j].Products;
                                        optionalGroupFeatures.push(optionalGroupObj);
                                        break;
                                    } else if ($rootScope.plan.Products[i].OptionalProducts[j].Products[k].Detail.ProductType == productType.Allowance) {
                                        buckets.push($rootScope.plan.Products[i].OptionalProducts[j]);
                                        break;
                                    } else if ($rootScope.plan.Products[i].OptionalProducts[j].Products[k].Detail.ProductType == productType.MoneteryCashCard) {
                                        cashcards.push($rootScope.plan.Products[i].OptionalProducts[j]);
                                        break;
                                    } else if ($rootScope.plan.Products[i].OptionalProducts[j].Products[k].Detail.ProductType == productType.AllowanceCashCard) {
                                        allowanceCashCards.push($rootScope.plan.Products[i].OptionalProducts[j]);
                                        break;
                                    }else{
                                        optionalProducts.push($rootScope.plan.Products[i].OptionalProducts[j]);
                                    }
                                }
                            } else {
                                if ($rootScope.plan.Products[i].OptionalProducts[j].Product.Detail.ProductType == productType.Feature) {
                                    optionalSpecifiedFeatures.push($rootScope.plan.Products[i].OptionalProducts[j]);
                                } else if ($rootScope.plan.Products[i].OptionalProducts[j].Product.Detail.ProductType == productType.Allowance) {
                                    buckets.push($rootScope.plan.Products[i].OptionalProducts[j]);
                                } else if ($rootScope.plan.Products[i].OptionalProducts[j].Product.Detail.ProductType == productType.MoneteryCashCard) {
                                    cashcards.push($rootScope.plan.Products[i].OptionalProducts[j]);
                                } else if ($rootScope.plan.Products[i].OptionalProducts[j].Products[k].Detail.ProductType == productType.AllowanceCashCard) {
                                    allowanceCashCards.push($rootScope.plan.Products[i].OptionalProducts[j]);
                               } else {
                                    optionalProducts.push($rootScope.plan.Products[i].OptionalProducts[j]);
                                }
                            }
                        }
                    }



                    // get devices
                    if ($rootScope.plan.Products[i].DevicesAndAccecories !== undefined && $rootScope.plan.Products[i].DevicesAndAccecories.length > 0) {
                        devices = $rootScope.plan.Products[i].DevicesAndAccecories[0];
                    }

                    $scope.Order.ItemPlan = {
                        Id: $rootScope.plan.Products[i].Id,
                        Names: $rootScope.plan.Products[i].Names,
                        Descriptions: $rootScope.plan.Products[i].Detail.Descriptions,
                        PurchaseOptionId: $rootScope.plan.Products[i].PurchaseOption.Id,
                        Price: parseFloat($rootScope.plan.Products[i].PurchaseOption.Amount) + parseFloat($rootScope.plan.Products[i].PurchaseOption.SetupFee),
                        MandatoryGroupFeatures: mandatoryGroupFeatures,
                        MandatorySpecifiedFeatures: mandatorySpecifiedFeatures,
                        OptionalGroupFeatures: optionalGroupFeatures,
                        OptionalSpecifiedFeatures: optionalSpecifiedFeatures,
                        HasOptionalGroupFeatures: (optionalGroupFeatures.length > 0 ? true : false),
                        HasOptionalSpecifiedFeatures: (optionalSpecifiedFeatures.length > 0 ? true : false),
                        HasMandatoryGroupFeatures: (mandatoryGroupFeatures.length > 0 ? true : false),
                        HasMandatorySpecifiedFeatures: (mandatorySpecifiedFeatures.length > 0 ? true : false),
                        Devices: devices,
                        OtherProducts: optionalProducts,
                        Buckets: buckets,
                        CashCards: cashcards,
                        AllowanceCashCards: allowanceCashCards,
                        HasBuckets: (buckets.length > 0 ? true : false),
                        HasCashCards: (cashcards.length > 0 ? true : false)
                    };

                    //for (var l = 0; l < devices.Products; l++) {
                    //    if(devicesx)
                    //}

                    if (Object.getOwnPropertyNames(devices).length>0&&devices.GroupId!==undefined) {
                        $scope.Order.Plan.push($scope.Order.ItemPlan);
                    }
                }
                setTimeout(function () {
                    $(".more-devices").on('init', function () {
                        $('.more-devices').fadeIn(3000);
                    }).slick({
                        slidesToShow: 4,
                        slidesToScroll: 1,
                        infinite: false,
                        arrows: true,
                        slide: '.related-item',
                        responsive: [
                            {
                                breakpoint: 1024,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 800,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 640,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 390,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }

                        ]

                    });

                    $(".more-devices").resize();
                }, 0);
            } else {
                $scope.DisplayNullProductMessage = true;
                $scope.DisplayProductsCatalog = false;
            }
        } else {
            $scope.DisplayNullProductMessage = false;
            $scope.DisplayProductsCatalog = false;
        }


    });


    $scope.$watch("isHasCartSession", function (x) {
        if (x !== undefined) {
            if (x === false) {
                $scope.isNotCompatible = true;
            } else {
                $scope.isNotCompatible = false;
            }
        } else {
            $scope.isNotCompatible = true;
        }

    });

    $scope.$watch("otherProd", function (item) {
        if (item !== undefined && item.length > 0) {
            var amount = 0;
            var i;
            for (i = 0; i < item.length; i++) {
                amount += item.price;
            }
            $scope.TotalAmount = '$' + ($scope.plans.price + $scope.device.price + amount);
        }
    });

    $scope.$watch("device", function (item) {
        if (Object.keys(item).length > 0) {
            $scope.TotalAmount = '$' + (item.price + $scope.plans.price);
        }
    });


    $scope.$watch("plans", function (plans) {
        if (Object.keys(plans).length > 0) {
            $scope.hasPlans = true;
            var devicePrice = 0;
            if ($scope.device !== undefined && $scope.device.price !== undefined) {
                devicePrice = $scope.device.price;
            }
            $scope.TotalAmount = '$' + (plans.price + devicePrice);
        } else {
            $scope.isNotCompatible = true;
            $scope.hasPlans = false;
        }

    });


    if ($scope.Order.SelectedOtherProducts.length > 0) {
        var i;
        var j;
        var id;
        for (i = 0; i < $("input[type=checkbox]").length ; i++) {
            for (j = 0; j < $scope.Order.SelectedOtherProducts.length; j++) {
                if ($("input[type=checkbox]")[0].value == $scope.Order.SelectedOtherProducts[j]) {
                    id = $("input[type=checkbox]")[0].id;
                    $('#' + id).prop('checked', true);
                    break;
                }
            }
        }
    }



    $(document).on('change', '#cbOptionalGroupFeatures', function () {
        var value = $(this).val();
        var valArr = value.split("|");
        var price = valArr[0];
        var descriptions = valArr[1];
        if ($scope.Order.SelectedOptionalGroupFeature === undefined) {
            $scope.Order.SelectedOptionalGroupFeature = [];
        }
        $scope.Order.SelectedOptionalGroupFeature = [
            {
                Id: $(this).find('option:selected').attr('id'),
                Price: price,
                Description: descriptions
            }
        ];

        if (value !== "") {
            $("#optionalfeature_description").val(descriptions + " -- $" + price);
        } else {
            $("#optionalfeature_description").val("");
        }

    });


    $(document).on('change', 'input[name=optionalGroupFeatureCb]', function () {
        var value = $(this).val();
        var valArr = value.split("|");
        var idx = valArr[0];
        var products = JSON.parse(valArr[1]);
        if ($(this).is(':checked')) {

            $("tr[name=childGroupAccordion]").hide(100);
            $("#childGroupAccordion_" + idx).show(100);

        } else {
            var i;
            var removeItem;
            for (i = 0; i < products.length; i++) {
                removeItem = products[i].Id;
                $scope.plans.optFeatures = jQuery.grep($scope.plans.optFeatures, function (value) {
                    return value.id != removeItem;
                });
            }
            $('input[name=childGroupFeatureCb]').removeAttr('checked');
            $("#childGroupAccordion_" + idx).hide(100);

        }
    });

    $(document).on('change', 'input[name="optionalFeatureCb"]', function () {
        var value = $(this).val();
        var valArr = value.split("|");
        var id = valArr[0];
        var name = valArr[1];
        var purchaseOptionId = valArr[2];
        var price = valArr[3];
        if ($(this).is(':checked')) {
            if (!$scope.plans.optFeatures.filter(function (e) { return e.id == id; }).length > 0) {
                $scope.plans.optFeatures.push(
                {
                    "id": id,
                    "names": name,
                    "purchaseOptionId": purchaseOptionId,
                    "price": price
                });
            }

        } else {
            var removeItem = id;
            $scope.plans.optFeatures = jQuery.grep($scope.plans.optFeatures, function (value) {
                return value.id != removeItem;
            });

        }
    });

    $(document).on('change', 'input[name="childGroupFeatureCb"]', function () {
        var value = $(this).val();
        var valArr = value.split("|");
        var id = valArr[0];
        var name = valArr[1];
        var purchaseOptionId = valArr[2];
        var price = valArr[3];
        if ($(this).is(':checked')) {
            if (!$scope.plans.optFeatures.filter(function (e) { return e.id == id; }).length > 0) {
                $scope.plans.optFeatures.push(
                {
                    "id": id,
                    "names": name,
                    "purchaseOptionId": purchaseOptionId,
                    "price": price
                });
            }

        } else {
            var removeItem = id;
            $scope.plans.optFeatures = jQuery.grep($scope.plans.optFeatures, function (value) {
                return value.id != removeItem;
            });

        }
    });

    $(document).on('change', 'input[name=otherproduct_checkbox]', function () {
        var value = $(this).val();
        var valArr = value.split("|");
        var id = valArr[0];
        var name = valArr[1];
        var purchaseOptionId = valArr[2];
        var price = valArr[3];
        if ($(this).is(':checked')) {
            if (!$scope.otherProd.filter(function (e) { return e.Id == id; }).length > 0) {
                $scope.otherProd.push({
                    "id": id,
                    "names": name,
                    "purchaseOptionId": purchaseOptionId,
                    "price": price
                });
            }

        } else {
            var removeItem = id;
            $scope.otherProd = jQuery.grep($scope.otherProd, function (value) {
                return value.Id != removeItem;
            });
        }
    });

    $scope.cbInit = function (id) {
        var i;
        var isMatched = false;
        for (i = 0; i < $scope.Order.SelectedOtherProducts.length ; i++) {
            if (id == $scope.Order.SelectedOtherProducts[i].Id) {
                isMatched = true;
                break;
            }
        }
        return isMatched;
    };

    $(document).on('change', 'input[name=optionalFeatureList]', function () {
        var value = $(this).val();
        var valArr = value.split("|");
        var id = valArr[0];
        var price = valArr[1];
        var desc = valArr[2];

        if ($(this).is(':checked')) {
            if (!$scope.Order.SelectedOptionalSpecifiedFeature.filter(function (e) { return e.Id == id; }).length > 0) {
                $scope.Order.SelectedOptionalSpecifiedFeature.push(
                {
                    "Id": id,
                    "Price": price,
                    "Description": desc

                });
            }

        } else {
            var removeItem = id;
            $scope.Order.SelectedOptionalSpecifiedFeature = jQuery.grep($scope.Order.SelectedOptionalSpecifiedFeature, function (value) {
                return value.Id != removeItem;
            });
        }
    });

    $(document).on('change', 'input[name=mandatorySpecifiedFeatureList]', function () {
        var value = $(this).val();
        var valArr = value.split("|");
        var id = valArr[0];
        var price = valArr[1];
        var desc = valArr[2];

        if ($(this).is(':checked')) {
            if (!$scope.Order.SelectedMandatorySpecifiedFeature.filter(function (e) { return e.Id == id; }).length > 0) {
                $scope.Order.SelectedMandatorySpecifiedFeature.push(
                {
                    "Id": id,
                    "Price": price,
                    "Description": desc
                });
            }

        } else {
            var removeItem = id;
            $scope.Order.SelectedMandatorySpecifiedFeature = jQuery.grep($scope.Order.SelectedMandatorySpecifiedFeature, function (value) {
                return value.Id != removeItem;
            });
        }
    });

    $scope.selectedRow = null;
    $scope.setClickedRow = function (item, flg, index) {
        switch (flg) {
            case "plan":
                $scope.device = {};
                $scope.otherProd = [];
                $scope.TotalAmount = 0;
                $scope.mandatoryFeatures = [];
                var i;
                var j;
                for (i = 0; i < item.MandatoryFeatures.length; i++) {
                    if (item.MandatoryFeatures[i].GroupId !== undefined) {
                        for (j = 0; j < item.MandatoryFeatures[i].Products.length; j++) {
                            $scope.mandatoryFeatures.push({
                                id: item.MandatoryFeatures[i].Products[j].Id,
                                names: item.MandatoryFeatures[i].Products[j].Names,
                                purchaseOptionId: item.MandatoryFeatures[i].Products[j].PurchaseOption.Id,
                                price: parseFloat(item.MandatoryFeatures[i].Products[j].PurchaseOption.Amount) + parseFloat(item.MandatoryFeatures[i].Products[j].PurchaseOption.SetupFee)
                            });
                        }
                    } else {
                        $scope.mandatoryFeatures.push({
                            id: item.MandatoryFeatures[i].Product.Id,
                            names: item.MandatoryFeatures[i].Product.Names,
                            purchaseOptionId: item.MandatoryFeatures[i].Product.PurchaseOption.Id,
                            price: parseFloat(item.MandatoryFeatures[i].Product.PurchaseOption.Amount) + parseFloat(item.MandatoryFeatures[i].Product.PurchaseOption.SetupFee)
                        });
                    }
                }

                $scope.plans = {
                    id: item.Id,
                    names: item.Names,
                    purchaseOptionId: item.PurchaseOptionId,
                    price: item.Price,
                    mandatoryFeatures: $scope.mandatoryFeatures,
                    optFeatures: []
                };
                $scope.Order.Devices = item.Devices;
                $scope.Order.OtherProduct = item.OtherProducts;
                $scope.featureStatusIdx = index;
                $("button[name=planInfoBtn]").prop('disabled', true);
                $("#planInfoBtn_" + index).removeAttr("disabled");
                $("tr[name=planAccordion]").hide(100);
                $("#planAccordion_" + index).show(100);
                $("#planInfoBtn_" + index).popover();

                $scope.HasDevice = (item.Devices.length > 0 ? true : false);
                $scope.HasOtherProd = (item.OtherProducts.length > 0 ? true : false);
                break;
            case "device":
                $scope.device = {
                    "id": item.Product.Id,
                    "names": item.Product.Names,
                    "PurchaseOptionId": item.Product.PurchaseOption.Id,
                    "price": item.Product.PurchaseOption.Amount
                };
                $("button[name=deviceInfo]").prop('disabled', true);
                $("#deviceInfo_" + index).removeAttr("disabled");
                break;
        };

        $scope.isNotCompatible = false;
    };

    $scope.pushToCart = function () {
        $scope.cashCards = [];
        var PortInReq = {};
        var byodInfo = {};
        var listCashCards = [];
        if ($scope.isPortIn === true) {
            PortInReq = {
                MobileNumber: $scope.Order.PortIn.Mdn,
                PIN: $scope.Order.PortIn.Pin,
                ZipCode: $scope.Order.PortIn.ZipCode
            };
        }
        if ($scope.isByod === true) {
            byodInfo = {
                Carrier: $scope.Order.BYOD.Mvno,
                DeviceSerialNumber:$scope.Order.BYOD.IMEI
            }
        }
        //check cashcard
        var cashCardList = $scope.Order.CashCards;
        for (var k = 0; k < cashCardList.length; k++) {
            var groupId = cashCardList[k].GroupId;
            for (var l = 0; l < cashCardList[k].Products.length; l++) {
                var cashId = cashCardList[k].Products[l].Id;
                var textfield = $("#qty_" + groupId + "_" + cashId);
                var orderedCashCardQty = textfield.val();
                if (orderedCashCardQty > 0) {
                    $scope.cashCards.push({
                        id: cashId,
                        qty: orderedCashCardQty,
                        price: (parseFloat(cashCardList[k].Products[l].PurchaseOption.Amount) + parseFloat(cashCardList[k].Products[l].PurchaseOption.SetupFee)) * parseFloat(orderedCashCardQty),
                        purchaseOptionId: cashCardList[k].Products[l].PurchaseOption.Id,
                        names: cashCardList[k].Products[l].Names,
                        descriptions: cashCardList[k].Products[l].Descriptions,
                        groupId:groupId
                    });
                }
            }
       
        }

        //check allowance cash cards
        var allowanceCashCardList = $scope.Order.AllowanceCashCard;
        for (var m = 0; m < allowanceCashCardList.length; m++) {
            var id = allowanceCashCardList[m].Id;
            var textfield = $("#qtyallowancecash_" + id);
            var orderedQty = textfield.val();
            if (orderedQty > 0) {
                $scope.selectedAllowanceCashCard.push({
                    id: id,
                    qty: orderedQty,
                    price: (parseFloat(allowanceCashCardList[m].PurchaseOption.Amount) + parseFloat(allowanceCashCardList[m].PurchaseOption.Amount)) * parseFloat(orderedQty),
                    purchaseOptionId: allowanceCashCardList[m].PurchaseOption.Id,
                    names: allowanceCashCardList[m].Names,
                    descriptions: allowanceCashCardList[m].Descriptions
                });
            }
        }

        $scope.Cart.CartList.push({
            id: GenerateGuid(),
            device: $scope.device,
            plans: $scope.plans,
            cashCards: $scope.cashCards,
            otherProd: $scope.otherProd,
            isByod: $scope.isByod,
            isPortIn: $scope.isPortIn,
            PortInRequest: PortInReq,
            ByodInfo: byodInfo,
            AllowanceCashCard:$scope.selectedAllowanceCashCard
        });
    }

    $scope.checkShoppingCartSession = function() {
        if (ShoppingCartService.IsHasShoppingCartSessionId()) {
            var obj = JSON.parse(localStorage.ShoppingCartSession);
            if ($scope.cartItemCount > 0 && $scope.IsUpdatingCart) {
                // is update cart
                var removeItem = $scope.updateId;
                $scope.Cart.CartList = jQuery.grep($scope.Cart.CartList, function (value) {
                    return value.id != removeItem;
                });
                $scope.pushToCart();
            } else {
                // add more cart
                if ($scope.Cart.CartList === undefined) {
                    $scope.Cart.CartList = [];
                }
                $scope.pushToCart();
            }
            var dat = {
                SessionId: obj.SessionId,
                CreationDate: obj.CreationDate,
                CustomerCart: $scope.Cart.CartList
            };
            CreateShoppingCartService.save(dat, function (result) {
                if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                    if (typeof result.ListOfRelationsNotSatisfied == "undefined") {
                        $scope.ChangeCRPage('shoppingCart');
                    } else {
                        Notification.error({
                            message: '<p>Selected Item Configuration is not right / Missing some items</p>',
                            positionY: 'top',
                            positionX: 'center',
                            title: "<span><h4 style='color: white;'>Wrong Item Configuration</h4></span>"
                        });
                    }
                }
            }, function (error) {
                $scope.ChangeCRPage('shoppingCart');
            });
        }
    }

    $scope.proceedToPortInCheck = function () {
        if ($scope.transferNumber != undefined || $scope.transferNumber != null) {
            if ($scope.transferNumber === true && $scope.Order.PortIn === undefined) {
                Notification.error({
                    message: '<p>Please Input The Transfer Number Form first</p>',
                    positionY: 'top',
                    positionX: 'center',
                    title: "<span ><h4 style='color: white;'>Missing selected item</h4></span>"
                });
            } else {
                $scope.checkShoppingCartSession();
            }
        } else {
            if ($scope.cartItemCount > 0 && !$scope.IsUpdatingCart) {
                $scope.ChangeCRPage('shoppingCart');
            } else {
                Notification.error({
                    message: '<p>Please select The Number Option first</p>',
                    positionY: 'top',
                    positionX: 'center',
                    title: "<span ><h4 style='color: white;'>Missing selected item</h4></span>"
                });
            }
        }
    }
    $scope.createShoppingCartSession = function () {
            $scope.cartItemCount = ($scope.Cart.CartList === undefined ? 0 : $scope.Cart.CartList.length);
            if ($scope.plans != undefined && Object.keys($scope.plans).length > 0 && $scope.plans.id !== "") {
                if ($scope.isByod === true) {
                    $scope.device = {};
                    if ($scope.isPortIn && $scope.validPortIn) {
                        $scope.proceedToPortInCheck();
                    } else {
                        $scope.checkShoppingCartSession();
                    }
                } else {
                    if (Object.keys($scope.device).length > 0 && $scope.device.id !== "") {
                        if ($scope.isPortIn && $scope.validPortIn) {
                            $scope.proceedToPortInCheck();
                        } else {
                            $scope.checkShoppingCartSession();
                        }
                    } else {
                        if ($scope.cartItemCount > 0 && !$scope.IsUpdatingCart) {
                            $scope.ChangeCRPage('shoppingCart');
                        } else {
                            Notification.error({
                                message: '<p>Please select Device first</p>',
                                positionY: 'top',
                                positionX: 'center',
                                title: "<span ><h4 style='color: white;'>Missing selected item</h4></span>"
                            });
                        }
                    }
                }
            } else {
                if ($scope.cartItemCount > 0 && !$scope.IsUpdatingCart) {
                    $scope.ChangeCRPage('shoppingCart');
                } else {
                    Notification.error({
                        message: '<p>Please select Plan first</p>',
                        positionY: 'top',
                        positionX: 'center',
                        title: "<span ><h4 style='color: white;'>Missing selected item</h4></span>"
                    });
                }
            }
    };
    $scope.$watch("Order.BuyDevice", function (x) {
        if (x === 'newDevice') {
            if ($scope.plans != undefined) {
                if (Object.keys($scope.plans).length > 0 && $scope.plans.id !== "") {
                    $scope.isNotCompatible = false;
                } else {
                    $scope.isNotCompatible = true;
                }
            } else {
                $scope.isNotCompatible = true;
            }
            $scope.isNewDevice = true;
            $scope.isOwnDevice = false;
            $scope.cantContinue = false;
        } else {
            $scope.isNewDevice = false;
            $scope.isOwnDevice = true;
            $scope.cantContinue = true;
            $scope.isNotCompatible = true;
        }
    });

    $scope.mvnoList = [{ name: 'Verizon', value: 1 }, { name: 'Vodafone', value: 2 }, { name: 'AT&T', value: 3 }, { name: 'Sprint', value: 4 }, { name: 'T-Mobile', value: 5 }];
    $scope.BYOD = {
        field: [
            {
                type: "text",
                name: "esnOrImei",
                size: 8,
                text: "IMEI",
                model: "Order.BYOD.IMEI",
                required: false,
                validation: false
            }
        ],
        button: [
            {
                name: "btnCheckDeviceCompatibility",
                type: "submit",
                text: "CheckCompatibility",
                click: "checkDeviceCompatibility()"
            }
        ]
    };

    $scope.checkDeviceCompatibility = function () {
        //var jsonData = {
        //    "OrderId": moment().format('YYMMDDHHmmss'),
        //    "EsnMeid": $scope.Order.BYOD.IMEI,
        //    "CustomerId": "13210029"
        //};
        $scope.validityResponse = true;
        $("#byodNotice").show();
        if ($scope.validityResponse === true) {
            RegistrationCache.getPlanByod('1020001005').then(function(data) {
                $rootScope.plan = angular.copy(data);
                $("#publicPlan").show(300);
                $("#byodForm_btn_submit_1").hide();
                $(".more-devices").resize();
                $('html, body').animate({
                    scrollTop: $("#publicPlan").offset().top
                }, 1000, function () {
                    $("#more-devices").resize();
                });
            });
           
        }
        //DeviceValidationService.save(jsonData, function (validityResponse) {
        //    if (ErrorHandlerUtility.IsResultTypeOK(validityResponse)) {
        //        Notification.success({
        //            message: '<p>Device Validation Success, Please continue registration process with click the Next button</p>',
        //            positionY: 'top',
        //            positionX: 'center'
        //        });
        //        $scope.cantContinue = false;
        //        $scope.buyNewDevice = false;
        //        $scope.isNotCompatible = false;
        //    } else {
        //        Notification.error({
        //            message: '<p>Device Validation Failed! ' + validityResponse.Messages[0] + '.</p>',
        //            positionY: 'top',
        //            positionX: 'center'
        //        });
        //        $scope.cantContinue = false; //this should be removed when the API already working properly. otherwise the next button will always be visible although the validation process failed
        //        $('input[name=otherproduct_checkbox]').removeAttr('checked');
        //        $scope.isNotCompatible = false;
        //    }

        //});
    };

    $scope.portInValidation = function () {
        var portInData = {};
        portInData= {
            "MobileNumber": $scope.Order.PortIn.Mdn,
            "CarrierId": $scope.Order.PortIn.Carrier.value
        }
        portInValidationService.save(portInData, function(portInValidation) {
            if (ErrorHandlerUtility.IsResultTypeOK(portInValidation) && portInValidation.IsEligible) {
                $scope.validPortIn = true;
            } else {
                Notification.error({
                    message: '<p>Device Validation Failed! ' + portInValidation.Messages[0] + '.</p>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }
        });
    };
    $scope.devicepaymentmethod = [{ name: 'Full Payment' }, { name: 'payment 2' }, { name: 'payment 3' }];

    $scope.Product = {
        field: [
            {
                type: "select",
                name: "Product",
                size: 12,
                text: "Products",
                model: "Order.Product",
                value: "OrderProduct",
                required: false,
                validation: false
            }
        ]
    };
    $scope.devicepayment = {
        field: [
            {
                type: "select",
                name: "DevicePayment",
                size: 8,
                text: "device_payment",
                model: "Order.DevicePayment",
                value: "devicepaymentmethod",
                required: true,
                validation: [{ value: "mandatory" }]
            }
        ]
    };
    $scope.CustomerType = {
        field: [
            {
                type: "radio",
                name: "CustomerType",
                size: 8,
                text: "customer_type",
                model: "Order.CustomerType",
                required: true,
                style: "horizontal",
                content: [{ text: "Private", value: 1 }, { text: "Business", value: 2 }],
                validation: [{ value: "mandatory" }]
            }
        ]
    };
    $scope.ServiceType = {
        field: [
            {
                type: "radio",
                name: "ServiceType",
                size: 8,
                text: "service_type",
                model: "Order.ServiceType",
                required: true,
                style: "horizontal",
                content: [{ text: "Pre-paid", value: 2 }, { text: "Post paid", value: 1 }, { text: "Hybrid", value: 3 }],
                validation: [{ value: "mandatory" }]
            }
        ]
    };
    $scope.BuyDevice = {
        field: [
            {
                type: "radio",
                name: "BuyDevice",
                size: 8,
                text: "buy_device",
                model: "Order.BuyDevice",
                required: true,
                style: "horizontal",
                content: [{ text: "Yes", value: "newDevice" }, { text: "No", value: "oldDevice" }]
            }
        ]
    };
    $scope.portInForm= {
        field: [
            {
                type: "select",
                name: "mvnoname",
                size: 8,
                value: "CarrierList",
                text: "Choose_your_carrier",
                model: "Order.PortIn.Carrier",
                required: false,
                validation: false
            },
            {
                type: "text",
                name: "portInMdn",
                size: 8,
                text: "Mobile_Number",
                model: "Order.PortIn.Mdn",
                required: false,
                validation: false
            },
            {
                type: "text",
                name: "portInPin",
                size: 8,
                text: "pin",
                model: "Order.PortIn.Pin",
                required: false,
                validation: false
            },
            {
                type: "text",
                name: "portInZipCode",
                size: 8,
                text: "Zip_Code",
                model: "Order.PortIn.ZipCode",
                required: false,
                validation: false
            }
        ],
        button: [
            {
                name: "btnValidatePortIn",
                type: "submit",
                text: "Validate",
                click: "portInValidation()"
            }
        ]
    }
})
