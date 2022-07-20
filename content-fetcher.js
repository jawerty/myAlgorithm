function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function ContentPageFetcher(link) {
    return new Promise((resolve) => {
        fetch(link, {
            method: 'GET', 
            headers: {
                'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
            }
        }).then(function(response) {
            return response.text();
        }).then(function(text) {
            const doc = document.implementation.createHTMLDocument('');
            doc.open();
            doc.write(text);
            doc.close();
            let title = doc.querySelector('title').innerText;
            const metaOGTitle = doc.querySelector('meta[property="og:title"]');
            if (metaOGTitle) {
                title = metaOGTitle.getAttribute('content');
            } else {
                const metaTwitterTitle = doc.querySelector('meta[property="twitter:title"]')
                if (metaTwitterTitle) {
                    title = metaTwitterTitle.getAttribute('content');
                }
            }

            let description;
            const metaBaseDesc = doc.querySelector('meta[name="description"]')
            if (metaBaseDesc) { // default
                description = metaBaseDesc.getAttribute('content');
            }
            // prioritize below
            const metaOGDesc = doc.querySelector('meta[property="og:description"]');
            if (metaOGDesc) { 
                description = metaOGDesc.getAttribute('content');
            } else {
                const metaTwitterDesc = doc.querySelector('meta[property="twitter:description"]')
                if (metaTwitterDesc) {
                    description = metaTwitterDesc.getAttribute('content');
                }
            }

            let image;
             // prioritize below
             const metaOGImage = doc.querySelector('meta[property="og:image"]');
             if (metaOGImage) { 
                image = metaOGImage.getAttribute('content');
             } else {
                 const metaTwitterImage = doc.querySelector('meta[property="twitter:image"]')
                 if (metaTwitterImage) {
                    image = metaTwitterImage.getAttribute('content');
                 }
             }

            resolve({
                title,
                description,
                image
            })
        }).catch(() => {
            resolve(null)
        });
    });
}  

async function GoogleFetcher(searchQuery, site) {
    return new Promise((resolve) => {
        console.log(`Google Fetcher: ${site} <---> Query: ${searchQuery}`)
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)} site:${site}`;
        fetch(searchUrl, {
            method: 'GET', 
            credentials: "omit",
            headers: {
                'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
            }
        }).then(function(response) {
            return response.text();
        }).then(function(text) {
            const doc = document.implementation.createHTMLDocument('');
            doc.open();
            doc.write(text);
            doc.close();
            const h3s = doc.querySelectorAll("div div > a > h3");
            if (!h3s || h3s.length === 0) {
                resolve(null)
            } else {
                for (let h3 of h3s) {
                    
                    const link = h3.closest('a');

                    const container = h3.closest("div[data-sokoban-container]");
                    let desc;
                    if (container) {
                        const descEl = container.querySelector("div[data-content-feature=\"1\"]");
                        if (descEl) {
                            desc = descEl.innerText
                        }
                    }
                    if (link) {
                        const href = link.getAttribute('href')
                        if (href) {
                            return resolve({
                                href,
                                title: link.innerText,
                                desc
                            });

                        }
                    }
                }
            }
            
        }).catch(() => {
            resolve(null)
        });
    });

}

async function YandexFetcher(searchQuery, site) {
    await timeout(1000);
    return new Promise((resolve) => {
        console.log(`Yandex Fetcher: ${site} <---> Query: ${searchQuery}`)
        const searchUrl = `https://yandex.com/search/?text=${encodeURIComponent(searchQuery)}+site:${site}+lang:en&lr=103017&redircnt=1657655444.1`;
        fetch(searchUrl, {
            method: 'GET', 
            headers: {
                'accept':' text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9',
                'device-memory': '8',
                'downlink': '1.05',
                'dpr': '2',
                'ect': '4g',
                'viewport-width': '1440',
                'referer': 'https://yandex.com/',
                'rtt': '150',
                'cache-control': 'max-age=0',
                'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
                'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': "macOS",
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1'
                
            }
        }).then(function(response) {
            return response.text();
        }).then(function(text) {
            const doc = document.implementation.createHTMLDocument('');
            doc.open();
            doc.write(text);
            doc.close();
            console.log(text);
            console.log(text.includes('main__content'))
            console.log(text.includes('serp-list'))
            console.log(text.includes('serp-item'))
            console.log(text.includes('OrganicTitle-Link'))
            const links = doc.querySelectorAll(".main__content .serp-list .serp-item .OrganicTitle-Link");
            console.log(links);
            if (!links || links.length === 0) {
                resolve(null)
            } else {
                for (let link of links) {
                    if (link) {
                        const href = link.getAttribute('href')
                        if (href) {
                            return resolve(href);

                        }
                    }
                }
            }
            
        }).catch(() => {
            resolve(null)
        });
    });

}


