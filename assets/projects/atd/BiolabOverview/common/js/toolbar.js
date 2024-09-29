//window.onerror = null;
//--------------------------------------------------------------------------------------------------------------
// Global Variables
//--------------------------------------------------------------------------------------------------------------
var strImagesPath = "../common/graphics/";
var chrIdentifier = "_";
var iFirstTabStep = 0;
var iLastTabStep = 0;
var iCurrentTabStep = 0;
var iCurrentTab = 1;
var iCurrentStep = 1;

var blnVersion = true;
var bFavLoad = true;

var sKeywords = "";  //Used to store keywords for highlighting in pages
//---------------------------------------------------------------------------------------------------------------
// Check Browser 
//---------------------------------------------------------------------------------------------------------------
browserName = navigator.appName;
browserVer = parseInt(navigator.appVersion);
if (browserName == "Netscape" && browserVer >= 3) 
	blnVersion = true; 
else 
	blnVersion = false;     


//===================================================================================
//============================  Preload Toolbar Images ==============================
//===================================================================================

//Blank Button
blank_img = new Image();		blank_img.src = strImagesPath + "blank_button.gif";

// Tool images
//lm_on_img = new Image();		lm_on_img.src = strImagesPath + "lesson_map_on.gif";
//lm_off_img = new Image();		lm_off_img.src = strImagesPath + "lesson_map_off.gif";
glossary_on_img = new Image();	glossary_on_img.src = strImagesPath + "glossary_on.gif";
glossary_off_img = new Image();	glossary_off_img.src = strImagesPath + "glossary_off.gif";
bookmarks_on_img = new Image();	bookmarks_on_img.src = strImagesPath + "bookmarks_on.gif";
bookmarks_off_img = new Image();bookmarks_off_img.src = strImagesPath + "bookmarks_off.gif";
search_on_img = new Image();	search_on_img.src = strImagesPath + "search_on.gif";
search_off_img = new Image();	search_off_img.src = strImagesPath + "search_off.gif";
//print_on_img = new Image();		print_on_img.src = strImagesPath + "print_on.gif";
//print_off_img = new Image();	print_off_img.src = strImagesPath + "print_off.gif";
//notes_on_img = new Image();		notes_on_img.src = strImagesPath + "notes_on.gif";
//notes_off_img = new Image();	notes_off_img.src = strImagesPath + "notes_off.gif";
// **** MG new word buttons
word_on_img = new Image();		word_on_img.src = strImagesPath + "word_on.gif";
word_off_img = new Image();		word_off_img.src = strImagesPath + "word_off.gif";
audio_on_img = new Image();		audio_on_img.src = strImagesPath + "audio_on.gif";
audio_off_img = new Image();	audio_off_img.src = strImagesPath + "audio_off.gif";
audio_dis_img = new Image();	audio_dis_img.src = strImagesPath + "audio_dis.gif";
//exit_on_img = new Image();		exit_on_img.src = strImagesPath + "exit_on.gif";
//exit_off_img = new Image();		exit_off_img.src = strImagesPath + "exit_off.gif";
paperclip_on_img = new Image();	paperclip_on_img.src = strImagesPath + "paperclip_on.gif";
paperclip_off_img = new Image();paperclip_off_img.src = blank_img.src;

// Step/Audio Control images
rewind_on_img = new Image();	rewind_on_img.src = strImagesPath + "rewind_on.gif"
rewind_off_img = new Image();	rewind_off_img.src = strImagesPath + "rewind_off.gif"
play_on_img = new Image();		play_on_img.src = strImagesPath + "play_on.gif"
play_off_img = new Image();		play_off_img.src = strImagesPath + "play_off.gif"
pause_on_img = new Image();		pause_on_img.src = strImagesPath + "pause_on.gif"
pause_off_img = new Image();	pause_off_img.src = strImagesPath + "pause_off.gif"
skip_on_img = new Image();		skip_on_img.src = strImagesPath + "skip_on.gif"
skip_off_img = new Image();		skip_off_img.src = strImagesPath + "skip_off.gif"

// Navigation Images
prev_hist_on_img = new Image(); prev_hist_on_img.src = strImagesPath + "prev_hist_on.gif";
prev_hist_off_img = new Image();prev_hist_off_img.src = strImagesPath + "prev_hist_off.gif";
next_hist_on_img = new Image();	next_hist_on_img.src = strImagesPath + "next_hist_on.gif";
next_hist_off_img = new Image();next_hist_off_img.src = strImagesPath + "next_hist_off.gif";
prev_on_img = new Image(); 		prev_on_img.src = strImagesPath + "prev_on.gif";
prev_off_img = new Image(); 	prev_off_img.src = strImagesPath + "prev_off.gif";
next_on_img = new Image();		next_on_img.src = strImagesPath + "next_on.gif";
next_off_img = new Image();		next_off_img.src = strImagesPath + "next_off.gif";

//tab images
leftTab_norm_img = new Image();	leftTab_norm_img.src = strImagesPath + "tabLeft_norm.gif";
leftTab_sel_img = new Image();	leftTab_sel_img.src = strImagesPath + "tabLeft_sel.gif";
rightTab_norm_img = new Image();rightTab_norm_img.src = strImagesPath + "tabRight_norm.gif";
rightTab_sel_img = new Image();	rightTab_sel_img.src = strImagesPath + "tabRight_sel.gif";


//===================================================================================
//============================  Button Object Methods ===============================
//===================================================================================

// --------------------------------------------------- MG WORD START -----------------------
sDir = location.href;
sDir = sDir.replace("file:///","");
sDir = sDir.replace("control/toolbar.htm","");
sDir = sDir.replace("%20"," ");

//WORD NOTETAKING FUNCTIONS
function wordEditor() {
    iThisPage = parent.HIDDEN.iCurrentPage + 1;
    sFileName = "lessonNotes.doc";
    sParam = sDir + "data/" + sFileName;
	parent.HIDDEN.L.Page[iThisPage-1].notes = 1;
	parent.HIDDEN.checkNotes(iThisPage-1);
    document.applets[0].noteTakingTool.openWord(sParam);
}

//LOGGING FUNCTIONS
function logAccess(sTool) {
	iThisPage = parent.HIDDEN.iCurrentPage + 1;
    sPageName = "Page" + iThisPage + ".doc";
    sFile = sDir + "data/LessonLog.txt";
    sLesson	= "Test Lesson";
    sUser	= "Astro Nauti";    
    sDate	= getFullTime();
    sSegment= "Test Segment";
    sUnit	= "Test Unit";
    sPage   = iThisPage;

	//alert(parent.LFUNC.defaultId);

	eval("sPage = parent.HIDDEN.L.Page["+ (iThisPage-1) + "].name");
    sPage = sPage + " (" + iThisPage + ")"
    sLabel = "Page" + iThisPage;
    sParam = "[Lesson:" + sLesson + "][User:" + sUser + "][Date:" + sDate + "][Segment:" + sSegment + "][Unit:" + sUnit + "][Page:" + sPage + "][Label:" + sLabel + "]";
    document.applets[0].lessonLogger.addMessageToLogFile(sFile,sParam); 

	return true;
//	alert("tool: "+sTool);
	// set browser
//	if (top.LFUNC.bLoaded)
//		top.LFUNC.detPage(sTool)
}

