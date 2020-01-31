var url = window.location.toString();
var l = document.createElement("a");
l.href = url;
var pathname = l.pathname.split("/");
var host = l.host.split(".");
if(host[0] == "en"){
  chrome.storage.local.get(["keys"],function(lang){
    // var i;
    // myHilitor.setMatchType("open");
    // for (i = 0; i < lang.keys.length; i++) { 
    //   // console.log(request.content[i]);
    //   myHilitor.apply(lang.keys[i]);
    // }
  });
  // chrome.storage.sync.get(["single_key"],function(lang){
  //   myHilitor.apply(lang.single_key)
  // });
}else{
  chrome.runtime.sendMessage({todo: "showPageAction"});
}

var myHilitor = new Hilitor(document.body);
//myHilitor.setMatchType("open");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.message === "start")
    { 
        
        myHilitor.setMatchType("open");
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                alert(this.responseText);
                var obj = JSON.parse(this.responseText);
                var i;
                // for (i = 0; i < obj.English_keywords.length; i++) { 
                //     generate_keywords(obj.English_keywords[i]);
                // }
                // chrome.runtime.sendMessage({todo: "GenerateKeywords" , keys:obj.English_keywords});
                
                chrome.storage.local.set({'Generate_Eng_Keywords':true , "tab_id":request.activeTabid, "keys": obj.English_keywords ,"url_en":obj.url_en , "links":obj.links },function(){
                  // alert("Value Stored");
                  console.log("Value Stored");

                });
                
                
                for (i = 0; i < obj.keywords.length; i++) { 
                  // console.log(request.content[i]);
                  myHilitor.apply(obj.keywords[i]);
                }
                // generate_keywords()
            }
        };
        xhttp.open("GET", request.url , true);
        xhttp.send();
        
    }
    if (request.message === "end")
    {
        // console.log("Test");
        chrome.storage.local.set({'Generate_Eng_Keywords':false , "tab_id":request.activeTabid, "keys": []},function(){
          // alert("Value Stored");
          console.log("Value Removed");

        });
        myHilitor.remove();
    }
});
//For the Hilitor class function written below, check the
// Original JavaScript code by Chirp Internet: www.chirp.com.au
// Please acknowledge use of this code by including this header.

function Hilitor(id, tag)
{

  // private variables
  var targetNode = document.getElementById(id) || document.body;
  var hiliteTag = tag || "MARK";
  var skipTags = new RegExp("^(?:" + hiliteTag + "|SCRIPT|FORM|SPAN)$");
  // var colors = ["#ff6", "#a0ffff", "#9f9", "#f99", "#f6f"];
  var colors = ["#ff6"];
  var wordColor = [];
  var colorIdx = 0;
  var matchRegExp = "";
  var openLeft = false;
  var openRight = false;

  // characters to strip from start and end of the input string
  var endRegExp = new RegExp('^[^\\w]+|[^\\w]+$', "g");


  var endRegExp = new RegExp('^[^\\u[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]]+|[^\\u[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]]+$', "g");

  // characters used to break up the input string into words
  var breakRegExp = new RegExp('[^\\u[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]\'-]+', "g");

  this.setEndRegExp = function(regex) {
    endRegExp = regex;
    return endRegExp;
  };

  this.setBreakRegExp = function(regex) {
    breakRegExp = regex;
    return breakRegExp;
  };

  this.setMatchType = function(type)
  {
    switch(type)
    {
      case "left":
        this.openLeft = false;
        this.openRight = true;
        break;

      case "right":
        this.openLeft = true;
        this.openRight = false;
        break;

      case "open":
        this.openLeft = this.openRight = true;
        break;

      default:
        this.openLeft = this.openRight = false;

    }
  };

  this.setRegex = function(input)
  {
    // console.log("setTegex input");
    // console.log(input);
    input = input.replace(endRegExp, "");
    // console.log("replaced endregex");
    // console.log(input);
    // input = input.replace(breakRegExp, "|");
    // console.log("replaced breakregex");
    input = input.replace(/^\||\|$/g, "");
    console.log(input);
    if(input) {
      var re = "(" + input + ")";
      if(!this.openLeft) {
        re = "\\b" + re;
      }
      if(!this.openRight) {
        re = re + "\\b";
      }
      matchRegExp = new RegExp(re, "i");
      console.log(matchRegExp);
      return matchRegExp;
      // console.log("setRegEX");
      // console.log(matchRegExp);
    }
    return false;
  };

  this.getRegex = function()
  {
    var retval = matchRegExp.toString();
    retval = retval.replace(/(^\/(\\b)?|\(|\)|(\\b)?\/i$)/g, "");
    retval = retval.replace(/\|/g, " ");
    return retval;
  };

  // recursively apply word highlighting
  this.hiliteWords = function(node)
  {
    if(node === undefined || !node) return;
    if(!matchRegExp) return;
    if(skipTags.test(node.nodeName)) return;

    if(node.hasChildNodes()) {
      for(var i=0; i < node.childNodes.length; i++)
        this.hiliteWords(node.childNodes[i]);
    }
    if(node.nodeType == 3) { // NODE_TEXT
      if((nv = node.nodeValue) && (regs = matchRegExp.exec(nv))) {
        if(!wordColor[regs[0].toLowerCase()]) {
          wordColor[regs[0].toLowerCase()] = colors[colorIdx++ % colors.length];
        }

        var match = document.createElement(hiliteTag);
        match.appendChild(document.createTextNode(regs[0]));
        match.style.backgroundColor = wordColor[regs[0].toLowerCase()];
        match.style.color = "#000";

        var after = node.splitText(regs.index);
        after.nodeValue = after.nodeValue.substring(regs[0].length);
        node.parentNode.insertBefore(match, after);
      }
    };
  };

  // remove highlighting
  this.remove = function()
  {
    var arr = document.getElementsByTagName(hiliteTag);
    while(arr.length && (el = arr[0])) {
      var parent = el.parentNode;
      parent.replaceChild(el.firstChild, el);
      parent.normalize();
    }
  };

  // start highlighting at target node
  this.apply = function(input)
  {
    // this.remove();
    if(input === undefined || !(input = input.replace(/(^\s+|\s+$)/g, ""))) {
      // console.log("Wong");
      return;
    }
    // console.log("Test 1");
    if(this.setRegex(input)) {
      this.hiliteWords(targetNode);
    }
    // console.log("Test 2");
    // console.log(matchRegExp);
    return matchRegExp;
  };

}

// // below is the self written code   
// var myHilitor = new Hilitor(document.body);
// myHilitor.apply("also media is of some use to us social values haha"); // id of the element to parse
// console.log("Test");

