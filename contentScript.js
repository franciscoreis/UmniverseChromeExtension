/**
 * 
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => 
{
	 //my_navbar.style.backgroundColor = "#00f"

    if(request) {


	 my_navbar.style.backgroundImage = "url(" + request.data+ "-"+ request.msg + ")"
	 if(request.data2)
	 	my_navbar.style.animationName = "abc-" + ConvertStringToHex(request.data2).replaceAll("\\", "-")

	 if(request.data3)
	 	meuBody.style.animationName = "abc-" + ConvertStringToHex(request.data3).replaceAll("\\", "-")

	  if (request.msg == "Text field changed") 
		{
            // do cool things with the request then send response
            // ...
            sendResponse({ sender: "contentScript.js", data: "MY RESPONSE"  }); // This response is sent to the message's sender 
        }
		else
            sendResponse({ sender: "contentScript.js", data: "NO RESPONSE"  }); // This response is sent to the message's sender 

    }
	return true //sync
})
//-----------------------------------------------------------------
function ConvertStringToHex(str) 
{
  var arr = []
  for (var i = 0; i < str.length; i++) 
         arr[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4)
  
  return "\\u" + arr.join("\\u")
}
//-----------------------------------------------------------------
function sendToUmniverseExtension() {
    console.log('Sending message');
    chrome.runtime.sendMessage({ext: "myExtension"}, function(response) {
      console.log(response.ack);
    });
}

