<?php
require 'vendor/autoload.php';
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Path;
use Symfony\Component\Yaml\Yaml;
use Symfony\Component\String\Slugger\AsciiSlugger;
use League\CommonMark\Environment\Environment as CmEnv;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\Extension\FrontMatter\FrontMatterExtension;
use League\CommonMark\Extension\GithubFlavoredMarkdownExtension;
use League\CommonMark\Extension\FrontMatter\Output\RenderedContentWithFrontMatter;
use League\CommonMark\MarkdownConverter;
use Twig\Environment as TwigEnv;
use Twig\Loader\FilesystemLoader;
use Twig\Extra\String\StringExtension;

$start = microtime(true);
$startMem = round(memory_get_usage()/1048576,2); 
echo "\n Memory Consumption is   ";
echo $startMem .''.' MB';

// Settings - could be user defined
$sourceRoot = ".";
$outputRoot = ".";
$staticDirs = ['assets'];
$staticFiles = ['CNAME','robots.txt','feed/pretty-feed-v3.xsl','feed/.htaccess'];
$sourceDirs = ['posts', 'pages', 'feed'];
$outputDir = '_site';
//ignores not needed because only processing folder in $sourceDirs
//$ignores = ['vendor'];
$templatesDir = __DIR__ . '/themes/default/templates';

if (isset($argv[1])) {
    $outputDir = $argv[1];
}

echo "\n outputdir: " . $outputDir;

// SETTING UP MarkDown converter
// Define your configuration, if needed
// Configure the Environment with all the CommonMark parsers/renderers
// Add the extensions
//$config = [];
$environment = new CmEnv(); //$config);
$environment->addExtension(new CommonMarkCoreExtension());
$environment->addExtension(new GithubFlavoredMarkdownExtension());
$environment->addExtension(new FrontMatterExtension());
$converter = new MarkdownConverter($environment);

// SETTING UP Twig 
$loader = new FilesystemLoader($templatesDir);
$twig = new TwigEnv($loader);
$twig->addExtension(new StringExtension());
$twig->addExtension(new \Twig\Extension\DebugExtension());

echo "\n\nSetup ready in " . (microtime(true) - $start) . " seconds";

//STATIC content - copy
foreach($staticDirs as $dir) {
    $src = $sourceRoot . '/' . $dir . '/';
    $dest = __DIR__ . '/' . $outputDir . '/' . $dir . '/';
    if(DIRECTORY_SEPARATOR == "/") {
        //Linux
        $dest = $outputRoot . '/' . $outputDir . '/' . $dir . '/';
    }
    $fileSystem = new Symfony\Component\Filesystem\Filesystem();
    $fileSystem->mirror($src, $dest);
}
foreach($staticFiles as $file) {
    $srcFile = $sourceRoot . '/' . $file;
    $destFile = $outputRoot . '/' . $outputDir . '/' . $file;

    //have to check if the destination folder exists before copying
    //if not, create it.
    $destPath = pathinfo($destFile);
    if (!file_exists($destPath['dirname'])) {
        mkdir($destPath['dirname']);
    }
    copy($srcFile, $destFile);
}
echo "\n\nStatic copied in " . (microtime(true) - $start) . " seconds";

/*
//JSON content - read
$metaJson = file_get_contents($sourceRoot. '/_data/metadata.json');
$metadata = json_decode($metaJson, true);
$menuJson = file_get_contents($sourceRoot . '/_data/menus.json');
$menus = json_decode($menuJson, true);
*/

//YAML content - read
$metadata = Yaml::parseFile($sourceRoot. '/_data/metadata.yaml');
$menus = Yaml::parseFile($sourceRoot. '/_data/menus.yaml');

$collections = [];
//MARKDOWN - read files in source directories
foreach($sourceDirs as $src) {
    $mergedJsonStrings = mergedJsonStrings($src,$sourceRoot);
    $collections[$src] = [];
    readMarkdownFiles($sourceRoot, $src, $outputDir, $converter, $mergedJsonStrings, $collections);
}
echo "\n\nMarkdown files read in " . (microtime(true) - $start) . " seconds";

