CREATE TABLE estado(
	sigla_estado CHAR(2) PRIMARY KEY,
	nome_estado VARCHAR(60) NOT NULL
);

CREATE TABLE cidade(
	id_cidade SERIAL PRIMARY KEY,
	nome_cidade VARCHAR(60) NOT NULL,
	sigla_estado CHAR(2) NOT NULL,
	FOREIGN KEY(sigla_estado) REFERENCES estado(sigla_estado)
);

INSERT INTO estado(sigla_estado, nome_estado)
VALUES ('RS', 'Rio Grande do Sul'),('SC', 'Santa Catarina'),
	   ('PR', 'Paraná'), ('SP', 'São Paulo'),
	   ('RJ', 'Rio de Janeiro'), ('MG', 'Minas Gerais'),
	   ('MT', 'Mato Grosso'), ('MS', 'Mato Grosso do Sul'),
	   ('PA', 'Pará'), ('AC', 'Acre'),
	   ('TO', 'Tocantins'), ('ES', 'Espírito Santo'),
	   ('AM', 'Amazonas'), ('MA', 'Maranhão'),
	   ('RO', 'Rondônia'), ('RR', 'Roraima'),
	   ('SE', 'Sergipe'), ('PE', 'Pernanbuco'),
	   ('AP', 'Amapá'), ('RN', 'Rio Grande do Norte'),
	   ('BH', 'Bahia'), ('PI', 'Piauí'),
	   ('CE', 'Ceará'), ('PB', 'Paraíba'),
	   ('AL', 'Alagoas'), ('GO', 'Goiás');

INSERT INTO cidade(nome_cidade, sigla_estado)
VALUES ('Porto Alegre', 'RS'), ('Florianópolis', 'SC'), ('Curitiba', 'PR'), ('São Paulo', 'SP'),
	   ('Rio de Janeiro', 'RJ'), ('Vitória', 'ES'), ('Belo Horizonte', 'MG'), ('Cuiabá', 'MT'),
	   ('Campo Grande', 'MS'), ('Belém', 'PA'), ('Rio Branco', 'AC'), ('Palmas', 'TO'),
	   ('Manaus', 'AM'), ('São Luís', 'MA'), ('Porto Velho', 'RO'), ('Boa Vista', 'RR'),
	   ('Aracaju', 'SE'), ('Recife', 'PE'), ('Macapá', 'AP'), ('Natal', 'RN'),
	   ('Salvador', 'BH'), ('Teresina', 'PI'), ('Fortaleza', 'CE'), ('João Pessoa', 'PB'),
	   ('Maceió', 'AL'), ('Goiânia', 'GO');