


/*include agustana campus reviews. 
Anthony Koleoso, Michael Roberts, Shahid Azam reviews from different schools add them ?*/
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

//dictionary of all profs scraped from beartracks corresponding to their nicknames on RMP
var profDic = {"You Jia-Huai": ["Jia", "You"], "Hoover H": ["Jim", "Hoover"], "Wong Kenny": ["Wong", "Ken"], "Greiner Russell":
["Russ", "Greiner"], "Kondrak Grzegorz": ["Greg", "Kondrak"], "Stringer Patricia": ["Trish", "Stringer"], "Ives John": 
["Jack", "Ives"], "Willoughby Pamela": ["Pam", "Willoughby"], "Vinebrooke Rolfe": ["Rolf", "Vinebrooke"], "Sanders Ralph Sean":
["Sean", "Sanders"], "Choi Phillip": ["Choi", "Philip"], "West Frederick": ["West", "Fred"], "Bremault-Phillips Suzette":
["Suzette", "Phillips"], "Qiu Zhi-Jun": ["Tony", "Qiu"], "Al-Hussein Mohamed": ["Mohammed", "Al-Husein"], "Haagsma Margriet":
["Margariet", "Haagsma"], "Khadem Seyed Amir": ["Amir", "Khadem"], "Yang Herbert": ["Herb", "Yang"], "Clark Frederick":
["Fred", "Clark"], "Pemberton Stuart": ["George", "Pemberton"], "Chacko Thomas": ["Tom", "Chacko"], "Sanchez-Azofeifa Gerardo": 
["Arturo", "Sanchez-Azofeifa"], "Ambury Bradley": ["Brad", "Ambury"], "Szostak Richard": ["Rick", "Szostak"],
"Young Catherine Denise": ["Denise", "Young"], "Parsons James": ["Jim", "Parsons"], "Iveson Margaret": ["Marg", "Iveson"],
"Kuropatwa Riki": ["Rikki", "Kuropatwa"], "McFeetors P Janelle": ["McFeetors", "Janelle"], "Kula Beverley": ["Bev", "Kula"],
"Gleddie Douglas": ["Doug", "Gleddie"], "Shultz Lynette": ["Lynette", "Schultz"], "Kachur Jerrold": ["Jerry", "Kachur"],
"Georgiou Georgios": ["George", "Georgiou"], "Evoy Stephane": ["Evoy", "Stephan"], "Elezzabi Abdulhakem": ["Abdul", "Elezzabi"],
"Decorby Raymond": ["Ray", "Decorby"], "Khajehoddin Sayed Ali": ["Ali", "Khajehoddin"], "Zuo Mingjian": ["Ming", "Zuo"],
"Perkins Lorimer Donald": ["Don", "Perkins"], "Savard Valérie": ["Savard", "Valerie"], "Pinterics Jocelyne":
["Natasha", "Pinterics"], "Kosman Marcel": ["Marcelle", "Kosman"], "Lemieux Hélène": ["Lemieux", "Helene"], "Boisvert Natalie":
["Nathalie", "Boisvert"], "Okeke-Ihejirika Philomina": ["Philomena", "Okeke"], "Di Cara Francesca": ["Francesca", "Dicara"],
"Schmitt Douglas": ["Doug", "Schmitt"], "Blunck Ute-Brigitte": ["Ute", "Blunck-Devique"], "McDougall E Ann": ["Ann", "McDougall"],
"Chandler Kathryn": ["Katherine", "Chandler"], "Magor Katharine": ["Kathy", "Magor"], "Yahya Moinuddin": ["Moin", "Yahya"],
"Arppe Antti Veikko Gabriel": ["Antti", "Arppe"], "Arnhold Anja-Helene": ["Anja", "Arnhold"], "Davis Vincent": ["Vince", "Davis"],
"Swaffield James": ["Jim", "Swaffield"], "Prus-Czarnecki Andrzej": ["Andrzej", "Czarnecki"], "Peschke Georg": ["George", "Peschke"]
,"Jar Pean-Yue": ["Ben", "Jar"], "Secanell Gallart Marc": ["Marc", "Secanell"], "Joseph Timothy": ["Tim", "Joseph"],
"Dempsey Lloyd": ["James", "Dempsey"], "Pollard Loreen": ["Lori", "Pollard"], "Gooley Alison": ["Allison", "Gooley"],
"Tse Frederick": ["Fred", "Tse"], "Masoud Seyed Hassan": ["Hassan", "Masoud"], "Corkum Philip": ["Phil", "Corkum"],
"Wilson Robert": ["Rob", "Wilson"], "Pogosian Dmitry": ["Dimitryi", "Pogosyan"], "Church W. John": ["John", "Church"],
"Aitken Robert": ["Rob", "Aitken"], "Beurki Beukian Sevan": ["Sevan", "Beukian"], "Lightbody James": ["Jim", "Lightbody"],
"Vargas Lascano Dayuma Ixchel": ["Dayuma", "Lascano"], "Noels Kimberly": ["Kim", "Noels"], "Masuda Takahiko":
 ["Taka", "Masuda"], "Colbourne Frederick": ["Fred", "Colbourne"], "Baerveldt Jacobus": ["Cor", "Baerveldt"],
"Kuiken Donald": ["Don", "Kuiken"], "Singhal Anthony": ["Tony", "Singhal"], "Kang Parmjit Kaur": ["Parmjit", "Kang"],
"BayatRizi Zohreh": ["Zohreh", "Bayatrizi"], "Bortolussi Dixon Marisa": ["Marisa", "Bortolussi"], "Brick Frederick":
["Rick", "Brick"], "Briggs Anthony": ["Tony", "Briggs"], "Bell Mary": ["Mebbie", "Bell"], "Bechtel Gregory": ["Greg", "Bechtel"]};

