var DragStart, DragEnd;

function dynamicDashboard(data) {
    var mainDashboard = data;
    var dragStart = function (e, ui) {
        ui.item.data('start', ui.item.index());
    };
    DragStart = dragStart;
    var dragEnd = function (e, ui) {
        setTimeout(function () {
        }, 1);
        var start = ui.item.data('start'),
            end = ui.item.index();
        mainDashboard.DashboardMenu.splice(end, 0,
        mainDashboard.DashboardMenu.splice(start, 1)[0]);
    };
    DragEnd = dragEnd;
    return mainDashboard
}

function disableSort() {
    $(".sortMainDashboard").sortable('destroy');
};
function enableSort() {
    $(".sortMainDashboard").sortable({
        start: DragStart,
        update: DragEnd,
        connectWith: ".sortMainDashboard"
    });
    $(".sortMainDashboard").disableSelection();;
};