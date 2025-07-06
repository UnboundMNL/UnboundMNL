// controller for all exports
const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');

const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');
const { updateOrgParts, getOrgParts } = require('../controllers/functions/sharedData');
const { dashboardButtons } = require('../controllers/functions/buttons');
const excelJS = require("exceljs");

const { promisify } = require('util');
const archiver = require('archiver');
const fs = require('fs');
const { pipeline } = require('stream');
const pipelineAsync = promisify(pipeline);

const ejs = require('ejs');
const path = require('path');
const puppeteer = require('puppeteer');

const exportProjectForCluster = async (project, res) => {
    const projectId = project._id;
    if (!projectId) {
        //return res.status(400).json({ error: "No project ID provided." });
        return res.redirect("/dasboard");
    }
    project = await Project.findOne({ _id: projectId })
        .populate({ path: 'groups', populate: { path: 'members', populate: { path: 'savings' } } });
    // maybe only filter for active members
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Project_MainInfo');
    const columns = [
        { header: 'SPU', key: 'SPU', width: 15 },
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Location', key: 'location', width: 20 },
        { header: 'Depository Bank', key: 'depositoryBank', width: 20 },
        { header: 'Bank Account Type', key: 'bankAccountType', width: 20 },
        { header: 'Bank Account Number', key: 'bankAccountNum', width: 20 },
        { header: 'SHG Leader', key: 'SHGLeader', width: 20 },
        { header: 'SHG Leader Phone', key: 'SHGLeaderPhone', width: 20 },
        { header: 'SEDO Chairman', key: 'SEDOChairman', width: 20 },
        { header: 'SEDO Chairman Phone', key: 'SEDOChairmanPhone', width: 20 },
        { header: 'Kaban Treasurer', key: 'kabanTreasurer', width: 20 },
        { header: 'Kaban Treasurer Phone', key: 'kabanTreasurerPhone', width: 20 },
        { header: 'Kaban Auditor', key: 'kabanAuditor', width: 20 },
        { header: 'Kaban Auditor Phone', key: 'kabanAuditorPhone', width: 20 },
        { header: 'Total Members', key: 'totalMembers', width: 20 },
        { header: 'Total Kaban', key: 'totalKaban', width: 20 }
    ];
    worksheet.columns = columns;
    for (const group of project.groups) {
        let SHGLeader = group.SHGLeader.firstName + " " + group.SHGLeader.lastName;
        let SEDOChairman = group.SEDPChairman.firstName + " " + group.SEDPChairman.lastName;
        let kabanTreasurer = group.kabanTreasurer.firstName + " " + group.kabanTreasurer.lastName;
        let kabanAuditor = group.kabanAuditor.firstName + " " + group.kabanAuditor.lastName;
        const rowData = {
            SPU: group.SPU, //maybe ccan remove thihs tbhh?
            name: group.name, location: group.location, depositoryBank: group.depositoryBank, bankAccountType: group.bankAccountType,
            bankAccountNum: group.bankAccountNum,
            SHGLeader: SHGLeader, SHGLeaderPhone: group.SHGLeader.contatNo,
            SEDOChairman: SEDOChairman, SEDOChairmanPhone: group.SEDPChairman.contatNo,
            kabanTreasurer: kabanTreasurer, kabanTreasurerPhone: group.kabanTreasurer.contatNo,
            kabanAuditor: kabanAuditor, kabanAuditorPhone: group.kabanAuditor.contatNo,
            totalMembers: group.members.length, totalKaban: group.totalKaban
        };
        worksheet.addRow(rowData);
    }


    for (const group of project.groups) {
        shg = group;
        const groupSheet = workbook.addWorksheet(group.name);
        const columns2 = [
            { header: 'ID', key: 'orgId', width: 15 },
            { header: 'First Name', key: 'firstName', width: 20 },
            { header: 'Last Name', key: 'lastName', width: 20 },
            { header: 'Total Savings', key: 'totalSaving', width: 15 },
            { header: 'Total Match', key: 'totalMatch', width: 15 },
            { header: 'Status', key: 'status', width: 10 } //maybe can remove this?
        ];

        // maybe can remove/change this? idk
        // it's supposed to get all the unique years from the savings of each member
        const allYears = new Set();
        for (const member of shg.members) {
            if (member.savings && Array.isArray(member.savings)) {
                for (const savingsEntry of member.savings) {
                    if (savingsEntry.year) {
                        allYears.add(savingsEntry.year);
                    }
                }
            }
        }

        // headers for years
        for (const year of allYears) {
            columns2.push(
                { header: `Savings ${year}`, key: `savings_${year}`, width: 15 },
                { header: `Match ${year}`, key: `match_${year}`, width: 15 }
            );
        }

        groupSheet.columns = columns2;

        for (const member of shg.members) {
            const rowData = {
                orgId: member.orgId,
                firstName: member.name.firstName,
                lastName: member.name.lastName,
                totalSaving: member.totalSaving,
                totalMatch: member.totalMatch,
                status: member.status
            };

            for (const year of allYears) {
                const savingsEntry = member.savings.find(entry => entry.year === year);

                if (savingsEntry) {
                    rowData[`savings_${year}`] = savingsEntry.totalSaving;
                    rowData[`match_${year}`] = savingsEntry.totalMatch;
                } else {
                    rowData[`savings_${year}`] = 0;
                    rowData[`match_${year}`] = 0;
                }
            }

            groupSheet.addRow(rowData);
        }
    }

    return workbook;
}


