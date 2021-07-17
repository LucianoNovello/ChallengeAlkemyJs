create database ng_client_db;

use ng_client_db;
CREATE TABLE IF NOT EXISTS users(
    id_user varchar(200),
    email VARCHAR(50),
    pass VARCHAR(50),
    CONSTRAINT pk_user PRIMARY KEY(id_user),
    CONSTRAINT unq_email UNIQUE (email)
);
CREATE TABLE IF NOT EXISTS transactions(
    id_transaction VARCHAR(200)  NOT NULL,
    mount float,
    type_movement VARCHAR(200),
    concept VARCHAR(50),
    trans_date DATETIME,
    id_user varchar(200) NOT NULL,
    category varchar(50),
    CONSTRAINT pk_trans PRIMARY KEY (id_transaction),
    CONSTRAINT fk_user FOREIGN KEY(id_user) REFERENCES users(id_user)
);