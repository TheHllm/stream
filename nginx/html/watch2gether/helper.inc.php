<?php
class FileSaver{
    const uploadPath = '/opt/uploads/';
    const convertPath = "/opt/convert/";
    const extensionMap = array(
        'Macromedia Flash Video' => 'flv',
        'AVI' => 'avi',
        'Matroska' => 'mkv',
        'Audio file with ID3' => 'mp3',
        'MPEG ADTS, layer III' => 'mp3',
        'WAVE' => 'wav',
        'Ogg' => 'ogg',
        'PNG' => 'png'
    );
    private function returnError($msg){
        echo json_encode(array( 'error' => $msg));
        exit;
    }

    
    public function injestFile($inpath, $isUpload, $redirect){

        //calculate hash to be used as an uid
        $hash = hash_file('md5', $inpath);

        $path = self::convertPath; // move file to convert by default

        //get name and path
        $filetype = exec('file '. escapeshellarg($inpath));
        if(strpos($filetype, 'MP4') !== false){
            $extension = 'mp4';
            $path = self::uploadPath; //dont move to convert
        }
        
        foreach (self::extensionMap as $str => $ext) {
            if(strpos($filetype, $str) !== false){
                $extension = $ext;
                break;
            }
        }

        if(!isset($extension)){
            $this->returnError("Has to be ". implode(', ', array_values(self::extensionMap)) ." but it was " . $filetype);
        }

        $fileId = $hash . '.mp4';

        //check if the file was already converted
        $finalPath = self::uploadPath . $fileId;
        if(!file_exists($finalPath)){
            $filePath = $path . $hash . '.' . $extension;
            if(!file_exists($filePath)){                
                if($isUpload){
                    move_uploaded_file($inpath, $filePath);
                }else{
                    rename($inpath, $filePath);
                }
            }
        }

        if($redirect){
            header("Location: watch?v=" . $fileId);
        }
        return $fileId;
    }
}
?>