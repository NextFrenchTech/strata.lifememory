/*
	Strata by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		settings = {

			// Parallax background effect?
				parallax: true,

			// Parallax factor (lower = more intense, higher = less intense).
				parallaxFactor: 20

		};

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1800px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ],
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile) {

			// Turn on touch mode.
				$body.addClass('is-touch');

			// Height fix (mostly for iOS).
				window.setTimeout(function() {
					$window.scrollTop($window.scrollTop() + 1);
				}, 0);

		}

	// Footer.
		breakpoints.on('<=medium', function() {
			$footer.insertAfter($main);
		});

		breakpoints.on('>medium', function() {
			$footer.appendTo($header);
		});

	// Header.

		// Parallax background.

			// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
				if (browser.name == 'ie'
				||	browser.mobile)
					settings.parallax = false;

			if (settings.parallax) {

				breakpoints.on('<=medium', function() {

					$window.off('scroll.strata_parallax');
					$header.css('background-position', '');

				});

				breakpoints.on('>medium', function() {

					$header.css('background-position', 'left 0px');

					$window.on('scroll.strata_parallax', function() {
						$header.css('background-position', 'left ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');
					});

				});

				$window.on('load', function() {
					$window.triggerHandler('scroll');
				});

			}

	// Main Sections: Two.

		// Lightbox gallery.
			$window.on('load', function() {

				$('#two').poptrox({
					caption: function($a) { return $a.next('h3').text(); },
					overlayColor: '#2c2c2c',
					overlayOpacity: 0.85,
					popupCloserText: '',
					popupLoaderText: '',
					selector: '.work-item a.image',
					usePopupCaption: true,
					usePopupDefaultStyling: false,
					usePopupEasyClose: false,
					usePopupNav: true,
					windowMargin: (breakpoints.active('<=small') ? 0 : 50)
				});

			});

})(jQuery);



/* ------------------------------ */
/*           CUSTOM  JS           */
/* ------------------------------ */



/* /Mobi|Android/i.test */

	// Fonction pour détecter si l'utilisateur est sur un appareil mobile

	function isMobile() {
		return /Mobi|Android/i.test(navigator.userAgent);
	}



