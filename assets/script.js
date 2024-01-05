// document.addEventListener('DOMContentLoaded', function () {
//     fetch('assets/movies.json')
//         .then(response => response.json())
//         .then(data => {
//             const container = document.getElementById('movies-container');
//             data.results.forEach(movie => {
//                 // Conteneur principal pour chaque film
//                 const movieDiv = document.createElement('div');
//                 movieDiv.classList.add('movie-grid');

//                 // Conteneur pour l'image
//                 const imgDiv = document.createElement('div');
//                 const img = document.createElement('img');
//                 img.src = movie.poster_path;
//                 img.alt = `Affiche du film : ${movie.original_title}`;
//                 imgDiv.appendChild(img);

//                 // Conteneur pour le texte (titre, description, note)
//                 const textDiv = document.createElement('div');
//                 const title = document.createElement('h2');
//                 title.textContent = movie.original_title;

//                 // Tronquer la description à 155 caractères
//                 const truncatedOverview = movie.overview.length > 155 ? movie.overview.substring(0, 152) + '...' : movie.overview;
//                 const description = document.createElement('p');
//                 description.textContent = truncatedOverview;

//                 const rating = document.createElement('span');
//                 rating.textContent = `Note : ${movie.vote_average}/10`;

//                 textDiv.appendChild(title);
//                 textDiv.appendChild(description);
//                 textDiv.appendChild(rating);

//                 // Ajouter l'image et le texte au conteneur principal
//                 movieDiv.appendChild(imgDiv);
//                 movieDiv.appendChild(textDiv);

//                 // Ajouter le conteneur du film au conteneur général
//                 container.appendChild(movieDiv);
//             });
//         })
//         .catch(error => {
//             console.error('Erreur de fetch :', error);
//         });
// });

document.addEventListener('DOMContentLoaded', function () {
    const apiKey = '5625a36de6999a47caf957bc36076c59'; // Remplacez avec votre clé d'API TMDb réelle
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=fr-FR`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP, statut ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('movies-container');
            data.results.forEach(movie => {
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('movie-grid');
                movieDiv.setAttribute('data-id', movie.id);

                const imgDiv = document.createElement('div');
                const img = document.createElement('img');
                img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                img.alt = `Affiche du film : ${movie.title}`;
                imgDiv.appendChild(img);

                const textDiv = document.createElement('div');
                const title = document.createElement('h2');
                title.textContent = movie.title;
                textDiv.appendChild(title);

                const description = document.createElement('p');
                description.textContent = movie.overview.length > 155 ? movie.overview.substring(0, 152) + '...' : movie.overview;
                textDiv.appendChild(description);

                const rating = document.createElement('span');
                rating.textContent = `Note : ${movie.vote_average}/10`;
                textDiv.appendChild(rating);

                // Création du bouton Détails
                const detailsButton = document.createElement('button');
                detailsButton.textContent = 'Détails';
                detailsButton.addEventListener('click', function () {
                    showMovieDetails(movie.id);
                });
                textDiv.appendChild(detailsButton);

                movieDiv.appendChild(imgDiv);
                movieDiv.appendChild(textDiv);

                container.appendChild(movieDiv);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données de l\'API :', error);
        });


});
/*2éme*/
function showMovieDetails(movieId) {
    const apiKey = '5625a36de6999a47caf957bc36076c59';
    // Utilisation de "append_to_response" pour obtenir les crédits et d'autres informations en une seule requête
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=fr-FR&append_to_response=credits`;

    fetch(url)
        .then(response => response.json())
        .then(movie => {
            const detailsDiv = document.getElementById('movie-details');
            detailsDiv.innerHTML = '';

            const closeButton = document.createElement('button');
            closeButton.textContent = 'X';
            closeButton.classList.add('close-btn');
            closeButton.onclick = function () {
                detailsDiv.style.display = 'none';
            };
            detailsDiv.appendChild(closeButton);

            // Image du film
            const movieImage = document.createElement('img');
            movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            movieImage.alt = `Affiche du film : ${movie.title}`;
            movieImage.style.maxWidth = '100px'; // Vous pouvez ajuster la taille comme nécessaire
            detailsDiv.appendChild(movieImage);

            // Titre
            const title = document.createElement('h2');
            title.textContent = movie.title;
            detailsDiv.appendChild(title);

            // Description longue
            const longDescription = document.createElement('p');
            longDescription.textContent = movie.overview;
            detailsDiv.appendChild(longDescription);

            // Date de sortie
            const releaseDate = document.createElement('p');
            releaseDate.textContent = `Date de sortie : ${movie.release_date}`;
            detailsDiv.appendChild(releaseDate);

            // Réalisateurs
            const directors = movie.credits.crew.filter(person => person.job === 'Director');
            const directorsParagraph = document.createElement('p');
            directorsParagraph.textContent = 'Réalisateur(s) : ' + directors.map(person => person.name).join(', ');
            detailsDiv.appendChild(directorsParagraph);

            // Compositeurs de musique
            const composers = movie.credits.crew.filter(person => person.job === 'Original Music Composer');
            const composersParagraph = document.createElement('p');
            composersParagraph.textContent = 'Compositeur(s) de musique : ' + composers.map(person => person.name).join(', ');
            detailsDiv.appendChild(composersParagraph);

            // Afficher les participants (cast)
            const castHeading = document.createElement('h3');
            castHeading.textContent = 'Casting :';
            detailsDiv.appendChild(castHeading);

            const castList = document.createElement('ul'); // Vous pouvez utiliser une liste ul/li ou simplement des paragraphes
            movie.credits.cast.slice(0, 10).forEach(castMember => { // Afficher, par exemple, les 10 premiers membres du casting
                const castItem = document.createElement('li');
                castItem.textContent = `${castMember.name} (en tant que ${castMember.character})`;
                castList.appendChild(castItem);
            });
            detailsDiv.appendChild(castList);

            detailsDiv.style.display = 'block';
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des détails du film :', error);
        });
}




