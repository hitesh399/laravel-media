<?php

namespace Hitesh399\LaravelMedia\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Hitesh399\LaravelMedia\Lib\DragDropUpload;
use Hitesh399\LaravelMedia\Models\MediaFile;

Trait FileManager {
    //

    /**
    * This function uses to display the File manager page. 
    * @param Instance of Illuminate\Http\Request
    * @return Instance of View
    */

    public function index(Request $request)
    {
    	return view('vendor.LaravelMedia.file-manager-dragdrop');
    }

    /**
    * This function uses to upload the file in chunck
    * @param Instance of Illuminate\Http\Request
    * @return Instance of Response
    */

    public function uploader(Request $request)
    {
    	$uploader = new DragDropUpload();
    	return $uploader->doUpload($request);				 
    }

    public function makeThumb(Request $request) {
        
        $uploader = new DragDropUpload();
        return $uploader->cropAction($request);      
    }

    public function getList(Request $request) {

        $files = MediaFile::whereNull('parent_id')
                ->orderBy('id','desc')
                ->with('thumbs');
        $s = $request->get('s');

        if($s) {

            $files->where(function ($q) use($s) {
                $q->orWhere('title', 'LIKE', "%{$s}%");
                $q->orWhere('location', 'LIKE', "%{$s}%");
                $q->orWhere('description', 'LIKE', "%{$s}%");
                $q->orWhere('file_type', 'LIKE', "%{$s}%");
            });
        }

        return  $files->paginate();
    }    
}
