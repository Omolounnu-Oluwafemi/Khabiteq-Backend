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

export function generatePropertyRentBriefEmail(data: any) {
  console.log(data);
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Property Rental Brief</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h2 {
                color: #333;
            }
            p {
                line-height: 1.6;
            }
            .details {
                background: #f9f9f9;
                padding: 10px;
                border-radius: 5px;
            }
                .pictures {
                display: flex;
                flex-wrap: wrap;
                justify-content: center
                gap: 10px;
                }
            .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 14px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>New Property Rental Brief Created</h2>
            <p>A new property rental brief has been submitted for rent. Here are the details:</p>
            
            <div class="details">
                <p><strong>Property Type:</strong> ${data.propertyType}</p>
                <p><strong>Condition:</strong> ${data.propertyCondition}</p>
                <p><strong>Location:</strong> ${data.location.state}, ${data.location.localGovernment}, ${
    data.location.area
  }</p>
                <p><strong>Rental Price:</strong> ₦${data.rentalPrice}</p>
                <p><strong>Number of Bedrooms:</strong> ${data.noOfBedrooms}</p>
                <p><strong>Features:</strong> ${data.features.map((f: any) => f.featureName).join(', ')}</p>
                <p><strong>Tenant Criteria:</strong> ${data.tenantCriteria.map((c: any) => c.criteria).join(', ')}</p>
                <p>Owner Email: ${data.owner.email}</p>
                <p><strong>Owner Name:</strong> ${data.owner.fullName}</p>
                <p><strong>Owner Phone:</strong> ${data.owner.phoneNumber}</p>

                <p><strong>Owner Status:</strong> ${data.areYouTheOwner ? 'Yes' : 'No'}</p>
                <p><strong>Availability:</strong> ${data.isAvailable}</p>
                <p><strong>Budget Range:</strong> ${data.budgetRange || 'N/A'}</p>
            </div>
    
            ${
              data.pictures && data.pictures.length
                ? `
            <h3>Property Pictures</h3>
            <div class="pictures">
                ${data.pictures
                  .map(
                    (pic: any) =>
                      `<img src="${pic}" alt="Property Image" width="400px" height="400px" style="margin-top: 10px; border-radius: 5px;">`
                  )
                  .join('')}
            </div>
            `
                : ''
            }
            
            ${data.isAdmin ? '<p>Admin, please review and take the necessary actions.</p>' : ''}
            <div class="footer">&copy; ${new Date().getFullYear()} Khabi-Teq</div>
        </div>
    </body>
    </html>
    `;
}

export function generatePropertySellBriefEmail(data: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Property Brief</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
            }
            .container {
                max-width: 900px;
                margin: 0 auto;
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h2 {
                color: #333;
            }
            p {
                line-height: 1.6;
            }
            .details {
                background: #f9f9f9;
                padding: 10px;
                border-radius: 5px;
            }
            .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 14px;
                color: #777;
            }
                .pictures {
                display: flex;
                flex-wrap: wrap;
                justify-content: center
                gap: 10px;
                }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>New Property Brief Created</h2>
            <p>A new property brief has been submitted for sale. Here are the details:</p>
            
            <div class="details">
                <p><strong>Property Type:</strong> ${data.propertyType}</p>
                <p><strong>Location:</strong> ${data.location.state}, ${data.location.localGovernment}, ${
    data.location.area
  }</p>
                <p><strong>Price:</strong> ₦${data.price || data.rentalPrice}</p>
                <p><strong>Number of Bedrooms:</strong> ${data.propertyFeatures?.noOfBedrooms || data.noOfBedrooms}</p>
                <p><strong>Features:</strong> ${
                  data.propertyFeatures?.additionalFeatures?.join(', ') ||
                  data.features?.map((f: any) => f.featureName).join(', ')
                }</p>
                <p><strong>Tenant Criteria:</strong> ${
                  data.tenantCriteria?.map((c: any) => c.criteria).join(', ') || 'N/A'
                }</p>
                <p><strong>Documents on Property:</strong> ${
                  data.docOnProperty
                    ?.map((doc: any) => `${doc.docName} (${doc.isProvided ? 'Provided' : 'Not Provided'})`)
                    .join(', ') || 'N/A'
                }</p>
                <p>Owner Email: ${data.owner.email}</p>
                <p><strong>Owner Name:</strong> ${data.owner.fullName}</p>
                <p><strong>Owner Phone:</strong> ${data.owner.phoneNumber}</p>
                <p><strong>Owner Status:</strong> ${data.areYouTheOwner ? 'Yes' : 'No'}</p>
                <p><strong>Usage Options:</strong> ${data.usageOptions?.join(', ') || 'N/A'}</p>
                <p><strong>Availability:</strong> ${data.isAvailable ? 'Yes' : 'No'}</p>
                <p><strong>Budget Range:</strong> ${data.budgetRange || 'N/A'}</p>
            </div>
    
            ${
              data.pictures && data.pictures.length
                ? `
            <h3>Property Pictures</h3>
            <div class="pictures">
                ${data.pictures
                  .map(
                    (pic: any) =>
                      `<img src="${pic}" alt="Property Image" width="400px" height="400px" style="margin-top: 10px; border-radius: 5px;">`
                  )
                  .join('')}
            </div>
            `
                : ''
            }
            
            ${data.isAdmin ? '<p>Admin, please review and take the necessary actions.</p>' : ''}
            <div class="footer">&copy; ${new Date().getFullYear()} Khabi-Teq</div>
        </div>
    </body>
    </html>
    `;
}

