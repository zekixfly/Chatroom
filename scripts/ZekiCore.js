/*-------------版權區---------------
作者: Zeki
信箱: zekixfly@hotmail.com

版權聲明:
一、本網站的版權屬原作者所有。 
二、盼望尊重知識產權，請勿擅自轉貼複製。
    
---------------版權區-------------*/

// NodeType - Named Constant
// 1 ELEMENT_NODE
// 2 ATTRIBUTE_NODE
// 3 TEXT_NODE
// 4 CDATA_SECTION_NODE
// 5 ENTITY_REFERENCE_NODE
// 6 ENTITY_NODE
// 7 PROCESSING_INSTRUCTION_NODE
// 8 COMMENT_NODE
// 9 DOCUMENT_NODE
// 10  DOCUMENT_TYPE_NODE
// 11  DOCUMENT_FRAGMENT_NODE
// 12  NOTATION_NODE





window.importJS = function(arr) {
    var webScript = document.getElementsByTagName('webScript')[0];
    var scriptTag;
    var script = arr;

    for (var i = 0 ; i<script.length; i++) {
        scriptTag = document.createElement('script')
        scriptTag.async = false;
        scriptTag.type = 'text/javascript';
        scriptTag.src = script[i];
        webScript.appendChild(scriptTag);
    }
}


window.msgTip = function(txt) {

  var tipBox = document.getElementsByTagName('body')[0].appendChild(document.createElement('div'));
  tipBox.id = 'tip-box';
  tipBox.innerHTML = txt;
  tipBox.addClass('animated').addClass('animated.infinite').addClass('fadeInDown');
  // tipBox.addClass('animated.infinite');
  // tipBox.addClass('fadeInDown');

  setTimeout(removeTip, 3000);  

  function removeTip() {
    document.getElementsByTagName("body")[0].removeChild(tipBox);
  }
}



// window.socialMediaLogin = function() {
  
// }


var alertTitle = 'Message Box',
    alertBtnTxtOK = '確定',
    alertBtnTxtCancel = '取消';

//customer alert.
window.alert = function(txt) {
  var mask = document.body.addSeed(document.createElement('div'));
  mask.className = 'mask';
  var alertBox = document.getElementsByTagName('body')[0].appendChild(document.createElement('div'));
  alertBox.id = 'alert-box';
  var boxTitle = alertBox.appendChild(document.createElement('h1'));
  boxTitle.appendChild(document.createTextNode(alertTitle));
  var boxContent = alertBox.appendChild(document.createElement('p'));
  boxContent.innerHTML = txt;
  var boxBtnOK = alertBox.appendChild(document.createElement('input'));
  boxBtnOK.type = 'button';
  boxBtnOK.value = alertBtnTxtOK;
  boxBtnOK.focus();
  boxBtnOK.onclick = function() {
    removeAlert();
  }
  function removeAlert() {
    document.getElementsByTagName("body")[0].removeChild(alertBox);
    document.body.removeChild(mask);
  }
}

//customer confirm.
window.confirm = function(i,determin,txt) {
  var mask = document.body.addSeed(document.createElement('div'));
  mask.className = 'mask';
  var confirmBox = document.getElementsByTagName('body')[0].appendChild(document.createElement('div'));
  confirmBox.id = 'confirm-box';
  var boxTitle = confirmBox.appendChild(document.createElement('h1'));
  boxTitle.appendChild(document.createTextNode(alertTitle));
  var boxContent = confirmBox.appendChild(document.createElement('p'));
  boxContent.innerText = txt;
  var boxBtnOK = confirmBox.appendChild(document.createElement('input'));  
  boxBtnOK.type = 'button';
  boxBtnOK.value = alertBtnTxtOK;
  boxBtnOK.focus();
  boxBtnOK.onclick = function() {    
    if(determin=='buy'){
      confirmBuyOk(i);
    }else if(determin=='sell') {
      confirmSellOk(i);
    }
    
    removeConfirm();
  }
  var boxBtnCancel = confirmBox.appendChild(document.createElement('input'));
  boxBtnCancel.type = 'button';
  boxBtnCancel.value = alertBtnTxtCancel;
  boxBtnCancel.onclick = function() {    
    removeConfirm();
  }
  function removeConfirm() {
    document.getElementsByTagName("body")[0].removeChild(confirmBox);
    document.body.removeChild(mask);
  }
}



//get multiple class element
window.getClasses = function(styles) {  
  return document.getElementsByClassName(styles);
}

//get one id element
window.getId = function(id) {
  return document.getElementById(id);
}

