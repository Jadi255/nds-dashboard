
var PharmacyName = document.getElementById('PharmacyName');

var Products = document.getElementById('Products');
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
    Products./nds-dashboard/AppendChild(option);
  }
}

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
    PharmacyNamesList./nds-dashboard/AppendChild(option);
  }

  PharmacyNamesList.addEventListener('change', ()=>{
    var Target = (PharmacyNamesList.value);

    for(i in Names){
      console.log(Names[i]);
      if(Names[i].id == PharmacyNamesList.value){
        Area.innerText = Names[i].Address[0].value + " - " + Names[i].Region[0].value.value;
      }
    }
  })

})

Products.addEventListener('change', async()=>{
  console.log(Products.value);
  var ThisProduct = await axios({
      method: "GET",
      url: `https://api.baserow.io/api/database/rows/table/70306/${Products.value}/?user_field_names=true`,
      headers: {
      Authorization: token
    }
  })

  document.getElementById('Count').addEventListener('input',()=>{
    parseFloat(document.getElementById('TotalPrice').innerText = "JOD " + ThisProduct.data.costPriceVat * document.getElementById('Count').value);

  })

  
})

async function SubmitOrder(){
  var Rep = sessionStorage.getItem("User");
  var OrderDate = document.getElementById('Date').value
  var PharmacyName = document.getElementById('PharmacyNamesList').value;
  var Product = document.getElementById('Products').value;
  var Count = document.getElementById('Count').value;
  var Bonus = document.getElementById('Bonus').value;
  var Payment = document.getElementById('Payment').value;
  var Remarks = document.getElementById('Remarks').value;

  console.log(token);
  OrderDate = new Date(OrderDate).toISOString().split("T")[0];
  console.log(Rep, OrderDate, PharmacyName, Product, Count, Bonus, Payment, Remarks);

  
var Order = await axios({
  method: "POST",
  url: "https://api.baserow.io/api/database/rows/table/70310/?user_field_names=true",
  headers: {
    Authorization: token,
    "Content-Type": "/nds-dashboard/Application/json"
  },
  data: {
    "Date": OrderDate,
    "Rep": [
        Rep
    ],
    "PharmacyName": [
        PharmacyName
    ],
    "Product": [
        Product
    ],
    "NoPcs": Count,
    "Bonus": Bonus,
    "PaymentTerm": Payment,
    "Remarks": Remarks,
    "OrderDispatched": false
  }
})

    console.log(Order);
    if(Order){
      alert('تم الحفظ بنجاح')
      Product, Count, Bonus = ""
    }
    
}