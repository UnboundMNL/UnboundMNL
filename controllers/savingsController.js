const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');
const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');
const { updateOrgParts, getOrgParts } = require('../controllers/functions/sharedData');
const { dashboardButtons } = require('../controllers/functions/buttons');

async function getAuthorizedMembers(user, authority) {
    let orgParts;

    if (authority === "Admin") {
        orgParts = await Member.find({}).populate("savings");
    } else if (authority === "SEDO") {
        const accessibleProjects = await Project.find({ cluster: user.validCluster });
        const accessibleGroups = await Group.find({ project: { $in: accessibleProjects.map(project => project._id) } });
        orgParts = await Member.find({ group: { $in: accessibleGroups.map(group => group._id) } }).populate("savings");
    } else if (authority === "Treasurer") {
        const accessibleGroup = await Group.findById(user.validGroup);
        if (accessibleGroup) {
            orgParts = await Member.find({ group: accessibleGroup._id }).populate("savings");
        } else {
            orgParts = [];
        }   
    } else {
        orgParts = [];
    }

    return orgParts;
}

const savingsController = {
    savings: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const userID = req.session.userId;
                const sidebar = req.session.sidebar;
                const user = await User.findById(userID);
                const authority = user.authority;
                const username = user.username;

                const orgParts = await getAuthorizedMembers(user, authority);

                dashbuttons = dashboardButtons(authority);
                res.render("savings", { authority, username, dashbuttons, sidebar, orgParts });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while fetching data." });
        }
    },

    newYear: async (req, res) => {
        try {
            if(req.session.isLoggedIn) {
                // add a new blank savings document to all members
                const user = await User.findById(req.session.userId);
                let authority = user.authority;
                //memberList;
                //const orgParts = await getAuthorizedMembers(user, authority);
                // can this just retreive a json of all member ids that are already displayed :)

                // const 

                //const year = req.body.year; //to change
                


                res.redirect("/savings");
            }
            else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while saving data." });
        }
    },

    newYear: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const user = await User.findById(req.session.userId);
                const authority = user.authority;
    
                const orgParts = await getAuthorizedMembers(user, authority);
                const memberIDs = orgParts.map(member => member._id);
                //might change this to only retreive the member ids instead of the whole member object (including thhe savings)
                // alternatively maybe could just pass a json of member ids from the frontend?
                // or migt just middleware the array of accesible members. idk. will update.

                const year = req.body.year; //might change to auto detect ?
    
                for (const memberId of memberIDs) {
                    const newSaving = new Saving({
                        //memberID: memberId, (i think it'll be better to save it from members rather than savings) -c
                        year: year
                     });
                    await newSaving.save();
                    let updateMember = await Member.findById(memberId);
                    updateMember.savings.push(newSaving);
                    await updateMember.save();
                }
    
                res.redirect("/savings");
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while saving data." });
        }
    },
    

    newSaving: async (req, res) => { //maybe more apt to call this "edit saving" then the previous as "new saving"
        try {
            if(req.session.isLoggedIn) {
                const { id, year, updateData  } = req.body;
                const saving = await Saving.findOne({ memberID: id, year });
                if (saving){
                    var updatedData = {};

                    var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

                    months.forEach(month => {
                    updatedData[month] = {
                        match: updateData[month]?.match === '' ? 0 : updateData[month]?.match || saving[month]?.match,
                        savings: updateData[month]?.savings === '' ? 0 : updateData[month]?.savings || saving[month]?.savings
                    };
                    });
                      
                    const updatedSaving = await Saving.findOneAndUpdate(
                        { memberID: id, year },
                        updatedData,
                        { new: true }
                    );  
                    if (updatedSaving){
                        res.json();
                    }
                } else{
                    const newSaving = new Saving({ memberID: id, year });
                    await newSaving.save();
                    const member = await Member.findOne({ _id: id });
                    member.savings.push(newSaving._id)
                    member.save();
                    const updatedSaving = await Saving.findOneAndUpdate({ memberID: id, year }, updateData, { new: true });
                    if (updatedSaving) {
                      res.json();
                    }
                }

            }else {
                res.redirect("/");
            }
            
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while saving data." });
        }
    },
    

}

module.exports = savingsController;
