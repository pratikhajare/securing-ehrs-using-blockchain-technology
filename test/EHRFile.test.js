const _deploy_contract = require('../migrations/2_deploy_contract');
const { assert } = require('chai');

const EHRFile = artifacts.require("EHRFile");
require('chai')
.use(require('chai-as-promised'))
.should()

contract('EHRFile',(accounts)=>{
    let ehrfile

before(async()=>{
    ehrfile=await EHRFile.deployed()
})

    describe('deployment',async()=>{
        
        it('deploys successfully',async()=>{
                  
        const address=ehrfile.address
        console.log(address)
        assert.isNotNull(address)
        assert.notEqual(address,0x0)
        assert.notEqual(address,'')
        assert.notEqual(address,undefined)
        })
        
    })

    describe('storage',async()=>{
        
        it('updates the filehash',async()=>{
      let filehash
      fileHash='abc123'
      await ehrfile.set(fileHash)
      const result=await ehrfile.get();
      console
    assert.equal(fileHash,result)
    })
        
    })
})