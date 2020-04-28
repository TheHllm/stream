<?php
ob_start();

if(!isset($_GET["name"])){
    header("Location: /");
    exit;
}

$stats = file_get_contents("http://nginx:80/stats");
$xml = simplexml_load_string($stats);
$hsl = $xml->xpath("//application[name='dash']")[0];
foreach($hsl->live->stream as $stream){
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
    
    $filename = "/opt/dash/$fullname/index.mpd";
    $handle = fopen($filename, "rb");
    $contents = fread($handle, filesize($filename));
    fclose($handle);
    
    $contents = preg_replace('/"(.*\.m4.)"/', '"/get/'.filter_var($name, FILTER_SANITIZE_ENCODED).'/$1"', $contents);

    header("content-type: application/dash+xml");
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    echo $contents;

    exit;
}
header("Location: /");
?>