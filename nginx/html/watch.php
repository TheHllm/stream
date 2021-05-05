<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="color-scheme" content="dark light">
    <link rel="stylesheet" href="/assets/css/theme.light.css">
    <link rel="stylesheet" href="/assets/css/theme.dark.css">
    <link rel="stylesheet" href="/assets/external/plyr.css" />
    <link href="/assets/external/fa/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css">
    <link rel="manifest" href="/manifest.json">
    
    <script>
    let pref = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches; // true if the user prefers dark mode
    let ls = window.localStorage.getItem('dark-theme');
    let darkThemeEnabled = ls !== null ? ls === "true" : pref;

    function initTheme() {
        if (darkThemeEnabled) {
            document.styleSheets[0].disabled = true;
            document.styleSheets[1].disabled = false;
        } else {
            document.styleSheets[0].disabled = false;
            document.styleSheets[1].disabled = true;
        }
    }

    initTheme();

    function changeTheme() {
        darkThemeEnabled = !darkThemeEnabled;
        window.localStorage.setItem('dark-theme', darkThemeEnabled);
        initTheme();
    }

    let darkSwitch
    window.addEventListener("load", () => {
        darkSwitch = document.getElementById('darkSwitch');
        darkSwitch.checked = darkThemeEnabled;
        darkSwitch.addEventListener('change', changeTheme);
    });
    </script>
    
    <script src="/assets/js/watch.js"> </script>
    <script src="/assets/js/socket.js"> </script>
    <script src="/assets/js/chat.js"> </script>
    <script src="/assets/js/userlist.js"> </script>
    <script src="/assets/js/playlist.js"> </script>
    <script src="/assets/js/video.js"> </script>
    <script src="/assets/js/fullscreenDisplay.js"> </script>
    <script src="/assets/external/plyr.js"></script>
    <script src="/assets/external/jquery-3.5.1.slim.min.js"></script>
    <script src="/assets/external/popper.min.js"></script>
    <script src="/assets/external/bootstrap.min.js"></script>
    <script src="/assets/external/Sortable.min.js"></script>

    <title>Watch2Gether</title>

</head>

<body>
    <div class="container-fluid">        
        <div class="row">
            <div class="col-12 mb-2">
                <span id="name"></span>
                <div class="float-right">
                    <div class="custom-control custom-switch d-flex align-items-center justify-content-center">
                        <input class="custom-control-input me-1" type="checkbox" id="darkSwitch">
                        <label class="custom-control-label darkSwitchLabel" for="darkSwitch">
                            <span><i class="bi bi-sun" title="Switch to light mode"></i></span>
                            <span><i class="bi bi-moon-fill" title="Switch to dark mode"></i></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col h-100 mb-3">
                <div id="outer-container">
                    <div class="change-card">
                        <div id="fullscreenBlip" class="media-body mw-100 ml-3 rounded">
                            <p id="fullscreenText" class="text-break text-small mb-0">EGAL</p>
                        </div>
                        
                        <div id="fullscreenBubble">
                        </div>

                        <form autocomplete="off" id="chat-form-fullscreen" class="bg-light pt-2">
                            <div class="input-group">
                                <input type="text" id="chat-input-fullscreen" placeholder="Message" class="form-control" onkeydown=unfocus()>
                                <div class="input-group-append">
                                    <button type="submit" class="btn btn-primary chat-send"> <i class="fa fa-paper-plane"></i></button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div id="video-container">
                    
                    </div>
                </div>
            </div>

            <div class="col-md-3 mb-3">
                <div class="row mb-3 ">
                    <div class="col-12 pb-4">
                        <div class="card">
                            <div class="card-header">
                                Users
                                <button class="btn btn-secondary float-right" data-toggle="collapse" data-target="#user-list" aria-expanded="true">
                                    <i class="fa fa-chevron-up" aria-hidden="true"></i>
                                </button>
                            </div>
                            <ul id="user-list" class="list-group collapse show"></ul>
                        </div>
                    </div>
                    <div class="col-12 mh-100 mb-3">
                        <div class="card mh-100">
                            <div class="card-header">
                                Chat
                                <button class="btn btn-secondary float-right" data-toggle="collapse" data-target="#chat-collapse" aria-expanded="true">
                                    <i class="fa fa-chevron-up" aria-hidden="true"></i>
                                </button>
							</div>
							<div id="chat-collapse" class="collapse show" >
								<div class="card-body pr-2">
									<div id="chat-window" class="pr-2 text-break d-flex flex-column bd-highlight mb-3 mh-100" style="max-height: 23em !important; overflow-x: hidden; overflow-y: auto !important;"></div>

									<form id="chat-form">
										<div class="input-group pr-2">
											<input type="text" id="chat-input" placeholder="Message" class="form-control">
											<div class="input-group-append">
												<button id="chat-send" type="submit" class="btn btn-primary"> <i class="fa fa-paper-plane"></i></button>
											</div>
										</div>
									</form>
								</div>
							</div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Room
                                    <span class="d-none d-xl-inline">&nbsp;link</span>
                                </span>
                            </div>
                            <input type="text" class="form-control bg-light" readonly id="room" value="<?php echo (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";?>">
                            <div class="input-group-append">
                                <button class="btn btn-outline-secondary" id="roomButton" type="button"
                                    data-container="body" data-toggle="popover" data-placement="top" data-content="Copied!"
                                ><i class="far fa-copy"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col">
                <div class="card">
                    <div class="card-header">
                        Playlist
                        <div class="float-right"> <button data-toggle="modal" data-target="#playlistAddModal" class="btn btn-success"><i class="fa fa-plus"></i></button></div>
                    </div>
                    <ul id="playlist" class="list-group list-group-flush">
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="playlistAddModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Add a video</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="playlist-add-form">
                        <div class="form-group">
                            <label for="message-text" class="col-form-label">Add a video:</label>
                            <input id="playlist-add-input" class="form-control" id="message-text" type="text"></input>
                        </div>
                        <div class="float-right">
                            <button type="submit" class="btn btn-success">Add</button>
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>