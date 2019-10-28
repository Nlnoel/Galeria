drop database if exists galeria;
create database galeria
default collate utf8_general_ci
default character set utf8;

use galeria;

drop table if exists album;
create table if not exists album(
	id bigint unsigned auto_increment not null primary key,
    album varchar(300) not null,
    descricao text
)default charset=UtF8 Engine=InnoDB;

drop table if exists foto;
create table if not exists foto(
	id bigint unsigned auto_increment not null primary key,
    nome varchar(200) not null,
    tipo varchar(30) not null,
    tamanho bigint not null,
    caminho varchar(350) not null,
    album bigint unsigned not null,
    constraint FK_ALBUM_ALBUM_ID foreign key(album) references album(id)
)default charset=UTF8 Engine=InnoDB;

insert into album(id, album, descricao) VALUES
(1, 'Tigres', 'Fotos aleatórias de Tigres'),
(2, 'Dogs', 'Foto de Cachorrinhos'),
(3, 'Pandas', 'Fotos de pandinha');

-- image/jpeg 	image/png
insert into foto(nome, tipo, tamanho, caminho, album) values
('tigre1.jpeg', 'image/jpeg', '500000', 'imagens/tigres/tigre1.jpeg', '1'),
('tigre2.jpg', 'image/jpeg', '500000', 'imagens/tigres/tigre2.jpg', '1'),
('tigre3.jpg', 'image/jpeg', '500000', 'imagens/tigres/tigre3.jpg', '1'),
('tigre4.jpeg', 'image/jpeg', '500000', 'imagens/tigres/tigre4.jpeg', '1'),
('tigre5.jpeg', 'image/jpeg', '500000', 'imagens/tigres/tigre5.jpeg', '1'),
('Auau6.jpg', 'image/jpeg', '500000', 'imagens/dogs/Auau1.jpg', '2'),
('Auau4.jpg', 'image/jpeg', '500000', 'imagens/dogs/Auau4.jpg', '2'),
('Auau10.jpg', 'image/jpeg', '500000', 'imagens/dogs/Auau10.jpg', '2'),
('Auau7.jpeg', 'image/jpeg', '500000', 'imagens/dogs/Auau7.jpeg', '2'),
('Auau9.jpeg', 'image/jpeg', '500000', 'imagens/dogs/Auau9.jpeg', '2'),
('panda3.jpeg', 'image/jpeg', '500000', 'imagens/pandas/panda3.jpeg', '3'),
('panda2.jpg', 'image/jpeg', '500000', 'imagens/pandas/panda2.jpg', '3'),
('panda1.jpg', 'image/jpeg', '500000', 'imagens/pandas/panda1.jpg', '3'),
('panda4.jpg', 'image/jpeg', '500000', 'imagens/pandas/panda4.jpg', '3'),
('panda6.jpeg', 'image/jpeg', '500000', 'imagens/pandas/panda6.jpeg', '3');

