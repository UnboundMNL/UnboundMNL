let sharedData = {
    orgParts: null
  };
  
  function updateOrgParts(parts) {
    sharedData.orgParts = parts;
  }
  
  function getOrgParts() {
    return sharedData.orgParts;
  }
  
  module.exports = {
    updateOrgParts,
    getOrgParts
  };
  