//reorder the collections by date desc
foreach($collections as $key => $collection) {
    if($key != "tags") {
        array_multisort(array_map(function($element) {
            if(array_key_exists("date", $element)) {
                return $element['date'];
            }
            else {
                return 0;
            }
        }, $collection), SORT_DESC, $collection);     
        $collections[$key] = $collection;
    }
}

//reorder tag entries by date desc (collections.tags)
foreach($collections['tags'] as $key => $collection) {
    array_multisort(array_map(function($element) {
        return $element['date'];
    }, $collection), SORT_DESC, $collection);
    
    $collections['tags'][$key] = $collection;    
}

// then loop through each source collection to determine prev/next
foreach($collections as $key => $collection) {
    if($key != "tags") {
        //TODO determinePrevNext();
        $prevPagePermalink = "";
        $prevPageTitle = "";
        $nextPagePermalink = "";
        $nextPageTitle = "";
        $index = 0;

        $keys = array_keys($collection);
        $length = count($keys);
        foreach(array_keys($keys) AS $k ){
            $collection[$keys[$k]]["nextPagePermalink"] = $nextPagePermalink;
            $collection[$keys[$k]]["nextPageTitle"] = $nextPageTitle;
            $nextPagePermalink = $collection[$keys[$k]]["permalink"];
            $nextPageTitle = "";
            if (array_key_exists("title",$collection[$keys[$k]])){
                $nextPageTitle = $collection[$keys[$k]]["title"];
            }

            if($k+1 < $length) {
                $collection[$keys[$k]]["prevPagePermalink"] = $collection[$keys[$k+1]]["permalink"];
                $collection[$keys[$k]]["prevPageTitle"] = "";
                if (array_key_exists("title",$collection[$keys[$k+1]])){
                    $collection[$keys[$k]]["prevPageTitle"] = $collection[$keys[$k+1]]["title"];
                }
            }
        }
        $collections[$key] = $collection;
    }
}
echo "\n\nArray reordered in " . (microtime(true) - $start) . " seconds";

processMarkdown($outputRoot, $outputDir, $converter, $twig, $metadata, $menus, $collections);

//Output collections array to file on site for easier debuggin
echo "\n\nCollection outputted to: " . $outputRoot . "/" . $outputDir . "/collections.txt";
file_put_contents($outputRoot . '/' . $outputDir . '/collections.txt', print_r($collections, true));

echo "\n\nConversion completed in " . (microtime(true) - $start) . " seconds";

$endMem = round(memory_get_usage()/1048576,2); 
echo "\nMemory Consumption is   ";
echo $endMem .''.' MB';
echo "\nDifference: " . ($endMem - $startMem);

// https://stackoverflow.com/questions/251277/sorting-php-iterators
// get (recursively) files matching a pattern, each file as SplFileInfo object
function arrayFilterByExtension($a, $ext){
    return array_filter($a, function($obj) use ($ext) {
        return str_ends_with($obj->getFilename(),$ext);
    });
}

function sortByFolderDepth($a, $b) {
    if (substr_count($a->getRealPath(),DIRECTORY_SEPARATOR)  > substr_count($b->getRealPath(),DIRECTORY_SEPARATOR)) {
        return 1;
    } elseif (substr_count($a->getRealPath(),DIRECTORY_SEPARATOR) < substr_count($b->getRealPath(),DIRECTORY_SEPARATOR)) {
        return -1;
    }
    return 0;
}

function getFileContentFromIteratorArrayByType($iter, $ext){
    $result = arrayFilterByExtension($iter, '.' . $ext);
    //sort by slash count in path
    uasort($result, 'sortByFolderDepth');
    return $result;
}

