
// professors [ "Hoover H", "Pilarski Patrick", "Wong Kenny"], cause problems. Dont exist/nicknames

var ProfessorArray = [];

window.onload = function () {

 	var frame = document.getElementsByName("TargetContent")[0];
	var frameDoc = frame.contentDocument;
	var count = 0;

	/*listen for change in dom, check if it is the Class Search Result
	have to listen for dom changes because url does not change, but content we need changes on page
	find better way of listening if possible*/
	frameDoc.addEventListener("DOMSubtreeModified", function(){

		try{
			if ("Class Search Results" == frameDoc.getElementById("DERIVED_REGFRM1_TITLE1").innerHTML && count == 0){
				count = 1;
				console.log("Class Search Results");
				grabProfNames(frameDoc)
			}
			else if ("Class Search Results" == frameDoc.getElementById("DERIVED_REGFRM1_TITLE1").innerHTML && count == 1){

			}
		}
		catch(notSearchResults){
			count = 0;
		}

	}, false);
};


//constructor for professors.
var Professor = function(name, rating, repeat, difficulty, chiliPepper, numRatings, url){
	this.name = name;
	this.rating = rating;
	this.repeat = repeat;
	this.difficulty = difficulty;
	this.chiliPepper = chiliPepper;
	this.numRatings = numRatings;
	this.url = url;
}

function grabProfNames(frameDoc){

	var profArray = [];
	var profIndex = 0;
	var profCleanedName;
	var profCleaned;
	var id = "win0divDERIVED_CLSRCH_SSR_INSTR_LONG$" + profIndex; //id of element containing prof name
	var profNameParent = frameDoc.getElementById(id);

	//var classCount = 0;
	
	while (profNameParent != null){

		//finding text of child from parent profName
		var profName = profNameParent.getElementsByTagName("div")[0].innerHTML;
		
		cleanProfName(profName)
		profCleanedName = profSplit;
		console.log("profCleanedName: " + profCleanedName)
		//classCount += 1;

		if(profCleanedName == "To Be Assigned"){
			profIndex += 1;
			id = "win0divDERIVED_CLSRCH_SSR_INSTR_LONG$" + profIndex;
			profNameParent = frameDoc.getElementById(id);
		}

		else{
			profCleaned = profCleanedName[1] + " " + profCleanedName[0];
			
			//check to see if prof was already added to array
			// if(profArray.indexOf(profCleaned) > -1){
			// 	// for (var i = 0; i <= ProfessorArray.length; i++){
			// 	// 	if(ProfessorArray[i].name == profCleaned){
			// 	// 		console.log("Repeated: " + profCleaned);
			// 	// 		// injectRating(frameDoc, id, myProf[i])
			// 	// 		// break;
			// 	// 	}
			// 	// }
			// 	// console.log("Length: " + ProfessorArray.length);
			// 	console.log("Repeated: " + profCleaned);
			// 	profIndex += 1;
			// 	id = "win0divDERIVED_CLSRCH_SSR_INSTR_LONG$" + profIndex;
			// 	profNameParent = frameDoc.getElementById(id);

			// }


			//else{
				profArray.push(profCleaned);
				console.log("Prof to get info: " + profCleanedName);
				getProfURL(profCleanedName, frameDoc, id)
				//console.log("Length: " + ProfessorArray.length);
				profIndex += 1;
				id = "win0divDERIVED_CLSRCH_SSR_INSTR_LONG$" + profIndex;
				profNameParent = frameDoc.getElementById(id);
				//getProfURL(profCleanedName);
				//console.log(profCleanedName);
			//}
		}

	}
	console.log(profArray)
	//console.log("Number of Classes: " + classCount);

}

