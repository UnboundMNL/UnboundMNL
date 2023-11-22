const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');
const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');


const adminFunctionsController = {

    userDetailsOverride: async (req, res) => {
        try {
            if (req.session.isLoggedIn){
                const user = await User.findById(req.session.userId)
                const authority = user.authority

                if (authority === "Admin") {
                    const { profileID, newUsername, newPassword } = req.body

                    const profileToBeEdited = await User.findById(profileID)
                    const isPasswordMatch = await profileToBeEdited.comparePassword(newPassword);
                    const usernameUpdate = (newUsername !== profileToBeEdited.username);

                    if (!isPasswordMatch && usernameUpdate) {
                        await User.findOneAndUpdate({ _id: profileID }, { username: newUsername, password: newPassword })
                    } else if (usernameUpdate) {
                        await User.findOneAndUpdate({ _id: profileID }, { username: newUsername })
                    } else if (!isPasswordMatch) {
                        await User.findOneAndUpdate({ _id: profileID }, { password: newPassword })
                    }

                    if(!isPasswordMatch || usernameUpdate)
                        return res.json({ success: "Profile has been edited." })
                    else
                        return res.json( { success: "No edits were made." } )

                } else {
                    return res.status(403).json({ error: "User not authorized" })
                }
            } else {
                res.redirect("/")
            }
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },

    userMasterList: async (req, res) => {
        try {
            if (req.session.isLoggedIn){
                const userID = req.session.userId;
                const sidebar = req.session.sidebar;
                const user = await User.findById(userID);
                const authority = user.authority;
                const username = user.username;

                if (authority === "Admin") {
                    const userList = await User.find()

                    const officerList = []
                    for (officer in userList) {
                        officerList.push({
                            username: officer.username,
                            authority: officer.authority
                        })
                    }

                    return res.render("accounts", { officerList, username, authority, sidebar })
                } else {
                    return res.status(403).json({ error: "User not authorized" })
                }
            } else {
                res.redirect("/")
            }
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }

    }

}

module.exports = adminFunctionsController;