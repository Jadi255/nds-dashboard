var DoctorName = document.getElementById('DoctorName');

var Samples = document.getElementById('Samples');
async function getProducts(){
    var ProductsList = await axios({
      method: "GET",
      url: "https://api.baserow.io/api/database/rows/table/70306/?user_field_names=true",
      headers: {
      Authorization: token
    }
  })
  console.log(ProductsList.data.results);
  var ProductNames = ProductsList.data.results

  for(i in ProductNames){
    var option = document.createElement('option');
    option.value = ProductNames[i].id;
    option.innerText = ProductNames[i].Name
    Samples./nds-dashboard/AppendChild(option);
  }
}



DoctorName.addEventListener('input', async()=>{
    var Name = await axios({
        method: "GET",
        url: `https://api.baserow.io/api/database/rows/table/70304/?user_field_names=true&search=${DoctorName.value}`,
        headers: {
          Authorization: token
        }
      })

    var Data = Name.data.results;
    var Names = []
    for(i in Data){
      console.log(Data[i]);
      Names.push(Data[i])
    }
    
    var List = document.getElementById('List');
    List.innerHTML = "<select id='DoctorNamesList' class='form-control'><option disabled selected>اختر</option></select>"
  

    for(i in Names){
      var option = document.createElement('option');
      option.value = Names[i].id;
      option.innerText = Names[i].doctorName + " - " + Names[i].Area[0].value;
      DoctorNamesList./nds-dashboard/AppendChild(option);
    }

    var Info = document.getElementById('Info');
    DoctorNamesList.addEventListener('change', ()=>{
        for(i in Names){
          if(Names[i].Specialty == null){
            Names[i].Specialty = "N/A"
          }
          if(Names[i].Classification == null){
            Names[i].Classification = "N/A"
          }
          console.log(Names[i]);
          if(Names[i].id == DoctorNamesList.value){
            Info.innerHTML = 
            `
            ${Names[i].doctorName}<hr>
            ${Names[i].Specialty.value} - ${Names[i].Area[0].value} <br>
            التصنيف: ${Names[i].Classification.value}
            `
          }
        }
      })
})


async function Save(){
  var Rep = sessionStorage.getItem('User');
  var DoctorName = document.getElementById('DoctorNamesList').value;
  var Comments = document.getElementById('Comments').value;
  var LiveLocation = sessionStorage.getItem("ThisLocation");
  var Samples = document.getElementById('Samples').value;

  console.log(Rep, DoctorName, Comments, LiveLocation);



  var SaveVisit = axios({
      method: "POST",
      url: "https://api.baserow.io/api/database/rows/table/70307/?user_field_names=true",
      headers: {
        Authorization: token,
        "Content-Type": "/nds-dashboard/Application/json"
      },
      data: {
        "Rep": [
            Rep
        ],
        "DrName": [
            DoctorName
        ],
        "Comments": Comments,
        "Samples": [
            parseInt(Samples)
        ],
        "Location": LiveLocation
      }
    })
    alert('تم حفظ الزيارة بنجاح');
    window.location.reload();
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  var ThisLocation = `https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`
  sessionStorage.setItem("ThisLocation", ThisLocation)
}