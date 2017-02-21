
// professors [ "Hoover H", "Pilarski Patrick", "Wong Kenny"], cause problems. Dont exist/nicknames

window.onload = function () {

 	var frame = document.getElementsByName("TargetContent")[0];
	var frameDoc = frame.contentDocument;
	var count = 0;

	//listen for change in dom, check if it is the Class Search Result
	//have to listen for dom changes because url does not change, but content we need changes on page
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

function grabProfNames(frameDoc){

	var profArray = [];
	var profIndex = 0;
	var profCleanedName;
	var profCleaned;
	var id = "win0divDERIVED_CLSRCH_SSR_INSTR_LONG$" + profIndex;
	var profNameParent = frameDoc.getElementById(id);

	while (profNameParent != null){

		//finding text of child from parent profName
		var profName = profNameParent.getElementsByTagName("div")[0].innerHTML;
		
		//getting id of next prof
		// profIndex += 1;
		// id = "win0divDERIVED_CLSRCH_SSR_INSTR_LONG$" + profIndex;
		// profNameParent = frameDoc.getElementById(id);

		cleanProfName(profName)
		//profCleanedName = profCleaned;
		profCleanedName = profSplit;
		profCleaned = profCleanedName[0] + " " + profCleanedName[1];

		//check to see if prof was already added to array
		if(profArray.indexOf(profCleaned) > -1){
			profIndex += 1;
			id = "win0divDERIVED_CLSRCH_SSR_INSTR_LONG$" + profIndex;
			profNameParent = frameDoc.getElementById(id);

		}
		else{
			profArray.push(profCleaned);
			console.log("Current prof: " + profCleanedName);
			getProfURL(profCleanedName, frameDoc, id)
			profIndex += 1;
			id = "win0divDERIVED_CLSRCH_SSR_INSTR_LONG$" + profIndex;
			profNameParent = frameDoc.getElementById(id);
			//getProfURL(profCleanedName);
			//console.log(profCleanedName);
		}

	}
	console.log(profArray)
	//getProfURL(["Hayward", "Ryan"])

}

function getProfURL(profCleanedName, frameDoc, id){
	//console.log("https://www.ratemyprofessors.com/search.jsp?query=university+of+alberta+" + profCleanedName[0] + "+" + profCleanedName[1]);
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
		var takeAgain
		var chiliPepper
		if(!isNaN(div.getElementsByClassName('grade')[0].innerHTML))
		{
			rating  = (div.getElementsByClassName('grade')[0].innerHTML);
			name = (div.getElementsByClassName("pfname")[0].innerHTML + " " + div.getElementsByClassName("plname")[0].innerHTML).bold();
			takeAgain = (div.getElementsByClassName("grade")[1].innerHTML).trim();
			difficulty = (div.getElementsByClassName("grade")[2].innerHTML).trim();
			chiliPepper = div.getElementsByClassName("grade")[3].children[0].innerHTML;
			numRatings = (div.getElementsByClassName("table-toggle rating-count active")[0].innerHTML).trim();

			chiliPepper = chiliPepper.includes("cold");
			//console.log("Would take again: " + chiliPepper);
		}
		else{
			rating = "N/A";
		}
		
		console.log(profCleanedName[0] + " " + profCleanedName[1] + " url: " + profurl + " rating: " + rating);
		injectRating(profurl, rating, frameDoc, id, name, takeAgain, difficulty, chiliPepper, numRatings);
	});
}

function injectRating(profurl, rating, frameDoc, id, name, takeAgain, difficulty, chiliPepper, numRatings){
	var profNameParent = frameDoc.getElementById(id);
	//profNameParent.getElementsByTagName("div")[0].innerHTML = (profNameParent.getElementsByTagName("div")[0].innerHTML + " - " + "<a href='" + profurl  + "' target='_blank'>" + rating  + "</a>").bold();
	profNameParent.getElementsByTagName("div")[0].innerHTML = ("<a href='" + profurl + "' target='_blank'>" + profNameParent.getElementsByTagName("div")[0].innerHTML + " - " + rating  + "</a>").bold();

	if(rating < 2.5)
	{
		profNameParent.closest(".PSLEVEL3GRIDROW").style.backgroundColor = "#ff0000"; // red = bad FF4136
	}
	else if (rating >= 2.5 && rating < 3.5 )
	{
		profNameParent.closest(".PSLEVEL3GRIDROW").style.backgroundColor = "#FFBF00"; // orange = okay FF851B
	}
	else if (rating >= 3.5 && rating <= 5 )
	{
		profNameParent.closest(".PSLEVEL3GRIDROW").style.backgroundColor = "#00ff00"; // green = good 00ff002ECC40
	}

	addToolTip(profNameParent, name, rating, takeAgain, difficulty, chiliPepper, numRatings)

}

function addToolTip(profNameParent, name, rating, takeAgain, difficulty, chiliPepper, numRatings, profurl){
	var card = document.createElement("div");
	card.setAttribute("class", "cardContainer");
	var image = document.createElement("img");
	image.setAttribute("width", "139px");

	if (chiliPepper){

		image.src = chrome.extension.getURL("Assets/new-cold-chili.png");
	}
	else{

		image.src = chrome.extension.getURL("Assets/new-hot-chili.png");
	}
	
	"<a href='" + profurl  + "' target='_blank'>" + rating  + "</a>"
	card.innerHTML = "<div class='card'> <div class='card-content' style = 'text-align: center;'> <div class = 'title'\
	 style = 'text-align: center; padding-top: 20px;'> <span class='card-title' style = 'font-size: 25px;'>" + name + "</span>\
	 </div> <span class = 'numRatings' style = 'font-size: 15px;'>" + numRatings+ "</span>\
	  <br> <br> <span id = 'qualityLabel' style = 'font-size: 15px;'> <b> Overall Quality </b> </span>\
	  <br> <span id = 'ratings' style = 'font-size: 15px;'>" + rating + "</span> <br> <br> <span id = 'takeAgainLabel'\
	  style = 'font-size: 15px;'> <b> Would take again </b> </span> <br> <span id = 'ratings' style = 'font-size: 15px;'>"
	  + takeAgain + "</span> <br> <br> <span id = 'difficultyLabel' style = 'font-size: 15px;'> <b> Difficulty </b> </span> <br>\
	  <span id = 'ratings' style = 'font-size: 15px;'>" + difficulty + "</span> <br> <br> <span class = 'chili'>"
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
	}

	//cleaning name to look normal
	else{
		//profCleaning = profCleaning.split(",")
		profSplit = profCleaning.split(",")
		//profCleaned = profCleaning[0] + " " + profCleaning[1];
		//return profCleaned;
		return profSplit;
		//console.log("profCleaned: " + profCleaned);
	}	
}