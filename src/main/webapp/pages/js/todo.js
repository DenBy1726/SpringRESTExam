var todoprefix = '/todo';
var todoList = null;
var todoNote = null;
//меняет флаг первой записи в первом списке на true.
var Mark = function() {
    var JSONObject= {
        'id': 1,//ид записи которою меняем
        'checkmark': true
    };
    $.ajax({
        type: 'PUT',
        url:  todoprefix + '/' + 1, //ид списка в котором запись
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(JSONObject),
        dataType: 'text',
        async: true,
        success: function(result) {
            alert(result);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.status + ' ' + jqXHR.responseText + ' ' + textStatus + ' ' + errorThrown);
        }
    });
}

//формируем панель для отображения тодо
var GetTODOList = function()
{
    $.ajax(
        {
            type: 'GET',
            url: todoprefix,
            contentType: 'application/json; charset=utf-8',
            async: false,
            success: function(result){
                todoList = result;
                updatePages();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert(jqXHR.status + ' ' + jqXHR.responseText + ' ' + textStatus + ' ' + errorThrown);
            }
        }
    );
}

//загрузка тодо
var onLoadTODO = function() {
    GetTODOList();
    if(todoList.length > 0)
    {
        //GetNoteList();
        //активируем первую вкладку тодо если есть
        document.getElementById("tablinksTODO0").click();
       // openTabTODO(0);
    }


}

//загружаем вкладку с номером id
function openTabTODO(evt,tabName,id) {
    $.ajax(
        {
            type: 'GET',
            url: todoprefix + '/' + todoList[id].id,
            contentType: 'application/json; charset=utf-8',
            async: false,
            success: function(result){
                todoNote = result;
                sortTODONote();
                updateNotes(id,evt);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert(jqXHR.status + ' ' + jqXHR.responseText + ' ' + textStatus + ' ' + errorThrown);
            }
        }
    );

}

//изменяет флажок на выбранной записи
function checkUpdate(tabId,id)
{
    todoNote[id].checkmark = !todoNote[id].checkmark;
    var JSONObject= {
        'id': todoNote[id].id,//ид записи которою меняем
        'checkmark': todoNote[id].checkmark
    };
    $.ajax({
        type: 'PUT',
        url:  todoprefix + '/' + todoList[tabId].id, //ид списка в котором запись
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(JSONObject),
        dataType: 'text',
        async: true,
        success: function(result) {
            alert(result);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.status + ' ' + jqXHR.responseText + ' ' + textStatus + ' ' + errorThrown);
        }
    });
    updateNotes(tabId);
}

function updatePages()
{
    rez = '';
    rez2 = '';

    document.getElementById("TODO").innerHTML = '<div id="tabTODO" class="tabTODO"></div>'

    rez += '<table width="100%">';
    for(var i=0;i<todoList.length;i++){
        rez += '<tr class="tabTR">';
        //добавляем вкладки с названиями категории тодо и кнопку удалить вкладку
        rez += '<td>';
        rez +='<button class="tablinksTODO" id="tablinksTODO'+ i +'" onclick="openTabTODO(event, tab'+i+','+i+')" >' + todoList[i].name + '</button>';
        rez += '</td><td>';
        rez += '<button class="glyphicon glyphicon-remove close" onclick="deleteTabTODO('+todoList[i].id+')"></button>';
        rez += '</td>';
        rez += '</tr>';

        //добавляем поля для отображения списка тодо
        rez2 += '   <div id="tab'+i+'"  class="tabcontentTODO">\n' + '</div>';
    }

    rez += '</table>';

    //добавим кнопку добавить
    rez += '<button class="tablinksTODO" onclick="addTabTODO()" >' + "Добавить" +'</button>';

    document.getElementById("tabTODO").innerHTML = rez;
    document.getElementById("TODO").innerHTML += rez2;

}

//Обновляет список всех записей для текущего тодо
function updateNotes(id,evt)
{
    sortTODONote();
    // Declare all variables
    var i, tabcontent, tablinks,rez = '';

    rez += '<table width="100%">';
    //заполняем содержимым
    for(i=0; i<todoNote.length; i++) {
        //добавляем записи с названиями  тодо и кнопку удалить для каждой записи
        rez += '<tr><td>';

        rez += '<input type="checkbox" onclick=checkUpdate('+ (id+','+i) +') ';
        if (todoNote[i].checkmark == true)
            rez += ' checked';
        if(todoNote[i].checkmark == true)
            rez +='><del>'+ todoNote[i].name + '</del><br>';
        else
            rez += '>' + todoNote[i].name + '<br>';

        rez += '</td><td>';
        rez += '<button class="glyphicon glyphicon-remove close" onclick=deleteNoteTODO('+id+','+ todoNote[i].id + ')></button>';
        rez += '</td>';
        rez += '</tr>';
    }
    rez += '</table>';

    //добавим кнопку добавить
    rez += '<button class="tablinksTODO btn btn-default" onclick="addNoteTODO('+id+')" >' + "Добавить" +'</button>';

    document.getElementById('tab' + id).innerHTML = rez;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontentTODO");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinksTODO");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById('tab' + id).style.display = "block";
    if(typeof evt != 'undefined')
        evt.currentTarget.className += " active";
}

