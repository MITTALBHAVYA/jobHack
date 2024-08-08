import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import JwtToken from "../utils/jwtToken.js";
import { v2 as cloudinary } from "cloudinary";

class UserController {
    static register = catchAsyncError(async (req, res, next) => {
        const {
            name,
            email,
            phone,
            address,
            role,
            password,
            confirmPassword,
            firstNiche,
            secondNiche,
            thirdNiche,
            coverLetter
        } = req.body;
        if (!name || !email || !phone || !role || !password || !confirmPassword || !address) {
            return next(new ErrorHandler("Please fill the registration form!!"));
        }
        if (role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
            return next(new ErrorHandler("Please provide your preferred job niches.", 400));
        }
        const isEmail = await User.findOne({ email });
        if (isEmail) {
            return next(new ErrorHandler("Email already exists!"));
        }
        const userData = {
            name,
            email,
            phone,
            address,
            niches: {
                firstNiche,
                secondNiche,
                thirdNiche,
            },
            password,
            confirmPassword,
            coverLetter,
            role,
        };
        if (req.files && req.files.resume) {
            const { resume } = req.files;
            if (resume) {
                try {
                    const cloudinaryResponse = await cloudinary.uploader.upload(
                        resume.tempFilePath,
                        { folder: "Job_Seekers_Resume" }
                    );
                    if (!cloudinaryResponse || cloudinaryResponse.error) {
                        return next(new ErrorHandler("Failed to upload resume to cloud.", 500));
                    }
                    userData.resume = {
                        public_id: cloudinaryResponse.public_id,
                        url: cloudinaryResponse.secure_url,
                    };
                } catch (error) {
                    return next(new ErrorHandler("Failed to upload resume.", 500));
                }
            }
        }
        const user = await User.create(userData);
        const jwtToken = new JwtToken(user, 201, res, "USER REGISTERED SUCCESSFULLY");
        jwtToken.sendToken();
    });

    static login = catchAsyncError(async (req, res, next) => {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return next(new ErrorHandler(`PLEASE PROVIDE THE EMAIL, PASSWORD, ROLE`, 400));
        }
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler(`INVALID EMAIL OR PASSWORD`, 400));
        }
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return next(new ErrorHandler('INVALID PASSWORD', 400));
        }
        if (user.role !== role) {
            return next(new ErrorHandler('USER WITH ROLE NOT FOUND', 400));
        }
        const jwtToken = new JwtToken(user, 201, res, "USER LOGIN SUCCESSFULLY!");
        jwtToken.sendToken();
    });

    static logout = catchAsyncError(async (req, res, next) => {
        res.status(201).cookie("token", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        })
            .json({
                success: true,
                message: "USER LOGGED OUT SUCCESSFULLY!!",
            });
    });

    static getUser = catchAsyncError(async (req, res, next) => {
        const user = req.user;
        res.status(200).json({
            success: true,
            user,
        });
    });

    static updateProfile = catchAsyncError(async (req, res, next) => {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            coverLetter: req.body.coverLetter,
            niches: {
                firstNiche: req.body.firstNiche,
                secondNiche: req.body.secondNiche,
                thirdNiche: req.body.thirdNiche,
            },
        };

        const { firstNiche, secondNiche, thirdNiche } = newUserData.niches;

        if (
            req.user.role === "Job Seeker" &&
            (!firstNiche || !secondNiche || !thirdNiche)
        ) {
            return next(new ErrorHandler("Please provide your all preferred job niches.", 400));
        }
        if (req.files) {
            const resume = req.files.resume;
            if (resume) {
                const currentResumeId = req.user.resume.public_id;
                if (currentResumeId) {
                    await cloudinary.uploader.destroy(currentResumeId);
                }
                const newResume = await cloudinary.uploader.upload(resume.tempFilePath, {
                    folder: "Job_Seekers_Resume",
                });
                newUserData.resume = {
                    public_id: newResume.public_id,
                    url: newResume.secure_url,
                };
            }
        }
        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
            user,
            message: "Profile updated.",
        });
    });

    static updatePassword = catchAsyncError(async (req, res, next) => {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return next(new ErrorHandler("All fields are required.", 400));
        }

        const user = await User.findById(req.user.id).select("+password");
        const isPasswordMatched = await user.comparePassword(oldPassword);

        if (!isPasswordMatched) {
            return next(new ErrorHandler("Old password is incorrect.", 400));
        }

        if (newPassword !== confirmPassword) {
            return next(new ErrorHandler("New password and confirmation do not match.", 400));
        }

        user.password = newPassword;
        user.confirmPassword = confirmPassword;
        await user.save();

        // Send token or response
        const jwtToken = new JwtToken(user, 200, res, "Password updated successfully.");
        jwtToken.sendToken();
    });

    static deleteUser = catchAsyncError(async (req, res, next) => {
        const { role, _id } = req.user;
        let user = await User.findById(_id);

        if (!user) {
            return next(new ErrorHandler("USER NOT FOUND", 404));
        }

        if (role !== "Job Seeker") {
            user = await User.findByIdAndDelete(_id);
            return res.status(200).json({
                success: true,
                message: "USER DELETED SUCCESSFULLY!!",
            });
        }

        const resume = user.resume;
        if (resume) {
            await cloudinary.uploader.destroy(resume.public_id);
        }

        user = await User.findByIdAndDelete(_id);
        res.status(200).json({
            success: true,
            message: "USER DELETED SUCCESSFULLY!!",
        });
    });
}

export default UserController;
