<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http; 
use App\Models\News;
use Illuminate\Support\Facades\DB;
use App\Models\Category;
use App\Services\NewsService;
use Illuminate\Support\Facades\Log; 



class FetchNewsData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fetch:newsdata';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch news data from multiple news APIs daily';


    protected $newsService;

    public function __construct(NewsService $newsService)
    {
        parent::__construct();
        $this->newsService = $newsService;
    }


    public function handle()
    {
        $this->info('Fetching news data...');

        try {
            $parsedNews = $this->newsService->fetchNewsDataForCategories();

            // dd($parcedNews);

            if (empty($parsedNews)) {
                $this->info('No news data fetched.');
                return;
            }

            $chunks = array_chunk($parsedNews, 1000);

            foreach ($chunks as $chunk) {
                if (empty($chunk)) {
                    continue;  // Skip if the chunk is empty
                }
                
                Log::debug('Inserting chunk', ['chunk' => $chunk]);

                try {
                    News::insert($chunk);  
                } catch (\Exception $e) {
                    Log::error('Error inserting chunk', [
                        'error' => $e->getMessage(),
                        'chunk' => $chunk
                    ]);
                }
            }
            

            $this->info('News data fetch completed.');
        } catch (\Exception $e) {
            $this->error('Error fetching news data: ' . $e->getMessage());
        }
    }
    
    /**
     * Execute the console command.
     */
    // public function handle()
    // {
    //     $this->info('Fetching news data...');

    //     $newsApisConfig = [
    //         // 'NewsAPI' => [
    //         //     'url' => env('NEWSAPI_URL'),
    //         //     'key' => env('NEWSAPI_KEY'),
    //         //     'isHyphenated' => false,
    //         //     'dataIndex' => 'articles'
    //         // ],
    //         // 'Guardian' => [
    //         //     'url' => env('GUARDIAN_URL'),
    //         //     'key' => env('GUARDIAN_KEY'),
    //         //     'isHyphenated' => true,
    //         //     'dataIndex' => 'results'

    //         // ],
    //         'NYTimes' => [
    //             'url' => env('NYTIMES_URL'),
    //             'key' => env('NYTIMES_KEY'),
    //             'isHyphenated' => true,
    //             'dataIndex' => 'response'
    //         ],
    //     ];

    //     $categories = Category::all();

    //     $parcedNews = [];

    //     // Loop through each API and fetch the news data
    //     foreach ($newsApisConfig as $key => $config) {
    //         $url = $config['url'];
    //         $apiKey = $config['key'];
    //         $isHyphenated = $config['isHyphenated'];
    //         $dataIndex = $config['dataIndex'];

    //         foreach($categories as $category){
    //             $newsData = $this->fetchNewsData($url, $category->name, $apiKey, $isHyphenated, $dataIndex);
    //             if ($newsData) {
    //                 switch ($url) {
    //                     case env('NEWSAPI_URL'):
    //                         foreach($newsData as $key => $news){
    //                             if (!empty($news['urlToImage']) && !empty($news['author']) && !empty($news['source']['name'])) {
    //                                 $parcedNews[] = [
    //                                     'url' => $news['url'],
    //                                     'image_url' => $news['urlToImage'],
    //                                     'source' => $news['url'],
    //                                     'category_id' => $category->id,
    //                                     'headline' => explode(',', $news['content'])[0],
    //                                     'content' => $news['content'],
    //                                     'title' => $news['title'],
    //                                     'author' => $news['author'],
    //                                     'pub_date' => $news['publishedAt'],
    //                                     'api_origin' => env('NEWSAPI_URL'),
    //                                     'created_at' => $this->getCurrentDateTime(),
    //                                     'updated_at' => $this->getCurrentDateTime(),
    //                                 ];
    //                             }
    //                         }
    //                         break;
    //                     case env('GUARDIAN_URL'):
    //                         foreach($newsData as $news){
    //                             dd($news);
    //                             if (!empty($news['image_url']) && !empty($news['author']) && !empty($news['source'])) {
    //                                 $parcedNews[] = [
    //                                     'url' => $news['url'],
    //                                     'image_url' => $news['image_url'],
    //                                     'source' => $news['source'],
    //                                     'category_id' => $category->id,
    //                                     'headline' => $news['headline'],
    //                                     'content' => $news['content'],
    //                                     'title' => $news['title'],
    //                                     'author' => $news['author'],
    //                                     'pub_date' => $news['webPublicationDate'],
    //                                     'api_origin' => $news['api_origin'],
    //                                     'created_at' => $this->getCurrentDateTime(),
    //                                     'updated_at' => $this->getCurrentDateTime(),
    //                                 ];
    //                             }
    //                         }
    //                         break;
    //                     case env('NYTIMES_URL'):
    //                         foreach($newsData['docs'] as $key => $news){
    //                             if(!empty($news['lead_paragraph']) && !empty($news['byline'])){
    //                                 $parcedNews[] = [
    //                                     'url' => $news['web_url'],
    //                                     'image_url' => null,
    //                                     'source' => $news['source'],
    //                                     'category_id' => $category->id,
    //                                     'headline' => $news['abstract'],
    //                                     'content' => $news['lead_paragraph'],
    //                                     'title' => $news['headline']['main'],
    //                                     'author' => preg_replace('/^By\s+/i', '', $news['byline']['original']),
    //                                     'pub_date' => $news['pub_date'],
    //                                     'api_origin' => env('NYTIMES_URL'),
    //                                     'created_at' => $this->getCurrentDateTime(),
    //                                     'updated_at' => $this->getCurrentDateTime(),
    //                                 ];
    //                             }
    //                         }
    //                         break;
                        
    //                     default:
    //                         # code...
    //                         break;
    //                 }
    //             }
            
    //         }
    //     }

    //     if(!$parcedNews){
    //         $this->info('no News data');
    //         return; 
    //     }
    //     News::insert($parcedNews);

    //     $this->info('News data fetch completed.');
    // }


    // private function fetchNewsData($url, $category, $apiKey, $isHyphenated = false, $dataIndex)
    // {
    //     try {
    //         $apiKeyParam = $isHyphenated ? 'api-key' : 'apiKey';

    //         $results = [];
    //         $page = 1;

    //         do {
    //             $response = Http::get($url, [
    //                 'q' => $category,
    //                 'page' => $page,
    //                 $apiKeyParam=>$apiKey
    //             ]);

    //             $data = $response->json();

    //             if (isset($data[$dataIndex])) {
    //                 $results = array_merge($results, $data[$dataIndex]);
    //             }
                
    //             $page++;
    //         } while (!empty($data[$dataIndex]));

    //         return ($results);
    //     } catch (\Exception $e) {
    //         $this->error("Error fetching data: " . $e->getMessage());
    //         return false;
    //     }
    // }
}