export function propertySellPreferenceTemplate(data: any) {
  return `
        <!DOCTYPE html>
        <html>
        <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Property Preference</title>
                <style>
                        body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                padding: 20px;
                        }
                        .container {
                                max-width: 600px;
                                margin: 0 auto;
                                background: #fff;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h2 {
                                color: #333;
                        }
                        p {
                                line-height: 1.6;
                        }
                        .details {
                                background: #f9f9f9;
                                padding: 10px;
                                border-radius: 5px;
                        }
                        .footer {
                                margin-top: 20px;
                                text-align: center;
                                font-size: 14px;
                                color: #777;
                        }
                </style>
        </head>
        <body>
                <div class="container">
                        <h2>New Property Preference</h2>
                        <p>A new property preference has been submitted. Here are the details:</p>
                        
                        <div class="details">
                                <p><strong>Property Type:</strong> ${data.propertyType}</p>
                                <p><strong>Location:</strong> ${data.location.state}, ${
    data.location.localGovernment
  }, ${data.location.area}</p>
                                <p><strong>Price:</strong> ₦${data.price}</p>
                                <p><strong>Number of Bedrooms:</strong> ${data.propertyFeatures.noOfBedrooms}</p>
                                <p><strong>Additional Features:</strong> ${data.propertyFeatures.additionalFeatures.join(
                                  ', '
                                )}</p>
                                <p><strong>Documents on Property:</strong> ${data.docOnProperty
                                  .map((doc: any) => `${doc.docName} (${doc.isProvided ? 'Provided' : 'Not Provided'})`)
                                  .join(', ')}</p>
                                <p><strong>Owner Email:</strong> ${data.owner.email}</p>
                                <p><strong>Owner Name:</strong> ${data.owner.fullName}</p>
                                <p><strong>Owner Phone:</strong> ${data.owner.phoneNumber}</p>
                                <p><strong>Usage Options:</strong> ${data.usageOptions.join(', ')}</p>
                                <p><strong>Budget Range:</strong> ${data.budgetRange || 'N/A'}</p>
                        </div>
                        
                        <div class="footer">&copy; ${new Date().getFullYear()} Khabi-Teq</div>
                </div>
        </body>
        </html>
        `;
}

