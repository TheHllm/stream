<?php

function returnError($msg){
    echo json_encode(array( 'error' => $msg));
    exit;
}

if(!isset($_FILES['file']) || $_FILES['file']['tmp_name'] == ""){
    returnError("No file uploaded.");
}
require_once("helper.inc.php");
echo json_encode(array('id' => (new FileSaver())->injestFile($_FILES['file']['tmp_name'], true, !isset($_POST['xhr']))));
?>