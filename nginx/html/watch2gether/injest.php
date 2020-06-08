<?php
require_once("helper.inc.php");
$fs = new FileSaver();

$rtn = array();
$path = '/opt/injest/';
$files = scandir($path);
foreach($files as $file) {
    if(strpos($file, '.') === 0){ //remove hidden files and . and ..
        continue;
    }
    $rtn[$file] = $fs->injestFile($path . $file, false, false);
}
echo json_encode($rtn);
?>