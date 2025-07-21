const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import your models (adjust paths as needed)
const User = require('./models/User');
const Cluster = require('./models/Cluster');
const Group = require('./models/Group');
const Project = require('./models/Project');

// Database configuration
const DB_CONFIG = {
    url: "mongodb://127.0.0.1:27017/Unbound"
};

// Helper function to read and parse JSON file from populate-db folder
function readJSONFile(filename) {
    try {
        const filePath = path.join(__dirname, 'populate-db', filename);
        console.log(`Reading file: ${filePath}`);
        
        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            return null;
        }
        
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Remove comments from JSON (lines starting with //)
        const cleanedContent = fileContent
            .split('\n')
            .filter(line => !line.trim().startsWith('//'))
            .join('\n');
            
        return JSON.parse(cleanedContent);
    } catch (error) {
        console.error(`Error reading file ${filename}:`, error.message);
        return null;
    }
}

// Helper function to convert ObjectId format
function convertToMongooseFormat(data) {
    if (Array.isArray(data)) {
        return data.map(item => convertToMongooseFormat(item));
    } else if (data && typeof data === 'object') {
        const converted = {};
        for (const [key, value] of Object.entries(data)) {
            if (key === '_id' && value && value.$oid) {
                converted[key] = new mongoose.Types.ObjectId(value.$oid);
            } else if ((key.includes('Id') || key === 'validCluster' || key === 'validGroup') && value && value.$oid) {
                converted[key] = new mongoose.Types.ObjectId(value.$oid);
            } else if (Array.isArray(value)) {
                converted[key] = value.map(item => {
                    if (item && item.$oid) {
                        return new mongoose.Types.ObjectId(item.$oid);
                    }
                    return convertToMongooseFormat(item);
                });
            } else if (value && typeof value === 'object') {
                converted[key] = convertToMongooseFormat(value);
            } else {
                converted[key] = value;
            }
        }
        return converted;
    }
    return data;
}

// Helper function to check if populate-db folder and files exist
function checkFiles() {
    console.log('Checking populate-db folder structure...');
    
    const populateDbPath = path.join(__dirname, 'populate-db');
    
    if (!fs.existsSync(populateDbPath)) {
        console.error('ERROR: populate-db folder not found in current directory!');
        console.log('Please ensure the populate-db folder exists with the JSON files.');
        return false;
    }
    
    const requiredFiles = [
        'Unbound.users.json',
        'Unbound.clusters.json', 
        'Unbound.groups.json',
        'Unbound.projects.json'
    ];
    
    const files = fs.readdirSync(populateDbPath);
    console.log('Files found in populate-db folder:', files);
    
    let allFilesExist = true;
    for (const filename of requiredFiles) {
        const filePath = path.join(populateDbPath, filename);
        if (fs.existsSync(filePath)) {
            console.log(`FOUND: ${filename}`);
        } else {
            console.log(`MISSING: ${filename}`);
            allFilesExist = false;
        }
    }
    
    return allFilesExist;
}

async function populateDatabase() {
    try {
        console.log('Starting database population...');
        
        // Check if files exist before proceeding
        if (!checkFiles()) {
            console.error('Aborting: Required files not found.');
            return;
        }
        
        // Connect to MongoDB
        await mongoose.connect(DB_CONFIG.url);
        console.log('Connected to MongoDB successfully');
        
        let totalInserted = 0;
        
        // Users
        console.log('\nProcessing users...');
        const usersData = readJSONFile('Unbound.users.json');
        if (usersData && usersData.length > 0) {
            const deleteResult = await mongoose.connection.db.collection('users').deleteMany({});
            console.log(`Cleared ${deleteResult.deletedCount} existing users`);
            
            const convertedUsers = convertToMongooseFormat(usersData);
            await mongoose.connection.db.collection('users').insertMany(convertedUsers);
            console.log(`Inserted ${convertedUsers.length} users`);
            totalInserted += convertedUsers.length;
        } else {
            console.log('No user data found or file empty');
        }
        
        // Clusters
        console.log('\nProcessing clusters...');
        const clustersData = readJSONFile('Unbound.clusters.json');
        if (clustersData && clustersData.length > 0) {
            const deleteResult = await mongoose.connection.db.collection('clusters').deleteMany({});
            console.log(`Cleared ${deleteResult.deletedCount} existing clusters`);
            
            const convertedClusters = convertToMongooseFormat(clustersData);
            await mongoose.connection.db.collection('clusters').insertMany(convertedClusters);
            console.log(`Inserted ${convertedClusters.length} clusters`);
            totalInserted += convertedClusters.length;
        } else {
            console.log('No cluster data found or file empty');
        }
        
        // Projects
        console.log('\nProcessing projects...');
        const projectsData = readJSONFile('Unbound.projects.json');
        if (projectsData && projectsData.length > 0) {
            const deleteResult = await mongoose.connection.db.collection('projects').deleteMany({});
            console.log(`Cleared ${deleteResult.deletedCount} existing projects`);
            
            const convertedProjects = convertToMongooseFormat(projectsData);
            await mongoose.connection.db.collection('projects').insertMany(convertedProjects);
            console.log(`Inserted ${convertedProjects.length} projects`);
            totalInserted += convertedProjects.length;
        } else {
            console.log('No project data found or file empty');
        }
        
        // Groups
        console.log('\nProcessing groups...');
        const groupsData = readJSONFile('Unbound.groups.json');
        if (groupsData && groupsData.length > 0) {
            const deleteResult = await mongoose.connection.db.collection('groups').deleteMany({});
            console.log(`Cleared ${deleteResult.deletedCount} existing groups`);
            
            const convertedGroups = convertToMongooseFormat(groupsData);
            await mongoose.connection.db.collection('groups').insertMany(convertedGroups);
            console.log(`Inserted ${convertedGroups.length} groups`);
            totalInserted += convertedGroups.length;
        } else {
            console.log('No group data found or file empty');
        }
        
        // Verify final state
        console.log('\nVerifying database state...');
        const collections = ['users', 'clusters', 'projects', 'groups'];
        for (const collectionName of collections) {
            const count = await mongoose.connection.db.collection(collectionName).countDocuments();
            console.log(`${collectionName}: ${count} documents`);
        }
        
        console.log(`\nDatabase population completed successfully!`);
        console.log(`Total documents inserted: ${totalInserted}`);
        
    } catch (error) {
        console.error('ERROR: Failed to populate database:', error.message);
        console.error('Stack trace:', error.stack);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the script
if (require.main === module) {
    populateDatabase();
}

module.exports = { populateDatabase, checkFiles };