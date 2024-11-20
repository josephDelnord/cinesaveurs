-- Table ROLE
CREATE TABLE ROLE (
    id_role INT PRIMARY KEY,
    role TEXT NOT NULL
);

-- Table USER
CREATE TABLE USER (
    id_user INT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    date_created DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL,
    id_role INT NOT NULL,
    FOREIGN KEY (id_role) REFERENCES ROLE(id_role)
);

-- Table CATEGORY
CREATE TABLE CATEGORY (
    id_category INT PRIMARY KEY,
    name TEXT NOT NULL
);

-- Table RECIPE
CREATE TABLE RECIPE (
    id_recipe INT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    anecdote TEXT,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    source TEXT,
    date_added DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Table INGREDIENT
CREATE TABLE INGREDIENT (
    id_ingredient INT PRIMARY KEY,
    name TEXT NOT NULL,
    quantity TEXT NOT NULL,
    unit TEXT NOT NULL,
    id_recipe INT,
    FOREIGN KEY (id_recipe) REFERENCES RECIPE(id_recipe)
);

-- Table INSTRUCTIONS
CREATE TABLE INSTRUCTIONS (
    id_instruction INT PRIMARY KEY,
    id_recipe INT,
    instruction_text TEXT,
    FOREIGN KEY (id_recipe) REFERENCES RECIPE(id_recipe)
);


-- Table COMMENT
CREATE TABLE COMMENT (
    id_comment INT PRIMARY KEY,
    content TEXT NOT NULL,
    date_comment DATE NOT NULL DEFAULT CURRENT_DATE,
    id_user INT NOT NULL,
    id_recipe INT NOT NULL,
    FOREIGN KEY (id_user) REFERENCES USER(id_user),
    FOREIGN KEY (id_recipe) REFERENCES RECIPE(id_recipe)
);

-- Table SCORE
CREATE TABLE SCORE (
    score INT CHECK (score BETWEEN 1 AND 5),
    id_user INT NOT NULL,
    id_recipe INT NOT NULL,
    PRIMARY KEY (id_user, id_recipe),
    FOREIGN KEY (id_user) REFERENCES USER(id_user),
    FOREIGN KEY (id_recipe) REFERENCES RECIPE(id_recipe)
);