function getFullTime(){
	Stamp = new Date();
	sDate = (Stamp.getMonth() + 1) + "/" + Stamp.getDate() + "/" + Stamp.getYear();
	
	var Hours;
	var Mins;
	var Time;
	Hours = Stamp.getHours();
	if (Hours >= 12) {
	Time = " P.M.";
	}
	else {
	Time = " A.M.";
	}

	if (Hours > 12) {
	Hours -= 12;
	}

	if (Hours == 0) {
	Hours = 12;
	}
	Mins = Stamp.getMinutes();

	if (Mins < 10) {
	Mins = "0" + Mins;
	}

	sTime = Hours + ":" + Mins + Time;
	return sDate + " " + sTime;
	
}
// --------------------------------------------------- MG WORD END -----------------------
// --------------------------------------------------- MG GLOSSARY START -----------------
function checkGlossary()
{
	if (parent.LESSON.sSelection)
	{
		parent.HIDDEN.strGlossaryTerm = parent.LESSON.sSelection;
		loadTools("GLOSSARY1");
	}
	else
	{	
		loadTools("GLOSSARY0");
	}
}
// --------------------------------------------------- MG GLOSSARY END -----------------------
//*********************
//Name:	checkState
//Purpose:	checks state of button, if enabled it starts that buttons function
//Params:	oButton - button object of which to check state
//Return:	None
//Created:	28/06/1999 (RM)
//Modified:	28/06/1999 (RM)
//*********************
function checkState(oButton)
{
  if (oButton.state == 1)
	eval(oButton.click)
}

//*********************
//Name:	setButtonState
//Purpose:	Sets sate of buttons (disables images)
//Params:	oButton - button object of which to change state
//			iState - 0=disabled/1=enabled/2=n/a
//Return:	None
//Created:	28/06/1999 (RM)
//Modified:	28/06/1999 (RM)
//*********************
function setButtonState(oButton, iState)
{
  oButton.state = iState;

  //determine button name
  var sName = oButton.name.substring(0,oButton.name.indexOf("_"));
  var sState = "on";
  
  if (iState==0)		//disable
	sState = "off"
  else if (iState==1)	//enable
	sState = "on"
  else if (iState==2)	// not available
	sState = "dis"

  if (sName!="lm")
	eval("document."+sName+"_on_img.src = "+sName+"_"+sState+"_img.src;")
}

//*********************
//Name:	Buttons
//Purpose:	Creates an object with values for various properties of the IMG tag
//Params:	click - string executed in onClick attribute for this button
//		mouseover - string executed in onMouseOver attribute for this button
//		name - name of the IMG tag for this button
//		alt - string for ALT attribute of this button
//		src - string for SRC attribute of this button
//Return:	None
//Created:	20/11/1998 (RM)
//Modified:	20/11/1998 (RM)
//*********************
function Buttons(click, mouseover, name, alt, src)
{
	this.click = click;
	this.mouseover = mouseover;
	this.name = name;
	this.alt = alt;
	this.src = src;
	this.state = 1; //0=disabled, 1=enabled
	this.setButtonState = setButtonState;  //sets state of buttons
	this.load = checkState;
}

//===================================================================================
//============================  Create Buttons ======================================
//===================================================================================

//toolbar buttons
//lm_btn = 		new Buttons("loadLessonMap();","window.status='Click to go to Lesson Map'; return true","lm_on_img","Lesson Map",lm_on_img.src);
// **** MG new glossary function
glossary_btn = 	new Buttons("window.status='Glossary Window';parent.HIDDEN.strGlossaryTerm = 'TOP';checkGlossary();","window.status='Go to Glossary'; return true","glossary_on_img","Glossary",glossary_on_img.src);
bookmarks_btn = new Buttons("parent.HIDDEN.intBookmarks=1;window.status='Bookmarks Window';loadTools('BOOKMARKS');","window.status='View Bookmarks'; return true","bookmarks_on_img","Bookmarks",bookmarks_on_img.src);
search_btn = 	new Buttons("parent.HIDDEN.intSearch=1;window.status='Search Window';loadTools('SEARCH');","window.status='Perform a Keyword Search'; return true","search_on_img","Search",search_on_img.src);
//print_btn = 	new Buttons("printPage();","window.status='Print Pages'; return true","print_on_img","Print",print_on_img.src);
//notes_btn = 	new Buttons("parent.HIDDEN.intNotes=1;window.status='Notes Window';loadTools('NOTES');","window.status='View Notes'; return true","notes_on_img","Notes",notes_on_img.src);
// **** MG new word button
word_btn = 	new Buttons("parent.HIDDEN.intNotes=1;window.status='Word Editor';wordEditor();","window.status='Word Editor'; return true","word_on_img","Word",word_on_img.src);

audio_btn = 	new Buttons("soundOnOff();","window.status='Toggle Sound On/Off'; cursorType(this,'audio'); return true","audio_on_img","Sound",audio_on_img.src);
//exit_btn = 		new Buttons("ExitLesson()","window.status='Exit Lesson'; return true","exit_on_img","Exit",exit_on_img.src);
paperclip_btn = new Buttons("parent.HIDDEN.intNotes=1;window.status='Notes Window';wordEditor();","window.status='View Notes'; cursorType(this,'paperclip'); return true","paperclip_on_img","Notes",paperclip_off_img.src);

//audio controls
rewind_btn =	new Buttons("loadRewind();","window.status='Restart Steps'; cursorType(this,'rewind'); return true;","rewind_on_img","Restart Steps",rewind_on_img.src);
play_btn =		new Buttons("loadPlay();","window.status='Continue Step'; cursorType(this,'play'); return true;","play_on_img","Continue Step",play_on_img.src);
pause_btn =		new Buttons("loadPause();","window.status='Pause Step'; cursorType(this,'pause'); return true;","pause_on_img","Pause Step",pause_on_img.src);
skip_btn =		new Buttons("loadSkip();","window.status='Skip to last Step'; cursorType(this,'skip'); return true;","skip_on_img","Skip to last Step",skip_on_img.src);

//nav buttons
prev_hist_btn =	new Buttons("btnHistClick(-1)","window.status='Click to go to previous page in history'; return true;","prev_hist_on_img","Previous Page in History",prev_hist_on_img.src);
next_hist_btn =	new Buttons("btnHistClick(1)","window.status='Click to go to next page in history'; return true;","next_hist_on_img","Next Page in History",next_hist_on_img.src);
prev_btn = 		new Buttons("btnPreviousClick()","window.status='Click to go to previous page'; cursorType(this,'prev'); return true;","prev_on_img","Previous Lesson Page",prev_off_img.src);
next_btn = 		new Buttons("btnNextClick()","window.status='Click to go to next page'; cursorType(this,'next'); return true;","next_on_img","Next Lesson Page",next_on_img.src);


//===================================================================================
//============================  Toolbar Functions ===================================
//===================================================================================

//*********************
//Name:	loadLessonMap()
//Purpose:	loads lesson map, checks for page number of page named "lessonmap.htm"
//Params:	None
//Return:	None
//Created:	28/06/1999 (RM)
//Modified:	28/06/1999 (RM)
//*********************
function loadLessonMap()
{
	var bFound=false;
	var sExt = "htm";
	
	// change extension to 'asp' if preview
	if (!bExport)
		sExt = "asp"
		
	sName = "lessonmap."+sExt;
	
	parent.HIDDEN.iPreviousPage=parent.HIDDEN.iCurrentPage;

	//determine lessonmap page number
	for (i=0;i<parent.HIDDEN.iPageCount;i++)
	{
		if(parent.HIDDEN.L.Page[i].pagename==sName)
		{
			bFound = true;
			parent.HIDDEN.iCurrentPage=i;
		}
	}

	//default to page 0
	if (!bFound)
		parent.HIDDEN.iCurrentPage=0;
		
	loadPage("");	
}

