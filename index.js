const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const url = 'https://www.wiggle.com/vitus-nucleus-29-vrs-mountain-bike-2021'
const desiredSize = 'S';

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'youremail@gmail.com',
        pass: 'yourpassword'
    }
});

var mailOptions = {
    from: 'youremail@gmail.com',
    to: 'myfriend@yahoo.com',
    subject: 'Ayyy that mountain bike is in stock!',
    text: 'getchu that bike https://www.wiggle.com/vitus-nucleus-29-vrs-mountain-bike-2021'
};

(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)

    const items = await page.evaluate(() =>
        Array.from(document.querySelectorAll('ul.bem-sku-selector__option-group > li'),
            element => element.getAttribute('title')))

    const inStockStatuses = await page.evaluate(() =>
        Array.from(document.querySelectorAll('ul.bem-sku-selector__option-group > li'),
            element => !element.classList.contains('email-when-in-stock')))

    var inventory = items.map(function (x, i) {
        return { size: x, inStock: inStockStatuses[i] }
    });

    //console.log({inventory})

    var isDesiredItemInStock = inventory.filter(item => item.size === desiredSize.toUpperCase())[0].inStock;
    //console.log(isDesiredItemInStock)

    if (isDesiredItemInStock) {
        //send email
        console.log(`size ${desiredSize} in stock, sending email`);
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });
    }

    await browser.close()
})()