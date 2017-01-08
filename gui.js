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
	"status" : updateState,
	"backward_button": updateBackwards,
	"car_choose" : updateChoosenCarNumber,
	"party_feature" : updatePartyFeatures,
    "car_selection" : updateCarSelection,
	"order_view": updateOrderView
};

var states = [];
var selectedCarDivName;

function updateState(response) {
	
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
	
    // update the taskbar
	document.getElementById("service").innerHTML = "";
	for (let cur_state of states) {
		document.getElementById("service").innerHTML += getArrowHTML(cur_state);
	}
	
    // update GUI main element
	if (response.state == "Fahrzeugwahl") {
        if (selectedCarDivName) {
            document.getElementsByClassName('main')[0].innerHTML = document.getElementById(selectedCarDivName).innerHTML;
        }
	} else {
        document.getElementsByClassName('main')[0].innerHTML = document.getElementById(response.state).innerHTML;
    }
}

function updateBackwards(response) {
	document.getElementById("back").style.visibility = "hidden";
	if (response.backward_button == 1) {
		document.getElementById("back").style.visibility = "visible";
	}
}

function updateChoosenCarNumber(response) {
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
        var featuresHTML = '<p style="font-family:Arial,sans-serif; font-size:18px; margin-left:5px;text-decoration:underline;">Ausgewählte Zusatzfeatures</p>-Discokugel 0€/h';
        for (var feature in response.features) {
            featuresHTML += "<br>-" + response.features[feature];
        }
        document.getElementById("ordered_features").innerHTML = featuresHTML;
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
	//TODO
}