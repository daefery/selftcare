publicContent.controller("featureFormController", function ($scope, CommonEnum) {
    var features = [
        { name: 'Prepaid 4G Terabyte Line', value: "WRXOX" },
        { name: 'SMS FOR VPS Prepaid 4G Terabyte Plan', value: "WRXUF" },
        { name: 'Packet Flow Opt 128 KB', value: "WRXNC" },
        { name: 'Packet Flow Opt 256KB', value: "WRXNE" },
        { name: 'Packet Flow Opt 64 KB', value: "WRXNG" },
        { name: '4G PACKETFLOW 1.5 MBPS', value: "WRXNA" },
        { name: '4G PACKETFLOW 128 KBPS', value: "WRXNB" },
        { name: '4G PACKETFLOW 256 KBPS', value: "WRXND" },
        { name: '4G PACKETFLOW 64 KBPS', value: "WRXNF" },
        { name: '4G PACKETFLOW 5 MBPS', value: "WRXM9" },
        { name: 'SMS - Surepay', value: "WRXUE" }
    ];
    $scope.features = features;
    $scope.datas = {
        field: [
            {
                type: "message",
                show: "isFalse",
                item: "warningRecoverPass"
            },
            {
                type: "select",
                name: "features",
                size: 6,
                text: "Features",
                model: "data.Feature",
                value: "features",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "logo",
                item: '<p>{{question}}</p>'
            }
        ],
        button: [
            {
                type: "submit",
                text: "Submit",
                click: "submit(data)"
            }
        ]
    };
});