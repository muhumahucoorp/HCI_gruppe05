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
			var json = JSON.parse(request.responseText);
			if (json.reason === "no_db_file") {
				createDB();
			} else {
				var url = request.responseURL
				// console.log(typeof(url));
				var i = url.lastIndexOf("/", url.length - 1);
				var name = url.substring(i + 1);
				handlers[name]({ "_id" : name });
			}
		}
	}
};

function getCheckedRadio(name) {
	var options = document.getElementsByName(name);
	for (i = 0; i < options.length; i++) {
		var option = options[i];
		if (option.checked) {
			return option.value;
		}
	}
	return null;
}

function set(name) {
	request.open("GET", dburl + name, false);
	request.send();
}

function put(response, message) {
	request.open("PUT", dburl + response._id, false);
	request.setRequestHeader("Content-type", "application/json");
	message["_id"] = response._id;
	if (response._rev) {
		message["_rev"] = response._rev;
	}
	var s = JSON.stringify(message);
	// console.log("put: " + s);
	request.send(s);
}

function createDB() {
	request.open("PUT", dburl, false);
	request.send();
}

///////////////////////////////////////////////////////////////////////////////
// your code below

var dbname = "hci1";
var dburl = "http://127.0.0.1:5984/" + dbname + "/";
var handlers = {
	// current system task `service`, `car_selection`, ...
	"status" : setState,
	
	// is the `backwards button`
	"backward_button": setBackwards,
	
	// highlighted car number
	"car_choose" : setChoosenCarNumber,
	
	// party features
	"party_feature" : setPartyFeatures,
    
    // car selection
    "car_selection" : setCarSelection,
	
	// order view
	"order_view": setOrderView
};

function setState(response) {
	var src = document.getElementById("status");
	var index = src.selectedIndex;
	
	var sys_state = src.options[index].text;
	put(response, {"src" : src, "state" : sys_state});
}

function setBackwards(response) {
	var checked = document.getElementById("backward_button").checked;
	put(response, {"backward_button" : checked});
}

function setChoosenCarNumber(response) {
	var src = document.getElementById("car_choose");
	var index = src.selectedIndex;
	
	var car_state = src.options[index].text;
	put(response, {"src" : src, "state" : car_state});
}

function setPartyFeatures(response) {
	var src = document.getElementById("feature_box");
	var feature = src.value;
	
	put(response, {"src" : src, "feature" : feature});
}	

function setCarSelection(response) {
	var type = document.getElementById("type_choose");
	var d_type = document.getElementById("driving_type_choose");
    
    var typeText = type.options[type.selectedIndex].text;
    var d_typeText = d_type.options[d_type.selectedIndex].text;
    
	put(response, {"type" : typeText, "driving_type" : d_typeText});
}

function setOrderView(response) {
	put(response,
	{
		"service" : document.getElementById("service").value,
		"time_departure": document.getElementById("time_departure").value,
		"time_arrival": document.getElementById("time_arrival").value,
		"loc_departure": document.getElementById("loc_departure").value,
		"loc_arrival": document.getElementById("loc_arrival").value,
		"car": document.getElementById("car").value,
		"extra": document.getElementById("extra").value,
		"pay_method": document.getElementById("pay_method").value,
		"price": document.getElementById("price").value
	});
}