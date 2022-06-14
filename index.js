const getQuote = (cb) =>
    fetch('https://api.kanye.rest')
        .then(res => res.json())
        .then(res => incrementQuoteCount(res))
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
const nextQuote = () => getQuote(data => quote.innerHTML = data.quote);

document.getElementById('nextCat').onclick = nextCat;
document.getElementById('nextQuote').onclick = nextQuote;
nextCat();
nextQuote();
