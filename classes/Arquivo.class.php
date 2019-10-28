<?php

    class Arquivo{

        private $file;
        private $name;
        private $newPlace;
        private $return;

        public function __construct(){
            
            $this->file     = null;
            $this->fileWay  = null;
            $this->return   = null;
            
        }
        
        public function setFile($file){

            $this->file = $file;

        }

        public function getFile(){

            return $this->return;

        }

        public function getFileName(){

            return $this->file["name"];

        }

        public function getFileSize(){

            return $this->file["size"];
            
        }

        public function getFileType(){

            return $this->file["type"];
            
        }

        public function getFileWay(){

            return $this->file["tmp_name"];
            
        }

        public function getResponse(){
            return $this->return;
        }

        public function getNewFileName(){

            return $this->name;
        }

        public function getNewPlace(){

            return $this->newPlace;
        }

        public function setNewPlace($place){

            $this->newPlace = $place;

        }

        public function setNewFileName($name){

            $this->name = $name;
            
        }

        public function saveImg(string $folder, string $name){
            
            $place      = "imagens/$folder/";
            
            //Pega o tipo do arquivo
            preg_match("/\.[a-zA-Z]*$/", $this->getFileName(), $fileType);

            $newName = $name.$fileType[0];

            $this->setNewFileName($newName);
            $this->setNewPlace($place.$newName);

            if(@move_uploaded_file($this->getFileWay(), $place.$newName)){

                $this->return = true;

            } else{

                $this->return = false;
                
            }
            

        }

        public static function createFolder($nome){

            if(!is_dir("imagens/".$nome))
                mkdir("imagens/".$nome);

        }

        public function downloadImg($place, $type, $size, $nameImg){

            header("Content-type: ".$type);
            header("Content-Length: ". $size);
            header("Content-Transfer-Encoding: binary");
            header("Content-Description: File Transfer");
            header("Content-Disposition: attachment; filename='$nameImg'");
            readfile($place);

        }

        public function deleteImg(string $file){

            unlink($file);

        }

    }