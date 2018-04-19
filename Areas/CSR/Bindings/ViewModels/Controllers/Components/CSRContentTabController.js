//Agung Meinastesi Caesar
//controllder for sidebar

CSRContent.controller('TabController', function ($scope, CSRSideBar) {
    this.tab = 1;

    this.setTab = function (newValue) {
        this.tab = newValue;
    };

    this.isSet = function (tabName) {
        return this.tab === tabName;
    };

});