const { EMAIL_FROM, BASE_URL } = process.env

function registrationEmail(to) {
    return {
        to,
        from: EMAIL_FROM,
        subject: 'Account created',
        html: `
            <h1>Welcome</h1>
            <p>You have succesfully created new account for ${BASE_URL}</p>
            `
    }
}
module.exports = registrationEmail