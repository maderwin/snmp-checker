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
        $table = $this->table('stat');
        $table
            ->addColumn('ip', 'string', ['limit' => 30, 'null' => false])
            ->addColumn('date', 'datetime', ['null' => false])
            ->addColumn('ssid', 'string', ['limit' => 30, 'null'=>false])
            ->addColumn('count', 'integer', ['null' => false])
            ->save();
    }
}
