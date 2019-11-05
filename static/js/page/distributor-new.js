$(document).ready(function () {
    $("Body").delegate(".distributor-function","click",function () {
        var function_name=$(this).attr("data-function-name");
        var order_panel_list=$(".order_panel");
        console.log(order_panel_list);
        for (var i in order_panel_list){
            var panel_function_name=order_panel_list[i].id;
            if (function_name===panel_function_name){
                $("#"+panel_function_name).show();
            }else{
                $("#"+panel_function_name).hide();
            }
        }
    })
})