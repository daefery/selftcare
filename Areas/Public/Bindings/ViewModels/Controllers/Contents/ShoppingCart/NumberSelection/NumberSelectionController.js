/// <reference path="../../../../../../../../Templates/CSR/Customer/CustomerRegistration/Content/NumberSelection/Content/NewNumber.html" />
publicContent.controller('NumberSelectionController', function ($scope, $rootScope, $parse, CommonEnum, RegistrationCache, queryMsisdnElementService, queryAvailableMSISDN, SelfPublicCache) {
    if (config.TemplateCode === 'etna') {
        $scope.hideNumberSelect = true;
        $scope.hideSelectSim = true;
        $scope.showNumberSelect = false;
        $scope.showSelectSim = false;
        $scope.listMsisdn = {};
    } else {
        $scope.hideNumberSelect = false;
        $scope.hideSelectSim = false;
        $scope.showNumberSelect = true;
        $scope.showSelectSim = true;

        $scope.NumberSelection = {};
        $scope.listMsisdn = angular.copy($rootScope.jsonMsisdn.msisdns); //copy query data from the initial page
        var phoneCategory = $parse("NumberSelection.phonecategory");
        phoneCategory.assign($scope, CommonEnum.convertPhoneCategory(SelfPublicCache.get('categoryId')));

        if ((SelfPublicCache.get('selectedMSISDN') !== null) || (SelfPublicCache.get('selectedMSISDN') !== "") || (SelfPublicCache.get('selectedMSISDN') !== undefined)) {
            $scope.selectedMsisdn = SelfPublicCache.get('selectedMSISDN');
        } else {
            $scope.selectedMsisdn = "";
        }

        $scope.$watch("NumberSelection.phonecategory", function (x) {
            var searchedCategory = SelfPublicCache.get('categoryId');
            var quantity = queryMsisdnElementService.getQueryElement().quantity;
            var watchedCategoryId = x.value;
            var testJson = {
                "msisdns": []
            };
            if (searchedCategory !== watchedCategoryId) {

                queryAvailableMSISDN.get({ CategoryId: watchedCategoryId, Quantity: quantity }, function (result) {
                    var listMSISDN = angular.copy(result);
                    for (var i = 0; i <= listMSISDN.AvailableMsisdns.length - 1; i++) {
                        testJson.msisdns.push({
                            text: listMSISDN.AvailableMsisdns[i].MSISDN,
                            value: listMSISDN.AvailableMsisdns[i].MSISDN,
                            isDefault: false
                        });
                    }
                    $rootScope.jsonMsisdn = testJson;
                    SelfPublicCache.put('queryShortAvailMSISDN', testJson);
                    SelfPublicCache.put('categoryId', watchedCategoryId);
                });
            } else {
                var listMSISDN = angular.copy(SelfPublicCache.get('queryShortAvailMSISDN'));
                $rootScope.jsonMsisdn = listMSISDN;
            };
        });

        $scope.selectMsisdn = function (data) {
            SelfPublicCache.put('selectedMSISDN', data);
        };

    }


    $scope.selection = function (data) {
        switch (data) {
            case "newnumber_A":
                if (config.TemplateCode !== "etna") {
                    $scope.hideNumberSelect = false;
                    $scope.hideSelectSim = false;
                    $scope.showNumberSelect = true;
                    $scope.showSelectSim = true;
                    $scope.newnumberpath = "/Templates/CSR/Customer/CustomerRegistration/Content/NumberSelection/Content/NewNumber.html";
                } else {
                    $scope.hideNumberSelect = true;
                    $scope.hideSelectSim = true;
                    $scope.showNumberSelect = false;
                    $scope.showSelectSim = false;
                }
                break;
            case "newnumber_B":
                $scope.showNumberSelect = true;
                $scope.hideNumberSelect = false;
                if (config.TemplateCode !== "etna") {
                    $scope.hideSelectSim = false;
                    $scope.showSelectSim = true;
                } else {
                    $scope.hideSelectSim = true;
                    $scope.showSelectSim = false;
                }
                $scope.newnumberpath = "/Templates/CSR/Customer/CustomerRegistration/Content/NumberSelection/Content/ExistingNumber.html";
                $scope.portInRequest = true;
                break;
        }
    }

    $scope.PhoneCategory = CommonEnum.getPhoneCategory();
    $scope.phonecategory = {
        field: [
            {
                type: "select",
                name: "phonecategory",
                size: 12,
                text: "phone_category",
                model: "NumberSelection.phonecategory",
                value: "PhoneCategory",
                required: false,
                validation: false
            }
        ]
    }


    $scope.newnumber = {
        field: [
            {
                type: "radio",
                name: "NewNumber",
                size: 8,
                text: "new_number",
                model: "NumberSelection.NewNumber",
                required: true,
                style: "horizontal",
                content: [{ text: "Yes", value: "newnumber_A" }, { text: "No", value: "newnumber_B" }],
            },
        ]
    }

    $scope.existingnumber = {
        field: [
            {
                type: "phone",
                name: "phonenumber",
                size: 8,
                text: "phone_number",
                model: "NumberSelection.phonenumber",
                required: false,
                validation: false
            }, {
                type: "text",
                name: "esn",
                size: 8,
                text: "esn",
                model: "NumberSelection.ESN",
                required: false,
                validation: false
            }, {
                type: "text",
                name: "imei",
                size: 8,
                text: "IMEI",
                model: "NumberSelection.IMEI",
                required: false,
                validation: false
            }
        ]
    }

    $scope.iccidCR = [
        {
            iccid: '453345123567',
            imsi: '12376823',
            puk1: '547234',
            puk2: '234664',
            startdate: '12/01/2015',
            enddate: '30/01/2018',
            firstuse: '12/04/2015',
            lastuse: '11/10/2015'

        },
        {
            iccid: '123345123567',
            imsi: '12376823',
            puk1: '547234',
            puk2: '234664',
            startdate: '12/01/2015',
            enddate: '30/01/2018',
            firstuse: '12/04/2015',
            lastuse: '11/10/2015'
        },
        {
            iccid: '753345123567',
            imsi: '12376823',
            puk1: '547234',
            puk2: '234664',
            startdate: '12/01/2015',
            enddate: '30/01/2018',
            firstuse: '12/04/2015',
            lastuse: '11/10/2015'
        },
        {
            iccid: '833345123567',
            imsi: '12376823',
            puk1: '547234',
            puk2: '234664',
            startdate: '12/01/2015',
            enddate: '30/01/2018',
            firstuse: '12/04/2015',
            lastuse: '11/10/2015'
        },
        {
            iccid: '213345123567',
            imsi: '12376823',
            puk1: '547234',
            puk2: '234664',
            startdate: '12/01/2015',
            enddate: '30/01/2018',
            firstuse: '12/04/2015',
            lastuse: '11/10/2015'
        }];


    $scope.customizesubscriptionprofile = {
        field: [
            {
                type: "radio",
                name: "VoiceMail",
                size: 8,
                text: "Voice_Mail",
                model: "NumberSelection.VoiceMail",
                required: true,
                style: "horizontal",
                content: [{ text: "On", value: "VoiceMail_A" }, { text: "Off", value: "VoiceMail_B" }],
            },
            {
                type: "radio",
                name: "Roaming",
                size: 8,
                text: "Roaming",
                model: "NumberSelection.Roaming",
                required: true,
                style: "horizontal",
                content: [{ text: "On", value: "Roaming_A" }, { text: "Off", value: "Roaming_B" }],
            },
            {
                type: "radio",
                name: "CallWaiting",
                size: 8,
                text: "call_waiting",
                model: "NumberSelection.CallWaiting",
                required: true,
                style: "horizontal",
                content: [{ text: "On", value: "CallWaiting_A" }, { text: "Off", value: "CallWaiting_B" }],
            },
            {
                type: "radio",
                name: "Language",
                size: 8,
                text: "Language",
                model: "NumberSelection.Language",
                required: true,
                style: "horizontal",
                content: [{ text: "English", value: "Language_A" }, { text: "Spanish", value: "Language_B" }],
            },
        ]
    }

})
