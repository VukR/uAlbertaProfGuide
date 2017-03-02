chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){

/*https://developer.chrome.com/extensions/xhr#extension-origin
https://developer.chrome.com/extensions/runtime#event-onMessage
https://developer.chrome.com/extensions/runtime#method-sendMessage*/

	if(request.action == "xhttp"){
		//creating XMLHttpRequest object
		var xhttp = new XMLHttpRequest();
		//waits for request to be finished and response is ready
		xhttp.onload = function(){
			//returning response data as a string
			var response = xhttp.responseText;
			sendResponse(response);
		};

		//specifies request, url is a file on the server
		xhttp.open(request.method, request.url, true);
		
		//send request to server
		xhttp.send();
		return true;
	}

	else if(request.action == "schedule"){
		var xhttp = new XMLHttpRequest();

		// setTimout(continue(), 1000);
		// function continue(){
		// }

		xhttp.onload = function(){
			var response = xhttp.responseText;
			sendResponse(response);
		};

		//initializing request
		xhttp.open(request.method, request.url, true);
		
		//send request
		xhttp.send();
		return true;
	}
	
});