export function propertyRentPreferenceTemplate(data: any) {
  return `
        <!DOCTYPE html>
        <html>
        <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Property Rent Preference</title>
                <style>
                        body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                padding: 20px;
                        }
                        .container {
                                max-width: 600px;
                                margin: 0 auto;
                                background: #fff;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h2 {
                                color: #333;
                        }
                        p {
                                line-height: 1.6;
                        }
                        .details {
                                background: #f9f9f9;
                                padding: 10px;
                                border-radius: 5px;
                        }
                        .footer {
                                margin-top: 20px;
                                text-align: center;
                                font-size: 14px;
                                color: #777;
                        }
                </style>
        </head>
        <body>
                <div class="container">
                        <h2>New Property Rent Preference</h2>
                        <p>A new property rent preference has been submitted. Here are the details:</p>
                        
                        <div class="details">
                                <p><strong>Property Type:</strong> ${data.propertyType}</p>
                                <p><strong>Condition:</strong> ${data.propertyCondition}</p>
                                <p><strong>Location:</strong> ${data.location.state}, ${
    data.location.localGovernment
  }, ${data.location.area}</p>
                                <p><strong>Rental Price:</strong> ₦${data.rentalPrice}</p>
                                <p><strong>Number of Bedrooms:</strong> ${data.noOfBedrooms}</p>
                                <p><strong>Features:</strong> ${data.features
                                  .map((f: any) => f.featureName)
                                  .join(', ')}</p>
                                <p><strong>Tenant Criteria:</strong> ${data.tenantCriteria
                                  .map((c: any) => c.criteria)
                                  .join(', ')}</p>
                                <p><strong>Owner Email:</strong> ${data.owner.email}</p>
                                <p><strong>Owner Name:</strong> ${data.owner.fullName}</p>
                                <p><strong>Owner Phone:</strong> ${data.owner.phoneNumber}</p>
                                <p><strong>Budget Range:</strong> ${data.budgetRange || 'N/A'}</p>
                        </div>
                        
                        <div class="footer">&copy; ${new Date().getFullYear()} Khabi-Teq</div>
                </div>
        </body>
        </html>
        `;
}

export function buyerPropertyRentPreferenceTemplate(data: any) {
  return `
        <!DOCTYPE html>
        <html>
        <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Property Rent Preference</title>
                <style>
                        body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                padding: 20px;
                        }
                        .container {
                                max-width: 600px;
                                margin: 0 auto;
                                background: #fff;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h2 {
                                color: #333;
                        }
                        p {
                                line-height: 1.6;
                        }
                        .details {
                                background: #f9f9f9;
                                padding: 10px;
                                border-radius: 5px;
                        }
                        .footer {
                                margin-top: 20px;
                                text-align: center;
                                font-size: 14px;
                                color: #777;
                        }
                </style>
        </head>
        <body>
                <div class="container">
                        <h2>Property Rent Preference Request</h2>
                        <p>A new property rent preference has been submitted by you. Here are the details:</p>
                        
                        <div class="details">
                                <p><strong>Property Type:</strong> ${data.propertyType}</p>
                                <p><strong>Condition:</strong> ${data.propertyCondition}</p>
                                <p><strong>Location:</strong> ${data.location.state}, ${
    data.location.localGovernment
  }, ${data.location.area}</p>
                                <p><strong>Rental Price:</strong> ₦${data.rentalPrice}</p>
                                <p><strong>Number of Bedrooms:</strong> ${data.noOfBedrooms}</p>
                                <p><strong>Features:</strong> ${data.features
                                  .map((f: any) => f.featureName)
                                  .join(', ')}</p>
                                <p><strong>Tenant Criteria:</strong> ${data.tenantCriteria
                                  .map((c: any) => c.criteria)
                                  .join(', ')}</p>
                                <p><strong>Your Email:</strong> ${data.owner.email}</p>
                                <p><strong>Your Name:</strong> ${data.owner.fullName}</p>
                                <p><strong>Your Phone:</strong> ${data.owner.phoneNumber}</p>
                                <p><strong>Budget Range:</strong> ${data.budgetRange || 'N/A'}</p>
                        </div>
                        
                        <div class="footer">&copy; ${new Date().getFullYear()} Khabi-Teq</div>
                </div>
        </body>
        </html>
        `;
}

