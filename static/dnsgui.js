var FZ_DEFAULT_OP = "IN A";
var FZ_DEFAULT_RP = "192.168.0.";

var RZ_DEFAULT_OP = "PTR";
var RZ_DEFAULT_RP = ".ikioma.";


var type = "";

function updateScreen(data) {
    function setHandlers() {
        $(".btn-add-record").off('click').on('click', addRecord);
        $(".btn-add-block").off('click').click(addBlock);
        $(".btn-remove").off('click').click(removeLine);
    }

    function addRecord() {
        var op;
        var rp;
        if(type === "fz") {
            op = FZ_DEFAULT_OP;
            rp = FZ_DEFAULT_RP;
        } else if(type === "rz") {
            op = RZ_DEFAULT_OP;
            rp = RZ_DEFAULT_RP;
        }

        $(this).parents("tr").after("<tr><td></td>" +
            "<td><input type='text'></td>" +
            "<td><input type='text' value='" + op + "'></td>" +
            "<td><input type='text' value='" + rp + "'></td>" +
            getButtonsHTML() + "</tr>");
        setHandlers();
    }

    function addBlock() {
        $(this).parents("tr").after("<tr><td></td>" +
            "<td colspan=3><textarea></textarea></td>" +
             getButtonsHTML() + "</tr>");
        setHandlers();
    }

    function removeLine() {
        $(this).parents("tr").remove();
    }

    function getRecordHTML(f_object) {
        var row_contents = "";
        if (f_object.operator === "IN A") {
            row_contents += "<td>" + f_object.rpart.split(".")[3] + "</td>";
        } else {
            row_contents += "<td></td>";
        }
        row_contents += "<td><input type='text' value='" + f_object.lpart + "'></td>" +
            "<td><input type='text' value='" + f_object.operator + "'></td>" +
            "<td><input type='text' value='" + f_object.rpart + "'></td>"
        return row_contents;
    }

    function getBlockHTML(f_object) {
        var row_contents = "";
        if (f_object.start) {
            row_contents += "<td>" + f_object.start + "<br>-<br>" + f_object.end + "</td>";
        } else {
            row_contents += "<td></td>";
        }
        row_contents += "<td colspan=3><textarea>" + f_object.text + "</textarea></td>";
        return row_contents;
    }

    function getButtonsHTML() {
        var row_contents = "";
        row_contents += "<td><button type='button' class='btn btn-add-record'><span class='glyphicon glyphicon-plus'></span>R</button>&nbsp;";
        row_contents += "<button type='button' class='btn btn-add-block'><span class='glyphicon glyphicon-plus'></span>B</button>&nbsp;";
        row_contents += "<button type='button' class='btn btn-remove'><span class='glyphicon glyphicon-minus'></span></button></td>";
        return row_contents;
    }

    if(type === "fz") {
        objects = data.forward.objects;
    } else if(type === "rz") {
        objects = data.reverse.objects;
    }

    var table = $("#table-fz");

    table.html("");

    for(i = 0; i < objects.length; i++) {
        var row_contents;
        var f_object = objects[i];
        if(f_object.type === "block") {
            row_contents = getBlockHTML(f_object);
        } else if(f_object.type === "record") {
            row_contents = getRecordHTML(f_object);
        }
        row_contents += getButtonsHTML();
        table.append("<tr>" + row_contents + "</tr>");
    }
    autosize($("#table-fz textarea"));
    setHandlers();
}

function sendData() {

    function getRecordLine(row) {
        var text = "";
        row.find("input").each(function () {
            text += $(this).val();
            for (var i = 0; i < 10 - $(this).val().length; i++) {
                text += " ";
            }
            text += "\t";
        });
        return text;
    }

    function getRangedBlock(row) {
        var text = "";
        text += ";<block:" + row.children("td").first().html().split("<br>-<br>")[0] + ":" +
            row.children("td").first().html().split("<br>-<br>")[1] + ">\n";
        text += row.find("textarea").val() + "\n";
        text += ";</block>";
        return text;
    }

    function getMultilineBlock(row) {
        var text = "";
        text += ";<block>\n";
        text += row.find("textarea").val() + "\n";
        text += ";</block>";
        return text;
    }

    function getSinglelineBlock(row) {
        var text = "";
        text += row.find("textarea").val() + "";
        return text;
    }

    function getSendText() {
        var text = "";

        var current = "";
        var last = "";

        $("#table-fz tr").each(function () {
            if ($(this).find("input").length) {
                current = "record";
                if (last !== current && text.length) {
                    text += "\n";
                }
                text += getRecordLine($(this));
            } else {
                if ($(this).children("td").first().html().length) {
                    current = "block";
                    if (text.length) {
                        text += "\n";
                    }
                    text += getRangedBlock($(this));
                } else {
                    if ($(this).find("textarea").val().split("\n").length > 1) {
                        current = "block";
                        if (text.length) {
                            text += "\n";
                        }
                        text += getMultilineBlock($(this));
                    } else {
                        current = "comment";
                        if (current !== last && text.length) {
                            text += "\n";
                        }
                        text += getSinglelineBlock($(this));
                    }
                }
            }
            last = current;
            text += "\n";
        });
        return text;
    }

    var text = getSendText();
    if(type === "fz") {
        $.post("/writefz", text);
    } else if (type === "rz"){
        $.post("/writerz", text);
    }
}

function restart() {
    $.get("/restart", function(data) {
        $(".modal-body").text(data);
        $(".modal").modal();
    })
}

$(document).ready(function () {
    $("#btn-read-fz").click( function() {
        type = "fz";
        $.get("/read", updateScreen);
    });
    $("#btn-read-rz").click( function() {
        type = "rz";
        $.get("/read", updateScreen);
    });
    $("#btn-write").click(sendData);
    $("#btn-restart").click(restart);
});