const exportsController = {
    //export group
    exportGroup: async (req, res) => {
        if (req.session.isLoggedIn == false) {
            return res.redirect("/");
        }
        const shgId = req.params.id;
        if (!shgId) {
            return res.redirect("/dasboard");
        }
        if (req.session.isLoggedIn == false) {
            return res.redirect("/");
        }
        //const shg = await Group.findOne({ _id: shgId }).populate('members').populate('savings');
        const shg = await Group.findOne({ _id: shgId }).populate({
            path: 'members',
            populate: { path: 'savings' }
        });

        // maybe only filter for active members

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('SHG_MainInfo');
        const columns = [
            { header: 'SPU', key: 'SPU', width: 15 },
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Location', key: 'location', width: 20 },
            { header: 'SHG Leader', key: 'SHGLeader', width: 20 },
            { header: 'SHG Leader Phone', key: 'SHGLeaderPhone', width: 20 },
            { header: 'SEDO Chairman', key: 'SEDOChairman', width: 20 },
            { header: 'SEDO Chairman Phone', key: 'SEDOChairmanPhone', width: 20 },
            { header: 'Kaban Treasurer', key: 'kabanTreasurer', width: 20 },
            { header: 'Kaban Treasurer Phone', key: 'kabanTreasurerPhone', width: 20 },
            { header: 'Kaban Auditor', key: 'kabanAuditor', width: 20 },
            { header: 'Kaban Auditor Phone', key: 'kabanAuditorPhone', width: 20 }

        ];
        worksheet.columns = columns;
        let SHGLeader = shg.SHGLeader.firstName + " " + shg.SHGLeader.lastName;
        let SEDOChairman = shg.SEDPChairman.firstName + " " + shg.SEDPChairman.lastName;
        let kabanTreasurer = shg.kabanTreasurer.firstName + " " + shg.kabanTreasurer.lastName;
        let kabanAuditor = shg.kabanAuditor.firstName + " " + shg.kabanAuditor.lastName;
        const mainRowData = {
            SPU: shg.SPU,
            name: shg.name,
            location: shg.location,
            depositoryBank: shg.depositoryBank, bankAccountType: shg.bankAccountType,
            bankAccountNum: shg.bankAccountNum,
            SHGLeader: SHGLeader, SHGLeaderPhone: shg.SHGLeader.contatNo,
            SEDOChairman: SEDOChairman, SEDOChairmanPhone: shg.SEDPChairman.contatNo,
            kabanTreasurer: kabanTreasurer, kabanTreasurerPhone: shg.kabanTreasurer.contatNo,
            kabanAuditor: kabanAuditor, kabanAuditorPhone: shg.kabanAuditor.contatNo,
        };

        worksheet.addRow(mainRowData);


        const worksheet2 = workbook.addWorksheet('SHG_Members');
        const columns2 = [
            { header: 'ID', key: 'orgId', width: 15 },
            { header: 'First Name', key: 'firstName', width: 20 },
            { header: 'Last Name', key: 'lastName', width: 20 },
            { header: 'Total Savings', key: 'totalSaving', width: 15 },
            { header: 'Total Match', key: 'totalMatch', width: 15 },
            { header: 'Status', key: 'status', width: 10 } //maybe can remove this?
        ];

        const allYears = new Set();
        for (const member of shg.members) {
            if (member.savings && Array.isArray(member.savings)) {
                for (const savingsEntry of member.savings) {
                    if (savingsEntry.year) {
                        allYears.add(savingsEntry.year);
                    }
                }
            }
        }

        // headers for years
        for (const year of allYears) {
            columns2.push(
                { header: `Savings ${year}`, key: `savings_${year}`, width: 15 },
                { header: `Match ${year}`, key: `match_${year}`, width: 15 }
            );
        }

        worksheet2.columns = columns2;

        for (const member of shg.members) {
            const rowData = {
                orgId: member.orgId,
                firstName: member.name.firstName,
                lastName: member.name.lastName,
                totalSaving: member.totalSaving,
                totalMatch: member.totalMatch,
                status: member.status
            };

            for (const year of allYears) {
                const savingsEntry = member.savings.find(entry => entry.year === year);

                if (savingsEntry) {
                    rowData[`savings_${year}`] = savingsEntry.totalSaving;
                    rowData[`match_${year}`] = savingsEntry.totalMatch;
                } else {
                    rowData[`savings_${year}`] = 0;
                    rowData[`match_${year}`] = 0;
                }
            }

            worksheet2.addRow(rowData);
        }
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        let shgName = shg.name.replace(/[^a-zA-Z0-9]/g, '');
        if (shgName == '') {
            shgName = "export";
        }
        const name = shgName + ".xlsx";
        res.setHeader("Content-Disposition", "attachment; filename=" + name);
        await workbook.xlsx.write(res);
        res.end();
    },

    //export a single project (calls the function above)
    exportProject: async (req, res) => {
        if (req.session.isLoggedIn == false || req.session.authority == "Treasurer") {
            return res.redirect("/");
        }
        const projectId = req.params.id;
        if (!projectId) {
            //return res.status(400).json({ error: "No project ID provided." });
            return res.redirect("/dasboard");
        }
        const userId = req.session.userId;
        const user = await User.findById(userId);
        if (req.session.isLoggedIn == false || user.authority == "Treasurer") {
            return res.redirect("/");
        }
        const project = await Project.findOne({ _id: projectId })
        //.populate({path: 'groups', populate: {path: 'members', populate: {path: 'savings'}}});
        // maybe only filter for active members

        const workbook = await exportProjectForCluster(project, res);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        let projectName = project.name.replace(/[^a-zA-Z0-9]/g, '');
        if (projectName == '') {
            projectName = "export";
        }
        const name = projectName + ".xlsx";
        res.setHeader("Content-Disposition", "attachment; filename=" + name);
        await workbook.xlsx.write(res);
        res.end();
    },



    //exports a cluster (in zip)
    exportCluster: async (req, res) => {
        if (req.session.isLoggedIn == false || req.session.authority == "Treasurer") {
            return res.redirect("/");
        }
        const clusterId = req.params.id;
        if (!clusterId) {
            return res.redirect("/dasboard");
        }
        const userId = req.session.userId;
        const user = await User.findById(userId);
        if (req.session.isLoggedIn == false || user.authority == "Treasurer") {
            return res.redirect("/");
        }
        const cluster = await Cluster.findOne({ _id: clusterId })

            .populate({ path: 'projects' });



        const zip = archiver('zip', { zlib: { level: 9 } });
        let clusterName = cluster.name.replace(/[^a-zA-Z0-9]/g, '');
        if (clusterName == '') {
            clusterName = "export";
        }
        const zipFilename = clusterName + '_compiled.zip';
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename=${zipFilename}`);

        zip.pipe(res);

        for (const project of cluster.projects) {
            const workbook = await exportProjectForCluster(project, res);

            const buffer = await workbook.xlsx.writeBuffer();
            let projectName = project.name.replace(/[^a-zA-Z0-9]/g, '');
            if (projectName == '') {
                projectName = "export";
                console.log(projectName);
            }
            zip.append(buffer, { name: `${projectName}.xlsx` });
        }

        await zip.finalize();
    },

    //exports all clusters (in zip, in proper folders)
    exportAdminClusters: async (req, res) => {

        const userId = req.session.userId;
        const user = await User.findById(userId);
        if (req.session.isLoggedIn == false || user.authority != "Admin") {
            return res.redirect("/");
        }
        const clusters = await Cluster.find().populate({ path: 'projects' });

        const zip = archiver('zip', { zlib: { level: 9 } });

        //const date = new Date(); idk if we wanna add more ekek to the name lol
        const zipFilename = 'admin_compiled.zip';
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename=${zipFilename}`);

        zip.pipe(res);

        for (const cluster of clusters) {
            zip.append(null, { name: `${cluster.name}/`, prefix: cluster.name });
            let clusterName = cluster.name.replace(/[^a-zA-Z0-9]/g, '');
            if (clusterName == '') {
                clusterName = "export";
            }
            for (const project of cluster.projects) {
                let projectName = project.name.replace(/[^a-zA-Z0-9]/g, '');
                if (projectName == '') {
                    projectName = "export";
                }
                const workbook = await exportProjectForCluster(project, res);

                const buffer = await workbook.xlsx.writeBuffer();
                zip.append(buffer, { name: `${clusterName}/${projectName}.xlsx`, prefix: cluster.name });
            }
        }
        //ADD SUMMARY SHEET

        await zip.finalize();

        return zip;
    },

    exportReport: async(req, res) => {
        try {
            // Get member
            const id = req.query.id || req.params.id;
            const member = await Member.findById(id).populate('savings');

            // Render the EJS template to HTML
            const html = await ejs.renderFile(
                path.join(__dirname, '../views/report.ejs'),
                { member },
                { async: true },
            );

            // Launch Puppeteer and generate PDF
            const browser = await puppeteer.launch({
                headless: true, // Use "new" for Puppeteer v20+, otherwise use true
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });

            // Set Format, Orientation, etc.
            const pdfBuffer = await page.pdf({
                format: 'A4',
                landscape: true,
                printBackground: true,
                margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
            });

            await browser.close();

            // Send PDF as response
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
            res.end(pdfBuffer);
        } catch (err) {
            console.error(err);
            res.status(500).send('Failed to generate PDF');
        }
    },
}

module.exports = exportsController;