export function buyerPropertySellPreferenceTemplate(data: any) {
  return `
        <!DOCTYPE html>
        <html>
        <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Property Preference</title>
                <style>
                        body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                padding: 20px;
                        }
                        .container {
                                max-width: 600px;
                                margin: 0 auto;
                                background: #fff;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h2 {
                                color: #333;
                        }
                        p {
                                line-height: 1.6;
                        }
                        .details {
                                background: #f9f9f9;
                                padding: 10px;
                                border-radius: 5px;
                        }
                        .footer {
                                margin-top: 20px;
                                text-align: center;
                                font-size: 14px;
                                color: #777;
                        }
                </style>
        </head>
        <body>
                <div class="container">
                        <h2>New Property Request for sale</h2>
                        <p>A for-sale new property preference has been submitted by you. Here are the details:</p>
                        
                        <div class="details">
                                <p><strong>Property Type:</strong> ${data.propertyType}</p>
                                <p><strong>Location:</strong> ${data.location.state}, ${
    data.location.localGovernment
  }, ${data.location.area}</p>
                                <p><strong>Price:</strong> ₦${data.price}</p>
                                <p><strong>Number of Bedrooms:</strong> ${data.propertyFeatures.noOfBedrooms}</p>
                                <p><strong>Additional Features:</strong> ${data.propertyFeatures.additionalFeatures.join(
                                  ', '
                                )}</p>
                                <p><strong>Documents on Property:</strong> ${data.docOnProperty
                                  .map((doc: any) => `${doc.docName} (${doc.isProvided ? 'Provided' : 'Not Provided'})`)
                                  .join(', ')}</p>
                                <p><strong>Your Email:</strong> ${data.owner.email}</p>
                                <p><strong>Your Name:</strong> ${data.owner.fullName}</p>
                                <p><strong>Your Phone:</strong> ${data.owner.phoneNumber}</p>
                                <p><strong>Usage Options:</strong> ${data.usageOptions.join(', ')}</p>
                                <p><strong>Budget Range:</strong> ${data.budgetRange || 'N/A'}</p>
                        </div>
                        
                        <div class="footer">&copy; ${new Date().getFullYear()} Khabi-Teq</div>
                </div>
        </body>
        </html>
        `;
}

export function ForgotPasswordVerificationTemplate(email: string, verificationLink: string): string {
  return `
                        <html>
                        <body>
                                <p>Dear ${email},</p>
                                <p>You requested to reset your password. Please click the link below to reset your password:</p>
                                <p>🔗 <a href="${verificationLink}">Reset Password</a></p>
                                <p>Best regards,<br/>
                                Khabi-Teq Realty</p>
                        </body>
                        </html>
                `;
}

