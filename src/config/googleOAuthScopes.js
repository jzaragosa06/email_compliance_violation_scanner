const SCOPES = {
    ORG_USER_ACCOUNT: [
        'https://www.googleapis.com/auth/gmail.readonly',
    ],
    REGISTER: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
    ],
    LOGIN: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
    ]
}

module.exports = SCOPES; 