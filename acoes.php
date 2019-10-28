<?php

    require_once("classes/Autoload.class.php");

    $autoload = new Autoload();

    $action = "";
    if(isset($_POST["action"])){
        
        $action   = $_POST["action"] ?? "";

    } else{

        $gets = array(
            "OPENGALLERY",
            "SEPARETFILES"
        );

        if(isset($_GET["action"]) && in_array(mb_strtoupper(trim($_GET["action"])), $gets)){

            $action = trim($_GET["action"]);

        } else{
            
            $action = "";

        }

    }

    switch (mb_strtoupper($action)) {
        
        case 'ADDPHOTOGRAPHY':

            try {
                
                $objConn  = new Conexao();
                $objFile  = new Arquivo();

                $idFolder = $_POST["album"] ?? "";
                $objFile->setFile($_FILES["add-new-img"]);

                $strSearch = "SELECT album FROM album
                              WHERE id = ?";

                $stm = $objConn->run($strSearch, [$idFolder]);

                if($stm && $stm->rowCount()){

                    $row = $stm->fetch();
                    $folder = $row["album"];

                    $strSearch = "SELECT id FROM foto
                                  ORDER BY id desc
                                  LIMIT 1";

                    $stm = $objConn->run($strSearch);

                    if($stm){

                        $row = $stm->fetch();

                        $nextValue = $row["id"] + 1;
                        $newNome      = $folder.$nextValue;

                        $objFile->saveImg(trim(mb_strtolower($folder)), trim(mb_strtolower($newNome)));//*/

                        if($objFile->getResponse()){
                            
                            $strInsert = "INSERT INTO foto (nome, tipo, tamanho, caminho, album) VALUES (?, ?, ?, ?, ?)";

                            $stm = $objConn->run($strInsert, [$objFile->getNewFileName(), $objFile->getFileType(), $objFile->getFileSize(), $objFile->getNewPlace(), $idFolder]);

                            if($stm){
                                
                                $ret = array("error" => false);

                            } else{

                                $ret = array("error" => true, "message" => "Não foi possível salvar a foto, tente novamente mais tarde.");

                            }
                        } else{

                            $ret = array("error" => true, "message" => "Não foi possível salvar a foto.");

                        }
                    } else{

                        $ret = array("error" => true, "message" => "Error ao buscar o ultimo id ");

                    }

                } else{

                    $ret = array("error" => true, "message" => "Erro ao tentar pegar o nome da pasta.");

                }
                
                echo json_encode($ret);

            } catch (Exception $e) {
                
                $ret = array("error" => true, "message" => $e->getMessage());

                echo json_encode($ret);
            }

        break;
        
        case 'OPENGALLERY':

            try {
                    
                $objConn   = new Conexao();

                $strSearch = "SELECT *,
                              (
                                  SELECT GROUP_CONCAT(caminho SEPARATOR '[@]') as caminho FROM foto
                                  WHERE album = alb.id
                                  ORDER BY id
                              ) AS arrFotos,
                              (
                                  SELECT GROUP_CONCAT(id SEPARATOR '[@]') as ids FROM foto
                                  WHERE album = alb.id
                                  ORDER BY id
                              ) AS arrId
                              FROM album alb";

                $stm = $objConn->run($strSearch);
                
                if($stm && $stm->rowCount() > 0){

                    $ret = array("error" => false, "return" => $stm->fetchAll());

                } else{

                    $ret = array("error" => true, "message" => "Não há albuns ou fotos registradas.");
                }

                echo json_encode($ret);

            } catch (Exception $e) {
                
                $ret = array("error" => true, "message" => $e->getMessage());

                echo json_encode($ret);
            }

        break;

        case 'INSERTALBUM':
            
            try {
                
                $objConn = new Conexao();
                
                $nmAlbum = $_POST["nmAlbum"] ?? "";
                $descAlbum = $_POST["descAlbum"] ?? "";
                
                Arquivo::createFolder(trim($nmAlbum));

                $strInsert = "INSERT INTO album(album, descricao) VALUES(?, ?)";

                $stm = $objConn->run($strInsert, [$nmAlbum, $descAlbum]);

                if($stm){

                    $ret = array("error" => false);

                } else{

                    $ret = array("error" => true, "message" => "Erro ao tentar inserir o album.");

                }

                echo json_encode($ret);

            } catch (Exception $e) {
                
                $ret = array("error" => true, "message" => $e->getMessage());

                echo json_encode($ret);

            }
        
        break;
        
    }