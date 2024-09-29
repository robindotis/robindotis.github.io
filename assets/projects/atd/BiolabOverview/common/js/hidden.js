//window.onerror = null;

var strGlossaryTerm = "a";  //The glossary reads this term, to determine where to start.
						    //It is set when the user clicks on a highlighted word in the text


//var bAudio = true;
var bAudio = false;

//These values show whether a window is open or not (0=closed,1=open)
var intGlossary = 0;
var intBookmarks = 0;
var intSearch = 0;
var intPrint = 0;
var intNotes = 0;

//-----------------------------------
//----- Check For Sound -------------
//-----------------------------------

function checkSound()
{
	//var bSoundEnabled = document.embeds[0].IsSoundCardEnabled();
	var bSoundEnabled = false; //document.embeds[0].IsSoundCardEnabled();
	
	if (!bSoundEnabled)
	{
		audioEnabled = false;
		bAudio = false;
	}
	parent.TOOLBAR.location.replace('toolbar.htm');	
}

//Check for sound capabilities
var NS4 = (document.layers) ? true : false;		// NS4 = true if browser supports 'document.layers' object
var IE4 = (document.all) ? true : false;			// IE4 = true if browser supports the 'document.all' object
var soundStatus = 'Not Active';
var NSsound = navigator.plugins && navigator.plugins["LiveAudio"];
//window.alert(navigator.plugins);
//var NSsound = navigator.plugins;
//var NSsound = navigator.plugins["LiveAudio"];
var IEsound = navigator.plugins && document.all;
var audioEnabled = NSsound || IEsound;

if (audioEnabled) bAudio = true
//if (!audioEnabled) alert("Your browser cannot play sound files.")
//if (!navigator.javaEnabled()) alert("Your browser is not Java-enabled. Please edit preferences.")

//-----------------------------------
//------ Functions ------------------
//-----------------------------------

//*********************
//Name:	DeterminePage
//Purpose:	Determines the page number of the page selected from the lesson map and
//		sets the current page variable
//Params:	longcode - longcode of page selected from lesson map
//Return:	None
//Created:	16/12/1998 (RM)
//Modified:	16/12/1998 (RM)
//*********************
function DeterminePage(id)
{
  var iId = id;
  var i=0;

  while (iId != self.L.Page[i].id)
  {
	i++;
  }

  
  parent.HIDDEN.iCurrentPage = i;
  parent.TOOLBAR.setButtons(i);

  return i;
}


//*********************
//Name:	checkNotes
//Purpose:	Checks whether the current page has any notes atached to it.
//		If it does, it shows the paperclip in the toolbar, if not it hides it
//Params:	intPage - page number on which to check for notes
//Return:	None
//Created:	04/11/1998 (RM)
//Modified:	10/11/1998 (RM)
//*********************
function checkNotes(iPage)
{
  var iThisPage = iPage;
  //assign the relevant gif, depending on whether notes are present or not
  if (self.L.Page[iThisPage].notes==0) parent.TOOLBAR.document.paperclip_on_img.src = parent.TOOLBAR.paperclip_off_img.src
  else parent.TOOLBAR.document.paperclip_on_img.src = parent.TOOLBAR.paperclip_on_img.src
}

//*********************
//Name:		compareKeywords
//Purpose:	compares current word to page keywords and returns true or false
//Params:	aWords - array containing all search words
//			sWords - string containing page keywords
//			sType - AND/OR
//Return:	true or false
//Created:	13/04/1999 (RM)
//Modified:	13/04/1999 (RM)
//*********************
function compareKeywords(aWords,sWords,sType)
{
	aSearchWords = new Array();
	aSearchWords = aWords;
	var iSearchLength = aSearchWords.length
	var w = sWords;
	aCurrentWords = new Array();
	aCurrentWords = w.split(";");
	var intArrayLength = aCurrentWords.length;
		
	if (sType=="OR")
	{
		var strFound = "false";
		for (var i=0;i<iSearchLength;i++)
		{
			if (aSearchWords[i]=="")
				i++
			else
			{
				for (var h=0;h<intArrayLength;h++)
				{
					if (aSearchWords[i] == aCurrentWords[h]){strFound="true";}
				}
			}
		}
		return strFound;
	}
	else if (sType=="AND")
	{
		var strFound = "";
		for (var i=0;i<iSearchLength;i++)
		{
			if (aSearchWords[i]=="")
				i++
			else
			{
				var blnFound = false;
				for (var h=0;h<intArrayLength;h++)
				{
					if (aSearchWords[i] == aCurrentWords[h]){blnFound=true;}
				}
				//strFound is a list of flags as to whether the word was found or not 0=no,1=yes.
				if (blnFound) {strFound = strFound +"1";}
				else {strFound = strFound +"0";}
			}
		}
		return strFound;
	}
}

