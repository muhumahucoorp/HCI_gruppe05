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
var car_number = 0;
var selectedCarDivName;

function init() {
	states = ["Service"];
	features = ["Discokugel 0€/h"];
	cur_state = "Service";
	car_type = "";
	car_mode = "";
	var car_number = 0;
	document.getElementById("taskbar").innerHTML = getArrowHTML(states, true);
	document.getElementsByClassName('main')[0].innerHTML = document.getElementById(cur_state).innerHTML;
	document.getElementById("weiter").style.visibility = "hidden";
}

window.onload = init;

function advanceState() {
	
	switch(cur_state) {
		case "Service" :
			cur_state = "Ort und Zeit";
			document.getElementById("back").style.visibility = "visible";
			document.getElementById("weiter").style.visibility = "hidden";
			break;
		case "Ort und Zeit" :
			if(car_mode == "Partybus") {
				cur_state = "Fahrzeugwahl";
			} else {
				cur_state = "Fahrzeugtyp";
			}
			document.getElementById("weiter").style.visibility = "hidden";
			break;
		case "Fahrzeugtyp" :
			cur_state = "Fahrzeugwahl";
			document.getElementById("weiter").style.visibility = "hidden";
			break;
		case "Fahrzeugwahl" :
			if(car_mode == "Partybus") {
				cur_state = "Zusatzfeatures";
				document.getElementById("back").style.visibility = "visbile";
				document.getElementById("weiter").style.visibility = "visible";
			} else {
				cur_state = "Bestellübersicht";
				setOrderingOverview();
				document.getElementById("back").style.visibility = "visible";
				document.getElementById("weiter").style.visibility = "hidden";
			}
			break;
		case "Zusatzfeatures" :
			cur_state = "Bestellübersicht";
			setOrderingOverview();
			document.getElementById("back").style.visibility = "visbile";
			document.getElementById("weiter").style.visibility = "hidden";
			break;
		case "Bestellübersicht" :
			cur_state = "Endübersicht";
			document.getElementById("back").style.visibility = "hidden";
			document.getElementById("weiter").style.visibility = "hidden";
			break;
	}
	
	if(states.indexOf(cur_state) == -1) {
		states.push(cur_state);
	} else {
		states = states.splice(0, states.indexOf(cur_state) + 1);
	}
	
    // update the taskbar
	document.getElementById("taskbar").innerHTML = "";
	for (let s of states) {
		if(s != "Endübersicht") {
			if(states.indexOf(s) == states.length-1){
				document.getElementById("taskbar").innerHTML += getArrowHTML(s, true);
			} else {
				document.getElementById("taskbar").innerHTML += getArrowHTML(s, false);
			}
		}
	}
	
	if(cur_state == "Fahrzeugwahl") {
		document.getElementsByClassName('main')[0].innerHTML = document.getElementById(car_type + car_mode).innerHTML;
	} else {
		document.getElementsByClassName('main')[0].innerHTML = document.getElementById(cur_state).innerHTML;
	}
}

