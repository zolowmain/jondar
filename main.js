const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const readlineSync = require('readline-sync');

async function loginWithCookie() {
    try {
        // Baca cookie dari file notepad
        const cookieFilePath = 'cookies.txt';
        const cookieData = fs.readFileSync(cookieFilePath, 'utf8');

        // Memisahkan cookie menjadi array
        const cookies = cookieData.split(';').map(cookie => {
            const parts = cookie.split('=');
            return {
                name: parts[0].trim(),
                value: parts.slice(1).join('=').trim(),
                domain: '.shopee.co.id' // Sesuaikan dengan domain Shopee
            };
        });

        // Gunakan plugin Stealth
        puppeteer.use(StealthPlugin());
        const iniUrl = readlineSync.question('Masukkan URL: ');
        const iniView = parseInt(readlineSync.question('Masukkan View: '));
        // Meluncurkan browser Puppeteer
        const browser = await puppeteer.launch({ headless: true, executablePath: 'C:\\Users\\User\\.cache\\puppeteer\\chrome\\win64-124.0.6367.201\\chrome-win64\\chrome.exe' }); // Sesuaikan path executable Chrome

        // Lakukan login pada setiap tab baru
        for (let i = 0; i < iniView; i++) {
            const page = await browser.newPage();
            await page.setCookie(...cookies);
            await page.goto(iniUrl);
            await new Promise(resolve => setTimeout(resolve, 3000));
            try {
                await page.waitForSelector('.m-LiveList-CardTips');
                await page.click('.m-LiveList-CardTips');
                console.log('Element clicked successfully in tab ' + (i+1) + '.');
            } catch (error) {
                await page.evaluate(() => {
                    const element = document.querySelector('.live-tag');
                    if (element) {
                        element.click();
                        console.log('Element .live-tag clicked successfully using JavaScript in tab ' + (i+1) + '.');
                    } else {
                        console.error('Element .live-tag not found in the DOM in tab ' + (i+1) + '.');
                    }
                });
            }

        }

        // Menunggu agar pengguna dapat melihat hasilnya
        await readlineSync.question('Tekan tombol apa saja untuk melanjutkan...');

        // Tutup browser
        await browser.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Panggil fungsi untuk login dengan cookie
loginWithCookie();