//*********************
//Name:	showVisited
//Purpose:	Shows a string representing the visited pages, as well as other data.
//		ONLY FOR DEVELOPMENT PURPOSES
//Params:	None
//Return:	None
//Created:	04/11/1998 (RM)
//Modified:	10/11/1998 (RM)
//*********************
function showVisited()
{
  var strVisited = ""
  for (var i=0;i<top.HIDDEN.iPageCount;i++)
  {
	strVisited = strVisited+top.HIDDEN.aBookmarks[i]
  }
  document.FRM.test.value=strVisited;
  document.FRM.prePage.value=top.HIDDEN.iPreviousPage;
  document.FRM.currPage.value=top.name //HIDDEN.intCurrPage;
  document.FRM.notes.value=top.HIDDEN.aNotes[top.HIDDEN.iCurrentPage];
}

//*********************
//Name:	Search
//Purpose:	Searches the keywords array for words eneterd by the user in the search form
//			This function is called from the search form (search.htm)
//Params:	strWords -	words entered by user to be searched for.
//			blnCase -	if = true the search is case sensitive,
//						if = false the search is not case sensitive.
//			strLogic -	if = AND all words have to be found,
//						if = OR any of the words have to be found.
//Return:	strPages -	a string containing a comma delimited list of all pages containing the search words
//Created:	12/11/1998 (RM)
//Modified:	17/11/1998 (RM)
//*********************
function Search(strWords, blnCase, strLogic)
{
  var strKeywords = strWords;
  var strAndOr = strLogic;
  var strPages = "";
  var strTabs = "T";
  var strSteps = "S,";
  var strCurrentWord = "";
  var strWordIndex = "";	//only used when logic is AND
  var chrCurrentChar = '';
  var blnCaseSensitive = blnCase;
  var strFound = "false";
  var j=0;
  var intLength = 0;
  var intWordCount=0;		//counts number of words entered by user
							//- only used when logic is AND


  //if search is not case sensitive, convert keywords to lowercase
  if (blnCaseSensitive == false) {strKeywords = strWords.toLowerCase();}

  intLength = strKeywords.length;

  //convert string into an array
  aWords = new Array();
  aWords = strKeywords.split(" ");

  for (var i=0;i<=iPageCount;i++)
  {
	if (L.Page[i].nTabs != 0)
	{
		for (var jj=0;jj<L.Page[i].nTabs;jj++)
		{
			if (L.Page[i].Tab[jj].nSteps != 0)
			{
				// add keywords of tab to those of steps in this tab
				var w = L.Page[i].Tab[jj].keywords+";";

				// add keywords of page to first tab
				if (jj==0) 
					w = w + L.Page[i].keywords+";"
					
				//go through steps to determine all keywords of steps in page
				for (var k=0;k<L.Page[i].Tab[jj].nSteps;k++)
				{
					w = w + L.Page[i].Tab[jj].Step[k].keywords +";";
				}
				if (blnCaseSensitive == false) {w = w.toLowerCase();}

				strFound = compareKeywords(aWords,w,strAndOr);				

				// check if current page/tab is to be added to return string
				// if strFound = true/false we are in "OR" mode and don't have to check
				// for index of '0'.
				if (strFound=="true")
				{
					var iNum = jj+1;
					strPages = strPages+i.toString()+",";
					strTabs = strTabs+iNum.toString()+",";
				}
				// else have to check for '0'.
				else if ((strFound != "false")&&(strFound.indexOf("0")==-1))
				{
					var iNum = jj+1;
					strPages = strPages+i.toString()+"'";
					strTabs = strTabs+iNum.toString()+"'";
				}
			}						
			else
			{
				var w = L.Page[i].Tab[jj].keywords+";";

				// add keywords of page to first tab
				if (jj==0) 
					w = w + L.Page[i].keywords+";"

				if (blnCaseSensitive == false) {w = w.toLowerCase();}

				strFound = compareKeywords(aWords,w,strAndOr);				

				// check if current page/tab is to be added to return string
				// if strFound = true/false we are in "OR" mode and don't have to check
				// for index of '0'.
				if (strFound=="true")
				{
					var iNum = jj+1;
					strPages = strPages+i.toString()+",";
					strTabs = strTabs+iNum.toString()+",";
				}
				// else have to check for '0'.
				else if ((strFound != "false")&&(strFound.indexOf("0")==-1))
				{
					var iNum = jj+1;
					strPages = strPages+i.toString()+",";
					strTabs = strTabs+iNum.toString()+",";
				}
			}
		}
	}
	else if (L.Page[i].nSteps != 0)
	{
		var w = L.Page[i].keywords+";";

		//go through steps to determine all keywords of steps in page
		for (var jj=0;jj<L.Page[i].nSteps;jj++)
		{
			w = w + L.Page[i].Step[jj].keywords +";";
		}

		if (blnCaseSensitive == false) {w = w.toLowerCase();}

		strFound = compareKeywords(aWords,w,strAndOr);				

		// check if current page/tab is to be added to return string
		// if strFound = true/false we are in "OR" mode and don't have to check
		// for index of '0'.
		if (strFound=="true")
		{
			strPages = strPages+i.toString()+",";
			strTabs = strTabs+"0,";
		}
		// else have to check for '0'.
		else if ((strFound != "false")&&(strFound.indexOf("0")==-1))
		{
			strPages = strPages+i.toString()+",";
			strTabs = strTabs+"0,";
		}
	}
	else
	{
		var w = L.Page[i].keywords;

		if (blnCaseSensitive == false) {w = w.toLowerCase();}

		strFound = compareKeywords(aWords,w,strAndOr);				

		// check if current page/tab is to be added to return string
		// if strFound = true/false we are in "OR" mode and don't have to check
		// for index of '0'.
		if (strFound=="true")
		{
			strPages = strPages+i.toString()+",";
			strTabs = strTabs+"0,";
		}
		// else have to check for '0'.
		else if ((strFound != "false")&&(strFound.indexOf("0")==-1))
		{
			strPages = strPages+i.toString()+",";
			strTabs = strTabs+"0,";
		}
	}
  }

  //Returns string containing a list of all pages to which to show links
  return strPages+strTabs;
}

