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

	//Don't exist on rmp Karim Ali, Pimental Demian, Nadi Sarah, Pilarski Patrick,
	var profDic = {"You Jia-Huai": ["Jia", "You"], "Hoover H": ["Jim", "Hoover"], "Wong Kenny": ["Wong", "Ken"], "Greiner Russell":
["Russ", "Greiner"], "Kondrak Grzegorz": ["Greg", "Kondrak"]};
	var profIndex = 0;	
	var profCleanedName;
	//var profCleaned;
	var id = "win0divDERIVED_CLSRCH_SSR_INSTR_LONG$" + profIndex; //id of element containing prof name
	var profNameParent = frameDoc.getElementById(id);
	
	while (profNameParent != null){

		//finding text of child from parent profName
		var profName = profNameParent.getElementsByTagName("div")[0].innerHTML;
		
		cleanProfName(profName)
		profCleanedName = profSplit;
	
		if(profCleanedName == "To Be Assigned"){
			profIndex += 1;
			id = "win0divDERIVED_CLSRCH_SSR_INSTR_LONG$" + profIndex;
			profNameParent = frameDoc.getElementById(id);
		}

		else{
			for(var key in profDic){
				if(key == profCleanedName[0] + " " + profCleanedName[1]){
					profCleanedName = profDic[key];
					break;
				}
			}

			getProfURL(profCleanedName, frameDoc, id)
			profIndex += 1;
			id = "win0divDERIVED_CLSRCH_SSR_INSTR_LONG$" + profIndex;
			profNameParent = frameDoc.getElementById(id);
		}
	}
}

function getProfURL(profCleanedName, frameDoc, id){
	
	chrome.runtime.sendMessage({
		method: "POST",
		action: "xhttp",
		url: "https://www.ratemyprofessors.com/search.jsp?query=university+of+alberta+" + profCleanedName[0] + "+" + profCleanedName[1],
		data: ""
	}, function (response){
		var div = document.createElement("div");
		div.innerHTML = response;

		//try if professor exists on RMP
		try{
			profurl = div.getElementsByClassName('listing PROFESSOR')[0].children[0].href;
			profurl = profurl.slice(profurl.indexOf("/ShowRatings"), profurl.length);
			profurl = "http://www.ratemyprofessors.com" + profurl;
			getRating(profurl, profCleanedName, frameDoc, id, 1)
		}

		//prof doesnt exist, need to change display on beartracks
		catch(TypeError){	
			var name;
			var rating;
			var takeAgain;
			var chiliPepper;
			var difficulty;
			var numRatings;

			name = profCleanedName[1] + " " + profCleanedName[0];
			profurl = "https://www.ratemyprofessors.com/teacher/create";
			rating = "N/A";
			takeAgain = "";
			chiliPepper = "";
			difficulty = "";
			numRatings = "";

			var myProf = new Professor(name, rating, takeAgain, difficulty, chiliPepper, numRatings, profurl);
			injectRating(frameDoc, id, myProf, 0)
		}
	});
}

function getRating(profurl, profCleanedName, frameDoc, id, display){
	chrome.runtime.sendMessage({
		method: 'POST',
		action: 'xhttp',
		url: profurl,
		data: ""
	}, function (response) {
		var div = document.createElement('div');
		div.innerHTML = response;
		var rating;
		var name;
		var takeAgain;
		var chiliPepper;
		var difficulty;
		var numRatings;
		var professorURL;
		try{
			rating  = (div.getElementsByClassName('grade')[0].innerHTML);
			name = div.getElementsByClassName("pfname")[0].innerHTML + " " + div.getElementsByClassName("plname")[0].innerHTML;
			takeAgain = (div.getElementsByClassName("grade")[1].innerHTML).trim();
			difficulty = (div.getElementsByClassName("grade")[2].innerHTML).trim();
			chiliPepper = div.getElementsByClassName("grade")[3].children[0].innerHTML;
			numRatings = (div.getElementsByClassName("table-toggle rating-count active")[0].innerHTML).trim();
			chiliPepper = chiliPepper.includes("cold");
			professorURL = profurl

			var myProf = new Professor(name, rating, takeAgain, difficulty, chiliPepper, numRatings, professorURL);
			injectRating(frameDoc, id, myProf, display);
		}

		catch(TypeError){
			rating = "N/A";
			name = profCleanedName[1] + " " + profCleanedName[0];
			takeAgain = "N/A";
			difficulty = "N/A";
			chiliPepper = "N/A";
			numRatings = "No Ratings".bold();
			professorURL = profurl;

			var myProf = new Professor(name, rating, takeAgain, difficulty, chiliPepper, numRatings, professorURL);
			injectRating(frameDoc, id, myProf, display);
		}
	});
}

