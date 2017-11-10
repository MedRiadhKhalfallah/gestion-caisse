setTimeout(function () {
    $("#form-username").on('submit', function () {
        return false;
    });
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
        if (keycode === 13 && BarcodesScanner.tmpData.length > 0) {
            onScannerNavigate(BarcodesScanner.tmpData, 'FAKE_SCANNER', 'WEDGE', BarcodesScanner.tmpTimestamp, BarcodesScanner.tmpData.length);
            BarcodesScanner.tmpTimestamp = 0;
            BarcodesScanner.tmpData = '';
        } else if (e.charCode && e.charCode > 0) {
            BarcodesScanner.tmpData += String.fromCharCode(e.charCode);
        }
    });
    $(BarcodesScanner).on('scan', function (e) {
        e.preventDefault();
        $("#codde_barre").val(BarcodesScanner.barcodeData.toUpperCase());
        $("#ref").focus();
    });
}, 500);



