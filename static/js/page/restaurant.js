$(document).ready(function () {
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
})