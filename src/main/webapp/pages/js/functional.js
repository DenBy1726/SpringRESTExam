
var prefix = '/functional';
var user = null;
var page = null;


    //обработчик кнопки добавить.
    var RestAdd = function() {
        var JSONObject= {
            'firstName': document.getElementById("exampleInputName").value,
            'lastName': document.getElementById("exampleInputLastName").value
        };

        $.ajax({
            type: 'POST',
            url:  prefix,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(JSONObject),
            dataType: 'text',
            async: true,
            success: function() {
                onUpdate(page.currentPage);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert(jqXHR.status + ' ' + jqXHR.responseText + ' ' + textStatus + ' ' + errorThrown);
            }
        });
    }


    //запрос на удаление id из бд
    var RestDelete = function(id) {
    $.ajax({
        type: 'DELETE',
        url:  prefix ,
        dataType: 'text',
        data: id,
        async: true,
        success : function(){
            onUpdate(page.currentPage);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.status + ' ' + jqXHR.responseText);
        }
    });
}

//функция обновляет таблицу в соответствии с коллекцией
var UpdateTable = function(collection){

    var tbl = '<tr>';
    for(var i = 0; i < collection.length; i++){
        tbl += '<td> ' + collection[i].firstName + ' </td>';
        tbl += '<td> ' + collection[i].lastName + ' </td>';

        if((user.role&2) != 0) {
            tbl += '<td>' + '<button type="reset" class="btn btn-danger" onclick=RestDelete("' +
                collection[i].id + '")><span class="glyphicon glyphicon-remove"></span> Del</button>' + '</td>';
        }
        else if((user.role&1) != 0) {
            tbl += '<td></td>';
        }

        tbl += '</tr><tr>';
    }
    tbl += '</tr>';
    document.getElementById("table").innerHTML = tbl;
}


//обновление панели пагинации
var UpdatePager = function(cur) {
    var str='<li>';

    for(var i =0; i<page.ammountOfPage; i++){
        if(cur !== undefined && cur == i){
            str += '<a href = "#" onclick="onUpdate(' + i + ')" class="paginationCurrent">' + i + '</a>';
        }
        else {
            str += '<a href = "#" onclick="onUpdate(' + i + ')">' + i + '</a>';
        }
        str += '</li>';
        str += '<li>';
    }
    str+='</li>';



    document.getElementById("MyPager").innerHTML = str;
}



//запрос на получение информации о пользователе
var GetCredential = function() {
    $.ajax({
        type: 'GET',
        url:  '/service/credential',
        async: false,
        success : function(result){
            user = result;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.status + ' ' + jqXHR.responseText);
        }
    });
}

//инициализауия при загрузке страницы
var onLoad = function() {
        GetCredential();
        setRoleText();
        onUpdate(0);
        document.getElementById("defaultOpen").click();
}

//обновление всего
var onUpdate = function(id) {
    $.ajax({
        type: 'GET',
        url: prefix + '/',
        dataType: 'json',
        data: {
            "page": id
        },
        async: true,
        success: function (result) {
            page = result;
            UpdatePager(id);
            UpdateTable(result.data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.status + ' ' + jqXHR.responseText + ' ' + textStatus + errorThrown);
        }
    })
}

var setRoleText = function(){
    rez = "";
    if((user.role&2) != 0) {
       rez += "Admin";
    }
    else if((user.role&1) != 0) {
        rez += "User";
    }
    rez += ": " + user.username;
    header.innerText = rez;
}