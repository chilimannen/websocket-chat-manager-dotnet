(function () {
    var loggingHub = $.connection.loggingHub;
    $.connection.hub.logging = true;
    $.connection.hub.start();

    loggingHub.client.notify = function (message) {
        update(JSON.parse(message));
    }
}());

jQuery(function () {

    jQuery(".gridster ul").gridster({
        widget_base_dimensions: [128, 128],
        widget_margins: [5, 5],
        max_cols: 6,
        min_cols: 6,
        resize: {
            enabled: true,
            start: function (e, ui, $widget) {
            },
            resize: function (e, ui, $widget) {
            },
            stop: function (e, ui, $widget) {
            }
        }
    }).data('gridster');

});

var FPS = 30;
var buffer = 30;

var graphs = {
    users: document.getElementById("users"),
    io: document.getElementById("io"),
    fragmentation: document.getElementById("fragmentation"),
    rooms: document.getElementById("rooms"),
    servers: document.getElementById("servers")
};

var lineChart = {
    labels: [],

    datasets: [{
        label: "Registry Hits",
        strokeColor: "rgba(0,220,64,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: []
    }]
};

function update(message) {
    console.log(message);

    if (message.type == 'logging.hits') {
        window.myLine.addData([message.hits], "");

        if (buffer > 0) {
            buffer--;
        } else
            window.myLine.removeData();
    }
}

var ctx = io.getContext("2d");
window.myLine = new Chart(ctx).Line(lineChart, {
    responsive: true,
    pointDot: false,
    datasetFill: false,
    bezierCurve: false
});