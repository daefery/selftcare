$(document).ready(function () {
    $("#myAccMenu a").click(function (e) {
        e.preventDefault();
        $("#myAccMenu a").addClass("active").not(this).removeClass("active");
    });
});