/* audioPlaylist */

	// autoPlayAudio

		// L'événement DOMContentLoaded est déclenché lorsque le document HTML a été complètement chargé et analysé
		document.addEventListener("DOMContentLoaded", () => {
			// Variables
			const popup = document.getElementById("popup");  // Popup principale
			const acceptButton = document.getElementById("acceptButton");  // Bouton pour accepter l'audio
			const rejectButton = document.getElementById("rejectButton");  // Bouton pour rejeter l'audio
			const popupPursue = document.getElementById("popupPursue");  // Popup de reprise
			const resumeButton = document.getElementById("resumeButton");  // Bouton pour reprendre l'audio
			const cancelButton = document.getElementById("cancelButton");  // Bouton pour annuler la reprise
			const audio = document.getElementById("audio");  // Élément audio
			let isAudioPlaying = false;  // Flag pour vérifier si l'audio est en cours
			let isPopupVisible = false;  // Flag pour éviter l'affichage de multiples popups
			
			// Fonction pour afficher une popup après un délai
			const showPopup = (popupElement) => {
				if (!isPopupVisible) {  // Vérifie que la popup n'est pas déjà affichée
					setTimeout(() => {
						popupElement.style.display = "block";  // Affiche la popup
						popupElement.style.zIndex = 2147483647;  // Met la popup au-dessus des autres éléments
						isPopupVisible = true;  // Marque la popup comme visible
					}, 1000);  // Délai de 1 seconde avant d'afficher
				}
			};
			
			// Fonction pour démarrer la lecture de l'audio
			const playAudio = () => {
				isAudioPlaying = true;  // L'audio commence à être joué
				audio.play().catch(error => console.error("Erreur de lecture audio: ", error));  // Gestion des erreurs de lecture
			};
		
			// Fonction pour gérer la réponse de l'utilisateur
			const handleUserResponse = (response) => {
				sessionStorage.setItem("userResponse", response);  // Sauvegarde la réponse
				popup.style.display = "none";  // Masque la popup
				isPopupVisible = false;  // Réinitialise l'état de la popup
				if (response === "accepted") {
					playAudio();  // Si accepté, démarre l'audio
				}
			};
		
			// Fonction pour reprendre la lecture après une pause
			const handleResume = () => {
				popupPursue.style.display = "none";  // Masque la popup de reprise
				isPopupVisible = false;  // Réinitialise le flag de la popup
				playAudio();  // Reprend la lecture audio
			};
		
			// Fonction pour annuler la reprise de l'audio
			const handleCancel = () => {
				popupPursue.style.display = "none";  // Masque la popup de reprise
				sessionStorage.setItem("userResponse", "rejected");  // Enregistre "rejected" dans sessionStorage
				resetPlaylist();  // Réinitialise la playlist audio
				isPopupVisible = false;  // Réinitialise le flag de la popup
			};
		
			// Fonction pour réinitialiser la playlist audio
			const resetPlaylist = () => {
				const sources = audio.getElementsByTagName('source');  // Récupère toutes les sources audio
				if (sources.length > 0) {
					audio.src = sources[0].src;  // Remet la première source comme source
					audio.load();  // Recharge l'audio
				}
			};
		
			// Fonction pour passer à la prochaine piste audio
			const playNext = () => {
				const sources = Array.from(audio.getElementsByTagName('source'));  // Convertit les sources en tableau
				const currentSourceIndex = sources.findIndex(src => src.src === audio.src);  // Trouve l'index de la source actuelle
				const nextSourceIndex = (currentSourceIndex + 1) % sources.length;  // Calcule l'index de la prochaine source
				
				audio.src = sources[nextSourceIndex].src;  // Met à jour la source
				audio.load();  // Recharge la nouvelle piste
				playAudio();  // Démarre la lecture de la nouvelle piste
			};
		
			// Événements pour les boutons de réponse
			acceptButton.addEventListener("click", () => handleUserResponse("accepted"));  // L'utilisateur accepte
			rejectButton.addEventListener("click", () => {
				handleUserResponse("rejected");  // L'utilisateur rejette
				resetPlaylist();  // Réinitialise la playlist si rejeté
			});
			resumeButton.addEventListener("click", handleResume);  // Reprendre la lecture audio
			cancelButton.addEventListener("click", handleCancel);  // Annuler la reprise et réinitialiser
		
			// Gestion de la perte de focus de la fenêtre
			window.addEventListener("blur", () => {
				isAudioPlaying = !audio.paused;  // Marque que l'audio est mis en pause
				audio.pause();  // Met l'audio en pause
			});
		
			// Gestion de la reprise de focus de la fenêtre
			window.addEventListener("focus", () => {
				const userResponseOnFocus = sessionStorage.getItem("userResponse");
				if (!userResponseOnFocus && popup.style.display !== "block") {
					showPopup(popup);  // Affiche la popup initiale si aucune réponse précédente
				} else if (userResponseOnFocus === "accepted") {
					showPopup(popupPursue);  // Affiche la popup de reprise si accepté
				} else if (userResponseOnFocus === "rejected") {
					showPopup(popup);  // Affiche la popup initiale si rejeté
				}
			});
		
			// Quand la piste audio se termine, passe à la suivante
			audio.addEventListener("ended", playNext);  // Passe à la piste suivante à la fin de la lecture
		
			// Initialisation
			sessionStorage.removeItem("userResponse");  // Réinitialise la réponse de l'utilisateur à chaque nouveau chargement
			showPopup(popup);  // Affiche la popup initiale au chargement de la page
		
			// Gestion de la visibilité de la page
			document.addEventListener("visibilitychange", () => {
				if (!document.hidden) {  // La page devient visible
					const userResponseOnFocus = sessionStorage.getItem("userResponse");
		
					// Vérifie si une popup est déjà affichée pour éviter les doublons
					if (!isPopupVisible) {  
						if (audio.paused) {  // Si l'audio est en pause
							if (userResponseOnFocus === "accepted") {
								showPopup(popupPursue);  // Affiche la popup de reprise si accepté
							} else if (userResponseOnFocus === "rejected") {
								showPopup(popup);  // Affiche la popup initiale si rejeté
							}
						}
					}
				}
			});
		});



