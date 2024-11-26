var activeTab
var tabWithUmniverse
var browserTabs
var showTabAndUpdateURL = true //will be an option

var activeWindow

updateAllTabsAndWindowsStatus()


// Listener - listen to all the events.
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

	let tab = browserTabs[browserTabs.length-1]
	chrome.tabs.update(tab.id, {active: true})

    if (request.ext) {
        console.log('Message received from ' + request.ext);
        sendResponse({ack:'received'}); // This send a response message to the requestor
    }
});

//-------------------------------------------------------------
chrome.tabs.onActivated.addListener(function(activeInfo) 
{
	/*
	if(false) //does not work but for now it is better only when click
	setTimeout(function () {
     sendTabImage(activeInfo.tab)
    }, 2000)
	*/
})
//-------------------------------------------------------
/*chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) 
{
		sendTabImage(tab)
})
*/
//-------------------------------------------------------
function sendTabImage(tab)
{

if(tab)
   chrome.tabs.captureVisibleTab(null, {format: 'png'}, function (urlScreen)
   {
		 //chrome.tabs.sendMessage(tabs[0].id, {func: 'showPicture', picture: screen});
	
		chrome.tabs.sendMessage(tabWithUmniverse.id, { msg: "tab_image_" + activeTab.id, data: urlScreen },
			(response) => {
    		if (response) 
				{
        // do cool things with the response
        // ...
    			}

			})
	
  });


	
}
//--------------------------------------------------
function checkFunctionFromUmniverseTab()
{
	if(my_navbar.style.animationName)
	{
		
	let tab = browserTabs[browserTabs.length-1]
	chrome.tabs.update(tab.id, {active: true})
	
	my_navbar.style.animationName = ""		
	muBody.style.animationName = ""		
	}
}
//--------------------------------------------------
chrome.runtime.onMessageExternal.addListener(async (request, sender, sendResponse) => 
	{

	if (sender.id === "lkçlkçlkçlkçlkçlk" || !request.msg)
      return  // don't allow this extension access
    
	if(request.msg === "activate_tab")
	{
		const tabID =  parseInt(""+ request.data)
		const url = request.data2
		
		chrome.tabs.query({}, function (tabs) 
  		{
		let tabFromID
		let tabFromURL
		for(let t = 0; t < tabs.length; t++)
			{
			let tab = tabs[t]
			if(tab.id == tabID)
			  tabFromID = tab
			if(tab.url == url)
			  tabFromURL = tab
			}
			
			if(tabFromID)
				{
				if(showTabAndUpdateURL && url != tabFromID.url)
					chrome.tabs.update(tabFromID.id, {active: true, url: url})	
			  	else
					chrome.tabs.update(tabFromID.id, {active: true})	
				}
			else if(tabFromURL)
			{
			  chrome.tabs.update(tabFromURL.id, {active: true})
			  sendResponse({success: true,  msg: "tab_updatedID", data: tabID, data2: tabFromURL.id})
			}
			else
			  chrome.tabs.create({url: url},function (tab) 
			  {
			  sendResponse({success: true, msg: "tab_updatedID", data: tabID, data2: tab.id})
			  })
	  })
    }
	else 
		{
      	sendResponse({success: false})
    	}

	//solves "the message port closed before a response was received."
	return true //Promise.resolve("Dummy response to keep the console quiet");
  })
//--------------------------------------------------
function updateAllTabsAndWindowsStatus()
{

chrome.windows.getCurrent(function(window) {

activeWindow = window

chrome.tabs.query({}, function (tabs) 
  {
	browserTabs = tabs
	tabWithUmniverse = undefined

	for(let t = 0; t < tabs.length; t++)
	try
	{
	let tab = tabs[t]
	if(tab.active && tab.windowId == activeWindow.id)
		activeTab = tab
	let tabURL = tab.url
	if(!tabWithUmniverse)
	  if(tabURL.indexOf("http://localhost:8080/") != -1 
		//not allowed || tabURL.indexOf(".localhost:8080/") != -1 
		|| tabURL.indexOf("https://umniverse.com/") != -1 
		|| tabURL.indexOf(".umniverse.com/") != -1 )
		tabWithUmniverse = tab
 	}
	catch(exception)
	{
		//nothing
	}

  })
})
}