<?php

namespace App\Services;

use GuzzleHttp\Client;
use Symfony\Component\DomCrawler\Crawler;

class WebScrapperService
{
    public function scrapeGuardian(string $url)
    {
        $image = '';
        $content = '';

        try {
            // Initialize the Guzzle HTTP client
            $client = new Client();

            // Make the GET request to the URL and get the response body
            $response = $client->get($url);
            $html = (string) $response->getBody();

            // Initialize the DomCrawler with the HTML content
            $crawler = new Crawler($html);

            // Scrape the <picture> tag with the class dcr-evn1e9
            $pictureNode = $crawler->filter('picture.dcr-evn1e9')->first();
            if ($pictureNode->count() > 0) {
                // Extract the first <source> tag within the <picture> tag and get the srcset attribute
                $firstSource = $pictureNode->filter('source')->first();
                if ($firstSource->count() > 0) {
                    // Get the srcset attribute value
                    $srcset = $firstSource->attr('srcset');
                    if (!empty($srcset)) {
                        // Use the first srcset link found
                        $image = $srcset;
                    }
                }
            }

            // Scrape the first three paragraphs using a specific class
            $nodes = $crawler->filter('p.dcr-s3ycb2');
            if ($nodes->count() > 0) {
                $nodes->slice(0, 3)->each(function ($node) use (&$content) {
                    $content .= " " . $node->text();
                });
            }

        } catch (\Exception $e) {
            // Handle exceptions and log the error
            error_log("Error scraping the Guardian: " . $e->getMessage());
            return [
                'image' => '',
                'content' => 'An error occurred while scraping content.',
            ];
        }

        // Return the scraped data
        return [
            'image' => $image,
            'content' => trim($content),
        ];
    }
}
