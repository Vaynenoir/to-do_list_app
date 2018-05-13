$(document).ready(function(){

  function refresh(){
    $('input[name=ListItem]').val("");
    $('input[name=task_description]').val("");
    $('input[type=radio]').each(function () { $(this).prop('checked', false); });
  }

  Array.prototype.sortOn = function(key){
      this.sort(function(a, b){
          if(a[key] < b[key]){
              return -1;
          }else if(a[key] > b[key]){
              return 1;
          }
          return 0;
      });
  }


  $("#sort_by_name").on("click", function(){
      $('#tasks_table__body').children().remove();
      $('#task_table').fadeOut(200);
      dataArray.sortOn('task_name');
      restore_data();
      tasks_to_delete();
      console.log(dataArray);
  });

  $("#sort_by_priority").on("click", function(){
      $('#tasks_table__body').children().remove();
      $('#task_table').fadeOut(200);
      dataArray.sortOn('priority_index');
      restore_data();
      tasks_to_delete();
      console.log(dataArray);
  });

  function tasks_to_delete(){
    $("a.delete_task").on("click", function(){
    var full_tr = $(this).closest('tr').children();
    var name_to_delete = full_tr[0].innerHTML;
    // $(this).closest('tr').fadeOut(200).remove(200);
    for(var i = 0; i < dataArray.length; i++){
      if(name_to_delete == dataArray[i].task_name){
        dataArray.splice(i, 1);
      }
    }
    localStorage.setItem('data', JSON.stringify(dataArray));
     $(this).closest('tr').fadeOut(200);
    // restore_data();
    if(dataArray.length == 0){
      $('#task_table').fadeOut(200);
    }
    console.log(dataArray);
 });
  }


  function getDate(date) {

  var days = date.getDate();
  if (days < 10) days = '0' + days;

  var month = date.getMonth() + 1;
  if (month < 10) month = '0' + month;

  var year = date.getFullYear();
  if (year < 10) year = '0' + year;

  var hours  = date.getHours();
  var minutes = date.getMinutes();

  return days + '.' + month + '.' + year;
}

  function getTime(date){
    var hours  = date.getHours();
    if (hours < 10) hours = '0' + hours;
    var minutes = date.getMinutes();
    if(minutes < 10) minutes = '0' + minutes;
    return hours + ':' + minutes;
  }

  var dataArray = JSON.parse(localStorage.getItem("data")) || [];
  restore_data();

  function restore_data() {
    for (var i = 0; i < dataArray.length; i++) {
      $('#task_table').fadeIn(200);
      $('#tasks_table__body').append('<tr>' + '<td class="name_task">' + dataArray[i].task_name + '</td>' + '<td class="task_descr">' +dataArray[i].task_descr+ '</td>' + '<td class='+dataArray[i].priority+'>' +dataArray[i].priority+ '</td>' + '<td>'+dataArray[i].date+'</td>' + '<td>' + dataArray[i].time + '</td>' + "<td><a class='delete_task'><i class='material-icons'>cancel</i></a></td>" + '</tr>');
    }
  }

  function check_duplicate(task){
    for(var i = 0; i < dataArray.length; i++){
      if(task == dataArray[i].task_name){
        return 1;
      }
    }
    return 0;
  }

  $('#add_task').click(
      function(){

          var valid = 1;
          var task = $('input[name=ListItem]').val();
          var task_description = $('input[name=task_description]').val();
          var checkedRadio;
          var d = new Date();
          if($("input[type=radio]").hasClass('checked_item')){
            checkedRadio =  $(".checked_item").attr("name");    
          }else{
            alert("no priority, please add!");
            valid = 0;
          }


           if(task == "" || task_description == "" ){
            alert("please enter text");
            valid = 0;
           }

           var duplicate_flag = check_duplicate(task);
           if (duplicate_flag) {

            alert("this task already exists!");
            valid = 0;

           }
           if (valid) {
              $('#task_table').fadeIn(200);
              $('#tasks_table__body').append('<tr>' + '<td class="name_task">' + task + '</td>' + '<td class="task_descr">' +task_description+ '</td>' + '<td class=' + checkedRadio + '>' +checkedRadio+ '</td>' + '<td>'+getDate(d)+'</td>'+ '<td>' + getTime(d) + '</td>' + "<td><a class='delete_task'><i class='material-icons'>cancel</i></a></td>" + '</tr>')
              


              var dataObject = { 
                task_name: task, 
                task_descr: task_description, 
                priority: checkedRadio, 
                date: getDate(d),
                time: getTime(d),
                priority_index: ""
              };
              if (checkedRadio == "high") {
                dataObject.priority_index = "A";
              }
              if (checkedRadio == "middle") {
                dataObject.priority_index = "B";
              }
              if (checkedRadio == "low") {
                dataObject.priority_index = "C";
              }                            

              dataArray.push(dataObject);
              console.log(dataArray);
              localStorage.setItem('data', JSON.stringify(dataArray));
              refresh();
           }

           tasks_to_delete();
      });
   
        tasks_to_delete();

   $("input[name=ListItem]").keydown(function(event){
      if(event.keyCode == 13){
        $("#add_task").click();
        return false;
      }         
  });

   $("input[type=radio]").on("click", function(){
      $("input[type=radio]").removeClass("checked_item");
      $('input[type=radio]').each(function () { $(this).prop('checked', false); });
      var checkedRadio = $(this).prop('checked', true);
      var radio_name = $(this).attr("name");
      $(this).addClass("checked_item");
   });

   $('#clear_tasks').on('click', function(){
    dataArray = [];
    $('#tasks_table__body').children().remove();
    $('#task_table').fadeOut(200);
    localStorage.clear();
    restore_data();
   });
      


});