function injectRating(frameDoc, id, myProf, display){
	var profNameParent = frameDoc.getElementById(id);

	profNameParent.getElementsByTagName("div")[0].innerHTML = ("<a href='" + myProf.url + "' target='_blank'>" + profNameParent.getElementsByTagName("div")[0].innerHTML + " - " + myProf.rating  + "</a>").bold();

	if(display == 1){
		if(myProf.rating < 2.5){
			profNameParent.closest(".PSLEVEL3GRIDROW").style.backgroundColor = "#ff0000"; // red = bad FF4136
		}

		else if (myProf.rating >= 2.5 && myProf.rating < 3.5 ){
			profNameParent.closest(".PSLEVEL3GRIDROW").style.backgroundColor = "#FFBF00"; // orange = okay FF851B
		}

		else if (myProf.rating >= 3.5 && myProf.rating <= 5 ){
			profNameParent.closest(".PSLEVEL3GRIDROW").style.backgroundColor = "#00ff00"; // green = good 00ff002ECC40
		}

		addToolTip(profNameParent, myProf, display)
	}

	else{
		//profNameParent.closest(".PSLEVEL3GRIDROW").style.backgroundColor = "#ffff00";
		addToolTip(profNameParent, myProf, display)
	}
	
}

function addToolTip(profNameParent, myProf, display){
	var card = document.createElement("div");
	card.setAttribute("class", "cardContainer");
	var image = document.createElement("img");
	
	if(display == 1){

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
	}

	else{
		image.src = chrome.extension.getURL("Assets/404.png");
		card.innerHTML = "<div class='card'> <div class='card-content' style = 'text-align: center;'>  <div class = 'title'\
	 style = 'text-align: center; padding-top: 20px;'> <span class='card-title' style = 'font-size: 25px;'> <b>" + myProf.name + 
	 "</b> </span> </div> <span id = 'noProf' style = 'font-size: 15px;'>" + myProf.name + " seems to be missing from <br> the\
	 RateMyProfessor pages, <br> please add them <br> and review them on RateMyProfessor</span> <span class = 'chili'>"
		  card.getElementsByClassName("chili")[0].appendChild(image); "</span> </div> </div>";
	}

    //profNameParent is wrapper	
    profNameParent.closest(".PSLEVEL3GRIDROW").appendChild(card);

    var cardContainer = profNameParent.closest(".PSLEVEL3GRIDROW").getElementsByClassName('cardContainer')[0];
    cardContainer.style.display = 'none';

    profNameParent.addEventListener("mouseover", function() {
    	
			card.style.display = 'block';
			card.style.backgroundColor = "white";
			card.style.borderWidth = "medium"
			card.style.borderColor = "#00431b";
			card.style.borderStyle = "solid";
    		card.style.color = "#00431b";
    		card.style.position = "absolute";
    		card.style.width = "300px";
    		card.style.height = "325px";

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
		
		profSplit = "To Be Assigned";
		return profSplit;
	}

	//cleaning name to look normal
	else{
		profSplit = profCleaning.split(",")
		return profSplit;
	}	
}