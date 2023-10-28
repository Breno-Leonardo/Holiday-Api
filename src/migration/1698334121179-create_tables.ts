import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1698334121179 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
    CREATE TABLE state
    (
     cod                    integer PRIMARY KEY,
     uf                     varchar(2) NOT NULL,
     name		            varchar(32) NOT NULL
    );
    
    CREATE TABLE county
    (
     cod 			    	integer PRIMARY KEY,
     name		            varchar(32) NOT NULL,
     state  	        integer NOT NULL REFERENCES state(cod) ON DELETE CASCADE ON UPDATE CASCADE
    );
    
    CREATE TABLE holiday
    (
     date 			    	varchar(64) NOT NULL,
     name		            varchar(255) NOT NULL,
     location  	        integer  NOT NULL,
     PRIMARY KEY(date,location)
    );

    
    

        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        drop table if exists holiday;
        drop table if exists state;
        drop table if exists county;
        `);
  }
}