function mergeJsonFilesAsStrings($jsonFiles){
    // loop through files array (SplFileInfo)
    // create basic JSON string array with path as the key
    $jsonStrings = [];
    foreach($jsonFiles as $file){
        $jsonStrings[$file->getPath()] = file_get_contents($file->getPathname());
    }

    //loop through json strings array
    //create merged array where merge lower level (closer to the root) json files into higher level (closer to the leaf) 
    $mergedJsonStrings = [];
    foreach($jsonStrings as $path => $curJson){
        $newJson = json_decode($curJson, true);
        //if there are previous entries in the merged array
        if($mergedJsonStrings) {
            //filter all previously processed paths which match the start of the currrent path
            $result = array_filter($mergedJsonStrings, function($key) use ($path) {
                return strpos($path, $key) === 0;
            }, ARRAY_FILTER_USE_KEY);
            //then pop off the last value and convert to json 
            $prevJson = json_decode(array_pop($result), true);
            $curJson = json_decode($curJson, true);
            //then replace the current string into previous string
            $newJson = array_replace_recursive($prevJson, $curJson);
        }
        $mergedJsonStrings[$path] = json_encode($newJson);
    }
    return $mergedJsonStrings;
}

function mergedJsonStrings($sourceDir, $sourceRoot) {
    $matches = new RegexIterator(
        new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($sourceRoot . '/' . $sourceDir)
        ),
        '/(\.json)$/i'
    );
    $files = iterator_to_array($matches);
    $jsonFiles = getFileContentFromIteratorArrayByType($files, 'json');
    return mergeJsonFilesAsStrings($jsonFiles);
}

