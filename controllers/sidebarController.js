const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');

const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');

const sidebarController = {

    sidebarChange: (req, res) => {
        try {
            req.session.sidebar = !req.session.sidebar;
            res.status(200).json({ success: true, message: 'Sidebar toggled successfully' });
        } catch (error) {
            console.error(error);
        }
    }

}

module.exports = sidebarController;