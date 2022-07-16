const token = 'Token ohB8cluxzGakc0RwY65aLDcaP4BQed3m';

async function authenticate(){
    var Email = document.getElementById('Email').value;
    var InputPassword = document.getElementById('Password').value;
    var User = await axios({
            method: "GET",
            url: `https://api.baserow.io/api/database/rows/table/70302/?user_field_names=true&search=${Email}`,
            headers: {
            Authorization: token
            }
        })
      var Password = (User.data.results[0].Password);
      if(Password == InputPassword){
          console.log(User.data.results[0].Status.value)
          sessionStorage.setItem("access", true);
          sessionStorage.setItem('User', User.data.results[0].id);
          sessionStorage.setItem('Name', User.data.results[0].Name);
          sessionStorage.setItem('Status', User.data.results[0].Status.value);
          window.location.replace('/nds-dashboard/App/main.html');
      } else{
          alert("الرجاء التأكد من صحة المعلومات المدخلة")
      }
}

function checkauth(){
    var access = sessionStorage.getItem("access");
    console.log(access);
    if(access == null){
        window.location.replace('../index.html')
    }
}

function logout(){
    sessionStorage.removeItem('access');
    window.location.reload();
}