<?php
class FileSaver{
    const uploadPath = '/opt/uploads/';
    const convertPath = "/opt/convert/";
    private function returnError($msg){
        echo json_encode(array( 'error' => $msg));
        exit;
    }

    
    public function injestFile($inpath, $isUpload, $redirect){

        //calculate hash to be used as an uid
        $hash = hash_file('md5', $inpath);

        $path = self::convertPath; // move file to convert by default

        //get name and path
        $filetype = exec('file '. $inpath);
        if(strpos($filetype, 'MP4') !== false){
            $extension = 'mp4';
            $path = self::uploadPath; //dont move to convert
        }else if(strpos($filetype, 'Macromedia Flash Video') !== false){
            $extension = 'flv';
        }else if(strpos($filetype, 'AVI') !== false){
            $extension = 'avi';
        }else if(strpos($filetype, 'Matroska') !== false){
            $extension = 'mkv';
        }else{
            $this->returnError("Has to be mp4, flv, mkv, or avi. But it was " . $filetype);
        }

        
        $filePath = $path . $hash . '.' . $extension;

        if(!file_exists($filePath)){
            if($isUpload){
                move_uploaded_file($inpath, $filePath);
            }else{
                rename($inpath, $filePath);
            }
        }

        $fileId = $hash . '.mp4';
        if($redirect){
            header("Location: watch?v=" . $fileId);
        }
        return $fileId;
    }
}
?>