function readMarkdownFiles($sourceRoot, $sourceDir, $outputDir, $converter, $mergedJsonStrings, &$completeCollection) {
    $sourceFullPath = $sourceRoot . '/' . $sourceDir . '/';
    $rdi = new RecursiveDirectoryIterator($sourceFullPath, RecursiveDirectoryIterator::SKIP_DOTS);
    $rii = new RecursiveIteratorIterator($rdi, RecursiveIteratorIterator::SELF_FIRST);

    $collection = [];
    foreach ($rii as $file) {
        // store all item info an array to return to the main function for later use
        if ($file->isFile() && $file->getExtension() === 'md') {
            //trying to get the path of the file from root folder (eg "archive/archive.md")
            //first get the real path of the of the file, then remove the real path of the sourceFullPath
            //this ends up with just the filename / path above the sourceDir eg just archive.md
            //so we add that back in again to get "archive/archive.md"
            $path = str_replace('\\','/',$sourceDir . str_replace(realpath($sourceFullPath),'',realpath($file->getPathname())));

            $markdownContent = file_get_contents(str_replace($sourceDir . '/', '', $sourceFullPath) . $path);
            
            $result = $converter->convert($markdownContent);

            $frontMatter = [];
            if ($result instanceof RenderedContentWithFrontMatter) {
                $frontMatter = $result->getFrontMatter();
            }
            
            $htmlContent = $result->getContent();
            $permalink = "";
            $template = 'base.html.twig';

            //get any json based config, if any
            if($mergedJsonStrings){
                //filter processed json strings which match the start of the currrent path
                $relativePath = $sourceRoot . '/' . $path;
                $result = array_filter($mergedJsonStrings, function($key) use ($relativePath) {
                            return strpos($relativePath, $key) === 0;
                }, ARRAY_FILTER_USE_KEY);
                //then pop off the last value and convert to object 
                $json = json_decode(array_pop($result), true);
                
                $frontMatter = array_merge($json,$frontMatter);
                //get any permalink path from the json info
                if(array_key_exists("permalink",$frontMatter)){
                    if (str_contains($frontMatter['permalink'],"page.fileSlug")) {
                        $permalink = str_replace(' ', '', $frontMatter["permalink"]);
                        $frontMatter["permalink"] = str_replace("{{page.fileSlug}}", $file->getBasename('.' . $file->getExtension()), $permalink);
                        $permalink =$frontMatter["permalink"];
                    }
                    else {
                        $permalink = $frontMatter["permalink"];
                    }
                } 
                else if (array_key_exists("permalink", $json)){
                    $permalink = str_replace(' ', '', $json["permalink"]);
                    $permalink = str_replace("{{page.fileSlug}}", $file->getBasename('.' . $file->getExtension()), $permalink);
                    $frontMatter["permalink"] = $permalink;
                }

                //merge any tags from json files into frontmatter
                if(array_key_exists('tags',$json)){
                    $tags = $json['tags'];
                    if(!is_array($tags)){
                        $tags = [$tags];
                    }
                    if(!is_array($frontMatter['tags'])){
                        $frontMatter['tags'] = [$frontMatter['tags']];
                    }
                    //add tags from json files
                    $frontMatter['tags'] = array_unique(array_merge($frontMatter['tags'], $tags));
                }
                
                //add extension to template filename
                if(array_key_exists('template',$frontMatter) && strlen($frontMatter['template']) > 0) {
                    $template = $frontMatter['template'];
                }
                else if(array_key_exists("template", $json)){
                    $template = $json["template"];
                }
                $frontMatter['template'] = $template;
            }
            else if(array_key_exists("permalink",$frontMatter)){
                if (str_contains($frontMatter['permalink'],"page.fileSlug")) {
                    $permalink = str_replace(' ', '', $frontMatter["permalink"]);
                    $frontMatter["permalink"] = str_replace("{{page.fileSlug}}", $file->getBasename('.' . $file->getExtension()), $permalink);
                    $permalink =$frontMatter["permalink"];
                }
                else {
                    $permalink = $frontMatter["permalink"];
                }
            } 
            $frontMatter['template'] = $frontMatter['template'] . '.html.twig';
            
            //page.url contains the URL as it should be from the path and filename
            //permalink is the actual URL of the page, taking into account any frontmatter settings
            $page = [];
            $relativePath = str_replace($sourceDir, '', $path);
            $pageUrl = '/' . $sourceDir . str_replace('.md', '', $relativePath) . '/';
            if(strlen($permalink) > 0){
                $pageUrl = $permalink;
            }
            $page['url'] = str_replace("\\", "/", $pageUrl);
            if(!array_key_exists("permalink",$frontMatter) || strlen($frontMatter['permalink'])){
                $frontMatter["permalink"] = $page['url'];
            }
            $frontMatter['inputPath'] = $path;

            //check title provided, if not add missing title
            if (!array_key_exists("title",$frontMatter)) {
                //if not, put date in the future so you spot it...
                $frontMatter['title'] = "[MISSING TITLE]";
            }

            //echo "\n";
            //echo $frontMatter['date'];
            /*
            ****************************
            ** NOT WORKING ON GITHUB
            ****************************/
            //check date is valid or no date set for posts
            //Note: getfrontmatter converts date strings to their int value automatically. So need to check for valid int
            //echo "\n";
            //echo $frontMatter['date'];
            if (!array_key_exists("date",$frontMatter)) {
                //if no date in the future so you spot it...
                //echo "\n";
                //echo "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<";
                $frontMatter['date'] = strtotime("9999-12-31 23:59:59");
            }
            else if (!is_int($frontMatter['date'])) {
                /******************************************************************************/
                //On github actions dates are returned as string
                //On my machine they are returned as ints, unless they enclosed in ""
                //So need to cope with both situations.
                //check if string can be converted to date
                //if not put the date in the future
                //echo "\n";
                //echo $frontMatter['date'];
                //echo "\n";
                //echo strtotime($frontMatter['date']);
                //echo "\n";
                //echo (date('Y-m-d H:i:s', strtotime($frontMatter['date'])));
                //echo "\n";
                //echo (date('Y-m-d H:i:s Z', strtotime($frontMatter['date'])));
                //2025-02-31 22:10:00 Z
                //1741039800
                //2025-03-03 22:10:00
                //2025-03-03 22:10:00 0
                // ! 
                // See this SO answer: https://stackoverflow.com/a/11029851
                // Should not have Z in the date. It should be 0

                // remove timzone from frontmatter date
                $thedate = substr($frontMatter['date'],0,19);
                //echo "\n";
                //echo "========================================================================";
                //echo "\n";
                //echo $frontMatter['title'];
                //echo "\n";
                //echo $thedate;
                //echo "\n";
                //echo "strtotime: " . strtotime($thedate);
                //echo "\n";
                //echo "converted to date string, NO timezone in pattern: " . date('Y-m-d H:i:s', strtotime($thedate));
                //echo "\n";
                //echo "converted to date string, timezone in pattern: " . date('Y-m-d H:i:s Z', strtotime($frontMatter['date']));
                //echo "\n";
                //echo "frontmatter date type: " . gettype($frontMatter['date']);
                //echo "\n";
                //echo (date('Y-m-d H:i:s', strtotime($frontMatter['date'])) == $frontMatter['date']);
                //echo "\n";
                //echo (date('Y-m-d H:i:s Z', strtotime($frontMatter['date'])) == $frontMatter['date']);
                //echo "\n";
                //echo gettype(date('Y-m-d H:i:s', strtotime($frontMatter['date'])));
                //echo "\n";
                //echo gettype((date('Y-m-d H:i:s', strtotime($frontMatter['date'])) == $frontMatter['date']));
                //echo "\n";
                //echo strval(((date('Y-m-d H:i:s', strtotime($frontMatter['date'])) == $frontMatter['date'])));
                //echo "\n";
                //echo gettype((date('Y-m-d H:i:s Z', strtotime($frontMatter['date'])) == $frontMatter['date']));
                //echo "\n";
                //echo strval(gettype((date('Y-m-d H:i:s Z', strtotime($frontMatter['date'])) == $frontMatter['date'])));
                //echo "\n";
                //echo "========================================================================";
                //echo "\n";
                //***********************************************************************************************************
                if (!(date('Y-m-d H:i:s', strtotime($thedate)) == $thedate)
                    && !(date('Y-m-d H:i:s Z', strtotime($thedate)) == $thedate)) {
                    //echo "\n";
                    //echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>";
                    $frontMatter['date'] = strtotime("9999-12-31 23:59:59");
                }
            }
            /****************************
            ****************************
            */
            
            $tmplVars = $frontMatter;
            $tmplVars['content'] = $htmlContent;

            $isDraft = false;
            if(array_key_exists('draft',$frontMatter)){
                if($frontMatter['draft'] == true) {
                    $isDraft = true;
                }
            }

            //only add to collection if not a draft
            if(!$isDraft) {
                //create a collection entry for each tag
                if(array_key_exists("tags", $frontMatter)){
                    foreach($frontMatter['tags'] as $tag){
                        //remove content element
                        $tagVars = $tmplVars;
                        unset($tagVars['content']); //don't need content in this collection
                        unset($tagVars['tags']); //don't need tags array in this collection
                        $completeCollection['tags'][$tag][$path] = $tagVars;
                    }
                }
                $completeCollection[$sourceDir][$path] = $tmplVars;
                $collection[$path] = $frontMatter;
            }
        }
    }
}

