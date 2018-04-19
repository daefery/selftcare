SelfCareContent.controller("ManageServiceController", function ($scope, $filter, $timeout, $compile, BuyMoreCacheService, ShoppingFunction) {
    $scope.isChangePlan = false;

    $scope.start = function () {
        $scope.ExistingFeatureOption = undefined;
        $scope.ExistingFeatureMandatory = undefined;
        $scope.ExistingPlan = {};
        $scope.isExistPay = false;

        $scope.AvailablePlan = undefined;
        $scope.OptionalFeatures = undefined;
        $scope.totalMandatory = 0;
        $scope.totalOptional = 0;
        $scope.currentFeatureId = 0;
        $scope.currentMandatoryFeatureId = 0;
        $scope.currentPlan = {
            Id: 0
        }
        $scope.dataAddToChart = {};
        $scope.selectedOptional = [];
        $scope.featuresId = [];
        $scope.validshowOption = false;
        var PlanId = 0;
        var MandatoryId = [];
        var OptionalId = [];
        BuyMoreCacheService.getProduct({ msisdn: wrapper.activeDevice.Msisdn }).then(function (result) {

            /*** existing plan ***/

            var ext_arr_mandatory = [];
            var ext_arr_group_mandatory = [];
            var ext_arr_group_optional = [];
            var ext_arr_optional = [];
            var ext_features;
            var ext_isGroup = false;
            var ext_optional_json;
            var ext_mandatory_json;
            var isActive = false;
            $scope.existing = result.ExistingMainPlanServices.length > 0 ? angular.copy(result.ExistingMainPlanServices[0]) : null;
            PlanId = $scope.existing != null ? $scope.existing.Id: 0;
            $scope.cancelExisting = function () {
                $scope.existing = result.ExistingMainPlanServices.length > 0 ? angular.copy(result.ExistingMainPlanServices[0]) : null;
            }
            if ($scope.existing != null) {
                /* prepare mandatory and optional item feature */
                angular.forEach($scope.existing.Options, function (value, key) {
                    if (value.MinOccurs != 0)
                    {
                        angular.forEach(value, function (v, k) {
                            if (k == 'GroupId') {
                                ext_isGroup = true;
                            }
                        });

                        if (ext_isGroup) {
                            var pr = 0;
                            angular.forEach(value.ProductOfferingsInGroup, function (g_val, g_key) {
                                pr = pr + g_val.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                            });
                            angular.forEach(value.ProductOfferingsInGroup, function(g_val, g_key){
                                var t_group = {
                                    item:g_val,
                                    selected:false
                                }
                                if (g_val.IsActive) {
                                    isActive = true;
                                }
                                ext_arr_group_mandatory.push(t_group);
                            });
                            ext_mandatory_json = {
                                features: value,
                                items: ext_arr_group_mandatory,
                                isGroup:true,
                                price: pr,
                                isValid: isActive ? true : false
                            }
                            ext_arr_mandatory.push(ext_mandatory_json);
                            ext_arr_group_mandatory = [];
                        } else {
                            ext_mandatory_json = {
                                features: value.SpecifiedProductOffering,
                                items: [],
                                isGroup: false,
                                price: value.SpecifiedProductOffering.PurchaseOptions[0].Charges[0].Prices[0].Amount,
                                isValid: value.SpecifiedProductOffering.IsActive ? true : false
                            }
                            ext_arr_mandatory.push(ext_mandatory_json);
                            ext_arr_group_mandatory = [];
                        }
                        isActive = false;
                        ext_isGroup = false;
                    }
                    else
                    {
                        angular.forEach(value, function (v, k) {
                            if (k == 'GroupId') {
                                ext_isGroup = true;
                            }
                        });

                        if (ext_isGroup) {
                            var pr = 0;
                            angular.forEach(value.ProductOfferingsInGroup, function (g_val, g_key) {
                                pr = pr + g_val.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                            });
                            angular.forEach(value.ProductOfferingsInGroup, function (g_val, g_key) {
                                var t_group = {
                                    item: g_val,
                                    selected: false
                                }
                                if (g_val.IsActive) {
                                    isActive = true;
                                }
                                ext_arr_group_optional.push(t_group);
                            });
                            ext_optional_json = {
                                features: value,
                                items: ext_arr_group_optional,
                                isGroup: true,
                                price: pr,
                                isValid: isActive ? true : false
                            }
                            ext_arr_optional.push(ext_optional_json);
                            ext_arr_group_optional = [];
                        } else {
                            if (value.SpecifiedProductOffering.Product.ProductType != 7 && value.SpecifiedProductOffering.Product.ProductType != 6) {
                                ext_optional_json = {
                                    features: value.SpecifiedProductOffering,
                                    items: [],
                                    isGroup: false,
                                    price: value.SpecifiedProductOffering.PurchaseOptions[0].Charges[0].Prices[0].Amount,
                                    isValid: value.SpecifiedProductOffering.IsActive ? true : false
                                }
                                ext_arr_optional.push(ext_optional_json);
                            }
                        }
                        ext_isGroup = false;
                        isActive = false;
                    }
                });
                ext_features = {
                    mandatory:ext_arr_mandatory,
                    optional: ext_arr_optional
                }
                $scope.ExistingPlan = angular.copy(ext_features);
                /* assign prepared data to scope variable */
                $timeout(function () {
                    $scope.ExistingFeatureMandatory = ext_features.mandatory.length > 0 ? angular.copy(ext_features.mandatory) : undefined;
                    $scope.ExistingFeatureOption = ext_features.optional.length > 0 ? angular.copy(ext_features.optional) : undefined;
                    $scope.planName = $scope.existing.Names[0].Text;
                }, 0);
            }

            /* force select requirement */
            $scope.addItem = function (type, id, feature) {
                var count = 1;
                switch (type) {
                    //mandatory
                    case 0:
                        angular.forEach($scope.ExistingFeatureMandatory, function (val, key) {
                            if (val.isGroup) {
                                if (val.features.GroupId == feature.GroupId) {
                                    angular.forEach(val.items, function (item_val, item_key) {
                                        if (item_val.selected) {
                                            count = count + 1;
                                        }
                                    });
                                    angular.forEach(val.items, function (item_val, item_key) {
                                        if (count <= val.features.MaxOccurs) {
                                            if (item_val.item.Id == id)
                                                $scope.selectItemMandatory(item_val.item.Id, feature);
                                        } else {
                                            if (item_val.item.Id == id) {
                                                $scope.selectItemMandatory(item_val.item.Id, feature);
                                            } else {
                                                if (item_val.selected)
                                                    $scope.removeItemMandatory(item_val.item.Id, feature);
                                            }
                                        }
                                    });
                                }
                            }
                        });
                        count = 1;
                        break;
                    //optional
                    case 1:
                        angular.forEach($scope.ExistingFeatureOption, function (val, key) {
                            if (val.isGroup) {
                                if (val.features.GroupId == feature.GroupId) {
                                    angular.forEach(val.items, function (item_val, item_key) {
                                        if (item_val.selected) {
                                            count = count + 1;
                                        }
                                    });
                                    angular.forEach(val.items, function (item_val, item_key) {
                                        if (count <= val.features.MaxOccurs) {
                                            if (item_val.item.Id == id)
                                                $scope.selectItemOptional(item_val.item.Id, feature);
                                        } else {
                                            if (item_val.item.Id == id) {
                                                $scope.selectItemOptional(item_val.item.Id, feature);
                                            } else {
                                                if (item_val.selected) {
                                                    $scope.removeItemOptional(item_val.item.Id, feature);
                                                    count = count - 1;
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        });
                        count = 1;
                        break;
                }
            }

            /* logic select available mandatory feature*/
            $scope.selectItemMandatory = function (param, feature) {
                var i = 0;
                var j = 0;
                angular.forEach($scope.ExistingFeatureMandatory, function (val, key) {
                    if (val.features.GroupId == feature.GroupId) {
                        angular.forEach(val.items, function (item_val, item_key) {
                            if (item_val.item.Id == param) {
                                $scope.ExistingFeatureMandatory[i].items[j].selected = true;
                                $scope.totalMandatory = $scope.totalMandatory + item_val.item.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                                if (item_val.item.Options.length > 0)
                                {
                                    angular.forEach(item_val.item.Options, function (opt_val, opt_key) {
                                        $scope.totalMandatory = $scope.totalMandatory + opt_val.SpecifiedProductOffering.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                                    });
                                }
                            }
                            j++;
                        });
                    }
                    i++;
                });
                $scope.addIdExisting('mandatory');
            }

            /* logic remove available mandatory feature*/
            $scope.removeItemMandatory = function (param, feature) {
                var i = 0;
                var j = 0;
                angular.forEach($scope.ExistingFeatureMandatory, function (val, key) {
                    if (val.features.GroupId == feature.GroupId) {
                        angular.forEach(val.items, function (item_val, item_key) {
                            if (item_val.item.Id == param) {
                                $scope.ExistingFeatureMandatory[i].items[j].selected = false;
                                $scope.totalMandatory = $scope.totalMandatory - item_val.item.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                                if (item_val.item.Options.length > 0)
                                {
                                    angular.forEach(item_val.item.Options, function (opt_val, opt_key) {
                                        $scope.totalMandatory = $scope.totalMandatory - opt_val.SpecifiedProductOffering.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                                    });
                                }
                                
                            }
                            j++;
                        });
                    }
                    i++;
                });
                $scope.addIdExisting('mandatory');
            }

            /* logic select available optional feature*/
            $scope.addFeatureExisting = function (param) {
                var iopt = 0;
                angular.forEach($scope.ExistingFeatureOption, function (value, key) {
                    if (param.isGroup) {
                        if (value.features.GroupId == param.features.GroupId) {
                            $scope.ExistingFeatureOption[iopt].items = angular.copy($scope.ExistingPlan.optional[iopt].items);
                            $scope.ExistingFeatureOption[iopt].isValid = true;
                            $scope.ExistingFeatureOption[iopt].selected = true;
                        }
                    } else {
                        if (value.features.Id == param.features.Id) {
                            $scope.ExistingFeatureOption[iopt].features = angular.copy($scope.ExistingPlan.optional[iopt].features);
                            $scope.ExistingFeatureOption[iopt].selected = true;
                            $scope.totalOptional = $scope.totalOptional + value.features.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                        }
                    }
                    iopt++;
                });
                $scope.addIdExisting('option');
            }

            /* logic select available optional item of feature*/
            $scope.selectItemOptional = function (param, feature) {
                var i = 0;
                var j = 0;
                angular.forEach($scope.ExistingFeatureOption, function (val, key) {
                    if (val.isGroup) {
                        if (val.features.GroupId == feature.GroupId) {
                            angular.forEach(val.items, function (item_val, item_key) {
                                if (item_val.item.Id == param) {
                                    $scope.ExistingFeatureOption[i].items[j].selected = true;
                                    $scope.totalOptional = $scope.totalOptional + item_val.item.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                                    if (item_val.item.Options.length > 0) {
                                        angular.forEach(item_val.item.Options, function (opt_val, opt_key) {
                                            $scope.totalOptional = $scope.totalOptional + opt_val.SpecifiedProductOffering.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                                        });
                                    }
                                }
                                j++;
                            });
                        }
                    } else {

                    }
                    i++;
                });
                $scope.addIdExisting('option');
            }

            /* logic remove available optional feature*/
            $scope.removeFeatureExisting = function (param) {
                var iopt = 0;
                angular.forEach($scope.ExistingFeatureOption, function (value, key) {
                    if (param.isGroup) {
                        if (value.features.GroupId == param.features.GroupId) {
                            $scope.ExistingFeatureOption[iopt].selected = false;
                            $scope.calculation(value);
                            $scope.ExistingFeatureOption[iopt].items = angular.copy($scope.ExistingPlan.optional[iopt].items);
                            $scope.ExistingFeatureOption[iopt].isValid = true;
                        }
                    } else {
                        if (value.features.Id == param.features.Id) {
                            $scope.ExistingFeatureOption[iopt].selected = false;
                            $scope.calculation(value);
                            $scope.ExistingFeatureOption[iopt].features = angular.copy($scope.ExistingPlan.optional[iopt].features);
                            $scope.totalOptional = $scope.totalOptional - value.features.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                        }
                    }
                    iopt++;
                });
                $scope.addIdExisting('option');
            }

            /* logic remove available optional item of feature*/
            $scope.removeItemOptional = function (param, feature) {
                var i = 0;
                var j = 0;
                angular.forEach($scope.ExistingFeatureOption, function (val, key) {
                    if (val.isGroup) {
                        if (val.features.GroupId == feature.GroupId) {
                            angular.forEach(val.items, function (item_val, item_key) {
                                if (item_val.item.Id == param) {
                                    $scope.ExistingFeatureOption[i].items[j].selected = false;
                                    $scope.totalOptional = $scope.totalOptional - item_val.item.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                                    if (item_val.item.Options.length > 0) {
                                        angular.forEach(item_val.item.Options, function (opt_val, opt_key) {
                                            $scope.totalOptional = $scope.totalOptional - opt_val.SpecifiedProductOffering.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                                        });
                                    }
                                }
                                j++;
                            });
                        }
                    } else {

                    }
                    i++;
                });
                $scope.addIdExisting('option');
            }

            /* assign selected id mandatory and optional*/
            $scope.addIdExisting = function (type) {
                switch (type) {
                    case 'mandatory':
                        MandatoryId = [];
                        angular.forEach($scope.ExistingFeatureMandatory, function (val, key) {
                            if (val.items.length > 0) {
                                angular.forEach(val.items, function (i_val, i_key) {
                                    if (i_val.selected) {
                                        MandatoryId.push(i_val.item.Id);
                                        if (i_val.item.Options.length > 0) {
                                            angular.forEach(i_val.item.Options, function (opt_val, opt_key) {
                                                angular.forEach(opt_val, function (o, k) {
                                                    switch (k) {
                                                        case 'SpecifiedProductOffering':
                                                            MandatoryId.push(opt_val.SpecifiedProductOffering.Id);
                                                            break;
                                                    }
                                                });
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    break;
                    case 'option':
                        OptionalId = [];
                        angular.forEach($scope.ExistingFeatureOption, function (val, key) {
                            if (val.items.length > 0) {
                                angular.forEach(val.items, function (i_val, i_key) {
                                    if (i_val.selected) {
                                        OptionalId.push(i_val.item.Id);
                                        if (i_val.item.Options.length > 0) {
                                            angular.forEach(i_val.item.Options, function (opt_val, opt_key) {
                                                angular.forEach(opt_val, function (o, k) {
                                                    switch (k) {
                                                        case 'SpecifiedProductOffering':
                                                            OptionalId.push(opt_val.SpecifiedProductOffering.Id);
                                                        break;
                                                    }
                                                });
                                            });
                                        }
                                    }
                                });
                            } else {
                                if (val.selected) {
                                    OptionalId.push(val.features.Id);
                                }
                            }
                        });
                    break;
                }
                if (OptionalId.length > 0 || MandatoryId.length > 0) {
                    $scope.isExistPay = true;
                } else {
                    $scope.isExistPay = false;
                }
            }

            /* do add to shopping cart */
            $scope.addToCartExisting = function () {
                $scope.featuresId = {
                    PlanId: PlanId,
                    MandatoryId: MandatoryId,
                    OptionalId: OptionalId
                }
                var items = {
                    item: {
                        "productid": $scope.existing.Id,
                        "type": "PLANS",
                        "name": "PLANS - " + $scope.existing.Names[0].Text,
                        "qty": 1,
                        "amount": $scope.totalMandatory + $scope.totalOptional,
                        "unitprice": $scope.totalMandatory + $scope.totalOptional,
                        "optionalproducts": (JSON.stringify($scope.featuresId))
                    },
                    msisdn: wrapper.activeDevice.Msisdn,
                    customerid: wrapper.customerInfo.CustomerID,
                    activesubscriberid: wrapper.activeDevice.Subscription.SubscriptionId
                };
                var promise = ShoppingFunction.addToCart(items);
                promise.then(function (result) {
                    if (result) {
                        ///some function
                    }
                });
            }

            /* do pay with balance */
            $scope.payWithBalanceExisting = function () {
                $scope.featuresId = {
                    PlanId: PlanId,
                    MandatoryId: MandatoryId,
                    OptionalId: OptionalId
                }
                var items = {
                    item: {
                        "productid": $scope.existing.Id,
                        "type": "PLANS",
                        "name": "PLANS - " + $scope.existing.Names[0].Text,
                        "qty": 1,
                        "amount": $scope.totalMandatory + $scope.totalOptional,
                        "unitprice": $scope.totalMandatory + $scope.totalOptional,
                        "optionalproducts": (JSON.stringify($scope.featuresId))
                    },
                    msisdn: wrapper.activeDevice.Msisdn,
                    customerid: wrapper.customerInfo.CustomerID
                };
                var promise = ShoppingFunction.adjustBalance(items);
                promise.then(function (result) {
                    if (result) {
                        var res = ShoppingFunction.payWithBalance(items);
                        res.then(function (response) {
                            // Some function
                        })
                    }
                });
            }

            /* calculation total price of plan and feature */
            $scope.calculation = function (param) {
                var lostPrice = 0;
                if (param.isGroup) {
                    angular.forEach(param.items, function (v, k) {
                        if (v.selected) {
                            lostPrice = lostPrice + v.item.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                            if (v.item.Options.length > 0) {
                                angular.forEach(v.item.Options, function (ov, ok) {
                                    lostPrice = lostPrice + ov.SpecifiedProductOffering.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                                });
                            }
                        }
                    });
                } else {
                    if (param.selected) {
                        lostPrice = lostPrice + param.SpecifiedProductOffering.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                    }
                }
                $scope.totalOptional = $scope.totalOptional - lostPrice;
            }

            /*** end existing plan ***/



            /*** available plan ***/
            var available = result.AvailableMainPlanServices.length > 0 ? angular.copy(result.AvailableMainPlanServices) : null;
            var avl_plan;
            var avl_arr_plan = [];
            var avl_temp_json;
            var avl_isGroup = false;
            var avl_optional = [];
            var avl_optional_json;
            var avl_mandatory = [];
            var avl_mandatory_json;
            var avl_optional_child = [];
            var avl_optional_child_json;
            var avl_arr_group_mandatory = [];
            var avl_arr_group_optional = [];
            if (available != null) {
                angular.forEach(available, function (value, key) {
                    angular.forEach(value.Options, function (opt_val, opt_key) {
                        if (opt_val.MinOccurs != 0) {
                            angular.forEach(opt_val, function (v, k) {
                                if (k == 'GroupId') {
                                    avl_isGroup = true;
                                }
                            });

                            if (avl_isGroup) {
                                var pr = 0;
                                angular.forEach(opt_val.ProductOfferingsInGroup, function (g_val, g_key) {
                                    pr = pr + g_val.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                                });
                                angular.forEach(opt_val.ProductOfferingsInGroup, function (g_val, g_key) {
                                    var t_group = {
                                        item: g_val,
                                        selected: false
                                    }
                                    avl_arr_group_mandatory.push(t_group);
                                });
                                avl_mandatory_json = {
                                    features: opt_val,
                                    items: avl_arr_group_mandatory,
                                    isGroup: true,
                                    price: pr,
                                    isValid: false
                                }
                                avl_mandatory.push(avl_mandatory_json);
                                avl_arr_group_mandatory = [];
                            }
                            else {
                                avl_mandatory_json = {
                                    features: opt_val.SpecifiedProductOffering,
                                    items: [],
                                    isGroup: false,
                                    price: opt_val.SpecifiedProductOffering.PurchaseOptions[0].Charges[0].Prices[0].Amount,
                                    isValid: true
                                }
                                avl_mandatory.push(avl_mandatory_json);
                            }
                            avl_isGroup = false;
                        } else {
                            angular.forEach(opt_val, function (v, k) {
                                if (k == 'GroupId') {
                                    avl_isGroup = true;
                                }
                            });

                            if (avl_isGroup) {
                                var pr = 0;
                                angular.forEach(opt_val.ProductOfferingsInGroup, function (g_val, g_key) {
                                    pr = pr + g_val.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                                });
                                angular.forEach(opt_val.ProductOfferingsInGroup, function (g_val, g_key) {
                                    var t_group = {
                                        item: g_val,
                                        selected: false
                                    }
                                    avl_arr_group_optional.push(t_group);
                                });
                                avl_optional_child_json = {
                                    features: opt_val,
                                    items: avl_arr_group_optional,
                                    isGroup: true,
                                    price: pr,
                                    isValid: true
                                }
                                avl_optional.push(avl_optional_child_json);
                                avl_arr_group_optional = [];
                            } else {
                                if (opt_val.SpecifiedProductOffering.Product.ProductType != 7 && opt_val.SpecifiedProductOffering.Product.ProductType != 6) {
                                    avl_optional_child_json = {
                                        features: opt_val.SpecifiedProductOffering,
                                        items: [],
                                        isGroup: false,
                                        price: opt_val.SpecifiedProductOffering.PurchaseOptions.length ? opt_val.SpecifiedProductOffering.PurchaseOptions[0].Charges[0].Prices[0].Amount:0,
                                        isValid: true
                                    }
                                    avl_optional.push(avl_optional_child_json);
                                }
                            }
                            avl_isGroup = false;
                        }
                    });
                    var planTot = 0;
                    angular.forEach(avl_mandatory, function (v, k) {
                        if (!v.isGroup) {
                            planTot = planTot + v.price;
                        }
                    });

                    avl_temp_json = {
                        main_plan: value,
                        products_mandatory: avl_mandatory,
                        products_optional: avl_optional,
                        prices: planTot
                    }
                    avl_arr_plan.push(avl_temp_json);

                    avl_mandatory = [];
                    avl_optional = [];
                });
                avl_plan = {
                    plans: avl_arr_plan
                }
                $timeout(function () {
                    $scope.AvailablePlan = angular.copy(avl_plan.plans);
                }, 0);
            }
            /*** end available plan ***/
        });

        

        $scope.selectPlan = function (id, param) {
            PlanId = id;
            $scope.featureGroupReady = false;
            $scope.currentFeatureId = id;
            $scope.validshowOption = false;
            var mand_feat = [];
            var mand_feat_json;
            var child = [];
            if (param.length == 0) {
                $scope.showOption = true;
            }
            angular.forEach(param, function (val, key) {
                angular.forEach(val.features, function (g_val, g_key) {
                    switch (g_key) {
                        case 'ProductOfferingsInGroup':
                            angular.forEach(g_val, function (g_value, g_k) {
                                var j_g = {
                                    selected: false,
                                    features: g_value
                                }
                                child.push(j_g);
                            });
                            break;
                        case 'SpecifiedProductOffering':
                            child = [];
                            break;
                    }
                });
                mand_feat_json = {
                    GroupId: val.features.GroupId,
                    Price: child.length == 0 ? val.features.PurchaseOptions.length > 0 ? val.features.PurchaseOptions[0].Charges[0].Prices[0].Amount:0:0,
                    Names: val.features.Names[0].Text,
                    Descriptions: val.features.Descriptions[0].Text,
                    Items: child,
                    Id: val.features.Id,
                    MaxOccurs: val.features.MaxOccurs,
                    MinOccurs: val.features.MinOccurs,
                    Valid: child.length > 0 ? false : true,
                }
                mand_feat.push(mand_feat_json);
                child = [];
            });
            angular.forEach(mand_feat, function (x, y) {
                if(x.Items.length > 0)
                    $scope.featureGroupReady = true;
            });
            
            $scope.mandatory_features = mand_feat;
            var temp;
            var mainp = angular.copy($scope.AvailablePlan);
            angular.forEach(mainp, function (v, k) {
                if (v.main_plan.Id == PlanId) {
                    temp = angular.copy(v.products_optional);
                    $scope.totalMandatory = v.prices;
                    $scope.dataAddToChart = v;
                }
            });
            $timeout(function () {
                if (!$scope.featureGroupReady) {
                    $scope.validshowOption = true;
                }
                $scope.currentPlan = {
                    Id: id,
                }
                if (temp.length > 0) {
                    $scope.OptionalFeatures = angular.copy(temp);
                } else {
                    $scope.OptionalFeatures = undefined;
                }
                $scope.addId('mandatory');
            }, 0);
        }

        /* force select requirement */
        $scope.addItemPlan = function (type, parent, param) {
            var count = 1;
            switch (type) {
                //mandatory
                case 0:
                    $scope.validshowOption = true;
                    angular.forEach($scope.mandatory_features, function (val, key) {
                        if (val.GroupId == parent.GroupId) {
                            angular.forEach(val.Items, function (item_val, item_key) {
                                if (item_val.selected) {
                                    count = count + 1;
                                }
                            });
                            angular.forEach(val.Items, function (item_val, item_key) {
                                if (count <= val.MaxOccurs) {
                                    if (item_val.features.Id == param.features.Id)
                                        $scope.addFeatureMandatory(parent, item_val);
                                } else {
                                    if (item_val.features.Id == param.features.Id) {
                                        $scope.addFeatureMandatory(parent, item_val);
                                    } else {
                                        if (item_val.selected)
                                            $scope.removeFeatureMandatory(parent, item_val);
                                    }
                                }
                            });
                        }
                    });
                    count = 1;
                    break;
                    //optional
                case 1:
                    angular.forEach($scope.OptionalFeatures, function (val, key) {
                        if (val.features.GroupId == parent.features.GroupId) {
                            angular.forEach(val.items, function (item_val, item_key) {
                                if (item_val.selected) {
                                    count = count + 1;
                                }
                            });
                            angular.forEach(val.items, function (item_val, item_key) {
                                if (count <= val.features.MaxOccurs) {
                                    if (item_val.item.Id == param.item.Id)
                                        $scope.addFeatureOptional(parent, item_val);
                                } else {
                                    if (item_val.item.Id == param.item.Id) {
                                        $scope.addFeatureOptional(parent, item_val);
                                    } else {
                                        if (item_val.selected) {
                                            $scope.removeFeatureOptional(parent, item_val);
                                            count = count - 1;
                                        }
                                    }
                                }
                            });
                        }
                    });
                    count = 1;
                    break;
            }
        }

        $scope.addFeatureMandatory = function (parent, param) {
            $scope.currentMandatoryFeatureId = param.features.Id;
            var i = 0;
            var j = 0;
            angular.forEach($scope.mandatory_features, function (m_val, m_key) {
                if (m_val.GroupId == parent.GroupId) {
                    angular.forEach(parent.Items, function (val, key) {
                        if (param.features.Id == val.features.Id) {
                            $scope.mandatory_features[i].Items[j].selected = true;
                            $scope.totalMandatory = $scope.totalMandatory + val.features.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                        }
                        j++;
                    });
                }
                i++;
            });
            $scope.addId('mandatory');

        }
        $scope.removeFeatureMandatory = function (parent, param) {
            var i = 0;
            var j = 0;
            
            angular.forEach($scope.mandatory_features, function (m_val, m_key) {
                if (m_val.Id == parent.Id) {
                    angular.forEach(parent.Items, function (val, key) {
                        if (param.features.Id == val.features.Id) {
                            $scope.mandatory_features[i].Items[j].selected = false;
                            $scope.totalMandatory = $scope.totalMandatory - val.features.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                            $scope.addId('mandatory');
                        }
                        j++;
                    });
                }
                i++;
            });
        }

        $scope.addFeature = function (param) {
            $scope.OptionalSpecific = false;
            var opt_feat_json;
            var opt_feat_arr = [];
            var count = 0;
            angular.forEach($scope.OptionalFeatures, function (v, k) {
                if (param.isGroup) {
                    $scope.currentFeatureId = param.features.GroupId;
                    if (v.features.GroupId == param.features.GroupId) {
                        angular.forEach(v.features, function (f_val, f_key) {
                            if (f_key == 'Options') {
                                $scope.OptionalSpecific = true;
                            } else if (f_key == 'ProductOfferingsInGroup') {
                                $scope.OptionalSpecific = false;
                            }
                        });
                        if (!$scope.OptionalSpecific) {
                            angular.forEach(v.features.ProductOfferingsInGroup, function (fg_val, fg_key) {

                                opt_feat_json = {
                                    Items: fg_val,
                                    selected: false,
                                }
                                opt_feat_arr.push(opt_feat_json);
                            });
                        }
                        $scope.OptionalFeatures[count].selected = true;
                        $scope.OptionalFeatures[count].items = opt_feat_arr;

                        $scope.selectedOptional.push($scope.OptionalFeatures[count]);
                    }
                } else {
                    $scope.currentFeatureId = param.features.Id;
                    if (v.features.Id == param.features.Id) {
                        angular.forEach(v.features, function (f_val, f_key) {
                            if (f_key == 'Options') {
                                $scope.OptionalSpecific = true;
                            } else if (f_key == 'ProductOfferingsInGroup') {
                                $scope.OptionalSpecific = false;
                            }
                        });
                        if (!$scope.OptionalSpecific) {
                            angular.forEach(v.features.ProductOfferingsInGroup, function (fg_val, fg_key) {

                                opt_feat_json = {
                                    Items: fg_val,
                                    selected: false,
                                }
                                opt_feat_arr.push(opt_feat_json);
                            });
                        }
                        $scope.totalOptional = $scope.totalOptional + v.price;
                        $scope.OptionalFeatures[count].selected = true;
                        $scope.OptionalFeatures[count].items = opt_feat_arr;

                        $scope.selectedOptional.push($scope.OptionalFeatures[count]);
                    }
                }
                
                $scope.dataAddToChart.products_optional = $scope.selectedOptional
                count++;
            });
            $scope.addId('option');
        }

        $scope.removeFeature = function (param) {
            var count = 0;
            var opt_feat_json;
            var opt_feat_arr = [];
            var lostPrice = 0;
            angular.forEach($scope.OptionalFeatures, function (v, k) {
                if (param.isGroup) {
                    $scope.currentFeatureId = param.features.GroupId;
                    if (v.features.GroupId == param.features.GroupId) {
                        angular.forEach(v.items, function (i_val, i_key) {
                            if (i_val.selected)
                                lostPrice = lostPrice + i_val.Items.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                        });
                        angular.forEach(v.features, function (f_val, f_key) {
                            if (f_key == 'Options') {
                                $scope.OptionalSpecific = true;
                            } else if (f_key == 'ProductOfferingsInGroup') {
                                $scope.OptionalSpecific = false;
                            }
                        });
                        if (!$scope.OptionalSpecific) {
                            angular.forEach(v.features.ProductOfferingsInGroup, function (fg_val, fg_key) {

                                opt_feat_json = {
                                    Items: fg_val,
                                    selected: false,
                                }
                                opt_feat_arr.push(opt_feat_json);
                            });
                        }
                        $scope.totalOptional = $scope.totalOptional - lostPrice;
                        $scope.OptionalFeatures[count].selected = false;
                        $scope.OptionalFeatures[count].items = opt_feat_arr;
                    }
                } else {
                    $scope.currentFeatureId = param.features.Id;
                    if (v.features.Id == param.features.Id) {
                        angular.forEach(v.features, function (f_val, f_key) {
                            if (f_key == 'Options') {
                                $scope.OptionalSpecific = true;
                            } else if (f_key == 'ProductOfferingsInGroup') {
                                $scope.OptionalSpecific = false;
                            }
                        });
                        if (!$scope.OptionalSpecific) {
                            angular.forEach(v.features.ProductOfferingsInGroup, function (fg_val, fg_key) {

                                opt_feat_json = {
                                    Items: fg_val,
                                    selected: false,
                                }
                                opt_feat_arr.push(opt_feat_json);
                            });
                        }
                        $scope.totalOptional = $scope.totalOptional - v.price;
                        $scope.OptionalFeatures[count].selected = false;
                        $scope.OptionalFeatures[count].items = opt_feat_arr;
                    }
                }
                count++;
            });
            $scope.addId('option');
        }

        $scope.addFeatureOptional = function (parent, param) {
            var i = 0;
            var j = 0;
            var par = angular.copy($scope.OptionalFeatures);
            var allow = false;
            angular.forEach(par, function (value, key) {
                if (parent.isGroup) {
                    if (value.features.GroupId == parent.features.GroupId) {
                        angular.forEach(value.items, function (c_val, c_key) {
                            if (c_val.item.Id == param.item.Id) {
                                $scope.OptionalFeatures[i].items[j].selected = true;
                                $scope.totalOptional = $scope.totalOptional + c_val.item.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                            }
                            j++;
                        });
                    }
                }
                
                i++;
            });
            $scope.addId('option');
        }
        $scope.removeFeatureOptional = function (parent, param) {
            var i = 0;
            var j = 0;
            var par = angular.copy($scope.OptionalFeatures);
            angular.forEach(par, function (value, key) {
                if (value.features.GroupId == parent.features.GroupId) {
                    angular.forEach(value.items, function (c_val, c_key) {
                        if (c_val.item.Id == param.item.Id) {
                            $scope.OptionalFeatures[i].items[j].selected = false;
                            $scope.totalOptional = $scope.totalOptional - c_val.item.PurchaseOptions[0].Charges[0].Prices[0].Amount;
                            
                        }
                        j++;
                    });
                }
                i++;
            });
            $scope.addId('option');
        }

        $scope.addId = function (type) {
            switch (type) {
                case 'mandatory':
                    MandatoryId = [];
                    angular.forEach($scope.mandatory_features, function (val, key) {
                        if (val.Items.length > 0) {
                            angular.forEach(val.Items, function (i_val, i_key) {
                                if (i_val.selected) {
                                    MandatoryId.push(i_val.features.Id);
                                    if (i_val.features.Options.length > 0) {
                                        angular.forEach(i_val.features.Options, function (opt_val, opt_key) {
                                            angular.forEach(opt_val, function (o, k) {
                                                switch (k) {
                                                    case 'SpecifiedProductOffering':
                                                        MandatoryId.push(opt_val.SpecifiedProductOffering.Id);
                                                        break;
                                                }
                                            });
                                        });
                                    }
                                }
                            });
                        } else {
                            MandatoryId.push(val.Id);
                        }
                    });
                    break;
                case 'option':
                    OptionalId = [];
                    angular.forEach($scope.OptionalFeatures, function (val, key) {
                        if (val.items.length > 0) {
                            angular.forEach(val.items, function (i_val, i_key) {
                                if (i_val.selected) {
                                    OptionalId.push(i_val.item.Id);
                                    if (i_val.item.Options.length > 0) {
                                        angular.forEach(i_val.item.Options, function (opt_val, opt_key) {
                                            angular.forEach(opt_val, function (o, k) {
                                                switch (k) {
                                                    case 'SpecifiedProductOffering':
                                                        OptionalId.push(opt_val.SpecifiedProductOffering.Id);
                                                        break;
                                                }
                                            });
                                        });
                                    }
                                }
                            });
                        } else {
                            if (val.selected) {
                                OptionalId.push(val.features.Id);
                            }
                        }
                    });
                    break;
            }
        }
        $scope.goToChange = function (param) {
            if (param == false) {
                $scope.isChangePlan = false;
            } else {
                $scope.isChangePlan = true;
            }
            $timeout(function () {
                $scope.start();
            }, 0);
        }

        $scope.addToCart = function () {
            $scope.featuresId = {
                PlanId: PlanId,
                MandatoryId: MandatoryId,
                OptionalId: OptionalId,
            }
            var qty = 1;
            var items = {
                item: {
                    "productid": $scope.dataAddToChart.main_plan.Id,
                    "type": "PLANS",
                    "name": "PLANS - " + $scope.dataAddToChart.main_plan.Names[0].Text,
                    "qty": qty,
                    "amount": ($scope.totalMandatory + $scope.totalOptional) * qty,
                    "unitprice": $scope.totalMandatory + $scope.totalOptional,
                    "optionalproducts": (JSON.stringify($scope.featuresId))
                },
                msisdn: wrapper.activeDevice.Msisdn,
                customerid: wrapper.customerInfo.CustomerID,
                activesubscriberid: wrapper.activeDevice.Subscription.SubscriptionId
            };
            var promise = ShoppingFunction.addToCart(items);
            promise.then(function (result) {
                if (result) {
                    ///some function
                }
            });
        }

        $scope.payWithBalance = function () {
            $scope.featuresId = {
                PlanId: PlanId,
                MandatoryId: MandatoryId,
                OptionalId: OptionalId
            }
            var qty = 1;
            var items = {
                item: {
                    "productid": $scope.dataAddToChart.main_plan.Id,
                    "type": "PLANS",
                    "name": "PLANS - " + $scope.dataAddToChart.main_plan.Names[0].Text,
                    "qty": qty,
                    "amount": ($scope.totalMandatory + $scope.totalOptional) * qty,
                    "unitprice": $scope.totalMandatory + $scope.totalOptional,
                    "optionalproducts": (JSON.stringify($scope.featuresId))
                },
                msisdn: wrapper.activeDevice.Msisdn,
                customerid: wrapper.customerInfo.CustomerID
            };
            var promise = ShoppingFunction.adjustBalance(items);
            promise.then(function (result) {
                if (result) {
                    var res = ShoppingFunction.payWithBalance(items);
                    res.then(function (response) {
                        // Some function
                    })
                }
            });
        }

    }
});
