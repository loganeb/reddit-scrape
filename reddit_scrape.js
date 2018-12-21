const puppeteer = require('puppeteer');

async function scrape() {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://www.reddit.com/r/all/new/');
    //await page.click('#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a > img');

    const result = await page.evaluate(() => {
        let results = [];
        let posts = document.querySelectorAll('.iuScIP');

        posts.forEach(post => {
            results.push(...post.innerText.split(' '));
        });

        return results;
    });

    browser.close();
    return result;
}

scrape().then((result) => {
    let words = {};

    result.forEach(word => {
        if(words.length === 0){
            words[word] = 1;
        }else if(!words[word]){
            words[word] = 1;
        }else{
            words[word] += 1;
        }
    })

    let orderedWords = [];

    Object.keys(words).forEach(key => {
        orderedWords.push([key, words[key]]);
    })
    
    orderedWords.sort((a, b) => a[1] - b[1]).reverse();

    for(var i = 0; i < orderedWords.length; i++){
        if(orderedWords[i][0].toLowerCase().match(/\b(?:the|it|if|in|for|or|then|them|with|to|of|and|but|this|a|is|from|what|did)\b/gi)){
            orderedWords.splice(i, 1);
        }
    };

    console.log(orderedWords);
});