//get multiple id element's array
window.getIds = function(ids) {
  return document.getElementsById(ids);
}

// var arr = ['Ebase','Egun'];
//Finding elements of multiple IDs
Document.prototype.getElementsById = function(arr) {

  var a =[];

  for(var i=0; i<arr.length; i++) {
    a.push(document.getElementById(arr[i]));
  }
  return a;

}




// body append Child
HTMLBodyElement.prototype.addSeed = function(element) {  
  this.appendChild(element);
  return element;

};

//get attribute
Element.prototype.getAttr = function(attr) {
  return this.getAttribute(attr);
};

//set attribute
Element.prototype.setAttr = function(key,val) {
  return this.setAttribute(key,val);
};

// append Childs
Element.prototype.addSeeds = function(arrElement) {
  var self = this;
  arrElement.forEach(function(seed){self.appendChild(seed)});
};

// append Child
Element.prototype.addSeed = function(element) {
  this.appendChild(element);
  return element;
};


// remove Childs
Element.prototype.delSeeds = function(arrElement) {
  var self = this;
  arrElement.forEach(function(seed){self.removeChild(seed)});
};

// remove Child
Element.prototype.delSeed = function(element) {
  this.removeChild(element);
  return this;
};

// remove class
Element.prototype.delClass = function(style) {
  this.classList.remove(style);
  return this;
};

//closure addClass chain
// function addClassChain() {  
//   var chain = {
//     addClass: Element.prototype.addClass,
//   };
//   return chain;
// }

// addClass direction self closure chian
Element.prototype.addClass = function(style) {
  // console.log(this); 
  // Element.prototype = Object.create(addClassChain());
  this.classList.add(style);   
  return this; 
};

// Element.prototype.addClass.prototype = Element.prototype.addClass;


// batch remove class
Array.prototype.batchDelClass = function(style) {
  this.forEach(function(v){v.classList.remove(style)});
  return this;
};

// batch add class
Array.prototype.batchAddClass = function(style) {
    this.forEach(function(v){v.classList.add(style)});
    return this;
};

//EX: document.getElementsById(['id1,id2']).arrSiblings().batchAddClass('style')
//EX: document.getElementsById(['id1,id2']).arrSiblings().batchDelClass('style')
Array.prototype.arrSiblings = function() {      
  var a=[],//definede array to push this's siblings element.
      p,n,
      oriArrLength;

      for(var i=0; i<this.length; i++) {
        p=this[i].previousSibling; //The "this" mean is Finding id、class or tagname multiple element's array.
        while(p) {
  
          if(this.indexOf(p)==-1) { //First check previous element not equal to this array's element.
            if(p.nodeType===1) {

              if(a.length>0) {
                if(a.indexOf(p)==-1) {//Second check previous element not equal to a's array elelment.
                  a.push(p);
                }

              }
              else{
                a.push(p); 
              } 

            }
          }


        p=p.previousSibling;//Final, assign the p's previous node to p.
      }
    }

    a.reverse()//Invert the order, so the order of the elements is in web's elements order.

    for(var i=0; i<this.length; i++) {
      n=this[i].nextSibling;
      while(n) {

        if(this.indexOf(n)==-1) { 
          if(n.nodeType===1) {

            if(a.length>0) {
              if(a.indexOf(n)==-1) {
                a.push(n); 
              }
            }
            else {
              a.push(n); 
            }
          }
        }

        n=n.nextSibling; 
      }
    }
  return a//Final, return in order's array.
}


//EX: document.getElementById('id').siblings().batchAddClass('style')
//EX: document.getElementById('id').siblings().batchDelClass('style')
Element.prototype.siblings = function() {
  var a=[],//definede array to push this's siblings element.
      p,n;


  p=this.previousSibling;  
  while(p){//If it has finding p's previous old brother element, continued execute below code.
    if(p.nodeType===1){ 
    a.push(p); 
    } 
    p=p.previousSibling//Final, assign the p's previous node to p.
  }

  a.reverse()//Invert the order, so the order of the elements is in web's elements order.

  n=this.nextSibling;
  while(n){//If it has finding p's next younger brother element, continued execute below code.
    if(n.nodeType===1){ 
      a.push(n); 
    } 
  n=n.nextSibling; 
  }

  return a//Final, return in order's array.
} 
// document.getElementById("id").siblings().forEach(function(v){v.classList.remove('style')});



importJS(['https://www.gstatic.com/firebasejs/4.13.0/firebase.js','./scripts/ChatEngine.js']);