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
			var partyBusCode = '<div><img src="PartyBusImages/partybus1.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : Party Schoolbus</label><label>Preis : 200 Euro </label></div><div><img src="PartyBusImages/partybus2.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : Dark Knight</label><label>Preis : 250 Euro </label></div><div><img src="PartyBusImages/partybus3.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : Street Party</label><label>Preis : 150 Euro </label></div><div><img src="PartyBusImages/partybus4.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : MC Hummer</label><label>Preis : 300 Euro </label></div>';
		var sportManuel = '<div><img src="ManuelCarImages/porsche911.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : Porsche 911</label><label>Preis : 85 Euro </label></div><div><img src="ManuelCarImages/toyotafuture.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : Toyota Future</label><label>Preis : 105 Euro </label></div><div><img src="ManuelCarImages/audir8.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : Audi R8</label><label>Preis : 100 Euro </label></div><div><img src="ManuelCarImages/chevroletcamaro.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : Chevrolet Camaro</label><label>Preis : 75 Euro </label></div>';
		var sportAutonom = '<div><img src="AutonomCarImages/fisker.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : Fisker</label><label>Preis : 85 Euro </label></div><div><img src="AutonomCarImages/motorstorm2000.png"  style="width:300px;height:150px;"><label>Bezeichnung : MotorStorm 2000</label><label>Preis : 105 Euro </label></div><div><img src="AutonomCarImages/audia9.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : Audi A9</label><label>Preis : 100 Euro </label></div><div><img src="AutonomCarImages/porschemissione.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : Chevrolet Camaro</label><label>Preis : 110 Euro </label></div>';
		var transportAutonom = '<div><img src="AutonomCarImages/nikolautv.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : Nikola UTV</label><label>Preis : 65 Euro </label></div><div><img src="AutonomCarImages/nissannv2.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : Nissan NV2</label><label>Preis : 55 Euro </label></div><div><img src="AutonomCarImages/vwet.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : VW ET</label><label>Preis : 60 Euro </label></div><div><img src="AutonomCarImages/s-tran.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : S-Tran</label><label>Preis : 70 Euro </label></div>';
		var arbeitAutonom = '<div><img src="AutonomCarImages/mercedeseq.png"  style="width:300px;height:150px;"><label>Bezeichnung : Mercedes EQ</label><label>Preis : 60 Euro </label></div><div><img src="AutonomCarImages/t.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : Toroidion</label><label>Preis : 65 Euro </label></div><div><img src="AutonomCarImages/maybach2.png"  style="width:300px;height:150px;"><label>Bezeichnung : Maybach2</label><label>Preis : 90 Euro </label></div><div><img src="AutonomCarImages/audietron.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : S-Tran</label><label>Preis : 80 Euro </label></div>		';
		var transportManuel = '<div><img src="ManuelCarImages/cc1.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : CC1</label><label>Preis : 70 Euro </label></div><div><img src="ManuelCarImages/vwtransporter.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : VW Transporter</label><label>Preis : 65 Euro </label></div><div><img src="ManuelCarImages/vwmultivan.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : VW Multivan</label><label>Preis : 55 Euro </label></div><div><img src="ManuelCarImages/citroenberlingo.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : Citroen Berlingo</label><label>Preis : 40 Euro </label></div>';
		var familieAutonom = '<div><img src="AutonomCarImages/vwbudde.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : VW Budd E</label><label>Preis : 35 Euro </label></div><div><img src="AutonomCarImages/bmw4000.png"  style="width:300px;height:150px;"><label>Bezeichnung : BMW 4000</label><label>Preis : 45 Euro </label></div><div><img src="AutonomCarImages/leseeev.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : LeSEE EV</label><label>Preis : 55 Euro </label></div><div><img src="AutonomCarImages/teslamodels.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : Tesla Model S</label><label>Preis : 50 Euro </label></div>';
		var arbeitManuel = '<div><img src="ManuelCarImages/vwpassat.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : VW Passat</label><label>Preis : 50 Euro </label></div><div><img src="ManuelCarImages/audirs4.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : Audi Rs4</label><label>Preis : 55 Euro </label></div><div><img src="ManuelCarImages/vwtouran.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : VW Touran </label><label>Preis : 55 Euro </label></div><div><img src="ManuelCarImages/mercedescl500.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : Mercedes CL 500</label><label>Preis : 70 Euro </label></div>';
		var familieManuel = '<div><img src="ManuelCarImages/vwgolf.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : VW Golf</label><label>Preis : 50 Euro </label></div><div><img src="ManuelCarImages/smart.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : Smart</label><label>Preis : 30 Euro </label></div><div><img src="ManuelCarImages/bmw.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : BMW </label><label>Preis : 60 Euro </label></div><div><img src="ManuelCarImages/alfaromeo.jpg"  style="width:300px;height:150px;"><label>Bezeichnung : Alfa Romeo</label><label>Preis : 55 Euro </label></div>';
			
			
			break;
		case "Bestellübersicht":
			// Blah
			break;
		case "Zusatzfeatures":
			// Blah
			break;
		case "Endübersicht":	
			var htmlCode = '<div style="width:1000;height:400"> <h1 align="center" style="color:#1D30A9;font-size:22pt">Vielen Dank</h1><h1 align="center" style="color:#1D30A9;font-size:20pt">für Ihre Bestellung!</h1> <div align="center"><img src="porsche.jpg" style="width:500px;height:300px"><button type="button" class="button">Fertig</button></div>';
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