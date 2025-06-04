(async (chatroom) => {
  // Initialize HTML Content
  async function renderHTML(page) {
    const { template, script } = await zk.fetchTemplate(page);
    zk.one(`[slot="${page}"]`).html = template.innerHTML;
    script && zk.one(`[slot="${page}"]`).addKid(script);
  }
  const template = ["login", "chatroom"];
  for (const page of template) await renderHTML(page);

  // Removes the user on leaving.
  function closeIt() {
    memberRef.child(userId).remove();
  }
  window.onbeforeunload = closeIt;

  // Initialize Firebase
  let config = {
    apiKey: "AIzaSyAqmyPIr9TXfE7FYviyV8kSIrelcluNja8",
    authDomain: "zeki-base.firebaseapp.com",
    databaseURL: "https://zeki-base.firebaseio.com",
    storageBucket: "zeki-base.firebaseapp.com",
  };
  firebase.initializeApp(config);

  function writeUserData(userType, Id, name, email, imageUrl, msg) {
    firebase
      .database()
      .ref("/chatroom/users/" + Id)
      .set({
        userType: userType,
        userId: userId,
        username: name,
        email: email,
        profile_picture: imageUrl,
        msg: msg,
      });
  }

  function writeNewMsg(uid, username, picture, msg) {
    let nowTime = new Date(),
      nowYear = nowTime.getFullYear(),
      nowMouth = nowTime.getMonth() + 1,
      nowDate = nowTime.getDate(),
      msgTime = `${nowYear}/${nowMouth}/${nowDate}`;

    let postMsg = {
      name: username,
      uid: uid,
      msg: msg,
      msgTime: msgTime,
      authorPic: picture,
    };
    msgRef.push(postMsg);
  }

  let keyMap = { 16: false, 13: false };
  let inputBoolean = false,
    toogleBtnBoolean = true,
    imageUrl = "./img/guest-male.png",
    memberList = "",
    userName = "",
    userId = "",
    userEmail = "",
    // guestId = '',
    userType = "",
    msg = "",
    newPostKey = "",
    userRef = firebase.database().ref("/chatroom/users/" + userId),
    memberRef = firebase.database().ref("/chatroom/users/"),
    msgRef = firebase.database().ref("/chatroom/message/");

  const toggleBtnEl = ZekiCore.getId("toggle-btn"),
    memberListEl = ZekiCore.getId("member-list"),
    userInfoEl = ZekiCore.getId("user-info"),
    chatWrapEl = ZekiCore.getId("chat-wrap"),
    chatInputEl = ZekiCore.getId("chat-input"),
    loginBoxEl = ZekiCore.getId("login-box"),
    maskEl = ZekiCore.getClass("mask")[0],
    guestUsernameEl = ZekiCore.getId("guest-username"),
    chatListEl = ZekiCore.getId("chat-list");

  toggleBtnEl.on("click", () => {
    toogleBtnBoolean = !toogleBtnBoolean;
    if (toogleBtnBoolean) {
      let ZekiCollection = memberListEl.delClass("ai-center").getTag("ul");
      Array.from(ZekiCollection).forEach((ul) =>
        ul.lastKid.delClass("none-style")
      );
      toggleBtnEl.delClass("fa-caret-right");
      userInfoEl.delClass("width100px");
      chatWrapEl.delClass("width100person");
    } else {
      let ZekiCollection = memberListEl.addClass("ai-center").getTag("ul");
      Array.from(ZekiCollection).forEach((ul) =>
        ul.lastKid.addClass("none-style")
      );
      toggleBtnEl.addClass("fa-caret-right");
      userInfoEl.addClass("width100px");
      chatWrapEl.addClass("width100person");
    }
  });

  chatInputEl.on("click", () => {
    if (inputBoolean == false) {
      chatInputEl.disabled = true;
      loginDialog();
      loginBoxEl.delClass("none-style");
      maskEl.delClass("none-style");
    }
  });

  ZekiCore.getId("close-button").on("click", () => {
    chatInputEl.disabled = false;
    loginBoxEl.addClass("none-style");
    maskEl.addClass("none-style");
  });

  chatroom.loginDialog = function () {
    ZekiCore.getId("guest-login")
      .delClass("block-style")
      .siblings()
      .delClass("none-style");
  };

  chatroom.loginParamsDialog = function (loginMethod) {
    let webId = loginMethod.id + "-login";
    switch (loginMethod.id) {
      case "guest":
        // guestSignIn();
        ZekiCore.getIds(webId, "close-button")
          .addClass("block-style")
          .siblings()
          .addClass("none-style");
        break;

      // case 'facebook':
      case "google":
      case "yahoo":
      case "twitter":
      case "github":
        socialMediaSignIn(loginMethod);
        break;

      default:
        // statements_def
        break;
    }

    // loginMethod === guest
  };

  chatroom.gender = function (gender) {
    switch (gender) {
      case "Male":
        imageUrl = "./img/guest-male.png";
        break;
      case "Female":
        imageUrl = "./img/guest-female.png";
        break;
      default:
        // statements_def
        break;
    }
  };

  chatroom.guest = {
    id: "guest",
    type: "guest",
  };

  // chatroom.facebook = {
  // 	id: 'facebook',
  // 	type: 'facebook',
  // 	provider: new firebase.auth.FacebookAuthProvider()
  // }

  chatroom.google = {
    id: "google",
    type: "google",
    provider: new firebase.auth.GoogleAuthProvider(),
  };

  chatroom.github = {
    id: "github",
    type: "github",
    provider: new firebase.auth.GithubAuthProvider(),
  };

  chatroom.yahoo = {
    id: "yahoo",
    type: "yahoo",
    provider: new firebase.auth.OAuthProvider("yahoo.com"),
  };

  chatroom.guestSignIn = function (loginMethod) {
    if (guestUsernameEl.value) {
      loginBoxEl.addClass("none-style");
      maskEl.addClass("none-style");
      userInfoEl.addClass("block-style");

      let uid = memberRef.push().key;

      userId = uid; //take time as guest's id.
      userName = guestUsernameEl.value;
      userType = loginMethod.type;
      writeUserData(userType, userId, userName, null, imageUrl, null);

      // memberListEl.addClass('block-style').innerHTML =`Welcome, ${userName}!`;
      chatInputEl.disabled = false;
      inputBoolean = true;
    } else {
      alert("您尚未輸入名子或暱稱");
    }
    // [START authanon]
    firebase
      .auth()
      .signInAnonymously()
      .catch((error) => {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === "auth/operation-not-allowed") {
          alert("You must enable Anonymous auth in the Firebase Console.");
        } else {
          console.error(error);
        }
        // [END_EXCLUDE]
      });
    // [END authanon]
  };

  function socialMediaSignIn(loginMethod) {
    // if (!firebase.auth().currentUser) { //toggle signin
    //}
    //else {
    // firebase.auth().signOut();
    //}

    let provider = "";

    switch (loginMethod.type) {
      case "google":
        provider = loginMethod.provider;
        provider.addScope("profile");
        provider.addScope("email");
        break;
      case "yahoo":
      case "twitter":
      case "github":
        provider = loginMethod.provider;
        break;
      default:
        provider = loginMethod.provider;
        break;
    }
    firebase.auth().useDeviceLanguage();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        let token = result.credential.accessToken;
        let user = result.user;

        if (loginMethod.type === "yahoo") user = user.providerData.at(0);

        loginBoxEl.addClass("none-style");
        maskEl.addClass("none-style");
        userInfoEl.addClass("block-style");
        userId = user.uid;
        imageUrl = user.photoURL;
        userName = user.displayName;
        userType = loginMethod.type;
        userEmail = user.email;
        writeUserData(userType, userId, userName, userEmail, imageUrl, null);
        // memberListEl.addClass('block-style').innerHTML =`Welcome, ${userName}!`;
        chatInputEl.disabled = false;
        inputBoolean = true;
      })
      .catch((error) => {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        // The email of the user's account used.
        let email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        let credential = error.credential;
        // [START_EXCLUDE]
        if (errorCode === "auth/account-exists-with-different-credential") {
          alert(
            "You have already signed up with a different auth provider for that email."
          );
          // If you are using multiple auth providers on your app you should handle linking
          // the user's accounts here.
        } else {
          console.error(error);
        }
        // [END_EXCLUDE]
      });
  }

  ZekiCore.on("keydown", (e) => {
    // console.log('keycode'+e.keyCode);
    if (inputBoolean == true) {
      if (e.keyCode == 13 && keyMap[16] == false) {
        msg = chatInputEl.value;
        if (msg == "") {
          alert("您尚未輸入任何訊息!!");
        } else {
          writeNewMsg(userId, userName, imageUrl, msg);
          chatInputEl.value = "";
        }
      }

      if (e.keyCode in keyMap) {
        keyMap[e.keyCode] = true;
        // if(keyMap[16] && keyMap[13]) {
        // 	chatInputEl.value += '<br />';
        // }
      }
    }
  });

  ZekiCore.on("keyup", (e) => {
    if (e.keyCode in keyMap) {
      keyMap[e.keyCode] = false;
    }
  });

  msgRef.on("child_added", (snapshot) => {
    let obj = snapshot.val();
    displayChatMessage(obj.name, obj.msg, obj.authorPic, obj.msgTime);
  });

  function displayChatMessage(name, msg, icon, msgTime) {
    let chatUl = ZekiCore.makeTag("ul");
    let iconLi = ZekiCore.makeTag("li");

    let chatImgLi = ZekiCore.makeTag("li");
    chatImgLi.html = `<img src="${icon}" style="width: 50px; border-radius: 50px;">`;
    let chatNameLi = ZekiCore.makeTag("li");
    chatNameLi.text = name;

    let chatMsgLi = ZekiCore.makeTag("li");
    chatMsgLi.text = msg;
    let timeLi = ZekiCore.makeTag("li");
    timeLi.text = msgTime;

    iconLi.addKids(chatImgLi, chatNameLi);
    chatMsgLi.addKid(timeLi);
    chatUl.addKids(iconLi, chatMsgLi);
    chatMsgLi.className = "animated white-space-pre";
    chatListEl.before(chatUl, chatListEl.kidNodes[0]);
  }

  // firebase.auth().onAuthStateChanged(function(user) {
  //     if (user) {
  // console.log('onAuthStateChanged: '+JSON.stringify(user, null ,2));
  memberRef.on("value", (snapshot) => {
    memberList = "";
    let obj = snapshot.val();
    // console.log('onValue: '+obj);
    if (obj) {
      Object.keys(obj).forEach((uid, item) => {
        // console.log(obj[uid].profile_picture, obj[uid].username);
        // displayChatMessage(obj[uid].name, obj[uid].msg, obj[uid].authorPic);
        memberList = `${memberList}<ul><li title ="${obj[uid].username}"><img src="${obj[uid].profile_picture}" style="width: 50px; border-radius: 50px;"></li><li>${obj[uid].username}</li></ul>`;
        if (toogleBtnBoolean == false) {
          let ZekiCollection = memberListEl.getTag("ul");
          Array.from(ZekiCollection).forEach((ul) => {
            ul.lastKid.delClass("none-style");
          });
        }
        memberListEl.html = memberList;
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
})(Window.prototype);
