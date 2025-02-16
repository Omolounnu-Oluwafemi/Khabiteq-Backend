export const propertyRequestTemplate = (buyerName: string, propertyAddress: string): string => {
  return `
                <html>
                <body>
                        <p>Dear ${buyerName},</p>
                        <p>Thank you for your interest in inspecting the property at ${propertyAddress}. We are currently
                        confirming availability and will update you shortly with the next steps.</p>
                        <p>Best regards,<br/>
                        Khabi-Teq Realty</p>
                </body>
                </html>
        `;
};

export const agentNotificationTemplate = (agentName: string, propertyAddress: string): string => {
  return `
                <html>
                <body>
                        <p>Dear ${agentName},</p>
                        <p>A buyer has requested an inspection for ${propertyAddress}. Please confirm
                        availability within 24 hours. Let us know if the property is no longer available.</p>
                        <p>Best regards,<br/>
                        Khabi-Teq Realty</p>
                </body>
                </html>
        `;
};

export const propertyAvailableTemplate = (agentName: string, propertyAddress: string, calendlyLink: string): string => {
  return `
                <html>
                <body>
                        <p>Dear ${agentName},</p>
                        <p>We are pleased to inform you that the property at ${propertyAddress} is available for inspection.
                        Please select a convenient date and time using the link below:</p>
                        <p>📅 <a href="${calendlyLink}">Schedule Inspection</a></p>
                        <p>Best regards,<br/>
                        Khabi-Teq Realty</p>
                </body>
                </html>
        `;
};

export const propertyNotAvailableTemplate = (recepientName: string, propertyAddress: string): string => {
  return `
                <html>
                <body>
                        <p>Dear ${recepientName},</p>
                        <p>We regret to inform you that ${propertyAddress} is no longer available. However, we
                        have similar properties that match your criteria. Please let us know if you’d like to
                        explore them.</p>
                        <p>Best regards,<br/>
                        Khabi-Teq Realty</p>
                </body>
                </html>
        `;
};

export const inspectionScheduledTemplate = (agentName: string, propertyAddress: string, dateTime: string): string => {
  return `
                                                                <html>
                                                                <body>
                                                                                                <p>Dear ${agentName},</p>
                                                                                                <p>The inspection for ${propertyAddress} has been scheduled for ${dateTime}. Please
                                                                                                ensure you are available to meet the buyer. Contact us if any issues arise.</p>
                                                                                                <p>Best regards,<br/>
                                                                                                Khabi-Teq Realty</p>
                                                                </body>
                                                                </html>
                                `;
};

export const verifyEmailTemplate = (name: string, verificationLink: string): string => {
  return `
                        <html>
                        <body>
                                <p>Dear ${name},</p>
                                <p>Thank you for signing up with Khabi-Teq Realty. Please verify your email address by clicking the link below:</p>
                                <p>🔗 <a href="${verificationLink}">Verify Email</a></p>
                                <p>Best regards,<br/>
                                Khabi-Teq Realty</p>
                        </body>
                        </html>
                `;
};
