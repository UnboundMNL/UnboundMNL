const Member = require('../models/Member');
// const Part = require('../models/Part');
const Saving = require('../models/Saving');
const User = require('../models/User');

const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');

const userController = {
    
    dashboard: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const userID = req.session.userId;
                const user = await User.findById(userID);
                const authority = user.authority;
                const username = user.username;
                let orgParts;
                
                //admin can see from cluster
                //SEDO can see from project
                //treasurer can see from group

                // needs additional conditions
                // needs update to new schemas 
                switch (authority) {
                    case "Admin":
                        orgParts = await Cluster.find();
                        break;
                    case "SEDO":
                        orgParts = await Project.find({ validSEDOs: userID });
                        break;
                    case "Treasurer":
                        orgParts = await Group.find({ validTreasurers: userID });
                        break;
                    default:
                        break;
                }
                
                // let partWithMembersAndSavings;
                // const orgPartsMembers = [];
                // for (const part of orgParts) {
                //     partWithMembersAndSavings = await Part.findById(part._id).populate('members').populate('savings');
                //     orgPartsMembers.push(partWithMembersAndSavings);
                // }
                //might be matakaw sa memory.
                
                dashbuttons = dashboardButtons(authority);

                // res.render("dashboard", { authority, orgParts, partWithMembersAndSavings, username  });
                res.render("dashboard", { authority, orgParts, username, dashbuttons });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while fetching data." });
        }
    }
}

function dashboardButtons(authority){
    let buttons ;
    if (authority === "Admin"){
        buttons = [
            {
                text: "Clusters",
                href: "/clusters",
                icon: "bxs-folder-open"
            },
            {
                text: "Account Registration",
                href: "#",
                icon: "bxs-user-plus"
            },
            {
                text: "Manage Organization",
                href: "#",
                icon: "bx-building-house"
            },
            {
                text: "Total Savings & Matching Grant",
                href: "#",
                icon: "bxs-bank"
            }
        ]
    } else if (authority === "SEDO"){
        buttons = [
            {
                text: "Projects",
                href: "/projects",
                icon: "bxs-folder-open"
            },
            {
                text: "Manage Cluster",
                href: "/manage-cluster",
                icon: "bx-grid-alt"
            },
            {
                text: "Account Registration",
                href: "#",
                icon: "bxs-user-plus"
            },
            {
                text: "Total Savings & Matching Grant",
                href: "#",
                icon: "bxs-bank"
            }
        ]
    } else if (authority === "Treasurer"){
        buttons = [
            {
                text: "Members",
                href: "/members",
                icon: "bx-group"
            },
            {
                text: "Manage Group",
                href: "#",
                icon: "bx-building-house"
            },
            {
                text: "Total Savings & Matching Grant",
                href: "#",
                icon: "bxs-bank"
            }
        ]
    }
    return buttons;
}
module.exports = userController;