//**************************************************************************
//********************  Functions to create lesson structure ***************
//**************************************************************************

//*************************
//Name:	Lesson
//Purpose:	Creates lesson object
//Parameter:Pages - number of pages in lesson
//			Name - lesson name
//			Id - lesson ID
//Return:	None
//Created:	07/01/1999 (RM)
//Modified	07/01/1999 (RM)
//**************************
function Lesson(Pages,Name,Id)
{
	this.nPages = 0;
	this.Page = new Array();
	this.name = Name;
	this.id = Id;
	this.Popup = new Array();
}

//*************************
//Name:	Page
//Purpose:	Creates Page object
//Parameter:	Name - name of page
//			ID - page id
//			keywords - list of all keywords on page
//			Tabs - number of tabs in page
//			Steps - number of steps in page
//Return:	None
//Created:	07/01/1999 (RM)
//Modified	07/01/1999 (RM)
//*************************
function Page(Name,ID,Keywords,Tabs,Steps,PageName)
{
	this.name = Name;
	this.id = ID;
	this.keywords = Keywords;
	this.notes = 0;
	this.bookmarks = 0;
	this.visited = 0;
	this.nTabs = Tabs;
	this.nSteps = Steps;
	this.Tab = new Array(Tabs);
	this.Step = new Array(Steps);
	this.pagename = PageName;
}

//*************************
//Name:	Tab
//Purpose:	Creates Tab object
//Parameter:	Name - name of page
//			ID - page id
//			keywords - list of all keywords on page
//			Steps - number of steps in page
//Return:	None
//Created:	07/01/1999 (RM)
//Modified	07/01/1999 (RM)
//**************************
function Tab(Name,ID,Keywords,Steps)
{
	this.name = Name;
	this.id = ID;
	this.keywords = Keywords;
	this.bookmarks = 0;
	this.notes = 0;
	this.nSteps = Steps;
	this.Step = new Array(Steps);
}

