var bLoaded = false;
var sNewVal = "";

//window.onerror = null;
//*********************
//Name:	checkSound()
//Purpose:	Continously starts a function to deterimine the state of the embedded sound
//Params:	None
//Return:	None
//Created:	21/12/1998 (RM)
//Modified:	21/12/1998 (RM)
//*********************
function checkSound()
{
  var iStepCount = 0;
  var iPage = parent.HIDDEN.iCurrentPage
  var iCurTab = parent.TOOLBAR.iCurrentTab-1;
  var iTabs = parent.HIDDEN.L.Page[iPage].nTabs
  var iSteps = parent.HIDDEN.L.Page[iPage].nSteps

  // determine number of steps in page
  if (iSteps != 0)
  {
	iStepCount = iSteps;
  }
  else if (iTabs != 0)
  {
	for (i=0;i<iTabs;i++)
	{
		iStepCount = parent.HIDDEN.L.Page[iPage].Tab[iCurTab].nSteps; //iStepCount + parent.HIDDEN.L.Page[iPage].Tab[i].nSteps;
	}
  }
  else
	iStepCount = 0
	
  // set skip button to off if only one step
  if ((iStepCount<2)&&(parent.TOOLBAR.bExport))
  {
		singleIntID= setInterval("singleAudioState()",500)
  }

  if ((self.bAuto)&&(iStepCount>1)&&(parent.HIDDEN.bAudio==true)&&(parent.HIDDEN.audioEnabled)) intervalID = setInterval("soundState()",500)
}

//*********************
//Name:	singleAudioState()
//Purpose:	Determines the state of the embeded sound for single steps only
//Params:	None
//Return:	None
//Created:	23/07/1999 (RM)
//Modified:	23/07/1999 (RM)
//*********************
function singleAudioState()
{
  if ((aAudio[parent.TOOLBAR.iCurrentTabStep]==0)||(parent.HIDDEN.bAudio==false)) clearInterval("intervalID")
  else
  {
	if (parent.HIDDEN.NSsound)
	{
		if (!eval("document.embeds['oSound"+(parent.TOOLBAR.iCurrentTabStep)+"'].IsPlaying();"))
		{
			clearInterval(singleIntID);
			parent.TOOLBAR.setSoundButtons("lastStep");
		}
	}
	else if (parent.HIDDEN.IEsound)
	{
		var iEnd = document.all["oSound"+(parent.TOOLBAR.iCurrentTabStep)].SelectionEnd
		if ((eval("document.oSound"+(parent.TOOLBAR.iCurrentTabStep)+".CurrentPosition;")==0)||(eval("document.oSound"+(parent.TOOLBAR.iCurrentTabStep)+".CurrentPosition;")==iEnd))
		{
			clearInterval(singleIntID);
			parent.TOOLBAR.setSoundButtons("lastStep");
		}
	}
  }
}

//*********************
//Name:	soundState()
//Purpose:	Determines the state of the embeded sound and loads next step
//		once sound is finished playing
//Params:	None
//Return:	None
//Created:	21/12/1998 (RM)
//Modified:	21/12/1998 (RM)
//*********************
function soundState()
{ 
  if ((bAuto==false)||(parent.HIDDEN.bAudio==false))
  {
	clearInterval(intervalID);
  }
  else if (!bStarted)
  {
	if ((parent.HIDDEN.NSsound)&&(aAudio[parent.TOOLBAR.iCurrentTabStep]==1))
	{
		if (eval("document.embeds['oSound"+(parent.TOOLBAR.iCurrentTabStep)+"'].IsPlaying();"))
			bStarted = true
	}
	else if ((parent.HIDDEN.IEsound)&&(aAudio[parent.TOOLBAR.iCurrentTabStep]==1))
	{
		if (eval("document.oSound"+(parent.TOOLBAR.iCurrentTabStep)+".CurrentPosition;") != 0)
			bStarted = true
	}		
  }
  else if (bStarted)
  {
	if ((parent.HIDDEN.NSsound)&&(aAudio.length >= parent.TOOLBAR.iCurrentTabStep))
	{
		if (eval("document.embeds['oSound"+(parent.TOOLBAR.iCurrentTabStep)+"'].IsPlaying();"))
			bStarted = true
		else
		{
			clearInterval(intervalID);
			if (parent.TOOLBAR.iCurrentTabStep < parent.TOOLBAR.iLastTabStep)
			{
				parent.TOOLBAR.iCurrentTabStep = parent.TOOLBAR.iCurrentTabStep + 1;
				parent.TOOLBAR.loadNextStep(true);
				bStarted = false;
			}
			else
				parent.TOOLBAR.setSoundButtons("lastStep")
		}
	}
	else if ((parent.HIDDEN.IEsound)&&(eval("document.oSound"+(parent.TOOLBAR.iCurrentTabStep)+";")))
	{
		var iEndPos = 0
		eval("iEndPos = document.oSound"+(parent.TOOLBAR.iCurrentTabStep)+".selectionEnd;");

		if ((eval("document.oSound"+(parent.TOOLBAR.iCurrentTabStep)+".CurrentPosition;") != iEndPos)&&(eval("document.oSound"+(parent.TOOLBAR.iCurrentTabStep)+".CurrentPosition;") != 0))
			bStarted = true
		else
		{
			clearInterval(intervalID);
			if (parent.TOOLBAR.iCurrentTabStep < parent.TOOLBAR.iLastTabStep)
			{
				parent.TOOLBAR.iCurrentTabStep = parent.TOOLBAR.iCurrentTabStep + 1;
				parent.TOOLBAR.loadNextStep(true);
				bStarted = false;
			}
			else
				parent.TOOLBAR.setSoundButtons("lastStep")
		}			
	}
  }
}