function renderTwig($twig, $outputRoot, $outputDir, $tmplVars){
    $outputPath =  $outputRoot . '/' . $outputDir . '/' . $tmplVars['permalink'];

    //if output path includes an extention (ie a ".") simply create it, don't create index.html in subfolder
    //deal with "." in folder names? 
    //    eg "/some.folder/" should be "/some.folder/index.html", 
    //    but "/sitemap.xml" should remain "/sitemap.xml"
    if(!strpos($outputPath,".", (is_null(strrpos($outputPath, "/"))?0:strrpos($outputPath, "/")))){
        $outputPath = $outputPath . 'index.html'; 
    }

    if (!is_dir(dirname($outputPath))) {
        mkdir(dirname($outputPath), 0777, true);
    }
    file_put_contents($outputPath, $twig->render($tmplVars["template"], $tmplVars));
}

function processPagination($twig, $outputRoot, $outputDir, $tmplVars, $completeCollection){
    $data = $tmplVars['pagination']['data'];
    $alias = 'posts';
    /* alias is a left over from eleventy enabling to target this collection of items 
             using a specific name for each collection in the templates
             You could then treat each collection differently in the templates
             It is not used in this engine.*/
    /*
    if($tmplVars['pagination']['alias'] && strlen($tmplVars['pagination']['alias']) > 0){
        $alias = $tmplVars['pagination']['alias'];
    }
    */
    $size = 0; //default to all on one page
    if(array_key_exists('size',$tmplVars['pagination']) && $tmplVars['pagination']['size'] && strlen($tmplVars['pagination']['size']) > 0){
        $size = $tmplVars['pagination']['size'];
    }
    $tmplVars['pagination']['total'] = count($completeCollection['tags'][$data]);

    //$size = 10; //testing
    if($size == 0 || $size > count($completeCollection['tags'][$data])){
        //no pages
        $tmplVars[$alias] = $completeCollection['tags'][$data];
        $tmplVars['pagination']['pages'] = 1;
        $tmplVars['pagination']['current'] = 1;

        renderTwig($twig, $outputRoot, $outputDir, $tmplVars);
    }
    else {
        // paging - need to slice up data into chunks and loop through it.
        // set $tmplVars[$alias] to the correct slice
        // set URL to include page number
        $chunks = array_chunk($completeCollection[$data], $size);
        $page = 1;
        $tmplVars['pagination']['pages'] = count($chunks);

        foreach($chunks as $chunk){
            $tmplVars[$alias] = $chunk;
            $realPermalink = $tmplVars["permalink"];  
            $tmplVars["permalink"] = $tmplVars["permalink"] . $page . "/";
            $tmplVars['pagination']['current'] = $page;

            renderTwig($twig, $outputRoot, $outputDir, $tmplVars);

            //reset permalink back to original, so don't get chaining of page numbers: /archive/1/2/3/
            $tmplVars["permalink"] = $realPermalink;
            $page++;
        }
    }
}

