
(function(chatroom){


	function closeIt() {
		memberRef.child(userId).remove();
	  // return "Any string value here forces a dialog box to \n" + 
	  //        "appear before closing the window.";
	}

	window.onbeforeunload = closeIt;



	// Initialize Firebase
	// TODO: Replace with your project's customized code snippet
	let config = {
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
		let nowTime = new Date(),
			nowYear = nowTime.getFullYear(),
			nowMouth = nowTime.getMonth()+1,
			nowDate = nowTime.getDate(),
			msgTime = `${nowYear}/${nowMouth}/${nowDate}`;

		let postMsg = {
			name: username,
			uid: uid,
			msg: msg,
			msgTime: msgTime,
			authorPic: picture
		};
		msgRef.push(postMsg);
	}

	
	let keyMap = {16: false, 13: false};
	let inputBoolean = false,
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

	





	ZekiCore.getId('toggle-btn').on('click', function() {
		toogleBtnBoolean = !toogleBtnBoolean;
		if(toogleBtnBoolean) {
			let ZekiCollection = ZekiCore.getId('member-list').getTag('ul');
			Array.from(ZekiCollection).forEach(ul => ul.lastKid.delClass('none-style'));
			ZekiCore.getId('toggle-btn').delClass('fa-caret-right');
			ZekiCore.getId('member-title').delClass('none-style');
			ZekiCore.getId('user-info').delClass('width7person');
			ZekiCore.getId('chat-wrap').delClass('width92person');

		}
		else{
			let ZekiCollection = ZekiCore.getId('member-list').getTag('ul');
			Array.from(ZekiCollection).forEach(ul => ul.lastKid.addClass('none-style'));
			ZekiCore.getId('toggle-btn').addClass('fa-caret-right');
			ZekiCore.getId('member-title').addClass('none-style');
			ZekiCore.getId('user-info').addClass('width7person');
			ZekiCore.getId('chat-wrap').addClass('width92person');
		}
	});

	ZekiCore.getId('chat-input').on('click', function() {
		if(inputBoolean == false) {
			ZekiCore.getId('chat-input').disabled = true;
			loginDialog();
			ZekiCore.getId('login-box').delClass('none-style');
			ZekiCore.getClass('mask')[0].delClass('none-style');
		}
	});

	ZekiCore.getId('close-button').on('click', function() {
		ZekiCore.getId('chat-input').disabled = false;
		ZekiCore.getId('login-box').addClass('none-style');
		ZekiCore.getClass('mask')[0].addClass('none-style');
	});




	chatroom.loginDialog = function() {
		ZekiCore.getId('guest-login').delClass('block-style').siblings().delClass('none-style');
	}

	chatroom.loginParamsDialog = function (loginMethod) {
		let webId =loginMethod.id+ '-login';
		switch (loginMethod.id) {
			case 'guest':
				// guestSignIn();
				ZekiCore.getIds(webId, 'close-button').addClass('block-style').siblings().addClass('none-style');				
				break;
			
			// case 'facebook':
			case 'google':
			case 'twitter':
			case 'github':
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

	// window.facebook = {
	// 	id: 'facebook',
	// 	type: 'facebook',
	// 	provider: new firebase.auth.FacebookAuthProvider()
	// }

	window.google = {
		id: 'google',
		type: 'google',
		provider: new firebase.auth.GoogleAuthProvider()
	}
	
	window.github = {
		id: 'github',
		type: 'github',
		provider: new firebase.auth.GithubAuthProvider()
	}

	chatroom.guestSignIn = function(loginMethod) {

		if(ZekiCore.getId('guest-username').value) {				
			ZekiCore.getId('login-box').addClass('none-style');
			ZekiCore.getClass('mask')[0].addClass('none-style');
			ZekiCore.getId('user-info').addClass('block-style');
			

			let uid = memberRef.push().key;
			
			userId = uid;//take time as guest's id.		
			userName = ZekiCore.getId('guest-username').value;	
			userType = loginMethod.type;
			writeUserData(userType, userId, userName, null, imageUrl, null);
			
			// ZekiCore.getId('member-list').addClass('block-style').innerHTML =`Welcome, ${userName}!`;
			ZekiCore.getId('chat-input').disabled = false;
			inputBoolean = true;

		}
		else {
			alert('您尚未輸入名子或暱稱');
		}
	    // [START authanon]
	    firebase.auth().signInAnonymously().catch(function(error) {



			// Handle Errors here.
			let errorCode = error.code;
			let errorMessage = error.message;
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

		let provider ='';

		switch (loginMethod.type) {
			// case 'facebook':
			// 	provider = loginMethod.provider;
			// 	provider.addScope('public_profile');
			// 	break;
			case 'google':
				provider = loginMethod.provider;
				provider.addScope('profile');
				provider.addScope('email');
				break;
			case 'twitter':
				provider = loginMethod.provider;
				break;
			case 'github':
				provider = loginMethod.provider;
				break;
			default:
				// statements_def
				break;
		}
		firebase.auth().useDeviceLanguage();
		
		firebase.auth().signInWithPopup(provider).then(function(result) {
			// let secret = result.credential.secret; //twiiter secret
			// console.log('twitter secret: '+secret);

			let token = result.credential.accessToken;
			let user = result.user;
			
			ZekiCore.getId('login-box').addClass('none-style');
			ZekiCore.getClass('mask')[0].addClass('none-style');
			ZekiCore.getId('user-info').addClass('block-style');
			userId = user.uid;
			imageUrl = user.photoURL;
			userName = user.displayName;
			userType = loginMethod.type;
			userEmail = user.email;
			writeUserData(userType, userId, userName, userEmail, imageUrl, null);					
			// ZekiCore.getId('member-list').addClass('block-style').innerHTML =`Welcome, ${userName}!`;
			ZekiCore.getId('chat-input').disabled = false;
			inputBoolean = true;

		}).catch(function(error) {

	          // Handle Errors here.
	          let errorCode = error.code;
	          let errorMessage = error.message;
	          // The email of the user's account used.
	          let email = error.email;
	          // The firebase.auth.AuthCredential type that was used.
	          let credential = error.credential;
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
			msg = ZekiCore.getId('chat-input').value;
			if(msg == '') {
				alert('您尚未輸入任何訊息!!')
			}else {
				writeNewMsg(userId, userName, imageUrl, msg);
				ZekiCore.getId('chat-input').value = '';
			}
			
			
		}

		if(e.keyCode in keyMap) {
			keyMap[e.keyCode] = true;
			// if(keyMap[16] && keyMap[13]) {
			// 	ZekiCore.getId('chat-input').value += '<br />';
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
	   let obj = snapshot.val();
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
			let chatUl = ZekiCore.makeTag('ul');
			let iconLi = ZekiCore.makeTag('li');

			let chatImgLi = ZekiCore.makeTag('li');
			chatImgLi.html = `<img src="${icon}" style="width: 50px; border-radius: 50px;">`;
			let chatNameLi = ZekiCore.makeTag('li');
			chatNameLi.text = name;		
			

			let chatMsgLi = ZekiCore.makeTag('li');
			chatMsgLi.text = msg;
			let timeLi = ZekiCore.makeTag('li');
			timeLi.text = msgTime;

			// let personName = document.createTextNode(name+': ')
			// let personSay = document.createTextNode(msg);
				iconLi.addKids(chatImgLi, chatNameLi);
				chatMsgLi.addKid(timeLi);
				chatUl.addKids(iconLi, chatMsgLi);
				// console.log(iconLi,chatMsgLi);
				chatMsgLi.className = 'animated white-space-pre';					
			ZekiCore.getId('chat-list').before(chatUl, ZekiCore.getId('chat-list').kidNodes[0]);
		// } ,1000);

	}

	// firebase.auth().onAuthStateChanged(function(user) {
	//     if (user) {
	    	// console.log('onAuthStateChanged: '+JSON.stringify(user, null ,2));    	
	memberRef.on('value', function(snapshot) {
		memberList = '';
		let obj = snapshot.val();
		// console.log('onValue: '+obj);
		if(obj) {
			Object.keys(obj).map(function(uid, item){
				// console.log(obj[uid].profile_picture, obj[uid].username);
				// displayChatMessage(obj[uid].name, obj[uid].msg, obj[uid].authorPic);
				memberList = `${memberList}<ul><li title ="${obj[uid].username}"><img src="${obj[uid].profile_picture}" style="width: 50px; border-radius: 50px;"></li><li>${obj[uid].username}</li></ul>`;
				if(toogleBtnBoolean == false) {
					let ZekiCollection = ZekiCore.getId('member-list').getTag('ul');
					Array.from(ZekiCollection).map(function(ul){ul.lastChild.delClass('none-style')});
				}
				ZekiCore.getId('member-list').html = memberList;
			});	
		}

	});

	//     }
	// });



	// function initApp() {
	//   window.fbAsyncInit = function() {
	//     FB.init({
	//       appId      : '453766181729978',
	//       xfbml      : true,
	//       version    : 'v2.12'
	//     });
	//     FB.AppEvents.logPageView();
	//   };

	//   (function(d, s, id){
	//      let js, fjs = d.getTag('webScript')[0];
	//      if (d.getElementById(id)) {return;}
	//      js = d.createElement(s); js.id = id;
	//      js.src = "https://connect.facebook.net/en_US/sdk.js";
	//      fjs.insertBefore(js, fjs.childNodes[0]);
	//    }(document, 'script', 'facebook-jssdk'));
	// }

	// window.onload = function() {
	// 	initApp();
	// };





})(Window.prototype)