//*********************
//Name:	unload() - deprecated
//Purpose:	Sets the value of the previous page variable in hidden frame
//Params:	None
//Return:	None
//Created:	16/12/1998 (RM)
//Modified:	20/12/1998 (RM)
//*********************
function unload()
{
	if (parent.TOOLBAR)
	{
		parent.TOOLBAR.startChecker();
		setCookie();
	}
//  clearInterval(intervalID);
}

//*********************
//Name:	load()
//Purpose:	initialises variables and calls initStep in the toolbar
//Params:	iStep - number of step
//Return:	None
//Created:	16/12/1998 (RM)
//Modified:	28/06/1999 (RM)
//*********************
function load(iStep)
{
	var sVisited = "";
	var sNotes = "";

	if (!parent.HIDDEN)
	{
		//determine this page name
		var sName = location.href;
		sName = sName.substring(sName.lastIndexOf("/")+1,sName.lastIndexOf("."));
		self.location.replace("../control/default.htm#page="+sName);
//		location.href="../control/default.htm#page="+sName;
	}
	else
	{
		var iPageNum = parent.HIDDEN.iCurrentPage;
		//*** Page numbering should start from one
		self.defaultStatus=parent.TOOLBAR.detStatusText(parent.HIDDEN.iCurrentPage);
		parent.HIDDEN.L.Page[parent.HIDDEN.iCurrentPage].visited=1;

		//check for cookie if loaded from favorites
		if (navigator.cookieEnabled)
		{
			if (parent.location.href.indexOf("#")!=-1)	//loaded from favorites
			{
				if (parent.TOOLBAR.bFavLoad)
				{
					sVisited = getCookie("Visited");
					sNotes = getCookie("Notes");
					sTree = getCookie("Tree");
					sAudio = getCookie("Audio");
					parent.TOOLBAR.bFavLoad = false;
					oLes = parent.HIDDEN.L;

					//set visited and notes status
					for (var i=0; i<oLes.Page.length;i++)
					{
						if (sVisited != null)
							oLes.Page[i].visited = sVisited.substring(i,i+1)
						if (sNotes != null)
							oLes.Page[i].notes = sNotes.substring(i,i+1)
					}

					//set lesson map tree state
					if (sTree != null)
					{
						sNewVal = sTree;
						setTreeState(parent.HIDDEN.T);
					}

					//set audio state
					if (sAudio == "true")
					{
						if (parent.HIDDEN.bAudio != true)
							parent.TOOLBAR.soundOnOff()
					}
					else if (sAudio == "false")
					{
						if (parent.HIDDEN.bAudio != false)
							parent.TOOLBAR.soundOnOff()
					}
				}
			}
		}

		//highlight first tab if in tab page
		iTabs = parent.HIDDEN.L.Page[parent.HIDDEN.iCurrentPage].nTabs;

		var sName = this.location.href;
		sName = sName.substring(sName.lastIndexOf("/")+1,sName.length);

		if (sName!=parent.HIDDEN.L.Page[parent.HIDDEN.iCurrentPage].pagename)
		{
			for (var i=0; i<parent.HIDDEN.L.Page.length; i++)
			{
				if (sName == parent.HIDDEN.L.Page[i].pagename)
				{
					parent.HIDDEN.iCurrentPage = i;
					i=parent.HIDDEN.L.Page.length;
					parent.TOOLBAR.initStep(1);
					if (parent.LFUNC.bLoaded)
						parent.LFUNC.detPage("")
					else
						setTimeout("load(1)",100)
				}				
			}
		}
		else // if (parent.HIDDEN.L.Page[parent.HIDDEN.iCurrentPage].id != parent.HIDDEN.defaultId)
		{
			parent.TOOLBAR.initStep(iStep);

			if (top.LFUNC.bLoaded)
				top.LFUNC.detPage("")

		}
		bLoaded = true;
	}
}

