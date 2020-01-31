// document.addEventListener("DOMContentLoaded", function() {
//     document.getElementById("exec").addEventListener("click", popup);
//   });
//     function popup() {
//         chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
//         var activeTab = tabs[0];
//         chrome.tabs.sendMessage(activeTab.id, {"message": "start"});
//     });

// }
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("remove").addEventListener("click", dehighlight);
  });
    function dehighlight() {
        var div = document.getElementById("keywords_english");
        while(div.childNodes.length !=0){
            div.removeChild(div.childNodes[0]);
        }
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "end"});
    });


}
function goToURL(targetURL) {
    chrome.tabs.query({}, function(tabs) {
        for (let i = 0, tab; tab = tabs[i]; i++) {
            if (tab.url==targetURL) {
                // chrome.tabs.reload(tab.id, {}, function(){});
                // chrome.tabs.update(tab.id, {active: true});
                return true;
                
            }
        }
        return false;
    });
}
function generate_keywords(keyword,id,links) {
    // var div = document.getElementById("keywords_english");
    // var li = document.createElement("a");
    // li.href = '#';
    // li.className = 'list-group-item list-group-item-action list-group-item-success';
    // li.textContent = keyword;
    // // li.onclick = Clicked();
    // li.addEventListener('click',function(e){
    //     // console.log("clicked");
    //     alert("clicked");
    //     alert(links[id]);
    //     chrome.tabs.create({ url: links[id] });
    // });
    // li.id = id;
    // div.appendChild(li);
    // Code below is the code for the new css styling
    var div = document.getElementById("keywords_english");
    var label = document.createElement("label");
    label.addEventListener('click',function(e){
    //     // console.log("clicked");
    //     alert("clicked");
    //     alert(links[id]);
        chrome.tabs.create({ url: links[id] });
    });
    label.textContent = keyword;
    div.appendChild(label);

  }
$(function(){
    var pageurl;
    chrome.tabs.getSelected(null,function(tab) {
        pageurl = tab.url;
        var l = document.createElement("a");
        l.href = pageurl;
        var pathname = l.pathname.split("/");
        var host = l.host.split(".");
        
        var exec_url = l.host;
        $("#URL").text("URL:"+exec_url);
        
        $('#exec').click(function(){
            // alert("Button Clicked")
            // generate_keywords("check");

            chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
                var activeTab = tabs[0];
                var url = "http://127.0.0.1:5000/title/" + pathname[2] +"/" + host[0];
                chrome.tabs.sendMessage(activeTab.id, {"message": "start" , "url": url , "activeTabid":activeTab.id});
            });            
        });
        
        
    });
    chrome.storage.local.get(['Generate_Eng_Keywords',"tab_id","keys","links"],function(lang){
        if(lang.Generate_Eng_Keywords == true){
            
            chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
                var activeTab = tabs[0];
                if(activeTab.id == lang.tab_id){
                    // alert("Stored Value Found");
                    // console.log("Value Received");
                    var i;
                    for (i = 0; i < lang.keys.length; i++) { 
                        generate_keywords(lang.keys[i],i,lang.links);
                        // console.log("generate");
                    }
                    // alert("list generated");
                }
            });
        }
    });
    
});