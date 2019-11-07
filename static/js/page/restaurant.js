$(document).ready(function () {
    //注册绑定分页器
    var total_page_number=parseInt($("#OrderList").find(".DPage").attr("data-total"));
    dPageInitialize("OrderList",total_page_number);
    $("Body").delegate("#OrderList .DPage-Item","click",function () {
        chagePage(this);
    })
    //切换功能面板
    $("Body").delegate(".r-operate-menu a","click",function () {
        var forPanelName=$(this).attr("data-for");
        var panel_list=$(".panel");
        if(forPanelName===undefined){
            alert("抱歉，该功能暂未实现")
        }else {
            $.each($(".r-operate-menu").find("a"),function () {
                $(this).removeClass("selected");
            })
            $(this).addClass("selected");
            for (var i=0;i<panel_list.length;i++){
                var panelName=panel_list[i].id;
                if (panelName===forPanelName&&forPanelName==="OrderList"){
                    $("#RestaurantOrder").attr("data-content","0");
                    $("#"+panelName).show();
                }else if(panelName===forPanelName){
                    $("#"+panelName).show();
                }else{
                    $("#"+panelName).hide();
                }
            }
        }
    })
    //添加购物车
    $("Body").delegate(".food-item-operate .icon-jiahao2","click",function () {
        var food_item=new Object();
        var food_item_dom=$(this).parents(".food-list-item");
        food_item["id"]=$(this).parents(".food-list-item").attr("data-food-itemid");
        food_item["name"]=$(this).parents(".food-list-item").find(".food-item-name").html();
        food_item["price"]=$(this).parents(".food-list-item").find(".badge-danger span").html();
        food_item["image_path"]=$(food_item_dom).find("img").attr("src");
        var number=1+parseInt($(food_item_dom).find(".food-item-number").html());
        $(food_item_dom).find(".food-item-number").html(number);
        var buy_food_items=$(".buy-food-item");
        var flag=true;
        for (var i in buy_food_items){
            if (food_item.id===$(buy_food_items).eq(i).attr("data-food-id")){
                flag=false;
                var old_number=$(buy_food_items).eq(i).find(".food-number").html();
                var new_number=parseInt(old_number)+1;
                $(buy_food_items).eq(i).find(".food-number").html(new_number);
                break;
            }
        }
        if (flag){
            addFoodItemToBuyCart(food_item);
        }
        calculateAll();
    })
    //减少购物车icon-jianhao
    $("Body").delegate(".food-item-operate .icon-jianhao","click",function () {
        var food_item_dom=$(this).parents(".food-list-item");
        var food_item_id=$(this).parents(".food-list-item").attr("data-food-itemid");
        var number=parseInt($(food_item_dom).find(".food-item-number").html())-1;
        if (number<0){
            $(food_item_dom).find(".food-item-number").html("0");
        }else{
            $(food_item_dom).find(".food-item-number").html(number);
        }
        var buy_food_items=$(".buy-food-item");
        var removeIndex=-1;
        for (var i in buy_food_items){
            if (food_item_id===$(buy_food_items).eq(i).attr("data-food-id")){
                if (number>0){
                    $(buy_food_items).eq(i).find(".food-number").html(number);
                }else {
                    removeIndex=i;
                }
                break;
            }
        }
        if (removeIndex!=-1){
            $(buy_food_items).eq(removeIndex).remove();
        }
        calculateAll();
    })
    //直接从购物车中删除元素
    $("Body").delegate(".food-operate .icon-shanchu","click",function () {
        var bu_food_item=$(this).parents(".buy-food-item");
        var food_item_id=$(this).parents(".buy-food-item").attr("data-food-id");
        $(bu_food_item).remove();
        var food_list_items=$(".food-list").find(".food-list-item");
        for(var i=0;i<food_list_items.length;i++){
            if ($(food_list_items).eq(i).attr("data-food-itemid")===food_item_id){
                $(food_list_items).eq(i).find(".food-item-number").html(0);
                break;
            }
        }
        calculateAll();
    })
    //购物车中更改元素
    $("Body").delegate(".food-operate .icon-jiahao2","click",function () {
        var bu_food_item=$(this).parents(".buy-food-item");
        var food_item_id=$(this).parents(".buy-food-item").attr("data-food-id");
        var number=parseInt($(this).parents(".buy-food-item").find(".food-number").html())+1;
        $(this).parents(".buy-food-item").find(".food-number").html(number);
        var food_list_items=$(".food-list").find(".food-list-item");
        for(var i=0;i<food_list_items.length;i++){
            console.log($(food_list_items).eq(i).attr("data-food-itemid"));
            if ($(food_list_items).eq(i).attr("data-food-itemid")===food_item_id){
                var number=parseInt($(food_list_items).eq(i).find(".food-item-number").html())+1;
                $(food_list_items).eq(i).find(".food-item-number").html(number);
                break;
            }
        }
        calculateAll();
    })
    $("Body").delegate(".food-operate .icon-jianhao","click",function () {
        var buy_food_item=$(this).parents(".buy-food-item");
        var food_item_id=$(buy_food_item).attr("data-food-id");
        var number=parseInt($(buy_food_item).find(".food-number").html())-1;

        if (number>0){
            $(buy_food_item).find(".food-number").html(number);
        }else{
            $(buy_food_item).remove();
        }
        var food_list_items=$(".food-list").find(".food-list-item");
        for(var i=0;i<food_list_items.length;i++){
            console.log($(food_list_items).eq(i).attr("data-food-itemid"));
            if ($(food_list_items).eq(i).attr("data-food-itemid")===food_item_id){
                if (number>0){
                    $(food_list_items).eq(i).find(".food-item-number").html(number);
                }else{
                    $(food_list_items).eq(i).find(".food-item-number").html(0);
                }
                break;
            }
        }
        calculateAll();
    })
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
    //监听加载更多按钮
    $("Body").delegate("#LoadMore","click",function () {
        var testFoodItems=new Array();
        testFoodItems[0]={id:"food13",name:"牛肉拉面",price:"13"}
        testFoodItems[1]={id:"food14",name:"四川冒菜",price:"26"}
        testFoodItems[2]={id:"food15",name:"烤羊腿",price:"231"}
        testFoodItems[3]={id:"food16",name:"麻辣小龙虾",price:"121"}
        for (var i in testFoodItems){
            addFoodItemToList(testFoodItems[i]);
        }
    })
    //下单
    $("Body").delegate("#MadeOrder","click",function () {
        var order_item=getTestOrderItem();
        var buy_food_items=$("#ShoppingCart").find(".buy-food-item");
        if (buy_food_items.length>0){
            for (var i=0;i<buy_food_items.length;i++){
                order_item["foodList"][i]=$(buy_food_items).eq(i).find(".buy-food-name").html()+" * "+$(buy_food_items).eq(i).find(".food-number").html();
            }
            addOrderItem(order_item);
            var data_content=parseInt($("#RestaurantOrder").attr("data-content"))+1;
            $("#RestaurantOrder").attr("data-content",data_content);
            feedback("下单成功");
            clearBuyCar();
        }else{
            feedback("您还未点餐");
        }
    })
    //接受订单
    $("Body").delegate(".AcceptOrder","click",function () {
        var id=$(this).parents(".r-order-item").attr("id");
        var item=testOrderList[id];
        var html=updateState(item,1);
        $(this).parents(".r-order-item").find(".r-order-state").html(html);
    })
    $("Body").delegate(".CancelOrder","click",function () {
        var id=$(this).parents(".r-order-item").attr("id");
        var item=testOrderList[id];
        var html=updateState(item,4);
        $(this).parents(".r-order-item").find(".r-order-state").html(html);
    })
})
function calculateAll() {
    var buy_food_items=$("#ShoppingCart").find(".buy-food-item");
    var sum=0;
    for (var i=0;i<buy_food_items.length;i++){
        var price=$(buy_food_items).eq(i).find(".badge span").html();
        var number=$(buy_food_items).eq(i).find(".food-number").html();
        sum+=parseFloat(price)*parseInt(number);
    }
    $("#AllPrice span").html(sum);
}
function clearBuyCar() {
    var buy_food_items=$(".buy-food-item");
    var food_item_ids=new Array();
    for (var i=0;i<buy_food_items.length;i++){
        food_item_ids[i]=$(buy_food_items).eq(i).attr("data-food-id");
    }
    $(buy_food_items).remove();
    for (var i=0;i<food_item_ids.length;i++){
        var food_list_items=$(".food-list").find(".food-list-item");
        for(var j=0;i<food_list_items.length;j++){
            console.log($(food_list_items).eq(j).attr("data-food-itemid"));
            if ($(food_list_items).eq(j).attr("data-food-itemid")==food_item_ids[i]){
                $(food_list_items).eq(j).find(".food-item-number").html(0);
                break;
            }
        }
    }
    calculateAll();
}
function addFoodItemToBuyCart(food_item) {
    $("#ShoppingCart").append(
        "<li data-food-id='"+food_item.id+"' class=\"DSliderBar-Item buy-food-item\">\n" +
        "                <div class=\"row\">\n" +
        "                    <div class=\"col-5\">\n" +
        "                        <img src='"+food_item.image_path+"'/>\n" +
        "                    </div>\n" +
        "                    <div class=\"col-7 food-info\">\n" +
        "                        <div class=\"row\">\n" +
        "                            <div class=\"col-12\">\n" +
        "                                <div class='buy-food-name'>"+food_item.name+"</div>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                        <div class=\"row\">\n" +
        "                            <div class=\"col-12\">\n" +
        "                                <div class=\"badge badge-danger\">￥<span>"+food_item.price+"</span></div>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                        <div class=\"row\">\n" +
        "                            <div class=\"col-12\">\n" +
        "                                <div class=\"food-operate float-right\">\n" +
        "                                    <i class=\"iconfont icon-jianhao\"></i>\n" +
        "                                    <span class=\"food-number\">1</span>\n" +
        "                                    <i class=\"iconfont icon-jiahao2\"></i>\n" +
        "                                    <i class=\"iconfont icon-shanchu\"></i>\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "            </li>"
    );
}

