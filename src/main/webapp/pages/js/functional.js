
var prefix = '/functional';
var collection = null;
var curPage = 0;
var user = null;

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
            success: function(result) {
                Update();
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
        success : function(result){
            Update();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.status + ' ' + jqXHR.responseText);
        }
    });
}


//запрос на получение страницы на сервер. Возвращает коллекцию элементов
// в глобальную переменную collection
var Update = function() {
    $.ajax({
        type: 'GET',
        url: prefix + '/',
        dataType: 'json',
        data: {
            "page": curPage
        },
        async: true,
        success: function(result) {

            var str='<li>';

            for(var i =0; i<result.ammountOfPage; i++){

                str+='<a href = "#" onclick="RestPagination('+i+')">'+i+'</a>';
                str+='</li>';
                str+='<li>';
            }
            str+='</li>';
            document.getElementById("MyPager").innerHTML = str;
            RestPagination(curPage);

        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.status + ' ' + jqXHR.responseText + ' ' + textStatus + errorThrown);
        }
    });
}
//запрос на удаление id из бд
var RestPagination = function(page) {
    $.ajax({
        type: 'GET',
        url:  prefix + '/',
        dataType: 'json',
        data: {
            "page": page
        },
        async: true,
        success : function(result){
            UpdateTable(result.data);
            curPage = result.currentPage;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.status + ' ' + jqXHR.responseText);
        }
    });
}

var GetCredential = function() {
    $.ajax({
        type: 'GET',
        url:  '/service/credential',
        async: true,
        success : function(result){
            user = result;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.status + ' ' + jqXHR.responseText);
        }
    });
}

var Load = function() {
        GetCredential();
        Update();
}

