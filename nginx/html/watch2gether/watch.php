<html>
<head>
    <link rel="stylesheet" href="https://cdn.plyr.io/3.6.2/plyr.css" />
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/main.css">

    <script src="/assets/js/generate.js"> </script>
    <script src="/assets/js/watch.js"> </script>
    <script src="/assets/js/socket.js"> </script>
    <script src="/assets/js/chat.js"> </script>
    <script src="https://cdn.plyr.io/3.6.2/plyr.js"></script>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>

    <style>
        .video-container{
            height: 41.5vw;
        }
    </style>
    <title>Watch2Gether</title>

</head>

<body>
    <div class="container-fluid">
        <div class="row">
            <div class="col h-100">
                <div class="video-container">
                    <div>
                        <video id="video" playsinline controls data-video="<?php echo htmlentities($_GET['v']);?>" controls>
                            <source src="/uploads/<?php echo htmlentities($_GET['v']);?>">
                        </video>
                    </div>
                </div>
                        
            </div>

            <div class="col-md-3">
                <div class="row mb-3 ">
                    <div class="col-12 pb-4">
                        <div class="card" style="width: 18rem;">
                            <div class="card-header">
                                Users
                            </div>
                            <ul id="user-list" class="list-group"></ul>
                        </div>
                    </div>
                    <div class="col-12 mh-100">
                        <div class="card mh-100">
                            <div class="card-header">
                                Chat
                            </div>
                            <div class="card-body">
                                <div id="chat-window" class="text-break bg-white d-flex flex-column bd-highlight mb-3 mh-100" style="max-height: 23em !important; overflow-x: hidden; overflow-y: auto !important;"></div>

                                <form id="chat-form" class="bg-light">
                                    <div class="input-group">
                                        <input type="text" id="chat-input" placeholder="Message" class="form-control">
                                        <div class="input-group-append"> 
                                            <button id="chat-send" type="submit" class="btn btn-link"> <i class="fa fa-paper-plane"></i></button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>

    <script>
        const player = new Plyr('#video');
    </script>
</body>
</html>