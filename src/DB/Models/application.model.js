import mongoose from "mongoose";
import * as constants from "../../Constants/constants.js";

const applicationModelSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'jobs',
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        userCV: {
            secure_url: String,
            public_id: String,
            required: true
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

const ApplicationModel = mongoose.models.application || mongoose.model('application', applicationModelSchema)

export default ApplicationModel
