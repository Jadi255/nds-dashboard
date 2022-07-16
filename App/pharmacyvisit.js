var PharmacyName = document.getElementById('PharmacyName');

PharmacyName.addEventListener('input', async()=>{
    var Pharmacy = await axios({
        method: "GET",
        url: `https://api.baserow.io/api/database/rows/table/70305/?user_field_names=true&search=${PharmacyName.value}`,
        headers: {
        Authorization: token
    }
  })

  var Data = (Pharmacy.data.results);

  var Names = []
  for(i in Data){
    Names.push(Data[i])
  }

  var List = document.getElementById('List');
  List.innerHTML = "<select id='PharmacyNamesList' class='form-control'><option disabled selected>اختر</option></select>"

  var Area = document.getElementById('Area');

  for(i in Names){
    var option = document.createElement('option');
    option.value = Names[i].id;
    option.innerText = Names[i].pharmacyName + " - " + Names[i].Address[0].value;
    PharmacyNamesList.appendChild(option);
  }

  PharmacyNamesList.addEventListener('change', ()=>{
    for(i in Names){
      console.log(Names[i]);
      if(Names[i].id == PharmacyNamesList.value){
        Area.innerHTML = 
        `
        ${Names[i].pharmacyName}
        <hr>
        ${Names[i].Address[0].value + " - " + Names[i].Region[0].value.value}
        `
      }
    }
  })

})

async function SaveVisit(){
    var Rep = sessionStorage.getItem('User');
    var PharmacyName = document.getElementById('PharmacyNamesList').value;
    var Comments = document.getElementById('Comments').value;
    var LiveLocation = sessionStorage.getItem("ThisLocation");
  
  
    var SaveVisit = await axios({
        method: "POST",
        url: "https://api.baserow.io/api/database/rows/table/70308/?user_field_names=true",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        data: {
          "Rep": [
              Rep
          ],
          "Pharmacy Name": [
              PharmacyName
          ],
          "Comments": Comments,
          "Location": LiveLocation
        }
      })
    
      console.log(SaveVisit);
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