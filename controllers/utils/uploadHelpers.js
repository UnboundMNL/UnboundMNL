const path = require('path');

const CONFIG = {
    SUPPORTED_FORMATS: ['.xlsx', '.xls'],
    HEADER_ROW_COUNT: 3,
    ENCODING_TYPES: ['YEARLY', 'MONTHLY']
};

// Helper function to validate the uploaded file
function validateFileUpload(file) {
    if (!file || !file.path) {
        return { valid: false, error: 'No file uploaded.' };
    }
    
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!CONFIG.SUPPORTED_FORMATS.includes(fileExtension)) {
        return { valid: false, error: 'Invalid file format. Only Excel files are supported.' };
    }
    
    return { valid: true };
}

// Helper function to validate the encoding type
function validateEncodingType(encoding, headerRow) {
    let valid = true;
    let error = '';

    for (let i = 4; i < headerRow.length; i++) {
        const header = headerRow[i];
        const headerStr = header ? String(header).trim() : '';

        if (encoding === 'YEARLY') {
            if (header && !/^\d{4}$/.test(headerStr)) {
                valid = false;
                error = `Invalid year format in header: '${headerStr}'. Expected 4-digit year.`;
                break;
            }
        } else if (encoding === 'MONTHLY') {
            const validMonths = [
                'january', 'february', 'march', 'april', 'may', 'june',
                'july', 'august', 'september', 'october', 'november', 'december'
            ];
            if (header && !validMonths.includes(headerStr.toLowerCase())) {
                valid = false;
                error = `Invalid month name in header: '${headerStr}'. Expected one of: ${validMonths.join(', ')}.`;
                break;
            }
        }
    }

    return { valid, error };
}

// Helper function to map month names to schema keys
function mapMonthNameToSchemaKey(monthName) {
    if (!monthName) return null;
    
    monthName = String(monthName).trim().toLowerCase();
    const monthMap = {
        'january': 'jan',
        'february': 'feb',
        'march': 'mar',
        'april': 'apr',
        'may': 'may',
        'june': 'jun',
        'july': 'jul',
        'august': 'aug',
        'september': 'sep',
        'october': 'oct',
        'november': 'nov',
        'december': 'dec'
    };
    
    return monthMap[monthName] || null;
}

// Helper function to safely parse numbers
function parseNumber(value, defaultValue = 0) {
    if (value === null || value === undefined || value === '') {
        return defaultValue;
    }
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
}

module.exports = {
    CONFIG,
    validateFileUpload,
    validateEncodingType,
    mapMonthNameToSchemaKey,
    parseNumber
};