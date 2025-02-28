

function loginWithKakao() {
    Kakao.Auth.authorize({
       prompt: 'select_account',
       redirectUri: 'http://secretm-yummy.com:3000/login/',
    });
  }

  window.onload = function(){
    
      Kakao.init('4a2a51c4104deceb54f805eb34bc4f3d'); // 사용하려는 앱의 JavaScript 키 입력

      const param_code = GetLoginCode();
      if(!!param_code){
          KaKaoLogin(param_code);
      }else{
          GetKakoUserInfoByAccessToken();
      }
  }

  function GetLoginCode(){
      const parm = new URLSearchParams(window.location.search);
      const code = parm.get('code');
      return code;
  }

  async function KaKaoLogin(code){
      const response = await fetch('/auth/kakao/callback',
                                  {
                                      method:'POST',
                                      headers:{'Content-Type':'application/json'},
                                      body:JSON.stringify({code:code}),
                                      credentials: 'include' // 쿠키 설정을 하기 위함
                                  });

      const tokens = await response.json();

      if(!!tokens){
          const access_token = tokens.kakao_access_token;
          const userinfo = tokens.kakao_payload;
//                
          if(!!access_token){
              removeCodeFormUrl();
              Kakao.Auth.setAccessToken(access_token);
              //localStorage.setItem('accessToken', access_token);
              document.getElementById("login-container").style.display = 'none';
              document.getElementById("profile-image").src = userinfo.picture;
              document.getElementById("nickname").innerText = userinfo.nickname +"님 안녕하세요";
              document.getElementById("success-container").style.display = 'block';
          }
      }else{
          alert('로그인 실패 다시 시도해주세요');
      }
  }

  //error 확인
  //서비스 함수 호출해서 쿠키 날려줘야 한다.
  async function KaKaoLogout(){
      Kakao.Auth.logout().then(function(response){
          
          if(!Kakao.Auth.getAccessToken()){
              alert('로그아웃 되었습니다.');
              document.getElementById("success-container").style.display = 'none';
              document.getElementById("nickname").innerText ="";
              document.getElementById("profile-image").src = "";
              document.getElementById("login-container").style.display = 'block';
          }
      })
      .catch(function(err){
          console.log('exception'+err);
          alert('로그아웃 실패하였습니다.');
      });
   }

  function IsKakaoToken(){
      const access_token = Kakao.Auth.getAccessToken();
      //const l_accessToken = localStorage.getItem('accessToken');

      // if(!!access_token || !!l_accessToken) {
      //     if(access_token === null && !!l_accessToken){
      //         Kakao.Auth.setAccessToken(l_accessToken);
      //     }else if(!!access_token && l_accessToken === null){
      //         localStorage.setItem('accessToken', access_token);
      //     }

      //     return true;
      // }
      if(!!access_token) return true;
      else return false;
  }

  async function GetKakoUserInfoByAccessToken()
  {
      let access_token = Kakao.Auth.getAccessToken();
      //let l_accessToken = localStorage.getItem('accessToken');
      
    //   if(access_token === null && !!l_accessToken){
    //       Kakao.Auth.setAccessToken(l_accessToken);
    //       access_token = l_accessToken;
    //   }else if(!!access_token && l_accessToken === null){
    //       localStorage.setItem('accessToken', access_token);
    //       l_accessToken = access_token;

    //   }

      //if(!!access_token){
          const url ='/auth/kakao/userinfo';
          const response = await fetch(url,
                                      {
                                          method:'POST',
                                          headers:{'Content-Type':'application/json'},
                                          body:JSON.stringify({access_token:access_token}),
                                          credentials: 'include'
                                      });

          const token_data = await response.json();     
          const new_access_token = token_data.kakao_access_token;
          const userinfo = token_data.kakao_payload;    

          if(new_access_token){
              Kakao.Auth.setAccessToken(new_access_token);  
             //localStorage.setItem('accessToken', new_access_token);
          }
                                               
          //console.log(token_data);
          if(!!userinfo){
              document.getElementById("login-container").style.display = 'none';
              document.getElementById("profile-image").src = userinfo.picture;
              document.getElementById("nickname").innerText = userinfo.nickname +" 님 안녕하세요";
              document.getElementById("success-container").style.display = 'block';
          }
      //}
  }

  function removeCodeFormUrl(){
      const url = new URL(window.location.href);
      if(url.searchParams.has('code')){
          url.searchParams.delete('code');
          window.history.replaceState({}, document.title, url.pathname + url.search);
      }
  }