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
    manufacturer_id int null,
    supplier_id int not null,
    project_id int not null,
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