function sortTODONote()
{
    if(todoNote === null)
        return;

    var checkedTodo = todoNote.filter(function(val)
        {
            if(val.checkmark === true)
                return val;
        }
    );
    checkedTodo.sort(
        function(a,b)
        {
            return a.name > b.name;
        }
    );

    var unCheckedTodo = todoNote.filter(function(val)
        {
            if(val.checkmark === false)
                return val;
        }
    );
    unCheckedTodo.sort(
        function(a,b)
        {
            return a.name > b.name;
        }
    );

    todoNote = unCheckedTodo.concat(checkedTodo);

}

function addTabTODO()
{
    showDialogTODOList();
    var listener = function() {
        var rez = document.getElementById('return_valueTODO').value;
        if(rez === null || rez === "" || rez === undefined)
            return;
        $.ajax({
            type: 'POST',
            url:  todoprefix + '/' , //ид списка в котором запись
            contentType: 'application/json; charset=utf-8',
            data: rez,
            dataType: 'json',
            async: true,
            success: function(result) {
                todoList.push(result);
                updatePages();
                document.getElementById("tablinksTODO" + (todoList.length-1)).click();
                document.getElementById('submitTODO').removeEventListener('click',listener,false);
                document.getElementById("cancelTODO").click();

            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert(jqXHR.status + ' ' + jqXHR.responseText + ' ' + textStatus + ' ' + errorThrown);
            }
        });
    };
    document.getElementById('submitTODO').addEventListener('click',listener,false );


}

function addNoteTODO(id){
    showDialogTODONote();
    var listener = function() {
        var rez = document.getElementById('return_valueTODO').value;
        if(rez === null || rez === "" || rez === undefined)
            return;
        $.ajax({
            type: 'POST',
            url: todoprefix + '/' + todoList[id].id, //ид списка в котором запись
            contentType: 'application/json; charset=utf-8',
            data: rez,
            dataType: 'json',
            async: true,
            success: function (result) {
                todoNote.push(result);
                updateNotes(id);
                document.getElementById('submitTODO').removeEventListener('click',listener,false);
                document.getElementById("cancelTODO").click();

            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.status + ' ' + jqXHR.responseText + ' ' + textStatus + ' ' + errorThrown);
            }
        });
    };
    document.getElementById('submitTODO').addEventListener('click',listener,false);
}

function deleteTabTODO(id)
{
    if(id < 0)
        return;
    var name = "";
    todoList.forEach(function(val)
    {
        if(val.id === id)
            name = val.name;
    });
    showDialogTODOListSubmit(name);
    var listener = function () {
        $.ajax({
            type: 'DELETE',
            url:  todoprefix + '/' , //ид списка в котором запись
            contentType: 'application/json; charset=utf-8',
            data: id.toString(),
            dataType: 'json',
            async: true,
            success: function(result) {
                todoList = todoList.filter(
                    function (val) {
                        return val.id != result;
                    }
                );
                updatePages();
                if(todoList.length > 0) {
                    document.getElementById("tablinksTODO0").click();
                }
                document.getElementById('submitTODONote').removeEventListener('click',listener,false);
                document.getElementById("cancelTODONote").click();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert(jqXHR.status + ' ' + jqXHR.responseText + ' ' + textStatus + ' ' + errorThrown);
            }
        });
    };
    document.getElementById('submitTODONote').addEventListener('click',listener,false);

}

function deleteNoteTODO(id,note)
{
    if(id < 0 || note<0)
        return;
    var name = "";
    todoList.forEach(function(val)
    {
        if(val.id === id)
            name = val.name;
    });
    showDialogTODONoteSubmit(name);
    var listener = function () {
        $.ajax({
            type: 'DELETE',
            url: todoprefix + '/' + todoList[id].id, //ид списка в котором запись
            contentType: 'application/json; charset=utf-8',
            data: note.toString(),
            dataType: 'json',
            async: true,
            success: function (result) {
                todoNote = todoNote.filter(
                    function (val) {
                        return val.id != result;
                    }
                );
                updateNotes(id);
                document.getElementById('submitTODONote').removeEventListener('click',listener,false);
                document.getElementById("cancelTODONote").click();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.status + ' ' + jqXHR.responseText + ' ' + textStatus + ' ' + errorThrown);
            }
        });
    };
    document.getElementById('submitTODONote').addEventListener('click',listener,false);
}