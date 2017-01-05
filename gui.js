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
	
	/*
	// pary features
	"party_feature" : updatePartyFeatures,
	
	// order view
	"order_view": updateOrderView*/
};

var states = [];

function updateState(response) {
	/*var service = document.getElementById("service").innerHTML;
	if (service.indexOf(response.state) == -1) {
		service += " " + response.state;
	}
	document.getElementById("service").innerHTML = service;*/
	
	function getArrowHTML(state) {
		var arrow_html = "<img src=\"arrows\\";
		arrow_html += state;
		arrow_html += ".png\" class=\"arrow\"> ";
		return arrow_html;
	}
	
	if (response.state != "Endübersicht") {
		if (states.indexOf(response.state) == -1) {
			states.push(response.state);
		} else {
			var len = states.length;
			for (let i = 0; i < len; i++) {
				var cur_state = states[i];
				if (states.indexOf(cur_state) > states.indexOf(response.state)) {
					states.splice(states.indexOf(cur_state), 1);
				}
				len = states.length;
			}
		}
	}
	
	document.getElementById("service").innerHTML = "";
	for (let cur_state of states) {
		document.getElementById("service").innerHTML += getArrowHTML(cur_state);
	}
	
	changeGui(response.state);	
}

function changeGui(state) {

	switch (state) {
		case "Ort und Zeit":
			var htmlCode = '<div id="zeitraum" ><label id=zeitLabel >Zeitraum <input >   <input>             </label></div><div id="startpunkt" ><label id=startLabel >Startpunkt <input >   <input>             </label></div><div id="zielpunkt" ><label id=zielLabel >Zielpunkt <input >   <input>             </label></div>';
			document.getElementsByClassName('main')[0].innerHTML = htmlCode;
			break;
		case "Fahrzeugtyp":
			var htmlCode = '<img src="sportwagen.png" style="width:304px;height:228px;"><img src="transportwagen.jpg" style="width:304px;height:228px;"><br><img src="familienwagen.png" style="width:304px;height:228px;"><img src="arbeitswagen.jpg" style="width:304px;height:228px;">';
			document.getElementsByClassName('main')[0].innerHTML = htmlCode;
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
		case "Endübersicht":	
			var htmlCode = '<h1 align="center" style="color:#1D30A9;font-size:30pt">Vielen Dank</h1><h1 align="center" style="color:#1D30A9;font-size:26pt">für Ihre Bestellung!</h1><div align="center">	<img src="porsche.jpg" style="width:500px;height:300px"><button type="button" class="button">Fertig</button></div>';
			document.getElementsByClassName('main')[0].innerHTML = htmlCode;
			break;
		default:
			break;	
	}
}

function updateBackwards(response) {
	if (document.getElementById("back")) {
		if (response.backward_button == 0) {
			document.getElementById("back").style.visibility = "hidden";
		} else {
			document.getElementById("back").style.visibility = "visible";
		}
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