//*********************
//Name:	printPage
//Purpose:	Prints current page
//Params:	None
//Return:	None
//Created:	28/05/1999 (RM)
//Modified:	28/05/1999 (RM)
//*********************
function printPage()
{
	window.status='Print Window';
	if (window.print)
		parent.LESSON.print();
	else
		alert("To print the page you must select Print from the File menu")
}

//*********************
//Name:	soundOnOff
//Purpose:	Turns the sound on or off
//Params:	None
//Return:	None
//Created:	11/02/1999 (RM)
//Modified:	11/02/1999 (RM)
//*********************
function soundOnOff()
{
	bAudioState = parent.HIDDEN.bAudio;
	if ((bAudioState)&&(parent.HIDDEN.audioEnabled))
	{
//		if (confirm("Turn Sound Off?"))
//		{
			parent.HIDDEN.bAudio = false;
			parent.TOOLBAR.document.audio_on_img.src = parent.TOOLBAR.audio_off_img.src;

			// disable step navigation
//			parent.TOOLBAR.document.next_step_on_img.src = parent.TOOLBAR.next_step_off_img.src;
//			parent.TOOLBAR.document.prev_step_on_img.src = parent.TOOLBAR.prev_step_off_img.src;
			
			stopSound(iCurrentTabStep);

			if (parent.HIDDEN.iCurrentPage>=0)
			{
				iCurrentTabStep = iLastTabStep;
				loadNextStep(false);
			}
				
//		}
	}
	else if (parent.HIDDEN.audioEnabled)
	{
				parent.HIDDEN.bAudio = true;
				parent.TOOLBAR.document.audio_on_img.src = parent.TOOLBAR.audio_on_img.src;

				if (parent.HIDDEN.iCurrentPage>=0)
				{
					iCurrentTabStep = iFirstTabStep;
					loadNextStep(true);
				}
	}
	else
	{
		parent.TOOLBAR.document.audio_on_img.src = parent.TOOLBAR.audio_dis_img.src;
		iCurrentTabStep = iLastTabStep;
		loadNextStep(false);
	}

	return true;
}

//*********************
//Name:	ExitLesson
//Purpose:	Closes all windows
//Params:	None
//Return:	None
//Created:	24/11/1998 (RM)
//Modified:	15/01/1999 (RM)
//*********************
function ExitLesson()
{
	if (confirm("Exit Lesson?"))
	{
		// Check if windows exist and if so whether they are closed or not.

		if (window.GLOSSARY){if (!window.GLOSSARY.closed) window.GLOSSARY.close();}
		if (window.BOOKMARKS){if (!window.BOOKMARKS.closed) window.BOOKMARKS.close();}
		if (window.SEARCH){if (!window.SEARCH.closed) window.SEARCH.close();}
		if (window.PRINT){if (!window.PRINT.closed) window.PRINT.close();}
		if (window.NOTES){if (!window.NOTES.closed) window.NOTES.close();}

		parent.close();
	}
}

//*********************
//Name:	btnHistClick
//Purpose:	handles history buttons
//Params:	iDir - indicates direction -1=prev, 1=next
//Return:	None
//Created:	02/12/1998 (RM)
//Modified:	02/12/1998 (RM)
//*********************
function btnHistClick(iDir)
{
	var sFilename="";
	var IE = document.all;

	if ((bExport)&&(document.all))
	{
		parent.LESSON.history.go(iDir);
	}
	else
		alert("Sorry, this function is not available.")

	return;
}

//*********************
//Name:	btnPreviousClick
//Purpose:	handles previous page button
//Params:	None
//Return:	None
//Created:	02/12/1998 (RM)
//Modified:	02/12/1998 (RM)
//*********************
function btnPreviousClick()
{
	var sFilename="";
	var IE = document.all;

	if (parent.HIDDEN.iCurrentPage<1){
//		alert("You are in the first page.");
	}
	else{
		parent.HIDDEN.iPreviousPage = parent.HIDDEN.iCurrentPage;
		parent.HIDDEN.iCurrentPage = parent.HIDDEN.iCurrentPage - 1;
		loadPage("");
	}
	return true;
}

//*********************
//Name:	btnNextClick
//Purpose:	handles next page button
//Params:	None
//Return:	None
//Created:	02/12/1998 (RM)
//Modified:	04/01/1999 (RM)
//*********************
function btnNextClick()
{
	var sFilename="";
	var IE = document.all;

	if (parent.HIDDEN.iCurrentPage==parent.HIDDEN.iPageCount){
//		alert("You are in the last page.");
	}
	else{
		parent.HIDDEN.iPreviousPage = parent.HIDDEN.iCurrentPage;
	    parent.HIDDEN.iCurrentPage = parent.HIDDEN.iCurrentPage + 1;
		loadPage("");
	}
	return true;
}

//*********************
//Name:	LoadTools
//Purpose:	Loads the various toolbar tools
//Params:	sTool - name of tool to be loaded
//			GLOSSARY0 = same folder as gloss_frameset.htm
//			GLOSSARY1 = different folder
//Return:	None
//Created:	15/01/1999 (RM)
//Modified:	15/01/1999 (RM)
//*********************
function loadTools(sTool)
{
  var sPage = "";
  var sHeight = "";
  var sWidth = "";
  var sScroll = "yes";
  var sResize = "yes";

  //Set Variable values for loading window
  if (sTool == "NOTES")
  {
	if (document.paperclip_on_img.src.indexOf("blank_button")!=-1)
	{
		sPage = "NONE";
	}
	else
	{
		sPage = "../common/html/notes.htm";
		sHeight = "280";
		sWidth = "500";
		sScroll = "no";
	}
  }
  else if (sTool == "PRINT")
  {
	sPage = "../common/html/print_frameset.htm"
	sHeight = "220";
	sWidth = "370";
  }
  else if (sTool == "SEARCH")
  {
	if (bExport) sPage = "../common/html/src_frameset_ex.htm"
	else sPage = "../common/html/src_frameset.htm"
	sHeight = "350";
	sWidth = "440";
  }
  else if (sTool == "BOOKMARKS")
  {
	sPage = "../common/html/bmk_frameset.htm"
	sHeight = "300";
	sWidth = "400";
  }
  else if (sTool == "GLOSSARY0")
  {
	sTool = "GLOSSARY";
	if (bExport) sPage = "../common/html/gloss_frameset_ex.htm"
	else sPage = "../common/html/gloss_frameset.htm";
	sHeight = "400";
	sWidth = "700";
	sResize = "yes";
  }
  else if (sTool == "GLOSSARY1")
  {
	sTool = "GLOSSARY";
	if (bExport) sPage = "../common/html/gloss_frameset_ex.htm"
	else sPage = "../common/html/gloss_frameset.htm"
	sHeight = "400";
	sWidth = "700";
	sResize = "yes";
  }

  if (sPage!="NONE")
  {
	// Create commands
	sOpenCommand = sTool + "=window.open('"+sPage+"','"+sTool+"','menubar=no,location=no,scrollbar="+sScroll+",statusbar=no,resizable="+sResize+",height="+sHeight+",width="+sWidth+",left=20,top=20');";
	sFocusCommand = "window."+sTool+".focus();";
	sCloseCommand = "window."+sTool+".close();";

	var sWindow = "window."+sTool;
	// Check if window exists
	if (eval(sWindow))
	{
		// If window exists open and then focus on it in NS
		if (document.layers)
		{
			eval(sOpenCommand);
			eval(sFocusCommand);
		}
		else
		// IE doesn't handle focus as desired, so have to close the window
		// first and then open again.  Need timeout to prevent IE from
		// closing the newly opened window.
		{
			eval(sCloseCommand);
			setTimeout("eval(sOpenCommand)",200);
		}
	}
	else
	{
		eval(sOpenCommand);
	}
  }
}

