<?php
class FileSaver{
    private function returnError($msg){
        echo json_encode(array( 'error' => $msg));
        exit;
    }

    
    
    public function injestFile($inpath, $isUpload, $redirect){

        //calculate hash
        $hash = hash_file('md5', $inpath);

        //get name and path
        $filetype = exec('file '. $inpath);
        if(strpos($filetype, 'MP4') !== false){
            $extension = "mp4";
        }else if(strpos($filetype, 'Macromedia Flash Video') !== false){
            $extension = 'flv';
        }else if(strpos($filetype, 'AVI') !== false){
            $extension = 'avi';
        }else{
            $this->returnError("Has to be mp4,flv or avi!");
        }

        $filename = $hash . '.' . $extension;
        $path = '/opt/uploads/' ;
        $filePath = $path . $filename;


        //make dir
        if (!is_dir($path)) {
            mkdir($path);
        }

        if(!file_exists($filePath)){
            if($isUpload){
                move_uploaded_file($inpath, $filePath);
            }else{
                rename($inpath, $filePath);
            }
        }
        if($redirect){
            header("Location: watch?v=" . $filename);
        }
        return $hash;
    }
}
?>