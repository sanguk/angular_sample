function print_zpl_usb(zpl) {
  console.log('print_zpl_usb start');
  BrowserPrint.getDefaultDevice("printer", function (device) {
    //console.log(device.uid);

    BrowserPrint.getLocalDevices(function (devices) {
      console.log('getLocalDevices');
      //console.log(typeof device);
      //console.log(JSON.stringify(devices));

      var device2 = null;
      for (let i = 0; i < devices.length; i++) {
        //console.log(devices[i].deviceType);
        //console.log(devices[i].uid);
        //if (device[i].name == "local 1") {
        if (devices[i].deviceType == "printer" && devices[i].connection == "usb" && devices[i].uid != device.uid) {
          //console.log(device[i].name);
          //console.log(zpl);
          //device[i].send(zpl);
          device2 = devices[i];
        }
      }

      if (device2 == null) {
        console.log('print_zpl_usb: device.send(zpl);');
        device.send(zpl);
      }
      else {
        console.log('print_zpl_usb: device2.send(zpl);');
        device2.send(zpl);
      }

    }, function (error) {
      alert(error);
    }, "printer")


  }, function (error) {
    alert(error);
  });
}

function print_zpl(zpl) {
  console.log('print_zpl start');
  BrowserPrint.getDefaultDevice("printer", function (device) {
    //console.log('print_zpl');
    //console.log(typeof device);
    //console.log(JSON.stringify(device));
    //console.log(zpl);
    console.log('print_zpl: device.send(zpl);');
    device.send(zpl);
  }, function (error) {
    alert(error);
  })
}

function getConfig() {
  BrowserPrint.getApplicationConfiguration(function (config) {
    alert(JSON.stringify(config))
  }, function (error) {
    alert(JSON.stringify(new BrowserPrint.ApplicationConfiguration()));
  })
}

var readCallback = function (readData) {
  if (readData === undefined || readData === null || readData === "") {
    alert("No Response from Device");
  } else {
    alert(readData);
  }

}
var errorCallback = function (errorMessage) {
  alert("Error: " + errorMessage);
}

function readFromSelectedPrinter() {
  //selected_device.read(readCallback, errorCallback);
}

function sendImage(imageUrl) {
  url = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
  url = url + "/" + imageUrl;
  //selected_device.sendUrl(url, undefined, errorCallback)
}

function sendImageHttp(imageUrl) {
  url = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
  url = url + "/" + imageUrl;
  url = url.replace("https", "http");
  //selected_device.sendUrl(url, undefined, errorCallback)
}