export function PropertyApprovedOrDisapprovedTemplate(name: string, status: string, data: any): string {
  return `
                <!DOCTYPE html>
                <html>
                <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Property ${status}</title>
                        <style>
                                body {
                                        font-family: Arial, sans-serif;
                                        background-color: #f4f4f4;
                                        padding: 20px;
                                }
                                .container {
                                        max-width: 600px;
                                        margin: 0 auto;
                                        background: #fff;
                                        padding: 20px;
                                        border-radius: 8px;
                                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                }
                                h2 {
                                        color: #333;
                                }
                                p {
                                        line-height: 1.6;
                                }
                                .details {
                                        background: #f9f9f9;
                                        padding: 10px;
                                        border-radius: 5px;
                                }
                                .footer {
                                        margin-top: 20px;
                                        text-align: center;
                                        font-size: 14px;
                                        color: #777;
                                }
                        </style>
                </head>
                <body>
                        <div class="container">
                        <h1> Hello ${name},</h1>
                                <h2>Property ${status}</h2>
                                <p>Your property ${status} successfully. Here are the details:</p>
                                
                                <div class="details">
                                        <p><strong>Property Type:</strong> ${data.propertyType}</p>
                                        <p><strong>Location:</strong> ${data.location.state}, ${
    data.location.localGovernment ? data.location.localGovernment + ', ' : ''
  }${data.location.area}</p>
                                        <p><strong>Price:</strong> ₦${data.price || data.rentalPrice}</p>
                                        <p><strong>Number of Bedrooms:</strong> ${
                                          data.propertyFeatures?.noOfBedrooms || data.noOfBedrooms
                                        }</p>
                                        <p><strong>Features:</strong> ${
                                          data.propertyFeatures?.additionalFeatures?.join(', ') ||
                                          data.features?.map((f: any) => f.featureName).join(', ')
                                        }</p>
                                        <p><strong>Tenant Criteria:</strong> ${
                                          data.tenantCriteria?.map((c: any) => c.criteria).join(', ') || 'N/A'
                                        }</p>
                                        <p><strong>Documents on Property:</strong> ${
                                          data.docOnProperty
                                            ?.map(
                                              (doc: any) =>
                                                `${doc.docName} (${doc.isProvided ? 'Provided' : 'Not Provided'})`
                                            )
                                            .join(', ') || 'N/A'
                                        }</p>
                                        <p><strong>Owner Email:</strong> ${data.owner.email}</p>
                                        <p><strong>Owner Name:</strong> ${data.owner.fullName}</p>
                                        <p><strong>Owner Phone:</strong> ${data.owner.phoneNumber}</p>
                                        <p><strong>Owner Status:</strong> ${data.areYouTheOwner ? 'Yes' : 'No'}</p>
                                        <p><strong>Usage Options:</strong> ${data.usageOptions?.join(', ') || 'N/A'}</p>
                                        <p><strong>Availability:</strong> ${data.isAvailable ? 'Yes' : 'No'}</p>
                                        <p><strong>Budget Range:</strong> ${data.budgetRange || 'N/A'}</p>
                                </div>
                                
                                ${
                                  data.pictures && data.pictures.length
                                    ? `
                                <h3>Property Pictures</h3>
                                <div class="pictures">
                                        ${data.pictures
                                          .map(
                                            (pic: any) =>
                                              `<img src="${pic}" alt="Property Image" width="400px" height="400px" style="margin-top: 10px; border-radius: 5px;">`
                                          )
                                          .join('')}
                                </div>
                                `
                                    : ''
                                }
                                
                                <div class="footer">&copy; ${new Date().getFullYear()} Khabi-Teq</div>                   </div>       </body>           </html>           `;
}
export function DeactivateOrActivateAgent(name: string, status: boolean, reason: string): string {
  return `
                <!DOCTYPE html>
                <html>
                <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Agent ${status}</title>
                        <style>
                                body {
                                        font-family: Arial, sans-serif;
                                        background-color: #f4f4f4;
                                        padding: 20px;
                                }
                                .container {
                                        max-width: 600px;
                                        margin: 0 auto;
                                        background: #fff;
                                        padding: 20px;
                                        border-radius: 8px;
                                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                }
                                h2 {
                                        color: #333;
                                }
                                p {
                                        line-height: 1.6;
                                }
                                .details {
                                        background: #f9f9f9;
                                        padding: 10px;
                                        border-radius: 5px;
                                }
                                .footer {
                                        margin-top: 20px;
                                        text-align: center;
                                        font-size: 14px;
                                        color: #777;
                                }
                        </style>
                </head>
                <body>
                        <div class="container">
                        <h1> Hello ${name},</h1>
                                <h2>Agent ${status ? 'Deactivated' : 'Activated'}</h2>
                                <p>Your agent account has been ${status ? 'deactivated or suspended' : 'activated'}</p>
                                ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
                                <div class="footer">&copy; ${new Date().getFullYear()} Khabi-Teq</div>                   </div>       </body>           </html>           `;
}
export function DeleteAgent(name: string, reason: string): string {
  return `
                        <!DOCTYPE html>
                        <html>
                        <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>Agent Deleted</title>
                                <style>
                                        body {
                                                font-family: Arial, sans-serif;
                                                background-color: #f4f4f4;
                                                padding: 20px;
                                        }
                                        .container {
                                                max-width: 600px;
                                                margin: 0 auto;
                                                background: #fff;
                                                padding: 20px;
                                                border-radius: 8px;
                                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                        }
                                        h2 {
                                                color: #333;
                                        }
                                        p {
                                                line-height: 1.6;
                                        }
                                        .details {
                                                background: #f9f9f9;
                                                padding: 10px;
                                                border-radius: 5px;
                                        }
                                        .footer {
                                                margin-top: 20px;
                                                text-align: center;
                                                font-size: 14px;
                                                color: #777;
                                        }
                                </style>
                        </head>
                        <body>
                                <div class="container">
                                <h1> Hello ${name},</h1>
                                        <h2>Agent Deleted</h2>
                                        <p>Your agent account has been deleted. Due to: </p>
                                        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
                                        <div class="footer">&copy; ${new Date().getFullYear()} Khabi-Teq</div>                   </div>       </body>           </html>           `;
}
