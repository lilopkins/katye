const quoteSources = {
    'Kanye': {
        'url': 'https://api.kanye.rest',
        'process': data => data.quote,
    },
    'Famous Quotes (Quotable API)': {
        'url': 'https://api.quotable.io/random',
        'process': data => `${data.content} &mdash; ${data.author}`,
    },
    'Progamming Quotes': {
        'url': 'http://quotes.stormconsultancy.co.uk/random.json',
        'process': data => `${data.quote} &mdash; ${data.author}`,
    },
    'Motivational Quotes': {
        'url': 'https://motivational-quote-api.herokuapp.com/quotes/random',
        'process': data => `${data.quote} &mdash; ${data.person}`,
    }
};

const getQuote = (cb) =>
    fetch(quoteSources[localStorage.getItem('quoteSource')].url)
        .then(res => res.json())
        .then(res => incrementQuoteCount(res))
        .then(res => quoteSources[localStorage.getItem('quoteSource')].process(res))
        .then(data => cb(data));

const getCat = (cb) =>
    fetch('https://api.thecatapi.com/v1/images/search')
        .then(res => res.json())
        .then(res => res[0].url)
        .then(res => incrementCatCount(res))
        .then(res => {
            let i = new Image();
            i.src = res;
            i.onload = () => cb(res);
        });

const incrementQuoteCount = (passthru) => {
    localStorage.setItem('quoteCount', +localStorage.getItem('quoteCount') + 1);
    document.querySelector('[data-src="quotes"]').innerHTML = `${localStorage.getItem('quoteCount')}`;
    return passthru;
};

const incrementCatCount = (passthru) => {
    localStorage.setItem('catCount', +localStorage.getItem('catCount') + 1);
    document.querySelector('[data-src="cats"]').innerHTML = `${localStorage.getItem('catCount')}`;
    return passthru;
};

const background = document.querySelector('.background');
const nextCat = () => getCat(data => background.style.backgroundImage = `url(${data})`);

const quote = document.querySelector('.quote');
const nextQuote = () => getQuote(data => quote.innerHTML = data);

const sources = document.getElementById('sources');

// Populate sources
for (const key in quoteSources) {
    if (Object.hasOwnProperty.call(quoteSources, key)) {
        const element = quoteSources[key];
        const option = document.createElement('option');
        option.innerText = key;
        sources.appendChild(option);
    }
}

// Set default source
if (localStorage.getItem('quoteSource') === null) {
    localStorage.setItem('quoteSource', 'Kanye');
}

// Preselect source
sources.value = localStorage.getItem('quoteSource');

// Monitor source change
sources.onchange = () => {
    localStorage.setItem('quoteSource', sources.value);
    nextQuote();
};

document.getElementById('nextCat').onclick = nextCat;
document.getElementById('nextQuote').onclick = nextQuote;
nextCat();
nextQuote();
