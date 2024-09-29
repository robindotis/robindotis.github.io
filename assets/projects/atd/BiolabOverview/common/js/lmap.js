var sToolState = "";

function Tree(n)		   //Outline Class 
{
 this.nSub   = n;         //number of sub-categories
 this.C       = new Array(n);   //array of sub-categories
}

function Item(Id,Name,Ico,Sup,Lev,nSub,sta,Type,Keywords,FileName)
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
 this.filename = FileName		//-- filename to be loaded
 this.C    = new Array(nSub);	//-- Array of sub-categories
} 

function setStatus1(obj,Id)
{
 if (obj.Id == Id) {self.status = obj.Name;return;}
 for (var j=1; j <= obj.nSub; j++){setStatus(obj.C[j],Id);}
 return 1;
}

function setStatus(obj,Id)
{
 if (obj.Id == Id) {self.status = obj.Name;return false;}
 else for (var j=1;((j<= obj.nSub)&&(setStatus(obj.C[j],Id))); j++){}
 return true;
}

function s(Id){
 setStatus(parent.HIDDEN.T.C[1],Id);
}

function changeState(obj,Id,st)
{
 if (obj.Id == Id) {obj.sta = st;}
 for (var j=1; j <= obj.nSub; j++){changeState(obj.C[j],Id,st);}
 return 1;
}

function chg(iState, Id)
{
// defaultScrollPos = parent.LBROWSER.pageYOffset;
 changeState(parent.HIDDEN.T.C[1],Id,iState);
 display(sToolState);
}

/*function  setDefaultMethod(obj,Id){
 if (obj.Id == Id)defaultMethod = obj.Met;
 for (var j=1; j <= obj.nSub; j++)setDefaultMethod(obj.C[j],Id);
 return 1;
}*/

function sel(Id,sPageName)
{
 parent.HIDDEN.defaultId        = Id;
 //defaultScrollPos = parent.LBROWSER.pageYOffset;
 //setDefaultMethod(T,Id);
 //display();
 loadDetails(Id);
}

function loadDetails(iId)
{
  //determine page number
  var iPageNum = 0
  for (var i=0;i<parent.HIDDEN.L.Page.length;i++)
  {
	if (iId==parent.HIDDEN.L.Page[i].id)
	{
		iPageNum = i;
		bFound = true;
	}
  }

  top.HIDDEN.iPreviousPage = top.HIDDEN.iCurrentPage;
  top.HIDDEN.iCurrentPage = iPageNum;

  if ((sImgPath == "../graphics/")&&(document.all))
  {
	top.TOOLBAR.sKeywords = "";
	top.TOOLBAR.loadPage("!!tool!!");
  }
  else
	top.TOOLBAR.loadPage("")
}

function ExpCol(obj)
{
  // check subs are segment/unit/page
  if ((obj.C[1].Type!="stp")&&(obj.C[1].Type!="tab"))
  {
	if (obj.sta == 0)   //-Collapsed
	{
	      doc.write("<A HREF='javascript:parent.LFUNC.chg(1," + obj.Id + ")' onMouseOver=\"window.status='Expand Tree'\">");
	      doc.write("<IMG SRC='"+sImgPath+"collapse.gif' BORDER='0' ALT='Expand'></A>\n");
	}
	else  //-Expanded
	{
	      doc.write("<A HREF='javascript:parent.LFUNC.chg(0," + obj.Id + ")' onMouseOver=\"window.status='Collapse Tree'\">");
	      doc.write("<IMG SRC='"+sImgPath+"expand.gif' BORDER='0' ALT='Collapse'></A>\n");
	}
  }
  else
	doc.write("<IMG SRC='"+sImgPath+"blank.gif' BORDER=0>\n")
}

