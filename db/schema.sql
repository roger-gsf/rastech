CREATE DATABASE rastech;
USE rastech;

CREATE TABLE usuarios (
    usuario_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_nome varchar(255) not null,
    usuario_senha varchar(255) not null,
    usuario_position ENUM('Admin', 'Médico', 'Enfermeiro', 'TécnicoDeEnfermagem', 'Instrumentador') not null
);

CREATE TABLE codigos_de_barras (
    cb_id     INT PRIMARY KEY AUTO_INCREMENT,
    cb_codigo VARCHAR(16) NOT NULL
);

CREATE TABLE caixas (
    caixa_id INT PRIMARY KEY AUTO_INCREMENT,
    caixa_status ENUM('Contaminada', 'EmEsterilizacao', 'Esterilizada', 'EmUso', 'ParaUso') NOT NULL,
    caixa_local ENUM('Estoque', 'CME', 'CentroCirurgico') NOT NULL,
    caixa_sala VARCHAR(255)
);


CREATE TABLE itens (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    item_nome VARCHAR(255) NOT NULL,
    item_empresa VARCHAR(255) NOT NULL, -- Opcional
    item_status ENUM('Contaminado', 'EmEsterilizacao', 'Esterilizado', 'EmUso', 'Extraviado', 'Danificado') NOT NULL,
    item_validade_autoclave DATE NOT NULL,
    item_lote_autoclave INT NOT NULL,
    cb_id int NOT NULL,
    FOREIGN KEY (cb_id) REFERENCES codigos_de_barras(cb_id),
    caixa_id int not null,
    FOREIGN KEY (caixa_id) REFERENCES caixas(caixa_id)
);



CREATE TABLE kits_prontos (
    kit_id int PRIMARY key AUTO_INCREMENT,
    kit_procedimento_destinado varchar(255) not null,
    kit_descricao text
);

CREATE TABLE kit_itens (
    kit_itens_id INT PRIMARY KEY AUTO_INCREMENT,
    kit_id int,
    foreign key (kit_id) references kits_prontos(kit_id),
    item_id int,
    foreign key (item_id) references itens(item_id)
);

CREATE TABLE kit_pedidos_historico (
    pedido_id INT PRIMARY KEY AUTO_INCREMENT,
    sala_numero INT not null,
    medico_id INT, 
    FOREIGN KEY (medico_id) references usuarios(usuario_id),
    caixa_id INT,
    foreign key (caixa_id) references caixas(caixa_id),
    data_encomenda datetime,
    pedido_entregue boolean
);

CREATE TABLE adds_pedidos (
    adicao_id int PRIMARY key AUTO_INCREMENT,
    pedido_id int,
    foreign key (pedido_id) references kit_pedidos_historico(pedido_id),
    item_id int,
    foreign key (item_id) references itens(item_id)
);
