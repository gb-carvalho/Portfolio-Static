/*
    Prologue by HTML5 UP
    html5up.net | @ajlkn
    Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/
function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

(function ($) {

    var $window = $(window),
        $body = $('body'),
        $nav = $('#nav');

    // Breakpoints.
    breakpoints({
        wide: ['961px', '1880px'],
        normal: ['961px', '1620px'],
        narrow: ['961px', '1320px'],
        narrower: ['737px', '960px'],
        mobile: [null, '736px']
    });

    // Play initial animations on page load.
    $window.on('load', function () {
        window.setTimeout(function () {
            $body.removeClass('is-preload');
        }, 100);
    });

    /*
    $(function () {
        var $nav_a = $('#nav').find('a');

        var isHome = getParameterByName("home");

        $nav_a.on('click', function (e) {
            var $this = $(this);
            var href = $this.attr('href');

            console.log(isHome)
            if (href.charAt(0) === "#" && isHome == 0) {
                e.preventDefault();

                var newUrl = window.location.origin + "/Home" + href;
                window.location.href = newUrl; 
            }
        });
    }); */
    
    // Scrolly is used to create a smooth scroll when a link is clicked, but it is only adding a strange delay to the scroll.
    // I tried to fix it but couldn't. TODO: "Fix the scrolly or use another method for smooth scrolling."

    // Header (narrower + mobile).

    // Toggle.
    $(
        '<div id="headerToggle">' +
        '<a href="#header" class="toggle"></a>' +
        '</div>'
    )
        .appendTo($body);

    // Header.
    $('#header')
        .panel({
            delay: 500,
            hideOnClick: true,
            hideOnSwipe: true,
            resetScroll: true,
            resetForms: true,
            side: 'left',
            target: $body,
            visibleClass: 'header-visible'
        });

})(jQuery);

function initScrolly(){

    // Nav.
    var $nav = $('#nav');
    var $nav_a = $nav.find('a');

    $nav_a
        .addClass('scrolly')
        .on('click', function (e) {

            var $this = $(this);

            // External link? Bail.
            if ($this.attr('href').charAt(0) != '#')    
                return;

            // Prevent default.
            e.preventDefault();

            // Deactivate all links.
            $nav_a.removeClass('active');

            // Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
            $this
                .addClass('active')
                .addClass('active-locked');

        })
        .each(function () {

            var isHome = getParameterByName("home");
            if (isHome == 0) return;

            var $this = $(this),
                id = $this.attr('href'),
                $section = $(id);

            // No section for this link? Bail.
            if ($section.length < 1)
                return;

            // Scrollex.
            $section.scrollex({
                mode: 'middle',
                top: '-10vh',
                bottom: '-10vh',
                initialize: function () {

                    // Deactivate section.
                    $section.addClass('inactive');

                },
                enter: function () {

                    // Activate section.
                    $section.removeClass('inactive');

                    // No locked links? Deactivate all links and activate this section's one.
                    if ($nav_a.filter('.active-locked').length == 0) {

                        $nav_a.removeClass('active');
                        $this.addClass('active');

                    }

                    // Otherwise, if this section's link is the one that's locked, unlock it.
                    else if ($this.hasClass('active-locked'))
                        $this.removeClass('active-locked');

                }
            });

        });

    // Scrolly.
    $('.scrolly').scrolly({
        offset: 0,
        speed: 0
    });

    setTimeout(function () {
     $(window).trigger('scroll');
    }, 50);
}

function loadPage(page, addToHistory = true) {

  fetch(page)
    .then(res => res.text())
    .then(data => {
      document.getElementById("main").innerHTML = data;
      if(page != "home.html"){
        window.scrollTo(0, 0);
      }

      if (addToHistory) {
        history.pushState({ page: page }, "", "#page=" + page);
      }
      initScrolly();
    })
    .catch(err => console.error("Erro:", err));
}

window.addEventListener("popstate", function (event) {
  if (event.state && event.state.page) {
    loadPage(event.state.page, false);
  } else {
    loadPage("home.html", false);
  }
});

window.addEventListener("DOMContentLoaded", function () {

  const match = location.hash.match(/^#page=(.+)$/);

  if (match) {
    const page = match[1];
    loadPage(page, false);
    history.replaceState({ page: page }, "", "#page=" + page);
  } else {
    loadPage("home.html", false);
    history.replaceState({ page: "home.html" }, "", "#page=home.html");
  }

});