<?php

use Phinx\Migration\AbstractMigration;

class InitialMigration extends AbstractMigration
{
    /**
     * Change Method.
     *
     * Write your reversible migrations using this method.
     *
     * More information on writing migrations is available here:
     * http://docs.phinx.org/en/latest/migrations.html#the-abstractmigration-class
     *
     * The following commands can be used in this method and Phinx will
     * automatically reverse them when rolling back:
     *
     *    createTable
     *    renameTable
     *    addColumn
     *    renameColumn
     *    addIndex
     *    addForeignKey
     *
     * Remember to call "create()" or "update()" and NOT "save()" when working
     * with the Table class.
     */
    public function change()
    {
        if(!$this->hasTable('Statistick')){
            $table = $this->table('Statistick');
            $table
                ->addColumn('IP', 'string', ['limit' => 30, 'null' => false])
                ->addColumn('DATE', 'datetime', ['null' => false])
                ->addColumn('SSID', 'string', ['limit' => 30, 'null'=>false])
                ->addColumn('COUNT', 'integer', ['null' => false])
                ->save();
        }
    }
}
