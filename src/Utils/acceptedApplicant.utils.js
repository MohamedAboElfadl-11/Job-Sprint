export const acceptedTemplate = (userName, jobTitle, companyName) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Application Accepted</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <p>Dear ${userName},</p>
    
    <p>We are pleased to inform you that your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> has been accepted.</p>

    <p>Our team will contact you soon regarding the next steps.</p>

    <p>Thank you for your interest in joining our team.</p>

    <p>Best regards,<br>
    <strong>${companyName} Hiring Team</strong></p>
</body>
</html>
`;
