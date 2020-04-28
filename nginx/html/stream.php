<?php
    ob_start();
?>
<!DOCTYPE html>
<html>

<head>
        <meta charset="utf-8">
        <title>stream</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" media="screen" href="/index.css">
</head>

<body>
        
        <?php 
            $stats = file_get_contents("http://nginx:80/stats");
            $xml = simplexml_load_string($stats);
            $dash = $xml->xpath("//application[name='dash']")[0];
            $found = false;
            $name;
            $meta;

            foreach($dash->live->stream as $stream){
                $fullname = (string)$stream->name;
                $particles = explode(":", $fullname, 2);
                $name = htmlspecialchars($particles[0]);

                if($name != $_GET["name"])
                    continue;

                $found = true;
                $meta = $stream->meta;
                if(count($particles) > 1){
                    $password = $particles[1];
                    if (isset($_SERVER['PHP_AUTH_USER']) && $_SERVER['PHP_AUTH_PW'] == $password) {
                    } else {
                        header('WWW-Authenticate: Basic realm="'.$name.'"');
                        header('HTTP/1.0 401 Unauthorized');
                        echo 'UNAUTHORIZED';
                        exit;
                    }
                }
                echo "<h1>You're watching: $name</h1>";
                break;
            }

            if(!$found){
                header("Location: /");
                exit;
            }
        ?>
        <div class="content">
            <video autoplay id="videoPlayer" width=<?php echo $meta->video->width?> height=<?php echo $meta->video->height?> class="video-container" controls>
                
            </video>

            <script src="http://cdn.dashjs.org/latest/dash.all.min.js"></script>
            <script>
                
                var url = "/list/<?php echo filter_var($name, FILTER_SANITIZE_ENCODED);?>";
                var player = dashjs.MediaPlayer().create();
                player.updateSettings({
                    'debug': {
                        'logLevel': dashjs.Debug.LOG_LEVEL_INFO
                    },
                    'streaming':
                    {
                        'liveDelayFragmentCount': 3
                        
                    }
                });
                player.initialize(document.querySelector("#videoPlayer"), url, true);

            
            </script>

        </div>
</body>