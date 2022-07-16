
async function AskLeave(){
    var Type = document.getElementById('Type').value;
    var Reason = document.getElementById('Purpose').value;
    var StartTime = new Date(document.getElementById('StartDate').value).toISOString();
    var EndTime = new Date(document.getElementById('EndDate').value).toISOString();
    var id = sessionStorage.getItem('User');

    console.log(Type, Reason, StartTime, EndTime, id);

    var SubmitLeave = await axios({
            method: "POST",
            url: "https://api.baserow.io/api/database/rows/table/76537/?user_field_names=true",
            headers: {
            Authorization: token,
            "Content-Type": "/nds-dashboard/Application/json"
            },
            data: {
            "Reason": Reason,
            "Start": StartTime,
            "End": EndTime,
            "Employee": [id],
            "Leave/Absence": Type
            }
        })
    
        if(SubmitLeave.status == 200){
            alert('تم تقديم طلبك بنجاح');
            window.location.replace('main.html')
        }
}