function htmlContent(data) {
    var sortableArray = data;
    var sortableEle;
    var dragStart = function (e, ui) {
        ui.item.data('start', ui.item.index());
    }
    var dragEnd = function (e, ui) {
        var start = ui.item.data('start'),
            end = ui.item.index();

        sortableArray.NavigationMenu.splice(end, 0,
            sortableArray.NavigationMenu.splice(start, 1)[0]);
    };

    sortableEle = $('#sortable').sortable({
        items: 'li:not(.Home)',
        start: dragStart,
        update: dragEnd
    });
    return sortableArray
}