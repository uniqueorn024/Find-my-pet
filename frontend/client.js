
async function auth(){
  const resp = await fetch('/auth_user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await resp.json();
  console.log("resp: ", data);

  if(data.status == "OK"){
    document.getElementById("sign-up-link").style.display = "none";
    document.getElementById("login-link").style.display = "none";
    document.getElementById("greeting").style.display = "block";
    document.getElementById("user-name").innerText = data.user;
  }else{
    console.log(data.message);
  }
}
window.addEventListener("load", (event) => {
    
    console.log("loaded");
    auth();

    const signupBtn = document.getElementById('sign-up');
    const loginBtn = document.getElementById('login');
    signupBtn.addEventListener('click', async function (){
      event.preventDefault();

      const field_data={
        email: document.getElementById('SUemail').value,
        full_name: document.getElementById('SUfull-name').value,
        password: document.getElementById('SUpassword').value,
        phone_number: document.getElementById('SUphone-num').value,
      }
      
      //TODO: validate data before sending to server

      document.getElementById('SUemail').value = "";
      document.getElementById('SUfull-name').value = "";
      document.getElementById('SUpassword').value = "";
      document.getElementById('SUphone-num').value = "";
      //if no errors found - close the modal 
      document.getElementById("sign-up-m-content").setAttribute("data-dismiss","modal");

      const resp = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(field_data)
      });
      const data = await resp.json();
      console.log("resp: ", data);
      if(data.status == "OK"){
        auth();
      }
      
    });


    loginBtn.addEventListener('click', async function (){
      event.preventDefault();
      const field_data={
        email: document.getElementById('LIemail').value,
        password: document.getElementById('LIpassword').value,
      }
      
      //TODO: validate data before sending to server

      document.getElementById('LIemail').value = "";
      document.getElementById('LIpassword').value = "";
      //if no errors found - close the modal 
      document.getElementById("login-m-content").setAttribute("data-dismiss","modal");

      const resp = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(field_data)
      });
      const data = await resp.json();
      console.log("resp: ", data);
      if(data.status == "OK"){
        auth();
      }
    });

});
