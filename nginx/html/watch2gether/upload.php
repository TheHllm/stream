<?php
function returnError($msg){
    echo json_encode(array( 'error' => $msg));
    exit;
}

//check if file present
if(!isset($_FILES['file'])){
    returnError("No file uploaded.");
}


//calculate hash
$hash = hash_file('md5', $_FILES['file']['tmp_name']);

//get name and path
echo exec('ls /tmp/');
$filetype = exec('file '. $_FILES['file']['tmp_name']);
if(strpos($filetype, 'MP4') !== false){
    $extension = "mp4";
}else if(strpos($filetype, 'Macromedia Flash Video') !== false){
    $extension = 'flv';
}else if(strpos($filetype, 'AVI') !== false){
    $extension = 'avi';
}else{
    returnError("Has to be mp4,flv or avi!");
}

$extension = pathinfo($_FILES['file']['name'])['extension'];

$filename = $hash . '.' . $extension;
$path = '/opt/uploads/' ;
$filePath = $path . $filename;


//make dir
if (!is_dir($path)) {
    mkdir($path);
}

if(!file_exists($filePath)){
    move_uploaded_file($_FILES['file']['tmp_name'], $filePath);
}

echo json_encode(array('id' => $filename));

?>