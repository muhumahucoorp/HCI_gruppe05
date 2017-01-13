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

var cur_state = "Service";
var car_type = "sport";
var states = ["Service"];
var car_mode = "Autonom";
var selectedCarDivName;

function updateState() {
	
	function getArrowHTML(new_state) {
		var arrow_html = "<img src=\"arrows\\";
		arrow_html += new_state;
		arrow_html += ".png\" class=\"arrow\"> ";
		return arrow_html;
	}
	
	switch(cur_state) {
		case "Service" :;
			cur_state = "Ort und Zeit";
			updateBackwards();
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
			if(car_mode == partyBus) {
				cur_state = "Zusatzfeatures";
			} else {
				cur_state = "Bestellübersicht";
			}
			break;
		case "Zusatzfeatures" :
			cur_state = "Bestellübersicht";
			break;
		case "Bestellübersicht" :
			cur_state = "Endübersicht";
			break;
	}
	
	states.push(cur_state);
	
    // update the taskbar
	document.getElementById("taskbar").innerHTML = "";
	for (let s of states) {
		document.getElementById("taskbar").innerHTML += getArrowHTML(s);
	}
	
	if(cur_state == "Fahrzeugwahl") {
		document.getElementsByClassName('main')[0].innerHTML = document.getElementById(car_type + car_mode).innerHTML;
	} else {
		document.getElementsByClassName('main')[0].innerHTML = document.getElementById(cur_state).innerHTML;
	}
}

function updateMode(newMode) {
	car_mode = newMode;
	updateState();
}

function updateCarType(newType) {
	car_type = newType;
	updateState();
}

function selectCar(number) {
	for(i=1; i<=4; i++) {
		document.getElementById(car_type + car_mode + i).style.borderColor = "blue";
	}
	document.getElementById(car_type + car_mode + number).style.borderColor = "red";
	document.getElementById("continueCarSelection").style.visibility = "visible";
	document.getElementsByClassName('main')[0].innerHTML = document.getElementsByClassName('main')[0].innerHTML + document.getElementById("continueCarSelection").innerHTML;
}

function updateBackwards() {
	if (document.getElementById("back").style.visibility == "hidden") {
		document.getElementById("back").style.visibility = "visible";
	} else {
		document.getElementById("back").style.visibility = "hidden";
	}
}

function updateChoosenCarNumber() {
	if (states[states.length-1] == "Fahrzeugwahl") {
        // Mark car when in car selection.
        document.getElementsByClassName('tile-selectable')[response.state-1].style.borderColor = "red";
        
        // "Weiter" button is shown if a car is selected.
        if (response.state) {
            var carHTML = document.getElementsByClassName('main')[0].innerHTML;
            carHTML = carHTML.substr(0, carHTML.length - 2*("</div>".length) - 1);
            carHTML += document.getElementById("continueCarSelection").innerHTML + "</div>";
            document.getElementsByClassName('main')[0].innerHTML = carHTML;
        }
    }
    
}

function updatePartyFeatures(response) {
	if (states[states.length-1] == "Zusatzfeatures") {
        document.getElementById("ordered_features").innerHTML = response.extras;
    }
}

function updateCarSelection(response) {
    if (response.type == "partyBus") {
        selectedCarDivName = response.type
    } else {
        selectedCarDivName = response.type + response.driving_type;
    }
}

function updateOrderView(response) {
	document.getElementById("service_text").innerHTML = response.service;
	document.getElementById("time_departure").innerHTML = response.time_departure;
	document.getElementById("time_arrival").innerHTML = response.time_arrival;
	document.getElementById("place_departure").innerHTML = response.loc_departure;
	document.getElementById("place_arrival").innerHTML = response.loc_arrival;
	document.getElementById("car_text").innerHTML = response.car;
	document.getElementById("extras_text").innerHTML = response.extra;
	document.getElementById("price").innerHTML = response.price;
}