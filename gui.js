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

///////////////////////////////////////////////////////////////////////////////
// your code below

var states = ["Service"];
var features = ["Discokugel 0€/h"];
var cur_state = "Service";
var car_type = "";
var car_mode = "";
var selectedCarDivName;

function init() {
	states = ["Service"];
	features = ["Discokugel 0€/h"];
	cur_state = "Service";
	car_type = "";
	car_mode = "";
	document.getElementById("taskbar").innerHTML = getArrowHTML(states);
	document.getElementsByClassName('main')[0].innerHTML = document.getElementById(cur_state).innerHTML;
}

window.onload = init;

function advanceState() {
	
	switch(cur_state) {
		case "Service" :
			cur_state = "Ort und Zeit";
			document.getElementById("back").style.visibility = "visible";
			break;
		case "Ort und Zeit" :
			if(car_mode == "partyBus") {
				cur_state = "Fahrzeugwahl";
			} else {
				cur_state = "Fahrzeugtyp";
			}
			break;
		case "Fahrzeugtyp" :
			cur_state = "Fahrzeugwahl";
			break;
		case "Fahrzeugwahl" :
			if(car_mode == "partyBus") {
				cur_state = "Zusatzfeatures";
			} else {
				cur_state = "Bestellübersicht";
				document.getElementById("extras_text").innerHTML = "";
			}
			break;
		case "Zusatzfeatures" :
			cur_state = "Bestellübersicht";
			var cur_features = "";
			for(let f of features) {
				cur_features += f + "<br>";
			}
			document.getElementById("extras_text").innerHTML = cur_features;
			break;
		case "Bestellübersicht" :
			cur_state = "Endübersicht";
			document.getElementById("back").style.visibility = "hidden";
			break;
	}
	
	states.push(cur_state);
	
    // update the taskbar
	document.getElementById("taskbar").innerHTML = "";
	for (let s of states) {
		if(s != "Endübersicht") {
			document.getElementById("taskbar").innerHTML += getArrowHTML(s);
		}
	}
	
	if(cur_state == "Fahrzeugwahl") {
		document.getElementsByClassName('main')[0].innerHTML = document.getElementById(car_type + car_mode).innerHTML;
	} else {
		document.getElementsByClassName('main')[0].innerHTML = document.getElementById(cur_state).innerHTML;
	}
}

function resignState() {
		 states.splice(states.length - 1, 1);
		 
		 cur_state = states[states.length -  1];
		 
	switch(cur_state) {
		case "Service" :
			document.getElementById("back").style.visibility = "hidden";
			break;
		case "Ort und Zeit" :
			car_type = "";
			break;
		case "Fahrzeugwahl" :
			features = ["Discokugel 0€/h"];
			document.getElementById("ordered_features").innerHTML = "<p style='font-family:Arial,sans-serif; font-size:18px; margin-left:5px;text-decoration:underline;'>Ausgewählte Zusatzfeatures</p> Discokugel 0€/h";
		case "Zusatzfeatures" :
			features = ["Discokugel 0€/h"];
			break;
		case "Bestellübersicht" :
			document.getElementById("back").style.visibility = "visible";
			break;
	}
	
	 // update the taskbar
	document.getElementById("taskbar").innerHTML = "";
	for (let s of states) {
		if(s != "Endübersicht") {
			document.getElementById("taskbar").innerHTML += getArrowHTML(s);
		}
	}
	
	 console.log(cur_state);
	
	if(cur_state == "Fahrzeugwahl") {
		document.getElementsByClassName('main')[0].innerHTML = document.getElementById(car_type + car_mode).innerHTML;
	} else {
		document.getElementsByClassName('main')[0].innerHTML = document.getElementById(cur_state).innerHTML;
	}
}

function getArrowHTML(new_state) {
		var arrow_html = "<img src=\"arrows\\";
		arrow_html += new_state;
		arrow_html += ".png\" class=\"arrow\"> ";
		return arrow_html;
	}

function updateMode(newMode) {
	car_mode = newMode;
	document.getElementById("service_text").innerHTML = car_mode;
	advanceState();
}

function updateCarType(newType) {
	car_type = newType;
	advanceState();
}

function selectFeature(feature) {
	if(features.indexOf(feature) == -1) {
		document.getElementById(feature).style.borderColor = "red";
		features.push(feature);
	} else {
		document.getElementById(feature).style.borderColor = "blue";
		features.splice(features.indexOf(feature), 1);
	}
	
	var cur_features = "";
	for(let f of features) {
		cur_features += f + "<br>";
	}
	document.getElementById("ordered_features").innerHTML = "<p style='font-family:Arial,sans-serif; font-size:18px; margin-left:5px;text-decoration:underline;'>Ausgewählte Zusatzfeatures</p>" + cur_features;
}

function selectCar(number) {
	var buttonShown = false;
	for(i=1; i<=4; i++) {
		if(document.getElementById(car_type + car_mode + i).style.borderColor == "red") {
			buttonShown = true;
		}
		document.getElementById(car_type + car_mode + i).style.borderColor = "blue";
	}
	document.getElementById(car_type + car_mode + number).style.borderColor = "red";
	if(!buttonShown) {
		document.getElementById("continueCarSelection").style.visibility = "visible";
		document.getElementsByClassName('main')[0].innerHTML = document.getElementsByClassName('main')[0].innerHTML + "<div>" + document.getElementById("continueCarSelection").innerHTML + "</div>";
	}
}

/*function updateOrderView(response) {
	document.getElementById("service_text").innerHTML = response.service;
	document.getElementById("time_departure").innerHTML = response.time_departure;
	document.getElementById("time_arrival").innerHTML = response.time_arrival;
	document.getElementById("place_departure").innerHTML = response.loc_departure;
	document.getElementById("place_arrival").innerHTML = response.loc_arrival;
	document.getElementById("car_text").innerHTML = response.car;
	document.getElementById("extras_text").innerHTML = response.extra;
	document.getElementById("price").innerHTML = response.price;
}*/