//===================================================================================
//============================  Button State Functions ==============================
//===================================================================================

function cursorType(obj, btn)
{
	sName = eval("document.all."+btn+"_on_img.src;");
	sName = sName.substring(sName.lastIndexOf("/")+1,sName.length)
//	alert("name:" + sName);
	if ((document.all)&&((sName.indexOf("off")!=-1)||(sName.indexOf("blank_button")!=-1))&&(sName.indexOf("audio")==-1))
	{
		obj.style.cursor = "nw-resize";		
	}
	else
		obj.style.cursor = "hand";
}

//*********************
//Name:	setButtons
//Purpose:	Sets buttons to correct state
//Params:	iPageNr - page number of page to be loaded
//Return:	None
//Created:	02/12/1998 (RM)
//Modified:	02/12/1998 (RM)
//*********************
function setButtons(iPageNr)
{

  //---- Ensure the paperclip gif is in the correct state as sometimes
  //---- it doesn't automatically update. This is only needed in Netscape

  if (document.layers) parent.HIDDEN.checkNotes(parent.HIDDEN.iCurrentPage)

  // --------- Handle Previous Button -------------------

  if(iPageNr<=0)
  {
	document.prev_on_img.src = prev_off_img.src;
  }
  else
  {
	document.prev_on_img.src = prev_on_img.src;
  }

  // --------- Handle Next Button -------------------

  if(iPageNr>=parent.HIDDEN.iPageCount)
  {
	document.next_on_img.src = next_off_img.src;
  }
  else
  {
	document.next_on_img.src = next_on_img.src;
  }
}


//*********************
//Name:	setStepButtons
//Purpose:	Sets step buttons to correct state
//Params:	None
//Return:	None
//Created:	14/01/1999 (RM)
//Modified:	14/01/1999 (RM)
//*********************
function setStepButtons()
{
	//Set counter in toolbar
	document.step.current.value = iCurrentTabStep-iFirstTabStep+1;

	//---------------- Handle Next Step ----------------------------

	if (iCurrentTabStep >= iLastTabStep)
	{
		document.next_step_on_img.src = next_step_off_img.src;
	}
	else
	{
		document.next_step_on_img.src = next_step_on_img.src;
	}

	//---------------- Handle Previous Step ------------------------

	if ((iCurrentTabStep <= iFirstTabStep)) //||(iCurrentTabStep == iLastTabStep))
	{
		document.prev_step_on_img.src = prev_step_off_img.src;
	}
	else
	{
		document.prev_step_on_img.src = prev_step_on_img.src;
	}
}

//*********************
//Name:	setTabButtons
//Purpose:	Sets tabs to correct state
//Params:	iNr - tab number to be highlighted
//Return:	None
//Created:	08/04/1999 (RM)
//Modified:	08/04/1999 (RM)
//*********************
function setTabButtons(iNr)
{
	if (document.layers)
	{
		if (eval("parent.LESSON.document.leftTab"+(iCurrentTab-1)))
		{
			eval("parent.LESSON.document.leftTab"+(iCurrentTab-1)+".src=leftTab_norm_img.src;");
			eval("parent.LESSON.document.rightTab"+(iCurrentTab-1)+".src=rightTab_norm_img.src;");
			eval("parent.LESSON.document.leftTab"+(iNr-1)+".src=leftTab_sel_img.src;");
			eval("parent.LESSON.document.rightTab"+(iNr-1)+".src=rightTab_sel_img.src;");
		}
	}
	else if (document.all)
	{
		if (eval("parent.LESSON.document.all.leftTab"+(iCurrentTab-1)))
		{
			// set tab ends to correct colour
			eval("parent.LESSON.document.all.leftTab"+(iCurrentTab-1)+".src=leftTab_norm_img.src;");
			eval("parent.LESSON.document.all.rightTab"+(iCurrentTab-1)+".src=rightTab_norm_img.src;");
			eval("parent.LESSON.document.all.leftTab"+(iNr-1)+".src=leftTab_sel_img.src;");
			eval("parent.LESSON.document.all.rightTab"+(iNr-1)+".src=rightTab_sel_img.src;");

			// set cell background colours to right colour
			eval("parent.LESSON.document.all['tabcell"+(iCurrentTab-1)+"'].style.backgroundColor='#808080';");
			eval("parent.LESSON.document.all['tabcell"+(iNr-1)+"'].style.backgroundColor='#02329A';");
		}
	}
	iCurrentTab = iNr;
}

//*********************
//Name:	setSoundButtons
//Purpose:	Sets sound buttons to correct state
//Params:	None
//Return:	None
//Created:	23/07/1999 (RM)
//Modified:	23/07/1999 (RM)
//*********************
function setSoundButtons(sLast)
{
	var sLastStep = sLast;
	var oRewind = blank_img;
	var oPlay = blank_img;
	var oPause = blank_img;
	var oSkip = blank_img;

//	if (parent.LESSON.bLoaded)
//	{
	if (parent.LESSON.aAudio[iCurrentTabStep]==0)
	{
		if ((iCurrentTabStep==iFirstTabStep)&&(iCurrentTabStep==iLastTabStep))
		{
			oRewind = blank_img;
			oPlay = blank_img;
			oPause = blank_img;
			oSkip = blank_img;
		}
		else if (iCurrentTabStep==iLastTabStep)
		{
			oRewind = rewind_on_img;
			oPlay = play_off_img;
			oPause = pause_off_img;
			oSkip = skip_off_img;
		}
	}
	else
	{
		if ((iCurrentTabStep==iFirstTabStep)&&(iCurrentTabStep==iLastTabStep))
		{
			oRewind = rewind_on_img;
			oPlay = play_off_img;
			oPause = pause_on_img;
			oSkip = skip_off_img;
		}
		else if (iCurrentTabStep==iFirstTabStep)
		{
			oRewind = rewind_on_img;
			oPlay = play_off_img;
			oPause = pause_on_img;
			oSkip = skip_on_img;
		}
		else if (iCurrentTabStep==iLastTabStep)
		{
			oRewind = rewind_on_img;
			oPlay = play_off_img;
			oPause = pause_on_img;
			oSkip = skip_off_img;
		}
		else
		{
			oRewind = rewind_on_img;
			oPlay = play_off_img;
			oPause = pause_on_img;
			oSkip = skip_on_img;
		}
	}
//	}

	if (sLastStep=="lastStep")
	{
		oRewind = rewind_on_img;
		oPlay = play_off_img;
		oPause = pause_off_img;
		oSkip = skip_off_img;
	}

	if ((parent.HIDDEN.bAudio==false)||(!parent.HIDDEN.audioEnabled))
	{
		oRewind = blank_img;
		oPlay = blank_img;
		oPause = blank_img;
		oSkip = blank_img;
	}
	
	document.rewind_on_img.src = oRewind.src;
	document.play_on_img.src = oPlay.src;
	document.pause_on_img.src = oPause.src;
	document.skip_on_img.src = oSkip.src;
}

