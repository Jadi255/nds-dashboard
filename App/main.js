//onload

async function GetProfile(){
    var Username = document.getElementById('Username');
    Username.innerText = sessionStorage.getItem('Name')
    var User = sessionStorage.getItem('User');
    
    var Data = await axios({
        method: "GET",
        url: `https://api.baserow.io/api/database/rows/table/70311/?user_field_names=true&filter__field_419489__link_row_has=${User}`,
        headers: {
        Authorization: token
        }
    })
    if(Data.data.count == 0){
        var Data = await axios({
            method: "GET",
            url: `https://api.baserow.io/api/database/rows/table/70311/?user_field_names=true&filter__field_419490__link_row_has=${User}`,
            headers: {
            Authorization: token
            }
        })    
    }

    var Data = (Data.data.results);
    console.log(Data)

    var string = ""
}


async function AreasSearch(){
    var SearchString = document.getElementById('AreasSearchText').value; 
    var doctor = document.getElementById('doctor');
    var pharmacy = document.getElementById('pharmacy');

    if(doctor.checked){
        var url = `https://api.baserow.io/api/database/rows/table/70304/?user_field_names=true&search=${SearchString}`
    }
    if(pharmacy.checked){
        var url = `https://api.baserow.io/api/database/rows/table/70305/?user_field_names=true&search=${SearchString}`
    }


    var Result = await axios({
        method: "GET",
        url: url,
        headers: {
          Authorization: token
        }
      })
      var Result = (Result.data.results);

      var Areas = document.getElementById('AreasAccordion');
      Areas.innerHTML = ''

      if(doctor.checked){

        InnerHTML = '';
        for(i in Result){
            var id = (Result[i].id)
            
            if(Result[i].Specialty == null){
                Specialty = "N/A"
            } else{
                Specialty = Result[i].Specialty.value;
            }

            if(Result[i].Classification == null){
                Classification = "N/A"
            } else{
                Classification = Result[i].Classification.value;
            }


            InnerHTML += 
            `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${Result[i].doctorName}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${Specialty}</h6>
                    <p class="card-text">
                    ${Result[i].Area[0].value}<br>
                        Classification: ${Classification}<br>
                    </p>

                    <button onclick="getHistory(this.id, 1)" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" id="${id}"> 
                        الزيارات
                    </button>
                </div>
            </div>

            `
        }
        Areas.innerHTML = InnerHTML;
      }

      if(pharmacy.checked){
        InnerHTML = '';

        for(i in Result){
            var id = (Result[i].id)
            console.log(Result[i]);


            InnerHTML += 
            `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${Result[i].pharmacyName}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${Result[i].Address[0].value}</h6>
                    <p class="card-text">
                        ${Result[i].Notes}
                    </p>
                    <button onclick="getHistory(this.id, 2)" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" id="${id}"> 
                        الزيارات
                    </button>
                </div>
            </div>

            `
        }

        Areas.innerHTML = InnerHTML;
        
      }

}


async function getHistory(id, target){
    var Title = document.getElementById('ModalTitle');
    var Table = document.getElementById('Table');


    if(target == 1){
        console.log("Doctor #", id)

        var Doctor = await axios({
                method: "GET",
                url: `https://api.baserow.io/api/database/rows/table/70304/${id}/?user_field_names=true`,
                headers: {
                Authorization: token
                }
          })

          var Doctor = (Doctor.data);
          console.log(Doctor.Visits);

          Title.innerHTML = Doctor.doctorName

          Visits = Doctor.Visits
          for(i in Visits){
            ThisVisit = await axios({
                    method: "GET",
                    url: `https://api.baserow.io/api/database/rows/table/70307/${Visits[i].id}/?user_field_names=true`,
                    headers: {
                    Authorization: token
                    }
                })
                ThisVisit = ThisVisit.data;
                console.log(ThisVisit);
                Table.innerHTML += 
                `
                <details class="accordion">
                    <summary class="card-title">${ThisVisit.Date.split('T')[0]}</summary>
                    <div style="directions:rtl">
                        تعليقات الزيارة: <br>${ThisVisit.Comments}<br><br>
                        العينات: <br>${ThisVisit.Samples[0].value}<br>
                        <hr>
                    </div>
                </details>
                <hr>
                `
        }

    } else if(target == 2){
        console.log("Pharmacy #", id)

        var Pharmacy = await axios({
            method: "GET",
            url: `https://api.baserow.io/api/database/rows/table/70305/${id}/?user_field_names=true`,
            headers: {
              Authorization: token
            }
          })

          Pharmacy = Pharmacy.data;

          console.log(Pharmacy);
          Title.innerHTML = Pharmacy.pharmacyName

          var Orders = Pharmacy.Orders;
          var Visits = Pharmacy.Visits;
          
          Table.innerHTML += `<h6>الطلبيات</h6><br>
          
          <table class="table" style="font-size:10px">
            <thead>
                <tr>
                    <td>التاريخ</td>
                    <td>الصنف</td>
                    <td>عدد</td>
                    <td>بونص</td>
                </tr>
            </thead>
            <tbody id="InnerTable">

            </tbody>
          </table>
          <hr>
          `


          var InnerTable = document.getElementById('InnerTable');
          for(i in Orders){
            console.log(Orders[i].id);

            var ThisOrder = await axios({
                method: "GET",
                url: `https://api.baserow.io/api/database/rows/table/70310/${Orders[i].id}/?user_field_names=true`,
                headers: {
                  Authorization: token
                }
              })

              console.log(ThisOrder.data);
              ThisOrder = ThisOrder.data;

              InnerTable.innerHTML += 

              `
                    <tr>
                        <td>${ThisOrder.Date}</td>
                        <td>${ThisOrder.Product[0].value}</td>
                        <td>${ThisOrder.NoPcs}</td>
                        <td>${ThisOrder.Bonus}</td>
                    </tr>

              `
              
          }


          Table.innerHTML += `<h6>الزيارات</h6><br>`
          for(i in Visits){
            console.log(Visits[i]);
            var ThisVisit = await axios({
                method: "GET",
                url: `https://api.baserow.io/api/database/rows/table/70308/${Visits[i].id}/?user_field_names=true`,
                headers: {
                  Authorization: token
                }
              })

              ThisVisit = ThisVisit.data;

              Table.innerHTML += 
              `
              <details class="accordion">
                  <summary class="card-title">${ThisVisit.visitNo.split('T')[0]}</summary>
                  <div style="directions:rtl">
                      تعليقات الزيارة: <br>${ThisVisit.Comments}<br><br>
                      <hr>
                  </div>
              </details>
              `

          }

    }
}

function Clear(){
    var Title = document.getElementById('ModalTitle');
    var Table = document.getElementById('Table');

    Title.innerHTML = ""
    Table.innerHTML = ""
}