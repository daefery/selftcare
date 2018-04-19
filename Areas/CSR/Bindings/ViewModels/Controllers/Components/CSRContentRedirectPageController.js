//Agung Meinastesi Caesar
//Created: redirect button to particular page
//22.09.2015
CSRContent.controller("redirectPage", function ($scope, $window) {
    this.buttonIndex = 0;
    this.setButton = function (newValue) {
        this.buttonIndex = newValue;;
        if (this.buttonIndex == '1') {
            var sharepointaddress = 'http://sharepoint.etns/';
            $window.open(sharepointaddress, '_blank');
        };
        if (this.buttonIndex == '2') {
            var jiraaddress = 'http://jira.etns:8080';
            $window.open(jiraaddress, '_blank');
        };
        if (this.buttonIndex == '3') {
            var confaddress = 'http://confluence.etns:8090';
            $window.open(confaddress, '_blank');
        };
        if (this.buttonIndex == '4') {
            $window.open('', '_blank');
        };



    }
});