//*************************
//Name:	Step
//Purpose:	Creates Step object
//Parameter:	Name - name of page
//			ID - page id
//			keywords - list of all keywords on page
//Return:	None
//Created:	07/01/1999 (RM)
//Modified	07/01/1999 (RM)
//**************************
function Step(Name,ID,Keywords)
{
	this.name = Name;
	this.id = ID;
	this.keywords = Keywords;
}

//*************************
//Name:	Popup
//Purpose:	Creates Popup object
//Parameter:	Name - filename of popup
//			ID - popup id
//			Height = height of popup window
//			Width = width of popup window
//Return:	None
//Created:	07/01/1999 (RM)
//Modified	07/01/1999 (RM)
//**************************
function Popup(Name,ID,Height,Width)
{
	this.name = Name;
	this.id = ID;
	this.height = Height;
	this.width = Width;
}
//**************************************************************************
//**************************************************************************
//**************************************************************************

function Tree(n)		   //Outline Class 
{
 this.nSub   = n;         //number of sub-categories
 this.C       = new Array(n);   //array of sub-categories
}

function Item(Id,Name,Ico,Sup,Lev,nSub,sta,Type,Keywords,Filename)
{
 this.Id   = Id;				//-- Object ID
 this.Name = Name;				//-- Object name
// this.Met  = Met;				//-- ATD CLASS Method(Path) to process details 
 this.Ico  = Ico;				//-- ATD CLASS Icon(Path)
 this.Sup  = Sup;				//-- Object parent Id (0 = NONE)
 this.Lev  = Lev;				//-- Level in Tree
 this.nSub = nSub;				//-- Number of direct descendants
 this.sel  = 0;                 //-- 0:Non-selected 1: Selected
 this.sta  = sta;               //-- 0:Collapsed 1:Expanded
 this.Type = Type;				//-- type of item: les/seg/unt/pag/tab/stp
 this.keywords = Keywords;		//-- keywords of page or tab
 this.filename = Filename;
 this.C    = new Array(nSub);	//-- Array of sub-categories
}

var iCounter = 0;
function createPageTree(obj)
{
 var sSubType = "";
 var sPageName = "";
 var iTabs = 0;
 var iSteps = 0;
 
 //alert("HI "+obj.Name);
 if (obj.Type=="pag")
 {
	
	// determine sub type
	if (obj.nSub!=0)
		sSubType = obj.C[1].Type
		
	if (sSubType=="tab")
		iTabs = obj.nSub
	else if (sSubType=="stp")
		iSteps = obj.nSub

	//determine filename
//	if (bExport)
//		sPageName = obj.Name.replace(/\s/g,"")+"_"+obj.Id+".htm"

	L.Page[iCounter] = new Page(obj.Name,obj.Id,obj.keywords,iTabs,iSteps,obj.filename)
	
	for (var i=0;i<iTabs;i++)
	{
		var iTabSteps = obj.C[i+1].nSub;
		L.Page[iCounter].Tab[i] = new Tab(obj.C[i+1].Name,obj.C[i+1].Id,obj.C[i+1].keywords,iTabSteps);
			
		for (var j=0;j<iTabSteps;j++)
			L.Page[iCounter].Tab[i].Step[j] = new Step(obj.C[i+1].C[j+1].Name,obj.C[i+1].C[j+1].Id,obj.C[i+1].C[j+1].keywords);
	}

	for (var j=0;j<iSteps;j++)
	{
		L.Page[iCounter].Step[j] = new Step(obj.C[j+1].Name,obj.C[j+1].Id,obj.C[j+1].keywords);
	}
	iCounter++;
 }

 for (var j=1; j<=obj.nSub; j++)
 {
//	alert("name: "+obj.Name+"  tot: "+obj.nSub+"  count:"+j);
	createPageTree(obj.C[j]);
 }
 
 L.nPages = L.Page.length;
 iPageCount = L.Page.length-1
// alert(L.nPages);
 return 1;
}