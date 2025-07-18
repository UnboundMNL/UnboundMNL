// Helper function to map member status
function mapMemberStatus(status) {
    if (!status) return 'Active';
    
    const statusLower = status.toLowerCase();
    const statusMap = {
        'active': 'Active',
        'rws': 'RwS',
        'rwos': 'RwoS'
    };
    return statusMap[statusLower] || status;
}

// Helper function to validate member data
function validateMemberData(member, rowIndex) {
    const errors = []; 
    
    const missingFields = [];
    if (!member.name?.firstName?.trim()) missingFields.push('First name');
    if (!member.name?.lastName?.trim()) missingFields.push('Last name');
    if (!member.orgId?.trim()) missingFields.push('Organization ID');
    if (missingFields.length > 0) {
        errors.push(`${missingFields.join(', ')} ${missingFields.length === 1 ? 'is' : 'are'} required`);
    }

    const hasNumber = str => /\d/.test(str);
    if (member.name?.firstName && hasNumber(member.name.firstName)) {
        errors.push('First name cannot contain numbers');
    }
    if (member.name?.lastName && hasNumber(member.name.lastName)) {
        errors.push('Last name cannot contain numbers');
    }

    if (member.parentName && hasNumber(member.parentName)) {
        errors.push('Parent name cannot contain numbers');
    }

    if (member.originalStatus && member.originalStatus.trim() !== '' && !['Active', 'RwS', 'RwoS'].includes(member.status)) {
        errors.push(`Invalid member status '${member.originalStatus}'. Valid options are: Active, RwS, RwoS`);
    }

    return {
        valid: errors.length === 0,
        errors: errors
    };
}

// Helper function to process each member's data
function processMemberData(row) {
    const originalStatus = row[2] ? String(row[2]).trim() : '';
    
    return {
        name: {
            lastName: row[0] ? String(row[0]).trim() : '',
            firstName: row[1] ? String(row[1]).trim() : '',
        },
        status: originalStatus ? mapMemberStatus(originalStatus) : 'Active',
        orgId: row[3] ? String(row[3]).trim() : '',
        parentName: row[4] && String(row[4]).trim() !== '' ? String(row[4]).trim() : 'Unknown',
        originalStatus: originalStatus,
        statusWasEmpty: !originalStatus || originalStatus === '',
        parentWasEmpty: !row[4] || String(row[4]).trim() === ''
    };
}

module.exports = {
    mapMemberStatus,
    validateMemberData,
    processMemberData
};