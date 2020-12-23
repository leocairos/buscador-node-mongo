//index.js
const simplify = require('./simplify');
sw = require('stopword')

function generateTags(movie) {
    let tags = [];
    tags.push(...simplify(movie.title));
    tags.push(movie.year.toString());

    if (movie.plot) {
        const oldString = movie.plot.split(' ')
        const newString = sw.removeStopwords(oldString)
        tags = tags.concat(...newString.map(plot => simplify(plot)));
    }

    if (movie.cast)
        tags = tags.concat(...movie.cast.map(actor => simplify(actor)));

    if (movie.countries)
        tags = tags.concat(...movie.countries.map(country => simplify(country)));

    if (movie.directors)
        tags = tags.concat(...movie.directors.map(director => simplify(director)));

    if (movie.genres)
        tags = tags.concat(...movie.genres.map(genre => simplify(genre)));
    return tags;
}

function updateMovies(movies) {
    movies.map((movie) => {
        console.log(movie.title);
        movie.tags = generateTags(movie);
        global.conn.collection('movies_inverted_index').insertOne(movie);
    })
}

function findAllMovies() {
    return global.conn.collection('movies').find({}).toArray();
}

require('./db')()
    .then(db => findAllMovies())
    .then(arr => updateMovies(arr))
    .catch(err => console.log(err));