function setCookie()
{
	sName1 = "Visited";
	sName2 = "Notes";
	sName3 = "Tree";
	sName4 = "Audio";
	sValue1 = "";
	sValue2 = "";
	sValue3 = "";
	sValue4 = parent.HIDDEN.bAudio.toString();
	oLes = parent.HIDDEN.L;
	oTre = parent.HIDDEN.T;

	for (var i=0;i<oLes.Page.length;i++)
	{
		sValue1 = sValue1 + oLes.Page[i].visited
		sValue2 = sValue2 + oLes.Page[i].notes
	}

	sValue3 = getTreeState(sValue3,oTre);

	document.cookie = sName1 + "=" + escape(sValue1) + ";";
	document.cookie = sName2 + "=" + escape(sValue2) + ";";
	document.cookie = sName3 + "=" + escape(sValue3) + ";";
	document.cookie = sName4 + "=" + escape(sValue4) + ";";
	return;
}

function getTreeState(value,obj)
{
	var sValue = value;
	for (var i=1;i<=obj.nSub;i++)
	{
		sValue = sValue + obj.C[i].sta;
		sValue = getTreeState(sValue,obj.C[i]);
	}
	return sValue;
}

function setTreeState(obj)
{
	for (var i=1;i<=obj.nSub;i++)
	{
		var iState = parseInt(sNewVal.substring(0,1));
		sNewVal = sNewVal.substring(1,sNewVal.length);
		obj.C[i].sta = iState;
		setTreeState(obj.C[i]);
	}
	return true;
}

function getCookie(sName)
{
	var aCookie = document.cookie.split("; ");
	for (var i=0; i<aCookie.length;i++)
	{
		var aCrumb = aCookie[i].split("=");
		if (sName == aCrumb[0])
			return unescape(aCrumb[1])
	}
	return null;
}

//*********************
//Name:	SetGlossaryTerm(strTerm)
//Purpose:	Loads glossary and set correct position
//Params:	strTerm - selected term (should appear at top of page.
//Return:	None
//Created:	16/12/1998 (RM)
//Modified:	20/12/1998 (RM)
//*********************
function SetGlossaryTerm(sTerm)
{
  parent.HIDDEN.strGlossaryTerm = sTerm
  // The glossary has to be loaded from the toolbar, so that it is killed
  // properly when the user exits the application
  if (parent.TOOLBAR.bExport)
	parent.TOOLBAR.loadTools("GLOSSARY1");
  else
	parent.TOOLBAR.loadTools("GLOSSARY0");
}

function ViewPopUpItem(sName,sID)
{
	if (parent.TOOLBAR.bExport)
	{
		var sFeatures;
		var sFileName;
		var iHeight;
		var iWidth;
		var iPopCount = parent.HIDDEN.L.Popup.length-1;
		for(i=0;i<=iPopCount;i++)
		{
			if(parent.HIDDEN.L.Popup[i].id==sID)
			{
				iHeight = parent.HIDDEN.L.Popup[i].height;
				iWidth = parent.HIDDEN.L.Popup[i].width;
				sFileName = parent.HIDDEN.L.Popup[i].name;
			}
		}
		sWindow = "POPUP";
		sFeatures="height="+iHeight+",width="+iWidth+",left=20,top=20";
		window.open(sFileName,sWindow,sFeatures);

//		sFeatures="dialogHeight:"+iHeight+"px;dialogWidth:"+iWidth+"px;dialogTop:20;dialogLeft:20";
//		showModalDialog(sFileName); //,sFeatures);
	}
	else
	{
		sMethod = "../../mod_storyboard/functions/viewer/link_viewer.asp?iId=" + sID;
		sWindow = "CODE";
		sFeat="";
		parent.opener.parent.GENERAL.openWindow(sMethod,sWindow,sFeat);
	}
}

function Key_Up_IE(e)
{
		var keyChar = event.keyCode;
		var sMods = "none"; //event.
		if (event.altKey) sMods = 'alt'; 
		else if (event.shiftKey) sMods = 'shift'; 
		else if (event.ctrlKey) sMods = 'ctrl'; 
		else if (event.ctrlKey && event.altKey ) sMods = 'ctrl-alt';

		parent.TOOLBAR.detTool(keyChar,sMods);
}

//******************************************************************************************************************************************
// SELECTION
//******************************************************************************************************************************************
var sSelection;
function getSelection()
{
	return sSelection; 
}

function display() 
{
  	if (document.getSelection) 
	{
      		var str = document.getSelection();
    	} 
	else if (document.selection && document.selection.createRange) 
	{
      		var range = document.selection.createRange();
        		if (range != null)
        		{
			var str = range.text;
		}
    	} 
	else 
	{
      		var str = "Sorry, this is not possible with your browser.";
    	}
	sSelection = str;
}

document.onmouseup = display;

