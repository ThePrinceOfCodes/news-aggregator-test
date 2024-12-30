<?php

namespace App\Services;
use Symfony\Component\Panther\Panther;

class WebScrapperService
{
    public function scrapeGuardian(string $url)
{
    $image = '';
    $content = '';
    $client = Panther::start();

    $crawler = $client->request('GET', $url);

    $node = $crawler->filter('source.dcr-evn1e9')->first();

    if ($node->count() > 0) {
        $image = $node->attr('srcset');
    }

    $nodes = $crawler->filter('p.dcr-s3ycb2');

    if ($nodes->count() > 0) {
        $nodes->each(function ($node) use (&$content) {
            $content .= " " . $node->text(); 
        });
    }

    return [
        'image' => $image,
        'content' => $content, 
    ];
}
}