/* autoScroll */

	// autoScroll /Mobi|Android/i

       	// L127. Fonction pour détecter si l'utilisateur est sur un appareil mobile

        // Constantes pour les valeurs configurables
        const SCROLL_STEP = 1; // Nombre de pixels à faire défiler par intervalle
        const DELAY = 15; // Intervalle en millisecondes entre chaque défilement
        const TOUCH_SENSITIVITY = 10; // Sensibilité du mouvement de doigt

        let isPaused = false; // Variable pour suivre l'état de la pause du défilement

        // Fonction pour démarrer le gestionnaire d'événement de défilement
        function startAutoScroll() {
            if (isMobile()) {
                // Défilement vertical pour les appareils mobiles
                function scrollDown() {
                    if (!isPaused) {
                        window.scrollBy(0, SCROLL_STEP); // Fait défiler la fenêtre vers le bas
                        // Vérifie si la fenêtre a atteint le bas de la page
                        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
                            setTimeout(scrollUp, DELAY); // Si le bas de la page est atteint, défile vers le haut
                        } else {
                            setTimeout(scrollDown, DELAY); // Sinon, continue de défiler vers le bas
                        }
                    }
                }

                function scrollUp() {
                    if (!isPaused) {
                        window.scrollBy(0, -SCROLL_STEP); // Fait défiler la fenêtre vers le haut
                        // Vérifie si la fenêtre a atteint le haut de la page
                        if (window.scrollY <= 0) {
                            setTimeout(scrollDown, DELAY); // Si le haut de la page est atteint, défile vers le bas
                        } else {
                            setTimeout(scrollUp, DELAY); // Sinon, continue de défiler vers le haut
                        }
                    }
                }

                scrollDown(); // Démarre le défilement vers le bas

                let touchStartY = 0;

                // Gestion des événements tactiles
                window.addEventListener('touchstart', function(event) {
                    touchStartY = event.touches[0].clientY; // Enregistre la position de départ du toucher
                });

                // Gestion de la mise en pause du défilement
                window.addEventListener('touchmove', function(event) {
                    let touchMoveY = event.touches[0].clientY; // Récupère la position actuelle du toucher
                    let deltaY = touchMoveY - touchStartY; // Calcule le déplacement en y

                    if (Math.abs(deltaY) > TOUCH_SENSITIVITY) { // Vérifie si le déplacement dépasse la sensibilité
                        isPaused = true; // Met en pause le défilement
                    }
                });
            }
        }

        // Fonction pour démarrer le défilement au clic
        function startAutoScrollOnClick() {
            startAutoScroll(); // Démarre le défilement automatique
            isPaused = false; // Réinitialiser l'état de la pause
        }

        // Ajout de l'événement de démarrage du défilement automatique aux boutons
        document.getElementById('acceptButton').addEventListener('click', startAutoScrollOnClick);
        document.getElementById('rejectButton').addEventListener('click', startAutoScrollOnClick);

		// Fonction pour démarrer le défilement automatique
		//window.onload = function() {
		//	setTimeout(startAutoScroll, 0); // Délai de 0 secondes avant de démarrer le défilement automatique
		//};



/* autoSwitch */

	// autoSwitch /Mobi|Android/i
	
		// L127. Fonction pour détecter si l'utilisateur est sur un appareil mobile

		// Fonction pour passer à la photo suivante
		function nextPhoto() {
			if (isMobile()) {
				// Simuler un clic sur le bouton "suivant" de Poptrox
				var nextButton = document.querySelector('.nav-next');
				if (nextButton) {
					nextButton.click();
				}
			}
			
			// Appel récursif pour exécuter la fonction après 5 secondes
			setTimeout(nextPhoto, 5000);
		}

		// Appel initial de la fonction nextPhoto
		nextPhoto();



/* autoView */

	// autoView /videoPlayer01

		// Fonction pour passer à la video suivante
		document.addEventListener('DOMContentLoaded', function() {
			var videoPlayer01 = document.getElementById('videoPlayer01');

			// Liste des vidéos
			var videos = [
				{ src: 'videos/vid01.mp4' },
				//{ src: 'videos/.mp4', poster: 'images/.jpg' },
			];

			var currentVideoIndex = 0;

			// Fonction pour charger une vidéo
			function loadVideo(index) {
				if (index < videos.length) {
					videoPlayer01.src = videos[index].src;
					//videoPlayer01.poster = videos[index].poster;
					videoPlayer01.load();
					videoPlayer01.play();
				}
			}

			// Écouteur d'événement pour la fin de la vidéo
			//videoPlayer01.addEventListener('ended', function() {
			//	currentVideoIndex++;
			//	if (currentVideoIndex < videos.length) {
			//		loadVideo(currentVideoIndex);
			//	} else {
			//		// Réinitialiser à la première vidéo si toutes les vidéos sont jouées
			//		currentVideoIndex = 0;
			//		loadVideo(currentVideoIndex);
			//	}
			//});

			// Charger la première vidéo
			loadVideo(currentVideoIndex);
		});



/* autoView */

	// autoView /videoPlayer02

		// Fonction pour passer à la video suivante
		document.addEventListener('DOMContentLoaded', function() {
			var videoPlayer02 = document.getElementById('videoPlayer02');

			// Liste des vidéos
			var videos = [
				{ src: 'videos/vid02.mp4' },
				{ src: 'videos/vid03.mp4' },
				//{ src: 'videos/.mp4', poster: 'images/.jpg' },
			];

			var currentVideoIndex = 0;

			// Fonction pour charger une vidéo
			function loadVideo(index) {
				if (index < videos.length) {
					videoPlayer02.src = videos[index].src;
					//videoPlayer02.poster = videos[index].poster;
					videoPlayer02.load();
					videoPlayer02.play();
				}
			}

			// Écouteur d'événement pour la fin de la vidéo
			videoPlayer02.addEventListener('ended', function() {
				currentVideoIndex++;
				if (currentVideoIndex < videos.length) {
					loadVideo(currentVideoIndex);
				} else {
					// Réinitialiser à la première vidéo si toutes les vidéos sont jouées
					currentVideoIndex = 0;
					loadVideo(currentVideoIndex);
				}
			});

			// Charger la première vidéo
			loadVideo(currentVideoIndex);
		});