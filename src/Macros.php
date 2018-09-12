<?php 

namespace Hitesh399\LaravelMedia;

use Collective\Html\FormBuilder;

/**
 * Class Macros
 * @package App\Http
 */
class Macros extends FormBuilder {

    /**
     * @param $name
     * @param $labe;
     * @param null $selected
     * @param null javascrip List maker function name
     * @param null jvascript List lender function name
     * @param array $options
     */
    public function laravelMedia($name, $label='Browse', $data = null, $listPreview=null,  $renderList=null, $options = array())
    {
        $errors = $this->view->shared('errors');
        $options['name'] = $name;
        $listPreview = $listPreview ? $listPreview : 'undefined';
        $renderList = $renderList ? $renderList : 'undefined';
        $tag = isset($options['tag']) ? $options['tag'] : 'button';
        $tag_class = isset($options['tag_class']) ? $options['tag_class'] : 'browse';
        
        if(isset($options['tag'])){
            unset($options['tag']);
        }

        if(isset($options['tag_class'])){
            unset($options['tag_class']);
        }

        if($data instanceof \Illuminate\Database\Eloquent\Collection) {

            $data =  $data->toArray();
        }

        $formData = $errors->any() ? old($name, []) : $data;

        $render_script = '';
        $element_id = $name.'_elm';

        $script = '';
        
        if(is_array($formData) && !empty($formData)) {

            $render_script .= '$.LaravelMedia.files.'.$name.' = []; $.LaravelMedia.makeInputInstance("#'.$element_id.'", '.json_encode($options).', '.$listPreview.' , '.$renderList.');'. json_encode($formData).'.map(function (f) { $.LaravelMedia.files.'.$name.'.push(f); }); $.LaravelMedia.elms.'.$name.'.filePreview.render();';
            $script = '<script type="text/javascript">window.LaravelMediaAfterLoad = window.LaravelMediaAfterLoad ? window.LaravelMediaAfterLoad : {}; window.LaravelMediaAfterLoad.'.$name .'= function (){ '.$render_script.'}</script>';
        }        
        
        return '<'.$tag.' class="'.$tag_class.'" type="button" id="'.$element_id.'" onclick="return $.LaravelMedia.openModal(this, '.e(json_encode($options)).' , '.$listPreview.' , '.$renderList.');" type="button">'.$label.'</'.$tag.'>'.$script;
    }
}