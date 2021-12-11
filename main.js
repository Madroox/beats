// всплывающее меню секции offers
let offersList = document.querySelector(".offers");

offersList.addEventListener("mouseover", function (event) {
    let cursor = $(event.target);
    let findBlock = cursor.children(".settings__list");
    if (findBlock) {
        let settingsGear = findBlock.closest(".settings__gear");
        settingsGear.addClass("block");
    }

})
offersList.addEventListener("mouseout", function (event) {
    let cursor = $(event.target);
    let findBlock = cursor.find(".settings__gear");
    findBlock.removeClass("block");
})

// всплывающее меню Гамбургер
let hamburger = document.querySelector(".hamburger");
let hideMenu = document.querySelector(".hide-menu");
let hideMenuClose = document.querySelector(".hide-menu__close");

hamburger.addEventListener("click", function (event) {
    if (event) {
        hideMenu.style.display = "block";
    }
})

hideMenuClose.addEventListener("click", function (event) {
    if (event) {
        hideMenu.style.display = "none";
    }
})

// Отзывы
let findBlock = (block) => {
    return $(".rewiews__person").filter((index, item) => {
        return $(item).attr("data-view") == block;
    })
}


$('.pagginator__element').on("click", function (e) {
    e.preventDefault();

    let click = $(e.currentTarget);
    let dataOpen = click.children(".pagginator__link").attr("data-open");
    let currentBlock = findBlock(dataOpen);
    let currentTarget = click.closest(".pagginator__element");
    currentBlock.addClass("isActive").siblings().removeClass("isActive");
    currentTarget.addClass("active").siblings().removeClass("active");
})

//Слайлер

const slider = $('.offers__list').bxSlider({
    pager: false,
    controls: false,
    slideMargin: 100,
    shrinkItems: true,
});
$(".arrow-left").on("click", e => {
    e.preventDefault();
    slider.goToPrevSlide();
})

$(".arrow-right").on("click", e => {
    e.preventDefault();
    slider.goToNextSlide();
})

//Модальное окно формы

const validateFilds = (form, fieldsArray) => {

    fieldsArray.forEach(field => {
        field.removeClass("input-error");
        if (field.val().trim() === "") {
            field.addClass("input-error");
        }

    })

    let errorNumber = form.find(".input-error");

    return errorNumber.length === 0;
}

$(".form").submit(e => {
    e.preventDefault();

    let form = $(e.currentTarget);
    let name = form.find("[name='name']");
    let phone = form.find("[name='phone']");
    let comment = form.find("[name='comment']");
    let to = form.find("[name='to']");
    let street = form.find("[name='street']");
    let building = form.find("[name='building']");
    let housing = form.find("[name='housing']");
    let flat = form.find("[name='flat']");
    let floor = form.find("[name='floor']");

    let modal = $("#modal");
    let modalContent = modal.find(".send-complate__title");


    const isValid = validateFilds(form, [name, phone, comment, to]);

    if (isValid) {

        $.ajax({
            url: "https://webdev-api.loftschool.com/sendmail",
            method: "post",
            data: {
                name: name.val(),
                phone: phone.val(),
                comment: comment.val(),
                to: to.val(),
                street: street.val(),
                building: building.val(),
                housing: housing.val(),
                flat: flat.val(),
                floor: floor.val(),
            },
            success: data => {
                modalContent.text(data.message);
                $.fancybox.open({
                    src: "#modal",
                    type: "inline"
                })
                jQuery('.form')[0].reset();
            },
            error: data => {
                let message = data.responseJSON.message;
                modalContent.text(message);
                $.fancybox.open({
                    src: "#modal",
                    type: "inline"
                })
            }


        });
    }
})

$(".js-button").on("click", e => {
    e.preventDefault();
    $.fancybox.close();
})


// Scrol

//Переменные
let section = $(".section");
let wrapper = $(".wrapper__conteiner");
let sideMenu = $(".fixed-menu");
let fixedMenu = sideMenu.find(".fixed-menu__element");

let mobileDetect = new MobileDetect(window.navigator.userAgent);
let isMobile = mobileDetect.mobile();

let inScroll = false;

// Функция "Смена Позиции"
let countSectionPosition = sectionEq => {
    let position = sectionEq * -100;

    if (isNaN(position)) {
        console.error("Передано не верное значение countSectionPosition")
        return 0;
    }
    return position;
}

// Плавность перехода секций
$(".wrapper").on("touchmove", e => {
    e.preventDefault();
})

$("[data-scroll-to]").click(e => {
    e.preventDefault();

    let $this = $(e.currentTarget);
    let target = $this.attr("data-scroll-to");
    let reqSection = $(`[data-section-id=${target}]`);

    performTransition(reqSection.index());
})