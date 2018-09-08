## How to install and configure the package
composer require hitesh399/laravel-media

## Add the provides into the config/app.php file
```
Collective\Html\HtmlServiceProvider::class,
Hitesh399\LaravelMedia\LaravelMediaServiceProvider::class,
``` 
## Add the alias into the config/app.php file
```
'Form' => Collective\Html\FormFacade::class,
'Html' => Illuminate\Support\Facades\Html::class,
```
## Execute the below-mentioned commands: (You also need to install the node and npm)
```
php artisan vendor:publish --tag=laravel-media
php artisan migrate
npm install
npm install --save-dev @fortawesome/fontawesome-free
```
## Add the below-line into the webpack.mix.js file.
```
require('./laravel.media.webpack.mix');
```
## To generate the script/css execute the below command
```
npm run dev
```
## Put the filesystem driver in .env file
```
FILESYSTEM_DRIVER=public
```
## Configure the config/filesystems.php
```
'public' => [
    'driver' => 'local',
    'root' => public_path('storage'),
    'url' => env('APP_URL').'/storage',
    'visibility' => 'public',
],
```
## Execute the below-mentioned command to creat the storage link
```
php artisan storage:link
```
## Add below-mentioned script in between the <head> tag
 ```
  <script type="text/javascript">
      window.site = {
        'site_url':'{!!url('/')!!}',
        'base_url':'{!!asset('/')!!}',
        'storage_url':'{!!Storage::url('/')!!}',
        'admin_url':'{!!url('/admin')!!}',
      };

</script>
 ```
 ## Include the jquery and bootstrap framework css/js files and also add the below-mentioned script file.
 ```
 <script type="text/javascript" src="{!!(asset(mix('assets/js/laravel.media.min.js')))!!}"></script>
 ```
 
 ## Create the Controller
 ```
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
 ```
 ## Add below-listed line in route file
 ```
Route::get('files-manager','FileController@index');
Route::match(['post','get'],'files-uploader','FileController@uploader');
Route::put('make-thumb','FileController@makeThumb');
Route::get('files-list','FileController@getList');
Route::post('test-media-form','FileController@test')->name('laravel.media_test');
 ```
## Add below-listed line in html file to quick build the form
 {!!Form::open(array('route' => 'laravel.media_test')) !!}
    {!!Form::text('username')!!}
    {!!Form::laravelMedia('image')!!}
    {!!Form::submit('Click Me!')!!}
{!!Form::close()!!}
