$(document).ready(function () {

    //打开和关闭侧边栏操作
    $("Body").delegate(".DSliderBar-Open","click",function () {
        var items=$(".DSliderBar").children();
        $(".DSliderBar").animate({width:'375px'},500);
        $.each(items,function () {
            $(this).show(200);
        })
    })

    $("Body").delegate(".DSliderBar-Close","click",function () {
        var items=$(".DSliderBar").children();
        $.each(items,function () {
            $(this).hide(200);
        })
        $(".DSliderBar").animate({width:'0px'},500);
    })
    //打开和关闭弹出窗操作
    $("Body").delegate(".DPopup-Open","click",function () {
        var panelName=$(this).attr("data-for");
        $(".DMask").css("display","inline-block");
        $("#"+panelName).fadeIn(500);
    })

    $("Body").delegate(".DPopup-Close","click",function () {
        $(".DMask").css("display","none");
        $(this).closest(".DPopup").fadeOut(500);
    })
    //文件上传文本显示
    $("Body").delegate("input[type='file']","change",function () {
        var fileInfo=getFileInfo(this);
        $("#"+fileInfo.dataFor).val(fileInfo.fileName+"---"+fileInfo.fileSize+"---"+fileInfo.fileType);
    })
})
//feedback
function feedback(message) {
    $(".dui.feedback").html(message);
    $(".dui.feedback").slideDown();
    setTimeout(clearFeedback,3000);
}
function clearFeedback() {
    $(".dui.feedback").slideUp();
}
//获取当前时间"YYYY-MM-DD hh:mm:ss"
function getCurrentTime(){
    var nowDate = new Date();
    var year = nowDate.getFullYear();
    var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
    var date = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
    var hour = nowDate.getHours()< 10 ? "0" + nowDate.getHours() : nowDate.getHours();
    var minute = nowDate.getMinutes()< 10 ? "0" + nowDate.getMinutes() : nowDate.getMinutes();
    var second = nowDate.getSeconds()< 10 ? "0" + nowDate.getSeconds() : nowDate.getSeconds();
    return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;
}
//提供的接口区
//文件上传对外接口
function getFileInfo(fileElement) {
    var files=$(fileElement)[0].files;
    var file=files[0];
    var dataFor=$(fileElement).attr("data-for");
    var fileName=file.name;
    var str=fileName.split(".");
    var fileType=str[str.length-1];
    var fileSize=file.size;
    var sizeType=["B","KB","MB","GB"];
    var i=0
    while (fileSize>=1024){
        fileSize=fileSize/1024;
        i++;
    }
    var fileSize=fileSize.toFixed(0);
    var sizeFormat=fileSize+sizeType[i];
    return {"fileName":fileName,"fileSize":sizeFormat,"dataFor":dataFor,"fileType":fileType};
}
/*
*
* 分页器的使用说明
* 1.此分页器只有最多是10个分页元素
* 1.在html文件中所需添加分页器的元素下面添加 <div class="DPage" data-current="1" data-total="10" data-first="1"></div>
*  参数说明：data-current="当前分页器选择的页面索引值"  data-total="（数据量/展示数据量）计算出一共多少页" data-first="1" 当前分页器展示分页值的第一个数值（最左面）
* 2.在页面的js文件中绑定分页器与对应的列表元素或者表格，并根据total动态生成分页元素 dPageInitialize(elementIdName,total)
* 3.对分页元素进行点击事件监听，进行分页，要先使用chagePage()更新页面元素再调用update(具体渲染方法自定义)，默认提供了对表格的重新渲染方法，详情看updateTableData()方法的说明
*       例如：
*               dPageInitialize("transaction_tale",total);
*               $("Body").delegate("#transaction_tale .DPage-Item","click",function () {
                        chagePage(this);
                        var current_page=$("#transaction_tale .DPage").attr("data-current");
                        var item_attr=["enterprise_name","product_name","region_of_origin","transaction_volume"];
                        updateTransactionTable(current_page,10);
                })
               function updateTransactionTable(page_number,page_size) {
                    $("#transaction_tale tbody").html("");
                    var start=(page_number-1)*page_size;
                    var end=page_number*page_size;
                    var item_name="enterprise_name";
                    for (var i=start;i<end;i++){
                        $("#transaction_tale tbody").append(
                            "<tr>\n" +
                            "   <th>"+test_data[i][item_name]+"</th>\n" +
                            "   <th>"+test_data[i].product_name+"</th>\n" +
                            "   <th>"+test_data[i].region_of_origin+"</th>\n" +
                            "   <th>"+test_data[i].transaction_volume+"</th>\n" +
                            "   <th>"+test_data[i].transaction_spread+"</th>\n" +
                            "   <th>"+test_data[i].participating_market_power+"</th>\n" +
                            "   <th>"+test_data[i].settlement_power+"</th>\n" +
                            "   <th>"+test_data[i].spread_tariff+"</th>\n" +
                            "   <th>"+test_data[i].liquidated_damages_deviation_electric_charge_yuan+"</th>\n" +
                            "   <th>"+test_data[i].settlement_tariff+"</th>\n" +
                            "   <th>"+test_data[i].remarks+"</th>\n" +
                            "</tr>"
                        )
                    }
                }
*
*/
//分页对外接口
function dPageInitialize(elementIdName,total) {
    var current=$("#"+elementIdName).find(".DPage").attr("data-current");
    $("#"+elementIdName).find(".DPage").attr("data-total",total);
    total=$("#"+elementIdName).find(".DPage").attr("data-total");
    var elementStr="<a class=\"DPage-Item Pre\"><i class=\"iconfont icon-arrow-left-no-radius\"></i></a>";
    if(total<11){
       elementStr+=generatePageItem(total,current);
    }else{
        elementStr+=generatePageItem(10,current);
    }
    elementStr+="<a class=\"DPage-Item Next\"><i class=\"iconfont icon-icon-top-copy\"></i></a>";
    $("#"+elementIdName).find(".DPage").html(elementStr);
}
function generatePageItem(number,current) {
    var contentStr="";
    for(var i=1;i<=number;i++){
        if (i==current){
            contentStr+="<a class='DPage-Item selected' >"+i+"</a>";
        }else{
            contentStr+="<a class='DPage-Item' >"+i+"</a>";
        }
    }
    return contentStr;
}
function updatePageNavigation(parent,first) {
    var items=$(parent).find(".DPage-Item:not('.Pre,.Next')");
    $.each(items,function () {
        $(this).html(first);
        first+=1;
    })
}
//改变分页器视图接口
function chagePage(thisElement) {
    //获取分页表处理器参数
    var parent=$(thisElement).parent(".DPage");
    var current=parseInt($(parent).attr("data-current"));
    var total=parseInt($(parent).attr("data-total"));
    var first=parseInt($(parent).attr("data-first"));
    var last=first+9;
    //获取分页视图集合
    var items=$(thisElement).parent(".DPage").children(".DPage-Item:not('.Pre,.Next')");
    var selectedIndex=$(items).filter(".selected").index()-1;

    if ($(thisElement).hasClass("Pre")&&(current-1)>0){
        if (selectedIndex>0){
            $(items).eq(selectedIndex).removeClass("selected");
            $(items).eq(selectedIndex-1).addClass("selected");
            $(parent).attr("data-current",current-1);
        }else if (current-1>0){
            $(parent).attr("data-current",current-1);
            $(parent).attr("data-first",first-1);
            updatePageNavigation(parent,first-1);
        }
    }else if($(thisElement).hasClass("Next")&&current<total){
        if(selectedIndex<9){
            $(items[selectedIndex]).removeClass("selected");
            $(items).eq(selectedIndex+1).addClass("selected");
            $(parent).attr("data-current",current+1);
        }else if(total-current>0){
            $(parent).attr("data-current",current+1);
            $(parent).attr("data-first",first+1);
            updatePageNavigation(parent,first+1);
        }
    }else if(!$(thisElement).hasClass("Pre")&&!$(thisElement).hasClass("Next")){
        var html=parseInt($(thisElement).html());
        $(items[selectedIndex]).removeClass("selected");
        $(thisElement).addClass("selected");
        $(parent).attr("data-current",html);
    }
}
/*
仅针对与table的数据更新渲染
参数
page_number-第几个页面，一般先修改分页器内容即使用chagePage（）方法，获取所需的页面索引号
page_size-这个页面展示数据量
table_id_name 数据展示到哪个table中
items 数据源
item_attr   所要展示数据的属性名集合
*/
function updateTableData(page_number,page_size,table_id_name,items,item_attr) {
    $("#"+table_id_name+" tbody").html("");
    var start=(page_number-1)*page_size;
    var end=page_number*page_size;
    var html="";
    for (var i=start;i<end;i++){
        html+="<tr>";
        for (var j=0;j<item_attr.length;j++){
            html+="<td>"+items[i][item_attr[j]]+"</td>";
        }
        html+="</tr>";
    }
    console.log(html);
    $("#"+table_id_name+" tbody").append(html);

}
