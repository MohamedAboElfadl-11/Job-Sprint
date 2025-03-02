import mongoose from "mongoose";

const companyModelSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            unique: true
        },
        description: String,
        industry: String,
        address: String,
        numberOfEmployees: {
            type: String,
            required: true,
            match: /^[0-9]+-[0-9]+$/,
            validate: {
                validator: function (value) {
                    const range = value.split("-").map(Number);
                    return range.length === 2 && range[0] < range[1];
                },
                message: "numberOfEmployees must be a valid range like '11-20'"
            }
        },
        companyEmail: {
            type: String,
            required: true,
            unique: true
        },
        CreatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        HRs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        }],
        logo: {
            secure_url: String,
            public_id: String
        },
        coverPic: {
            secure_url: String,
            public_id: String
        },
        deletedAt: Date,
        bannedAt: Date,
        approvedByAdmin: Boolean,
        legalAttachment: {
            secure_url: String,
            public_id: String
        },

    },
    {
        timestamps: true
    }
)

const CompanyModel = mongoose.models.company || mongoose.model('company', companyModelSchema)

export default CompanyModel