function processMarkdown($outputRoot, $outputDir, $converter, $twig, $metadata, $menus, $completeCollection) {
    //sort tags array by key
    ksort($completeCollection['tags'],SORT_NATURAL | SORT_FLAG_CASE);
    
    //var_dump($completeCollection);
    
    foreach($completeCollection as $srcKey => $src) {
        foreach($src as $key => $item) {

            //don't handle "tags" source as that is not a real source, and is handled through pagination
            if($srcKey != "tags") {
                $tmplVars = $item;
                $tmplVars['metadata'] =  $metadata; 
                $tmplVars['menus'] =  $menus; 
                $tmplVars['collections'] =  $completeCollection; 

                //check if there is pagination object and data object
                if(array_key_exists('pagination',$tmplVars) && array_key_exists('data',$tmplVars['pagination'])){
                    // for pages listing posts per tag need to loop through this section, eg if pagination data = "tags"???
                    $data = $tmplVars['pagination']['data'];
                    if($data == "tag") {
                        foreach($tmplVars['collections']['tags'] as $key => $collection) {
                            // Setting up Slugger
                            $slugger = new AsciiSlugger(); // you can type-hint SluggerInterface to get slugger as a service
                            $slug = $slugger->slug($key)->lower();                        

                            $tmplVars['template'] = 'tagged.html.twig';
                            $tmplVars['pagination']['data'] = $key;
                            $tmplVars['pagination']['size'] = 0;
                            $tmplVars['alias'] = $key;
                            $tmplVars['permalink'] = '/tagging/' . $slug . '/';
                            $tmplVars['content'] = "Posts for tag: " . $key;
                            processPagination($twig, $outputRoot, $outputDir, $tmplVars, $completeCollection);
                        }
                    }
                    else {
                        processPagination($twig, $outputRoot, $outputDir, $tmplVars, $completeCollection);
                    }
                }
                else {
                    renderTwig($twig, $outputRoot, $outputDir, $tmplVars);
                }
            }
        }
    }
}
?>