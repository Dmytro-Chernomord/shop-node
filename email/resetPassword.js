const { EMAIL_FROM, BASE_URL } = process.env

function registrationEmail(email, token) {
    return {
        to: email,
        from: EMAIL_FROM,
        subject: 'Reset password',
        html: `<h1>Have you forgot your password?</h1>
<p>if not, ignore this email</p>
<p><a href="${BASE_URL}/auth/resetPassword/${token}">or click HERE and edit your new password</a></p>
<p><a href="${BASE_URL}">Home</a></p>`
    }
}
module.exports = registrationEmail