function getProfURL(profCleanedName, frameDoc, id){
	//console.log("https://www.ratemyprofessors.com/search.jsp?query=university+of+alberta+" + profCleanedName[0] + "+" + profCleanedName[1]);

	console.log("Length in getProfUrl: " + ProfessorArray.length);
	// for (var i = 0; i <= ProfessorArray.length; i++){
	// 	if(ProfessorArray[i].name == profCleanedName[1] + " " + profCleanedName[0]){
	// 		console.log("Repeated prof: " + profCleanedName[1] + " " + profCleanedName[0])
	// 	}
	// }
	

	chrome.runtime.sendMessage({
		method: "POST",
		action: "xhttp",
		url: "https://www.ratemyprofessors.com/search.jsp?query=university+of+alberta+" + profCleanedName[0] + "+" + profCleanedName[1],
		data: ""
	}, function (response){
		//console.log("profs full name: " + profCleanedName[0] + " " + profCleanedName[1]);
		var div = document.createElement("div");
		div.innerHTML = response;
		profurl = div.getElementsByClassName('listing PROFESSOR')[0].children[0].href;
		profurl = profurl.slice(profurl.indexOf("/ShowRatings"), profurl.length);
		profurl = "http://www.ratemyprofessors.com" + profurl;
		//console.log(profCleanedName[0] + " " + profCleanedName[1] + " url: " + profurl);
		getRating(profurl, profCleanedName, frameDoc, id)
	});
}

function getRating(profurl, profCleanedName, frameDoc, id){
	chrome.runtime.sendMessage({
		method: 'POST',
		action: 'xhttp',
		url: profurl,
		data: ""
	}, function (response) {
		var div = document.createElement('div');
		div.innerHTML = response;
		//console.log(response);
		var rating;
		var name;
		var takeAgain;
		var chiliPepper;
		var difficulty;
		var numRatings;
		var professorURL;
		if(!isNaN(div.getElementsByClassName('grade')[0].innerHTML))
		{
			rating  = (div.getElementsByClassName('grade')[0].innerHTML);
			name = div.getElementsByClassName("pfname")[0].innerHTML + " " + div.getElementsByClassName("plname")[0].innerHTML;
			takeAgain = (div.getElementsByClassName("grade")[1].innerHTML).trim();
			difficulty = (div.getElementsByClassName("grade")[2].innerHTML).trim();
			chiliPepper = div.getElementsByClassName("grade")[3].children[0].innerHTML;
			numRatings = (div.getElementsByClassName("table-toggle rating-count active")[0].innerHTML).trim();
			chiliPepper = chiliPepper.includes("cold");
			professorURL = profurl

			var myProf = new Professor(name, rating, takeAgain, difficulty, chiliPepper, numRatings, professorURL);
			console.log("Length of pushing: " + ProfessorArray.length);
			ProfessorArray.push(myProf);
			//chiliPepper = chiliPepper.includes("cold");
			//console.log("Would take again: " + chiliPepper);
		}
		else{
			rating = "N/A";
			name = "N/A";
			takeAgain = "N/A";
			difficulty = "N/A";
			chiliPepper = "N/A";
			numRatings = "N/A";
			professorURL = profurl;

			var myProf = new Professor(name, rating, takeAgain, difficulty, chiliPepper, numRatings);
			ProfessorArray.push(myProf);
		}
		
		console.log(profCleanedName[0] + " " + profCleanedName[1] + " url: " + myProf.url + " rating: " + rating);
		injectRating(frameDoc, id, myProf);
	});
}

function injectRating(frameDoc, id, myProf){
	var profNameParent = frameDoc.getElementById(id);
	//profNameParent.getElementsByTagName("div")[0].innerHTML = (profNameParent.getElementsByTagName("div")[0].innerHTML + " - " + "<a href='" + profurl  + "' target='_blank'>" + rating  + "</a>").bold();
	profNameParent.getElementsByTagName("div")[0].innerHTML = ("<a href='" + myProf.url + "' target='_blank'>" + profNameParent.getElementsByTagName("div")[0].innerHTML + " - " + myProf.rating  + "</a>").bold();

	if(myProf.rating < 2.5)
	{
		profNameParent.closest(".PSLEVEL3GRIDROW").style.backgroundColor = "#ff0000"; // red = bad FF4136
	}
	else if (myProf.rating >= 2.5 && myProf.rating < 3.5 )
	{
		profNameParent.closest(".PSLEVEL3GRIDROW").style.backgroundColor = "#FFBF00"; // orange = okay FF851B
	}
	else if (myProf.rating >= 3.5 && myProf.rating <= 5 )
		{
		profNameParent.closest(".PSLEVEL3GRIDROW").style.backgroundColor = "#00ff00"; // green = good 00ff002ECC40
	}

	addToolTip(profNameParent, myProf)

}

