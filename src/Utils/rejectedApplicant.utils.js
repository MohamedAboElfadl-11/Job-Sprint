export const rejectedTemplate = (userName, jobTitle, companyName) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Application Status Update</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <p>Dear ${userName},</p>

    <p>Thank you for applying for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>

    <p>After careful consideration, we regret to inform you that we have decided to move forward with another candidate.</p>

    <p>We appreciate your interest and encourage you to apply for future opportunities.</p>

    <p>Best regards,<br>
    <strong>${companyName} Hiring Team</strong></p>
</body>
</html>
`;
