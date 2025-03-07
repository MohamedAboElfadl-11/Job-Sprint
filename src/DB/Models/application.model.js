import mongoose from "mongoose";
import * as constants from "../../Constants/constants.js";

const applicationModelSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'jobs',

        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',

        },
        userCV: {
            secure_url: String,
            public_id: String,

        },
        status: {
            type: String,
            default: constants.applicationStatus.PENDING,
            enum: Object.values(constants.applicationStatus)
        }
    },
    {
        timestamps: true
    }
)
applicationModelSchema.virtual("jobDetails", {
    ref: "jobs",
    localField: "jobId",
    foreignField: "_id",
});

applicationModelSchema.virtual("userDetails", {
    ref: "users",
    localField: "userId",
    foreignField: "_id",
});

const ApplicationModel = mongoose.models.application || mongoose.model('application', applicationModelSchema)

export default ApplicationModel
