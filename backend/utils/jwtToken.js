class JwtToken{
    constructor(user, statusCode, res, message){
        this.user = user;
        this.statusCode = statusCode;
        this.res = res;
        this.message = message;
    }
    sendToken(){
        const token = this.user.getJWTToken();
        const options = {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
        };
    
        const userData = {
            _id: this.user._id,
            role: this.user.role,
        };
        this.res.status(this.statusCode)
            .cookie("token", token, options)
            .header("Authorization", `Bearer ${token}`)
            .json({
                success: true,
                user: userData,
                message: this.message,
                token,
            });
    }
}

export default JwtToken;