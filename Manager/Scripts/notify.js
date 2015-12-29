jQuery(function () {

    jQuery(".gridster ul").gridster({
        widget_base_dimensions: [64, 64],
        widget_margins: [5, 5],
        max_cols: 16,
        min_cols: 16,
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

(function () {
    var loggingHub = $.connection.loggingHub;
    $.connection.hub.start();

    loggingHub.client.notify = function (message) {
        message = JSON.parse(message);

        updateIO(message, io_out, false);
        updateIO(message, io_in, true);
        updateUsers(message, users);
        updateServerStatus(message, servers);
        updateCounters(message);
    }
}());


var BUFFER_MAX = 30;
var buffer = 30;

var graphs = {
    users: document.getElementById("users"),
    io_out: document.getElementById("io_out"),
    io_in: document.getElementById("io_in"),
    servers: document.getElementById("servers"),
    server_count: document.getElementById("server_count"),
    room_count: document.getElementById("room_count"),
    user_count: document.getElementById("user_count")
};


function linechart(graph, title) {
    var ctx = graph.getContext("2d");
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            pointDot: false,
            datasetFill: false,
            bezierCurve: false,
            animation: false,
            title: {
                display: true,
                text: title
            },
            scales: {
                yAxes: [
            {
                ticks: {
                    beginAtZero: true
                }
            }
                ]
            },
        }
    });

    return chart;
}

var io_out = linechart(graphs.io_out, "Output");
var io_in = linechart(graphs.io_in, "Input");

function updateIO(message, chart, isIndata) {

    for (var i = 0; i < message.io.length; i++) {
        var server = message.io[i];
        var exists = false;

        for (var k = 0; k < chart.data.datasets.length; k++) {
            if (chart.data.datasets[k].label == server.name) {
                exists = true;

                chart.data.datasets[k].data.push((isIndata) ? server.in : server.out);

                if (chart.data.datasets[k].data.length >= BUFFER_MAX)
                    chart.data.datasets[k].data.shift();
            }
        }

        if (!exists) {
            chart.data.datasets.push({
                label: server.name,
                borderColor: colorFromName(server.name),
                pointBorderColor: "rgba(0, 0, 0,1)",
                pointBackgroundColor: colorFromName(server.name),
                pointHighlightFill: colorFromName(server.name),
                pointHighlightStroke: "rgba(220,220,220,1)",
                backgroundColor: colorFromName(server.name),
                fill: false,
                tension: 0,
                data: [(isIndata) ? server.in : server.out]
            });
        }
    }

    chart.data.labels.push(new Date().toLocaleTimeString());

    if (chart.data.labels.length >= BUFFER_MAX)
        chart.data.labels.shift();

    chart.update();
}

var users = new Chart(graphs.users.getContext("2d"), {
    type: 'pie',
    data: {
        datasets: [],
        labels: []
    },
    options: {
        animation: false,
        title: {
            display: true,
            text: 'Spread'
        }
    }
});

var colors = {};

function updateUsers(message, chart) {
    var data = [];
    var labels = [];
    var color = [];

    for (var i = 0; i < message.tree.servers.length; i++) {
        var server = message.tree.servers[i];

        labels.push(server.name);
        data.push(server.users);

        if (colors[server.name] == null)
            colors[server.name] = randomColor(30);

        color.push(colors[server.name]);
    }

    users.data.labels = labels;
    users.data.datasets = [{
        data: data,
        backgroundColor: color,
        hoverBackgroundColor: color
    }];

    users.update();
}

/**
 * Author: Dave Mihal
 * http://stackoverflow.com/a/17373688/4441348
 * Generates random colors with a provided minimum brightness.
 */
function randomColor(brightness) {
    function randomChannel(brightness) {
        var r = 255 - brightness;
        var n = 0 | ((Math.random() * r) + brightness);
        var s = n.toString(16);
        return (s.length == 1) ? '0' + s : s;
    }
    return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
}

function colorFromName(name) {
    switch (name) {
        case "persistence":
            return "rgba(255,0,0,1)";
        case "connector":
            return "rgba(0,255,0,1)";
        case "registry":
            return "rgba(0,220,255,1)";
        default:
            return "rgba(168, 32, 128, 1)";
    }
}


var servers = new Chart(graphs.servers.getContext("2d"), {
    type: 'bar',
    data: {
        labels: ["status"],
        datasets: [
        {
            label: "ready",
            backgroundColor: "rgba(0, 255, 0, 0.7)",
            hoverBackgroundColor: "rgba(0, 255, 0, 1.0)",
            hoverBorderColor: "rgba(0, 0, 0, 1)",
            data: [0]
        },
        {
            label: "full",
            backgroundColor: "rgba(255, 0, 0, 0.7)",
            hoverBackgroundColor: "rgba(255, 0, 0, 1.0)",
            hoverBorderColor: "rgba(0, 0, 0, 1)",
            data: [0]
        }
        ]
    },
    options: {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true
                    }
                }
            ]
        },
        title: {
            display: true,
            text: 'Servers'
        }
    }
});

function updateServerStatus(message, chart) {
    var full = 0;
    var ready = 0;

    for (var i = 0; i < message.tree.servers.length; i++) {
        var server = message.tree.servers[i];


        if (server.full) {
            full += 1;
        } else {
            ready += 1;
        }
    }

      servers.data.datasets[0].data[0] = ready;
      servers.data.datasets[1].data[0] = full;
      servers.update();
}



function updateCounters(message) {
    var rooms = {};
    var users = 0;
    var servers = message.tree.servers.length;

    for (var i = 0; i < servers; i++) {
        var server = message.tree.servers[i];

        for (var name in Object.keys(server.rooms))
            rooms[name] = 1;

        users += server.users;
    }

    drawStatusText(servers, server_count);
    drawStatusText(Object.keys(rooms).length, room_count);
    drawStatusText(users, user_count);
}

function drawStatusText(text, canvas) {
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "30px Arial";
    context.fillText(text, 14, 50);
}