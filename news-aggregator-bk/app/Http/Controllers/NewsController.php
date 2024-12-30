<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Services\NewsService;
use App\Http\Requests\FetchNewsHeadlinesRequest;



class NewsController extends Controller
{

    protected $newsService;

    public function __construct(NewsService $newsService)
    {
        $this->newsService = $newsService;
    }

    public function getNewsData()
    {
        $categories = Category::all();
    
        $distinctSourcesAndAuthors = News::select('source', 'author')->distinct()->get();
    
        $authors = $distinctSourcesAndAuthors->pluck('author')->unique()->values();
        $sources = $distinctSourcesAndAuthors->pluck('source')->unique()->values();
    
        return response()->json([
            'categories' => $categories,
            'authors' => $authors,
            'sources' => $sources,
        ]);
    }
    

    public function getNewsHeadlines(FetchNewsHeadlinesRequest $request)
    {
        $page = $request['page'] ?? 1;
        $perPage = $request['perPage'] ?? 20;
        $search = $request['search'] ?? null;
        $categoryFilter = $request['categoryFilter'] ?? null;
        $sourceFilter = $request['sourceFilter'] ?? null;
        $pubDateFilter = $request['pubDateFilter'] ?? null;

        $newsHeadlines = $this->newsService->fetchNewsHeadlines(
            $perPage,
            $page, 
            $search, 
            $categoryFilter, 
            $sourceFilter, 
            $pubDateFilter,
        );

        return response()->json($newsHeadlines);
    }

    public function getUsersNewsHeadlines(FetchNewsHeadlinesRequest $request)
    {
        $page = $request['page'] ?? 1;
        $perPage = $request['perPage'] ?? 20;
        $search = $request['search'] ?? null;
        $categoryFilter = $request['categoryFilter'] ?? null;
        $sourceFilter = $request['sourceFilter'] ?? null;
        $pubDateFilter = $request['pubDateFilter'] ?? null;

        $user = auth()->user();

        $user->load('preferences'); 

        $preferences = $user->preferences;

        $newsHeadlines = $this->newsService->fetchNewsHeadlines(
            $perPage,
            $page, 
            $search, 
            $categoryFilter, 
            $sourceFilter, 
            $pubDateFilter,
            $preferences
        );

        return response()->json($newsHeadlines);

    }

    public function getNewsById($id)
    {
        $news = News::with('category') 
                    ->findOrFail($id); 

        return response()->json($news);
    }
}
