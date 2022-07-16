var User = sessionStorage.getItem('User');

async function GetOrders(){
  var xyValues = []

    var Orders = await axios({
        method: "GET",
        url: `https://api.baserow.io/api/database/rows/table/70310/?user_field_names=true&order_by=Date&filter__field_419474__link_row_has=${User}`,
        headers: {
          Authorization: token
        }
      })
      
      Orders = (Orders.data.results);

      var Dates = [];
      var Customers = []

      for(i in Orders){
        Dates.push(Orders[i].Date);
      }

      for(i in Orders){
        console.log(Orders[i]);
        Customers.push(Orders[i].PharmacyName[0].value);
      }

      Customers = [...new Set(Customers)];
      Dates = [...new Set(Dates)];

      OrdersObject = []

      for(i in Dates){
        var Obj = new Object();
        Obj.Date = Dates[i];
        OrdersObject.push(Obj);
        Obj.Orders = {};
      }

      for(i in Orders){
        OrderDate = Orders[i].Date 

        for(j in OrdersObject){
          if(OrdersObject[j].Date === OrderDate){
            ThisOrder = Orders[i];

            for(k in Customers){
              if(Customers[k] === ThisOrder.PharmacyName[0].value){
                if(!OrdersObject[j].Orders.hasOwnProperty(Customers[k])){
                  var arr = new Array()
                  OrdersObject[j].Orders[Customers[k]] = arr;
                  CustomerOrder = OrdersObject[j].Orders[Customers[k]] 
                  CustomerOrder.push(Orders[i]);                
                } else if(OrdersObject[j].Orders.hasOwnProperty(Customers[k])){
                  CustomerOrder = OrdersObject[j].Orders[Customers[k]] 
                  CustomerOrder.push(Orders[i]);
                }
              }
            }
          }
        }
      }

      var Target = document.getElementById('Target');
      var Div = ""
      for(i in OrdersObject){
        var Div = 
        `
          <details class="card">
            <summary class="card-header"> ${OrdersObject[i].Date} </summary>
        `
        var Customers = (Object.keys(OrdersObject[i].Orders));
        for(j in Customers){
          Div += 
          `
                <details class="card-body">
                  <summary>
                  ${Customers[j]} <br> <small> ${OrdersObject[i].Orders[Customers[j]][0].Address[0].value} - ${OrdersObject[i].Orders[Customers[j]][0].Region[0].value.value}</small>
                  </summary>
                  ${OrdersObject[i].Orders[Customers[j]][0].PaymentTerm.value}
          `
          Div += `<br><br>`
          Div += 
          `
          <table class="table table-responsive" style="font-size: 10px">
            <thead>
              <tr>
              <small>
                <td>الصنف</td>
                <td> عدد  </td>
                <td> بونص</td>
                <td> ملاحظات</td>
              </tr>
              </small>
            </thead>
          `
          var ThisOrder = (OrdersObject[i].Orders[Customers[j]]);
          for(k in ThisOrder){

            if(ThisOrder[k].OrderDispatched == true){
              Dispatched = "نعم"
            } else if(ThisOrder[k].OrderDispatched == false){
              Dispatched = "لا"
            }

            Div += 
            `
            <tbody>
              <tr>
                <td>${ThisOrder[k].Product[0].value}</td>
                <td> ${ThisOrder[k].NoPcs}  </td>
                <td> ${ThisOrder[k].Bonus} </td>
                <td> ${ThisOrder[k].Remarks} </td>
              </tr>
            `
            Div += `</tbody>`
          }
          Div += `</table>
          تم التسليم: ${Dispatched}
          </details>`
        }
        Div += 
        `
      </details>  
`
        Target.innerHTML += Div;
  
      }

      var Labels = []
      var data = []
      var barColors = [];
      for(i in Orders){
        if(Labels.includes(Orders[i].Product[0].value) === false){
          Labels.push(Orders[i].Product[0].value);
        }
      }


      Labels.forEach(item =>{
        var Price = 0;
        for(i in Orders){
          if(Orders[i].Product[0].value === item){
            var TotalPrice = parseFloat(Orders[i].NoPcs);
            Price = Price + TotalPrice
            console.log(item, Price)
          }
        }
        data.push(Price);
        barColors.push('blue');
      })

      console.log(barColors);
      new Chart("myChart", {
        type: "horizontalBar",
        data: {
          labels:Labels,
          datasets: [{
            backgroundColor: barColors,
            data:data
          }]
        },
        options: {
          responsive:true,
          plugins:{
            legend:{
              fullSize:false
            }
          }
        }    
      });
}

