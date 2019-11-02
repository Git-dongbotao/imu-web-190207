$(document).ready(function () {

    //打开和关闭侧边栏操作
    $("Body").delegate(".DSliderBar-Open","click",function () {
        var items=$(".DSliderBar").children();
        $(".DSliderBar").animate({width:'280px'},500);
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
    //输入框下划线的显示
    $("Body").delegate("input[type=text],input[type=password]","focus",function () {
            $(this).closest(".DInputGroup").addClass("selected");
    })
    $("Body").delegate("input[type=text],input[type=password]","blur",function () {
        $(this).closest(".DInputGroup").removeClass("selected");
    })

    //文件上传文本显示
    $("Body").delegate("input[type='file']","change",function () {
        var fileInfo=getFileInfo(this);
        $("#"+fileInfo.dataFor).val(fileInfo.fileName+"---"+fileInfo.fileSize+"---"+fileInfo.fileType);
    })
})
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
