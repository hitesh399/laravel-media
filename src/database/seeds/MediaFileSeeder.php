<?php

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use App\Models\MediaFile;
class MediaFileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = \Faker\Factory::create();



       	foreach (range(1,10) as $index ) {

            $img = $faker->imageUrl(1920, 1080);
            $content = file_get_contents($img);
            //Store in the filesystem.
            $location = date('Y/m').'/'.uniqid().'.png';
            $fp = fopen(public_path('storage/'.$location), "w");
            fwrite($fp, $content);
            fclose($fp);

            MediaFile::create([
				'location'=>$location,
	            'size'=>Storage::size($location),
                'title'=> $faker->realText(20),
	            'image_dimension'=>'1920x1080',
	            'file_type'=>'image/png',
	            'is_used'=>'No',
	            'description'=>$faker->realText(180),	            
			]);
        }
    }
}
