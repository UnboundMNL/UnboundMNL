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

// Helper function to validate the encoding
function validateEncoding(headerRow) {
    let valid = true;
    let error = '';

    for (let i = 1; i < headerRow.length; i++) {
        const header = headerRow[i];
        const headerStr = header ? String(header).trim() : '';

        if (!header || headerStr === '') {
            continue; // Skip empty headers
        }

        if (headerStr.toLowerCase().includes('deductions')) {
            continue; // Skip deductions headers
        }
        
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

    return { valid, error };
}

// Helper function to validate header structure
function validateHeaderStructure(headerRow) {
    const expectedHeaders = [
        'Last Name of SC/SY',
        'First Name of SC/SY', 
        'Status',
        'CHID',
        'Name of Parent'
    ];
    
    const errors = [];
    
    if (!headerRow || headerRow.length < expectedHeaders.length) {
        return {
            valid: false,
            error: 'Template structure is invalid. Missing required columns. Please use the correct template.'
        };
    }
    
    for (let i = 0; i < expectedHeaders.length; i++) {
        const expectedHeader = expectedHeaders[i];
        const actualHeader = headerRow[i] ? String(headerRow[i]).trim() : '';
        
        if (actualHeader.toLowerCase() !== expectedHeader.toLowerCase()) {
            errors.push(`Column ${i + 1} should be "${expectedHeader}" but found "${actualHeader || '(empty)'}"`);
        }
    }
    
    let savingsMatchPattern = true;
    let savingsMatchErrors = [];
    
    for (let i = 5; i < headerRow.length; i++) {
        const header = headerRow[i] ? String(headerRow[i]).trim() : '';
        
        if (!header || header === '') {
            continue;
        }
        
        if (header.toLowerCase().includes('deductions')) {
            continue;
        }
        
        
        const isEvenPosition = (i - 5) % 2 === 0;
        const expectedType = isEvenPosition ? 'Savings' : 'Match';
        
        if (header.toLowerCase() !== expectedType.toLowerCase()) {
            savingsMatchPattern = false;
            savingsMatchErrors.push(`Column ${i + 1} should be "${expectedType}" but found "${header}"`);
        }
    }
    
    if (errors.length > 0) {
        return {
            valid: false,
            error: `Template structure is invalid. ${errors.join(', ')}. Please use the correct template.`
        };
    }
    
    if (!savingsMatchPattern && savingsMatchErrors.length > 0) {
        return {
            valid: false,
            error: `Template structure is invalid. Monthly columns should alternate between "Savings" and "Match". ${savingsMatchErrors.slice(0, 3).join(', ')}${savingsMatchErrors.length > 3 ? '...' : ''}. Please use the correct template.`
        };
    }
    
    return { valid: true };
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
    if (value === null || value === undefined || value === '' || value ==='-') {
        return defaultValue;
    }
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
}

function isValidNumericValue(value) {
    if (value === null || value === undefined || value === '' || value === 0) {
        return true;
    }

    const stringValue = String(value).trim();

    if (stringValue === '' || stringValue === '-') {
        return true;
    }
    
    if (!/^-?\d*\.?\d*$/.test(stringValue)) {
        return false;
    }
    
    const parsed = parseFloat(stringValue);
    return !isNaN(parsed) && isFinite(parsed);
}

module.exports = {
    CONFIG,
    validateFileUpload,
    validateEncoding,
    validateHeaderStructure,
    mapMonthNameToSchemaKey,
    parseNumber,
    isValidNumericValue
};