function addToolTip(profNameParent, myProf){
	var card = document.createElement("div");
	card.setAttribute("class", "cardContainer");
	var image = document.createElement("img");
	image.setAttribute("width", "139px");

	if (myProf.chiliPepper){

		image.src = chrome.extension.getURL("Assets/new-cold-chili.png");
	}
	else{

		image.src = chrome.extension.getURL("Assets/new-hot-chili.png");
	}
	
	card.innerHTML = "<div class='card'> <div class='card-content' style = 'text-align: center;'> <div class = 'title'\
	 style = 'text-align: center; padding-top: 20px;'> <span class='card-title' style = 'font-size: 25px;'> <b>" + myProf.name + "</b> </span>\
	 </div> <span class = 'numRatings' style = 'font-size: 15px;'>" + myProf.numRatings+ "</span>\
	  <br> <br> <span id = 'qualityLabel' style = 'font-size: 15px;'> <b> Overall Quality </b> </span>\
	  <br> <span id = 'ratings' style = 'font-size: 15px;'>" + myProf.rating + "</span> <br> <br> <span id = 'takeAgainLabel'\
	  style = 'font-size: 15px;'> <b> Would take again </b> </span> <br> <span id = 'ratings' style = 'font-size: 15px;'>"
	  + myProf.repeat + "</span> <br> <br> <span id = 'difficultyLabel' style = 'font-size: 15px;'> <b> Difficulty </b> </span> <br>\
	  <span id = 'ratings' style = 'font-size: 15px;'>" + myProf.difficulty + "</span> <br> <br> <span class = 'chili'>"
	  card.getElementsByClassName("chili")[0].appendChild(image); "</span> </div> </div>";

    //profNameParent is wrapper
    profNameParent.closest(".PSLEVEL3GRIDROW").appendChild(card);

    var cardContainer = profNameParent.closest(".PSLEVEL3GRIDROW").getElementsByClassName('cardContainer')[0];
    cardContainer.style.display = 'none';

    //var cardContainer = element.getElementsByClassName('cardContainer')[0];
    profNameParent.addEventListener("mouseover", function() {
    	
			card.style.display = 'block';
			card.style.backgroundColor = "white";
			//card.style.backgroundColor = "#e6efde";
			card.style.borderWidth = "medium"
			card.style.borderColor = "#00431b";
			card.style.borderStyle = "solid";
    		card.style.color = "#00431b";
    		card.style.position = "absolute";
    		card.style.width = "300px";
    		card.style.height = "325px";

			//cardContainer.style.backgroundColor = "cyan";
    });
    profNameParent.addEventListener("mouseout", function() {
    	
				card.style.display = 'none';
    });

    card.addEventListener("mouseover", function() {
    	card.style.display = 'block';
    });

    card.addEventListener("mouseout", function() {
    	card.style.display = 'none';
    });
}

function cleanProfName(profName){
	//get rid of excess html
	var profCleaning = profName.slice(43, -24);

	if(profCleaning == "To Be Assigned"){
		//console.log("fucking to be assigned");
		profSplit = "To Be Assigned";
		return profSplit;
	}

	//cleaning name to look normal
	else{
		//profCleaning = profCleaning.split(",")
		profSplit = profCleaning.split(",")
		//profCleaned = profCleaning[0] + " " + profCleaning[1];
		//return profCleaned;
		//console.log('ProfSplit: '+ profSplit);
		return profSplit;
		//console.log("profCleaned: " + profCleaned);
	}	
}