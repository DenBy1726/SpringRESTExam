var todoprefix = '/todo';
var todoList = null;
var todoNode = null;
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
                rez = '';
                rez2 = '';

                rez += '<table width="100%">';
                for(var i=0;i<todoList.length;i++){
                    rez += '<tr>';
                    //добавляем вкладки с названиями категории тодо и кнопку удалить вкладку
                    rez += '<td>';
                    rez +='<button class="tablinksTODO" onclick="openTabTODO(event, tab'+i+','+i+')" >' + todoList[i].name + '</button>';
                    rez += '</td><td class="close">';
                    rez += '<button class="glyphicon glyphicon-remove"></button>';
                    rez += '</td>';
                    rez += '</tr>';

                    //добавляем поля для отображения списка тодо
                    rez2 += '   <div id="tab'+i+'"  class="tabcontentTODO">\n' + '</div>';
                }

                rez += '</table>';

                //добавим кнопку добавить
                rez += '<button class="tablinksTODO" onclick="openTabTODO(event, tab'+i+','+i+')" >' + "Добавить" +'</button>';

                document.getElementById("tabTODO").innerHTML = rez;
                document.getElementById("TODO").innerHTML += rez2;


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
        document.getElementById("tab0").click();
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
                todoNode = result;
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
    todoNode[id].checkmark = !todoNode[id].checkmark;
    var JSONObject= {
        'id': todoNode[id].id,//ид записи которою меняем
        'checkmark': todoNode[id].checkmark
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
    sortTODONote();
    updateNotes(tabId);
}

//Обновляет список всех записей для текущего тодо
function updateNotes(id,evt)
{
    // Declare all variables
    var i, tabcontent, tablinks,rez = '';

    rez += '<table width="100%">';
    //заполняем содержимым
    for(i=0;i<todoNode.length;i++) {
        //добавляем записи с названиями  тодо и кнопку удалить для каждой записи
        rez += '<tr><td>';

        rez += '<input type="checkbox" name="vehicle1" value="Bike" onclick=checkUpdate('+ (id+','+i) +') ';
        if (todoNode[i].checkmark == true)
            rez += ' checked';
        if(todoNode[i].checkmark == true)
            rez +='><del>'+ todoNode[i].name + '</del><br>';
        else
            rez += '>' + todoNode[i].name + '<br>';

        rez += '</td><td class="close">';
        rez += '<button class="glyphicon glyphicon-remove "></button>';
        rez += '</td>';
        rez += '</tr>';
    }
    rez += '</table>';

    //добавим кнопку добавить
    rez += '<button class="tablinksTODO" onclick="openTabTODO(event, tab'+i+','+i+')" >' + "Добавить" +'</button>';

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
    if(todoNode === null)
        return;

    var checkedTodo = todoNode.filter(function(val)
        {
            if(val.checkmark === true)
                return val;
        }
    )

    var unCheckedTodo = todoNode.filter(function(val)
        {
            if(val.checkmark === false)
                return val;
        }
    )

    todoNode = unCheckedTodo.concat(checkedTodo);

}

function addTODO(name)
{

}