function addFoodItemToList(food_item) {
    $(".food-list").eq(0).append(
        "<div data-food-itemid='"+food_item.id+"' class=\"col-sm-12 col-md-6 col-lg-4 food-list-item\">\n" +
        "                        <div class=\"card\">\n" +
        "                            <div class=\"card-body\">\n" +
        "                                <div class=\"row\">\n" +
        "                                    <div class=\"col-12\">\n" +
        "                                        <img src=\"../static/images/foods/"+food_item.id+".jpg\"/>\n" +
        "                                    </div>\n" +
        "                                </div>\n" +
        "                                <div class=\"row food-item-info\">\n" +
        "                                    <div class=\"col-12\">\n" +
        "                                        <div class=\"food-item-name\">"+food_item.name+"</div>\n" +
        "                                    </div>\n" +
        "                                    <div class=\"col-12\">\n" +
        "                                        <div class=\"badge badge-danger\">￥<span>"+food_item.price+"</span></div>\n" +
        "                                    </div>\n" +
        "                                    <div class=\"col-12\">\n" +
        "                                        <div class=\"food-item-operate float-right\">\n" +
        "                                            <i class=\"iconfont icon-jianhao icon-active\"></i>\n" +
        "                                            <span class=\"food-item-number\">0</span>\n" +
        "                                            <i class=\"iconfont icon-jiahao2 icon-active\"></i>\n" +
        "                                            <i class=\"iconfont icon-shanchu\"></i>\n" +
        "                                        </div>\n" +
        "                                    </div>\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                    </div>"
    )
}