async function DDGFetcher(searchQuery, site) {
    return new Promise((resolve) => {
        console.log(`DDG Fetcher: ${site} <---> Query: ${searchQuery}`)
        const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(searchQuery)}+site:${encodeURIComponent(site)}`;
        fetch(searchUrl, {
            method: 'GET', 
            credentials: "omit",
            headers: {
                'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
            }
        }).then(function(response) {
            return response.text();
        }).then(function(text) {
            const doc = document.implementation.createHTMLDocument('');
            doc.open();
            doc.write(text);
            doc.close();
            console.log(text);
            const titles = doc.querySelectorAll(".result__title .result__a");
            if (!titles || titles.length === 0) {
                resolve(null)
            } else {
                for (let title of titles) {
                    if (title) {
                        let href = title.getAttribute('href')
                        let url = 'https:' + href;
                        try {
                            url = new URL(url);
                            const queryParams = url.search.slice(1).split('&')
                            for (let queryParam of queryParams) {
                                const queryParamSplit = queryParam.split('=');
                                if (queryParamSplit[0] === 'uddg') {
                                    href = decodeURIComponent(queryParamSplit[1])
                                    break;
                                }
                            }
                        } catch (e) {
                            continue;
                        }
                        if (href) {
                            return resolve(href);
                        }
                    }
                }
            }
            
        }).catch(() => {
            resolve(null)
        });
    });

}

async function ContentFetcher(sourcingSettings, searchQueries) {
    console.log("sourcingSettings", sourcingSettings)
    const sourcingSites = {
        youtube: "youtube.com/watch", 
        twitter: "twitter.com/*", 
        reddit: "reddit.com/r",
        quora: "quora.com", 
        wikipedia: "wikipedia.com/wiki", 
        odysee: "odysee.com/*/*",
        stackoverflow: "stackoverflow.com/questions", 
        gab: "gab.com",
        bitchute: "bitchute.com/video", 
    };

    const sitesToSource = Object.keys(sourcingSettings).filter((source) => {
        return sourcingSettings[source];
    }).map((source) => {
        return sourcingSites[source];
    });

    const contentFeed = [];
    console.log("Search Query count", searchQueries.length);
    for (let searchQuery of searchQueries) {  
        console.log("searchQuery", searchQuery)
        const site = sitesToSource[Math.floor(Math.random()*sitesToSource.length)];
        
        const fetchers = [YandexFetcher, DDGFetcher, GoogleFetcher, GoogleFetcher, GoogleFetcher, GoogleFetcher]; // randomness for the fetcher (avoid rate limiting)
        let fetcher;

        // use google for all twitter sources (for now)
        if (site.includes('twitter.com')) {
            fetcher = GoogleFetcher;
        } else {
            fetcher = fetchers[Math.floor(Math.random()*fetchers.length)];
        }

        const content = await fetcher(searchQuery, site);
        if (content) {
            let contentLink;
            let isGoogleFetch = false;
            if (typeof content === 'object' && Object.keys(content).length > 1) {
                isGoogleFetch = true;
                contentLink = content.href;
            } else {
                contentLink = content;
            }
            const contentInfo = await ContentPageFetcher(contentLink)
            let contentFeedData = {
                link: contentLink,
                source: site
            }
            if (isGoogleFetch) {
                contentFeedData = Object.assign(contentFeedData, { title: content.title, description: content.desc });
            }
            if (contentInfo && Object.keys(contentInfo).length > 0) {
                contentFeedData = Object.assign(contentFeedData, contentInfo);
            }

            contentFeed.push(contentFeedData);
        }
    }
    return contentFeed;
}

export {
    ContentFetcher
}