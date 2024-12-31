<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\News;
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
                    News::insertOrIgnore($chunk);  
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
    
}
