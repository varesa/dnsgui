function setHandlers() {
    $(".btn-add-record").off('click').on('click', addRecord);
    $(".btn-add-block").off('click').click(addBlock);
    $(".btn-remove").off('click').click(removeLine);
}

function updateScreen(data) {
    forward_objects = data.forward.objects;

    $("#table-fz").html("");

    for(i = 0; i < forward_objects.length; i++) {
        var row_contents = "";
        if(forward_objects[i].type === "block") {
            if(forward_objects[i].start) {
                row_contents += "<td>" + forward_objects[i].start + "<br>-<br>" + forward_objects[i].end + "</td>";
            } else {
                row_contents += "<td></td>";
            }
            row_contents += "<td colspan=3><textarea>" + forward_objects[i].text + "</textarea></td>";
        } else if(forward_objects[i].type === "record") {
            if (forward_objects[i].operator === "IN A") {
                row_contents += "<td>" + forward_objects[i].rpart.split(".")[3] + "</td>";
            } else {
                row_contents += "<td></td>";
            }
            row_contents += "<td><input type='text' value='" + forward_objects[i].lpart + "'></td>" +
                            "<td><input type='text' value='" + forward_objects[i].operator + "'></td>" +
                            "<td><input type='text' value='" + forward_objects[i].rpart + "'></td>"
        }
        row_contents += "<td><button type='button' class='btn btn-add-record'><span class='glyphicon glyphicon-plus'></span>R</button>&nbsp;";
        row_contents += "<button type='button' class='btn btn-add-block'><span class='glyphicon glyphicon-plus'></span>B</button>&nbsp;";
        row_contents += "<button type='button' class='btn btn-remove'><span class='glyphicon glyphicon-minus'></span></button></td>";
        $("#table-fz").append("<tr>" + row_contents + "</tr>");


    }
    autosize($("#table-fz textarea"));
    setHandlers();
}

function addRecord() {
    $(this).parents("tr").after("<tr><td></td>" +
        "<td><input type='text'></td>" +
        "<td><input type='text' value='IN A'></td>" +
        "<td><input type='text'></td>" +
        "<td><button type='button' class='btn btn-add-record'><span class='glyphicon glyphicon-plus'></span>R</button>&nbsp;" +
        "<button type='button' class='btn btn-add-block'><span class='glyphicon glyphicon-plus'></span>B</button>&nbsp;" +
        "<button type='button' class='btn btn-remove'><span class='glyphicon glyphicon-minus'></span></button></td></tr>");
    setHandlers();
}

function addBlock() {
    $(this).parents("tr").after("<tr><td></td>" +
        "<td colspan=3><textarea></textarea></td>" +
        "<td><button type='button' class='btn btn-add-record'><span class='glyphicon glyphicon-plus'></span>R</button>&nbsp;" +
        "<button type='button' class='btn btn-add-block'><span class='glyphicon glyphicon-plus'></span>B</button>&nbsp;" +
        "<button type='button' class='btn btn-remove'><span class='glyphicon glyphicon-minus'></span></button></td></tr>");
    setHandlers();
}

function removeLine() {
    $(this).parents("tr").remove();
}

function sendData() {
    var text = "";

    var current = "";
    var last = "";
    $("#table-fz tr").each(function() {
        if($(this).find("input").length) {
            current = "record";
            if(last !== current && text.length) {
                text += "\n";
            }
            $(this).find("input").each(function () {
                text += $(this).val();
                for(var i = 0; i < 10-$(this).val().length; i++) {
                    text += " ";
                }
                text += "\t";
            })
        } else {
            if($(this).children("td").first().html().length) {
                current = "block";
                if(text.length) {
                    text += "\n";
                }
                text += ";<block:" + $(this).children("td").first().html().split("<br>-<br>")[0] + ":" +
                    $(this).children("td").first().html().split("<br>-<br>")[1] + ">\n";
                text += $(this).find("textarea").val() + "\n";
                text += ";</block>";
            } else {
                if($(this).find("textarea").val().split("\n").length > 1) {
                    current = "block";
                    if(text.length) {
                        text += "\n";
                    }
                    text += ";<block>\n";
                    text += $(this).find("textarea").val() + "\n";
                    text += ";</block>";
                } else {
                    current = "comment";
                    if(current !== last && text.length) {
                        text += "\n";
                    }
                    text += $(this).find("textarea").val() + "";
                }
            }
        }
        last = current;
        text += "\n";
    });
    $.post("/write", text);
}

$(document).ready(function () {
    $("#btn-read").click( function() {
        $.get("/read", updateScreen);
    });
    $("#btn-write").click(sendData);
});

