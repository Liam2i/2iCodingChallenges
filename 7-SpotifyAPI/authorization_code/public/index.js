/**
         * Obtains parameters from the hash of the URL
         * @return Object
         */
function getHashParams() {
	var hashParams = {};
	var e, r = /([^&;=]+)=?([^&;]*)/g,
		q = window.location.hash.substring(1);
	while ( e = r.exec(q)) {
	   hashParams[e[1]] = decodeURIComponent(e[2]);
	}
	return hashParams;
}

params = getHashParams();
	
	var access_token = params.access_token,
		refresh_token = params.refresh_token,
		error = params.error;

document.getElementById("btnPlaylists").onclick = function() {myFunction()};

function myFunction() {
	var params = getHashParams();

	var access_token = params.access_token,
            refresh_token = params.refresh_token,
            error = params.error;

        if (error) {
          alert('There was an error during the authentication');
        } else {
			$.ajax({
                url: 'https://api.spotify.com/v1/me/playlists',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
					var playlistsDiv = document.getElementById("playlists")

					var i = 0;
					response.items.forEach(playlist => {
						playlistsDiv.innerHTML +='<input type="radio" id="' + i + '" name="playlistChoice" value="' + playlist.href + '">';
						playlistsDiv.innerHTML +='<label for="' + i + '">' + playlist.name + '</label>';
						playlistsDiv.innerHTML +='<br>';
						i++;
					});

					$('#btnSort').show();
					$('#btnPlaylists').hide();
                }
            });
		}
}


var genres = [];
var songs = [];
var artists = [];
var tempSongs = [];

document.getElementById("btnSort").onclick = function() {sortPlaylists()};
function sortPlaylists() {
	var params = getHashParams();
	
	var access_token = params.access_token,
	refresh_token = params.refresh_token,
	error = params.error;
	
	if (error) {
		alert('There was an error during the authentication');
	} else {
		getPartSongs(0);
	}
}

async function getPartSongs(offset) {
	var params = getHashParams();

	var access_token = params.access_token,
            refresh_token = params.refresh_token,
            error = params.error;
			
	// Get playlist
	var href = $("input[type='radio'][name='playlistChoice']:checked").val() + '/tracks?offset=' + offset + '&limit=100';

	$.ajax({
		url: href,
		headers: {
		'Authorization': 'Bearer ' + access_token
		},
		success: function(response) {
			response.items.forEach(function(song) {
				artists.push(song.track.artists[0].id);
				tempSongs.push(song.track);
			});

			if (offset + 100 < response.total) {
				getPartSongs(offset + 100);
			} else {
				makePlaylists(0);
			}
			
		}
	});
}


function makePlaylists(offset) {
	var params = getHashParams();
	
	var access_token = params.access_token,
		refresh_token = params.refresh_token,
		error = params.error;
	
	ids = "";

	for (var i = offset; i < Math.min(offset + 50, artists.length); i++) {
		ids += artists[i] + ",";
	}
	
	$.ajax({
		url: "https://api.spotify.com/v1/artists",
		headers: {
		'Authorization': 'Bearer ' + access_token
		},
		data: {
			ids: ids.slice(0, -1)
		},
		success: function(response) {
			response.artists.forEach(function(artist, i) {
				artist.genres.forEach(genre => {
					var index = genres.indexOf(genre);
					if (index == -1) {
						genres.push(genre);
						songs.push([tempSongs[i]]);
					} else {
						songs[index].push(tempSongs[i]);
					}
				});		
			});

			if (offset + 50 < artists.length) {
				makePlaylists(offset + 50);
			} else {
				completePlaylists();
			}
		}
	})
}

function completePlaylists() {
	params = getHashParams();
	
	var access_token = params.access_token,
		refresh_token = params.refresh_token,
		error = params.error;

	var count = 0;

	$.ajax({
		url: "https://api.spotify.com/v1/me",
		headers: {
			'Authorization': 'Bearer ' + access_token
		},
		success: function(response) {
			for (var i = 0; i < songs.length; i++) {
				if (songs[i].length >= 20) {
					function delay(time, index) {
						return new Promise(resolve => {
							setTimeout(() => {
								resolve(index)
							}, time)
						});
					}
					
					delay(500 * count, i).then((index) => addPlaylist(index, response.id));
					count++;
				}
			}
		}
	});

	// tempSongs = [];
	// genres = [];
	// songs = [];
	// artists = [];
}

function addPlaylist(index, userId) {
	// Create a playlist and add songs
	$.ajax({
		url: "https://api.spotify.com/v1/users/" + userId + "/playlists",
		type: "POST",
		headers: {
			'Authorization': 'Bearer ' + access_token
		},
		data: JSON.stringify({
			"name": "auto_" + genres[index]
		}),
		success: function(response) {
			uris = []
			console.log(index)
			for (var j = 0; j < songs[index].length; j++) {
				uris.push(songs[index][j].uri)
			}

			$.ajax({
				url: "https://api.spotify.com/v1/playlists/" + response.id + "/tracks",
				type: "POST",
				headers: {
					'Authorization': 'Bearer ' + access_token
				},
				data: JSON.stringify({
					"uris": uris
				})
			})
		}
	});
}