let sharedData = {
  orgParts: null
};

const Member = require('../../models/Member');
const Saving = require('../../models/Saving');
const User = require('../../models/User');

const Cluster = require('../../models/Cluster');
const Project = require('../../models/Project');
const Group = require('../../models/Group');

const updateOrgParts = async (authority, userId) => {
  try {
    let orgParts;
    if (authority === "Admin") { // Fetch all org parts for admin
      orgParts = await Cluster.find().populate("projects").populate("groups").populate("members").populate("savings");
    } else if (authority === "SEDO") { // Fetch org parts for SEDO
      orgParts = await Cluster.find({ validSEDOs: userId }).populate("projects").populate("groups").populate("members").populate("savings");
    } else if (authority === "Treasurer") { // Fetch org parts for Treasurer
      orgParts = await Group.find({ validTreasurers: userId }).populate("members").populate("savings");
    } else { // default
      orgParts = await getOrgParts();
    }
    return orgParts;
  } catch (error) {
    console.error("Error fetching org parts:", error);
    return null;
  }
};

function getOrgParts() {
  return sharedData.orgParts;
}

module.exports = {
  updateOrgParts,
  getOrgParts
};