//渲染订单
var stateMap=new Array();
stateMap["0"]={stateName:"未接单"}
stateMap["1"]={stateName:"未配送",stateBg:"bg-danger"}
stateMap["2"]={stateName:"正在配送",stateBg:"bg-info"}
stateMap["3"]={stateName:"已完成",stateBg:"bg-success"}
stateMap["4"]={stateName:"已取消",stateBg:"bg-secondary"}
function addOrderItem(order_item) {
    var html="<div id='"+order_item.id+"' class=\"card r-order-item\"><div class=\"card-body\"><div class=\"row\"><div class=\"col-lg-1\">" +
        "<div class=\"badge badge-secondary\">订单编号</div><span>"+order_item.id+"</span></div><div class=\"col-lg-2\">" +
        "<div class=\"badge badge-secondary\">顾客姓名</div><br><span>"+order_item.customName+"</span><br>" +
        "<div class=\"badge badge-secondary\">联系方式</div><span>"+order_item.customPhone+"</span></div><div class=\"col-lg-3\">" +
        "<div class=\"badge badge-secondary\">配送地址</div><br><span>"+order_item.customAddr+"</span></div><div class=\"col-lg-2\">" +
        "<div class=\"badge badge-secondary\">下单时间</div><br><span>"+order_item.createTime+"</span></div><div class=\"col-lg-2\">" +
        "<div class=\"row\"><div class=\"col-12\">" +
        "<button type=\"button\" class=\"btn btn-outline-secondary btn-sm btn-block\" data-toggle=\"collapse\" data-target=\"#order"+order_item.id+"\">菜单详情</button></div></div>" +
        "<div id=\"order"+order_item.id+"\" class=\"row collapse\"><div class=\"col-12\"><ul class=\"order-food-list\">";

    for (var i=0;i<order_item.foodList.length;i++){
        html+="<li>"+order_item.foodList[i]+"</li>";
    }

    html+="</ul></div></div><div class=\"row\"><div class=\"col-12\">" +
        "<div class=\"badge badge-danger\">￥<span>"+order_item.price+"</span></div></div></div></div>\n";

    html+="<div class=\"col-lg-2 r-order-state \">";
    html+=updateState(order_item);
    html+="</div>";

    $("#RestaurantOrderList").prepend(html);
}
//更新状态渲染
function updateState(order_item,new_state) {
    if (new_state!==undefined){
        order_item.state=new_state;
    }
    var str="";
    if(order_item.state==2||order_item.state==3){
        str+="<div class=\"row\"><div class=\"col-12\"><div class=\"state "+stateMap[order_item.state.toString()].stateBg+"\">" +
            ""+stateMap[order_item.state.toString()].stateName+"</div></div>" +
            "<div class=\"row\"><div class=\"col-12\">" +
            "<div class=\"badge badge-secondary\">配送员姓名</div><br><span>"+order_item.staffName+"</span><br>" +
            "<div class=\"badge badge-secondary\">联系方式</div><br><span>"+order_item.staffPhone+"</span></div></div>"
    }else if (order_item.state==0){
        str+= "<button type=\"button\" class=\"btn btn-outline-danger btn-block AcceptOrder\">接受订单</button>" +
            "<button type=\"button\" class=\"btn btn-outline-danger btn-block CancelOrder\">取消订单</button></div>"
    }else if (order_item.state==1||order_item.state==4){
        str+="<div class=\"row\"><div class=\"col-12\"><div class=\"state "+stateMap[order_item.state.toString()].stateBg+"\">" +
            ""+stateMap[order_item.state.toString()].stateName+"</div></div></div>";
    }
    return str;
}
//测试存储订单
var testOrderList=new Array();
function getTestOrderItem() {
    var custom=[
        {name:'随机姓名',phone:"随机电话"},
        {name:'董博韬',phone:"15984918367"},
        {name:'高佳星',phone:"15123123167"},
        {name:'王加峰',phone:"15981212367"},
        {name:'马英',phone:"15984912367"}];

    var order_item=new Object();
    var id=Math.floor(Math.random()*10000)+1;
    var custom=custom[Math.floor(Math.random()*3)+1];
    order_item["id"]=id;
    order_item["customName"]=custom.name;
    order_item["customPhone"]=custom.phone;
    order_item["customAddr"]="内蒙古大学-东区-2号楼";
    order_item["foodList"]=new Array();
    order_item["state"]="0";
    order_item["createTime"]=getCurrentTime();
    order_item["price"]=$("#AllPrice span").html();
    testOrderList[order_item.id]=order_item;
    return order_item;
}
