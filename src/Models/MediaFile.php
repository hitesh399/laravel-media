<?php

namespace Hitesh399\LaravelMedia\Models;

use Illuminate\Database\Eloquent\Model;

class MediaFile extends Model
{
    protected $fillable = ['location','title','description','file_type','size','image_dimension','parent_id','uploaded_by','is_used'];

    public function thumbs() {

    	return $this->hasMany( static::class, 'parent_id', 'id');
    }
}