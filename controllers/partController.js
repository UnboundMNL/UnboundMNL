const Group = require('../models/Group');
const Project = require('../models/Project');
const Cluster = require('../models/Cluster');
const User = require('../models/User');

const partController = {
    newGroup: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                // im imagining what the form will have
                // i think we can get SPU from projects? or maybe we can just have a dropdown of SPUs? or manually input?
                const { SPU, name, area, depositoryBank, bankAccountType, bankAccountNum, 
                    signatory_firstName, signatory_middleName, signatory_lastName, 
                    other_firstName, other_middleName, other_lastName, other_contactNo } = req.body;
            
                const signatories = [];
                for (let i = 0; i < signatory_firstName.length; i++) {
                    signatories.push({
                        firstName: signatory_firstName[i],
                        middleName: signatory_middleName[i],
                        lastName: signatory_lastName[i]
                    });
                }
                
                const otherPeople = [];
                for (let i = 0; i < other_firstName.length; i++) {
                    otherPeople.push({
                        firstName: other_firstName[i],
                        middleName: other_middleName[i],
                        lastName: other_lastName[i],
                        contactNo: [other_contactNo[i]]
                    });
                }
                
                const newGroup = new Group({
                    SPU,
                    name,
                    area,
                    depositoryBank,
                    bankAccountType,
                    bankAccountNum,
                    signatories,
                    otherPeople
                });
                await newGroup.save();

                //redirecting to dashboard rn cuz idk where else to redirect to
                res.redirect("/dashboard");
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while creating a new group." });
        }
    },



    newProject: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                // im imagining what the form will have
                // i think we can get SPU from projects? or maybe we can just have a dropdown of SPUs? or manually input?
                const { name } = req.body;
            
                let groups = [];
                const newProject = new Project({
                    name,
                    groups,
                });
                await newProject.save();

                //redirecting to dashboard rn cuz idk where else to redirect to
                res.redirect("/dashboard");
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while creating a new group." });
        }
    },

    newCluster: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                // im imagining what the form will have
                // i think we can get SPU from projects? or maybe we can just have a dropdown of SPUs? or manually input?
                const { name } = req.body;
            
                let projects = [];
                const newProject = new Project({
                    name,
                    projects,
                });
                await newProject.save();

                //redirecting to dashboard rn cuz idk where else to redirect to
                res.redirect("/dashboard");
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while creating a new group." });
        }
    }
}

module.exports = partController;