//*********************
//Name:	setToolButtons
//Purpose:	Sets Toolbar buttons on/off, depending on state defined in hidden frame
//Params:	None
//Return:	None
//Created:	07/07/1999 (RM)
//Modified:	07/07/1999 (RM)
//*********************
function setToolButtons()
{
//  lm_btn.setButtonState(lm_btn,parent.HIDDEN.iLMapState);
  glossary_btn.setButtonState(glossary_btn,parent.HIDDEN.iGlossaryState);
  bookmarks_btn.setButtonState(bookmarks_btn,parent.HIDDEN.iBookmarkState);
  search_btn.setButtonState(search_btn,parent.HIDDEN.iSearchState);
//  print_btn.setButtonState(print_btn,parent.HIDDEN.iPrintState);
//  notes_btn.setButtonState(notes_btn,parent.HIDDEN.iNoteState);
  audio_btn.setButtonState(audio_btn,parent.HIDDEN.iAudioState);
//  exit_btn.setButtonState(exit_btn,parent.HIDDEN.iExitState);
}

//===================================================================================
//============================  Page/Step/Tab Loading Functions =====================
//===================================================================================

//*********************
//Name:	loadNextStep
//Purpose:	Shows/Hides the relevant layers for the next step
//Params:	auto - defines whether the function is called in 
//			auto mode(true) or in manual mode(false).
//Return:	None
//Created:	06/01/1999 (RM)
//Modified:	16/02/1999 (RM)
//*********************
function loadNextStep(bAuto)
{
  var sFilename = "";
  var iTabCount = parent.HIDDEN.L.Page[parent.HIDDEN.iCurrentPage].nTabs;

  // determine number of steps in page
  var iObjId = 0;
  var iStepCount = 0;
  var iPage = parent.HIDDEN.iCurrentPage
  var iTabs = parent.HIDDEN.L.Page[iPage].nTabs
  var iSteps = parent.HIDDEN.L.Page[iPage].nSteps

  if (iSteps != 0)
  {
	iStepCount = iSteps;
	iObjId = parent.HIDDEN.L.Page[iPage].Step[iCurrentTabStep].id
  }
  else if (iTabs != 0)
  {
	for (i=0;i<iTabs;i++)
	{
		iTabSteps = 0;
		iTabSteps = parent.HIDDEN.L.Page[iPage].Tab[i].nSteps;
		if (iTabSteps == 0)
		{
			iStepCount = iStepCount + 1;
			iObjId = parent.HIDDEN.L.Page[iPage].Tab[iCurrentTab-1].id;
		}
		else
		{
			iStepCount = iStepCount + iTabSteps;
			iObjId = parent.HIDDEN.L.Page[iPage].Tab[iCurrentTab-1].Step[(iCurrentTabStep-iFirstTabStep)].id;
		}
	}
  }
  else
  {
	iStepCount = 0;
	iObjId = parent.HIDDEN.L.Page[iPage].id;
  }
	
  if (iStepCount==0)
	iStepCount = 1

  //highlight selected keywords on page
  aKeywords = new Array();
  if (sKeywords!="")
	aKeywords = sKeywords.split(" ")
  
  for (var i=0;i<aKeywords.length;i++)
  {
	var j=0;
	sItem = aKeywords[i].toLowerCase();
	sSpanName = eval("parent.LESSON.document.all['"+sItem+"_"+iObjId+"_"+j+"'];");
//	alert("parent.LESSON.document.all['"+sItem+"_"+iObjId+"_"+j+"'];");
	while(sSpanName)
	{
		if (sSpanName)
		{
			sSpanName.style.color ="white";
			sSpanName.style.backgroundColor ="#02329a";
		}
		j++;
		sSpanName = eval("parent.LESSON.document.all['"+sItem+"_"+iObjId+"_"+j+"'];");
	}
  }
		
  //Set Step visibility
  for (i=0;i<iStepCount;i++)
  {
	if (i==iCurrentTabStep)
	{
		if (document.layers)
		{
			if (eval("parent.LESSON.document.layers.text"+i))
				eval("parent.LESSON.document.layers.text"+i+".visibility='visible';");
		}
		else if (document.all)
		{
			if (eval("parent.LESSON.document.all.text"+i))
				eval("parent.LESSON.document.all.text"+i+".style.visibility='visible';");
		}
	}
	else
	{
		if (document.layers)
		{
			if (eval("parent.LESSON.document.layers.text"+i))
				eval("parent.LESSON.document.layers.text"+i+".visibility='hidden';");
		}
		else if (document.all)
		{
			if (eval("parent.LESSON.document.all.text"+i))
				eval("parent.LESSON.document.all.text"+i+".style.visibility='hidden';");
		}
	}
  }

  // check viewer mode, as step buttons are only present in preview mode
  if (bExport)
  {
	setSoundButtons();
  }
  else
  {
	setStepButtons();
  }

  playSound(iCurrentTabStep);
  parent.LESSON.checkSound();
}

//*********************
//Name:	loadStep
//Purpose:	Loads the step to be viewed
//Params:	sDir - which step to load next (previous or next)
//Return:	None
//Created:	08/12/1998 (RM)
//Modified:	17/02/1999 (RM)
//*********************
function loadStep(sDir)
{

  parent.LESSON.bAuto = false;
  stopSound(iCurrentTabStep);
	
  if ((sDir == "prev") && (iCurrentTabStep > iFirstTabStep))
  {
	iCurrentTabStep = iCurrentTabStep - 1;
	loadNextStep(false);
  }
  else if ((sDir == "next") && (iCurrentTabStep < iLastTabStep))
  {
	iCurrentTabStep = iCurrentTabStep + 1;
	loadNextStep(false);
  }
  else if (sDir == "auto")
  {
	//determine current tab and thus iCurrentTabStep
	var iStepNr = 0;
	var bGotStep = false;
	for (var i=0;i<parent.LESSON.aElements.length;i++)
	{
		if ((parent.LESSON.aElements[i]==iCurrentTab-1)&&(!bGotStep))
		{
			bGotStep = true;
			iStepNr = i;
		}
	}

	iCurrentTabStep = iStepNr;
	parent.LESSON.bAuto = true;
	loadNextStep(true);
  }
  else alert("There are no more steps")
}

//*********************
//Name:	loadTab
//Purpose:	Loads the tab to be previewed		
//Params:	iNr - which tab to load next (number)
//Return:	None
//Created:	08/04/1999 (RM)
//Modified:	08/04/1999 (RM)
//*********************
function loadTab(iNr)
{
  if (iNr!=iCurrentTab)
  {
	setTabButtons(iNr);
	stopSound(iCurrentTabStep);
	initStep(1);
  }  
}

