// function Clicked(keyword){
//     // alert(keyword);
//   }
//   function generate_keywords(keyword) {
//     var div = document.getElementById("keywords_english");
//     var li = document.createElement("a");
//     li.href = '#';
//     li.className = 'list-group-item list-group-item-action list-group-item-success';
//     li.textContent = keyword;
//     li.onclick = Clicked(keyword);
//     div.appendChild(li);
//   }
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.todo == "showPageAction")
    {
        chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
            chrome.pageAction.show(tabs[0].id);
        });
    }
    // else if(request.todo == "GenerateKeywords"){
    //     var i;
    //     // alert("Generate Keywords")
    //     for (i = 0; i < request.keys.length; i++) { 
    //     //   console.log(request.keys[i]);
    //       generate_keywords(request.keys[i])
    //     }
    // }
});
$('#exec').click(function(){
    chrome.runtime.sendMessage({todo: "highlight"});
});
