
(function(chatroom){


	function closeIt() {
		memberRef.child(userId).remove();
	  // return "Any string value here forces a dialog box to \n" + 
	  //        "appear before closing the window.";
	}

	window.onbeforeunload = closeIt;



	// Initialize Firebase
	// TODO: Replace with your project's customized code snippet
	var config = {
		apiKey: "AIzaSyAqmyPIr9TXfE7FYviyV8kSIrelcluNja8",
		authDomain: "zeki-base.firebaseapp.com",
		databaseURL: "https://zeki-base.firebaseio.com",
		storageBucket: "zeki-base.firebaseapp.com",
	};
	firebase.initializeApp(config);




	function writeUserData(userType, Id, name, email, imageUrl, msg) {

		firebase.database().ref('/chatroom/users/' + Id).set({
			userType: userType,
			userId: userId,
			username: name,
			email: email,
			profile_picture : imageUrl,
			msg: msg
		});
	}



	function writeNewMsg(uid, username, picture, msg) {
		var nowTime = new Date(),
			nowYear = nowTime.getFullYear(),
			nowMouth = nowTime.getMonth()+1,
			nowDate = nowTime.getDate();
			msgTime = `${nowYear}/${nowMouth}/${nowDate}`;

		var postMsg = {
			name: username,
			uid: uid,
			msg: msg,
			msgTime: msgTime,
			authorPic: picture
		};
		msgRef.push(postMsg);
	}

	
	var keyMap = {16: false, 13: false};
	var inputBoolean = false,
		toogleBtnBoolean = true,
		imageUrl = './img/guest-male.png',
		memberList = '',
		userName = '',
		userId = '',
		userEmail = '',
		// guestId = '',
		userType = '',
		msg = '',
		newPostKey = '',
		userRef = firebase.database().ref('/chatroom/users/' + userId),
		memberRef = firebase.database().ref('/chatroom/users/'),
		msgRef = firebase.database().ref('/chatroom/message/');

	





	getId('toggle-btn').onclick = function() {
		toogleBtnBoolean = !toogleBtnBoolean;
		if(toogleBtnBoolean) {
			var htmlCollection = getId('member-list').getElementsByTagName('ul')
			var arr = [].slice.call(htmlCollection);
			arr.map(function(ul){ul.lastChild.delClass('none-style')});
			this.delClass('fa-caret-right');
			getId('member-title').delClass('none-style');
			getId('user-info').delClass('width7person');
			getId('chat-wrap').delClass('width92person');

		}
		else{
			var htmlCollection = getId('member-list').getElementsByTagName('ul')
			var arr = [].slice.call(htmlCollection);
			arr.map(function(ul){ul.lastChild.addClass('none-style')});
			this.addClass('fa-caret-right');
			getId('member-title').addClass('none-style');
			getId('user-info').addClass('width7person');
			getId('chat-wrap').addClass('width92person');
		}
		


	}

	getId('chat-input').onclick = function() {
		if(inputBoolean == false) {
			getId('chat-input').disabled = true;
			loginDialog();
			getId('login-box').delClass('none-style');
			getClasses('mask')[0].delClass('none-style');
		}
		
	}

	getId('close-button').onclick =function() {
		getId('chat-input').disabled = false;
		getId('login-box').addClass('none-style');
		getClasses('mask')[0].addClass('none-style');
	}




	chatroom.loginDialog = function() {
		getId('guest-login').delClass('block-style').siblings().batchDelClass('none-style');
	}

	chatroom.loginParamsDialog = function (loginMethod) {
		var webId =loginMethod.id+ '-login';
		switch (loginMethod.id) {
			case 'guest':
				// guestSignIn();	 			
				getIds([webId,'close-button']).batchAddClass('block-style').arrSiblings().batchAddClass('none-style');				
				break;
			
			case 'facebook':
			case 'google':
			case 'twitter':
				socialMediaSignIn(loginMethod);				
				break;			
			
			default:
				// statements_def
				break;
		}

		// loginMethod === guest
	}


	chatroom.gender = function(gender) {
		switch (gender) {
			case 'Male':
				imageUrl = './img/guest-male.png';
				break;
			case 'Female':
				imageUrl = './img/guest-female.png';
				break;
			default:
				// statements_def
				break;
		}
	}


	window.guest = {
		id: 'guest',
		type: 'guest'
	}

	window.facebook = {
		id: 'facebook',
		type: 'facebook',
		provider: new firebase.auth.FacebookAuthProvider()
	}

	window.google = {
		id: 'google',
		type: 'google',
		provider: new firebase.auth.GoogleAuthProvider()
	}

	window.twitter = {
		id: 'twitter',
		type: 'twitter',
		provider: new firebase.auth.TwitterAuthProvider()
	}


	chatroom.guestSignIn = function(loginMethod) {

		if(getId('guest-username').value) {				
			getId('login-box').addClass('none-style');
			getClasses('mask')[0].addClass('none-style');
			getId('user-info').addClass('block-style');
			

			var uid = memberRef.push().key;
			
			userId = uid;//take time as guest's id.		
			userName = getId('guest-username').value;	
			userType = loginMethod.type;
			writeUserData(userType, userId, userName, null, imageUrl, null);
			
			// getId('member-list').addClass('block-style').innerHTML =`Welcome, ${userName}!`;
			getId('chat-input').disabled = false;
			inputBoolean = true;

		}
		else {
			alert('您尚未輸入名子或暱稱');
		}
	    // [START authanon]
	    firebase.auth().signInAnonymously().catch(function(error) {



			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// [START_EXCLUDE]
			if (errorCode === 'auth/operation-not-allowed') {
			alert('You must enable Anonymous auth in the Firebase Console.');
			} else {
			console.error(error);
			}
			// [END_EXCLUDE]
	    });
	    // [END authanon]

	}


	function socialMediaSignIn(loginMethod) {
	// if (!firebase.auth().currentUser) { //toggle signin
	//}
	//else {		
		// firebase.auth().signOut();
	//}

		var provider ='';

		switch (loginMethod.type) {
			case 'facebook':
				provider = loginMethod.provider;
				provider.addScope('public_profile');
				break;
			case 'google':
				provider = loginMethod.provider;
				provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
				break;
			case 'twitter':
				provider = loginMethod.provider;
				break;
			default:
				// statements_def
				break;
		}
		firebase.auth().useDeviceLanguage();
		
		firebase.auth().signInWithPopup(provider).then(function(result) {
			// var secret = result.credential.secret; //twiiter secret
			// console.log('twitter secret: '+secret);

			var token = result.credential.accessToken;
			var user = result.user;
			
			getId('login-box').addClass('none-style');
			getClasses('mask')[0].addClass('none-style');
			getId('user-info').addClass('block-style');
			userId = user.uid;
			imageUrl = user.photoURL;
			userName = user.displayName;
			userType = loginMethod.type;
			userEmail = user.email;
			writeUserData(userType, userId, userName, userEmail, imageUrl, null);					
			// getId('member-list').addClass('block-style').innerHTML =`Welcome, ${userName}!`;
			getId('chat-input').disabled = false;
			inputBoolean = true;

		}).catch(function(error) {

	          // Handle Errors here.
	          var errorCode = error.code;
	          var errorMessage = error.message;
	          // The email of the user's account used.
	          var email = error.email;
	          // The firebase.auth.AuthCredential type that was used.
	          var credential = error.credential;
	          // [START_EXCLUDE]
	          if (errorCode === 'auth/account-exists-with-different-credential') {
	            alert('You have already signed up with a different auth provider for that email.');
	            // If you are using multiple auth providers on your app you should handle linking
	            // the user's accounts here.
	          } else {
	            console.error(error);
	          }
	          // [END_EXCLUDE]
	        });
	}


	document.addEventListener('keydown', function(e) {
		// console.log('keycode'+e.keyCode);
	if(inputBoolean == true) {
		if(e.keyCode==13 && keyMap[16] == false) {			
			msg = getId('chat-input').value;
			if(msg == '') {
				alert('您尚未輸入任何訊息!!')
			}else {
				writeNewMsg(userId, userName, imageUrl, msg);
				getId('chat-input').value = '';
			}
			
			
		}

		if(e.keyCode in keyMap) {
			keyMap[e.keyCode] = true;
			// if(keyMap[16] && keyMap[13]) {
			// 	getId('chat-input').value += '<br />';
			// }
		}
	}


	});
	document.addEventListener('keyup', function(e) {
		if(e.keyCode in keyMap) {
			keyMap[e.keyCode] = false;
		}
	});



	msgRef.on('child_added', function(snapshot) {
	   var obj = snapshot.val();
	   // console.log(userId);
	   // switch (userType) {
	   	// case 'guest':
			// if (guestId) {
			// 	console.log(obj);
			// 	Object.keys(obj).map(function(uid, item){
			// 		console.log(obj[uid].name, obj[uid].msg, obj[uid].authorPic);
			// 		displayChatMessage(obj[uid].name, obj[uid].msg, obj[uid].authorPic);
			// 	});	
			// 	// console.log(obj[guestId].name);	
			// 	// 
			// }
			// else {
			// 	console.log('您尚未登入!');	
			// }
	  //  		break;
	  //  	case 'facebook':
			// if (userId) {
			// 	console.log(obj);	
			// 	// console.log(obj[userId].name);	
			// 	// displayChatMessage(obj[userId].name, obj[userId].msg, obj[userId].authorPic);
			// }
			// else {
			// 	console.log('您尚未登入!');	
			// }
	  //  		break;
	  //  	default:
	  //  		// statements_def
	  //  		break;
	  // }




	   // console.log(obj.name, obj.msg, obj.profile_picture);
	   displayChatMessage(obj.name, obj.msg, obj.authorPic, obj.msgTime);

	});




	function displayChatMessage(name, msg, icon, msgTime) {
		// setTimeout(function() {
			var chatUl = document.createElement('ul');
			var iconLi = document.createElement('li');

			var chatImgLi = document.createElement('li');
			chatImgLi.innerHTML = `<img src="${icon}" style="width: 50px; border-radius: 50px;">`;
			var chatNameLi = document.createElement('li');
			chatNameLi.innerText = name;		
			

			var chatMsgLi = document.createElement('li');
			chatMsgLi.innerText = msg;
			var timeLi = document.createElement('li');
			timeLi.innerText = msgTime;

			// var personName = document.createTextNode(name+': ')
			// var personSay = document.createTextNode(msg);
				iconLi.addSeeds([chatImgLi,chatNameLi]);
				chatMsgLi.addSeed(timeLi);
				chatUl.addSeeds([iconLi,chatMsgLi]);
				// console.log(iconLi,chatMsgLi);
				chatMsgLi.className = 'animated white-space-pre';					
			getId('chat-list').insertBefore(chatUl, getId('chat-list').childNodes[0]);
		// } ,1000);

	}

	// firebase.auth().onAuthStateChanged(function(user) {
	//     if (user) {
	    	// console.log('onAuthStateChanged: '+JSON.stringify(user, null ,2));    	
	memberRef.on('value', function(snapshot) {
		memberList = '';
		var obj = snapshot.val();
		// console.log('onValue: '+obj);
		if(obj) {
			Object.keys(obj).map(function(uid, item){
				// console.log(obj[uid].profile_picture, obj[uid].username);
				// displayChatMessage(obj[uid].name, obj[uid].msg, obj[uid].authorPic);
				memberList = `${memberList}<ul><li title ="${obj[uid].username}"><img src="${obj[uid].profile_picture}" style="width: 50px; border-radius: 50px;"></li><li>${obj[uid].username}</li></ul>`;
				if(toogleBtnBoolean == false) {
					var htmlCollection = getId('member-list').getElementsByTagName('ul')
					var arr = [].slice.call(htmlCollection);
					arr.map(function(ul){ul.lastChild.delClass('none-style')});
				}
				getId('member-list').innerHTML = memberList;
			});	
		}

	});

	//     }
	// });



	function initApp() {
	  window.fbAsyncInit = function() {
	    FB.init({
	      appId      : '453766181729978',
	      xfbml      : true,
	      version    : 'v2.12'
	    });
	    FB.AppEvents.logPageView();
	  };

	  (function(d, s, id){
	     var js, fjs = d.getElementsByTagName('webScript')[0];
	     if (d.getElementById(id)) {return;}
	     js = d.createElement(s); js.id = id;
	     js.src = "https://connect.facebook.net/en_US/sdk.js";
	     fjs.insertBefore(js, fjs.childNodes[0]);
	   }(document, 'script', 'facebook-jssdk'));
	}

	window.onload = function() {
		initApp();
	};





})(Window.prototype)

