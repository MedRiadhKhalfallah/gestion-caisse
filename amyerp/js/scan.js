console.log('page loaded');
console.log('document ready');
stock_functions_init();
function  stock_functions_init() {
    $("a[data-toggle='tab'").on('click', function () {
        var tabName = $.trim($(this).text());
        setTimeout(function () {
            init_bc();
        }, 200);
    });
}
function init_bc() {
    if ($(document).find("a[data-target='#tab3_3']").attr('aria-expanded') === "true") {
        setBarcode();
    }
}
function setBarcode() {
    console.log('setBarCode');
    var BarcodesScanner = {
        barcodeData: '',
        deviceId: '',
        symbology: '',
        timestamp: 0,
        dataLength: 0
    };

    function onScannerNavigate(barcodeData, deviceId, symbology, timestamp, dataLength) {
        BarcodesScanner.barcodeData = barcodeData;
        BarcodesScanner.deviceId = deviceId;
        BarcodesScanner.symbology = symbology;
        BarcodesScanner.timestamp = timestamp;
        BarcodesScanner.dataLength = dataLength;
        $(BarcodesScanner).trigger('scan');
    }

    BarcodesScanner.tmpTimestamp = 0;
    BarcodesScanner.tmpData = '';
    $(document).on('keypress', function (e) {
        e.stopPropagation();
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if (BarcodesScanner.tmpTimestamp < Date.now() - 500) {
            BarcodesScanner.tmpData = '';
            BarcodesScanner.tmpTimestamp = Date.now();
        }
        if (keycode == 13 && BarcodesScanner.tmpData.length > 0) {
            onScannerNavigate(BarcodesScanner.tmpData, 'FAKE_SCANNER', 'WEDGE', BarcodesScanner.tmpTimestamp, BarcodesScanner.tmpData.length);
            BarcodesScanner.tmpTimestamp = 0;
            BarcodesScanner.tmpData = '';
        } else if (e.charCode && e.charCode > 0) {
            $("#CodeBarre").val("");
            BarcodesScanner.tmpData += decodeBarcode(String.fromCharCode(e.charCode));
        }
    });
    $(BarcodesScanner).on('scan', function (e) {
        e.preventDefault();
        if ($("#globalSearch").val() === "") {
            $('#CodeBarre').focus();
        }
        setTimeout(function () {
            if ($(document).find("a[data-target='#tab3_3']").attr('aria-expanded') === "true") {
                if ($("#globalSearch").val() === "") {
                    $("#CodeBarre").val(decodeBarcode(BarcodesScanner.barcodeData));
                }
            }
            console.log($("#CodeBarre").val());
            setTimeout(function () {
                var e = jQuery.Event("keypress");
                e.which = 13; //choose the one you want
                e.keyCode = 13;
                $("#CodeBarre").trigger(e);
            }, 100);
        }, 300);
    });
//    $("#CodeBarre").on('keypress', function (e) {
//        console.clear();
//        console.log("SCAN INPUT");
//        e.preventDefault();
//        $("#CodeBarre").focus();
//        setTimeout(function () {
//            if ($(document).find("a[data-target='#tab3_3']").attr('aria-expanded') === "true") {
//                var oldval = $("#CodeBarre").val();
//                $("#CodeBarre").val(decodeBarcode(oldval));
//            }
//        }, 300);
//    });
}