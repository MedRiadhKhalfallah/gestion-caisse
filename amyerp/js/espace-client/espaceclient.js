var intervalEspace = setInterval(function () {
    if (document.readyState === 'complete') {
        clearInterval(intervalEspace);
//        $('.selectpicker').selectpicker({
//            style: ' btn-default',
//            size: 12
//        });

        setTimeout(function () {
//            console.clear();
//            console.log('page loaded');
//            console.log('document ready');
//            stock_functions_init();
//            function  stock_functions_init() {
//                $("a[data-toggle='tab'").on('click', function () {
//                    console.log('STOCK');
//                    var tabName = $.trim($(this).text());
//                    setTimeout(function () {
//                        init_bc();
//                    }, 500);
//                });
//            }
//            function init_bc() { 
//                if ($(document).find("a[data-target='#tab3_3']").attr('aria-expanded') === "true") {
//                    setBarcode();
//                }
//            }
            $('input#DateDebutRamassage').datepicker({
                altField: "#DateDebutRamassage",
                closeText: 'Fermer',
                prevText: 'Précédent',
                nextText: 'Suivant',
                currentText: 'Aujourd\'hui',
                monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
                dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
                dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
                dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
                weekHeader: 'Sem.',
                dateFormat: "dd-mm-yy"});
            $('input#DateFinRamassgage').datepicker({
                altField: "#DateFinRamassgage",
                closeText: 'Fermer',
                prevText: 'Précédent',
                nextText: 'Suivant',
                currentText: 'Aujourd\'hui',
                monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
                dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
                dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
                dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
                weekHeader: 'Sem.',
                dateFormat: "dd-mm-yy"});
//            function setBarcode() {
//                console.log('BAR CODE WAITING...');
//                var BarcodesScanner = {
//                    barcodeData: '',
//                    deviceId: '',
//                    symbology: '',
//                    timestamp: 0,
//                    dataLength: 0
//                };
//
//                function onScannerNavigate(barcodeData, deviceId, symbology, timestamp, dataLength) {
//                    BarcodesScanner.barcodeData = barcodeData;
//                    BarcodesScanner.deviceId = deviceId;
//                    BarcodesScanner.symbology = symbology;
//                    BarcodesScanner.timestamp = timestamp;
//                    BarcodesScanner.dataLength = dataLength;
//                    $(BarcodesScanner).trigger('scan');
//                }
//
//                BarcodesScanner.tmpTimestamp = 0;
//                BarcodesScanner.tmpData = '';
//                $(document).on('keypress', function (e) {
//                    e.stopPropagation();
//                    var keycode = (e.keyCode ? e.keyCode : e.which);
//                    if (BarcodesScanner.tmpTimestamp < Date.now() - 500) {
//                        BarcodesScanner.tmpData = '';
//                        BarcodesScanner.tmpTimestamp = Date.now();
//                    }
//                    if (keycode == 13 && BarcodesScanner.tmpData.length > 0) {
//                        onScannerNavigate(BarcodesScanner.tmpData, 'FAKE_SCANNER', 'WEDGE', BarcodesScanner.tmpTimestamp, BarcodesScanner.tmpData.length);
//                        BarcodesScanner.tmpTimestamp = 0;
//                        BarcodesScanner.tmpData = '';
//                    } else if (e.charCode && e.charCode > 0) {
//                        BarcodesScanner.tmpData += String.fromCharCode(e.charCode);
//                    }
//                });
//                $(BarcodesScanner).on('scan', function (e) {
//                    $("#CodeBarre").val("");
//                    console.log(BarcodesScanner.barcodeData);
//                    console.log($(document).find("a[data-target='#tab3_3']").attr('aria-expanded') === "true");
//                    $("#CodeBarre").focus();
//                    setTimeout(function () {
//                        if ($(document).find("a[data-target='#tab3_3']").attr('aria-expanded') === "true") {
//                            $("#CodeBarre").val(BarcodesScanner.barcodeData.replace("°", "-").replace("°", "-"));
//                        }
//                        setTimeout(function () {
//                            var e = jQuery.Event("keypress");
//                            e.which = 13; //choose the one you want
//                            e.keyCode = 13;
//                            $("#CodeBarre").trigger(e);
//                        }, 200);
//                    }, 500);
//                });
//            }
        }, 1500);
    }
}, 100);