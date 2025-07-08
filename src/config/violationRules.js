const VIOLATION_RULES = {
    EXTERNAL_SHARING: {
        name: 'External Data Sharing',
        severity: 'HIGH',
        patterns: [
            /confidential.*@(?!.*your-domain\.com)/i,
            /proprietary.*@(?!.*your-domain\.com)/i,
            /internal.*@(?!.*your-domain\.com)/i,
            /private.*@(?!.*your-domain\.com)/i
        ],
        checkAttachments: true
    },
    SENSITIVE_KEYWORDS: {
        name: 'Sensitive Information',
        severity: 'MEDIUM',
        patterns: [
            /social security number/i,
            /ssn[\s:]*\d{3}-?\d{2}-?\d{4}/i,
            /credit card/i,
            /password[\s:]*[^\s]+/i,
            /api[_\s]?key[\s:]*[^\s]+/i,
            /bank account/i,
            /routing number/i
        ]
    },
    LARGE_ATTACHMENTS: {
        name: 'Large Attachment Policy',
        severity: 'LOW',
        maxSize: 25 * 1024 * 1024, // 25MB - expressed in bytes. kb then multiply that to 1024 to make a mb. then multiple to n to get n mb
        // maxSize: 25 * 1024
        checkSize: true
    },
    PHISHING_INDICATORS: {
        name: 'Potential Phishing',
        severity: 'HIGH',
        patterns: [
            /urgent.*action.*required/i,
            /verify.*account.*immediately/i,
            /click.*here.*now/i,
            /suspended.*account/i,
            /security.*alert/i,
            /immediate.*response.*required/i
        ]
    },
    POLICY_VIOLATIONS: {
        name: 'Company Policy Violations',
        severity: 'MEDIUM',
        patterns: [
            /resignation.*letter/i,
            /job.*interview/i,
            /competitor.*information/i,
            /layoff.*plan/i
        ]
    }
};

module.exports = VIOLATION_RULES; 