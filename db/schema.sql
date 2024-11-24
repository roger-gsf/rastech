CREATE DATABASE rastech;
USE rastech;

CREATE TABLE usuarios (
    usuario_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_nome VARCHAR(255) NOT NULL,
    usuario_senha VARCHAR(255) NOT NULL,
    usuario_position ENUM('Admin', 'Médico', 'Enfermeiro', 
    'TécnicoDeEnfermagem', 'Instrumentador') NOT NULL
);

CREATE TABLE itens (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    item_nome VARCHAR(255) NOT NULL,
    item_empresa VARCHAR(255) NOT NULL, -- Opcional
    item_status ENUM('Contaminado', 'EmEsterilizacao', 'Esterilizado', 
    'EmUso', 'Extraviado', 'Danificado') NOT NULL,
    item_validade_autoclave DATE NOT NULL,
    item_lote_autoclave INT NOT NULL,
    cb_id FOREIGN KEY codigos_de_barras(codigos_de_barras.cb_id),
    caixa_id FOREIGN KEY REFERENCES caixas(caixa_id)
);

CREATE TABLE caixas (
    caixa_id INT PRIMARY KEY AUTO_INCREMENT,
    caixa_status ENUM('Contaminada', 'EmEsterilizacao', 'Esterilizada', 'EmUso') NOT NULL,
    caixa_local ENUM('Estoque', 'CME', 'CentroCirurgico') NOT NULL,
    caixa_sala VARCHAR(255)
);

CREATE TABLE codigos_de_barras (
    cb_id     INT PRIMARY KEY AUTO_INCREMENT,
    cb_codigo VARCHAR(16) NOT NULL
);

CREATE TABLE kits_prontos (
    kit_id INT PRIMARY KEY AUTO_INCREMENT,
    kit_procedimento_destinado VARCHAR(255) NOT NULL,
    kit_descricao TEXT
);

CREATE TABLE kit_itens (
    kit_itens_id INT PRIMARY KEY AUTO_INCREMENT,
    kit_id INT FOREIGN KEY kits_prontos(kit_id),
    kit_id INT FOREIGN KEY itens(item_id)
);

CREATE TABLE kit_pedidos_historico (
    pedido_id INT PRIMARY KEY AUTO_INCREMENT,
    sala_numero INT NOT NULL,
    medico_id INT FOREIGN KEY usuarios(usuario_id) NOT NULL,
    caixa_id INT FOREIGN KEY caixas(caixa_id) NOT NULL,
    data_encomenda datetime,
    pedido_entregue boolean
);

CREATE TABLE adds_pedidos (
    adicao_id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT FOREIGN KEY kit_pedidos_historico(pedido_id),
    item_id INT FOREIGN KEY itens(item_id)
);
