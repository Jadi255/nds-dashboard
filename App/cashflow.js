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
    console.log(1)
    var Target = (PharmacyNamesList.value);
    console.log(Target);
    for(i in Names){
      console.log(Names[i]);
      if(Names[i].id == PharmacyNamesList.value){
        Area.innerText = Names[i].Address[0].value + " - " + Names[i].Region[0].value.value;
      }
    }
  })

})


async function Save(){
  var PharmacyName = document.getElementById('PharmacyNamesList').value;
    var Rep = sessionStorage.getItem('User');
    var RefDate = document.getElementById('Date').value;
    var Amount = document.getElementById('Amount').value;
    var Reference = document.getElementById('Reference').value;
    var Type = document.getElementById('Type').value;
    var ChequeNo = document.getElementById('ChequeNo').value;
    

    console.log(PharmacyName, Rep, RefDate, Amount, Reference, Type, ChequeNo);

    RefDate = new Date(RefDate).toISOString().split("T")[0];

    var Post = await axios({
            method: "POST",
            url: "https://api.baserow.io/api/database/rows/table/70309/?user_field_names=true",
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
            "Amount": Amount,
            "Reference": Reference,
            "Type": Type,
            "ChequeNo": ChequeNo,
            "Date": RefDate
            }
        })

        if((Post.status) === 200){
          alert('تم الحفظ بنجاح');
          window.location.replace('main.html')
        };
}
