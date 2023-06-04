const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

const newsSources = [
    {
        name: 'cr',
        address: 'https://www.crunchyroll.com/news',
        base: 'https://www.crunchyroll.com'
    },
    {
        name: 'mal',
        address: 'https://myanimelist.net/news',
        base: ''
    },
    {
        name: 'red',
        address: 'https://www.reddit.com/r/anime/new/?f=flair_name%3A%22News%22',
        base: 'https://www.reddit.com'
    }
]

const articles = [];

newsSources.forEach(source => {

    axios.get(source.address)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            var articleTitles;

            switch (source.name) {
                case "cr":
                    articleTitles = '.news-left .news h2 > a';
                    break;
                case "mal":
                    articleTitles = '.news-list .news-unit p.title > a';
                    break;
                case "red":
                    // TODO:
                    // Find a way to to get more posts included in response 
                    articleTitles = 'a.SQnoC3ObvgnGjWt90zD9Z';
                    break;
                case "ann":
                    // TODO:
                    // Anime News Network
                    break;
                default:
                    console.log("No unique title selection for:\n" + source.name + "(url) " + source.address);
            }

            $(articleTitles, html).each(function () {
                const title = $(this).text();
                const url = $(this).attr('href');

                articles.push({
                    title,
                    url: source.base + url,
                    source: source.name
                })
            });

        }).catch((err) => console.log(err));

});

app.get('/', (req, res) => {
    res.json('Welcome to my anime news API.');
})

app.get('/news', (req, res) => {

    res.json(articles);

})

app.get('/news/:sourceId', (req, res) => {
    const sourceId = req.params.sourceId;

    const sourceAddress = newsSources.filter(source => source.name == sourceId)[0].address;
    const sourceBase = newsSources.filter(source => source.name == sourceId)[0].base;

    axios.get(sourceAddress)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const singleArticles = [];
            var articleTitles;

            switch (sourceId) {
                case "cr":
                    articleTitles = '.news-item > h2 > a';
                    break;
                case "mal":
                    articleTitles = '.news-list .news-unit p.title > a';
                    break;
                case "red":
                    articleTitles = 'a.SQnoC3ObvgnGjWt90zD9Z';
                    break;
                default:
                    console.log("No unique title selection for:\n" + newspaper.name + "(url) " + newspaper.address);
            }

            $(articleTitles, html).each(function () {
                const title = $(this).text();
                const url = $(this).attr('href');

                singleArticles.push({
                    title,
                    url: sourceBase + url,
                    source: sourceId
                })
            });

            res.json(singleArticles);

        }).catch((err) => console.log(err));
})

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));