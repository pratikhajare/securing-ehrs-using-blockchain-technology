console.log('cLIENT SIDE LOGGING')
const patientForm = document.querySelector('form')

const id=document.querySelector('#id')
const name=document.querySelector('#name')
const email=document.querySelector('#email')


patientForm.addEventListener('submit',(e)=>{
e.preventDefault()

const patientId=id.value;

fetch(`http://localhost:8080/searchPatient?patientId=${patientId}`).then((response)=>{
    response.json().then((data)=>{
        if(data.error){
            console.log(error)
        }
        else{
            console.log(data.id);
            console.log(data.name);
            console.log(data.email);
            id.value=patientId;
            name.value=data.name;
            email.value=data.email;
        }
    })
})
})

if(id.value!=null&&name.value!=null&&email.value!=null)
		{
			document.getElementById("nextPage").onclick = function () {		
       		 location.href = "/adminPage2";
    };
		}