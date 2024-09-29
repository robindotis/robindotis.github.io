NS=false;
IE=false;
if (document.layers) NS=true;
else if (document.all) IE=true;

//*********************
//Name:	setTable()
//Purpose:	Sets up table to show previously visited pages and highlight current page
//Params:	None
//Return:	None
//Created:	22/12/1998 (RM)
//Modified:	22/12/1998 (RM)
//*********************
function setTable()
{
  var iPageCount = parent.HIDDEN.iPageCount;
  var sPageName = "";
  var iLastPage = parent.HIDDEN.iPreviousPage;

  self.defaultStatus = "Lesson Map";

  //set buttons
  parent.TOOLBAR.setButtons(0);

  // Determine which pages have been visited and enable the tick gif if so.
  for (i=1; i<=iPageCount; i++)
  {
	if (parent.HIDDEN.L.Page[i].visited==1)
	{
		sPageName = "a"+parent.HIDDEN.L.Page[i].id;

		//Remove white space from names, as this causes problems
		while (sPageName.indexOf(" ") != -1)
		{
			sPageName = sPageName.substring(0,sPageName.indexOf(" "))+sPageName.substring(sPageName.indexOf(" ")+1,sPageName.length);
		}
		if (IE) eval("document.all['"+sPageName+"_img'].src='../common/graphics/tick_on.gif'");
		if (NS) eval("document.layers['"+sPageName+"'].document['"+sPageName+"_img'].src='../common/graphics/tick_on.gif'");
	}
  }

  // Determine page of last name and set it's table cell colour to red
  sPageName = "a"+parent.HIDDEN.L.Page[iLastPage].id;

  //Remove white space from names, as this causes problems
  while (sPageName.indexOf(" ") != -1)
  {
  	sPageName = sPageName.substring(0,sPageName.indexOf(" "))+sPageName.substring(sPageName.indexOf(" ")+1,sPageName.length);
  }
  if ((IE)&&(document.all[sPageName])) {document.all[sPageName].bgColor="red";}
  if ((NS)&&(document.layers[sPageName])) {document.layers[sPageName].bgColor="red";}
}

//*********************
//Name:	OverColor()
//Purpose:	Sets the color of the cell on 'onMouseOver'
//Params:	cell - name of cell to be affected
//Return:	None
//Created:	17/12/1998 (RM)
//Modified:	18/12/1998 (RM)
//*********************
function OverColor(cell)
{
  sCell = cell;
  if (IE) eval("document.all[sCell].bgColor='#0000FF'")
  if (NS){document.layers[sCell].bgColor="#0000FF";}
}

//*********************
//Name:	OutColor()
//Purpose:	Sets the color of the cell on 'onMouseOut' back to default color
//Params:	cell - name of cell to be affected
//		color - default color of cell
//Return:	None
//Created:	17/12/1998 (RM)
//Modified:	18/12/1998 (RM)
//*********************
function OutColor(cell, color)
{
  var sCell = cell;
  var sColor = color;
  var sCurrentPageName = "a"+parent.HIDDEN.L.Page[parent.HIDDEN.iPreviousPage].id;

  //Remove white space from names, as this causes problems
  while (sCurrentPageName.indexOf(" ") != -1)
  {
  	sCurrentPageName = sCurrentPageName.substring(0,sCurrentPageName.indexOf(" "))+sCurrentPageName.substring(sCurrentPageName.indexOf(" ")+1,sCurrentPageName.length);
  }

  //Check to see if cell colour should be red (current page)
  if (sCell == sCurrentPageName)
  {
	sColor="red";
  }
  else
  {
	sColor = "#"+sColor;
  }

  if (IE) eval("document.all[sCell].bgColor='"+sColor+"'")
  if (NS) eval("document.layers[sCell].bgColor='"+sColor+"'")
}

//*********************
//Name:	GoPage()
//Purpose:	Goes to the page selected by user. And calls DeterminePage function
//			of hidden.asp, which sets the current page number in that file.
//Params:	sID - page id, preceded by "a"
//			sPN - Page Name
//Return:	None
//Created:	17/12/1998 (RM)
//Modified:	18/12/1998 (RM)
//*********************
function GoPage(sID)
{
  var sId = sID.substring(1);
  var iPageNr = parent.HIDDEN.DeterminePage(sId);
  parent.HIDDEN.iCurrentPage = iPageNr;
  parent.TOOLBAR.loadPage("");
}

function Key_Up_IE(e)
{
		var keyChar = event.keyCode;
		var sMods = "none"; //event.
		if (event.altKey) sMods = 'alt'; 
		else if (event.shiftKey) sMods = 'shift'; 
		else if (event.ctrlKey) sMods = 'ctrl'; 
		else if (event.ctrlKey && event.altKey ) sMods = 'ctrl-alt';

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
}
