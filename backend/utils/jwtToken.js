export const sendToken = (user, statusCode, res, message) => {
    const token = user.getJWTToken();
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    const userData = {
        _id: user._id,
        role: user.role,
    };

    res.status(statusCode)
        .cookie("token", token, options)
        .header("Authorization", `Bearer ${token}`)
        .json({
            success: true,
            user: userData,
            message,
            token,
        });
};
