-- Drop existing tables with same name
drop table if exists suppliers;
drop table if exists projects;
drop table if exists manufacturers;
drop table if exists parts;


--- create 'parts' table
create table if not exists parts (
    id int not null primary key generated always as identity,
    name varchar(255) not null,
    unit_price decimal(10,2),
    description varchar(255) null,
    constraint fk_manufacturer
        foreign key(id)
            references manufacturers(id)
            on delete set null,
    constraint fk_suppliers
        foreign key(id)
            references suppliers(id)
            on delete set null,
    updated_at timestamp not null,
    created_at timestamp not null
);

-- create 'suppliers' table
create table if not exists suppliers (
    id int not null primary key generated always as identity,
    name varchar(255) not null,
    website varchar(255) null,
    updated_at timestamp not null,
    created_at timestamp not null
);

--- create 'projects' table
create table if not exists projects (
    id int not null primary key generated always as identity,
    name varchar(255) not null,
    description varchar(255) null,
    updated_at timestamp not null,
    created_at timestamp not null
);

--- create 'manufacturers' table
create table if not exists manufacturers (
    id int not null primary key generated always as identity,
    name varchar(255) not null,
    updated_at timestamp not null,
    created_at timestamp not null
);

--- create 'bom' table (for many to many parts and projects resolution)
create table if not exists bom (
    id int not null primary key generated always as identity,
    constraint fk_project
        foreign key(id)
            references projects(id)
            on delete cascade,
    created_at timestamp not null
);