$(document).ready(function(){
    
    //Carregamento inicial da página
    $(function(){

        updateTela();

    });//*

    //Adiciona uma imagem no album
    $("main").children("div.row").delegate("a#add-photography", "click", function(){

        let texto = "Adicionar Foto ao Album " + $.trim($(this).closest("div.card-image").children("span").html());

        $("div#modalAddImg").children("div#photography").children("div#field-photography").remove();
        $("div#modalAddImg").children("div#photography").children("div#addNewAlbum").remove();
        $("div#modalAddImg").children("div#photography").children("ul.collapsible").remove();

        $("div#modalAddImg").children("div#photography").append(
            "<div class=\"modal-content center\" style=\"cursor: pointer; border: dotted lightgray; padding: 130px\" id=\"field-photography\" title=\"Adicionar foto\">"+
                "<i class=\"material-icons grey-text lighten-3\">add_a_photo</i>"+
            "</div>"
        );//*/

        $("div#modalAddImg").find("button#oneMore").show();

        setTimeout(() => {

            $("input[name='album']").val($(this).attr("data-id"));
            $("div#modalAddImg").attr("data-id", $(this).attr("data-id"));
            $("div#modalAddImg").find("div.modal-footer").children("button#oneMore").attr("data-tooltip", texto);

        }, 400);

    });//*/

    //Coloca a imagem selecionada do carrocel em tela cheia
    $("main").children("div.row").delegate("img.materialboxed", "click", function(){
        
        let imgCurrent = $(this);

        setTimeout(() => {

            if(imgCurrent.hasClass("active")){

                $("img.materialboxed").each(function(){

                    if($(this).closest("div.carousel").attr("style") != "overflow: visible;"){
                        
                        $(this).closest("div.col.m4").css("visibility", "hidden");
                        $(this).css("visibility", "hidden");
                        
                    }
                    
                });

                $("div.row").attr("view", "true");
                $("a#add-photography").hide();
                $("span").hide();

            } else{

                $("img.materialboxed").each(function(){
                        
                    $(this).closest("div.col.m4").css("visibility", "visible");
                    $(this).css("visibility", "visible");
                    
                });

                $("div.row").attr("view", "false");
                $("span").show();
                $("a#add-photography").show();

            }

        }, 300);
        
    });
    
    //Tira outros elementos que possam dificultar a aparesentação da imagem selecionada em tela cheia
    $("main").children("div.row").delegate("div#materialbox-overlay", "click", function(){

        $("img.materialboxed").each(function(){
                        
            $(this).closest("div.col.m4").css("visibility", "visible");
            $(this).css("visibility", "visible");
            
        });

        $("div.row").attr("view", "false");
        $("span").show();
        $("a#add-photography").show();

    });

    //Adiciona uma nova foto ao album selecionado
    $("button#oneMore").click(function(){
        
        event.preventDefault();

        if($("div#modalAddImg").children("div#photography").find("img").html() !== undefined){

            const btnThis = $(this);
            let addNewImg = new FormData($("form#add-in-album")[0]);

            $.ajax({
                
                url: "acoes.php",
                type: "POST",
                processData: false,
                contentType: false,
                dataType: "json",
                data: addNewImg,
                beforeSend: function(){

                    $("div#progress-load").show();
                    btnThis.prop("disabled", "true");
                    btnThis.closest("div.modal-footer").children("button[data-tooltip='Fechar Modal']").prop("disabled", "true");
                    

                }
                
            }).done(function(val){
                
                if(val["error"]){

                    alert(val["message"]);

                    $("div#progress-load").hide();
                    btnThis.removeAttr("disabled");
                    btnThis.closest("div.modal-footer").children("button[data-tooltip='Fechar Modal']").removeAttr("disabled");

                } else{

                    alert("Imagem inserida com sucesso.");

                    $("div#progress-load").hide();
                    btnThis.removeAttr("disabled");
                    btnThis.closest("div.modal-footer").children("button[data-tooltip='Fechar Modal']").removeAttr("disabled");

                    btnThis.closest("div.modal-footer").children("button[data-tooltip='Fechar Modal']").trigger("click");

                    updateTela();

                }

            }).fail(function(x, status, val){

                alert(val);
                $("div#progress-load").hide();
                btnThis.removeAttr("disabled");
                btnThis.closest("div.modal-footer").children("button[data-tooltip='Fechar Modal']").removeAttr("disabled");

            });

        } else{

            if($("div#modalAddImg").children("div#photography").find("input#nmAlbum").html() !== undefined){

                if($("input#nmAlbum").val() !== ""){

                    let btnThis = $(this);

                    $.ajax({

                        url: "acoes.php",
                        type: "POST",
                        dataType: "json",
                        
                        data: {

                            action: "InsertAlbum",
                            nmAlbum: $("input#nmAlbum").val(),
                            descAlbum: $("input#descAlbum").val()

                        }

                    }).done(function(val){

                        if(val["error"]){
                            alert(val["message"])
                        } else{

                            alert("Album cadastrado com sucesso.");
                            btnThis.closest("div.modal-footer").children("button[data-tooltip='Fechar Modal']").trigger("click");

                            updateTela();
                            
                        }
                    }).fail(function(x, status, val){

                        alert(val);

                    });

                } else{

                    alert("Insira um nome para o album.");

                }

            } else{

                alert("Adicione uma foto para prosseguir.");

            }
            
        }

    });

    //Adiciona uma foto quando clica na tela
    $("div#modalAddImg").delegate("div#field-photography", "click", function(){

        $("input#add-new-img").trigger("click");

    });

    //Carregamento previo da imagem
    $("input#add-new-img").change(function(){
        
        const file = $(this)[0].files[0];
        const fileReader = new FileReader();
        
        if(file.type === "image/png" || file.type === "image/jpeg"){

            fileReader.onloadend = function(){
                
                $("div#modalAddImg").children("div#photography").children("div#field-photography").remove();
                
                $("div#modalAddImg").children("div#photography").append(
                    "<div class=\"modal-content center\" style=\"cursor: pointer; border: dotted lightgray;\" id=\"field-photography\" title=\"Adicionar foto\">"+
                       "<img src=\""+ fileReader.result +"\" style=\"height: 100%; width: 100%;\">"+
                    "</div>"
                );

            }

            fileReader.readAsDataURL(file);

        } else{

            alert("Tipo de arquivo não permitido. Insira uma imagem com extenção PNG ou JPEG para alterar.");

            $("div#modalAddImg").children("div#photography").children("div#field-photography").remove();

            $("div#modalAddImg").children("div#photography").append(
                "<div class=\"modal-content center\" style=\"cursor: pointer; border: dotted lightgray; padding: 130px\" id=\"field-photography\" title=\"Adicionar foto\">"+
                   "<i class=\"material-icons grey-text lighten-3\">add_a_photo</i>"+
                "</div>"
            );//*/

        }

        
    });

    //Adiciona um novo album
    $("a#add-album").click(function(){

        $("div#modalAddImg").children("div#photography").children("div#field-photography").remove();
        $("div#modalAddImg").children("div#photography").children("div#addNewAlbum").remove();
        $("div#modalAddImg").children("div#photography").children("ul.collapsible").remove();

        $("div#modalAddImg").children("div#photography").append(
            "<div id=\"addNewAlbum\" class=\"row\">"+
                "<div class=\"input-field col s6\">"+
                    "<input id=\"nmAlbum\" type=\"text\" class=\"validate\">"+
                    "<label class=\"active\" for=\"nmAlbum\">Nome do Album</label>"+
                "</div>"+
                "<div class=\"input-field col s6\">"+
                    "<input id=\"descAlbum\" type=\"text\" class=\"validate\">"+
                    "<label class=\"\" for=\"descAlbum\">Descrição do Album</label>"+
                "</div>"+
            "</div>"
        );

        $("div#modalAddImg").find("button#oneMore").show();

        $("div#modalAddImg").find("div.modal-footer").children("button#oneMore").attr("data-tooltip", "Criar novo album.");

        $("input#nmAlbum").focus();

    });

    //Caso o adicionar album esteja aberto e o usuário aperte enter em algum momento com o campo ativo
    $("div#modalAddImg").delegate("input#nmAlbum, input#descAlbum", "keypress", function(event){

        if(event.key === "Enter"){

            $("button#oneMore").trigger("click");

        }

    });
    
    //Lista todos os albuns
    $("a#list-albuns").click(function(){

        $.ajax({

            url: "acoes.php",
            type: "GET",
            dataType: "json",

            data: {

                action: "ListAlbuns"

            }

        }).done(function(val){

            if(val["error"]){

                alert(val["message"]);

            } else{

                let htmlList = "<ul class=\"collapsible\">";
                let data = val["data"];
                
                $("div#modalAddImg").children("div#photography").children("div#field-photography").remove();
                $("div#modalAddImg").children("div#photography").children("div#addNewAlbum").remove();
                $("div#modalAddImg").children("div#photography").children("ul.collapsible").remove();
                
                for(x in data){

                    htmlList += "<li>"+
                                    "<div class=\"collapsible-header\" id=\"open-album\" data-id=\""+ data[x]['id'] +"\">"+
                                        "<i class=\"material-icons\">folder_open</i>"+
                                        data[x]['album']+
                                        "<span class=\"badge\">"+ data[x]['qtdFotos'] +"</span>"+
                                    "</div>"+
                                    "<div class=\"collapsible-body grey lighten-3\">"+
                                        "<span>Oia eu aqui</span>"+
                                    "</div>"+
                                "</li>"

                }

                htmlList += "</ul>";

                $("div#modalAddImg").children("div#photography").append(htmlList);
                $(".collapsible").collapsible();
                $("div#modalAddImg").find("button#oneMore").hide();

            }
        }).fail(function(x, status, val){

            alert(val);

        });

    });

    //Lista fotos do album selecionado
    $("div#modalAddImg").delegate("div#open-album", "click", function(){
        
        let btnThis = $(this);

        if(btnThis.closest("li").children("div.collapsible-body").children("ul.collection").html() === undefined){
            
            $.ajax({

                url: "acoes.php",
                type: "GET",
                dataType: "json",

                data: {

                    action: "LisPhotography",
                    album: btnThis.attr("data-id")

                },
                beforeSend: function(){

                    btnThis.closest("li").children("div.collapsible-body").html(

                        "<div class=\"preloader-wrapper active\">"+
                            "<div class=\"spinner-layer spinner-red-only\">"+
                            "<div class=\"circle-clipper left\">"+
                                "<div class=\"circle\"></div>"+
                            "</div><div class=\"gap-patch\">"+
                                "<div class=\"circle\"></div>"+
                            "</div><div class=\"circle-clipper right\">"+
                                "<div class=\"circle\"></div>"+
                            "</div>"+
                            "</div>"+
                        "</div>"

                    );

                    btnThis.closest("li").children("div.collapsible-body").addClass("center");

                }

            }).done(function(val){

                if(val["error"]){
                    btnThis.closest("li").children("div.collapsible-body").html(val["message"]);

                } else{

                    let data = val["data"];
                    let htmlPhoto = "<ul class=\"collection\">";

                    for(x in data){

                        htmlPhoto += "<li class=\"collection-item avatar\">"+
                                        "<img src=\""+ data[x]['caminho'] +"\" alt=\"\" class=\"circle\">"+
                                        "<span class=\"title\">"+ data[x]['nome'] +"</span>"+
                                        "<div class=\"secondary-content\" style=\"font-size: 53px\">"+
                                            "<a href=\""+ data[x]['caminho'] +"\" download=\""+ data[x]['nome'] +"\" id=\"download-photography\" title=\"Baixar Foto\">"+
                                                "<i style=\"font-size: 40px\" class=\"material-icons\">cloud_download</i>"+
                                            "</a>"+

                                            "<i class=\"material-icons\" id=\"delete-photography\" style=\"font-size: 40px; cursor: pointer;\" data-id=\""+ data[x]['id'] +"\" title=\"Apagar Foto\">remove_circle</i>"+
                                        "</div>"+
                                    "</li>";
                    }

                    htmlPhoto += "</ul>";

                    btnThis.closest("li").children("div.collapsible-body").removeClass("center");
                    btnThis.closest("li").children("div.collapsible-body").html(htmlPhoto);

                }

            }).fail(function(x, status, val){
                
                btnThis.closest("li").children("div.collapsible-body").html(val);
                
            });

        }

    });

    //Apaga a foto selecionada do listar
    $("div#modalAddImg").delegate("i#delete-photography", "click",function(){
        
        let confirmation = confirm("Deseja realmente apagar está foto?");

        if(confirmation){

            let btnThis = $(this);

            $.ajax({

                url: "acoes.php",
                type: "POST",

                data: {

                    action: "DeletePhotography",
                    photography: btnThis.attr("data-id"),
                    place: btnThis.closest("ul").children("li:first").children("img").attr("src")

                }

            }).done(function(val){

                if(val["error"])
                    alert(val["message"]);
                else
                    btnThis.closest("li").remove();

            }).fail(function(x, status, val){

                alert(val);

            });

        }

    });//*/

    //Função de atualizar os carroceis
    function updateTela(){

        $.ajax({

            url: "acoes.php",
            type: "GET",
            dataType: "json",

            data: {

                action: "OpenGallery"

            },
            beforeSend: function(){

                $("main").children("div.row").html(
                    "<div class=\"col s6\"></div>"+
                    "<div class=\"col s4\" style=\"margin-top: 15em;\">"+
                        "<div class=\"preloader-wrapper big active\">"+
                            "<div class=\"spinner-layer spinner-red-only\">"+
                                "<div class=\"circle-clipper left\">"+
                                    "<div class=\"circle\"></div>"+
                                "</div>"+
                                    "<div class=\"gap-patch\">"+
                                    "<div class=\"circle\"></div>"+
                                "</div><div class=\"circle-clipper right\">"+
                                    "<div class=\"circle\"></div>"+
                                "</div>"+
                            "</div>"+
                        "</div>"+
                    "</div>"
                );

            }

        }).done(function(val){

            if(val["error"]){
                alert(val["message"]);
            } else{

                let data     = val["return"];
                let htmlMain = "";
                let arrFotos = "";
                let arrId    = "";

                //Loop inicial que criará os albuns
                for(x in data){
                    
                    htmlMain += "<div class=\"col m4\">"+
                                    "<div class=\"card\">"+
                                        "<div class=\"card-image\">"+
                                            "<div class=\"carousel\" id=\""+ data[x]['album'] +"\">";

                    if(data[x]["arrFotos"] !== null && data[x]["arrFotos"] !== ""){

                        arrFotos = data[x]["arrFotos"].split("[@]");
                        arrId    = data[x]["arrId"].split("[@]");

                        //segundo loop que colocará as fotos de cada album
                        for(y in arrFotos){

                            htmlMain += "<a class=\"carousel-item\" href=\"#"+ data[x]['album'] + arrId[y] +"!\">"+
                                            "<img class=\"materialboxed\" src=\""+ arrFotos[y] +"\">"+
                                        "</a>";
                        }
                    
                    } else{

                        htmlMain += "<a class=\"carousel-item\" href=\"#!\">"+
                                        "<img class=\"materialboxed\" src=\"\">"+
                                    "</a>";

                    }
                    
                    htmlMain += "</div>";

                    htmlMain += "<span class=\"card-title black-text\">"+ data[x]['album'] +"</span>"+
                                "<a class=\"btn-floating halfway-fab waves-effect waves-light red modal-trigger tooltipped\" data-position=\"bottom\" data-tooltip=\"Adicionar foto ao album\" id=\"add-photography\" data-id=\""+ data[x]['id'] +"\" href=\"#modalAddImg\">"+
                                "<i class=\"material-icons\">add</i>"+
                                "</a></div>"+
                                "<div class=\"card-content\">"+
                                "<p>"+ data[x]['descricao'] +"</p>"+
                                "</div>"+
                                "</div></div>";

                }

                $("main").children("div.row").html(htmlMain);

                M.AutoInit();

            }

        }).fail(function(x, status, val){

            alert("Atualize sua página.");
            console.log(val);

        });

    }

    //Muda imagem dos Carrosséis
    setInterval(() => {
        
        if($("div.row").attr("view") === "false"){
            
            $('.carousel').carousel("next");

        }

    }, 3500);

});
