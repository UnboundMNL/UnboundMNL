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

                    const isUsernameTaken = (newUsername !== profileToBeEdited.username) && (await User.find({ username: newUsername }).countDocuments() > 0);

                    if(isUsernameTaken){
                        return res.json({ error: "Username is already taken." })
                    }
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

    adminUserDelete: async (req, res) => {
        if(req.session.isLoggedIn){
            console.log("here");
            const { profileID } = req.body
            const deletedUser = await User.findOneAndDelete({ _id: profileID })
            if (deletedUser){
                return res.json({ success: "User has been deleted." })
            }
        } else {
            res.redirect("/")
        }
    }

}

module.exports = adminFunctionsController;