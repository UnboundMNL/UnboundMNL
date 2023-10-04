const Member = require('../models/Member');
const Part = require('../models/Part');
const Saving = require('../models/Saving');
const User = require('../models/User');


const userController = {
    
    dashboard: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const userID = req.session.userId;
                const user = await User.findById(userID);
                const authority = user.authority;
                // const username = user.username;
                let orgParts;
                
                //admin can see from cluster
                //SEDO can see from project
                //treasurer can see from group

                switch (authority) {
                    case "Admin":
                        orgParts = await Part.find();
                        break;
                    case "SEDO":
                        orgParts = await Part.find({ type: "Project" });
                        break;
                    case "Treasurer":
                        orgParts = await Part.find({ type: "Group" });
                        break;
                    default:
                        break;
                }
                
                let partWithMembersAndSavings;
                const orgPartsMembers = [];
                for (const part of orgParts) {
                    partWithMembersAndSavings = await Part.findById(part._id).populate('members').populate('savings');
                    orgPartsMembers.push(partWithMembersAndSavings);
                }
                //might be matakaw sa memory.
                
                res.render("dashboard", { authority, orgParts, partWithMembersAndSavings  });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while fetching data." });
        }
    }
}

module.exports = userController;