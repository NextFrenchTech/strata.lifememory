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
			const popup = document.getElementById("popup");
			const acceptButton = document.getElementById("acceptButton");
			const rejectButton = document.getElementById("rejectButton");
			const popupPursue = document.getElementById("popupPursue");
			const resumeButton = document.getElementById("resumeButton");
			const cancelButton = document.getElementById("cancelButton");
			const audio = document.getElementById("audio");
			let isAudioPlaying = false;
		
			// Functions
		
			// Fonction pour afficher une popup avec un délai
			const showPopup = (popupElement) => {
				setTimeout(() => {
					popupElement.style.display = "block";
					popupElement.style.zIndex = 2147483647;
				}, 1000);
			};
		
			// Fonction pour démarrer la lecture audio
			const playAudio = () => {
				isAudioPlaying = true;
				audio.play().catch(error => console.error("Audio play error: ", error));
			};
		
			// Fonction pour gérer la réponse de l'utilisateur à la proposition
			const handleUserResponse = (response) => {
				sessionStorage.setItem("userResponse", response);
				popup.style.display = "none";
				if (response === "accepted") {
					playAudio(); // Si la réponse est "accepted", démarrer la lecture audio
				}
			};
		
			// Fonction pour reprendre la lecture audio
			const handleResume = () => {
				popupPursue.style.display = "none";
				playAudio(); // Reprendre la lecture audio
			};
		
			// Fonction pour annuler la reprise et réinitialiser la playlist audio
			const handleCancel = () => {
				popupPursue.style.display = "none";
				sessionStorage.setItem("userResponse", "rejected");
				resetPlaylist(); // Réinitialiser la playlist audio
			};
		
			// Fonction pour réinitialiser la playlist audio
			const resetPlaylist = () => {
				const sources = audio.getElementsByTagName('source');
				if (sources.length > 0) {
					audio.src = sources[0].src;
					audio.load();
				}
			};
		
			// Fonction pour passer à la piste audio suivante dans la playlist
			const playNext = () => {
				const sources = Array.from(audio.getElementsByTagName('source'));
				const currentSourceIndex = sources.findIndex(src => src.src === audio.src);
				const nextSourceIndex = (currentSourceIndex + 1) % sources.length;
		
				audio.src = sources[nextSourceIndex].src;
				audio.load();
				playAudio(); // Démarrer la lecture audio de la piste suivante
			};
		
			// Gestionnaires d'événements
		
			// Ajouter des écouteurs d'événements pour les différents boutons
			acceptButton.addEventListener("click", () => handleUserResponse("accepted"));
			rejectButton.addEventListener("click", () => {
				handleUserResponse("rejected");
				resetPlaylist(); // Réinitialiser la playlist audio si la proposition est rejetée
			});
			resumeButton.addEventListener("click", handleResume);
			cancelButton.addEventListener("click", handleCancel);
		
			// Gestion de la lecture audio lors de la perte de focus de la fenêtre
			window.addEventListener("blur", () => {
				isAudioPlaying = !audio.paused;
				audio.pause();
			});
		
			// Gestion de l'affichage des popups lors du regain de focus de la fenêtre
			window.addEventListener("focus", () => {
				const userResponseOnFocus = sessionStorage.getItem("userResponse");
				if (!userResponseOnFocus && popup.style.display !== "block") {
					showPopup(popup); // Afficher la popup initiale si aucune réponse précédente n'est enregistrée et si la popup n'est pas déjà affichée
				} else if (userResponseOnFocus === "accepted") {
					showPopup(popupPursue); // Afficher la popup de reprise si la réponse précédente est "accepted"
				} else if (userResponseOnFocus === "rejected") {
					showPopup(popup); // Afficher la popup initiale si la réponse précédente est "rejected"
				}
			});
		
			// Gestion de la lecture de la piste audio suivante à la fin de la piste actuelle
			audio.addEventListener("ended", playNext);
		
			// Initialisation
		
			// Réinitialiser la réponse de l'utilisateur à chaque chargement de page
			sessionStorage.removeItem("userResponse");
			// Afficher toujours la popup initiale au chargement de la page
			showPopup(popup);
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