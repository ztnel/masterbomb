-- Drop 'suppliers' table if exists
drop table if exists suppliers;

-- create 'suppliers' table
create table if not exists suppliers (
    id int not null primary key generated always as identity,
    name varchar(255) not null,
    website varchar(255) null,
    updatedAt timestamp null
);