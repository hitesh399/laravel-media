<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMediaFileTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('media_files', function (Blueprint $table) {
            //
            $table->increments('id');            
            $table->string('location')->unique();
            $table->string('title')->default('');
            $table->string('description')->default('');
            $table->string('file_type')->default('');
            $table->unsignedDecimal('size',12,2)->default(0);
            $table->string('image_dimension')->default('');

            $table->unsignedInteger('parent_id')->nullable();
            $table->foreign('parent_id')
                    ->references('id')->on('media_files')
                    ->onDelete('cascade');

            $table->unsignedInteger('uploaded_by')->nullable();
            $table->foreign('uploaded_by')
                  ->references('id')->on('users')
                  ->onDelete('set null');

            $table->enum('is_used',['Yes','No'])->default('No');
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        
        Schema::drop('media_files');   
    }
}
