const express=require('express')
const path=require('path')
const bodyparser=require('body-parser')
const mysql = require('mysql');
const ipfsClient = require('ipfs-http-client')
const { globSource } = ipfsClient
const multer = require('multer');
const fs = require('fs');
const app=express()
const Web3=require('web3')
const EHRFile= require('./abis/EHRFile.json')
let fileHash='';
var account;
var web3='';
var contract;

app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())


async function loadWeb3() {
   var currentProvider = new Web3.providers.HttpProvider('http://localhost:7545');
    web3 = new Web3(currentProvider )
      if(!web3) {
   console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }
}

async function loadBlockChainData() { 
  console.log('in accounts')
 const accounts=await web3.eth.getAccounts()
 account=accounts[0]
  console.log(account)
  const networkId = await web3.eth.net.getId()
  console.log(networkId)
  const networkData = EHRFile.networks[networkId]
  if(networkData) {
     contract =new web3.eth.Contract(EHRFile.abi, networkData.address)
     console.log(contract + ' 000000')
     fileHash = await contract.methods.get().call()
     console.log(fileHash + '   000000')
  } else {
    window.alert('Smart contract not deployed to detected network.')
  }
} 

const ipfs = ipfsClient({
   host: 'ipfs.infura.io', 
   port: '5001', 
   protocol: 'https' 
  })

const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'WebProjectEHRs'
});

mysqlConnection.connect((err) => {
  if (err) 
  console.log(err);
  else
  console.log('Connected!');
});

app.listen(8080,() => {
  console.log('Server is up on port 8080')
  loadWeb3();
  loadBlockChainData();
});

//define paths for express config
const assetsDirectoryPath=path.join(__dirname,'../Assets')
const viewsPath=path.join(__dirname,'../views')

//set handle bars and views path
app.set('view engine','hbs')
app.set('views', viewsPath)


//set up assets path 
app.use(express.static(assetsDirectoryPath))


app.get('/addUser', function (req, res) {
    res.render('addUser',{
      title:'Add User',      
    })
  })

  app.get('/', function (req, res) {
    res.render('index',{
      title:'Master Page',      
    })
  })

  app.get('/doctorPage1', function (req, res) {
    res.render('doctorPage1',{
      title:'Doctor Page',      
    })
  })

  app.get('/patientInfo', function (req, res) {
    res.render('patientInfo',{
      title:'Patient Information',      
    })
  })

    app.get('/adminPage1', function (req, res) {
      res.render('AdminPage1',{
        title:'Admin Page',      
      })
    })

    app.get('/patientRegForm', function (req, res) {
      res.render('patientRegForm',{
        title:'Patient Registration'      
      })
  })

  app.get('/adminPage2', function (req, res) {
    res.render('adminPage2',{
      title:'Admin Page 2'      
    })
})

  app.post('/addPatient', function (req, res) {
    console.log('patient');
    console.log(req.body);
    const patient = { 
      patientId:null,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      gender:req.body.gender,
      age:req.body.age,
      address:req.body.address,
      mobileNo:req.body.phoneno,
      email:req.body.email
    };
    var sqlQuery='INSERT INTO patient SET ?';
    mysqlConnection.query(sqlQuery, patient, (err,result) => {
      if(!err)
      console.log('PQR'+result.insertId) 
      else
      console.log(err);
    }),
    res.render('index',{
      title:'master Page'      
    })
  });

    app.post('/addUser', function (req, res) {
      console.log(req.body);
      const user = { 
        userId:null,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        gender:req.body.gender,
        dob:req.body.dob,
        age:req.body.age,
        role:req.body.role,
        mobileNo:req.body.phoneno,
        email:req.body.email
      };
      var sqlQuery='INSERT INTO user SET ?';
      mysqlConnection.query(sqlQuery, user, (err,result) => {
        if(!err)
        console.log('UQR'+result.insertId) 
        else
        console.log(err);
      }),
      res.render('index',{
        title:'master Page'      
      })
    });

    app.get('/searchPatient',function(req,res){
      let id=req.query.patientId;
      console.log(id);
      console.log('search');
      var sqlQuery='SELECT firstname,lastname,email from patient where patientId= ?';
      mysqlConnection.query(sqlQuery,[req.query.patientId],
      function(err,result) {
      if (!err)
      {
        console.log(result);
        console.log({
          id:req.query.patientId,
          name:result[0].firstname+" "+result[0].lastname,
          email:result[0].email
          })
         res.send({
        id:id,
        name:result[0].firstname+" "+result[0].lastname,
        email:result[0].email
        })
      }
      else 
      {
        console.log(err);
        res.send({
          error:err
        })
      }
      })
      });      
      
      const storage = multer.diskStorage({
        destination(req, file, cb) {
          cb(null, path.join(__dirname, '../uploads'));
        },
        filename(req, file, cb) {
          cb(null, file.fieldname + '-' + Date.now());
        },
      });

      const upload = multer({ storage });

      app.post('/upload', upload.single('file2'), async(req, res) => {
        if (!req.file) {
          return res.status(422).json({
            error: 'File needs to be provided.',
          });
        }
        console.log(req.file)
        const filepath=req.file.path;
        const filename=req.body.filename;
        await addFile(filename,filepath);

         console.log(fileHash + '    999')
         console.log(contract + ' 99999')
         contract.methods.set(fileHash).send({ from: account }).then((r) => {
           console.log(r)
        })
        res.render('uploadDocuments',{filename,fileHash});
 });
 const addFile=async(filename,filepath)=> {
  console.log('in add file')
  for await (const file of ipfs.add(globSource(filepath, { recursive: false}))) {
    console.log(file)
      console.log(file.cid.toString());
      fs.unlink(filepath, (err)=>{
        if(err) console.log("error");
        console.log(filename+` was deleted`); 
    });

    fileHash=file.cid.toString();
    }
};