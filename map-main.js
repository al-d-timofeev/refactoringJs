$(function () {
    "use strict";
    // Подстановка районов в список
    regionToList();
 
    // Выбор района на карте
    $("#region-map g").click(function () {// Отображение выбранного куска карты
        openRegionMap(this, false);
    });
 
    // Приравнивание высоты списка высоте карты, так как карта — квадратный рисунок с шириной 100% в колонке относительной ширины. Красивости, короче, визуальное выравнивание…
    var mapHeight = $(".region svg").height();
    $(".guz-list").css("height", "" + mapHeight + "");
    $(window).resize(function () {
        var mapHeight = $("#region-map").height();
        $(".guz-list").css("height", "" + mapHeight + "");
    }).resize();
});
 
$(document).on("click", "a.hosp_map", function () {
    var regName = $(this).data("region"),
        regTitle = $(this).attr("title"),
        guzIndex = $(this).attr("guz-index");
 
    $(".reg-title").text("" + regTitle + "");
    $(".guz-list li").remove();
    $("." + regName + ">g>a").hide();
    $("." + regName + ">g>a").eq(guzIndex - 1).show();
    $("." + regName + ">g>a").eq(guzIndex - 1).find("g").find("g").children("a").each(function () {
        var doctor = $(this).html(),
            class_rat = $(this).attr("class"),
            doctor_rating = $(this).data("rating");
        // Вставка элемента списка в легенду
        $(".guz-list").append('<li><a href="#" class="px-2 py-3 doctor"><p>' + doctor + '</p><p><b class="' + class_rat + '">' + doctor_rating + '</b></p></a></li>');
    })
});
 
// Скрытие куска карты по клику на карте вне куска
$(document).mouseup(function (e) {
    "use strict";
    var container = $(".big-region g");
    if (!container.is(e.target) && container.has(e.target).length === 0 && $(".big-region").is(e.target)) {
        container.parents("svg").addClass("fade");// Скрытие куска
        $("#region-map").removeAttr("style");// Отмена трансформации карты области
        $(".big-region>g>a").show();
        $(".reg-title").text("Выберите район");// Возвращение заголовок списка
        $(".guz-list li").remove();// Очистка списка
 
        // Подстановка районов обратно в список
        regionToList();
    }
});
 
// Скрытие его же по нажатию Esc
$(document).keyup(function (e) {
    if (e.keyCode === 27) {
        $(".big-region").addClass("fade"); // Скрываем кусок
        $("#region-map").removeAttr("style"); // Убираем стили трансформации карты области
        $(".reg-title").text("Выберите район"); // Убираем заголовок списка
        $(".guz-list li").remove(); // Очистка списка
 
        // Подстановка районов обратно в список
        regionToList();
    }
});
 
function regionToList() {
    $("#region-map g").each(function () {
        var elTitle = $(this).children("text").text(),
            regName = $(this).attr("id"),
            fill = $(this).attr("class"),
            regTitle = $(this).attr("title"),
            // Значения выбранных параметров — атрибуты добавляются группе, потому что класс с цветом фона в зависимости от значения параметра добавляется группе, чтобы потомки наследовали стили
            availabilityPrognosGuz = $(this).attr("availabilityprognosguz");
 
        $(".guz-list").append('<li><a href="#guz-list-header" class="px-2 py-3 no-pseudo" reg-name="' + regName + '" reg-title="' + regTitle + '" fill="' + fill + '"><p>' + elTitle + '</p><p><b class="availabilityPrognosGuz">' + availabilityPrognosGuz + '</b></p></a></li>');
 
        // Открытие карты и списка УЗ выбранного района
        $(".guz-list li a").click(function () {
            openRegionMap(this);
        });
 
    });
}
 
function openRegionMap($param, $listOrMap = true) {
 
    if ($listOrMap) {
        var regName = $($param).attr("reg-name"),
            fill = $($param).attr("fill"),
            regTitle = $($param).attr("reg-title");
    } else {
        var regName = $($param).attr("id"),
            fill = $($param).attr("class"),
            regTitle = $($param).attr("title");
    }
 
    $("." + regName).removeClass("fade");
    $("." + regName).children("g").attr("class", "" + fill + "");// Окраска куска в его цвет с общей карты
    $("#region-map").css("opacity", ".5").css("transform", "scale(.96)");
 
    // Вставка названия выбранного района в заголовок списка
    $(".reg-title").text("" + regTitle + "");
 
    // Очистка списка
    $(".guz-list li").remove();
 
    // Подстановка объектов с выбранного куска карты в список
    $("." + regName).children("g").children("a").each(function () {
        var guz = $(this).children("g"),
            guzHref = $(guz).parent("a").attr("href"),
            guzIndex = $(guz).children("text").text(),
            guzTypeMark = $(guz).children(":first")[0].nodeName,
            guzType = ($(guzTypeMark)[0].nodeName === "circle") ? ("guz-crb") : (($(guzTypeMark)[0].nodeName === "rect") ? ("guz-unit") : ("guz-fap")),
            guzTitle = $(guz).children("title"),
            guzName = $(guzTitle).text(),
            guzAddress = $(guzTitle).attr("address"),
            guzDoctors = $(guzTitle).attr("doctors"),
            guzPlaces = $(guzTitle).attr("places"),
            guzAllPlaces = $(guzTitle).attr("allplaces"),
            guzStatus = $(guz).attr("class");
        // Вставка элемента списка в легенду
        $(".guz-list").append('<li><a href="' + guzHref + '" class="px-2 py-3 hosp_map ' + guzType + ' ' + guzStatus + '" data-region="' + regName + '" title="' + guzName + '" guz-index="' + guzIndex + '"><p>' + guzName + '<br/><span class="small">' + guzAddress + '</span></p>' + (guzDoctors ? '<p class="doctors"><span>Врачи: ' + guzDoctors + '</span></p>' : '') + (guzPlaces ? '<p class="places"><span>Места: ' + guzPlaces + '/' + guzAllPlaces + '</span></p>' : '') + '</a></li>');
 
        // Замена значения "undefined" или отсутствия значения на крестик для красивости (чтобы таблицу не распидарасило, если что)
        $(".guz-list li a p b").text(function () {
            if ($(this).html() === "undefined" || $(this).html() === "") {
                $(this).text("×");
            }
        });
    });
}
