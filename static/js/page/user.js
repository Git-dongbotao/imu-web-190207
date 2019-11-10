$(document).ready(function () {
    //初始化wow.js
    new WOW().init();

    $(window).scroll(function(){
        var top = $(document).scrollTop();
        if(top > 300){
            $(".dui.header").removeClass("bg-transparent");
            $(".dui.header").addClass("bg-white");
        }else{
            $(".dui.header").removeClass("bg-white");
            $(".dui.header").addClass("bg-transparent");
        }
    })

    $("Body").delegate("#UserHeadingFile","change",function () {
        img_dom1=$("#CurrentUserHeading")[0];
        img_dom2=$("#CurrentUserImg")[0];
        selectImage(this,img_dom1);
        selectImage(this,img_dom2);
    })

    $("Body").delegate("#OpenUpdate","click",function () {
        //取消不可用状态
        var inputs=$("#CurrentUserInfo").find("input");
        $.each(inputs,function () {
            $(this).removeAttr("disabled");
        })
        $("#CurrentUserInfo").find("textarea").removeAttr("disabled");
        //隐藏展现按钮
        $("#OpenUpdate").hide();
        $(".DInputGroup.Upload").show();
        $("#SaveUpdate").show();
        $("#CancelUpdate").show();

    })
    $("Body").delegate("#CancelUpdate","click",function () {
        cancelUpdate();
    })
    //用户信息修改
    $("Body").delegate("#SaveUpdate","click",function () {
        var user=new Object();
        user.name=$("#CurrentUserName").val();
        user.phone=$("#CurrentUserPhone").val();
        user.email=$("#CurrentUserEmail").val();
        user.region=$("#CurrentUserRegion").val();
        user.address=$("#CurrentUserAddress").val();
        console.log(user);
        feedback(user);
        cancelUpdate();

    })

})
function cancelUpdate() {
    var inputs=$("#CurrentUserInfo").find("input");
    $.each(inputs,function () {
        $(this).attr("disabled",true);
    })
    $("#CurrentUserInfo").find("textarea").attr("disabled",true);
    //隐藏展现按钮
    $("#OpenUpdate").show();
    $(".DInputGroup.Upload").hide();
    $("#SaveUpdate").hide();
    $("#CancelUpdate").hide();
}