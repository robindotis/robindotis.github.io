var iTotPages = parent.opener.parent.HIDDEN.iPageCount;		//Get total number of pages
var j = 0;  												//counter - for number of bookmarks (= size of aBookmarks)

//*********************
//Name:	showBookmarks  DEPRECATED
//Purpose:	Stores in the bookmark array on this page all pages that are bookmarked,
//		ie where the bookmark array in the lesson engine = 1.
//Params:	None
//Return:	None
//Created:	09/11/1998 (RM)
//Modified:	09/11/1998 (RM)
//*********************
function showBookmarks()
{
	var intTotPages = parent.opener.parent.HIDDEN.iPageCount;		//Get total number of pages

	//Cycle through all pages and see if they have been bookmarked (aBookmarks[i]=1) (in hidden.htm).
	//If the page is bookmarked, assign the index number of the bookmark array in the hidden frame
	//to the aBookmarks array of this page (bookmarks.htm).
	for (var i=0;i<=intTotPages;i++)
	{
		var intCurrent = parent.opener.parent.HIDDEN.L.Page[i].bookmarks;
		if (intCurrent==1)
		{
			self.aBookmarks[self.j] = i;
			self.j++;
		}
	}
}

//*********************
//Name:	addBookmark
//Purpose:	Adds the current page to the bookmark tool,
//		by updating the bookmarks array in the lesson engine
//Params:	None
//Return:	None
//Created:	09/11/1998 (RM)
//Modified:	09/11/1998 (RM)
//*********************
function addBookmark()
{
var iPageNum = parent.opener.parent.HIDDEN.iCurrentPage;		//variable in hidden.asp

// determine if page contains tabs
var iTabCount = parent.opener.parent.HIDDEN.L.Page[iPageNum].nTabs;
if (iTabCount>1)
	parent.opener.parent.HIDDEN.L.Page[iPageNum].Tab[parent.opener.parent.TOOLBAR.iCurrentTab-1].bookmarks=1
else
	parent.opener.parent.HIDDEN.L.Page[iPageNum].bookmarks=1	

window.location="bookmarks.htm";				//reload bookmarks.htm
}

//*********************
//Name:	deleteBookmark
//Purpose:	Deletes the selected bookmarks from the bookmark tool
//Params:	None
//Return:	None
//Created:	09/11/1998 (RM)
//Modified:	09/11/1998 (RM)
//*********************
function deleteBookmark()
{
	//cycle through all the check boxes. If they are checked, bookmarks to 0 for that bookmark
	//(in hidden.htm) and reload bookmark.htm.
	// number of form elements
	var iFormLength = document.forms[0].length;

	for (var i=0;i<iFormLength;i++)
	{
		if (document.forms[0].elements[i].checked)
		{
			// determine element name
			var sName = document.forms[0].elements[i].name;
			
			iPos1 = sName.indexOf("p");
			iPos2 = sName.indexOf("t");
			
			if (iPos2!=-1)
			{
				var iPage = parseInt(sName.substring(iPos1+1,iPos2));
				var iTab = parseInt(sName.substring(iPos2+1));
				parent.opener.parent.HIDDEN.L.Page[iPage].Tab[iTab].bookmarks=0;
			}
			else
			{
				var iPage = parseInt(sName.substring(iPos1+1));
				parent.opener.parent.HIDDEN.L.Page[iPage].bookmarks=0;
			}
		}
	}

	window.location="bookmarks.htm";
}

//*********************
//Name:	KeepFocused (disabled)
//Purpose:	To keep the current window always focused
//Params:	None
//Return:	None
//Created:	09/11/1998 (RM)
//Modified:	09/11/1998 (RM)
//*********************
var blnOnTop = true;
function KeepFocused(){}  //if (blnOnTop) setTimeout("self.focus()",1);}

//*********************
//Name:	goPage
//Purpose:	Loads the selected page in the main viewer
//Params:	sPageNum - page number of linked page
//Return:	None
//Created:	09/11/1998 (RM)
//Modified:	02/12/1998 (RM)
//*********************
function goPage(sPageNum,sTabNum)
{
  parent.opener.sKeywords = "";	//remove keywords
  parent.opener.parent.HIDDEN.iCurrentPage = parseInt(sPageNum);
  parent.opener.loadPageResults(sPageNum,sTabNum,"1");
  parent.close();
}
