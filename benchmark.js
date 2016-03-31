'use strict';

const REPEATS = 10;
const MESSAGES = 50;
const DICE_MESSAGES = 10;

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const webdriver = require('selenium-webdriver');

const By = webdriver.By;
const until = webdriver.until;

const db = path.join(__dirname, 'tmp/bench.sqlite');
fs.existsSync(db) && fs.unlinkSync(db);

const server = child_process.fork(__dirname, [], {
    env: {
        NODE_ENV: 'benchmark',
    }
});

const drive = (n) => {
    const start = Date.now();

    const driver = new webdriver.Builder()
        .forBrowser('firefox')
        .build();

    driver.get('http://localhost:8000/');
    driver.findElement(By.name('id')).sendKeys('alice');
    driver.findElement(By.name('name')).sendKeys('Alice');
    driver.findElement(By.name('login')).click();

    driver.wait(until.elementLocated(By.id('button-open-create-room-dialog')));
    driver.findElement(By.id('button-open-create-room-dialog')).click();

    driver.wait(until.elementLocated(By.name('title')));
    driver.findElement(By.name('title')).sendKeys(`Room${n}`);
    driver.findElement(By.name('password')).sendKeys('1234');
    driver.findElement(By.id('button-create-room')).click();

    driver.wait(until.elementLocated(By.id('button-password-join')));
    driver.findElement(By.name('password')).sendKeys('1234');
    driver.findElement(By.id('button-password-join')).click();

    driver.wait(until.elementLocated(By.name('message')));
    for (let i = 0; i < MESSAGES; i++) {
        const message = `Message ${i}`;
        driver.findElement(By.name('message')).sendKeys(message);
        driver.findElement(By.name('message')).sendKeys('\n');
    }
    for (let i = 0; i < DICE_MESSAGES; i++) {
        const message = '2d6=';
        driver.findElement(By.name('message')).sendKeys(message);
        driver.findElement(By.name('message')).sendKeys('\n');
    }

    return driver.quit()
        .then(() => Date.now() - start);
};

const next = (i, results) => {
    if (i >= REPEATS) {
        const secs = results.map((result) => result / 1000);
        const min = secs.reduce((a, b) => Math.min(a, b));
        const max = secs.reduce((a, b) => Math.max(a, b));
        const sum = secs.reduce((a, b) => a + b);
        const avg = sum / secs.length;
        console.log(secs);
        console.log({min, max, avg});
        server.kill();

        return;
    }

    console.log('----------', i, '----------');

    drive(i)
        .then((time) => {
            results.push(time);
            next(i + 1, results);
        });
};

next(0, []);
