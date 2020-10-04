const EHRFile = artifacts.require("EHRFile");

module.exports = function(deployer) {
  deployer.deploy(EHRFile);
};
