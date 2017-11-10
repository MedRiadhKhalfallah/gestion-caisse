$(document).on('ready', function () {
    $("input#searchRef").bind("keypress keyup keydown", function (e) {
        $("tbody#commandeView tr").removeAttr("style");
        var code = (e.keyCode ? e.keyCode : e.which);
        var value = $(this).val();
        if (code === 13) {
            if ($("tbody#commandeView tr").find(":contains('" + value + "')").length > 0) {
                $("tbody tr").find(":contains('" + value + "')").parent().css({"background-color": "#4DD0E1", "color": "#fff", "font-weight": "bold", "border": "2px solid #000"});
                var index = $("tbody#commandeView tr").find(":contains('" + value + "')").parent().index();
                var distance = $("tbody#commandeView tr:eq(" + (index) + ")").offset().top - $('body').offset().top - $(".topbar").height() + 48;
                $("body").scrollTo($("tbody#commandeView tr:eq(" + (index) + ")")).scrollTo(distance);
                setTimeout(function () {
                    $("tbody#commandeView tr:eq(" + (index) + ")").children().eq(4).children().eq(0).focus();
                }, 500);
            }
            else {
                toastr.error("Produit Introuvable vérifez la référence");
            }
        }
    });
});