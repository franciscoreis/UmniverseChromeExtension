var activeTab
var tabWithUmniverse
var browserTabs
var addButtonForEachTab = false
var selectedPlaceNumber = localStorage.getItem('selectedPlaceNumber') || 7
const isInLocalhost = location.host === "lglhpednjebaeoldppgkhgibjhgbladg"


// Initialize button with user's preferred color
let tabAddedToUmniverse = document.getElementById("tabAddedToUmniverse");

// When the button is clicked, inject setPageBackgroundColor into current page
tabAddedToUmniverse.addEventListener("click", async () => 
{
  chrome.tabs.query({ active: true, currentWindow: true},function (tabs) 
	{
        let tab =tabs[0]
  		sendTabImage(tab)
    })


})

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() 
{
  chrome.storage.sync.get("color", ({ color }) => 
  {
    document.body.style.backgroundColor = color
  });
}
//---------------------------------------------------
function selectUmniverseTab()
{
  if(tabWithUmniverse)
	chrome.tabs.update(tabWithUmniverse.id, {active: true})
  else if(isInLocalhost)
  	chrome.tabs.create({url:"http://localhost:8080/?goto3d=true"})
  else
	chrome.tabs.create({url:"https://umniverse.com/?goto3d=true"})
}
//-------------------------------------------------
function sendTabImage(tab)
{

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) 
{
  let tab = tabs[0]
  let title = tab.title
 
  chrome.tabs.captureVisibleTab(null, {format: 'png'}, function (screen) 
   {
		let url = screen
		 //chrome.tabs.sendMessage(tabs[0].id, {func: 'showPicture', picture: screen});
		chrome.tabs.sendMessage(tabWithUmniverse.id, { msg: "tab_image_" + activeTab.id, data: url, data2: tab.url, data3: title}, 
			(response) => {
    		if (response) 
				{
        // do cool things with the response
        // ...
    			}

			})
	
	
                    });

});
	
	
}
//-------------------------------------------------
function sendTabMHTML(tab)
{
	
chrome.pageCapture.saveAsMHTML({ tabId: tab.id }, async (blob) => {
    const content = await blob.text()

	if(true)
	{    
	 	const url = btoa(content);
		chrome.tabs.sendMessage(tabWithUmniverse.id, { msg: "tab_mhtml", data: url }, (response) => {
        		if (response) 
					{
            // do cool things with the response
            // ...
        			}

				})
	}
    else 
	{
	 const url = "data:application/x-mimearchive;base64," + btoa(content);
	 chrome.downloads.download({
        url,
        filename: 'filename.mhtml'
    	})
	}
})	
	
if(false) //for later development
chrome.pageCapture.saveAsMHTML(
          { tabId: tab.id }, //only on activeTab
          function(mhtmlBlob) {
			//var url = URL.createObjectURL(mhtml)
			mhtmlBlob.arrayBuffer().then(buffer => 
				{
				let mhtmlText = "data:application/x-mimearchive;base64," + String.fromCharCode.apply(null, new Uint16Array(buffer))
				let encoded = encodeURIComponent(mhtmlText)
				chrome.tabs.sendMessage(tabWithUmniverse.id, { msg: "tab_mhtml", data: encoded }, (response) => {
        		if (response) 
					{
            // do cool things with the response
            // ...
        			}

				})
					
		})
			
            console.log("submitMHTML() sent mhtml to server");
          }
        )	
	
selectUmniverseTab()

if(false)
chrome.tabs.sendMessage(tabWithUmniverse.id, { msg: "tab_url", data: tab.url }, (response) => {
        if (response) {
            // do cool things with the response
            // ...
        }
})


	
}
//-------------------------------------------------
function clickedOnActivateTab(button, tab)
{
	
chrome.tabs.update(tab.id, {active: true})
setTimeout(function () {sendTabImage(tab)}, 500)
//https://stackoverflow.com/questions/22696842/how-to-use-chrome-pagecapture-saveasmhtml

}
//--------------------------------------------------
function clickedOnTab(button, tab)
{
	
//sendTabMHTML(tab)
chrome.tabs.update(tab.id, {active: true})
setTimeout(function () {sendTabImage(tab)}, 500)

//https://stackoverflow.com/questions/22696842/how-to-use-chrome-pagecapture-saveasmhtml

}
//--------------------------------------------------
function represent9places()
{
	for(let i = 1; i <= 9; i++)
	{
	let td = document.getElementById("placeNumber" + i)
	td.style.color = i == selectedPlaceNumber ? "#fff" : "#000"	
	td.style.backgroundColor = i == selectedPlaceNumber ? "#d30080" : "#ddd"	
	td.style.fontWeight = "bold"
	td.style.cursor = "pointer"
	td.addEventListener("click", async () => 
		{
			selectedPlaceNumber=i
			localStorage.setItem('selectedPlaceNumber', i)
			represent9places()
			chrome.tabs.sendMessage(tabWithUmniverse.id, { msg: "selectedPlaceNumber", data: selectedPlaceNumber}, 
			(response) => 
			{
				// do cool things with the response
    		})

			selectedPlaceNumber 
		}) 
	}
}
//--------------------------------------------------
function closePopup()
{
window.close()	
//chrome.tabs.update({ active: true })	
}
//--------------------------------------------------


var activeWindow

chrome.windows.getCurrent(function(window) {

activeWindow = window
	
chrome.tabs.query({}, function (tabs) 
  {
	browserTabs = tabs
	tabWithUmniverse = undefined

	let tabs_info = document.getElementById("tabs_info")

	let s =""
	
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
	  {
		tabWithUmniverse = tab
		chrome.scripting.executeScript(
    	{
      	target: {tabId: tabWithUmniverse.id},
      	files: ['contentScript.js'],
	    }, () => { })
		
	  }

	  if(addButtonForEachTab)
		  s += "<br><button id='tab_activate_"+tab.id+"' style='min-width:17em;max-width:17em' title='" + tabURL + "'>"+tab.title+"</button>"
 	}
	catch(exception)
	{
		//nothing
	}

	if(!tabWithUmniverse)
	{
		selectUmniverseTab()
		return
	}

	const activeTabIsUmniverse = activeTab == tabWithUmniverse
	
	let umniverseTab = document.getElementById("umniverseTab")
	
	if(activeTabIsUmniverse)
	{
		represent9places()
	}
	else
	{
       s +=  "<br><button id='buttonUmniverseTab' style='font-weight:bold;color:white;background-color:#d30080'>UMNIVERSE TAB</button>"
	   sendTabImage(activeTab)
	}

	document.getElementById("notUmniverseTab").style.display = activeTabIsUmniverse ? "none" : ""
	umniverseTab.style.display = activeTabIsUmniverse ? "" : "none"

	tabs_info.innerHTML = s
	
	let buttonUmniverseTab = document.getElementById("buttonUmniverseTab")
	if(buttonUmniverseTab)
		buttonUmniverseTab.addEventListener("click", async () => {selectUmniverseTab();closePopup()})

    if(addButtonForEachTab)
		for(let t = 0; t < tabs.length; t++)
		{
		let tab = tabs[t]
		let buttonTab = document.getElementById("tab_activate_" + tab.id)
		if(buttonTab)
			buttonTab.addEventListener("click", async () => {clickedOnTab(this, tab)})
	 	}
  })
})