//constructor for professors information.
var Professor = function(name, rating, repeat, difficulty, chiliPepper, numRatings, url){
	this.name = name;
	this.rating = rating;
	this.repeat = repeat;
	this.difficulty = difficulty;
	this.chiliPepper = chiliPepper;
	this.numRatings = numRatings;
	this.url = url;
}


function requestSchedule(frameDoc, link){
	chrome.runtime.sendMessage({
		method: "GET",
		action: "schedule",
		//url of RMP search results for that professor
		url: "https://www.beartracks.ualberta.ca/psc/uahebprd/EMPLOYEE/HRMS/c/" + link, 
		//data: ""
	}, function (response){
		//console.log(response);
		console.log("https://www.beartracks.ualberta.ca/psc/uahebprd/EMPLOYEE/HRMS/c/" + link);
		var div = document.createElement("div");
		div.innerHTML = response;
		//console.log(div);
		displaySchedule(frameDoc, div)
		
	});
}

function displaySchedule(frameDoc, div){
	//console.log(div);
	frameDoc.body.appendChild(div);

}

//grabs all from names from beartracks 
function grabProfNames(frameDoc){

	var profIndex = 0;	
	var profCleanedName;
	var id = "win0divDERIVED_CLSRCH_SSR_INSTR_LONG$" + profIndex; //id of element containing professor names on beartracks
	var profNameParent = frameDoc.getElementById(id);

	var link = frameDoc.getElementsByClassName("ZSS_VARIABLE_MSG")[0].innerHTML;

	//remove extra characters
	link = link.slice(63, -78);
	//remove un needed string in links, otherwise reaches incorrect page
	link = link.replace("amp;", "");
	link = link.replace("amp;", "");
	console.log(link);
	if(link.includes("SA_LEARNER_SERVICES_")){
		console.log("Contains link");
		requestSchedule(frameDoc, link)
	}
	//console.log(link);
	
	//loops until it runs out of professor names to scrape
	while (profNameParent != null){

		//finding html text of professor name
		var profName = profNameParent.getElementsByTagName("div")[0].innerHTML;
		
		cleanProfName(profName)
		profCleanedName = profSplit;
	
		//continue to next id if professor has not been assigned
		if(profCleanedName == "To Be Assigned"){
			profIndex += 1;
			id = "win0divDERIVED_CLSRCH_SSR_INSTR_LONG$" + profIndex;
			profNameParent = frameDoc.getElementById(id);
		}

		//check to see if professor has a nickname, then get URL from RMP and continue to next id
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

/*RMP displays professors page with a special index that they create. 
To get around not knowing the special index, we first get search results of that prof for university alberta
using RMP search for prof option */ 
function getProfURL(profCleanedName, frameDoc, id){
	
	chrome.runtime.sendMessage({
		method: "POST",
		action: "xhttp",
		//url of RMP search results for that professor
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

//Professor existed, so scrape desired information.
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

		//professors review exist
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

		//professors reviews don't exist, but professor page exists
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

/*Displaying links to proper RMP pages along with the profs rating and corresponding rating color
onto beartracks*/
function injectRating(frameDoc, id, myProf, display){
	var profNameParent = frameDoc.getElementById(id);


	//link to RMP page
	profNameParent.getElementsByTagName("div")[0].innerHTML = ("<a href='" + myProf.url + "' target='_blank'>" + profNameParent.getElementsByTagName("div")[0].innerHTML + " - " + myProf.rating  + "</a>").bold();

	//professor has info to display
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

	//professor has no info to dsplay
	else{
		addToolTip(profNameParent, myProf, display)
	}
	
}

/*displaying all the professors scraped info into a tooltip that appears when hovered over
a professors name*/
function addToolTip(profNameParent, myProf, display){
	var card = document.createElement("div");
	card.setAttribute("class", "cardContainer");
	var image = document.createElement("img");
	
	//professor has information to display
	if(display == 1){

		image.setAttribute("width", "139px");
		if (myProf.chiliPepper){
			image.src = chrome.extension.getURL("Assets/new-cold-chili.png");
		}
		else{
			image.src = chrome.extension.getURL("Assets/new-hot-chili.png");
		}

		card.innerHTML = "<div class='card'> <div class='card-content' style = 'text-align: center;'> <div class = 'title'\
		 style = 'text-align: center; padding-top: 10px;'> <span class='card-title' style = 'font-size: 25px;'> <b>" + myProf.name + "</b> </span>\
		 </div> <span class = 'numRatings' style = 'font-size: 15px;'>" + myProf.numRatings+ "</span>\
		  <br> <br> <span id = 'qualityLabel' style = 'font-size: 15px;'> <b> Overall Quality </b> </span>\
		  <br> <span id = 'ratings' style = 'font-size: 15px;'>" + myProf.rating + "</span> <br> <br> <span id = 'takeAgainLabel'\
		  style = 'font-size: 15px;'> <b> Would take again </b> </span> <br> <span id = 'ratings' style = 'font-size: 15px;'>"
		  + myProf.repeat + "</span> <br> <br> <span id = 'difficultyLabel' style = 'font-size: 15px;'> <b> Difficulty </b> </span> <br>\
		  <span id = 'ratings' style = 'font-size: 15px;'>" + myProf.difficulty + "</span> <br> <br> <br> <span class = 'chili'>"
		  card.getElementsByClassName("chili")[0].appendChild(image); "</span> </div> </div>";
	}

	//no information to display
	else{
		image.setAttribute("height", "200px");
		image.src = chrome.extension.getURL("Assets/404.png");
		card.innerHTML = "<div class='card' style = 'text-align: center; padding-top: 10px;'> <div class='card-content'>\
		 <span class='card-title' style = 'font-size: 25px; font-weight: bold;'>" + myProf.name + " <br> </span>\
		  <span id = 'noProf' style = 'font-size: 15px;'>" + myProf.name + " seems to be missing from the RateMyProfessor pages,\
		   please add and review them </span> </div> </div>"
		  card.getElementsByClassName("card")[0].appendChild(image); 

	}

    //profNameParent is wrapper	
    profNameParent.closest(".PSLEVEL3GRIDROW").appendChild(card);

    var cardContainer = profNameParent.closest(".PSLEVEL3GRIDROW").getElementsByClassName('cardContainer')[0];
    cardContainer.style.display = 'none';

    //tooltip pop up with all required infromation
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

    //keeps tooltip displayed when it is moused over
    card.addEventListener("mouseover", function() {
    	card.style.display = 'block';
    });

    card.addEventListener("mouseout", function() {
    	card.style.display = 'none';
    });
}

//removes excess html from profs name
function cleanProfName(profName){

	//get rid of excess html
	var profCleaning = profName.slice(43, -24);

	if(profCleaning == "To Be Assigned"){
		
		profSplit = "To Be Assigned";
		return profSplit;
	}

	//return an array of last name, first name for easy manipulation later
	else{
		profSplit = profCleaning.split(",")
		return profSplit;
	}	
}