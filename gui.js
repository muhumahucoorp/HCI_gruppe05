/*
XMLHttpRequest:
https://en.wikipedia.org/wiki/XMLHttpRequest

CouchDB:
http://guide.couchdb.org/draft/tour.html
https://wiki.apache.org/couchdb/HTTP_Document_API
http://docs.couchdb.org/en/1.6.1/config/intro.html
http://docs.couchdb.org/en/1.6.1/config/http.html#cross-origin-resource-sharing
http://docs.couchdb.org/en/1.6.1/intro/curl.html

HTML(5):
http://www.w3schools.com/html/default.asp
http://www.w3schools.com/jsref/default.asp

CouchDB configuration (Mac OS X):
~/Library/Application Support/CouchDB/etc/couchdb/local.ini
/Applications/Apache CouchDB.app/Contents/Resources/couchdbx-core/etc/couchdb/local.ini
CouchDB configuration (Windows):
C:\Program Files (x86)\Apache Software Foundation\CouchDB\etc\couchdb\local.ini
start/stop/restart: Control Panel --> Services --> Apache CouchDB

[httpd]
enable_cors = true
bind_address = 0.0.0.0  <-- for access from other devices, 127.0.0.1: local device only
...

[cors]
origins = *

*/

var request = new XMLHttpRequest();

request.onreadystatechange = function() {
	// console.log("onreadystatechange: " + request.readyState + ", " +  request.status);
	// console.log(request.responseText);
	if (request.readyState == 4) {
		if (request.status == 200) {
			var response = JSON.parse(request.responseText);
			handlers[response._id](response);
		}
		if (request.status == 404) {
			console.log("not found: " + request.responseText);
		}
	}
};

function get(variable) {
	// console.log("get " + variable);
	request.open("GET", dburl + variable, false);
	request.send();
}

function update() {
	for (var name in handlers) {
		// console.log("updating " + name);
		get(name);
	}
}

// request updates with a fixed interval (ms)
var intervalID = setInterval(update, 200);

///////////////////////////////////////////////////////////////////////////////
// your code below

var dbname = "hci1";
var dburl = "http://127.0.0.1:5984/" + dbname + "/";
var handlers = {
	// current system task `service`, `car_selection`, ...
	"status" : updateState,
	
	// is the `backwards button`
	"backward_button": updateBackwards,
	
	// highlighted car number
	"car_choose" : updateChoosenCarNumber,
	
	// pary features
	"party_feature" : updatePartyFeatures,
	
	// order view
	"order_view": updateOrderView
};

function updateState(response) {
	var service = document.getElementById("service").innerHTML;
	if (service.indexOf(response.state) == -1) {
		service += " " + response.state;
	}
	document.getElementById("service").innerHTML = service;
	
	changeGui(response);
	
}

function changeGui(response){
	
	switch (response) {
    case "Ort und Zeit":
        
		var htmlCode = '<div id="zeitraum" ><label id=zeitLabel >Zeitraum <input >   <input>             </label></div><div id="startpunkt" ><label id=startLabel >Startpunkt <input >   <input>             </label></div><div id="zielpunkt" ><label id=zielLabel >Zielpunkt <input >   <input>             </label></div>';
		document.getElementsByClassName('main').innerHTML = htmlCode;
		
        break;
    case "Fahrzeugtyp":
        
		var htmlCode = '<img src="sportwagen.png" style="width:304px;height:228px;"><img src="transportwagen.jpg" style="width:304px;height:228px;"><br><img src="familienwagen.jpg" style="width:304px;height:228px;"><img src="arbeitswagen.jpg" style="width:304px;height:228px;">':
		document.getElementsByClassName('main').innerHTML = htmlCode;
		
		
        break;
		
		case "Fahrzeugwahl":
        // Blah
        break;
    case "Bestellübersicht":
        // Blah
        break;
		
		case "Zusatzfeatures":
        // Blah
        break;
	
	default:
        
        break;	
}
	
	
}


function updateBackwards(response) {
	if (response.backward_button == 0) {
		document.getElementById("back").style.visibility = "hidden";
	} else {
		document.getElementById("back").style.visibility = "visible";
	}
}

function updateChoosenCarNumber(response) {
	//TODO implement and update id
	var car_div = document.getElementById("cars");
	if (car_div) {
		// highlight selected car
	}
}

function updatePartyFeatures(response) {
	//TODO implement and update id
	var feature_div = document.getElementById("feature");
	if (feature_div) {
		// insert selected features
	}
}

function updateOrderView(response) {
	//TODO
}