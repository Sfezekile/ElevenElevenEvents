/**
 * Netlify Serverless Function: Send Email
 * 
 * This function handles email sending securely on the server-side,
 * keeping your EmailJS private key safe from exposure in the browser.
 * 
 * Deploy to: netlify/functions/send-email.js
 * 
 * Environment variables needed (set in Netlify dashboard):
 * - EMAILJS_SERVICE_ID
 * - EMAILJS_PRIVATE_KEY
 * - EMAILJS_PUBLIC_KEY
 */

const emailjs = require('@emailjs/nodejs');

// Template IDs configured in EmailJS
const TEMPLATES = {
    booking: 'template_booking',
    contact: 'template_contact'
};

// Rate limiting (simple in-memory store)
const rateLimitStore = new Map();

function isRateLimited(ip) {
    const now = Date.now();
    const limit = 5; // 5 requests
    const window = 60 * 1000; // per minute
    
    if (!rateLimitStore.has(ip)) {
        rateLimitStore.set(ip, []);
    }
    
    const timestamps = rateLimitStore.get(ip);
    const recentRequests = timestamps.filter(t => now - t < window);
    
    if (recentRequests.length >= limit) {
        return true;
    }
    
    recentRequests.push(now);
    rateLimitStore.set(ip, recentRequests);
    return false;
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePhone(phone) {
    return phone && phone.length >= 7;
}

function validateDate(dateString) {
    const selected = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
}

async function handler(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // CORS headers
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Get client IP for rate limiting
        const ip = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown';
        
        // Check rate limit
        if (isRateLimited(ip)) {
            return {
                statusCode: 429,
                headers,
                body: JSON.stringify({ error: 'Too many requests. Please wait a moment.' })
            };
        }

        const body = JSON.parse(event.body);
        const { templateType, formData } = body;

        // Validate template type
        if (!templateType || !TEMPLATES[templateType]) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid template type' })
            };
        }

        // Server-side validation
        const { email, phone, name, eventDate, guestCount } = formData;

        // Validate email
        if (!email || !validateEmail(email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid email address' })
            };
        }

        // Validate phone if booking
        if (templateType === 'booking' && (!phone || !validatePhone(phone))) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid phone number' })
            };
        }

        // Validate date if booking
        if (templateType === 'booking' && eventDate) {
            if (!validateDate(eventDate)) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Event date must be in the future' })
                };
            }
        }

        // Validate guest count if booking
        if (templateType === 'booking' && guestCount) {
            const count = parseInt(guestCount, 10);
            if (count < 1 || count > 500) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Guest count must be between 1 and 500' })
                };
            }
        }

        // Validate name
        if (!name || name.trim().length < 2) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid name' })
            };
        }

        // Initialize EmailJS with private key
        emailjs.init({
            publicKey: process.env.EMAILJS_PUBLIC_KEY,
            privateKey: process.env.EMAILJS_PRIVATE_KEY,
            limitRate: {
                id: 'posted',
                throttle: 50
            }
        });

        // Sanitize data (remove HTML tags, limit string lengths)
        const sanitizedData = {};
        for (const [key, value] of Object.entries(formData)) {
            if (typeof value === 'string') {
                sanitizedData[key] = value
                    .replace(/<[^>]*>/g, '') // Remove HTML tags
                    .substring(0, 500);      // Limit length
            } else {
                sanitizedData[key] = value;
            }
        }

        // Send email
        const response = await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            TEMPLATES[templateType],
            sanitizedData
        );

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Email sent successfully',
                response
            })
        };

    } catch (error) {
        console.error('Email send error:', error);

        // Don't expose internal error details to client
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Failed to send email. Please try again later.',
                // Only include error ID for support debugging
                errorId: Date.now()
            })
        };
    }
}

module.exports = { handler };

/**
 * DEPLOYMENT INSTRUCTIONS:
 * 
 * 1. Create netlify/functions/send-email.js with this code
 * 
 * 2. Install EmailJS Node package:
 *    npm install @emailjs/nodejs
 * 
 * 3. Set environment variables in Netlify dashboard:
 *    - Go to Site settings > Build & deploy > Environment
 *    - Add:
 *      EMAILJS_SERVICE_ID=service_q5op5eg
 *      EMAILJS_PUBLIC_KEY=xhF-F6jL3C56vfff-
 *      EMAILJS_PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
 *      ALLOWED_ORIGINS=https://your-domain.com
 * 
 * 4. Update frontend code to call this function:
 *    
 *    // In main-fixed.js, replace emailjs.send() with:
 *    const response = await fetch('/.netlify/functions/send-email', {
 *        method: 'POST',
 *        headers: { 'Content-Type': 'application/json' },
 *        body: JSON.stringify({
 *            templateType: 'booking', // or 'contact'
 *            formData: { email, name, phone, ... }
 *        })
 *    });
 *    
 *    const result = await response.json();
 *    if (!response.ok) throw new Error(result.error);
 * 
 * 5. Deploy!
 */