//*********************
//Name:	initStep
//Purpose:	Initialises the step to be viewed
//Params:	iStep - step number to initialise
//Return:	None
//Created:	08/04/1999 (RM)
//Modified:	08/04/1999 (RM)
//*********************
function initStep(iStep)
{
	var iTabs = parent.HIDDEN.L.Page[parent.HIDDEN.iCurrentPage].nTabs;
	//Determine number of tabs
	if (iTabs > 1)
	{
		//If more than one determine current tab and steps in current page
		var i = 0;
		var bGotFirst = false;
		for (i=0;i<parent.LESSON.aElements.length;i++)
		{
			if (parent.LESSON.aElements[i] == iCurrentTab-1) iLastTabStep = i
			if ((parent.LESSON.aElements[i] == iCurrentTab-1)&&(!bGotFirst))
			{
				bGotFirst = true;
				iFirstTabStep = i;
			}
		}
	}
	else
	{
		iLastTabStep = parent.LESSON.aElements.length-1;
		iFirstTabStep = 0;
	}

	if (parent.HIDDEN.bAudio)
 		iCurrentTabStep = iStep+iFirstTabStep-1
	else
		iCurrentTabStep = iStep+iLastTabStep-1 	
	
	parent.HIDDEN.L.Page[parent.HIDDEN.iCurrentPage].visited=1;

	//set toolbar buttons
	setButtons(parent.HIDDEN.iCurrentPage);

	//highlight correct tab if in tab page
	iTabs = parent.HIDDEN.L.Page[parent.HIDDEN.iCurrentPage].nTabs;

	//-- set status bar information
	self.defaultStatus= detStatusText(parent.HIDDEN.iCurrentPage); //parent.HIDDEN.L.Page[parent.HIDDEN.iCurrentPage].name+" - Page " + (parent.HIDDEN.iCurrentPage+1)  + " of " + (parent.HIDDEN.iPageCount+1);
	
	//-- check if notes are present
	parent.HIDDEN.checkNotes(parent.HIDDEN.iCurrentPage);

	if (iTabs > 1)
	{
		setTabButtons(iCurrentTab);
	}

	// Set step number in toolbar, has to be done in template for IE
	if (document.prev_step_on_img)
	{
		if (iLastTabStep-iFirstTabStep==0)
			document.step.total.value = 1
		else
			document.step.total.value = iLastTabStep-iFirstTabStep+1
	
		document.step.current.value = iCurrentTabStep-iFirstTabStep+1;
	}
	loadNextStep();
}

//*********************
//Name:	loadPageResults
//Purpose:	loads page from tools such as bookmarks or keyword search.
//		Sets conditions so that the correct path is chosen.
//Params:	sPageNum = page number
//		sTabNum = tab number
//		sStep = step number
//Return:	None
//Created:	06/01/1999 (RM)
//Modified:	08/07/1999 (RM)
//*********************
function loadPageResults(sPageNum,sTabNum,sStep)
{
  var iTab = sTabNum;
  if (iTab==0) iTab=1

  loadPage("!!tool!!;!!tab:"+iTab+":!!");
}

//*********************
//Name:	loadPage
//Purpose:	initialises variables, before loading page
//Params:	sExtra - extra info to be added to querystring,
//					if includes "!!tool!!", then indicates that a tool (eg a bookmark) is loading the page, thus need slightly different path
//					if includes "!!tab:x:!!", then number between the two ':' is the tab number
//Return:	None
//Created:	06/01/1999 (RM)
//Modified:	06/01/1999 (RM)
//*********************
function loadPage(sExtra)
{
  var sPath = "../content/";

  if(!bExport)
	sPath = ""

  // check if tab number is defined
  iPos1 = sExtra.indexOf("!!tab:");
  if (iPos1!=-1)
  {
	var iPos2 = sExtra.indexOf(":!!",iPos1);
	var iTab = parseInt(sExtra.substring(iPos1+6,iPos2));
	
	if (!isNaN(iTab))
		iCurrentTab = iTab
	else
		iCurrentTab = 1
  }
  else
	iCurrentTab = 1

 
  iPos4 = sExtra.indexOf("!!step:");
  if (iPos4!=-1)
  {
	var iPos5 = sExtra.indexOf(":!!",iPos4);
	var iStep = parseInt(sExtra.substring(iPos4+7,iPos5));

	if (!isNaN(iStep))
		iCurrentStep = iStep
	else
		iCurrentStep = 1
  }
  else
	iCurrentStep = 1


  // check from where to load page
  sTool = "";
  iPos3 = sExtra.indexOf("!!tool!!");
  if (iPos3!=-1)
  {
	sTool = "tool"
	if (bExport)
		sPath = "../"+sPath
	else
		sPath = "../../preview_tool/"
  }
  else
	sKeywords = ""; //remove keywords if not a tool

  if ((iPos1!=-1)||(iPos3!=-1)||(iPos4!=-1))
	sExtra = ""

  var sPagename = parent.HIDDEN.L.Page[parent.HIDDEN.iCurrentPage].pagename;

  if (bExport)
  {
	if (parent.HIDDEN.L.Page[parent.HIDDEN.iCurrentPage].nTabs==-1)
		sPath = sPath+"external/"
//	else
//		sPath = "../content/"
  }
  else
  {
	var sStartChar = "&";
	var iPosDot = sPagename.indexOf(".");
	if (iPosDot==-1)
		alert("Incorrect filename: "+sPagename)
	else
	{
		iPosQuery = sPagename.indexOf("?",iPosDot);
		if (iPosQuery==-1)
			sStartChar = "?"
	}

	sPagename = sPagename+sStartChar+"Tab="+iCurrentTab+"&Step="+iCurrentStep;

	if (sPagename=="lessonmap.asp")
		document.reload_on_img.src = reload_off_img.src
	else
		document.reload_on_img.src = reload_on_img.src

	if (parent.HIDDEN.L.Page[parent.HIDDEN.iCurrentPage].nTabs==-1)
		sPath = "/ftp/story/"+parent.HIDDEN.L.id+"/attachments/"
  }

  var sFilename = sPath+sPagename+sExtra;
  var sHref = parent.LESSON.location.href;
//  alert("href: "+parent.LESSON.location.href)
//  if (sHref.indexOf("blank")==-1)
	  window.open(sFilename,"LESSON")
//  else
//  {
//	 alert("blank");
//	  window.open(sFilename,"LESSON",true);
//  }

  // **** MG log page access
  logAccess(sTool); 	  
}

//*********************
//Name:	load
//Purpose:	loads the lesson page and sets toolbar buttons
//Params:	iTab - tab number to start on
//Return:	None
//Created:	06/01/1999 (RM)
//Modified:	14/04/1999 (RM)
//*********************
function load(iTab,iStep)
{
	if (!parent.HIDDEN.audioEnabled)
	{
		parent.HIDDEN.bAudio = false;
		parent.HIDDEN.iAudioState = 2;
		parent.TOOLBAR.document.audio_on_img.src = parent.TOOLBAR.audio_dis_img.src;
//		soundOnOff()
	}

	//determine if loaded from favorites
	var sDefLoc = parent.location.href;
	var iPos = sDefLoc.indexOf("#");
	
	if (iPos!=-1)
	{
		var sName = sDefLoc.substring(iPos+6,sDefLoc.length)+".htm";
		
		//determine page number
		for (var i=0;i<parent.HIDDEN.iPageCount;i++)
		{
			if (parent.HIDDEN.L.Page[i].pagename==sName)
			{
				parent.HIDDEN.iCurrentPage = i;
				i=parent.HIDDEN.iPageCount;
			}
		}
	}
	
	setToolButtons();
//	setButtons(parent.HIDDEN.iCurrentPage);
	parent.HIDDEN.L.Page[parent.HIDDEN.iCurrentPage].visited=1;
	parent.HIDDEN.checkNotes(parent.HIDDEN.iCurrentPage);

	if (bExport)
		parent.LFUNC.location.href='lmap.htm'
	else
		parent.LFUNC.location.href='lmap.asp'
	
	loadPage("!!tab:"+iTab+":!!"+";!!step:"+iStep+":!!");
}