function process(obj)
{
 if (obj.Lev > 0)
 {
	if (obj.Id == parent.HIDDEN.defaultId){sTDCode = "<TD bgcolor='LIGHTGREY' "}
	else {sTDCode = "<TD bgcolor='#ffffff' "}

	sTickState = "off";
	for (var i=0;i<=top.HIDDEN.iPageCount;i++)
	{
		if((top.HIDDEN.L.Page[i].id==obj.Id)&&(top.HIDDEN.L.Page[i].visited==1))
			sTickState = "on" 
	}
 
	doc.write("<TR>" + sTDCode + "NOWRAP CLASS='object'><IMG SRC='"+sImgPath+"tick_"+sTickState+".gif' BORDER=0>");
	for (var k=0;k<(obj.Lev*2);k++) doc.write("&nbsp;");
 
	if (obj.nSub != 0) ExpCol(obj)      
	else doc.write("<IMG SRC='"+sImgPath+"blank.gif' BORDER=0>\n");
 
	// remove hyperlink if not a page
	if (obj.Type=="pag")
		 doc.write("<A HREF='javascript:parent.LFUNC.sel(" + obj.Id + ")' onMouseOver='parent.LFUNC.s(" + obj.Id + ");return true'>\n")
 
	doc.write("<IMG SRC='"+sImgPath + obj.Ico +"' BORDER=0>");
	doc.write("&nbsp;" + obj.Name);

	// remove hyperlink if not a page
	if (obj.Type=="pag")
		 doc.write("</A>");

	doc.write("</TD></TR>\n");
 }
 
 for (var j=1; j <= obj.nSub; j++){
	if ((obj.sta != 0)&&(obj.C[j].Type!="tab")&&(obj.C[j].Type!="stp")){process(obj.C[j]);}
 }
 return 1;
}

sImgPath = "../common/graphics/";

function display(sParam){
	if (document.all)
	{
		if (sParam=="tool")
			sImgPath = "../graphics/"
		else
			sImgPath = "../common/graphics/"
	}

	doc = parent.LBROWSER.document;
	doc.open("text/html","replace");
	doc.write("<HTML>");
	doc.write("<HEAD><STYLE>A{TXT-DECORATION:none;FONT-FAMILY:Arial;FONT-SIZE:10pt;} TD.object{FONT-FAMILY:Arial;FONT-SIZE:10pt;}</STYLE>\n");
	doc.write("<SCRIPT LANUAGE=\"javascript\">\n")
	doc.write("function Key_Up_IE(e){\n");
	doc.write("	var keyChar = event.keyCode;\n");
	doc.write("	var sMods = \"none\";\n");
	doc.write("	if (event.altKey) sMods = 'alt'; \n");
	doc.write("	else if (event.shiftKey) sMods = 'shift'; \n");
	doc.write("	else if (event.ctrlKey) sMods = 'ctrl'; \n");
	doc.write("	else if (event.ctrlKey && event.altKey ) sMods = 'ctrl-alt';\n");
	doc.write("	top.TOOLBAR.detTool(keyChar,sMods);\n");
	doc.write("}\n");
	doc.write("function load(){\n");
	doc.write("	self.defaultStatus=parent.TOOLBAR.detStatusText(parent.HIDDEN.iCurrentPage)");
	doc.write("}\n");
	doc.write("</SCRIPT>\n")
	doc.write("</HEAD>\n");
	doc.write("<BODY onLoad=\"load()\" onKeyUp=\"Key_Up_IE();\" BGCOLOR='#ffffff' LNK='BLACK'>");

	if (parent.HIDDEN.T.nSub!=0)
	{
	    doc.write("<TABLE width='100%' border='0' cellspacing='0' cellpadding='1' border='0'>\n");
	    process(parent.HIDDEN.T.C[1]);
		doc.write("</TABLE>");
	}
	else doc.write("Empty Catalogue");

	doc.write("</BODY></HTML>");
	doc.close();
	return 1;
}

function detPage(sParam)
{
	//determine id of currently selected page
	iPage = top.HIDDEN.iCurrentPage;
	iId = top.HIDDEN.L.Page[iPage].id;

	parent.HIDDEN.defaultId = iId;
	if (parent.HIDDEN.T.nSub!=0)
		setTreeState(iId, parent.HIDDEN.T.C[1])

	sToolState = sParam;
	display(sParam);	

	return 1;
}

function setTreeState(id, obj)
{
 var bFound = false;

 //alert("name: "+obj.Name);
 if ((obj.Id == parent.HIDDEN.defaultId)&&(obj.Id==id))
 {
	obj.sel = 1;
	if (obj.Lev != 0)
		setTreeState(obj.Sup,parent.HIDDEN.T.C[1])
	bFound = true;
 }
 else if (obj.Id == id)
 {
	if (obj.nSub != 0)
		obj.sta = 1
	if (obj.Lev != 0)
		setTreeState(obj.Sup,parent.HIDDEN.T.C[1])
	bFound = true;
 }
 
 if(!bFound)
 {
	for (var j=1; j <= obj.nSub; j++)
	{
		setTreeState(id, obj.C[j])
	}
 }
 return 1;
}