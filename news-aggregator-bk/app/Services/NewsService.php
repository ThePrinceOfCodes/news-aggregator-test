<?php
// app/Services/NewsService.php

namespace App\Services;

use App\Models\Category;
use App\Models\News;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log; 
use App\Services\WebScrapperService;
use Carbon\Carbon;
use Illuminate\Support\Str;

class NewsService
{
    protected $newsApisConfig;
    protected $webscrapper;

    public function __construct(WebScrapperService $webscrapperService)
    {
        $this->webscrapper = $webscrapperService;
        $this->newsApisConfig = [
            'NewsAPI' => [
                'url' => env('NEWSAPI_URL'),
                'key' => env('NEWSAPI_KEY'),
                'isHyphenated' => false,
                'dataIndex' => 'articles'
            ],
            'NYTimes' => [
                'url' => env('NYTIMES_URL'),
                'key' => env('NYTIMES_KEY'),
                'isHyphenated' => true,
                'dataIndex' => 'response'
            ],
            // 'Guardian' => [
            //     'url' => env('GUARDIAN_URL'),
            //     'key' => env('GUARDIAN_KEY'),
            //     'isHyphenated' => true,
            //     'dataIndex' => 'response'

            // ],
        ];
    }

    public function fetchNewsDataForCategories()
    {
        $categories = Category::all();
        $parcedNews = [];

        foreach ($this->newsApisConfig as $key => $config) {
            $url = $config['url'];
            $apiKey = $config['key'];
            $isHyphenated = $config['isHyphenated'];
            $dataIndex = $config['dataIndex'];

            foreach ($categories as $category) {
                $newsData = $this->fetchNewsData($url, $category->name, $apiKey, $isHyphenated, $dataIndex);

                if ($newsData) {
                    $parcedNews = array_merge($parcedNews, $this->processNewsData($newsData, $category, $url));
                }
            }
        }

        return $parcedNews;
    }

    private function getCurrentDateTime(){
        return now()->format('Y-m-d H:i:s');
    }

    private function fetchNewsData($url, $category, $apiKey, $isHyphenated = false, $dataIndex = 'results')
{
    try {
        $apiKeyParam = $isHyphenated ? 'api-key' : 'apiKey';

        $response = Http::timeout(10)->get($url, [
            'q' => $category,
            $apiKeyParam => $apiKey
        ]);

        if ($response->failed()) {
            throw new \Exception("Failed to fetch data from API.");
        }

        $data = $response->json();

        if (!isset($data[$dataIndex]) || !is_array($data[$dataIndex])) {
            dd($data[$dataIndex]);
            throw new \Exception("Unexpected API response structure.");
        }

        return $data[$dataIndex];
    } catch (\Exception $e) {
        Log::error("Error fetching news data: " . $e->getMessage(), [
            'url' => $url,
            'category' => $category,
            'apiKey' => $apiKey,
        ]);

        throw new \Exception("Error fetching data: " . $e->getMessage());
    }
}
    private function processNewsData($newsData, $category, $url)
    {
        $parcedNews = [];

        foreach ($newsData as $news) {
            switch ($url) {
                case env('NEWSAPI_URL'):
                    foreach($newsData as $key => $news){
                        if (!empty($news['urlToImage']) && !empty($news['author']) && !empty($news['source']['name'])) {
                            $parcedNews[] = [
                                'url' => $news['url'],
                                'image_url' => $news['urlToImage'],
                                'source' => $this->getNewsSourceFromUrl($news['url']),
                                'category_id' => $category->id,
                                'headline' => explode(',', $news['content'])[0],
                                'content' => $news['content'],
                                'title' => $news['title'],
                                'author' => $news['author'],
                                'pub_date' => $news['publishedAt'],
                                'api_origin' => env('NEWSAPI_URL'),
                                'created_at' => $this->getCurrentDateTime(),
                                'updated_at' => $this->getCurrentDateTime(),
                            ];
                        }
                    }
                    break;
                case env('GUARDIAN_URL'):
                    foreach($newsData['results'] as $news){
                        $data = $this->webscrapper->scrapeGuardian($news['webUrl']);
                        dd($data);
                        if (!empty($news['webTitle'])) {
                            $parcedNews[] = [
                                'url' => $news['webUrl'],
                                'image_url' => $data['image'],
                                'source' => 'others',
                                'category_id' => $category->id,
                                'headline' => $news['webTitle'],
                                'content' => $dat['content'],
                                'title' => $news['webTitle'],
                                'author' => 'no author',
                                'pub_date' => $news['webPublicationDate'],
                                'api_origin' => $news['apiUrl'],
                                'created_at' => $this->getCurrentDateTime(),
                                'updated_at' => $this->getCurrentDateTime(),
                            ];
                        }
                    }
                    break;
                case env('NYTIMES_URL'):
                    foreach($newsData['docs'] as $key => $news){
                        if(!empty($news['lead_paragraph']) && !empty($news['byline'])){
                            $parcedNews[] = [
                                'url' => $news['web_url'],
                                'image_url' => null,
                                'source' => $this->getNewsSourceFromUrl($news['source']),
                                'category_id' => $category->id,
                                'headline' => $news['abstract'],
                                'content' => $news['lead_paragraph'],
                                'title' => $news['headline']['main'],
                                'author' => preg_replace('/^By\s+/i', '', $news['byline']['original']),
                                'pub_date' => $news['pub_date'],
                                'api_origin' => env('NYTIMES_URL'),
                                'created_at' => $this->getCurrentDateTime(),
                                'updated_at' => $this->getCurrentDateTime(),
                            ];
                        }
                    }
                    break;
                
                default:
                    # code...
                    break;
            }
        }

        return $parcedNews;
    }

    public function fetchNewsHeadlines($perPage, $page, $search = null, $categoryFilter = null, $sourceFilter = null, $pubDateFilter = null, $preferences = false)
    {
        $page = $page ?? 20;
        
        $query = News::select('id', 'title', 'headline', 'image_url', 'pub_date', 'author')
            ->whereNotNull('image_url') 
            ->orderBy('created_at', 'desc');
        
        if ($preferences) {
            if (!empty($preferences->category)) {
                $query->whereIn('category_id', $preferences->category);
            }

            if (!empty($preferences->source)) {
                $query->whereIn('source', $preferences->source);
            }

            if (!empty($preferences->author)) {
                $query->whereIn('author', $preferences->author);
            }
        }

        if (!empty($categoryFilter)) {
            $query->where('category_id', $categoryFilter);  
        }

        if (!empty($sourceFilter)) {
            $query->where('source', $sourceFilter); 
        }

        if (!empty($pubDateFilter)) {
            $pubDateFilter = Carbon::parse($pubDateFilter)->toDateString();
            $query->whereDate('pub_date', '=', $pubDateFilter); 
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', '%' . $search . '%')
                ->orWhere('headline', 'LIKE', '%' . $search . '%');
            });
        }

        $newsHeadlines = $query->paginate($perPage, ['*'], 'page', $page);

        return $newsHeadlines;
    }

    public function getNewsSourceFromUrl(string $url)
    {
        $acceptedNewsSource = [
            'abcnews',
            'buzzfeed',
            'cnet',
            'digitaltrends',
            'finance',
            'foxnews',
            'github',
            'gizmodo',
            'newyorker',
            'tech',
            'theverge',
            'time',
            'vox',
            'wired',
            'yahoo',
            "businessinsider",
        ];
    
        $matches = array_filter($acceptedNewsSource, fn($entry) => Str::contains($url, $entry));
    
        return $matches ? reset($matches) : 'others';
    }
}