//*********************
//Name:	loadExternalPage
//Purpose:	loads the linked html pages
//Params:	sPage - page name
//		sBookmark - bookmark position on page (so far for word templates only)
//Return:	None
//Created:	01/07/1999 (RM)
//Modified:	01/07/1999 (RM)
//*********************
function loadExternalPage(sPage,sBookmark)
{
	re = /\s/g;
	sPage = sPage.replace(re,"%20");

	//determine page number from name
	for (i=0;i<=parent.HIDDEN.iPageCount;i++)
	{
		if (parent.HIDDEN.L.Page[i].pagename==sPage)
			parent.HIDDEN.iCurrentPage = i
	}

	sExtra = "#"+sBookmark;
	loadPage(sExtra);
}


//===================================================================================
//============================  Audio / Step Functions ==============================
//===================================================================================

//*********************
//Name:		playSound
//Purpose:	Plays embeded sound file
//Params:	iStep - current step to be played
//Return:	None
//Created:	16/02/1999 (RM)
//Modified:	16/02/1999 (RM)
//*********************
function playSound(iStep)
{
	if (parent.HIDDEN.bAudio==true)
	{
		if ((parent.HIDDEN.IEsound)&&(parent.LESSON.aAudio[iStep]==1))
		{
			var bSoundEnabled = parent.LESSON.document.embeds['oSound'+iStep].IsSoundCardEnabled()
			
			if (bSoundEnabled)
			{
				//set position to 0, incase audio didn't reach end previously
				parent.LESSON.document.embeds["oSound"+iStep].CurrentPosition=0;
				parent.LESSON.document.embeds["oSound"+iStep].play();
			}
			else
			{
				parent.HIDDEN.bAuido = false;
				parent.HIDDEN.audioEnabled = false;
				soundOnOff();
			}
		}
		else if ((parent.HIDDEN.NSsound)&&(parent.LESSON.aAudio[iStep]==1))
		{
			if (parent.LESSON.document.embeds["oSound"+iCurrentTabStep].ReadyState==4)
			{
				eval("parent.LESSON.document.embeds['oSound"+iStep+"'].play();");
				parent.LESSON.checkSound();
			}
		}
	}
}

//*********************
//Name:		stopSound
//Purpose:	Stops embeded sound file
//Params:	iStep - current step to stop sound
//Return:	None
//Created:	16/02/1999 (RM)
//Modified:	16/02/1999 (RM)
//*********************
function stopSound(iStep)
{
	//Have to ensure there is a file, else an error occurs
	if (parent.LESSON.bLoaded)
	{
	if ((parent.HIDDEN.NSsound)&&(parent.LESSON.aAudio[iStep]==1))
	{
		eval("parent.LESSON.document.embeds['oSound"+iStep+"'].stop();");
	}
	else if ((parent.HIDDEN.IEsound)&&(parent.LESSON.aAudio[iStep]==1))
	{
		
		 eval("parent.LESSON.document.embeds['oSound"+iStep+"'].stop();");
	}
	}
}

//*********************
//Name:	loadPause
//Purpose:	Pauses the current step/audio
//Params:	None
//Return:	None
//Created:	01/07/1999 (RM)
//Modified:	01/07/1999 (RM)
//*********************
function loadPause()
{
	if (parent.HIDDEN.audioEnabled)
	{
		if ((parent.LESSON.aAudio[iCurrentTabStep]==1)&&(document.pause_on_img.src.indexOf("pause_on")!=-1))
		{
			// check position, if at end don't pause as this gives error
			iEnd = parent.LESSON.document.embeds["oSound"+iCurrentTabStep].SelectionEnd;
			if ((document.all)&&(parent.LESSON.document.embeds["oSound"+iCurrentTabStep].CurrentPosition!=iEnd))
			{
				document.pause_on_img.src = pause_off_img.src;
				document.play_on_img.src = play_on_img.src;
				eval("parent.LESSON.document.embeds['oSound"+iCurrentTabStep+"'].pause();");
			}
		}
	}
}

//*********************
//Name:	loadRewind
//Purpose:	Restarts the set of steps or audio
//Params:	None
//Return:	None
//Created:	01/07/1999 (RM)
//Modified:	01/07/1999 (RM)
//*********************
function loadRewind()
{
	if (parent.HIDDEN.audioEnabled)
	{
	  if (document.rewind_on_img.src.indexOf("rewind_on")!=-1)
	  {
		stopSound(iCurrentTabStep);
		parent.LESSON.clearInterval(parent.LESSON.intervalID);
		parent.LESSON.clearInterval(parent.LESSON.singleIntID);
		if (parent.HIDDEN.iCurrentPage>=0)
		{
			iCurrentTabStep = iFirstTabStep;
			loadNextStep(true);
	//		loadNextStep(false);
		}
	  }
	}
}

//*********************
//Name:	loadPlay
//Purpose:	Plays the paused step/audio
//Params:	None
//Return:	None
//Created:	01/07/1999 (RM)
//Modified:	01/07/1999 (RM)
//*********************
function loadPlay()
{
	if (parent.HIDDEN.audioEnabled)
	{
		if (document.play_on_img.src.indexOf("play_on")!=-1)
		{
			//Have to ensure there is a file in IE, else an error occurs
			if ((parent.HIDDEN.NSsound)&&(parent.LESSON.aAudio[iCurrentTabStep]==1))
			{
				eval("parent.LESSON.document.embeds['oSound"+iCurrentTabStep+"'].play();");
				parent.LESSON.checkSound();
			}
			else if ((parent.HIDDEN.IEsound)&&(parent.LESSON.aAudio[iCurrentTabStep]==1))
			{
				if (parent.LESSON.document.embeds["oSound"+iCurrentTabStep].ReadyState==4)
				{
					document.pause_on_img.src = pause_on_img.src;
					document.play_on_img.src = play_off_img.src;
					eval("parent.LESSON.document.embeds['oSound"+iCurrentTabStep+"'].play();");
					parent.LESSON.checkSound();
				}
			}
		}
	}
}

//*********************
//Name:	loadSkip
//Purpose:	Skips the steps and loads the Final Step
//Params:	None
//Return:	None
//Created:	01/07/1999 (RM)
//Modified:	01/07/1999 (RM)
//*********************
function loadSkip()
{
	if (parent.HIDDEN.audioEnabled)
	{
		if (document.skip_on_img.src.indexOf("skip_on")!=-1)
		{
			stopSound(iCurrentTabStep);
			parent.LESSON.bStarted=false;
			if (parent.HIDDEN.iCurrentPage>=0)
			{
				iCurrentTabStep = iLastTabStep;
				loadNextStep(false);
			}
		}
	}
}

//===================================================================================
//============================  Key Event Capture Functions =========================
//===================================================================================

//*********************
//Name:	Key_Up_IE
//Purpose:	Captures keyup events and loads correct page if cursor key was pressed
//		Internet Explorer ONLY
//Params:	e - event to be checked
//Return:	None
//Created:	01/07/1999 (RM)
//Modified:	01/07/1999 (RM)
//*********************
function Key_Up_IE(e)
{
		var keyChar = event.keyCode;
		var sMods = "none"; //event.
		if (event.altKey) sMods = 'alt'; 
		else if (event.shiftKey) sMods = 'shift'; 
		else if (event.ctrlKey) sMods = 'ctrl'; 
		else if (event.ctrlKey && event.altKey ) sMods = 'ctrl-alt';

		detTool(keyChar,sMods);
}

