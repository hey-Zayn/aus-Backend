const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

/**
 * Generate a PDF from a Handlebars template
 * @param {string} templateName - Name of the template file in templates/docs (without .hbs)
 * @param {object} data - Data to inject into the template
 * @returns {Promise<Buffer>} - PDF Buffer
 */
const generatePDF = async (templateName, data) => {
    let browser;
    try {
        const templatePath = path.join(__dirname, '../templates/docs', `${templateName}.hbs`);
        const templateHtml = fs.readFileSync(templatePath, 'utf-8');
        
        const template = handlebars.compile(templateHtml);
        const html = template({
            ...data,
            today: new Date().toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' })
        });

        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
            }
        });

        return pdfBuffer;
    } catch (error) {
        console.error(`Error generating PDF: ${error.message}`);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

module.exports = { generatePDF };
