# laravel-media

Update App.php

Collective\Html\HtmlServiceProvider::class,
Hitesh399\LaravelMedia\LaravelMediaServiceProvider::class,

'Form' => Collective\Html\FormFacade::class,
'Html' => Illuminate\Support\Facades\Html::class,


php artisan vendor:publish --tag=laravel-media
php artisan migrate
npm install
npm install --save-dev @fortawesome/fontawesome-free

Add bewlow line in webpack.mix.js
require('./laravel.media.webpack.mix');
npm run dev


Set app base url in .env file

add FILESYSTEM_DRIVER=public in .env file
Update the public driver root path in config/filesystems.php
'public' => [
    'driver' => 'local',
    'root' => public_path('storage'),
    'url' => env('APP_URL').'/storage',
    'visibility' => 'public',
],

php artisan storage:link

Add below script in between the head tag
<script type="text/javascript">
      window.site = {
        'site_url':'{!!url('/')!!}',
        'base_url':'{!!asset('/')!!}',
        'storage_url':'{!!Storage::url('/')!!}',
        'admin_url':'{!!url('/admin')!!}',
      };

</script>

include the jquery framework and bootstrap css/javascript files and also add the below script the after the jquery framework
<script type="text/javascript" src="{!!(asset(mix('assets/js/laravel.media.min.js')))!!}"></script>

Create the controller 

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;

class FileController extends Controller
{
	use \Hitesh399\LaravelMedia\Controllers\FileManager;
	public function test (Request $request) {

		$this->validate($request, [
            'test' => 'required'
        ]);
	}
	
}


Create route 

Route::get('files-manager','FileController@index');
Route::match(['post','get'],'files-uploader','FileController@uploader');
Route::put('make-thumb','FileController@makeThumb');
Route::get('files-list','FileController@getList');
Route::post('test-media-form','FileController@test')->name('laravel.media_test');


Use below mentioned code to use the laravel media 

 {!!Form::open(array('route' => 'laravel.media_test')) !!}
    {!!Form::text('username')!!}
    {!!Form::laravelMedia('image')!!}
    {!!Form::submit('Click Me!')!!}
{!!Form::close()!!}