function detTool(keyChar, sMods)
{
		if ((keyChar=="38")&&(sMods=="alt"))
		{
			if (parent.HIDDEN.iCurrentPage>0)
			{
				parent.HIDDEN.iPreviousPage = parent.HIDDEN.iCurrentPage;
				parent.HIDDEN.iCurrentPage = parent.HIDDEN.iCurrentPage - 1;
				parent.TOOLBAR.loadPage("");
			}
			else
				alert("You are in the first page.")
		}
		else if ((keyChar=="40")&&(sMods=="alt"))
		{
			if (parent.HIDDEN.iCurrentPage<parent.HIDDEN.iPageCount)
			{
				parent.HIDDEN.iPreviousPage = parent.HIDDEN.iCurrentPage;
				parent.HIDDEN.iCurrentPage = parent.HIDDEN.iCurrentPage + 1
				parent.TOOLBAR.loadPage("");
			}
			else
				alert("You are in the last page.")
		}
		else if ((keyChar=="68")&&(sMods=="ctrl"))  //BOOKMARKS
		{
			window.external.AddFavorite(parent.LESSON.location.href,parent.LESSON.document.title)
		//	parent.TOOLBAR.loadTools("BOOKMARKS");
		}
		else if ((keyChar=="71")&&(sMods=="ctrl"))  //GLOSSARY
		{
			parent.HIDDEN.strGlossaryTerm = 'TOP';
			checkGlossary();
		}
		else if ((keyChar=="72")&&(sMods=="ctrl"))  //HISTORY
		{
//			parent.TOOLBAR.loadTools("BOOKMARKS");
			alert("History Viewer Not Implemented !");
			
		}
		else if ((keyChar=="75")&&(sMods=="ctrl"))  //SEARCH
		{
			parent.TOOLBAR.loadTools("SEARCH");
		}
		else if ((keyChar=="74")&&(sMods=="ctrl"))  //NOTES
		{
			parent.TOOLBAR.wordEditor();
		}

//	alert("Hold '" + keyChar + "' again for me, okay?"+sMods);
}

//===================================================================================
//============================  Page Validation Functions ===========================
//===================================================================================

function startChecker()
{
//	setTimeout("checkHref()",100);
}

function checkHref()
{
	var bFound = false;
	var sName = "";
	
	if (parent.LESSON.location)
	{
	sName = parent.LESSON.location.href;
		sName = sName.substring(sName.lastIndexOf("/")+1,sName.length);

	//	parent.HIDDEN.document.DEBUG.output.value = "this: "+sName+"  hidden: "+parent.HIDDEN.L.Page[parent.HIDDEN.iCurrentPage].pagename+"  high: "+parent.HIDDEN.defaultId+"  current: "+parent.HIDDEN.L.Page[parent.HIDDEN.iCurrentPage].id;

		for (var i=0;i<parent.HIDDEN.L.Page.length;i++)
		{
			if (sName==parent.HIDDEN.L.Page[i].pagename)
			{
				bFound = true;
				i = parent.HIDDEN.L.Page.length;
			}
		}

		if (!bFound)
			parent.LESSON.location.href = "../content/"+parent.HIDDEN.L.Page[0].pagename
	}
	else
		setTimeout("checkHref()",500)
}

var bSetMap = false;
function checkLessonHref()
{
	var iLessonPage = 0;  //default to lesson map
	var bFound = false;
	var sLessonRef = unescape(parent.LESSON.location.href);
	var iPos1 = sLessonRef.lastIndexOf("/");
	var iPos2 = sLessonRef.indexOf("&");
	var iPos3 = sLessonRef.indexOf("#");

	if (iPos2==-1)
	{
		iPos2 = sLessonRef.length;
		if (iPos3!=-1)
			iPos2 = iPos3
	}

	var sPageName = unescape(sLessonRef.substring((iPos1+1),iPos2));
//	parent.HIDDEN.document.DEBUG.output.value=sPageName;


	if (sPageName.indexOf("lessonmap.asp")!=-1)
		sPageName = "lessonmap.asp"
		
	for (i=0;i<parent.HIDDEN.L.Page.length;i++)
	{
		sCurrentName = parent.HIDDEN.L.Page[i].pagename;
		var iPos = sCurrentName.indexOf("#");

		if (iPos!=-1)
			sCurrentName = sCurrentName.substring(0,iPos)
			
		if (sPageName==sCurrentName)
		{
			iLessonPage = i;
			bFound = true;
		}
	}
	
//	alert(sPageName);
	// check all pages to see if any have been visited
	bVisited = false;
	for (var i=0;i<=parent.HIDDEN.iPageCount;i++)
	{
		if (parent.HIDDEN.L.Page[i].visited==1)
		{
			bVisited = true;
			i=parent.HIDDEN.iPageCount+1;
		}
	}
	
	if (((sPageName.indexOf("blank.htm")==-1)||((sPageName.indexOf("blank.htm")!=-1)&&(bVisited))))
	{
		if (!bFound)	// page name not found, go to start
		{
//			if (sPageName.indexOf("blank.htm")==-1)
//			{
				parent.HIDDEN.iPreviousPage = parent.HIDDEN.iCurrentPage;
				parent.HIDDEN.iCurrentPage = iLessonPage;
//				setButtons(iLessonPage);
				loadPage("");
//			}
		}
		else if (iLessonPage!=parent.HIDDEN.iCurrentPage)	// page name found, check if 
		{													// page number is correct
			parent.HIDDEN.iPreviousPage = parent.HIDDEN.iCurrentPage;
			parent.HIDDEN.iCurrentPage = iLessonPage;
			setButtons(iLessonPage);

			if (!bSetMap)		
			{
				top.LFUNC.detPage();
				bSetMap = true;
			}
		}
		else	// page name found and page number correct
			bSetMap = false
	}
}
//===================================================================================
//===================================================================================

var iSegPage = 0;
var iSegPageCount = 0;
var iSegCounter = 0;
var sSegName = "";
var bPageFound = false;

function detStatusText(iPage)
{
	iSegPage = 0;
	iSegPageCount = 0;
//	iSegCounter = 0;
	sSegName = "";
	bPageFound = false;

	var iId = parent.HIDDEN.L.Page[iPage].id;

	// determine segment name, pages in segment and this page number relative to segment

	for (var i=1;i<=parent.HIDDEN.T.C[1].C.length-1;i++)
	{
		iSegCounter=0;
		checkItem(parent.HIDDEN.T.C[1].C[i],iId);	
		if (bPageFound)
		{
			iSegPageCount = iSegCounter;
			sSegName = parent.HIDDEN.T.C[1].C[i].Name;
			bPageFound = false;
		}
	}
	return sSegName+" - page "+iSegPage+" of "+iSegPageCount
}

function checkItem(obj,id)
{
  if (obj.Type == "pag")
	iSegCounter++

//  alert(obj.Id+"  "+id);
  if (obj.Id == id)
  {
  	iSegPage = iSegCounter;
  	bPageFound = true;
  }
	
  for (var i=1; i<=obj.nSub; i++)
  {
	checkItem(obj.C[i],id);
  }
  return 1;
}

function openGlossary(sWord)
{
	window.open("src_frameset_ex.htm#"+sWord,"_blank","height=400,width=400,top=20,left=20");
}
