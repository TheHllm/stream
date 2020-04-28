<?php
ob_start();

if(!isset($_GET["name"]) || !isset($_GET["file"])){
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

    $file = str_replace("/", "", $_GET["file"]); // 'sanitize' input

    $filename = "/opt/dash/$fullname/$file";

    if(!file_exists($filename)){
        http_response_code(404);
        exit;
    }

    header("content-type: application/octet-stream");
    readfile($filename);

    exit;
}
header("Location: /");
?>