function selectState(new_state) {
	cur_state = new_state;
	switch(cur_state) {
		case "Service" :
			document.getElementById("back").style.visibility = "hidden";
			document.getElementById("weiter").style.visibility = "hidden";
			break;
		case "Ort und Zeit" :
			document.getElementById("back").style.visibility = "visible";
			document.getElementById("weiter").style.visibility = "hidden";
			break;
		case "Fahrzeugtyp" :
			document.getElementById("back").style.visibility = "visible";
			document.getElementById("weiter").style.visibility = "hidden";
			break;
		case "Fahrzeugwahl" :
			document.getElementById("back").style.visibility = "visible";
			document.getElementById("weiter").style.visibility = "hidden";
			break;
		case "Zusatzfeatures" :
			document.getElementById("back").style.visibility = "visible";
			document.getElementById("weiter").style.visibility = "visible";
			features = ["Discokugel 0€/h"];
			document.getElementById("ordered_features").innerHTML = "<p style='font-family:Arial,sans-serif; font-size:18px; margin-left:5px;text-decoration:underline;'>Ausgewählte Zusatzfeatures</p> Discokugel 0€/h";
			break;
		case "Bestellübersicht" :
			setOrderingOverview();
			document.getElementById("back").style.visibility = "visible";
			document.getElementById("weiter").style.visibility = "hidden";
			break;
		case "Endübersicht" :
			var cur_features = "";
			document.getElementById("back").style.visibility = "hidden";
			document.getElementById("weiter").style.visibility = "hidden";
			break;
	}
	
	document.getElementById("taskbar").innerHTML = "";
	for (let s of states) {
		if(s != "Endübersicht") {
			if(s == cur_state){
				document.getElementById("taskbar").innerHTML += getArrowHTML(s, true);
			} else {
				document.getElementById("taskbar").innerHTML += getArrowHTML(s, false);
			}
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
			document.getElementById("weiter").style.visibility = "hidden";
			break;
		case "Ort und Zeit" :
			car_type = "";
			document.getElementById("weiter").style.visibility = "hidden";
			break;
		case "Fahrzeugwahl" :
			features = ["Discokugel 0€/h"];
			document.getElementById("ordered_features").innerHTML = "<p style='font-family:Arial,sans-serif; font-size:18px; margin-left:5px;text-decoration:underline;'>Ausgewählte Zusatzfeatures</p> Discokugel 0€/h";
		case "Zusatzfeatures" :
			features = ["Discokugel 0€/h"];
			break;
		case "Bestellübersicht" :
			setOrderingOverview();
			document.getElementById("back").style.visibility = "visible";
			document.getElementById("weiter").style.visibility = "hidden";
			break;
	}
	
	 // update the taskbar
	document.getElementById("taskbar").innerHTML = "";
	for (let s of states) {
		if(s != "Endübersicht") {
			if(states.indexOf(s) == states.length-1){
				document.getElementById("taskbar").innerHTML += getArrowHTML(s, true);
			} else {
				document.getElementById("taskbar").innerHTML += getArrowHTML(s, false);
			}
		}
	}
	
	if(cur_state == "Fahrzeugwahl") {
		document.getElementsByClassName('main')[0].innerHTML = document.getElementById(car_type + car_mode).innerHTML;
	} else {
		document.getElementsByClassName('main')[0].innerHTML = document.getElementById(cur_state).innerHTML;
	}
}

function getArrowHTML(new_state, selected) {
		var arrow_html = "<img src=\"arrows\\";
		arrow_html += new_state;
		arrow_html += ".png\" class=\"arrow\" onclick=\"selectState(\'" + new_state + "\')\"";
		if(selected == true) {
			arrow_html += " style=\'border-style: solid; border-color: red;\'";
		}
		arrow_html += ">";
		return arrow_html;
	}

function updateMode(newMode) {
	car_mode = newMode;
	car_type = "";
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
	car_number = number;
	var buttonShown = false;
	for(i=1; i<=4; i++) {
		if(document.getElementById(car_type + car_mode + i).style.borderColor == "red") {
			buttonShown = true;
		}
		document.getElementById(car_type + car_mode + i).style.borderColor = "blue";
	}
	document.getElementById(car_type + car_mode + car_number).style.borderColor = "red";
	if(!buttonShown) {
		document.getElementById("weiter").style.visibility = "visible";
	}
}

function setOrderingOverview() {
	document.getElementById("service_text").innerHTML = car_mode;
	document.getElementById("car_text").innerHTML = document.getElementById(car_type + car_mode + car_number).getAttribute("car");
	var price = parseInt(document.getElementById(car_type + car_mode + car_number).getAttribute("price"));
	var cur_features = "";
	if(car_mode == "Partybus") {
		for(let f of features) {
			cur_features += f + "<br>";
			if(f != "Discokugel 0€/h") {
				price += parseInt(document.getElementById(f).getAttribute("price"));
			}
		}
	}
	document.getElementById("extras_text").innerHTML = cur_features;
	document.getElementById("price").innerHTML = price;
}

function getGPSStart() {
	
	if (document.getElementById("zielStadt").value == "Hannover") document.getElementById("zielStadt").value = "";
	if (document.getElementById("zielStraße").value == "Appelstraße 4") document.getElementById("zielStraße").value = "";
	
	document.getElementById("startStadt").value = "Hannover";
	document.getElementById("startStraße").value = "Appelstraße 4";
}

function getGPSZiel() {
	
	if (document.getElementById("startStadt").value == "Hannover") document.getElementById("startStadt").value = "";
	if (document.getElementById("startStraße").value == "Appelstraße 4") document.getElementById("startStraße").value = "";
	
	document.getElementById("zielStadt").value = "Hannover";
	document.getElementById("zielStraße").value = "Appelstraße 4";
}

function getTimeAndDate() {
	
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();

	if(dd<10) {
		dd='0'+dd
	} 

	if(mm<10) {
		mm='0'+mm
	} 

	today = dd+'/'+mm+'/'+yyyy;
	document.getElementById("date").value = today;
	
	var time = new Date().toLocaleTimeString('de-DE', { hour12: false, hour: "numeric", minute: "numeric"});
	document.getElementById("time").value = time;
}

function inputChanged() {
	if (document.getElementById("time").value == ""
	 || document.getElementById("date").value == ""
	 || document.getElementById("startStadt").value == ""
	 || document.getElementById("startStraße").value == ""
	 || document.getElementById("zielStadt").value == ""
	 || document.getElementById("zielStraße").value == "")
		document.getElementById("weiter").style.visibility = "hidden";
	else document.getElementById("weiter").style.visibility = "visible";
}