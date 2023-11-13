const mongoose = require('mongoose');
const LoanSchema = new mongoose.Schema({
    loanRemaining,
    loanInterest,
    loanDueDate,
    loanTerm
}, { versionKey: false });

const Loan = mongoose.model('loan', LoanSchema);

module.exports = Loan;
