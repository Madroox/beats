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

//Всплывающее меню Команда
let openItem = item => {
    let conteiner = item.closest(".team__item");
    let contentBlock = conteiner.find(".team__hidden-conteiner");
    let textBlock = contentBlock.find(".team__hidden-conteiner__block");
    let reqHeight = textBlock.height();


    conteiner.addClass("active");
    contentBlock.height(reqHeight);
}

let closeItem = conteiner => {
    let item = conteiner.find(".team__hidden-conteiner");
    let itemConteiner = conteiner.find(".team__item");

    itemConteiner.removeClass("active");
    item.height(0);
}

$(".team__link").click(e => {
    let $this = $(e.currentTarget);
    let conteiner = $this.closest(".team__list");
    let elemConteiner = $this.closest(".team__item");

    if (elemConteiner.hasClass("active")) {
        closeItem(conteiner);
    } else {
        closeItem(conteiner);
        openItem($this);
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

//Функция "Смена цвета Фиксировонного меню"
let changeMenuColorSection = sectionEq => {
    let currentSection = section.eq(sectionEq);
    let sectionColor = currentSection.attr("data-color-theme");
    let activeClass = "fixed-menu--color";

    if (sectionColor == "white") {
        sideMenu.addClass("activeClass");
    } else {
        sideMenu.removeClass("activeClass");
    }
}

//Функция "Сброс Класса"
let resetActiveClassForItem = (items, itemEq, activeClass) => {
    items.eq(itemEq).addClass(activeClass).siblings().removeClass(activeClass);
}

section.first().addClass("active");

let performTransition = (sectionEq) => {
    if (inScroll) return;
    let transitionOver = 1000;
    let mouseInertiaOver = 300;
    inScroll = true;

    let position = countSectionPosition(sectionEq);

    changeMenuColorSection(sectionEq);

    wrapper.css({
        transform: `translateY(${position}%)`
    });

    resetActiveClassForItem(section, sectionEq, "active");



    setTimeout(() => {
        inScroll = false;
        resetActiveClassForItem(fixedMenu, sectionEq, "fixed-menu__element--active");
    }, transitionOver + mouseInertiaOver)

}

let viewportScroller = () => {
    let activeSection = section.filter(".active");
    let nextSection = activeSection.next();
    let prevSection = activeSection.prev();

    return {
        next() {
            if (nextSection.length) {
                performTransition(nextSection.index());
            }
        },
        prev() {
            if (prevSection.length) {
                performTransition(prevSection.index());
            }
        }
    }
}

$(window).on("wheel", e => {
    let deltaY = e.originalEvent.deltaY;
    let scroller = viewportScroller()

    if (deltaY > 0) {
        scroller.next();
    }
    if (deltaY < 0) {
        scroller.prev();
    }
})

$(window).on("keydown", e => {
    let tagName = e.target.tagName.toLowerCase();
    let userTypingInInputs = tagName === "input" || tagName === "textarea";
    let scroller = viewportScroller()

    if (userTypingInInputs) return;

    switch (e.keyCode) {
        case 38:
            scroller.prev();
            break;

        case 40:
            scroller.next();
            break;
    }

})

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

//Свайп
if (isMobile) {
    $("body").swipe({
        swipe: function (event, direction) {
            let scroller = viewportScroller();
            let scrollDirection = "";

            if (direction == "up") scrollDirection = "next";
            if (direction == "down") scrollDirection = "prev";

            if (scrollDirection.length !== 0) {
                scroller[scrollDirection]();
            }

        }
    });
}
